import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Moon,
  Sun,
  Layout,
  ChevronRight,
  LogOut,
  Shield,
  LifeBuoy,
  FileText,
  Download,
  Upload,
  X,
  Database,
  Info,
} from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { lightColors, darkColors } from '../theme/colors';
import { typography, spacing, radius } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';
import { useResources } from '../context/ResourceContext';

export default function SettingsScreen({ navigation }: any) {
  const themeContext = useTheme();
  const isDark = themeContext?.isDark ?? false;
  const toggleTheme = themeContext?.toggleTheme ?? (() => {});
  const { resources, importResources } = useResources();
  const theme = isDark ? darkColors : lightColors;
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const handleLogout = () => {
    navigation.replace('SignIn');
  };

  const handleExport = async () => {
    try {
      const data = JSON.stringify(resources, null, 2);
      const fileUri = (FileSystem.cacheDirectory || FileSystem.documentDirectory || "") + 'devvault_backup.json';
      await FileSystem.writeAsStringAsync(fileUri, data);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Export Failed', 'Sharing is not available on this device');
      }
    } catch (error) {
      Alert.alert('Export Error', 'An error occurred while exporting your vault');
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (!result.canceled) {
        const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
        const importedData = JSON.parse(fileContent);
        
        if (Array.isArray(importedData)) {
          importResources(importedData);
          Alert.alert('Success', 'Vault successfully imported!');
        } else {
          Alert.alert('Import Failed', 'Invalid backup format');
        }
      }
    } catch (error) {
      Alert.alert('Import Error', 'An error occurred while importing your vault');
    }
  };

  const clearVault = () => {
    Alert.alert(
      'Clear Vault',
      'Are you sure you want to delete all saved resources? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive', 
          onPress: () => importResources([]) 
        }
      ]
    );
  };

  const showLegalModal = (type: 'privacy' | 'terms' | 'support') => {
    if (type === 'privacy') {
      setModalTitle('Privacy Policy');
      setModalContent('At DevVault, your privacy is our priority. All your saved snippets, articles, and videos are stored locally on your device by default. We do not sell your personal data to third parties.');
    } else if (type === 'terms') {
      setModalTitle('Terms of Service');
      setModalContent('By using DevVault, you agree to organize your knowledge responsibly. You retain ownership of all content you save.');
    } else {
      setModalTitle('Support');
      setModalContent('Need help? Contact our curation experts at support@devvault.io.');
    }
    setModalVisible(true);
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
    },
    headerTitle: {
      ...typography.h2,
      color: theme.textPrimary,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: spacing.xxl,
    },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      padding: spacing.lg,
      borderRadius: radius.md,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: theme.outlineVariant,
    },
    avatarLarge: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: spacing.md,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      ...typography.h3,
      color: theme.textPrimary,
    },
    profileEmail: {
      ...typography.bodySm,
      color: theme.textSecondary,
    },
    editButton: {
      padding: 8,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.labelSm,
      color: theme.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
    },
    settingCard: {
      backgroundColor: theme.surface,
      borderRadius: radius.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.outlineVariant,
      marginBottom: spacing.xl,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      gap: 12,
    },
    settingIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: isDark ? theme.surfaceContainer : '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
    },
    settingContent: {
      flex: 1,
    },
    settingLabel: {
      ...typography.labelLg,
      color: theme.textPrimary,
    },
    settingValue: {
      ...typography.bodySm,
      color: theme.textSecondary,
    },
    settingDivider: {
      height: 1,
      backgroundColor: theme.outlineVariant,
      marginLeft: 60,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#450a0a' : '#FEE2E2',
      padding: spacing.md,
      borderRadius: radius.md,
      gap: 10,
      marginTop: spacing.sm,
      marginBottom: spacing.xxl,
    },
    logoutText: {
      ...typography.labelLg,
      color: isDark ? '#FB7185' : '#DC2626',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    modalContainer: {
      width: '100%',
      backgroundColor: theme.surface,
      borderRadius: radius.lg,
      padding: 24,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      ...typography.h2,
      color: theme.textPrimary,
    },
    modalText: {
      ...typography.bodyLg,
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: 24,
    },
    modalDismissButton: {
      borderRadius: radius.sm,
      paddingVertical: 14,
      alignItems: 'center',
    },
    modalDismissText: {
      ...typography.labelLg,
      color: '#FFFFFF',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={dynamicStyles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={dynamicStyles.profileCard}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?u=yosef' }} 
            style={dynamicStyles.avatarLarge} 
          />
          <View style={dynamicStyles.profileInfo}>
            <Text style={dynamicStyles.profileName}>Yosef Ashenafi</Text>
            <Text style={dynamicStyles.profileEmail}>yosef.a@devvault.io</Text>
          </View>
          <TouchableOpacity style={dynamicStyles.editButton}>
            <ChevronRight color={theme.textTertiary} size={20} />
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Appearance</Text>
          <View style={dynamicStyles.settingCard}>
            <View style={dynamicStyles.settingRow}>
              <View style={dynamicStyles.settingIconContainer}>
                {isDark ? (
                  <Moon color={theme.primary} size={20} />
                ) : (
                  <Sun color={theme.primary} size={20} />
                )}
              </View>
              <View style={dynamicStyles.settingContent}>
                <Text style={dynamicStyles.settingLabel}>Dark Mode</Text>
                <Text style={dynamicStyles.settingValue}>
                  {isDark ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{
                  false: '#CBD5E1',
                  true: theme.primary,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>


        {/* Data Management Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Data Management</Text>
          <View style={dynamicStyles.settingCard}>
            <TouchableOpacity style={dynamicStyles.settingRow} onPress={handleExport}>
              <View style={dynamicStyles.settingIconContainer}>
                <Download color={theme.primary} size={20} />
              </View>
              <View style={dynamicStyles.settingContent}>
                <Text style={dynamicStyles.settingLabel}>Export Vault</Text>
                <Text style={dynamicStyles.settingValue}>Save backup to local storage</Text>
              </View>
              <ChevronRight color={theme.textTertiary} size={18} />
            </TouchableOpacity>

            <View style={dynamicStyles.settingDivider} />

            <TouchableOpacity style={dynamicStyles.settingRow} onPress={handleImport}>
              <View style={dynamicStyles.settingIconContainer}>
                <Upload color={theme.primary} size={20} />
              </View>
              <View style={dynamicStyles.settingContent}>
                <Text style={dynamicStyles.settingLabel}>Import Vault</Text>
                <Text style={dynamicStyles.settingValue}>Restore from a .json file</Text>
              </View>
              <ChevronRight color={theme.textTertiary} size={18} />
            </TouchableOpacity>

            <View style={dynamicStyles.settingDivider} />

            <TouchableOpacity style={dynamicStyles.settingRow} onPress={clearVault}>
              <View style={dynamicStyles.settingIconContainer}>
                <Database color={theme.error} size={20} />
              </View>
              <View style={dynamicStyles.settingContent}>
                <Text style={dynamicStyles.settingLabel}>Clear All Data</Text>
                <Text style={dynamicStyles.settingValue}>Delete everything in vault</Text>
              </View>
              <ChevronRight color={theme.textTertiary} size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>About</Text>
          <View style={dynamicStyles.settingCard}>
            <TouchableOpacity style={dynamicStyles.settingRow} onPress={() => showLegalModal('privacy')}>
              <View style={dynamicStyles.settingIconContainer}>
                <Shield color={theme.primary} size={20} />
              </View>
              <View style={dynamicStyles.settingContent}>
                <Text style={dynamicStyles.settingLabel}>Privacy Policy</Text>
              </View>
              <ChevronRight color={theme.textTertiary} size={18} />
            </TouchableOpacity>

            <View style={dynamicStyles.settingDivider} />

            <TouchableOpacity style={dynamicStyles.settingRow} onPress={() => showLegalModal('terms')}>
              <View style={dynamicStyles.settingIconContainer}>
                <FileText color={theme.primary} size={20} />
              </View>
              <View style={dynamicStyles.settingContent}>
                <Text style={dynamicStyles.settingLabel}>Terms of Service</Text>
              </View>
              <ChevronRight color={theme.textTertiary} size={18} />
            </TouchableOpacity>

            <View style={dynamicStyles.settingDivider} />

            <TouchableOpacity style={dynamicStyles.settingRow} onPress={() => showLegalModal('support')}>
              <View style={dynamicStyles.settingIconContainer}>
                <LifeBuoy color={theme.primary} size={20} />
              </View>
              <View style={dynamicStyles.settingContent}>
                <Text style={dynamicStyles.settingLabel}>Support & Help</Text>
              </View>
              <ChevronRight color={theme.textTertiary} size={18} />
            </TouchableOpacity>

            <View style={dynamicStyles.settingDivider} />

            <View style={dynamicStyles.settingRow}>
              <View style={dynamicStyles.settingIconContainer}>
                <Info color={theme.primary} size={20} />
              </View>
              <View style={dynamicStyles.settingContent}>
                <Text style={dynamicStyles.settingLabel}>Version</Text>
                <Text style={dynamicStyles.settingValue}>1.0.0 (Build 42)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={dynamicStyles.logoutButton} onPress={handleLogout}>
          <LogOut color={isDark ? '#FB7185' : '#DC2626'} size={20} />
          <Text style={dynamicStyles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Legal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContainer}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color={theme.textPrimary} size={24} />
              </TouchableOpacity>
            </View>
            <Text style={dynamicStyles.modalText}>{modalContent}</Text>
            <TouchableOpacity 
              style={[dynamicStyles.modalDismissButton, { backgroundColor: theme.primary }]} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={dynamicStyles.modalDismissText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
