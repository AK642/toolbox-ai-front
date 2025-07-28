import apiService from './api';

// Types
interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    console.log('response: ', response);
    
    // Store token in API service
    if (response.data.token) {
      apiService.setAuthToken(response.data.token);
    }
    
    return response.data;
  }

  // Signup user
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/signup', userData);
    
    // Store token in API service
    if (response.data.token) {
      apiService.setAuthToken(response.data.token);
    }
    
    return response.data;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Even if logout API fails, we should clear local token
      console.warn('Logout API failed, but clearing local token:', error);
    } finally {
      // Always clear local token
      apiService.removeAuthToken();
    }
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await apiService.get<User>('/auth/profile');
    return response.data;
  }

  // Update user profile
  async updateProfile(profileData: ProfileUpdateRequest): Promise<User> {
    const response = await apiService.put<User>('/auth/profile', profileData);
    return response.data;
  }

  // Refresh access token
  async refreshToken(): Promise<{ token: string }> {
    const response = await apiService.post<{ token: string }>('/auth/refresh');
    
    if (response.data.token) {
      apiService.setAuthToken(response.data.token);
    }
    
    return response.data;
  }

  // Check if user is authenticated
  async checkAuth(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    return response.data;
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  }

  // Reset password
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
export type { LoginRequest, SignupRequest, User, AuthResponse, ProfileUpdateRequest }; 