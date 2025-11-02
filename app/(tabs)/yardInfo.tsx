
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { zohoApi, PricingTicket, ZOHO_SETUP_INSTRUCTIONS } from '@/services/zohoApi';
import { CURRENT_USER } from '@/data/users';

export default function YardInfoScreen() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const isDark = colorScheme === 'dark';

  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [selectedYard, setSelectedYard] = useState<any>(null);
  const [metalType, setMetalType] = useState('');
  const [metalGrade, setMetalGrade] = useState('');
  const [pricePerPound, setPricePerPound] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  const yards = [
    {
      id: 'yard-1',
      name: 'Austin Metal Recycling',
      address: '123 Industrial Blvd',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      phone: '(512) 555-0100',
      hours: 'Mon-Fri: 8AM-5PM, Sat: 9AM-2PM',
      acceptedMetals: ['Copper', 'Aluminum', 'Steel', 'Brass', 'Stainless Steel'],
      verified: true,
      rating: 4.8,
    },
    {
      id: 'yard-2',
      name: 'Texas Scrap Yard',
      address: '456 Commerce St',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      phone: '(214) 555-0200',
      hours: 'Mon-Sat: 7AM-6PM',
      acceptedMetals: ['Copper', 'Aluminum', 'Steel', 'Iron', 'Lead'],
      verified: true,
      rating: 4.6,
    },
    {
      id: 'yard-3',
      name: 'Houston Metal Works',
      address: '789 Industrial Way',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      phone: '(713) 555-0300',
      hours: 'Mon-Fri: 8AM-5PM',
      acceptedMetals: ['Copper', 'Aluminum', 'Brass', 'Bronze'],
      verified: false,
      rating: 4.2,
    },
  ];

  const openTicketModal = (yard: typeof yards[0]) => {
    setSelectedYard(yard);
    setTicketModalVisible(true);
  };

  const closeTicketModal = () => {
    setTicketModalVisible(false);
    setSelectedYard(null);
    setMetalType('');
    setMetalGrade('');
    setPricePerPound('');
    setQuantity('');
    setNotes('');
  };

  const submitTicket = async () => {
    if (!metalType || !metalGrade || !pricePerPound) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const ticket: PricingTicket = {
      userId: CURRENT_USER.id,
      userName: CURRENT_USER.name,
      yardName: selectedYard.name,
      yardAddress: `${selectedYard.address}, ${selectedYard.city}, ${selectedYard.state} ${selectedYard.zipCode}`,
      metalType,
      metalGrade,
      pricePerPound: parseFloat(pricePerPound),
      quantity: quantity ? parseFloat(quantity) : undefined,
      totalAmount: quantity ? parseFloat(quantity) * parseFloat(pricePerPound) : undefined,
      timestamp: new Date(),
      verified: CURRENT_USER.verified,
      notes,
    };

    try {
      console.log('Submitting pricing ticket:', ticket);
      // In production, this would call the Zoho API
      // await zohoApi.submitPricingTicket(ticket);
      
      Alert.alert('Success', 'Pricing ticket submitted successfully!');
      closeTicketModal();
    } catch (error) {
      console.error('Error submitting ticket:', error);
      Alert.alert('Error', 'Failed to submit pricing ticket');
    }
  };

  const showZohoSetup = () => {
    Alert.alert('Zoho API Setup', ZOHO_SETUP_INSTRUCTIONS, [{ text: 'OK' }]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Scrap Yards</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Local yards and current pricing
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {yards.map((yard) => (
          <View
            key={yard.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.outline,
              },
              isDark && styles.cardDark,
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.nameRow}>
                <Text style={[styles.yardName, { color: colors.text }]}>{yard.name}</Text>
                {yard.verified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
                    <IconSymbol name="checkmark.seal.fill" size={16} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <View style={styles.rating}>
                <IconSymbol name="star.fill" size={16} color={colors.secondary} />
                <Text style={[styles.ratingText, { color: colors.text }]}>{yard.rating}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <IconSymbol name="location.fill" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                {yard.address}, {yard.city}, {yard.state} {yard.zipCode}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <IconSymbol name="phone.fill" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{yard.phone}</Text>
            </View>

            <View style={styles.infoRow}>
              <IconSymbol name="clock.fill" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{yard.hours}</Text>
            </View>

            <View style={styles.metalsSection}>
              <Text style={[styles.metalsLabel, { color: colors.textSecondary }]}>Accepted Metals:</Text>
              <View style={styles.metalTags}>
                {yard.acceptedMetals.map((metal, index) => (
                  <View key={index} style={[styles.metalTag, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
                    <Text style={[styles.metalTagText, { color: colors.primary }]}>{metal}</Text>
                  </View>
                ))}
              </View>
            </View>

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

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Pricing Ticket Modal */}
      <Modal
        visible={ticketModalVisible}
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
              {selectedYard && (
                <Text style={[styles.modalYardName, { color: colors.textSecondary }]}>
                  {selectedYard.name}
                </Text>
              )}

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Metal Type *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.outline }]}
                  value={metalType}
                  onChangeText={setMetalType}
                  placeholder="e.g., Copper"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Metal Grade *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.outline }]}
                  value={metalGrade}
                  onChangeText={setMetalGrade}
                  placeholder="e.g., #1 Bare Bright"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Price per Pound ($) *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.outline }]}
                  value={pricePerPound}
                  onChangeText={setPricePerPound}
                  placeholder="e.g., 3.50"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Quantity (lbs)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.outline }]}
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="Optional"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Notes</Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.outline }]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Additional information..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={submitTicket}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>Submit Ticket</Text>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  yardName: {
    fontSize: 18,
    fontWeight: '700',
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  metalsSection: {
    marginTop: 12,
    marginBottom: 16,
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
    borderRadius: 16,
    borderWidth: 1,
  },
  metalTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  modalScroll: {
    maxHeight: '100%',
  },
  modalYardName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 2,
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 2,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
