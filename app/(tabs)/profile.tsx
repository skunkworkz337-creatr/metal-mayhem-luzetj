
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { CURRENT_USER, isAdmin, isVerified } from '@/data/users';
import AdBanner from '@/components/AdBanner';
import { useRouter } from 'expo-router';
import { zohoApi, ZOHO_SETUP_INSTRUCTIONS } from '@/services/zohoApi';
import { IconSymbol } from '@/components/IconSymbol';
import { scrapingScheduler, ScrapingConfig } from '@/services/scrapingScheduler';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const isDark = colorScheme === 'dark';
  
  const [schedulerConfig, setSchedulerConfig] = useState<ScrapingConfig>(scrapingScheduler.getStatus());

  useEffect(() => {
    // Update scheduler status every minute
    const interval = setInterval(() => {
      setSchedulerConfig(scrapingScheduler.getStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const toggleScheduler = (value: boolean) => {
    if (value) {
      scrapingScheduler.start();
      Alert.alert('Scheduler Started', 'Web scraping scheduler is now active and will fetch pricing data from Gumloop every Monday at 11:59 PM CST.');
    } else {
      scrapingScheduler.stop();
      Alert.alert('Scheduler Stopped', 'Web scraping scheduler has been stopped.');
    }
    setSchedulerConfig(scrapingScheduler.getStatus());
  };

  const triggerManualScraping = async () => {
    Alert.alert(
      'Manual Scraping',
      'This will fetch the latest pricing data from Gumloop. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Fetch Now',
          onPress: async () => {
            try {
              console.log('Triggering manual scraping from Gumloop...');
              await scrapingScheduler.triggerManualScraping();
              Alert.alert('Success', 'Pricing data has been fetched from Gumloop successfully!');
              setSchedulerConfig(scrapingScheduler.getStatus());
            } catch (error) {
              console.error('Manual scraping error:', error);
              Alert.alert('Error', 'Failed to fetch pricing data. Please try again later.');
            }
          }
        }
      ]
    );
  };

  const showZohoSetup = () => {
    Alert.alert('Zoho Setup', ZOHO_SETUP_INSTRUCTIONS);
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Never';
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile & Settings</Text>
        </View>

        {/* User Info Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <View style={styles.userHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {CURRENT_USER.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.userName, { color: colors.text }]}>{CURRENT_USER.name}</Text>
                {isVerified() && (
                  <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
                    <IconSymbol name="checkmark.seal.fill" size={16} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{CURRENT_USER.email}</Text>
              <Text style={[styles.userPhone, { color: colors.textSecondary }]}>{CURRENT_USER.phone}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.badgesButton}
            onPress={() => router.push('/badges')}
            activeOpacity={0.7}
          >
            <IconSymbol name="trophy.fill" size={20} color={colors.primary} />
            <Text style={[styles.badgesButtonText, { color: colors.primary }]}>
              View Badges ({CURRENT_USER.badges.length})
            </Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Gumloop Integration Status */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <View style={styles.cardHeader}>
            <IconSymbol name="arrow.triangle.2.circlepath" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Gumloop Integration</Text>
          </View>
          
          <View style={[styles.infoBox, { backgroundColor: colors.background, borderColor: colors.outline }]}>
            <IconSymbol name="link" size={16} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={1}>
              {scrapingScheduler.getGumloopUrl()}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Status:</Text>
            <Text style={[styles.statusValue, { color: colors.primary }]}>
              {schedulerConfig.enabled ? 'Active' : 'Inactive'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Last Update:</Text>
            <Text style={[styles.statusValue, { color: colors.text }]}>
              {formatDate(schedulerConfig.lastRun)}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Next Update:</Text>
            <Text style={[styles.statusValue, { color: colors.text }]}>
              {formatDate(schedulerConfig.nextRun)}
            </Text>
          </View>

          <Text style={[styles.scheduleInfo, { color: colors.textSecondary }]}>
            Automatic updates every Monday at 11:59 PM CST
          </Text>
        </View>

        {/* Admin Controls */}
        {isAdmin() && (
          <>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.outline }]}>
              <View style={styles.cardHeader}>
                <IconSymbol name="gear" size={24} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>Admin Controls</Text>
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Web Scraping Scheduler</Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Automatically fetch pricing from Gumloop
                  </Text>
                </View>
                <Switch
                  value={schedulerConfig.enabled}
                  onValueChange={toggleScheduler}
                  trackColor={{ false: colors.textSecondary, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={triggerManualScraping}
                activeOpacity={0.7}
              >
                <IconSymbol name="arrow.clockwise" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Fetch Pricing Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.outline, borderWidth: 2 }]}
                onPress={showZohoSetup}
                activeOpacity={0.7}
              >
                <IconSymbol name="cloud" size={20} color={colors.primary} />
                <Text style={[styles.actionButtonTextOutline, { color: colors.primary }]}>Zoho Setup Instructions</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Subscription Info */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <View style={styles.cardHeader}>
            <IconSymbol name="star.fill" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Subscription</Text>
          </View>
          
          <View style={styles.subscriptionInfo}>
            <Text style={[styles.subscriptionTier, { color: colors.text }]}>
              {CURRENT_USER.subscription.tier === 'free' ? 'Free' : 
               CURRENT_USER.subscription.tier === 'pro' ? 'Pro' : 'Yard Pro'}
            </Text>
            {CURRENT_USER.subscription.tier !== 'free' && (
              <Text style={[styles.subscriptionExpiry, { color: colors.textSecondary }]}>
                Renews on {new Date(CURRENT_USER.subscription.expiresAt!).toLocaleDateString()}
              </Text>
            )}
          </View>

          {CURRENT_USER.subscription.tier === 'free' && (
            <TouchableOpacity
              style={[styles.upgradeButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.7}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
              <IconSymbol name="arrow.right" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* App Info */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <View style={styles.cardHeader}>
            <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>About</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Version</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Data Source</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>Gumloop API</Text>
          </View>
        </View>

        {/* Ad Banner for Free Users */}
        {CURRENT_USER.subscription.tier === 'free' && (
          <View style={styles.adContainer}>
            <AdBanner />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    fontWeight: '500',
  },
  badgesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
  badgesButtonText: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  scheduleInfo: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    fontWeight: '400',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionButtonTextOutline: {
    fontSize: 16,
    fontWeight: '700',
  },
  subscriptionInfo: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  subscriptionTier: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  subscriptionExpiry: {
    fontSize: 14,
    fontWeight: '500',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  adContainer: {
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
});
