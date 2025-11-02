
import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function YardInfoScreen() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const isDark = colorScheme === 'dark';

  const yards = [
    { 
      name: 'Austin Scrap Yard', 
      address: '123 Industrial Blvd, Austin, TX',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
      phone: '(512) 555-0123',
      verified: true,
      acceptedMetals: ['Copper', 'Aluminum', 'Steel', 'Brass'],
    },
    { 
      name: 'Texas Metal Recycling', 
      address: '456 Commerce Dr, Dallas, TX',
      hours: 'Mon-Sat: 7AM-7PM',
      phone: '(214) 555-0456',
      verified: true,
      acceptedMetals: ['Copper', 'Aluminum', 'Steel'],
    },
    { 
      name: 'Lone Star Salvage', 
      address: '789 Highway 35, Houston, TX',
      hours: 'Mon-Fri: 8AM-5PM',
      phone: '(713) 555-0789',
      verified: false,
      acceptedMetals: ['Steel', 'Iron', 'Aluminum'],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Yard Info & Pricing</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Local recycling yards near you
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {yards.map((yard, index) => (
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
              <View style={styles.nameRow}>
                <Text style={[styles.yardName, { color: colors.text }]}>{yard.name}</Text>
                {yard.verified && (
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <IconSymbol name="checkmark.seal.fill" size={16} color="#FFFFFF" />
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <IconSymbol name="location.fill" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{yard.address}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <IconSymbol name="clock.fill" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{yard.hours}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <IconSymbol name="phone.fill" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{yard.phone}</Text>
            </View>
            
            <View style={styles.metalsSection}>
              <Text style={[styles.metalsLabel, { color: colors.textSecondary }]}>
                Accepted Metals:
              </Text>
              <View style={styles.metalTags}>
                {yard.acceptedMetals.map((metal, idx) => (
                  <View 
                    key={idx}
                    style={[
                      styles.metalTag,
                      { 
                        backgroundColor: colors.primary + '20',
                        borderColor: colors.outline,
                      }
                    ]}
                  >
                    <Text style={[styles.metalTagText, { color: colors.primary }]}>
                      {metal}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.actionButton, { borderColor: colors.outline }]}
                activeOpacity={0.7}
              >
                <IconSymbol name="map.fill" size={18} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>Directions</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { borderColor: colors.outline }]}
                activeOpacity={0.7}
              >
                <IconSymbol name="phone.fill" size={18} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <TouchableOpacity 
          style={[
            styles.addYardButton,
            { 
              backgroundColor: colors.card,
              borderColor: colors.outline,
            },
            isDark && styles.cardDark
          ]}
          activeOpacity={0.7}
        >
          <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
          <Text style={[styles.addYardText, { color: colors.primary }]}>
            Add Unlisted Yard
          </Text>
        </TouchableOpacity>
        
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
    marginBottom: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  yardName: {
    fontSize: 20,
    fontWeight: '700',
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
    lineHeight: 20,
  },
  metalsSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  metalsLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  metalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metalTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  metalTagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '700',
  },
  addYardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 16,
  },
  addYardText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
