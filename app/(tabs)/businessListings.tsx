
import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function BusinessListingsScreen() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const isDark = colorScheme === 'dark';

  const businesses = [
    { 
      name: 'Quick Haul Services', 
      type: 'Pickup Service',
      description: 'Fast and reliable metal pickup',
      verified: true,
      rating: 4.8,
      icon: 'truck.box.fill'
    },
    { 
      name: 'Metro Recycling Co.', 
      type: 'Recycling Center',
      description: 'Full-service recycling facility',
      verified: true,
      rating: 4.6,
      icon: 'arrow.3.trianglepath'
    },
    { 
      name: 'Scrap Masters', 
      type: 'Scrap Dealer',
      description: 'Best prices for all metal types',
      verified: false,
      rating: 4.3,
      icon: 'building.2.fill'
    },
    { 
      name: 'Green Earth Recyclers', 
      type: 'Eco-Friendly Service',
      description: 'Sustainable metal recycling',
      verified: true,
      rating: 4.9,
      icon: 'leaf.fill'
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Business Listings</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Local services and recycling centers
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {businesses.map((business, index) => (
          <TouchableOpacity 
            key={index}
            activeOpacity={0.7}
          >
            <View 
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
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <IconSymbol name={business.icon} size={28} color={colors.primary} />
                </View>
                <View style={styles.headerText}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.businessName, { color: colors.text }]}>{business.name}</Text>
                    {business.verified && (
                      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                        <IconSymbol name="checkmark.seal.fill" size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.businessType, { color: colors.textSecondary }]}>
                    {business.type}
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.description, { color: colors.text }]}>
                {business.description}
              </Text>
              
              <View style={styles.footer}>
                <View style={styles.rating}>
                  <IconSymbol name="star.fill" size={16} color={colors.secondary} />
                  <Text style={[styles.ratingText, { color: colors.text }]}>
                    {business.rating}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text style={[styles.contactButton, { color: colors.primary }]}>
                    Contact
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
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
    padding: 16,
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
    marginBottom: 12,
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessType: {
    fontSize: 13,
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '600',
  },
  contactButton: {
    fontSize: 15,
    fontWeight: '700',
  },
});
