import apiService from './api';

// Types
interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    dataSharing: boolean;
  };
}

interface UserSettings {
  id: string;
  userId: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

interface BillingInfo {
  id: string;
  userId: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  credits: number;
  usage: {
    conversations: number;
    tokens: number;
    storage: number;
  };
  limits: {
    conversations: number;
    tokens: number;
    storage: number;
  };
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    conversations: number;
    tokens: number;
    storage: number;
  };
}

interface UpdatePreferencesRequest {
  theme?: 'dark' | 'light' | 'auto';
  language?: string;
  timezone?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  privacy?: {
    profileVisibility?: 'public' | 'private';
    dataSharing?: boolean;
  };
}

class UserService {
  // Get user settings
  async getSettings(): Promise<UserSettings> {
    const response = await apiService.get<UserSettings>('/user/settings');
    return response.data;
  }

  // Update user settings
  async updateSettings(settings: UpdatePreferencesRequest): Promise<UserSettings> {
    const response = await apiService.put<UserSettings>('/user/settings', settings);
    return response.data;
  }

  // Get billing information
  async getBillingInfo(): Promise<BillingInfo> {
    const response = await apiService.get<BillingInfo>('/user/billing');
    return response.data;
  }

  // Get available subscription plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiService.get<SubscriptionPlan[]>('/user/plans');
    return response.data;
  }

  // Subscribe to a plan
  async subscribeToPlan(planId: string, paymentMethodId?: string): Promise<{
    success: boolean;
    message: string;
    billingInfo: BillingInfo;
  }> {
    const response = await apiService.post('/user/subscribe', {
      planId,
      paymentMethodId,
    });
    return response.data as {
      success: boolean;
      message: string;
      billingInfo: BillingInfo;
    };
  }

  // Cancel subscription
  async cancelSubscription(): Promise<{ message: string }> {
    const response = await apiService.post('/user/subscribe/cancel');
    return response.data as { message: string };
  }

  // Update payment method
  async updatePaymentMethod(paymentMethodId: string): Promise<{ message: string }> {
    const response = await apiService.put('/user/payment-method', { paymentMethodId });
    return response.data as { message: string };
  }

  // Get usage statistics
  async getUsageStats(): Promise<{
    totalConversations: number;
    totalTokens: number;
    totalStorage: number;
    monthlyUsage: {
      conversations: number;
      tokens: number;
      storage: number;
    };
    dailyUsage: {
      date: string;
      conversations: number;
      tokens: number;
    }[];
  }> {
    const response = await apiService.get('/user/usage');
    return response.data as {
      totalConversations: number;
      totalTokens: number;
      totalStorage: number;
      monthlyUsage: {
        conversations: number;
        tokens: number;
        storage: number;
      };
      dailyUsage: {
        date: string;
        conversations: number;
        tokens: number;
      }[];
    };
  }

  // Get user activity
  async getActivity(limit: number = 50, offset: number = 0): Promise<{
    activities: {
      id: string;
      type: string;
      description: string;
      timestamp: string;
      metadata?: unknown;
    }[];
    total: number;
  }> {
    const response = await apiService.get(`/user/activity?limit=${limit}&offset=${offset}`);
    return response.data as {
      activities: {
        id: string;
        type: string;
        description: string;
        timestamp: string;
        metadata?: unknown;
      }[];
      total: number;
    };
  }

  // Export user data
  async exportData(format: 'json' | 'csv'): Promise<Blob> {
    const response = await apiService.get(`/user/export?format=${format}`, {
      headers: {
        'Accept': format === 'csv' ? 'text/csv' : 'application/json',
      },
    });
    
    const blob = new Blob([JSON.stringify(response.data)], {
      type: format === 'csv' ? 'text/csv' : 'application/json',
    });
    
    return blob;
  }

  // Delete user account
  async deleteAccount(password: string): Promise<{ message: string }> {
    const response = await apiService.post('/user/delete', { password });
    return response.data as { message: string };
  }

  // Get user notifications
  async getNotifications(): Promise<{
    notifications: {
      id: string;
      type: string;
      title: string;
      message: string;
      isRead: boolean;
      createdAt: string;
    }[];
    unreadCount: number;
  }> {
    const response = await apiService.get('/user/notifications');
    return response.data as {
      notifications: {
        id: string;
        type: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: string;
      }[];
      unreadCount: number;
    };
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<void> {
    await apiService.patch(`/user/notifications/${notificationId}/read`);
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead(): Promise<void> {
    await apiService.patch('/user/notifications/read-all');
  }

  // Get user API keys
  async getApiKeys(): Promise<{
    keys: {
      id: string;
      name: string;
      key: string;
      createdAt: string;
      lastUsed?: string;
    }[];
  }> {
    const response = await apiService.get('/user/api-keys');
    return response.data as {
      keys: {
        id: string;
        name: string;
        key: string;
        createdAt: string;
        lastUsed?: string;
      }[];
    };
  }

  // Create new API key
  async createApiKey(name: string): Promise<{
    id: string;
    name: string;
    key: string;
    createdAt: string;
  }> {
    const response = await apiService.post('/user/api-keys', { name });
    return response.data as {
      id: string;
      name: string;
      key: string;
      createdAt: string;
    };
  }

  // Delete API key
  async deleteApiKey(keyId: string): Promise<void> {
    await apiService.delete(`/user/api-keys/${keyId}`);
  }

  // Get user integrations
  async getIntegrations(): Promise<{
    integrations: {
      id: string;
      name: string;
      type: string;
      isConnected: boolean;
      lastSync?: string;
    }[];
  }> {
    const response = await apiService.get('/user/integrations');
    return response.data as {
      integrations: {
        id: string;
        name: string;
        type: string;
        isConnected: boolean;
        lastSync?: string;
      }[];
    };
  }

  // Connect integration
  async connectIntegration(integrationId: string, config: unknown): Promise<{ message: string }> {
    const response = await apiService.post(`/user/integrations/${integrationId}/connect`, config);
    return response.data as { message: string };
  }

  // Disconnect integration
  async disconnectIntegration(integrationId: string): Promise<{ message: string }> {
    const response = await apiService.post(`/user/integrations/${integrationId}/disconnect`);
    return response.data as { message: string };
  }
}

const userServiceInstance = new UserService();
export default userServiceInstance;
export type {
  UserPreferences,
  UserSettings,
  BillingInfo,
  SubscriptionPlan,
  UpdatePreferencesRequest,
}; 