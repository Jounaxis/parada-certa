import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

const StyledSafeAreaView = withUniwind(SafeAreaView);

export function AzulCivicoScreen({
  title,
  children,
  footer,
  compactHeader = false,
  showBack = false,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  compactHeader?: boolean;
  showBack?: boolean;
}) {
  const router = useRouter();
  const { width, height, fontScale } = useWindowDimensions();
  const shortScreen = height < 660;
  const showRoutes = width >= 375 && fontScale <= 1.05 && !shortScreen && !compactHeader;
  const headerSpacing = shortScreen ? 'gap-3.5' : 'gap-[22px]';
  const headerPadding = compactHeader
    ? 'pt-2 pb-5'
    : `${showBack ? 'pt-1' : 'pt-gutter'} ${shortScreen ? 'pb-[18px]' : 'pb-[30px]'}`;
  const titleSize = compactHeader
    ? 'text-[32px]/[40px]'
    : width < 380 ? 'text-[40px]/[48px]' : 'text-[44px]/[52px]';

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
      contentContainerClassName="grow bg-civic-header-bottom"
      contentInsetAdjustmentBehavior="never"
      keyboardShouldPersistTaps="handled"
      className="flex-1 bg-civic-header-top"
    >
      <StyledSafeAreaView
        edges={['top', 'left', 'right']}
        className="overflow-hidden bg-civic-header-top bg-linear-to-b from-civic-header-top to-civic-header-bottom"
      >
        {showRoutes && (
          <Image
            accessible={false}
            importantForAccessibility="no"
            source={require('../../assets/azul-civico/trajetos.png')}
            className="absolute right-0 bottom-[11px] h-[180px] w-[132px]"
          />
        )}
        <View
          className={`w-full max-w-header self-center pl-gutter
            ${compactHeader ? 'gap-2' : headerSpacing} ${headerPadding}
            ${showRoutes ? 'pr-[140px]' : 'pr-gutter'}`}
        >
          <View className={compactHeader ? 'flex-row flex-wrap items-center gap-x-4 gap-y-2' : headerSpacing}>
            {showBack && (
              <Pressable
                accessibilityLabel="Voltar"
                accessibilityRole="button"
                onPress={goBack}
                className={`min-h-12 min-w-12 flex-row items-center gap-2 rounded-3xl bg-civic-back px-3 py-2 active:opacity-[0.86]
                  ${compactHeader ? 'max-w-full' : 'self-start'}`}
              >
                <Text accessible={false} allowFontScaling={false} className="text-[21px]/[24px] font-semibold text-civic-surface">
                  ←
                </Text>
                <Text className="shrink text-civic-body font-semibold text-civic-surface">Voltar</Text>
              </Pressable>
            )}
            <View className="max-w-full flex-row items-center gap-control">
              <Image
                accessible={false}
                importantForAccessibility="no"
                source={require('../../assets/azul-civico/onibus.png')}
                className={compactHeader ? 'size-8' : 'size-11'}
              />
              <Text className="shrink text-civic-brand font-semibold text-civic-brand-ink">Parada Certa</Text>
            </View>
          </View>
          <Text
            accessibilityRole="header"
            className={`font-bold text-civic-surface ${titleSize} ${compactHeader || shortScreen ? 'mt-0' : 'mt-[3px]'}`}
          >
            {title}
          </Text>
        </View>
      </StyledSafeAreaView>
      <StyledSafeAreaView
        edges={['left', 'right', 'bottom']}
        className={`grow items-center rounded-t-[28px] bg-civic-surface px-gutter pb-8
          ${compactHeader ? 'pt-6' : 'pt-[34px]'}`}
      >
        <View className="w-full max-w-panel">{children}</View>
        {footer && <View className="mt-auto w-full max-w-panel items-center pt-section">{footer}</View>}
      </StyledSafeAreaView>
    </ScrollView>
  );
}
