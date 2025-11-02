
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { scrapingScheduler, ScrapingConfig } from '@/services/scrapingScheduler';
import { zohoApi, ZOHO_SETUP_INSTRUCTIONS } from '@/services/zohoApi';
import { CURRENT_USER, isAdmin, isVerified } from '@/data/users';
import { useRouter } from 'expo-router';
import AdBanner from '@/components/AdBanner';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const [schedulerStatus, setSchedulerStatus] = useState<ScrapingConfig | null>(null);
  const [schedulerEnabled, setSchedulerEnabled] = useState(true);

  const userIsAdmin = isAdmin(CURRENT_USER);
  const userIsVerified = isVerified(CURRENT_USER);

  useEffect(() => {
    // Get initial scheduler status
    const status = scrapingScheduler.getStatus();
    setSchedulerStatus(status);
    setSchedulerEnabled(status.enabled);

    // Start scheduler if admin
    if (userIsAdmin) {
      scrapingScheduler.start();
    }

    return () => {
      // Cleanup
      if (userIsAdmin) {
        scrapingScheduler.stop();
      }
    };
  }, []);

  const toggleScheduler = (value: boolean) => {
    if (!userIsAdmin) {
      Alert.alert('Admin Only', 'Web scraping settings are only available to administrators');
      return;
    }

    setSchedulerEnabled(value);
    scrapingScheduler.updateConfig({ enabled: value });
    
    if (value) {
      scrapingScheduler.start();
      Alert.alert('Scheduler Enabled', 'Web scraping will run every Monday at 11:59 PM CST');
    } else {
      scrapingScheduler.stop();
      Alert.alert('Scheduler Disabled', 'Automatic web scraping has been disabled');
    }
  };

  const triggerManualScraping = async () => {
    if (!userIsAdmin) {
      Alert.alert('Admin Only', 'Manual scraping is only available to administrators');
      return;
    }

    Alert.alert(
      'Manual Scraping',
      'This will trigger an immediate scraping of metal prices. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: async () => {
            try {
              console.log('Starting manual scraping...');
              await scrapingScheduler.triggerManualScraping();
              Alert.alert('Success', 'Manual scraping completed successfully');
            } catch (error) {
              console.error('Manual scraping error:', error);
              Alert.alert('Error', 'Failed to complete manual scraping');
            }
          },
        },
      ]
    );
  };

  const showZohoSetup = () => {
    if (!userIsAdmin) {
      Alert.alert('Admin Only', 'Zoho integration settings are only available to administrators');
      return;
    }

    Alert.alert(
      'Zoho API Setup',
      ZOHO_SETUP_INSTRUCTIONS,
      [{ text: 'OK' }]
    );
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not scheduled';
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profile & Settings</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {CURRENT_USER.name}
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AdMob Banner at the top */}
        <View style={styles.adContainer}>
          <AdBanner />
        </View>

        {/* User Profile Section */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="person.circle.fill" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Information</Text>
          </View>

          <View style={styles.profileInfo}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="person.fill" size={40} color={colors.primary} />
            </View>
            <View style={styles.profileDetails}>
              <View style={styles.nameRow}>
                <Text style={[styles.profileName, { color: colors.text }]}>{CURRENT_USER.name}</Text>
                {userIsVerified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
                    <IconSymbol name="checkmark.seal.fill" size={16} color="#FFFFFF" />
                  </View>
                )}
                {userIsAdmin && (
                  <View style={[styles.adminBadge, { backgroundColor: colors.secondary }]}>
                    <Text style={styles.adminBadgeText}>ADMIN</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{CURRENT_USER.email}</Text>
              {CURRENT_USER.phone && (
                <Text style={[styles.profilePhone, { color: colors.textSecondary }]}>{CURRENT_USER.phone}</Text>
              )}
            </View>
          </View>

          {/* Verification Status */}
          <View style={[styles.statusCard, { backgroundColor: colors.background, borderColor: colors.outline }]}>
            <View style={styles.statusHeader}>
              <IconSymbol 
                name={userIsVerified ? "checkmark.circle.fill" : "exclamationmark.circle.fill"} 
                size={20} 
                color={userIsVerified ? colors.primary : colors.textSecondary} 
              />
              <Text style={[styles.statusTitle, { color: colors.text }]}>Verification Status</Text>
            </View>
            
            <View style={styles.verificationList}>
              <View style={styles.verificationItem}>
                <IconSymbol 
                  name={CURRENT_USER.emailVerified ? "checkmark.circle.fill" : "circle"} 
                  size={18} 
                  color={CURRENT_USER.emailVerified ? colors.primary : colors.textSecondary} 
                />
                <Text style={[styles.verificationText, { color: colors.text }]}>Email Verified</Text>
              </View>
              <View style={styles.verificationItem}>
                <IconSymbol 
                  name={CURRENT_USER.phoneVerified ? "checkmark.circle.fill" : "circle"} 
                  size={18} 
                  color={CURRENT_USER.phoneVerified ? colors.primary : colors.textSecondary} 
                />
                <Text style={[styles.verificationText, { color: colors.text }]}>Phone Verified</Text>
              </View>
              <View style={styles.verificationItem}>
                <IconSymbol 
                  name={CURRENT_USER.onboardingCompleted ? "checkmark.circle.fill" : "circle"} 
                  size={18} 
                  color={CURRENT_USER.onboardingCompleted ? colors.primary : colors.textSecondary} 
                />
                <Text style={[styles.verificationText, { color: colors.text }]}>Onboarding Complete</Text>
              </View>
            </View>

            {!userIsVerified && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/onboarding')}
                activeOpacity={0.7}
              >
                <IconSymbol name="checkmark.seal.fill" size={18} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Complete Verification</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Badges Section */}
        <TouchableOpacity
          style={[styles.section, { backgroundColor: colors.card, borderColor: colors.outline }]}
          onPress={() => router.push('/badges')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <IconSymbol name="star.fill" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Badges & Achievements</Text>
            <View style={[styles.badgeCount, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeCountText}>{CURRENT_USER.badges.length}</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Track your progress and unlock achievements by contributing to the MetalMayhem community
          </Text>

          {CURRENT_USER.badges.length > 0 ? (
            <View style={styles.badgePreview}>
              {CURRENT_USER.badges.slice(0, 4).map((badge) => (
                <View
                  key={badge.id}
                  style={[styles.badgeIcon, { backgroundColor: colors.primary + '20' }]}
                >
                  <IconSymbol name={badge.icon} size={24} color={colors.primary} />
                </View>
              ))}
              {CURRENT_USER.badges.length > 4 && (
                <View style={[styles.badgeMore, { backgroundColor: colors.textSecondary + '20' }]}>
                  <Text style={[styles.badgeMoreText, { color: colors.textSecondary }]}>
                    +{CURRENT_USER.badges.length - 4}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={[styles.emptyBadges, { backgroundColor: colors.background }]}>
              <IconSymbol name="star" size={32} color={colors.textSecondary} />
              <Text style={[styles.emptyBadgesText, { color: colors.textSecondary }]}>
                No badges earned yet. Start contributing to unlock achievements!
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* AdMob Banner in the middle */}
        <View style={styles.adContainer}>
          <AdBanner />
        </View>

        {/* Admin-Only Web Scraping Section */}
        {userIsAdmin && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.outline }]}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="globe" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Web Scraping</Text>
              <View style={[styles.adminBadge, { backgroundColor: colors.secondary, marginLeft: 8 }]}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            </View>

            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Configure automated web scraping for metal prices. For production, implement this on a backend server with a cron job or cloud function (AWS Lambda, Google Cloud Functions) to ensure reliable execution.
            </Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Auto Scraping</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Automatically scrape prices every Monday at 11:59 PM CST
                </Text>
              </View>
              <Switch
                value={schedulerEnabled}
                onValueChange={toggleScheduler}
                trackColor={{ false: colors.textSecondary, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            {schedulerStatus && (
              <>
                <View style={styles.infoBox}>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Status:</Text>
                    <Text style={[styles.infoValue, { color: schedulerEnabled ? colors.primary : colors.textSecondary }]}>
                      {schedulerEnabled ? 'Active' : 'Disabled'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Last Run:</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {schedulerStatus.lastRun ? formatDate(schedulerStatus.lastRun) : 'Never'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Next Run:</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {formatDate(schedulerStatus.nextRun)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  onPress={triggerManualScraping}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="arrow.clockwise" size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Trigger Manual Scraping</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Admin-Only Zoho Integration Section */}
        {userIsAdmin && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.outline }]}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="cloud.fill" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Zoho Integration</Text>
              <View style={[styles.adminBadge, { backgroundColor: colors.secondary, marginLeft: 8 }]}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            </View>

            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Zoho API enables cloud storage for pricing tickets, yard data, and scraped metal prices. This is an admin-only feature for managing operational data.
            </Text>

            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Submit pricing tickets online
                </Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Store yard information in cloud
                </Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Sync scraped pricing data
                </Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Access data across devices
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={showZohoSetup}
              activeOpacity={0.7}
            >
              <IconSymbol name="info.circle.fill" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>View Setup Instructions</Text>
            </TouchableOpacity>

            <View style={[styles.statusBox, { backgroundColor: colors.background, borderColor: colors.outline }]}>
              <IconSymbol 
                name={zohoApi.isAuthenticated() ? "checkmark.circle.fill" : "xmark.circle.fill"} 
                size={20} 
                color={zohoApi.isAuthenticated() ? colors.primary : colors.textSecondary} 
              />
              <Text style={[styles.statusText, { color: colors.text }]}>
                Status: {zohoApi.isAuthenticated() ? 'Connected' : 'Not Connected'}
              </Text>
            </View>
          </View>
        )}

        {/* App Info Section */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About MetalMayhem</Text>
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            A community-driven app for real-time scrap metal pricing and local recycling yard discovery.
          </Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={[styles.infoCardValue, { color: colors.primary }]}>30+</Text>
              <Text style={[styles.infoCardLabel, { color: colors.textSecondary }]}>Metal Types</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={[styles.infoCardValue, { color: colors.primary }]}>Weekly</Text>
              <Text style={[styles.infoCardLabel, { color: colors.textSecondary }]}>Price Updates</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={[styles.infoCardValue, { color: colors.primary }]}>Cloud</Text>
              <Text style={[styles.infoCardLabel, { color: colors.textSecondary }]}>Storage</Text>
            </View>
          </View>
        </View>

        {/* Bottom AdMob Banner */}
        <View style={styles.adContainer}>
          <AdBanner />
        </View>

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
  adContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    marginTop: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  verificationList: {
    gap: 10,
    marginBottom: 12,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verificationText: {
    fontSize: 15,
    fontWeight: '500',
  },
  badgeCount: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  badgePreview: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeMore: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeMoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyBadges: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    borderRadius: 12,
    marginTop: 8,
  },
  emptyBadgesText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  infoBox: {
    gap: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 0.3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '400',
    flex: 0.7,
    textAlign: 'right',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 16,
  },
  featureList: {
    gap: 12,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 12,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoCardValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  infoCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
