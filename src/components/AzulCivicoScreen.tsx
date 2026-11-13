import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '../styles/azulCivico';

export function AzulCivicoScreen({
  title,
  children,
  footer,
  showBack = false,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  showBack?: boolean;
}) {
  const router = useRouter();
  const { width, height, fontScale } = useWindowDimensions();
  const compact = height < 660;
  const showRoutes = width >= 375 && fontScale <= 1.05 && !compact;

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  }

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="never"
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
    >
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.header}>
        {showRoutes && (
          <Image
            accessible={false}
            importantForAccessibility="no"
            source={require('../../assets/azul-civico/trajetos.png')}
            style={styles.routes}
          />
        )}
        <View
          style={[
            styles.headerContent,
            !showBack && styles.headerWithoutBack,
            compact && styles.compactHeaderContent,
            showRoutes && styles.headerWithRoutes,
          ]}
        >
          {showBack && (
            <Pressable
              accessibilityLabel="Voltar"
              accessibilityRole="button"
              onPress={goBack}
              style={({ pressed }) => [styles.back, pressed && styles.pressed]}
            >
              <Text accessible={false} allowFontScaling={false} style={styles.backArrow}>
                ←
              </Text>
              <Text style={styles.backLabel}>Voltar</Text>
            </Pressable>
          )}
          <View style={styles.brand}>
            <Image
              accessible={false}
              importantForAccessibility="no"
              source={require('../../assets/azul-civico/onibus.png')}
              style={styles.brandIcon}
            />
            <Text style={styles.brandLabel}>Parada Certa</Text>
          </View>
          <Text
            accessibilityRole="header"
            style={[styles.title, width < 380 && styles.narrowTitle, compact && styles.compactTitle]}
          >
            {title}
          </Text>
        </View>
      </SafeAreaView>
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.panel}>
        <View style={styles.panelContent}>{children}</View>
        {footer && <View style={[styles.panelContent, styles.footer]}>{footer}</View>}
      </SafeAreaView>
    </ScrollView>
  );
}

const routesWidth = 132;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.headerTop,
  },
  content: {
    flexGrow: 1,
    backgroundColor: colors.headerBottom,
  },
  header: {
    backgroundColor: colors.headerTop,
    backgroundImage: `linear-gradient(180deg, ${colors.headerTop}, ${colors.headerBottom})`,
    overflow: 'hidden',
  },
  headerContent: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: spacing.maxContentWidth + spacing.gutter * 2,
    gap: 22,
    paddingHorizontal: spacing.gutter,
    paddingTop: 4,
    paddingBottom: 30,
  },
  headerWithoutBack: {
    paddingTop: spacing.gutter,
  },
  compactHeaderContent: {
    gap: 14,
    paddingBottom: 18,
  },
  headerWithRoutes: {
    paddingRight: routesWidth + 8,
  },
  back: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 48,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: colors.back,
  },
  backLabel: {
    ...typography.control,
    flexShrink: 1,
    color: colors.surface,
  },
  backArrow: {
    ...typography.control,
    color: colors.surface,
    fontSize: 21,
  },
  routes: {
    position: 'absolute',
    right: 0,
    bottom: 11,
    width: routesWidth,
    height: 180,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.controlGap,
  },
  brandIcon: {
    width: 44,
    height: 44,
  },
  brandLabel: {
    ...typography.brand,
    flexShrink: 1,
    color: colors.brand,
  },
  title: {
    ...typography.title,
    marginTop: 3,
    color: colors.surface,
  },
  narrowTitle: {
    fontSize: 40,
    lineHeight: 48,
  },
  compactTitle: {
    marginTop: 0,
  },
  panel: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
    paddingTop: 34,
    paddingBottom: 32,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.surface,
  },
  panelContent: {
    width: '100%',
    maxWidth: spacing.maxContentWidth,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: spacing.sectionGap,
  },
  pressed: {
    opacity: 0.86,
  },
});
