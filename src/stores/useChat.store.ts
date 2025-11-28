import { create } from 'zustand'

export type Message = {
    role: 'user' | 'assistant' | 'error'
    content: string
}

type ChatState = {
    messages: Message[]
    conversationId: string | null
    isConnected: boolean
    
    // --- BỔ SUNG 2 DÒNG NÀY ---
    isOpen: boolean; 
    setIsOpen: (isOpen: boolean) => void;
    // --------------------------

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
    
    // --- BỔ SUNG GIÁ TRỊ MẶC ĐỊNH ---
    isOpen: false, 
    // -------------------------------

    addMessage: (message: Message) =>
        set((state) => ({ messages: [...state.messages, message] })),

    // --- BỔ SUNG HÀM SET ---
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
    // ----------------------

    setConversationId: (id: string) => set({ conversationId: id }),

    setConnected: (status: boolean) => set({ isConnected: status }),
    
    clearChat: () => set({ 
        messages: [{ role: 'assistant', content: 'Chào bạn! Tôi có thể giúp gì cho bạn?' }], 
        conversationId: null 
    })
}))