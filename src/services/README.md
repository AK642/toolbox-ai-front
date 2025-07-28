# API Service Architecture

This directory contains a centralized API service architecture for the AI Hub application. The architecture follows best practices for API management in Next.js applications with TypeScript.

## 📁 File Structure

```
src/services/
├── api.ts              # Core API service with HTTP methods
├── authService.ts      # Authentication service
├── aiService.ts        # AI tools and chat service
├── userService.ts      # User management service
├── index.ts           # Service exports
└── README.md          # This documentation

src/hooks/
└── useApi.ts          # React hooks for API calls
```

## 🚀 Core API Service (`api.ts`)

The core API service provides a centralized way to make HTTP requests with:

- **Automatic authentication**: Adds Bearer tokens to requests
- **Error handling**: Consistent error responses
- **Request/response interceptors**: Transform data as needed
- **Timeout handling**: Configurable request timeouts
- **Type safety**: Full TypeScript support

### Usage

```typescript
import apiService from '../services/api';

// GET request
const response = await apiService.get<User>('/users/1');

// POST request
const newUser = await apiService.post<User>('/users', userData);

// PUT request
const updatedUser = await apiService.put<User>('/users/1', updateData);

// DELETE request
await apiService.delete('/users/1');

// File upload
const uploadResult = await apiService.upload<UploadResponse>('/upload', file);
```

## 🔐 Authentication Service (`authService.ts`)

Handles all authentication-related operations:

```typescript
import { authService } from '../services';

// Login
const authResponse = await authService.login({ email, password });

// Signup
const authResponse = await authService.signup({ name, email, password });

// Logout
await authService.logout();

// Get user profile
const profile = await authService.getProfile();

// Update profile
const updatedProfile = await authService.updateProfile(profileData);
```

## 🤖 AI Service (`aiService.ts`)

Manages AI tools and chat functionality:

```typescript
import { aiService } from '../services';

// Get available tools
const tools = await aiService.getTools();

// Create conversation
const conversation = await aiService.createConversation({ tool: 'chat-assistant' });

// Send message
const response = await aiService.sendMessage({
  content: 'Hello AI!',
  conversationId: 'conv-123',
  tool: 'chat-assistant'
});

// Stream AI response
await aiService.streamMessage(
  'conv-123',
  'Hello AI!',
  'chat-assistant',
  (chunk) => console.log('Chunk:', chunk),
  (message) => console.log('Complete:', message),
  (error) => console.error('Error:', error)
);
```

## 👤 User Service (`userService.ts`)

Handles user management, settings, and billing:

```typescript
import { userService } from '../services';

// Get user settings
const settings = await userService.getSettings();

// Update preferences
const updatedSettings = await userService.updateSettings({
  theme: 'dark',
  language: 'en'
});

// Get billing info
const billing = await userService.getBillingInfo();

// Get usage stats
const usage = await userService.getUsageStats();
```

## 🎣 React Hooks (`useApi.ts`)

Custom hooks for easy API integration in React components:

### Basic Usage

```typescript
import { useApi, useGet, usePost } from '../hooks/useApi';
import { authService } from '../services';

function LoginComponent() {
  const loginApi = usePost(authService.login, {
    onSuccess: (data) => {
      console.log('Login successful:', data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const handleLogin = async () => {
    await loginApi.execute({ email, password });
  };

  return (
    <div>
      {loginApi.loading && <div>Loading...</div>}
      {loginApi.error && <div>Error: {loginApi.error.message}</div>}
      {loginApi.success && <div>Login successful!</div>}
      <button onClick={handleLogin} disabled={loginApi.loading}>
        Login
      </button>
    </div>
  );
}
```

### Advanced Usage

```typescript
// Multiple API calls
const { users, posts } = useMultipleApi({
  users: userService.getUsers,
  posts: postService.getPosts,
});

// Optimistic updates
const updateUser = useOptimisticApi(userService.updateUser, {
  onSuccess: (data) => {
    console.log('User updated:', data);
  },
});

const handleUpdate = async () => {
  await updateUser.optimisticUpdate(
    { id: 1, name: 'New Name' },
    { id: 1, name: 'New Name', email: 'user@example.com' }
  );
};
```

## 🔧 Configuration

### Environment Variables

Set up your API configuration in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Base URL Configuration

```typescript
import apiService from '../services/api';

// Change base URL dynamically
apiService.setBaseURL('https://api.example.com');

// Set auth token
apiService.setAuthToken('your-jwt-token');
```

## 📝 Error Handling

The API service provides consistent error handling:

```typescript
interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Handle errors in components
const { error, loading } = useApi(someApiFunction);

if (error) {
  switch (error.status) {
    case 401:
      // Handle unauthorized
      break;
    case 403:
      // Handle forbidden
      break;
    case 404:
      // Handle not found
      break;
    case 500:
      // Handle server error
      break;
  }
}
```

## 🔄 Retry Logic

Configure automatic retries for failed requests:

```typescript
const apiCall = useApi(someApiFunction, {
  retryCount: 3,
  retryDelay: 1000, // 1 second
});
```

## 🚀 Best Practices

1. **Use TypeScript**: All services are fully typed for better development experience
2. **Handle loading states**: Always show loading indicators during API calls
3. **Error boundaries**: Implement error boundaries for API errors
4. **Optimistic updates**: Use optimistic updates for better UX
5. **Caching**: Consider implementing caching for frequently accessed data
6. **Rate limiting**: Handle rate limiting gracefully
7. **Offline support**: Consider implementing offline capabilities

## 🔒 Security

- **Authentication**: Automatic token management
- **CSRF protection**: Implement CSRF tokens if needed
- **Input validation**: Validate all inputs before sending to API
- **HTTPS**: Always use HTTPS in production
- **Token refresh**: Implement automatic token refresh

## 📊 Monitoring

Consider implementing:

- Request/response logging
- Performance monitoring
- Error tracking
- Usage analytics

## 🧪 Testing

Example test for API service:

```typescript
import { renderHook } from '@testing-library/react';
import { useApi } from '../hooks/useApi';

test('useApi handles success correctly', async () => {
  const mockApi = jest.fn().mockResolvedValue({ data: 'test' });
  
  const { result } = renderHook(() => useApi(mockApi));
  
  await result.current.execute();
  
  expect(result.current.data).toBe('test');
  expect(result.current.loading).toBe(false);
  expect(result.current.success).toBe(true);
});
```

This architecture provides a robust, scalable foundation for API management in your Next.js application. 