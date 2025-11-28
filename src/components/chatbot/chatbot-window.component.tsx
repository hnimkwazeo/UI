import React from 'react'
import { ChatbotWindow } from './chatbot-window.container'
import './style.scss'
import { useChatStore } from '../../stores/useChat.store' // <-- IMPORT STORE

export const Chatbot: React.FC = () => {
  // --- SỬA: Dùng State từ Store thay vì useState cục bộ ---
  const isOpen = useChatStore((state) => state.isOpen)
  const setIsOpen = useChatStore((state) => state.setIsOpen)

  const toggleChatbot = () => {
    setIsOpen(!isOpen) // Cập nhật vào Store
  }

  return (
    <>
      {/* Cửa sổ chat */}
      <ChatbotWindow 
        isVisible={isOpen} // Truyền state từ Store vào
        onClose={() => setIsOpen(false)} 
      />

      {/* Nút bật/tắt */}
      <button 
        id="chatbot-toggle-btn" 
        className="chatbot-toggle-btn"
        onClick={toggleChatbot}
      >
        {isOpen ? (
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>✖</span>
        ) : (
          <img src="/chatbot.png" alt="Chatbot Icon" className="toggle-btn-logo" />
        )}
      </button>
    </>
  )
}