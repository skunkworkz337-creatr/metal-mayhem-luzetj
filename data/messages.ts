
// Message and conversation data models
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderVerified?: boolean;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantType: 'seller' | 'business';
  participantVerified?: boolean;
  listingTitle?: string;
  businessType?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  icon: string;
}

// Mock current user ID (in a real app, this would come from authentication)
export const CURRENT_USER_ID = 'user-123';
export const CURRENT_USER_NAME = 'John Doe';

// Mock data for conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantId: 'seller-1',
    participantName: 'Sarah Johnson',
    participantType: 'seller',
    participantVerified: true,
    listingTitle: 'Old Washing Machine',
    lastMessage: 'Sure, I can meet tomorrow at 2pm',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unreadCount: 1,
    icon: 'washer.fill',
  },
  {
    id: 'conv-2',
    participantId: 'business-1',
    participantName: 'Quick Haul Services',
    participantType: 'business',
    participantVerified: true,
    businessType: 'Pickup Service',
    lastMessage: 'We can schedule a pickup for next week',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    icon: 'truck.box.fill',
  },
  {
    id: 'conv-3',
    participantId: 'seller-2',
    participantName: 'Mike Chen',
    participantType: 'seller',
    participantVerified: false,
    listingTitle: 'Copper Pipes',
    lastMessage: 'Thanks for your interest!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 0,
    icon: 'pipe.and.drop.fill',
  },
];

// Mock data for messages
export const mockMessages: { [conversationId: string]: Message[] } = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: CURRENT_USER_ID,
      senderName: CURRENT_USER_NAME,
      senderVerified: false,
      content: 'Hi, is the washing machine still available?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: true,
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      senderId: 'seller-1',
      senderName: 'Sarah Johnson',
      senderVerified: true,
      content: 'Yes, it is! When would you like to pick it up?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      senderId: CURRENT_USER_ID,
      senderName: CURRENT_USER_NAME,
      senderVerified: false,
      content: 'How about tomorrow afternoon?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
    },
    {
      id: 'msg-4',
      conversationId: 'conv-1',
      senderId: 'seller-1',
      senderName: 'Sarah Johnson',
      senderVerified: true,
      content: 'Sure, I can meet tomorrow at 2pm',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
    },
  ],
  'conv-2': [
    {
      id: 'msg-5',
      conversationId: 'conv-2',
      senderId: CURRENT_USER_ID,
      senderName: CURRENT_USER_NAME,
      senderVerified: false,
      content: 'Do you offer pickup services for large metal items?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      read: true,
    },
    {
      id: 'msg-6',
      conversationId: 'conv-2',
      senderId: 'business-1',
      senderName: 'Quick Haul Services',
      senderVerified: true,
      content: 'Yes, we do! What type of items do you have?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: true,
    },
    {
      id: 'msg-7',
      conversationId: 'conv-2',
      senderId: CURRENT_USER_ID,
      senderName: CURRENT_USER_NAME,
      senderVerified: false,
      content: 'I have some old appliances and steel beams',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
      read: true,
    },
    {
      id: 'msg-8',
      conversationId: 'conv-2',
      senderId: 'business-1',
      senderName: 'Quick Haul Services',
      senderVerified: true,
      content: 'We can schedule a pickup for next week',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
    },
  ],
  'conv-3': [
    {
      id: 'msg-9',
      conversationId: 'conv-3',
      senderId: CURRENT_USER_ID,
      senderName: CURRENT_USER_NAME,
      senderVerified: false,
      content: 'Interested in the copper pipes. What&apos;s the condition?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
      read: true,
    },
    {
      id: 'msg-10',
      conversationId: 'conv-3',
      senderId: 'seller-2',
      senderName: 'Mike Chen',
      senderVerified: false,
      content: 'Thanks for your interest!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
    },
  ],
};

// Helper function to format time ago
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Helper function to format message time
export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};
