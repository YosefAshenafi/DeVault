import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Platform,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronRight, 
  Search,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  Type,
  X,
} from 'lucide-react-native';
import { typography, spacing, radius } from '../theme/typography';
import { lightColors, darkColors } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { useResources } from '../context/ResourceContext';

const SOURCE_CONFIG = [
  { name: 'TikTok', color: '#FE2C55', logo: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' },
  { name: 'GitHub', color: '#181717', logo: 'https://cdn-icons-png.flaticon.com/512/25/25231.png' },
  { name: 'YouTube', color: '#FF0000', logo: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' },
  { name: 'LinkedIn', color: '#0A66C2', logo: 'https://cdn-icons-png.flaticon.com/512/174/174857.png' },
  { name: 'Articles', color: '#3B82F6', logo: 'https://cdn-icons-png.flaticon.com/512/1055/1055666.png' },
  { name: 'Code Snippets', color: '#10B981', logo: 'https://cdn-icons-png.flaticon.com/512/1150/1150626.png' },
];

export default function CollectionsScreen({ navigation }: any) {
  const themeContext = useTheme();
  const isDark = themeContext?.isDark ?? false;
  const theme = isDark ? darkColors : lightColors;
  const { resources, updateSourceLogo, renameSource, deleteSource } = useResources();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSource, setEditingSource] = useState<any>(null);
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newName, setNewName] = useState('');

  const sourcesWithCounts = useMemo(() => {
    // Start with default config
    const configMap = new Map(SOURCE_CONFIG.map(s => [s.name, s]));
    
    // Find all unique sources in resources
    const allSourcesInResources = Array.from(new Set(resources.map(r => r.source).filter(Boolean)));
    
    const combined = allSourcesInResources.map(name => {
      const config = configMap.get(name!);
      const count = resources.filter(r => r.source === name).length;
      return {
        name: name!,
        color: config?.color || theme.primary,
        logo: resources.find(r => r.source === name)?.sourceLogo || config?.logo || 'https://cdn-icons-png.flaticon.com/512/1055/1055666.png',
        count
      };
    });

    // Also include default sources that might be empty but we want to show
    SOURCE_CONFIG.forEach(s => {
      if (!combined.find(c => c.name === s.name)) {
        combined.push({ ...s, count: 0 });
      }
    });

    return combined.sort((a, b) => b.count - a.count);
  }, [resources, theme.primary]);
  
  const filteredSources = useMemo(() => {
    return sourcesWithCounts.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sourcesWithCounts]);

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.textPrimary,
      letterSpacing: -1,
    },
    newButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.outlineVariant,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 16,
      paddingHorizontal: 16,
      height: 54,
      marginBottom: 30,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
      color: theme.textPrimary,
    },
    collectionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surface,
      padding: 18,
      borderRadius: 20,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
    },
    itemName: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    itemCount: {
      fontSize: 13,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    sourceLogoContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
    },
    sourceLogo: {
      width: 24,
      height: 24,
    },
    statsCard: {
      backgroundColor: theme.surfaceContainer,
      borderRadius: 24,
      padding: 24,
      marginTop: 20,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
    },
    statsTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.textPrimary,
      marginBottom: 20,
    },
    statValue: {
      fontSize: 28,
      fontWeight: '900',
      color: theme.textPrimary,
    },
    statLabel: {
      fontSize: 13,
      color: theme.textSecondary,
      fontWeight: '600',
      marginTop: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    editLogoPreview: {
      width: 64,
      height: 64,
      borderRadius: 16,
      backgroundColor: theme.surfaceContainer,
      alignSelf: 'center',
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.outlineVariant,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.textSecondary,
      marginBottom: 8,
      marginLeft: 4,
    },
    saveButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: 'center',
      marginTop: 20,
    },
    saveButtonText: {
      color: theme.onPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    editButton: {
      padding: 8,
      backgroundColor: theme.surfaceContainer,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.outlineVariant,
    },
    menuItemText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
      marginLeft: 16,
    },
    deleteText: {
      color: '#EF4444',
    },
    modalInput: {
      backgroundColor: theme.surfaceContainer,
      borderRadius: 14,
      paddingHorizontal: 16,
      height: 54,
      fontSize: 16,
      color: theme.textPrimary,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
      marginBottom: 20,
    },
  });

  const handleOpenMenu = (source: any) => {
    setEditingSource(source);
    setShowActionMenu(true);
  };

  const handleOpenEditLogo = () => {
    setShowActionMenu(false);
    const existingLogo = resources.find(r => r.source === editingSource.name)?.sourceLogo;
    setNewLogoUrl(existingLogo || editingSource.logo);
  };

  const handleOpenRename = () => {
    setShowActionMenu(false);
    setNewName(editingSource.name);
    const existingLogo = resources.find(r => r.source === editingSource.name)?.sourceLogo;
    setNewLogoUrl(existingLogo || editingSource.logo);
    setShowRenameModal(true);
  };

  const handleDelete = () => {
    if (editingSource) {
      Alert.alert(
        "Delete Category",
        `Are you sure you want to delete "${editingSource.name}" and all ${editingSource.count} items in it? This cannot be undone.`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Delete", 
            style: "destructive",
            onPress: () => {
              deleteSource(editingSource.name);
              setShowActionMenu(false);
              setEditingSource(null);
            }
          }
        ]
      );
    }
  };

  const handleSaveRename = () => {
    if (editingSource && newName) {
      // If logo changed too
      if (newLogoUrl !== editingSource.logo) {
        updateSourceLogo(editingSource.name, newLogoUrl);
      }
      renameSource(editingSource.name, newName);
      setShowRenameModal(false);
      setEditingSource(null);
    }
  };

  const handleSaveLogo = () => {
    if (editingSource && newLogoUrl) {
      updateSourceLogo(editingSource.name, newLogoUrl);
      setEditingSource(null);
      setNewLogoUrl('');
    }
  };

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={dynamicStyles.headerTitle}>Sources</Text>
        <TouchableOpacity style={dynamicStyles.newButton}>
          <Plus color={theme.primary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Search Bar */}
        <View style={dynamicStyles.searchBar}>
          <Search color={theme.textTertiary} size={20} />
          <TextInput
            placeholder="Search your library..."
            placeholderTextColor={theme.textTertiary}
            style={dynamicStyles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>YOUR CURATED SOURCES</Text>
        
        {filteredSources.length > 0 ? (
          filteredSources.map((item) => {
            return (
              <TouchableOpacity 
                key={item.name} 
                style={dynamicStyles.collectionItem} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('SourceResources', { 
                  sourceName: item.name,
                  color: item.color 
                })}
              >
                <View style={styles.itemLeft}>
                  <View style={[dynamicStyles.sourceLogoContainer, { backgroundColor: isDark ? theme.surfaceContainer : '#F8FAFC' }]}>
                    <Image 
                      source={{ uri: resources.find(r => r.source === item.name)?.sourceLogo || item.logo }} 
                      style={[dynamicStyles.sourceLogo, item.name === 'GitHub' && isDark && { tintColor: '#FFFFFF' }]} 
                      resizeMode="contain" 
                    />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={dynamicStyles.itemName}>{item.name}</Text>
                    <Text style={dynamicStyles.itemCount}>{item.count} items saved</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <TouchableOpacity 
                    onPress={() => handleOpenMenu(item)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MoreHorizontal color={theme.textTertiary} size={20} />
                  </TouchableOpacity>
                  <ChevronRight color={theme.textTertiary} size={20} />
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No matches found</Text>
          </View>
        )}

        {/* Stats Preview */}
        {!searchQuery && (
          <View style={dynamicStyles.statsCard}>
            <Text style={dynamicStyles.statsTitle}>Vault Insights</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={dynamicStyles.statValue}>{sourcesWithCounts.filter(s => s.count > 0).length}</Text>
                <Text style={dynamicStyles.statLabel}>Active Sources</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.outlineVariant }]} />
              <View style={styles.statItem}>
                <Text style={dynamicStyles.statValue}>{resources.length}</Text>
                <Text style={dynamicStyles.statLabel}>Total Assets</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Menu Modal */}
      <Modal
        visible={showActionMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowActionMenu(false)}>
          <View style={[dynamicStyles.modalOverlay, { justifyContent: 'flex-end', padding: 0 }]}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={[dynamicStyles.modalContent, { borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 60 }]}>
                <View style={dynamicStyles.modalHeader}>
                  <Text style={dynamicStyles.statsTitle}>{editingSource?.name}</Text>
                  <TouchableOpacity onPress={() => setShowActionMenu(false)}>
                    <X color={theme.textSecondary} size={24} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={dynamicStyles.menuItem} onPress={handleOpenRename}>
                  <Edit2 color={theme.primary} size={20} />
                  <Text style={dynamicStyles.menuItemText}>Edit Category & Logo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[dynamicStyles.menuItem, { borderBottomWidth: 0 }]} onPress={handleDelete}>
                  <Trash2 color="#EF4444" size={20} />
                  <Text style={[dynamicStyles.menuItemText, dynamicStyles.deleteText]}>Delete Category & Items</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Edit Category Modal (Combined Rename & Logo) */}
      <Modal
        visible={showRenameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRenameModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowRenameModal(false)}>
          <View style={dynamicStyles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={dynamicStyles.modalContent}>
                <View style={dynamicStyles.modalHeader}>
                  <Text style={[typography.h3, { color: theme.textPrimary }]}>Edit Category</Text>
                  <TouchableOpacity onPress={() => setShowRenameModal(false)}>
                    <X color={theme.textSecondary} size={24} />
                  </TouchableOpacity>
                </View>

                <View style={dynamicStyles.editLogoPreview}>
                  {newLogoUrl ? (
                    <Image 
                      source={{ uri: newLogoUrl }} 
                      style={{ width: 40, height: 40 }} 
                      resizeMode="contain"
                    />
                  ) : (
                    <Edit2 color={theme.textTertiary} size={32} />
                  )}
                </View>

                <Text style={dynamicStyles.inputLabel}>CATEGORY NAME</Text>
                <TextInput
                  style={dynamicStyles.modalInput}
                  placeholder="e.g. Reading List"
                  placeholderTextColor={theme.textTertiary}
                  value={newName}
                  onChangeText={setNewName}
                />

                <Text style={dynamicStyles.inputLabel}>LOGO URL</Text>
                <TextInput
                  style={dynamicStyles.modalInput}
                  placeholder="https://example.com/logo.png"
                  placeholderTextColor={theme.textTertiary}
                  value={newLogoUrl}
                  onChangeText={setNewLogoUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <TouchableOpacity style={dynamicStyles.saveButton} onPress={handleSaveRename}>
                  <Text style={dynamicStyles.saveButtonText}>Update All Items</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 20,
    paddingLeft: 4,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInfo: {
    justifyContent: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
  },
});
