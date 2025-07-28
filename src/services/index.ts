// Core API service
export { default as apiService } from './api';
export type { ApiResponse, ApiError, RequestConfig } from './api';

// Feature-specific services
export { default as authService } from './authService';
export type {
  LoginRequest,
  SignupRequest,
  User,
  AuthResponse,
  ProfileUpdateRequest,
} from './authService';

export { default as aiService } from './aiService';
export type {
  Message,
  Conversation,
  CreateConversationRequest,
  SendMessageRequest,
  SendMessageResponse,
  Tool,
  ToolUsage,
} from './aiService';

export { default as userService } from './userService';
export type {
  UserPreferences,
  UserSettings,
  BillingInfo,
  SubscriptionPlan,
  UpdatePreferencesRequest,
} from './userService';

// API hooks
export {
  useApi,
  useGet,
  usePost,
  usePut,
  useDelete,
  useMultipleApi,
  useOptimisticApi,
} from '../hooks/useApi'; 