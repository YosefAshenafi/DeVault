import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, Code, Monitor, FileText, Newspaper, Tag } from 'lucide-react-native';
import { useFavorites, Resource } from '../context/FavoritesContext';
import { useResources } from '../context/ResourceContext';
import { lightColors, darkColors } from '../theme/colors';
import { typography, spacing, radius } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';

const LOGO_MAP: Record<string, string> = {
  'TikTok': 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png',
  'GitHub': 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
  'YouTube': 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
  'LinkedIn': 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
  'Web': 'https://cdn-icons-png.flaticon.com/512/1055/1055666.png',
  'Articles': 'https://cdn-icons-png.flaticon.com/512/1055/1055666.png',
  'Code Snippets': 'https://cdn-icons-png.flaticon.com/512/1150/1150626.png',
};

export default function SourceResourcesScreen({ route, navigation }: any) {
  const { sourceName, color } = route.params;
  const themeContext = useTheme();
  const isDark = themeContext?.isDark ?? false;
  const theme = isDark ? darkColors : lightColors;
  const { resources } = useResources();
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredResources = useMemo(() => {
    return resources.filter(r => 
      r.source === sourceName || (sourceName === 'Articles' && r.type === 'article') || (sourceName === 'Code Snippets' && r.type === 'snippet')
    );
  }, [resources, sourceName]);

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.outlineVariant,
      backgroundColor: theme.surface,
    },
    headerTitle: {
      ...typography.h3,
      color: theme.textPrimary,
      marginLeft: 10,
    },
    headerLogo: {
      width: 28,
      height: 28,
      marginLeft: 12,
    },
    sourceLogoBadge: {
      position: 'absolute',
      bottom: -4,
      right: -4,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.surface,
    },
    sourceLogoBadgeImage: {
      width: 14,
      height: 14,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
      overflow: 'hidden',
    },
    cardContent: {
      flexDirection: 'row',
      padding: 12,
    },
    thumbContainer: {
      width: 80,
      height: 80,
      borderRadius: 12,
      overflow: 'hidden',
      marginRight: 12,
    },
    thumbImage: {
      width: '100%',
      height: '100%',
    },
    fallbackThumb: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.surfaceContainer,
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    resourceTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    resourceDesc: {
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    tagBadge: {
      backgroundColor: theme.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      marginRight: 6,
      marginTop: 8,
    },
    tagText: {
      fontSize: 10,
      color: theme.primary,
      fontWeight: '700',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyTitle: {
      ...typography.h3,
      color: theme.textPrimary,
      marginTop: 16,
    },
    emptySubtitle: {
      ...typography.bodyMd,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 8,
    },
  });

  const renderResource = ({ item }: { item: Resource }) => (
    <TouchableOpacity 
      style={dynamicStyles.card}
      onPress={() => navigation.navigate('ResourceDetail', { resource: item })}
    >
      <View style={dynamicStyles.cardContent}>
        <View style={dynamicStyles.thumbContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={dynamicStyles.thumbImage} />
          ) : (
            <View style={dynamicStyles.fallbackThumb}>
              {item.type === 'repo' ? <Code color={theme.primary} size={24} /> : <FileText color={theme.primary} size={24} />}
            </View>
          )}
          <View style={dynamicStyles.sourceLogoBadge}>
            <Image 
              source={{ uri: item.sourceLogo || LOGO_MAP[item.source || 'Web'] || LOGO_MAP['Web'] }} 
              style={[dynamicStyles.sourceLogoBadgeImage, item.source === 'GitHub' && isDark && { tintColor: '#FFFFFF' }]} 
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={dynamicStyles.infoContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 10, fontWeight: '900', color: color || theme.primary, textTransform: 'uppercase' }}>
              {item.source}
            </Text>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <Heart 
                color={isFavorite(item.id) ? '#EF4444' : theme.textTertiary} 
                size={16} 
                fill={isFavorite(item.id) ? '#EF4444' : 'transparent'} 
              />
            </TouchableOpacity>
          </View>
          <Text style={dynamicStyles.resourceTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={dynamicStyles.resourceDesc} numberOfLines={2}>{item.description}</Text>
          <View style={{ flexDirection: 'row' }}>
            {item.tags.slice(0, 2).map(tag => (
              <View key={tag} style={dynamicStyles.tagBadge}>
                <Text style={dynamicStyles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={theme.textPrimary} size={24} />
        </TouchableOpacity>
        <Image 
          source={{ uri: LOGO_MAP[sourceName] || LOGO_MAP['Web'] }} 
          style={[dynamicStyles.headerLogo, sourceName === 'GitHub' && isDark && { tintColor: '#FFFFFF' }]} 
          resizeMode="contain"
        />
        <Text style={dynamicStyles.headerTitle}>{sourceName}</Text>
      </View>

      {filteredResources.length > 0 ? (
        <FlatList
          data={filteredResources}
          renderItem={renderResource}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={dynamicStyles.emptyContainer}>
          <Monitor color={theme.outline} size={64} strokeWidth={1} />
          <Text style={dynamicStyles.emptyTitle}>Empty Source</Text>
          <Text style={dynamicStyles.emptySubtitle}>
            You haven't saved any resources from {sourceName} yet.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
