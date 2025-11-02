
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration for MetalMayhem
  const tabs: TabBarItem[] = [
    {
      name: 'metalTypes',
      route: '/(tabs)/metalTypes',
      icon: 'cube.fill',
      label: 'Metals',
    },
    {
      name: 'marketplace',
      route: '/(tabs)/marketplace',
      icon: 'cart.fill',
      label: 'Market',
    },
    {
      name: 'businessListings',
      route: '/(tabs)/businessListings',
      icon: 'building.2.fill',
      label: 'Business',
    },
    {
      name: 'yardInfo',
      route: '/(tabs)/yardInfo',
      icon: 'map.fill',
      label: 'Yards',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="metalTypes">
          <Icon sf="cube.fill" drawable="ic_metals" />
          <Label>Metals</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="marketplace">
          <Icon sf="cart.fill" drawable="ic_market" />
          <Label>Market</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="businessListings">
          <Icon sf="building.2.fill" drawable="ic_business" />
          <Label>Business</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="yardInfo">
          <Icon sf="map.fill" drawable="ic_yards" />
          <Label>Yards</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="metalTypes" />
        <Stack.Screen name="marketplace" />
        <Stack.Screen name="businessListings" />
        <Stack.Screen name="yardInfo" />
      </Stack>
      <FloatingTabBar tabs={tabs} containerWidth={320} />
    </>
  );
}
