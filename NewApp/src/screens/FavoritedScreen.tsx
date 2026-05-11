import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Code, Monitor, FileText, Newspaper } from 'lucide-react-native';
import { useFavorites, Resource } from '../context/FavoritesContext';
import { lightColors, darkColors } from '../theme/colors';
import { typography, spacing, radius } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';

export default function FavoritedScreen({ navigation }: any) {
  const themeContext = useTheme();
  const isDark = themeContext?.isDark ?? false;
  const theme = isDark ? darkColors : lightColors;
  const { favorites, toggleFavorite } = useFavorites();

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
      overflow: 'hidden',
    },
    titleText: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 2,
    },
    descText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
      marginTop: 20,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });

  const renderItem = ({ item }: { item: Resource }) => (
    <TouchableOpacity
      style={dynamicStyles.card}
      onPress={() => navigation.navigate('ResourceDetail', { resource: item })}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardThumb}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.thumbImage} />
          ) : (
            <View style={[styles.placeholderThumb, { backgroundColor: item.type === 'note' ? theme.primaryLight : '#1E293B' }]}>
              {item.type === 'tutorial' && <Monitor color="#fff" size={24} />}
              {item.type === 'repo' && <Code color="#fff" size={24} />}
              {item.type === 'note' && <FileText color={theme.primary} size={24} />}
              {item.type === 'article' && <Newspaper color={theme.primary} size={24} />}
            </View>
          )}
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.categoryText, { color: theme.primary }]}>{item.category.toUpperCase()}</Text>
          <Text style={dynamicStyles.titleText} numberOfLines={1}>{item.title}</Text>
          <Text style={dynamicStyles.descText} numberOfLines={1}>{item.description}</Text>
        </View>
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleFavorite(item)}
        >
          <Heart color={theme.error} size={20} fill={theme.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={dynamicStyles.headerTitle}>Favorited</Text>
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Heart color={theme.outline} size={64} strokeWidth={1} />
          <Text style={dynamicStyles.emptyTitle}>No Favorites Yet</Text>
          <Text style={dynamicStyles.emptySubtitle}>
            Resources you love will appear here.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  listContent: {
    padding: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  cardThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 12,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  placeholderThumb: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2,
  },
  heartButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
});
