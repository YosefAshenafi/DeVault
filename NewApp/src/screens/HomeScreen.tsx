import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Layout,
  Search,
  Monitor,
  FileText,
  Code,
  Heart,
  SlidersHorizontal,
  Check,
  SortAsc,
  SortDesc,
  Clock,
  Video,
  Globe,
  Tag,
  Link as LinkIcon,
  Play,
} from 'lucide-react-native';
import { lightColors, darkColors } from '../theme/colors';
import { useFavorites, Resource } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { useResources } from '../context/ResourceContext';
import { typography, spacing, radius } from '../theme/typography';

const LOGO_MAP: Record<string, string> = {
  'TikTok': 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png',
  'GitHub': 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
  'YouTube': 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
  'LinkedIn': 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
  'Web': 'https://cdn-icons-png.flaticon.com/512/1055/1055666.png',
  'Articles': 'https://cdn-icons-png.flaticon.com/512/1055/1055666.png',
  'Code Snippets': 'https://cdn-icons-png.flaticon.com/512/1150/1150626.png',
};

const { width } = Dimensions.get('window');

type SortOption = 'date-newest' | 'date-oldest' | 'name-asc' | 'name-desc' | 'tag';

const SORT_ITEMS = [
  { id: 'date-newest', label: 'Date: Newest First', icon: Clock },
  { id: 'date-oldest', label: 'Date: Oldest First', icon: Clock },
  { id: 'name-asc', label: 'Name: A to Z', icon: SortAsc },
  { id: 'name-desc', label: 'Name: Z to A', icon: SortDesc },
  { id: 'tag', label: 'Group by Tags', icon: Tag },
];

const SOURCES = ['All', 'TikTok', 'YouTube', 'GitHub', 'LinkedIn', 'Articles'];

export default function HomeScreen({ navigation }: any) {
  const themeContext = useTheme();
  const isDark = themeContext?.isDark ?? false;
  const theme = isDark ? darkColors : lightColors;
  const { toggleFavorite, isFavorite } = useFavorites();
  const { resources } = useResources();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('tag'); 
  const [selectedSource, setSelectedSource] = useState('All');
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  const filteredResources = useMemo(() => {
    let result = resources.filter(r => 
      (r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (selectedSource === 'All' || r.source === selectedSource || (selectedSource === 'Articles' && r.type === 'article'))
    );

    if (sortBy === 'date-newest') result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    else if (sortBy === 'date-oldest') result.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    else if (sortBy === 'name-asc') result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    else if (sortBy === 'name-desc') result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    
    return result;
  }, [resources, searchQuery, sortBy, selectedSource]);

  const groupedResources = useMemo(() => {
    if (sortBy !== 'tag') return { 'Filtered Resources': filteredResources };
    
    const groups: { [key: string]: Resource[] } = {};
    filteredResources.forEach(r => {
      const group = r.tags.length > 0 ? r.tags[0] : 'Uncategorized';
      if (!groups[group]) groups[group] = [];
      groups[group].push(r);
    });
    return groups;
  }, [filteredResources, sortBy]);

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: theme.textPrimary,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: 13,
      marginTop: 2,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 16,
      paddingHorizontal: 12,
      height: 50,
      flex: 1,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: theme.textPrimary,
    },
    filterIcon: {
      backgroundColor: theme.surface,
      width: 50,
      height: 50,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.outlineVariant,
      marginLeft: 12,
    },
    sourceLogoMini: {
      width: 14,
      height: 14,
      borderRadius: 4,
    },
    sourceLogoBadge: {
      position: 'absolute',
      bottom: -4,
      right: -4,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.surface,
    },
    sourceLogoBadgeImage: {
      width: 12,
      height: 12,
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      marginRight: 8,
      borderWidth: 1,
    },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      marginRight: 8,
      borderWidth: 1,
    },
    chipText: {
      fontSize: 14,
      fontWeight: '600',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.textPrimary,
    },
    recentCard: {
      width: width * 0.75,
      height: 180,
      borderRadius: 24,
      marginRight: 16,
      overflow: 'hidden',
    },
    recentOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding: 20,
      justifyContent: 'flex-end',
    },
    recentTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: '#FFFFFF',
      lineHeight: 24,
    },
    vaultItem: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      padding: 12,
      borderRadius: 20,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
      width: '100%',
    },
    groupName: {
      fontSize: 11,
      fontWeight: '900',
      letterSpacing: 1.2,
      color: theme.textSecondary,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    cardDesc: {
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    sourceLabel: {
      fontSize: 10,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: theme.primary,
    },
    modalContent: {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      padding: 24,
      paddingBottom: 50,
      backgroundColor: theme.surface,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.textPrimary,
    },
    sortLabel: {
      fontSize: 16,
      fontWeight: '600',
    },
    fallbackRecent: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.surfaceContainer,
    },
    fallbackThumb: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.surfaceContainer,
    },
    tagIconWrapper: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.primaryLight,
    }
  });

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Editorial Header */}
        <View style={styles.header}>
          <View>
            <Text style={dynamicStyles.headerTitle}>DevVault</Text>
            <Text style={dynamicStyles.headerSubtitle}>Curating your knowledge</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?u=yosef' }} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>

        {/* Search & Filter Section */}
        <View style={styles.searchContainer}>
          <View style={dynamicStyles.searchBar}>
            <Search color={theme.textTertiary} size={20} />
            <TextInput 
              placeholder="Search library..." 
              placeholderTextColor={theme.textTertiary}
              style={dynamicStyles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={dynamicStyles.filterIcon}
            onPress={() => setIsSortModalVisible(true)}
          >
            <SlidersHorizontal color={theme.primary} size={20} />
          </TouchableOpacity>
        </View>

        {/* Source Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {SOURCES.map(source => (
            <TouchableOpacity 
              key={source}
              onPress={() => setSelectedSource(source)}
              style={[
                dynamicStyles.chip,
                { 
                  backgroundColor: selectedSource === source ? theme.primary : theme.surface,
                  borderColor: selectedSource === source ? theme.primary : theme.outlineVariant
                }
              ]}
            >
              <Text style={[
                dynamicStyles.chipText,
                { color: selectedSource === source ? theme.onPrimary : theme.textSecondary }
              ]}>
                {source}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured / Recent Section */}
        {!searchQuery && selectedSource === 'All' && (
          <View style={styles.spotlightSection}>
            <View style={styles.sectionHeader}>
              <Text style={dynamicStyles.sectionTitle}>Recently Captured</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentSavesList}
            >
              {resources.slice(0, 3).map(resource => (
                <TouchableOpacity 
                  key={resource.id} 
                  style={dynamicStyles.recentCard}
                  onPress={() => navigation.navigate('ResourceDetail', { resource })}
                >
                  {resource.image ? (
                    <Image source={{ uri: resource.image }} style={StyleSheet.absoluteFill} />
                  ) : (
                    <View style={dynamicStyles.fallbackRecent}>
                      <Video color={theme.primary} size={40} />
                    </View>
                  )}
                  <View style={dynamicStyles.recentOverlay}>
                    <View style={styles.sourceTag}>
                      <Text style={styles.sourceTagText}>{resource.source?.toUpperCase()}</Text>
                    </View>
                    <Text style={dynamicStyles.recentTitle} numberOfLines={2}>
                      {resource.title}
                    </Text>
                    <View style={styles.playOverlay}>
                      <Clock color="#fff" size={14} />
                      <Text style={recentStyles.timeAgo}>Just now</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Grouped Vault Items */}
        <View style={styles.vaultSection}>
          <View style={styles.sectionHeader}>
            <Text style={dynamicStyles.sectionTitle}>Vault Library</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CollectionsTab')}>
              <Text style={styles.viewAllText}>Manage</Text>
            </TouchableOpacity>
          </View>

          {Object.entries(groupedResources).map(([groupName, groupItems]) => (
            <View key={groupName} style={styles.groupContainer}>
              <View style={styles.groupHeader}>
                <View style={dynamicStyles.tagIconWrapper}>
                  <Tag color={theme.primary} size={14} />
                </View>
                <Text style={dynamicStyles.groupName}>{groupName.toUpperCase()}</Text>
              </View>

              {groupItems.map(resource => (
                <TouchableOpacity 
                  key={resource.id} 
                  style={dynamicStyles.vaultItem}
                  onPress={() => navigation.navigate('ResourceDetail', { resource })}
                >
                  <View style={styles.cardThumbContainer}>
                    {resource.image ? (
                      <Image source={{ uri: resource.image }} style={styles.thumbImage} />
                    ) : (
                      <View style={dynamicStyles.fallbackThumb}>
                        {resource.type === 'repo' ? <Code color={theme.primary} size={24} /> : <FileText color={theme.primary} size={24} />}
                      </View>
                    )}
                    <View style={dynamicStyles.sourceLogoBadge}>
                      <Image 
                        source={{ uri: resource.sourceLogo || LOGO_MAP[resource.source || 'Web'] || LOGO_MAP['Web'] }} 
                        style={[dynamicStyles.sourceLogoBadgeImage, resource.source === 'GitHub' && isDark && { tintColor: '#FFFFFF' }]} 
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                  <View style={styles.cardInfo}>
                    <View style={styles.cardTopRow}>
                      <Text style={dynamicStyles.sourceLabel}>{resource.source}</Text>
                      <TouchableOpacity 
                        onPress={() => toggleFavorite(resource)}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                      >
                        <Heart 
                          color={isFavorite(resource.id) ? '#EF4444' : theme.textTertiary} 
                          size={16} 
                          fill={isFavorite(resource.id) ? '#EF4444' : 'transparent'} 
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={dynamicStyles.cardTitle} numberOfLines={1}>{resource.title}</Text>
                    <Text style={dynamicStyles.cardDesc} numberOfLines={2}>{resource.description}</Text>
                    <View style={[styles.cardTags, { marginTop: 8 }]}>
                      {resource.tags.slice(0, 3).map(tag => (
                        <View key={tag} style={styles.tagBadge}>
                          <Text style={styles.tagBadgeText}>#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sort Modal */}
      <Modal
        visible={isSortModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsSortModalVisible(false)}
        >
          <View style={dynamicStyles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Sort & Filter</Text>
              <TouchableOpacity onPress={() => setIsSortModalVisible(false)}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
            {SORT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.sortOption}
                  onPress={() => {
                    setSortBy(item.id as any);
                    setIsSortModalVisible(false);
                  }}
                >
                  <View style={styles.sortOptionLeft}>
                    <Icon color={sortBy === item.id ? theme.primary : theme.textTertiary} size={20} />
                    <Text style={[dynamicStyles.sortLabel, { color: sortBy === item.id ? theme.primary : theme.textPrimary }]}>
                      {item.label}
                    </Text>
                  </View>
                  {sortBy === item.id && <Check color={theme.primary} size={18} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const recentStyles = StyleSheet.create({
  timeAgo: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
    marginLeft: 4,
  }
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  chipsContainer: {
    paddingHorizontal: 12,
    marginBottom: 30,
  },
  spotlightSection: {
    marginBottom: 35,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0085ff',
  },
  recentSavesList: {
    paddingHorizontal: 12,
  },
  sourceTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  sourceTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  playOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  vaultSection: {
    paddingHorizontal: 12,
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardThumbContainer: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 14,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    flex: 1,
    paddingRight: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardTags: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: 'rgba(0,133,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 10,
    color: '#0085ff',
    fontWeight: '700',
  },
  hitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0085ff',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  sortOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
