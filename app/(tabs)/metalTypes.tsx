
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { metalTypesDatabase, MetalType, searchMetals } from '@/data/metalTypes';
import { scrapingScheduler, PriceData } from '@/services/scrapingScheduler';

export default function MetalTypesScreen() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const isDark = colorScheme === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedMetalId, setExpandedMetalId] = useState<string | null>(null);
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Load cached prices on mount
  useEffect(() => {
    const cachedPrices = scrapingScheduler.getCachedPrices();
    if (cachedPrices.length > 0) {
      setPrices(cachedPrices);
      setLastUpdate(new Date());
    }
  }, []);

  // Filter metals based on search and category
  const filteredMetals = React.useMemo(() => {
    let metals = metalTypesDatabase;
    
    if (searchQuery) {
      metals = searchMetals(searchQuery);
    }
    
    if (selectedCategory !== 'all') {
      metals = metals.filter(m => m.category === selectedCategory);
    }
    
    return metals;
  }, [searchQuery, selectedCategory]);

  const categories = [
    { id: 'all', label: 'All', icon: 'square.grid.2x2.fill' },
    { id: 'non-ferrous', label: 'Non-Ferrous', icon: 'cube.fill' },
    { id: 'ferrous', label: 'Ferrous', icon: 'square.stack.3d.up.fill' },
    { id: 'precious', label: 'Precious', icon: 'star.fill' },
    { id: 'specialty', label: 'Specialty', icon: 'sparkles' },
  ];

  const toggleExpanded = (metalId: string) => {
    setExpandedMetalId(expandedMetalId === metalId ? null : metalId);
  };

  // Get price for a specific metal
  const getPriceForMetal = (metalId: string): string => {
    const priceData = prices.find(p => p.metalId === metalId);
    if (priceData) {
      return `$${priceData.nationalPrice.toFixed(2)}/lb`;
    }
    return 'Price unavailable';
  };

  // Format last update time
  const formatLastUpdate = (): string => {
    if (!lastUpdate) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Metal Types & Pricing</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Comprehensive guide to scrap metals
        </Text>
      </View>

      {/* Gumloop Integration Info */}
      <View style={[styles.gumloopBanner, { backgroundColor: colors.card, borderColor: colors.outline }]}>
        <IconSymbol name="arrow.triangle.2.circlepath" size={16} color={colors.primary} />
        <View style={styles.gumloopText}>
          <Text style={[styles.gumloopTitle, { color: colors.text }]}>
            Powered by Gumloop
          </Text>
          <Text style={[styles.gumloopSubtitle, { color: colors.textSecondary }]}>
            Updates every Monday at 11:59 PM CST • Last update: {formatLastUpdate()}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search metals, grades, or sources..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === cat.id ? colors.primary : colors.card,
                borderColor: colors.outline,
              }
            ]}
            onPress={() => setSelectedCategory(cat.id)}
            activeOpacity={0.7}
          >
            <IconSymbol 
              name={cat.icon} 
              size={16} 
              color={selectedCategory === cat.id ? '#FFFFFF' : colors.text} 
            />
            <Text style={[
              styles.categoryText,
              { color: selectedCategory === cat.id ? '#FFFFFF' : colors.text }
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {filteredMetals.length} {filteredMetals.length === 1 ? 'metal' : 'metals'} found
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredMetals.map((metal) => {
          const isExpanded = expandedMetalId === metal.id;
          const price = getPriceForMetal(metal.id);
          
          return (
            <TouchableOpacity
              key={metal.id}
              style={[
                styles.card,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.outline,
                },
                isDark && styles.cardDark
              ]}
              onPress={() => toggleExpanded(metal.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <IconSymbol name={metal.icon} size={28} color={colors.primary} />
                </View>
                <View style={styles.headerText}>
                  <Text style={[styles.metalName, { color: colors.text }]}>{metal.name}</Text>
                  <Text style={[styles.metalGrade, { color: colors.primary }]}>{metal.grade}</Text>
                </View>
                <IconSymbol 
                  name={isExpanded ? "chevron.up" : "chevron.down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </View>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                      {metal.description}
                    </Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Common Sources</Text>
                    <View style={styles.sourcesList}>
                      {metal.commonSources.map((source, idx) => (
                        <View key={idx} style={styles.sourceItem}>
                          <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                          <Text style={[styles.sourceText, { color: colors.textSecondary }]}>
                            {source}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.pricingSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Current Pricing</Text>
                    <View style={styles.priceCard}>
                      <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>National Average</Text>
                      <Text style={[styles.priceValue, { color: colors.primary }]}>{price}</Text>
                      <Text style={[styles.updateText, { color: colors.textSecondary }]}>
                        Via Gumloop • Updated weekly
                      </Text>
                    </View>
                    <View style={[styles.infoBox, { backgroundColor: colors.background, borderColor: colors.outline }]}>
                      <IconSymbol name="info.circle.fill" size={16} color={colors.primary} />
                      <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                        Regional and state pricing coming soon
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        
        {filteredMetals.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol name="magnifyingglass" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No metals found matching your search
            </Text>
          </View>
        )}
        
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
    paddingBottom: 12,
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
  gumloopBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    gap: 10,
  },
  gumloopText: {
    flex: 1,
  },
  gumloopTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  gumloopSubtitle: {
    fontSize: 11,
    fontWeight: '400',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  categoryScroll: {
    maxHeight: 50,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 10,
    paddingVertical: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '500',
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
    marginBottom: 12,
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
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  metalName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  metalGrade: {
    fontSize: 14,
    fontWeight: '600',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  sourcesList: {
    gap: 6,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  sourceText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  pricingSection: {
    marginTop: 8,
  },
  priceCard: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  updateText: {
    fontSize: 11,
    fontWeight: '400',
    fontStyle: 'italic',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
