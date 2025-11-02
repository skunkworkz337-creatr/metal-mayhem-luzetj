
// User data models and authentication
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  verified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  onboardingCompleted: boolean;
  badges: Badge[];
  createdAt: Date;
  profileImage?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: 'onboarding' | 'contribution' | 'community' | 'achievement';
}

// Available badges in the system
export const AVAILABLE_BADGES: Omit<Badge, 'earnedAt'>[] = [
  {
    id: 'verified-user',
    name: 'Verified User',
    description: 'Completed onboarding with verified contact information',
    icon: 'checkmark.seal.fill',
    category: 'onboarding',
  },
  {
    id: 'first-listing',
    name: 'First Listing',
    description: 'Posted your first marketplace listing',
    icon: 'tag.fill',
    category: 'contribution',
  },
  {
    id: 'price-reporter',
    name: 'Price Reporter',
    description: 'Submitted your first pricing ticket',
    icon: 'chart.bar.fill',
    category: 'contribution',
  },
  {
    id: 'yard-scout',
    name: 'Yard Scout',
    description: 'Added a new scrap yard to the database',
    icon: 'map.fill',
    category: 'contribution',
  },
  {
    id: 'helpful-member',
    name: 'Helpful Member',
    description: 'Received 10+ positive ratings from community',
    icon: 'hand.thumbsup.fill',
    category: 'community',
  },
  {
    id: 'metal-expert',
    name: 'Metal Expert',
    description: 'Submitted 50+ pricing reports',
    icon: 'star.fill',
    category: 'achievement',
  },
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Joined MetalMayhem in the first month',
    icon: 'sparkles',
    category: 'achievement',
  },
  {
    id: 'community-builder',
    name: 'Community Builder',
    description: 'Helped 25+ users through messaging',
    icon: 'person.3.fill',
    category: 'community',
  },
];

// Mock current user (in production, this would come from authentication)
export const CURRENT_USER: User = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  role: 'user', // Change to 'admin' to test admin features
  verified: false,
  emailVerified: false,
  phoneVerified: false,
  onboardingCompleted: false,
  badges: [],
  createdAt: new Date('2024-01-15'),
};

// Helper function to check if user is admin
export const isAdmin = (user: User): boolean => {
  return user.role === 'admin';
};

// Helper function to check if user is verified
export const isVerified = (user: User): boolean => {
  return user.verified && user.emailVerified && user.phoneVerified && user.onboardingCompleted;
};

// Helper function to award a badge to a user
export const awardBadge = (user: User, badgeId: string): User => {
  const badge = AVAILABLE_BADGES.find(b => b.id === badgeId);
  if (!badge) {
    console.error('Badge not found:', badgeId);
    return user;
  }

  // Check if user already has this badge
  if (user.badges.some(b => b.id === badgeId)) {
    console.log('User already has this badge:', badgeId);
    return user;
  }

  const newBadge: Badge = {
    ...badge,
    earnedAt: new Date(),
  };

  console.log('Badge awarded:', newBadge.name);
  
  return {
    ...user,
    badges: [...user.badges, newBadge],
  };
};

// Helper function to complete onboarding and award verified badge
export const completeOnboarding = (user: User): User => {
  if (!user.emailVerified || !user.phoneVerified) {
    console.error('Cannot complete onboarding: contact information not verified');
    return user;
  }

  let updatedUser = {
    ...user,
    onboardingCompleted: true,
    verified: true,
  };

  // Award verified user badge
  updatedUser = awardBadge(updatedUser, 'verified-user');

  console.log('Onboarding completed for user:', updatedUser.name);
  return updatedUser;
};

// Mock function to verify email (in production, this would send verification email)
export const verifyEmail = (user: User, code: string): User => {
  // In production, verify the code against sent verification code
  console.log('Email verified for:', user.email);
  return {
    ...user,
    emailVerified: true,
  };
};

// Mock function to verify phone (in production, this would send SMS verification)
export const verifyPhone = (user: User, code: string): User => {
  // In production, verify the code against sent SMS code
  console.log('Phone verified for:', user.phone);
  return {
    ...user,
    phoneVerified: true,
  };
};
