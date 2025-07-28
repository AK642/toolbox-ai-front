import apiService from './api';

// Types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  tool?: string;
}

interface Conversation {
  id: string;
  title: string;
  tool: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface CreateConversationRequest {
  tool: string;
  title?: string;
}

interface SendMessageRequest {
  content: string;
  conversationId: string;
  tool: string;
}

interface SendMessageResponse {
  message: Message;
  conversation: Conversation;
}

interface Tool {
  id?: string;
  name: string;
  icon: string;
  tool: string;
  badge?: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
}

interface ToolUsage {
  toolId: string;
  usageCount: number;
  lastUsed: string;
}

class AIService {
  // Get all available AI tools
  async getTools(): Promise<Tool[]> {
    const response = await apiService.get<Tool[]>('/ai-tool/all?  isActive=true');
    return response.data;
  }

  // Get tool by ID
  async getTool(toolId: string): Promise<Tool> {
    const response = await apiService.get<Tool>(`/ai/tools/${toolId}`);
    return response.data;
  }

  // Get user's tool usage
  async getToolUsage(): Promise<ToolUsage[]> {
    const response = await apiService.get<ToolUsage[]>('/ai/tools/usage');
    return response.data;
  }

  // Create new conversation
  async createConversation(data: CreateConversationRequest): Promise<Conversation> {
    const response = await apiService.post<Conversation>('/ai/conversations', data);
    return response.data;
  }

  // Get all conversations for a tool
  async getConversations(tool: string): Promise<Conversation[]> {
    const response = await apiService.get<Conversation[]>(`/ai/conversations?tool=${tool}`);
    return response.data;
  }

  // Get conversation by ID
  async getConversation(conversationId: string): Promise<Conversation> {
    const response = await apiService.get<Conversation>(`/ai/conversations/${conversationId}`);
    return response.data;
  }

  // Update conversation title
  async updateConversationTitle(conversationId: string, title: string): Promise<Conversation> {
    const response = await apiService.patch<Conversation>(`/ai/conversations/${conversationId}`, {
      title,
    });
    return response.data;
  }

  // Delete conversation
  async deleteConversation(conversationId: string): Promise<void> {
    await apiService.delete(`/ai/conversations/${conversationId}`);
  }

  // Send message to AI
  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await apiService.post<SendMessageResponse>('/ai/chat', data);
    return response.data;
  }

  // Get conversation messages
  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await apiService.get<Message[]>(`/ai/conversations/${conversationId}/messages`);
    return response.data;
  }

  // Stream AI response (for real-time chat)
  async streamMessage(
    conversationId: string,
    content: string,
    tool: string,
    onChunk: (chunk: string) => void,
    onComplete: (message: Message) => void,
    onError: (error: unknown) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${apiService['baseURL']}/ai/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...apiService['getHeaders'](),
        },
        body: JSON.stringify({
          conversationId,
          content,
          tool,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              // Stream complete, get final message
              const finalResponse = await this.getMessages(conversationId);
              const lastMessage = finalResponse[finalResponse.length - 1];
              onComplete(lastMessage);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.chunk) {
                onChunk(parsed.chunk);
              }
            } catch (e) {
              console.warn('Failed to parse stream chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      onError(error);
    }
  }

  // Get AI model information
  async getModelInfo(tool: string): Promise<{
    model: string;
    capabilities: string[];
    maxTokens: number;
    temperature: number;
  }> {
    const response = await apiService.get(`/ai/models/${tool}`);
    return response.data as {
      model: string;
      capabilities: string[];
      maxTokens: number;
      temperature: number;
    };
  }

  // Export conversation
  async exportConversation(conversationId: string, format: 'json' | 'txt' | 'pdf'): Promise<Blob> {
    const response = await apiService.get(`/ai/conversations/${conversationId}/export?format=${format}`, {
      headers: {
        'Accept': format === 'pdf' ? 'application/pdf' : 'application/json',
      },
    });
    
    // Convert response to blob
    const blob = new Blob([JSON.stringify(response.data)], {
      type: format === 'pdf' ? 'application/pdf' : 'application/json',
    });
    
    return blob;
  }

  // Share conversation
  async shareConversation(conversationId: string, email: string): Promise<{ message: string }> {
    const response = await apiService.post(`/ai/conversations/${conversationId}/share`, { email });
    return response.data as { message: string };
  }

  // Get conversation analytics
  async getConversationAnalytics(conversationId: string): Promise<{
    messageCount: number;
    wordCount: number;
    averageResponseTime: number;
    toolUsage: number;
  }> {
    const response = await apiService.get(`/ai/conversations/${conversationId}/analytics`);
    return response.data as {
      messageCount: number;
      wordCount: number;
      averageResponseTime: number;
      toolUsage: number;
    };
  }
}

const aiServiceInstance = new AIService();
export default aiServiceInstance;
export type {
  Message,
  Conversation,
  CreateConversationRequest,
  SendMessageRequest,
  SendMessageResponse,
  Tool,
  ToolUsage,
}; 