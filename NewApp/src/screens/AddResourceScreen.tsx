import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  BackHandler,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Link2, AlignLeft, Hash, ChevronDown, Share2, Check, X, Image as ImageIcon } from 'lucide-react-native';
import { lightColors, darkColors } from '../theme/colors';
import { typography, spacing, radius } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';
import { useResources } from '../context/ResourceContext';
import { useShareIntent } from '../context/ShareIntentContext';

const SOURCE_LOGO_MAP: Record<string, string> = {
  'TikTok': 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png',
  'GitHub': 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
  'YouTube': 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
  'LinkedIn': 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
  'Instagram': 'https://cdn-icons-png.flaticon.com/512/174/174855.png',
  'X (Twitter)': 'https://cdn-icons-png.flaticon.com/512/5968/5968958.png',
  'Reddit': 'https://cdn-icons-png.flaticon.com/512/1384/1384072.png',
  'Medium': 'https://cdn-icons-png.flaticon.com/512/5968/5968906.png',
  'StackOverflow': 'https://cdn-icons-png.flaticon.com/512/2111/2111628.png',
  'Web': 'https://cdn-icons-png.flaticon.com/512/1055/1055666.png',
};

export default function AddResourceScreen({ navigation }: any) {
  const themeContext = useTheme();
  const isDark = themeContext?.isDark ?? false;
  const theme = isDark ? darkColors : lightColors;
  const { addResource, updateResource } = useResources();
  const { sharedContent, isFromShare, clearSharedContent } = useShareIntent();
  const editResource = route?.params?.editResource;

  const [title, setTitle] = useState(editResource?.title || '');
  const [url, setUrl] = useState(editResource?.url || '');
  const [description, setDescription] = useState(editResource?.description || '');
  const [tags, setTags] = useState(editResource?.tags?.join(', ') || '');
  const [category, setCategory] = useState(editResource?.category || '');
  const [sourceLogo, setSourceLogo] = useState(editResource?.sourceLogo || '');
  const [detectedSource, setDetectedSource] = useState(editResource?.source || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(editResource?.image || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Update state if editResource changes (when navigating back from another tab)
  useEffect(() => {
    if (editResource) {
      setTitle(editResource.title || '');
      setUrl(editResource.url || '');
      setDescription(editResource.description || '');
      setTags(editResource.tags?.join(', ') || '');
      setCategory(editResource.category || '');
      setSourceLogo(editResource.sourceLogo || '');
      setDetectedSource(editResource.source || '');
      setThumbnailUrl(editResource.image || '');
    }
  }, [editResource]);

  // Auto-populate from shared content
  useEffect(() => {
    if (sharedContent && isFromShare) {
      if (sharedContent.url) setUrl(sharedContent.url);
      if (sharedContent.title) setTitle(sharedContent.title);
      if (sharedContent.source) setDetectedSource(sharedContent.source);
      if (sharedContent.sourceLogo) setSourceLogo(sharedContent.sourceLogo);
      
      // Try to extract thumbnail for YouTube
      if (sharedContent.url) {
        const ytThumb = extractYouTubeThumbnail(sharedContent.url);
        if (ytThumb) setThumbnailUrl(ytThumb);
      }
    }
  }, [sharedContent, isFromShare]);

  // Handle Android back button when from share
  useEffect(() => {
    if (isFromShare) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        handleCancel();
        return true;
      });
      return () => backHandler.remove();
    }
  }, [isFromShare]);

  const extractYouTubeThumbnail = (videoUrl: string): string | null => {
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = videoUrl.match(pattern);
      if (match) {
        return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
      }
    }
    return null;
  };

  const detectSource = (inputUrl: string): string => {
    const lower = inputUrl.toLowerCase();
    if (lower.includes('tiktok.com') || lower.includes('vm.tiktok.com')) return 'TikTok';
    if (lower.includes('github.com')) return 'GitHub';
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'YouTube';
    if (lower.includes('linkedin.com')) return 'LinkedIn';
    if (lower.includes('instagram.com')) return 'Instagram';
    if (lower.includes('twitter.com') || lower.includes('x.com')) return 'X (Twitter)';
    if (lower.includes('reddit.com')) return 'Reddit';
    if (lower.includes('medium.com')) return 'Medium';
    if (lower.includes('stackoverflow.com')) return 'StackOverflow';
    return 'Web';
  };

  const detectSourceLogo = (inputUrl: string): string => {
    const source = detectSource(inputUrl);
    return SOURCE_LOGO_MAP[source] || SOURCE_LOGO_MAP['Web'];
  };

  const handleUrlChange = (text: string) => {
    setUrl(text);
    if (text) {
      const src = detectSource(text);
      setDetectedSource(src);
      if (!sourceLogo || sourceLogo === SOURCE_LOGO_MAP['Web']) {
        setSourceLogo(detectSourceLogo(text));
      }
      // Auto-extract YouTube thumbnail
      const ytThumb = extractYouTubeThumbnail(text);
      if (ytThumb) setThumbnailUrl(ytThumb);
    }
  };

  const handleSave = () => {
    if (!title && !url) return;

    setSaving(true);

    if (editResource) {
      updateResource(editResource.id, {
        title: title || url,
        description,
        url,
        category: category || 'Web',
        tags: tags.split(',').map((t: string) => t.trim()).filter((t: string) => t),
        image: thumbnailUrl || undefined,
        source: detectedSource || detectSource(url),
        sourceLogo: sourceLogo || detectSourceLogo(url),
      });
    } else {
      const newResource = {
        id: Math.random().toString(36).substr(2, 9),
        title: title || url,
        description,
        url,
        category: category || 'Web',
        tags: tags.split(',').map((t: string) => t.trim()).filter((t: string) => t),
        type: 'article' as const,
        image: thumbnailUrl || undefined,
        createdAt: Date.now(),
        source: detectedSource || detectSource(url),
        sourceLogo: sourceLogo || detectSourceLogo(url),
      };
      addResource(newResource);
    }
    
    // Show success state
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      
      // If from share, close the app to return to the source app
      if (isFromShare) {
        setTimeout(() => {
          clearSharedContent();
          setSaved(false);
          resetForm();
          // On iOS, calling BackHandler.exitApp() or using the native module 
          // to minimize the app. For Expo, we just go back.
          BackHandler.exitApp();
        }, 1200);
      } else {
        setTimeout(() => {
          setSaved(false);
          resetForm();
          navigation.goBack();
        }, 800);
      }
    }, 600);
  };

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setDescription('');
    setTags('');
    setCategory('');
    setSourceLogo('');
    setDetectedSource('');
    setThumbnailUrl('');
  };

  const handleCancel = () => {
    clearSharedContent();
    if (!editResource) resetForm();
    if (isFromShare) {
      BackHandler.exitApp();
    } else {
      navigation.goBack();
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.outlineVariant,
      backgroundColor: theme.surface,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: {
      ...typography.h2,
      color: theme.textPrimary,
      marginBottom: 4,
    },
    headerSubtitle: {
      ...typography.bodyMd,
      color: theme.textSecondary,
    },
    shareIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary + '15',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginTop: 10,
      alignSelf: 'flex-start',
      gap: 6,
    },
    shareIndicatorText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.primary,
    },
    label: {
      ...typography.labelMd,
      color: theme.textPrimary,
      marginBottom: spacing.sm,
    },
    input: {
      backgroundColor: theme.surfaceContainer,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
      borderRadius: radius.sm,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
      color: theme.textPrimary,
    },
    inputWithIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceContainer,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
      borderRadius: radius.sm,
      paddingHorizontal: 14,
      gap: 10,
    },
    iconInput: {
      flex: 1,
      paddingVertical: 14,
      fontSize: 15,
      color: theme.textPrimary,
    },
    selectInput: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surfaceContainer,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
      borderRadius: radius.sm,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    selectText: {
      fontSize: 15,
      color: theme.textPrimary,
    },
    helperText: {
      ...typography.bodySm,
      color: theme.textTertiary,
      marginTop: 6,
    },
    cancelButton: {
      borderWidth: 1,
      borderColor: theme.outlineVariant,
      borderRadius: radius.sm,
      paddingVertical: 14,
      alignItems: 'center',
    },
    cancelButtonText: {
      ...typography.labelLg,
      color: theme.textSecondary,
    },
    detectedSourceCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceContainer,
      borderRadius: 16,
      padding: 14,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
      gap: 12,
    },
    detectedSourceLogo: {
      width: 36,
      height: 36,
      borderRadius: 10,
    },
    detectedSourceName: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    detectedSourceLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    thumbnailPreview: {
      width: '100%',
      height: 180,
      borderRadius: 16,
      marginBottom: spacing.lg,
      backgroundColor: theme.surfaceContainer,
    },
    successOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },
    successText: {
      color: '#FFFFFF',
      fontSize: 22,
      fontWeight: '800',
      marginTop: 16,
    },
    successSubtext: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 15,
      fontWeight: '500',
      marginTop: 6,
    },
  });

  // Show success overlay when saved
  if (saved) {
    return (
      <View style={dynamicStyles.successOverlay}>
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: 'rgba(255,255,255,0.2)',
          justifyContent: 'center', alignItems: 'center',
        }}>
          <Check color="#FFFFFF" size={40} strokeWidth={3} />
        </View>
        <Text style={dynamicStyles.successText}>Saved to Vault!</Text>
        <Text style={dynamicStyles.successSubtext}>
          {isFromShare ? 'Returning to your app...' : editResource ? 'Resource updated successfully' : 'Added to your library'}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={dynamicStyles.headerTitle}>
              {isFromShare ? 'Quick Save' : editResource ? 'Edit Resource' : 'Add Resource'}
            </Text>
            <Text style={dynamicStyles.headerSubtitle}>
              {isFromShare 
                ? 'Review and save this content to your vault.' 
                : editResource ? 'Update the details for this saved resource.' : 'Save a snippet or link to your vault.'}
            </Text>
          </View>
          {isFromShare && (
            <TouchableOpacity onPress={handleCancel} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X color={theme.textSecondary} size={24} />
            </TouchableOpacity>
          )}
        </View>
        {isFromShare && (
          <View style={dynamicStyles.shareIndicator}>
            <Share2 color={theme.primary} size={14} />
            <Text style={dynamicStyles.shareIndicatorText}>Shared from {detectedSource || 'another app'}</Text>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Detected Source Card */}
        {detectedSource ? (
          <View style={dynamicStyles.detectedSourceCard}>
            <Image 
              source={{ uri: sourceLogo || SOURCE_LOGO_MAP[detectedSource] || SOURCE_LOGO_MAP['Web'] }}
              style={dynamicStyles.detectedSourceLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={dynamicStyles.detectedSourceName}>{detectedSource}</Text>
              <Text style={dynamicStyles.detectedSourceLabel}>Auto-detected platform</Text>
            </View>
          </View>
        ) : null}

        {/* Thumbnail Preview */}
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            style={dynamicStyles.thumbnailPreview}
            resizeMode="cover"
          />
        ) : null}

        {/* URL input */}
        <View style={styles.inputGroup}>
          <Text style={dynamicStyles.label}>URL</Text>
          <View style={dynamicStyles.inputWithIcon}>
            <Link2 color={theme.textTertiary} size={18} />
            <TextInput
              style={dynamicStyles.iconInput}
              placeholder="https://example.com/article"
              placeholderTextColor={theme.textTertiary}
              value={url}
              onChangeText={handleUrlChange}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Title input */}
        <View style={styles.inputGroup}>
          <Text style={dynamicStyles.label}>Title</Text>
          <TextInput
            style={dynamicStyles.input}
            placeholder="e.g. React Server Components Guide"
            placeholderTextColor={theme.textTertiary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Thumbnail URL */}
        <View style={styles.inputGroup}>
          <Text style={dynamicStyles.label}>Cover Image URL (Optional)</Text>
          <View style={dynamicStyles.inputWithIcon}>
            <ImageIcon color={theme.textTertiary} size={18} />
            <TextInput
              style={dynamicStyles.iconInput}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor={theme.textTertiary}
              value={thumbnailUrl}
              onChangeText={setThumbnailUrl}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
          <Text style={dynamicStyles.helperText}>Auto-detected for YouTube videos</Text>
        </View>

        {/* Source Logo input */}
        <View style={styles.inputGroup}>
          <Text style={dynamicStyles.label}>Custom Source Logo URL (Optional)</Text>
          <View style={dynamicStyles.inputWithIcon}>
            <Link2 color={theme.textTertiary} size={18} />
            <TextInput
              style={dynamicStyles.iconInput}
              placeholder="https://example.com/logo.png"
              placeholderTextColor={theme.textTertiary}
              value={sourceLogo}
              onChangeText={setSourceLogo}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
          <Text style={dynamicStyles.helperText}>Leave blank to auto-detect from URL</Text>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={dynamicStyles.label}>Notes (Optional)</Text>
          <View style={[dynamicStyles.inputWithIcon, styles.textAreaContainer]}>
            <AlignLeft
              color={theme.textTertiary}
              size={18}
              style={{ marginTop: 2 }}
            />
            <TextInput
              style={[dynamicStyles.iconInput, styles.textArea]}
              placeholder="Why is this worth saving?"
              placeholderTextColor={theme.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Tags */}
        <View style={styles.inputGroup}>
          <Text style={dynamicStyles.label}>Tags</Text>
          <View style={dynamicStyles.inputWithIcon}>
            <Hash color={theme.textTertiary} size={18} />
            <TextInput
              style={dynamicStyles.iconInput}
              placeholder="react, frontend, tutorial"
              placeholderTextColor={theme.textTertiary}
              value={tags}
              onChangeText={setTags}
            />
          </View>
          <Text style={dynamicStyles.helperText}>Separate tags with commas</Text>
        </View>

        {/* Submit */}
        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={theme.onPrimary} />
          ) : (
            <Text style={[styles.submitButtonText, { color: theme.onPrimary }]}>
              {isFromShare ? 'Save & Return' : editResource ? 'Update Vault' : 'Save to Vault'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity style={dynamicStyles.cancelButton} onPress={handleCancel}>
          <Text style={dynamicStyles.cancelButtonText}>
            {isFromShare ? 'Discard & Return' : 'Cancel'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingTop: 14,
  },
  textArea: {
    minHeight: 90,
    paddingTop: 0,
  },
  submitButton: {
    borderRadius: radius.sm,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    ...typography.labelLg,
  },
});
