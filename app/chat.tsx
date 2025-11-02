
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { mockMessages, formatMessageTime, CURRENT_USER_ID, Message } from '@/data/messages';

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  const conversationId = params.conversationId as string;
  const participantName = params.participantName as string;
  const participantType = params.participantType as string;
  const icon = params.icon as string;

  const [messages, setMessages] = useState<Message[]>(mockMessages[conversationId] || []);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: CURRENT_USER_ID,
      senderName: 'You',
      content: inputText.trim(),
      timestamp: new Date(),
      read: true,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    Keyboard.dismiss();
  };

  const renderMessage = (message: Message, index: number) => {
    const isCurrentUser = message.senderId === CURRENT_USER_ID;
    const showTimestamp = index === 0 || 
      (messages[index - 1] && 
       Math.abs(message.timestamp.getTime() - messages[index - 1].timestamp.getTime()) > 300000); // 5 minutes

    return (
      <View key={message.id}>
        {showTimestamp && (
          <View style={styles.timestampContainer}>
            <Text style={[styles.timestampText, { color: colors.textSecondary }]}>
              {formatMessageTime(message.timestamp)}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.messageContainer,
            isCurrentUser ? styles.messageContainerRight : styles.messageContainerLeft,
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              isCurrentUser
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card, borderColor: colors.outline, borderWidth: 2 },
            ]}
          >
            <Text
              style={[
                styles.messageText,
                { color: isCurrentUser ? '#FFFFFF' : colors.text },
              ]}
            >
              {message.content}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.outline }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={[styles.headerIconContainer, { backgroundColor: colors.primary + '20' }]}>
          <IconSymbol name={icon} size={24} color={colors.primary} />
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {participantName}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {participantType === 'seller' ? 'Marketplace Seller' : 'Business'}
          </Text>
        </View>

        <TouchableOpacity style={styles.headerButton}>
          <IconSymbol name="info.circle" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="bubble.left.and.bubble.right" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Start the conversation
              </Text>
            </View>
          ) : (
            messages.map((message, index) => renderMessage(message, index))
          )}
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.outline }]}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.outline }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? colors.primary : colors.textSecondary + '40' },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
            activeOpacity={0.7}
          >
            <IconSymbol name="arrow.up" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '400',
  },
  headerButton: {
    padding: 4,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  timestampContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  timestampText: {
    fontSize: 13,
    fontWeight: '500',
  },
  messageContainer: {
    marginBottom: 8,
    maxWidth: '75%',
  },
  messageContainerLeft: {
    alignSelf: 'flex-start',
  },
  messageContainerRight: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    minHeight: 24,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
});
