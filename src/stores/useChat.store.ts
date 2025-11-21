import { message } from 'antd'
import { create } from 'zustand'

export type Message = {
    role: 'user' | 'assistant'
    content: string
}

type ChatState = {
    messages: Message[]
    conversationId: string | null
    isConnected: boolean
    addMessage: (message: Message) => void
    setConversationId: (id: string) => void
    setConnected: (status: boolean) => void 
    clearChat: () => void
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [
        {role: 'assistant', content: 'Chào bạn! Tôi có thể giúp gì cho bạn?' }
    ],
    conversationId: null,
    isConnected: false,

    addMessage: (message: Message) =>
        set((state) => ({ messages: [...state.messages, message] })),

    setConversationId: (id: string) => set({ conversationId: id }),

    setConnected: (status: boolean) => set({ isConnected: status }),
    
    clearChat: () => set({ 
    messages: [{ role: 'assistant', content: 'Chào bạn! Tôi có thể giúp gì cho bạn?' }], 
    conversationId: null 
  })
}))