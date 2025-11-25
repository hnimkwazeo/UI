import React, { useState, useRef, useEffect } from 'react'
import { useChatStore, type Message } from '../../stores/useChat.store'
import { stompService } from '../../services/stomp.service'
import ReactMarkdown from 'react-markdown'
import './style.scss'

type ChatbotWindowProps = {
  isVisible: boolean
  onClose: () => void
}

export const ChatbotWindow: React.FC<ChatbotWindowProps> = ({ isVisible, onClose }) => {
  const messages = useChatStore((state) => state.messages)
  const addMessage = useChatStore((state) => state.addMessage)
  const [input, setInput] = useState('')
  
  // 1. Đã sửa lỗi cú pháp khai báo state
  const [isThinking, setIsThinking] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 2. Logic tự động tắt 'thinking' khi có tin nhắn mới
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    
    if (lastMessage && (lastMessage.role === 'assistant' || lastMessage.role === 'error')) {
      setIsThinking(false)
    }
    
    scrollToBottom()
  }, [messages, isThinking])

  const handleSend = () => {
    // 3. Chặn gửi nếu đang suy nghĩ hoặc input rỗng
    if (!input.trim() || isThinking) return
    
    const userMessage: Message = { role: 'user', content: input }
    addMessage(userMessage)
    stompService.sendMessage(input)

    setInput('')
    setIsThinking(true)
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
            <div className="message-content">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {/* 4. Hiển thị icon 3 chấm khi đang suy nghĩ */}
        {isThinking && (
          <div className="message bot-message">
            <div className="thinking-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          // Thay đổi placeholder khi đang chờ
          placeholder={isThinking ? "AI đang trả lời..." : "Gửi tin nhắn..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isThinking} // 5. Khóa ô nhập liệu
        />
        <button 
            onClick={handleSend} 
            // 6. Khóa nút gửi
            disabled={isThinking || !input.trim()} 
            className={isThinking ? "disabled" : ""}
        >
            Gửi
        </button>
      </div>
    </div>
  )
}