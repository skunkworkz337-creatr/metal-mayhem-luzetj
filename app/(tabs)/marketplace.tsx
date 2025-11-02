
import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';

export default function MarketplaceScreen() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const listings = [
    { 
      id: 'listing-1',
      title: 'Old Washing Machine', 
      description: 'Non-working washer, free for pickup',
      location: 'Austin, TX',
      icon: 'washer.fill',
      posted: '2 hours ago',
      sellerId: 'seller-1',
      sellerName: 'Sarah Johnson',
    },
    { 
      id: 'listing-2',
      title: 'Car Parts - Various', 
      description: 'Assorted metal car parts from old sedan',
      location: 'Dallas, TX',
      icon: 'car.fill',
      posted: '5 hours ago',
      sellerId: 'seller-3',
      sellerName: 'Tom Wilson',
    },
    { 
      id: 'listing-3',
      title: 'Copper Pipes', 
      description: 'Approx 50lbs of copper piping',
      location: 'Houston, TX',
      icon: 'pipe.and.drop.fill',
      posted: '1 day ago',
      sellerId: 'seller-2',
      sellerName: 'Mike Chen',
    },
    { 
      id: 'listing-4',
      title: 'Steel Beams', 
      description: 'Construction leftovers, heavy duty',
      location: 'San Antonio, TX',
      icon: 'square.stack.3d.up.fill',
      posted: '2 days ago',
      sellerId: 'seller-4',
      sellerName: 'Lisa Martinez',
    },
  ];

  const handleContactSeller = (listing: typeof listings[0]) => {
    // Navigate to chat screen with seller info
    router.push({
      pathname: '/chat',
      params: {
        conversationId: `conv-${listing.id}`,
        participantName: listing.sellerName,
        participantType: 'seller',
        icon: listing.icon,
      },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Marketplace</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Items available for pickup
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {listings.map((listing, index) => (
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
              <IconSymbol name={listing.icon} size={28} color={colors.primary} />
              <View style={styles.headerText}>
                <Text style={[styles.listingTitle, { color: colors.text }]}>{listing.title}</Text>
                <Text style={[styles.location, { color: colors.textSecondary }]}>
                  <IconSymbol name="location.fill" size={12} color={colors.textSecondary} />
                  {' '}{listing.location}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.description, { color: colors.text }]}>
              {listing.description}
            </Text>
            
            <View style={styles.footer}>
              <Text style={[styles.posted, { color: colors.textSecondary }]}>
                Posted {listing.posted}
              </Text>
              
              <TouchableOpacity
                style={[styles.contactButton, { backgroundColor: colors.primary }]}
                onPress={() => handleContactSeller(listing)}
                activeOpacity={0.7}
              >
                <IconSymbol name="bubble.left.fill" size={16} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>Contact Seller</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <View style={{ height: 100 }} />
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        activeOpacity={0.8}
      >
        <IconSymbol name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  headerText: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  location: {
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
  posted: {
    fontSize: 12,
    fontWeight: '400',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 8,
  },
});
