import React, { useState } from 'react'
import { ChatbotWindow } from './chatbot-window.container'
import './style.scss'

export const Chatbot: React.FC = () => {
  // State quản lý ẩn/hiện
  const [isVisible, setIsVisible] = useState(false)

  const toggleChatbot = () => {
    setIsVisible(!isVisible)
  }

  return (
    <>
      {/* Cửa sổ chat */}
      <ChatbotWindow 
        isVisible={isVisible} 
        onClose={toggleChatbot} // Truyền hàm toggle vào
      />

      {/* Nút bật/tắt */}
      <button 
        id="chatbot-toggle-btn" 
        className="chatbot-toggle-btn"
        onClick={toggleChatbot}
      >
        {isVisible ? (
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>✖</span>
        ) : (
          <img src="/chatbot.png" alt="Chatbot Icon" className="toggle-btn-logo" />
        )}
      </button>
    </>
  )
}