
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useThemeColors } from '@/styles/commonStyles';

interface AdBannerProps {
  adUnitId?: string;
  size?: any;
}

// Web version - no ads on web
export default function AdBanner({ adUnitId, size }: AdBannerProps) {
  const colors = useThemeColors();

  // Don't render anything on web
  return null;

  // Alternative: Show a placeholder on web
  // return (
  //   <View style={[styles.container, { backgroundColor: colors.card }]}>
  //     <View style={[styles.placeholder, { backgroundColor: colors.background }]}>
  //       <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
  //         Ad space (Web)
  //       </Text>
  //     </View>
  //   </View>
  // );
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
