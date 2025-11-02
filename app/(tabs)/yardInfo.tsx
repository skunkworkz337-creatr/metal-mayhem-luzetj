
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { zohoApi, PricingTicket, ZOHO_SETUP_INSTRUCTIONS } from '@/services/zohoApi';

export default function YardInfoScreen() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const isDark = colorScheme === 'dark';

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedYard, setSelectedYard] = useState<any>(null);
  const [ticketForm, setTicketForm] = useState({
    metalType: '',
    metalGrade: '',
    pricePerPound: '',
    quantity: '',
    notes: '',
  });

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

  const openTicketModal = (yard: any) => {
    setSelectedYard(yard);
    setShowTicketModal(true);
  };

  const closeTicketModal = () => {
    setShowTicketModal(false);
    setSelectedYard(null);
    setTicketForm({
      metalType: '',
      metalGrade: '',
      pricePerPound: '',
      quantity: '',
      notes: '',
    });
  };

  const submitTicket = async () => {
    if (!ticketForm.metalType || !ticketForm.pricePerPound) {
      Alert.alert('Missing Information', 'Please fill in metal type and price per pound.');
      return;
    }

    try {
      const ticket: PricingTicket = {
        userId: 'user123', // Replace with actual user ID
        userName: 'Current User', // Replace with actual user name
        yardName: selectedYard.name,
        yardAddress: selectedYard.address,
        metalType: ticketForm.metalType,
        metalGrade: ticketForm.metalGrade,
        pricePerPound: parseFloat(ticketForm.pricePerPound),
        quantity: ticketForm.quantity ? parseFloat(ticketForm.quantity) : undefined,
        totalAmount: ticketForm.quantity 
          ? parseFloat(ticketForm.quantity) * parseFloat(ticketForm.pricePerPound)
          : undefined,
        timestamp: new Date(),
        verified: false,
        notes: ticketForm.notes,
      };

      console.log('Submitting ticket:', ticket);
      
      // Note: Zoho API needs to be configured first
      // await zohoApi.submitPricingTicket(ticket);
      
      Alert.alert(
        'Ticket Submitted',
        'Your pricing information has been submitted for verification. Thank you for contributing to the community!',
        [{ text: 'OK', onPress: closeTicketModal }]
      );
    } catch (error) {
      console.error('Error submitting ticket:', error);
      Alert.alert('Error', 'Failed to submit ticket. Please try again.');
    }
  };

  const showZohoSetup = () => {
    Alert.alert(
      'Zoho API Setup Required',
      ZOHO_SETUP_INSTRUCTIONS,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Yard Info & Pricing</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Local recycling yards near you
        </Text>
      </View>

      {/* Zoho Setup Banner */}
      <TouchableOpacity 
        style={[styles.setupBanner, { backgroundColor: colors.primary + '20', borderColor: colors.outline }]}
        onPress={showZohoSetup}
        activeOpacity={0.7}
      >
        <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
        <Text style={[styles.setupText, { color: colors.primary }]}>
          Tap to view Zoho API setup instructions
        </Text>
      </TouchableOpacity>
      
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

            {/* Submit Pricing Button */}
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={() => openTicketModal(yard)}
              activeOpacity={0.7}
            >
              <IconSymbol name="doc.text.fill" size={18} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Submit Pricing</Text>
            </TouchableOpacity>
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

      {/* Ticket Submission Modal */}
      <Modal
        visible={showTicketModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeTicketModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Submit Pricing</Text>
              <TouchableOpacity onPress={closeTicketModal}>
                <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalYardName, { color: colors.primary }]}>
                {selectedYard?.name}
              </Text>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Metal Type *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.outline }]}
                  placeholder="e.g., Copper, Aluminum"
                  placeholderTextColor={colors.textSecondary}
                  value={ticketForm.metalType}
                  onChangeText={(text) => setTicketForm({ ...ticketForm, metalType: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Metal Grade</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.outline }]}
                  placeholder="e.g., #1 Bare Bright Copper"
                  placeholderTextColor={colors.textSecondary}
                  value={ticketForm.metalGrade}
                  onChangeText={(text) => setTicketForm({ ...ticketForm, metalGrade: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Price Per Pound *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.outline }]}
                  placeholder="e.g., 3.50"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={ticketForm.pricePerPound}
                  onChangeText={(text) => setTicketForm({ ...ticketForm, pricePerPound: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Quantity (lbs)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.outline }]}
                  placeholder="Optional"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={ticketForm.quantity}
                  onChangeText={(text) => setTicketForm({ ...ticketForm, quantity: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Notes</Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.outline }]}
                  placeholder="Additional information..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  value={ticketForm.notes}
                  onChangeText={(text) => setTicketForm({ ...ticketForm, notes: text })}
                />
              </View>

              <TouchableOpacity 
                style={[styles.submitModalButton, { backgroundColor: colors.primary }]}
                onPress={submitTicket}
                activeOpacity={0.7}
              >
                <Text style={styles.submitModalButtonText}>Submit Ticket</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.cancelButton, { borderColor: colors.outline }]}
                onPress={closeTicketModal}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  setupBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  setupText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
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
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  modalScroll: {
    maxHeight: '100%',
  },
  modalYardName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitModalButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  submitModalButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 20,
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
});
