import React, { useState, useRef, useEffect } from 'react'
import { useChatStore, type Message } from '../../stores/useChat.store'
import { stompService } from '../../services/stomp.service'
// Xóa import useAuthStore vì không cần nữa
import './style.scss'

type ChatbotWindowProps = {
  isVisible: boolean
  onClose: () => void
}

export const ChatbotWindow: React.FC<ChatbotWindowProps> = ({ isVisible, onClose }) => {
  const messages = useChatStore((state) => state.messages)
  const addMessage = useChatStore((state) => state.addMessage)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(scrollToBottom, [messages])
  const handleSend = () => {
    if (!input.trim()) return
    
    const userMessage: Message = { role: 'user', content: input }
    addMessage(userMessage)
    stompService.sendMessage(input)

    setInput('')
  }
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div
      id="chatbot-container"
      className={`chatbot-container ${isVisible ? 'visible' : 'hidden'}`}
    >
      <div className="chatbot-header">
        <img src="/chatbot.png" alt="AI Assistant Logo" className="chatbot-logo" />
        <h3>AI Assistant</h3>
        <span className="close-btn" onClick={onClose}>✖</span>
      </div>
      
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.role === 'user' ? 'user-message' : 'bot-message'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Gửi tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>Gửi</button>
      </div>
    </div>
  )
}