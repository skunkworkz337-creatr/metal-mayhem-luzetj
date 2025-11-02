
import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors, darkColors, lightColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function MetalTypesScreen() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const isDark = colorScheme === 'dark';

  const metalTypes = [
    { name: 'Copper', icon: 'bolt.fill', national: '$3.50/lb', regional: '$3.45/lb', state: '$3.48/lb' },
    { name: 'Aluminum', icon: 'cube.fill', national: '$0.85/lb', regional: '$0.82/lb', state: '$0.84/lb' },
    { name: 'Steel', icon: 'square.stack.3d.up.fill', national: '$0.15/lb', regional: '$0.14/lb', state: '$0.15/lb' },
    { name: 'Brass', icon: 'circle.hexagongrid.fill', national: '$2.10/lb', regional: '$2.05/lb', state: '$2.08/lb' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Metal Types & Pricing</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Current market rates for scrap metals
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {metalTypes.map((metal, index) => (
          <View 
            key={index} 
            style={[
              styles.card,
              { 
                backgroundColor: colors.card,
                borderColor: colors.outline,
              },
              isDark && styles.cardDark
            ]}
          >
            <View style={styles.cardHeader}>
              <IconSymbol name={metal.icon} size={32} color={colors.primary} />
              <Text style={[styles.metalName, { color: colors.text }]}>{metal.name}</Text>
            </View>
            
            <View style={styles.priceContainer}>
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>National:</Text>
                <Text style={[styles.priceValue, { color: colors.primary }]}>{metal.national}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Regional:</Text>
                <Text style={[styles.priceValue, { color: colors.primary }]}>{metal.regional}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>State:</Text>
                <Text style={[styles.priceValue, { color: colors.primary }]}>{metal.state}</Text>
              </View>
            </View>
          </View>
        ))}
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  cardDark: {
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  metalName: {
    fontSize: 22,
    fontWeight: '700',
  },
  priceContainer: {
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 17,
    fontWeight: '700',
  },
});
