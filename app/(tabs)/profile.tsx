
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { CURRENT_USER, isAdmin, isVerified } from '@/data/users';
import AdBanner from '@/components/AdBanner';
import { zohoApi, ZOHO_SETUP_INSTRUCTIONS } from '@/services/zohoApi';
import { scrapingScheduler, ScrapingConfig } from '@/services/scrapingScheduler';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const isDark = colorScheme === 'dark';
  
  const [schedulerEnabled, setSchedulerEnabled] = useState(true);
  const [schedulerConfig, setSchedulerConfig] = useState<ScrapingConfig | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Load scheduler status
    const config = scrapingScheduler.getStatus();
    setSchedulerConfig(config);
    setSchedulerEnabled(config.enabled);
  }, []);

  const toggleScheduler = (value: boolean) => {
    setSchedulerEnabled(value);
    scrapingScheduler.updateConfig({ enabled: value });
    
    if (value) {
      scrapingScheduler.start();
      Alert.alert('Scheduler Enabled', 'Web scraping scheduler has been started.');
    } else {
      scrapingScheduler.stop();
      Alert.alert('Scheduler Disabled', 'Web scraping scheduler has been stopped.');
    }
    
    // Refresh config
    const config = scrapingScheduler.getStatus();
    setSchedulerConfig(config);
  };

  const triggerManualScraping = async () => {
    if (isUpdating) {
      Alert.alert('Update in Progress', 'A pricing update is already in progress. Please wait.');
      return;
    }

    Alert.alert(
      'Force Update Pricing',
      'This will fetch the latest pricing data from Gumloop immediately. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update Now',
          style: 'default',
          onPress: async () => {
            setIsUpdating(true);
            try {
              console.log('🔄 Starting force update...');
              const prices = await scrapingScheduler.forceUpdate();
              
              Alert.alert(
                'Update Complete',
                `Successfully updated ${prices.length} metal prices from Gumloop.\n\nSource: ${prices[0]?.source || 'unknown'}\nTimestamp: ${new Date().toLocaleString()}`,
                [{ text: 'OK' }]
              );
              
              // Refresh config to show new last run time
              const config = scrapingScheduler.getStatus();
              setSchedulerConfig(config);
            } catch (error) {
              console.error('Force update error:', error);
              Alert.alert(
                'Update Failed',
                'Failed to fetch pricing data from Gumloop. Using cached data.\n\nError: ' + (error as Error).message,
                [{ text: 'OK' }]
              );
            } finally {
              setIsUpdating(false);
            }
          },
        },
      ]
    );
  };

  const showZohoSetup = () => {
    Alert.alert(
      'Zoho Integration Setup',
      ZOHO_SETUP_INSTRUCTIONS,
      [{ text: 'OK' }]
    );
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
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
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
              <Text style={[styles.userPlan, { color: colors.primary }]}>
                {CURRENT_USER.subscription} Plan
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.badgesButton, { backgroundColor: colors.background, borderColor: colors.outline }]}
            onPress={() => router.push('/badges')}
            activeOpacity={0.7}
          >
            <IconSymbol name="trophy.fill" size={20} color={colors.primary} />
            <Text style={[styles.badgesText, { color: colors.text }]}>
              View Badges & Achievements
            </Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Admin Controls */}
        {isAdmin() && (
          <>
            <View style={styles.sectionHeader}>
              <IconSymbol name="gearshape.fill" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Admin Controls</Text>
            </View>

            {/* Gumloop Integration Status */}
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.outline }]}>
              <View style={styles.cardHeader}>
                <IconSymbol name="arrow.triangle.2.circlepath" size={24} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>Gumloop Integration</Text>
              </View>
              
              <View style={[styles.infoBox, { backgroundColor: colors.background, borderColor: colors.outline }]}>
                <IconSymbol name="info.circle.fill" size={16} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  Pricing data is automatically fetched from Gumloop every Monday at 11:59 PM CST
                </Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>API Endpoint:</Text>
                <Text style={[styles.statusValue, { color: colors.text }]} numberOfLines={1}>
                  {scrapingScheduler.getGumloopUrl().substring(0, 40)}...
                </Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Last Update:</Text>
                <Text style={[styles.statusValue, { color: colors.text }]}>
                  {formatDate(schedulerConfig?.lastRun || null)}
                </Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Next Scheduled:</Text>
                <Text style={[styles.statusValue, { color: colors.text }]}>
                  {formatDate(schedulerConfig?.nextRun || null)}
                </Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Cached Prices:</Text>
                <Text style={[styles.statusValue, { color: colors.primary }]}>
                  {scrapingScheduler.getCachedPrices().length} metals
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.forceUpdateButton,
                  { 
                    backgroundColor: colors.primary,
                    opacity: isUpdating ? 0.6 : 1,
                  }
                ]}
                onPress={triggerManualScraping}
                disabled={isUpdating}
                activeOpacity={0.7}
              >
                <IconSymbol 
                  name={isUpdating ? "arrow.triangle.2.circlepath" : "arrow.clockwise"} 
                  size={20} 
                  color="#FFFFFF" 
                />
                <Text style={styles.forceUpdateText}>
                  {isUpdating ? 'Updating...' : 'Force Update Now'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Web Scraping Scheduler */}
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.outline }]}>
              <View style={styles.cardHeader}>
                <IconSymbol name="clock.fill" size={24} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>Scraping Scheduler</Text>
              </View>
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Enable Scheduler</Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Automatically fetch pricing every Monday at 11:59 PM CST
                  </Text>
                </View>
                <Switch
                  value={schedulerEnabled}
                  onValueChange={toggleScheduler}
                  trackColor={{ false: colors.outline, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Zoho Integration */}
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.outline }]}>
              <View style={styles.cardHeader}>
                <IconSymbol name="cloud.fill" size={24} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>Zoho Integration</Text>
              </View>
              
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                Secure cloud storage for operational data and pricing tickets
              </Text>

              <TouchableOpacity
                style={[styles.setupButton, { backgroundColor: colors.background, borderColor: colors.outline }]}
                onPress={showZohoSetup}
                activeOpacity={0.7}
              >
                <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
                <Text style={[styles.setupButtonText, { color: colors.text }]}>
                  View Setup Instructions
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Account Settings */}
        <View style={styles.sectionHeader}>
          <IconSymbol name="person.fill" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Settings</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <IconSymbol name="envelope.fill" size={20} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>Email Preferences</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.outline }]} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <IconSymbol name="bell.fill" size={20} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>Notifications</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.outline }]} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <IconSymbol name="lock.fill" size={20} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>Privacy & Security</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Subscription */}
        <View style={styles.sectionHeader}>
          <IconSymbol name="creditcard.fill" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Subscription</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <View style={styles.subscriptionInfo}>
            <Text style={[styles.subscriptionPlan, { color: colors.text }]}>
              {CURRENT_USER.subscription} Plan
            </Text>
            <Text style={[styles.subscriptionPrice, { color: colors.primary }]}>
              {CURRENT_USER.subscription === 'Free' ? 'Free' : 
               CURRENT_USER.subscription === 'Pro' ? '$1/month' : '$3/month'}
            </Text>
          </View>

          {CURRENT_USER.subscription === 'Free' && (
            <TouchableOpacity
              style={[styles.upgradeButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.7}
            >
              <IconSymbol name="arrow.up.circle.fill" size={20} color="#FFFFFF" />
              <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Support */}
        <View style={styles.sectionHeader}>
          <IconSymbol name="questionmark.circle.fill" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <IconSymbol name="book.fill" size={20} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>Help Center</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.outline }]} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <IconSymbol name="message.fill" size={20} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>Contact Support</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.outline }]} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <IconSymbol name="doc.text.fill" size={20} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>Terms & Privacy</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.card, borderColor: colors.outline }]}
          activeOpacity={0.7}
        >
          <IconSymbol name="arrow.right.square.fill" size={20} color="#FF3B30" />
          <Text style={[styles.logoutText, { color: '#FF3B30' }]}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      <AdBanner />
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
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
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
    fontWeight: '400',
    marginBottom: 4,
  },
  userPlan: {
    fontSize: 14,
    fontWeight: '600',
  },
  badgesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  badgesText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 12,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
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
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  forceUpdateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  forceUpdateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
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
    lineHeight: 18,
  },
  setupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  setupButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  subscriptionInfo: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 12,
  },
  subscriptionPlan: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subscriptionPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
