import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Share2,
  Heart,
  MoreHorizontal,
  Clock,
  Tag,
  Trash2,
  X,
  Edit2,
  ExternalLink,
} from 'lucide-react-native';
import { lightColors, darkColors } from '../theme/colors';
import { typography, spacing, radius } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { useResources } from '../context/ResourceContext';

export default function ResourceDetailScreen({ route, navigation }: any) {
  const { resource } = route.params;
  const themeContext = useTheme();
  const isDark = themeContext?.isDark ?? false;
  const theme = isDark ? darkColors : lightColors;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { removeResource } = useResources();
  const [isMoreMenuVisible, setIsMoreMenuVisible] = useState(false);

  const handleDelete = () => {
    setIsMoreMenuVisible(false);
    Alert.alert(
      'Delete Resource',
      'Are you sure you want to remove this from your vault?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            removeResource(resource.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.outlineVariant,
      backgroundColor: theme.surface,
    },
    title: {
      ...typography.h1,
      color: theme.textPrimary,
      marginBottom: spacing.md,
    },
    categoryChip: {
      backgroundColor: theme.primaryLight,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: radius.full,
    },
    bodyText: {
      ...typography.bodyLg,
      color: theme.textPrimary,
      marginBottom: spacing.lg,
      lineHeight: 28,
    },
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceContainer,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: radius.full,
      gap: 6,
    },
    tagText: {
      ...typography.labelSm,
      color: theme.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 40,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      gap: 12,
    },
    menuText: {
      ...typography.labelLg,
      color: theme.textPrimary,
    },
    deleteText: {
      ...typography.labelLg,
      color: theme.error,
    },
    relatedCard: {
      backgroundColor: theme.surfaceContainer,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: 8,
    },
    relatedCardTitle: {
      ...typography.labelMd,
      color: theme.textPrimary,
      marginBottom: 4,
    },
    relatedCardSub: {
      ...typography.bodySm,
      color: theme.textSecondary,
    },
    headerButton: {
      padding: 8,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 4,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: spacing.xxl,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
      gap: spacing.md,
    },
    categoryChipText: {
      fontSize: 10,
      fontWeight: '800',
      color: theme.primary,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    dateText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: spacing.xl,
    },
    codeBlock: {
      backgroundColor: '#0B1120',
      borderRadius: radius.md,
      marginBottom: spacing.lg,
      overflow: 'hidden',
    },
    codeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.08)',
      gap: 12,
    },
    codeDots: {
      flexDirection: 'row',
      gap: 6,
    },
    codeDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    codeLabel: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.4)',
      fontWeight: '500',
    },
    codeText: {
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: 13,
      lineHeight: 22,
      color: '#E2E8F0',
      padding: 16,
    },
    relatedSection: {
      marginTop: spacing.md,
    },
    relatedTitle: {
      fontWeight: '700',
      fontSize: 16,
      marginBottom: spacing.md,
      color: theme.textPrimary,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    openButton: {
      backgroundColor: theme.primary,
      borderRadius: radius.sm,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: spacing.xl,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    openButtonText: {
      ...typography.labelLg,
      color: theme.onPrimary,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity
          style={dynamicStyles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color={theme.textPrimary} size={22} />
        </TouchableOpacity>
        <View style={dynamicStyles.headerActions}>
          <TouchableOpacity style={dynamicStyles.headerButton}>
            <Share2 color={theme.textPrimary} size={20} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={dynamicStyles.headerButton}
            onPress={() => toggleFavorite(resource)}
          >
            <Heart 
              color={isFavorite(resource.id) ? theme.error : theme.textPrimary} 
              size={20} 
              fill={isFavorite(resource.id) ? theme.error : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={dynamicStyles.headerButton}
            onPress={() => setIsMoreMenuVisible(true)}
          >
            <MoreHorizontal color={theme.textPrimary} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={dynamicStyles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Meta info */}
        <View style={dynamicStyles.metaRow}>
          <View style={dynamicStyles.categoryChip}>
            <Text style={dynamicStyles.categoryChipText}>
              {(resource.category || 'Tutorials').toUpperCase()}
            </Text>
          </View>
          <View style={dynamicStyles.dateRow}>
            <Clock color={theme.textTertiary} size={14} />
            <Text style={dynamicStyles.dateText}>
              {resource.source || 'GitHub'} · 2 hours ago
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={dynamicStyles.title}>
          {resource.title}
        </Text>

        {/* Tags */}
        <View style={dynamicStyles.tagsContainer}>
          {resource.tags.map((tag: string) => (
            <View key={tag} style={dynamicStyles.tag}>
              <Tag color={theme.primary} size={12} />
              <Text style={dynamicStyles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Content */}
        <Text style={dynamicStyles.bodyText}>
          {resource.description}
        </Text>
        
        <Text style={dynamicStyles.bodyText}>
          This is a deep dive into {resource.title}. In this section, we explore the core concepts and 
          best practices for implementation. Whether you're a beginner or an expert, these insights 
          will help you optimize your workflow and achieve better results.
        </Text>

        {/* Code block if applicable */}
        {resource.type === 'snippet' && (
          <View style={dynamicStyles.codeBlock}>
            <View style={dynamicStyles.codeHeader}>
              <View style={dynamicStyles.codeDots}>
                <View style={[dynamicStyles.codeDot, { backgroundColor: '#EF4444' }]} />
                <View style={[dynamicStyles.codeDot, { backgroundColor: '#F59E0B' }]} />
                <View style={[dynamicStyles.codeDot, { backgroundColor: '#22C55E' }]} />
              </View>
              <Text style={dynamicStyles.codeLabel}>snippet.ts</Text>
            </View>
            <Text style={dynamicStyles.codeText}>
              {`const vault = new DevVault();\nvault.sync({\n  provider: 'GitHub',\n  mode: 'active',\n  interval: '5m'\n});`}
            </Text>
          </View>
        )}

        {/* Open Link Button */}
        {resource.url && (
          <TouchableOpacity 
            style={dynamicStyles.openButton}
            onPress={() => Linking.openURL(resource.url)}
          >
            <ExternalLink color={theme.onPrimary} size={20} />
            <Text style={dynamicStyles.openButtonText}>Open Link</Text>
          </TouchableOpacity>
        )}

        {/* Related resources */}
        <View style={dynamicStyles.relatedSection}>
          <Text style={dynamicStyles.relatedTitle}>Related Resources</Text>
          <TouchableOpacity style={dynamicStyles.relatedCard}>
            <Text style={dynamicStyles.relatedCardTitle}>
              Advanced State Management Patterns
            </Text>
            <Text style={dynamicStyles.relatedCardSub}>Tutorials · 1 day ago</Text>
          </TouchableOpacity>
          <TouchableOpacity style={dynamicStyles.relatedCard}>
            <Text style={dynamicStyles.relatedCardTitle}>
              Optimizing Native Performance
            </Text>
            <Text style={dynamicStyles.relatedCardSub}>Articles · 3 days ago</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* More Menu Modal */}
      <Modal
        visible={isMoreMenuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsMoreMenuVisible(false)}
      >
        <TouchableOpacity 
          style={dynamicStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsMoreMenuVisible(false)}
        >
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={[typography.h3, { color: theme.textPrimary }]}>Options</Text>
              <TouchableOpacity onPress={() => setIsMoreMenuVisible(false)}>
                <X color={theme.textSecondary} size={24} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={dynamicStyles.menuItem} onPress={handleDelete}>
              <View style={[dynamicStyles.iconBox, { backgroundColor: theme.errorLight }]}>
                <Trash2 color={theme.error} size={20} />
              </View>
              <Text style={dynamicStyles.deleteText}>Delete Resource</Text>
            </TouchableOpacity>

            <TouchableOpacity style={dynamicStyles.menuItem} onPress={() => {
              setIsMoreMenuVisible(false);
              navigation.navigate('Main', { screen: 'AddTab', params: { editResource: resource } });
            }}>
              <View style={[dynamicStyles.iconBox, { backgroundColor: theme.surfaceContainer }]}>
                <Edit2 color={theme.textPrimary} size={20} />
              </View>
              <Text style={dynamicStyles.menuText}>Edit Resource</Text>
            </TouchableOpacity>

            <TouchableOpacity style={dynamicStyles.menuItem} onPress={() => setIsMoreMenuVisible(false)}>
              <View style={[dynamicStyles.iconBox, { backgroundColor: theme.surfaceContainer }]}>
                <Share2 color={theme.textPrimary} size={20} />
              </View>
              <Text style={dynamicStyles.menuText}>Share Resource</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
