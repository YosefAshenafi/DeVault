import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightColors, darkColors } from '../theme/colors';
import { typography, spacing, radius } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const ONBOARDING_PAGES = [
  {
    id: '1',
    image: require('../../assets/images/onboarding/art_1.jpg'),
    title: 'Save dev content\nfrom anywhere.',
    description:
      'Your personal sanctuary for code snippets, articles, and tools you find across the web.',
  },
  {
    id: '2',
    image: require('../../assets/images/onboarding/art_2.jpg'),
    title: 'Search your dev\nbrain later.',
    description:
      'Stop digging through browser history. Every snippet, note, and doc you save is instantly indexed and ready for deep discovery.',
  },
  {
    id: '3',
    image: require('../../assets/images/onboarding/art_3.jpg'),
    title: 'Stay sharp.\nStay organized.',
    description:
      'Tag, categorize, and connect your resources. Build your own developer knowledge graph.',
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const themeContext = useTheme();
  const isDark = themeContext?.isDark ?? false;
  const theme = isDark ? darkColors : lightColors;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_PAGES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('SignIn');
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    title: {
      ...typography.h1,
      textAlign: 'center',
      marginBottom: spacing.md,
      color: theme.textPrimary,
    },
    description: {
      ...typography.bodyLg,
      textAlign: 'center',
      color: theme.textSecondary,
      paddingHorizontal: spacing.md,
    },
    skipText: {
      ...typography.labelMd,
      color: theme.textSecondary,
    },
    logoVault: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.primary,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.outlineVariant,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: theme.primary,
      width: 24,
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: radius.sm,
      paddingVertical: 18,
      alignItems: 'center',
    },
    buttonText: {
      ...typography.labelLg,
      color: theme.onPrimary,
    },
  });

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    page: {
      width,
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    illustrationContainer: {
      width: width * 0.8,
      height: width * 0.8,
      alignSelf: 'center',
      marginBottom: spacing.xl,
      justifyContent: 'center',
      alignItems: 'center',
    },
    artImage: {
      width: '100%',
      height: '100%',
    },
    textContainer: {
      paddingHorizontal: spacing.sm,
    },
    bottomContainer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: Platform.OS === 'ios' ? 20 : 30,
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={dynamicStyles.logoVault}>DevVault</Text>
        <TouchableOpacity onPress={() => navigation.replace('SignIn')}>
          <Text style={dynamicStyles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_PAGES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <View style={styles.illustrationContainer}>
              <Image 
                source={item.image} 
                style={styles.artImage} 
                resizeMode="contain" 
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={dynamicStyles.title}>{item.title}</Text>
              <Text style={dynamicStyles.description}>{item.description}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(idx);
        }}
      />

      {/* Bottom section */}
      <View style={styles.bottomContainer}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {ONBOARDING_PAGES.map((_, index) => (
            <View
              key={index}
              style={[
                dynamicStyles.dot,
                index === currentIndex && dynamicStyles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity style={dynamicStyles.button} onPress={handleNext}>
          <Text style={dynamicStyles.buttonText}>
            {currentIndex === ONBOARDING_PAGES.length - 1
              ? 'Get Started'
              : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
