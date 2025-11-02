
import React, { useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useThemeColors } from '@/styles/commonStyles';

interface AdBannerProps {
  adUnitId?: string;
  size?: BannerAdSize;
}

export default function AdBanner({ 
  adUnitId, 
  size = BannerAdSize.BANNER 
}: AdBannerProps) {
  const colors = useThemeColors();
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  // Use test ads in development, real ads in production
  const finalAdUnitId = __DEV__ 
    ? TestIds.BANNER 
    : (adUnitId || 'ca-app-pub-2756715533485751/4867766606');

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {!adError ? (
        <BannerAd
          unitId={finalAdUnitId}
          size={size}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={() => {
            console.log('Ad loaded successfully');
            setAdLoaded(true);
          }}
          onAdFailedToLoad={(error) => {
            console.error('Ad failed to load:', error);
            setAdError(true);
          }}
        />
      ) : (
        <View style={[styles.placeholder, { backgroundColor: colors.background }]}>
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            Ad space
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  placeholder: {
    width: 320,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
