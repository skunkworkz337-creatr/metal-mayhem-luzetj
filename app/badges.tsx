
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';
import { CURRENT_USER, AVAILABLE_BADGES, Badge } from '@/data/users';

export default function BadgesScreen() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const router = useRouter();

  const earnedBadgeIds = CURRENT_USER.badges.map(b => b.id);

  const renderBadge = (badge: Badge | Omit<Badge, 'earnedAt'>, earned: boolean) => {
    return (
      <View
        key={badge.id}
        style={[
          styles.badgeCard,
          {
            backgroundColor: colors.card,
            borderColor: earned ? colors.primary : colors.outline,
            opacity: earned ? 1 : 0.6,
          },
        ]}
      >
        <View style={[styles.badgeIcon, { backgroundColor: colors.primary + '20' }]}>
          <IconSymbol name={badge.icon} size={40} color={earned ? colors.primary : colors.textSecondary} />
        </View>
        <View style={styles.badgeInfo}>
          <Text style={[styles.badgeName, { color: colors.text }]}>{badge.name}</Text>
          <Text style={[styles.badgeDescription, { color: colors.textSecondary }]}>
            {badge.description}
          </Text>
          {earned && 'earnedAt' in badge && (
            <Text style={[styles.earnedDate, { color: colors.primary }]}>
              Earned {badge.earnedAt.toLocaleDateString()}
            </Text>
          )}
          {!earned && (
            <View style={[styles.lockedBadge, { backgroundColor: colors.textSecondary + '20' }]}>
              <IconSymbol name="lock.fill" size={12} color={colors.textSecondary} />
              <Text style={[styles.lockedText, { color: colors.textSecondary }]}>Locked</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const categories = [
    { id: 'onboarding', name: 'Onboarding', icon: 'person.badge.plus' },
    { id: 'contribution', name: 'Contribution', icon: 'hand.raised.fill' },
    { id: 'community', name: 'Community', icon: 'person.3.fill' },
    { id: 'achievement', name: 'Achievement', icon: 'trophy.fill' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>Badges</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {CURRENT_USER.badges.length} of {AVAILABLE_BADGES.length} earned
          </Text>
        </View>
      </View>

      <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.outline }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{CURRENT_USER.badges.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Earned</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.outline }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.textSecondary }]}>
            {AVAILABLE_BADGES.length - CURRENT_USER.badges.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Remaining</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.outline }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {Math.round((CURRENT_USER.badges.length / AVAILABLE_BADGES.length) * 100)}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Complete</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => {
          const categoryBadges = AVAILABLE_BADGES.filter(b => b.category === category.id);
          const earnedInCategory = categoryBadges.filter(b => earnedBadgeIds.includes(b.id));

          return (
            <View key={category.id} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <IconSymbol name={category.icon} size={24} color={colors.primary} />
                <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.name}</Text>
                <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
                  {earnedInCategory.length}/{categoryBadges.length}
                </Text>
              </View>

              {categoryBadges.map((badge) => {
                const earned = earnedBadgeIds.includes(badge.id);
                const earnedBadge = CURRENT_USER.badges.find(b => b.id === badge.id);
                return renderBadge(earnedBadge || badge, earned);
              })}
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    width: 2,
    marginHorizontal: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  badgeCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    gap: 16,
  },
  badgeIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    marginBottom: 6,
  },
  earnedDate: {
    fontSize: 12,
    fontWeight: '600',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  lockedText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
