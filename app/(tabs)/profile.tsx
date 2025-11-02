
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { scrapingScheduler, ScrapingConfig } from '@/services/scrapingScheduler';
import { zohoApi, ZOHO_SETUP_INSTRUCTIONS } from '@/services/zohoApi';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const isDark = colorScheme === 'dark';

  const [schedulerStatus, setSchedulerStatus] = useState<ScrapingConfig | null>(null);
  const [schedulerEnabled, setSchedulerEnabled] = useState(true);

  useEffect(() => {
    // Get initial scheduler status
    const status = scrapingScheduler.getStatus();
    setSchedulerStatus(status);
    setSchedulerEnabled(status.enabled);

    // Start scheduler
    scrapingScheduler.start();

    return () => {
      // Cleanup
      scrapingScheduler.stop();
    };
  }, []);

  const toggleScheduler = (value: boolean) => {
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
        <Text style={[styles.title, { color: colors.text }]}>Settings & Profile</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Manage app settings and integrations
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Web Scraping Section */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="globe" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Web Scraping</Text>
          </View>

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

        {/* Zoho Integration Section */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="cloud.fill" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Zoho Integration</Text>
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Zoho API enables cloud storage for pricing tickets, yard data, and scraped metal prices.
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
