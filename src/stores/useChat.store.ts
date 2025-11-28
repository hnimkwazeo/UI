import { create } from 'zustand'

export type Message = {
    role: 'user' | 'assistant' | 'error'
    content: string
}

type ChatState = {
    messages: Message[]
    conversationId: string | null
    isConnected: boolean
    isOpen: boolean; // <--- THÊM MỚI: Trạng thái đóng/mở cửa sổ chat
    
    addMessage: (message: Message) => void
    setConversationId: (id: string) => void
    setConnected: (status: boolean) => void 
    setIsOpen: (isOpen: boolean) => void; // <--- THÊM MỚI: Hàm cập nhật trạng thái
    clearChat: () => void
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [
        {role: 'assistant', content: 'Chào bạn! Tôi có thể giúp gì cho bạn?' }
    ],
    conversationId: null,
    isConnected: false,
    isOpen: false, // <--- THÊM MỚI: Mặc định là đóng

    addMessage: (message: Message) =>
        set((state) => ({ messages: [...state.messages, message] })),

    setConversationId: (id: string) => set({ conversationId: id }),

    setConnected: (status: boolean) => set({ isConnected: status }),

    setIsOpen: (isOpen: boolean) => set({ isOpen }), // <--- THÊM MỚI: Implementation hàm
    
    clearChat: () => set({ 
        messages: [{ role: 'assistant', content: 'Chào bạn! Tôi có thể giúp gì cho bạn?' }], 
        conversationId: null 
    })
}))