import React from 'react'
import { ChatbotWindow } from './chatbot-window.container'
import './style.scss'
import { useChatStore } from '../../stores/useChat.store' 

export const Chatbot: React.FC = () => {
  
  const isOpen = useChatStore((state) => state.isOpen)
  const setIsOpen = useChatStore((state) => state.setIsOpen)

  const toggleChatbot = () => {
    setIsOpen(!isOpen) 
  }

  return (
    <>
      {/* Cửa sổ chat */}
      <ChatbotWindow 
        isVisible={isOpen} 
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