
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
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const filteredConversations = mockConversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchText.toLowerCase()) ||
    (conv.listingTitle && conv.listingTitle.toLowerCase().includes(searchText.toLowerCase())) ||
    (conv.businessType && conv.businessType.toLowerCase().includes(searchText.toLowerCase()))
  );

  const handleConversationPress = (conversation: Conversation) => {
    router.push({
      pathname: '/chat',
      params: {
        conversationId: conversation.id,
        participantName: conversation.participantName,
        participantType: conversation.participantType,
        icon: conversation.icon,
      },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your conversations
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.outline }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search conversations..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredConversations.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="bubble.left.and.bubble.right" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No conversations yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Start chatting with sellers or businesses
            </Text>
          </View>
        ) : (
          filteredConversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              activeOpacity={0.7}
              onPress={() => handleConversationPress(conversation)}
            >
              <View
                style={[
                  styles.conversationCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.outline,
                  },
                  isDark && styles.cardDark,
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <IconSymbol name={conversation.icon} size={28} color={colors.primary} />
                </View>

                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <Text style={[styles.participantName, { color: colors.text }]} numberOfLines={1}>
                      {conversation.participantName}
                    </Text>
                    {conversation.lastMessageTime && (
                      <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                        {formatTimeAgo(conversation.lastMessageTime)}
                      </Text>
                    )}
                  </View>

                  <Text style={[styles.conversationType, { color: colors.textSecondary }]} numberOfLines={1}>
                    {conversation.participantType === 'seller'
                      ? conversation.listingTitle
                      : conversation.businessType}
                  </Text>

                  {conversation.lastMessage && (
                    <View style={styles.lastMessageRow}>
                      <Text
                        style={[
                          styles.lastMessage,
                          { color: conversation.unreadCount > 0 ? colors.text : colors.textSecondary },
                          conversation.unreadCount > 0 && styles.unreadMessage,
                        ]}
                        numberOfLines={1}
                      >
                        {conversation.lastMessage}
                      </Text>
                      {conversation.unreadCount > 0 && (
                        <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                          <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
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
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
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
    paddingBottom: 20,
  },
  conversationCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
    gap: 12,
  },
  cardDark: {
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '400',
    marginLeft: 8,
  },
  conversationType: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lastMessage: {
    fontSize: 15,
    fontWeight: '400',
    flex: 1,
  },
  unreadMessage: {
    fontWeight: '600',
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
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    fontWeight: '400',
  },
});
