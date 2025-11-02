
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';
import { mockConversations, formatTimeAgo, Conversation } from '@/data/messages';

export default function MessagesScreen() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = mockConversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.listingTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.businessType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationPress = (conversation: Conversation) => {
    router.push({
      pathname: '/chat',
      params: {
        conversationId: conversation.id,
        participantName: conversation.participantName,
        participantType: conversation.participantType,
        participantVerified: conversation.participantVerified ? 'true' : 'false',
        icon: conversation.icon,
      },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {mockConversations.length} conversation{mockConversations.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search conversations..."
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredConversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            style={[
              styles.conversationCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.outline,
              },
            ]}
            onPress={() => handleConversationPress(conversation)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name={conversation.icon} size={28} color={colors.primary} />
            </View>

            <View style={styles.conversationInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.participantName, { color: colors.text }]} numberOfLines={1}>
                  {conversation.participantName}
                </Text>
                {conversation.participantVerified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
                    <IconSymbol name="checkmark.seal.fill" size={14} color="#FFFFFF" />
                  </View>
                )}
                {conversation.unreadCount > 0 && (
                  <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
                  </View>
                )}
              </View>

              {conversation.listingTitle && (
                <Text style={[styles.listingTitle, { color: colors.textSecondary }]} numberOfLines={1}>
                  {conversation.listingTitle}
                </Text>
              )}

              {conversation.businessType && (
                <Text style={[styles.businessType, { color: colors.textSecondary }]} numberOfLines={1}>
                  {conversation.businessType}
                </Text>
              )}

              {conversation.lastMessage && (
                <Text style={[styles.lastMessage, { color: colors.textSecondary }]} numberOfLines={1}>
                  {conversation.lastMessage}
                </Text>
              )}
            </View>

            <View style={styles.timeContainer}>
              {conversation.lastMessageTime && (
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  {formatTimeAgo(conversation.lastMessageTime)}
                </Text>
              )}
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        ))}

        {filteredConversations.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol name="bubble.left.and.bubble.right" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No conversations found</Text>
            <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
              {searchQuery ? 'Try a different search term' : 'Start chatting with sellers and businesses'}
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBox: {
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
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  listingTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  businessType: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    fontWeight: '400',
  },
  timeContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
