import React, { useState, useRef, useEffect } from 'react'
import { useChatStore, type Message } from '../../stores/useChat.store'
import { stompService } from '../../services/stomp.service'
import ReactMarkdown from 'react-markdown'
import './style.scss'
import { useRecorder } from '../../hooks/useRecorder'
import { voiceService } from '../../services/voice.service' 

type ChatbotWindowProps = {
  isVisible: boolean
  onClose: () => void
}

export const ChatbotWindow: React.FC<ChatbotWindowProps> = ({ isVisible, onClose }) => {
  const messages = useChatStore((state) => state.messages)
  const addMessage = useChatStore((state) => state.addMessage)
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  
  const isProcessingVoiceRef = useRef(false)
  const lastProcessedBlobRef = useRef<Blob | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { isRecording, startRecording, stopRecording, audioBlob, resetRecorder } = useRecorder()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages, isThinking])

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && (lastMessage.role === 'assistant' || lastMessage.role === 'error')) {
      setIsThinking(false)
    }
  }, [messages])

  useEffect(() => {
    const processVoice = async () => {
      if (audioBlob && audioBlob !== lastProcessedBlobRef.current && !isProcessingVoiceRef.current) {
        
        isProcessingVoiceRef.current = true 
        lastProcessedBlobRef.current = audioBlob
        setIsThinking(true)
        
        try {
          const data = await voiceService.chatWithVoice(audioBlob)
          
          let parsedData;
          if (typeof data === 'string') {
             try { parsedData = JSON.parse(data) } catch(e) { parsedData = data }
          } else {
             parsedData = data;
          }

          if (parsedData.user_text) {
            addMessage({ role: 'user', content: parsedData.user_text })
          }

          if (parsedData.bot_response) {
            addMessage({ role: 'assistant', content: parsedData.bot_response })
          }

        } catch (error) {
          console.error(error)
          addMessage({ role: 'error', content: "Lỗi xử lý giọng nói." })
          setIsThinking(false)
        } finally {
          resetRecorder()
          isProcessingVoiceRef.current = false 
        }
      }
    }

    processVoice()
  }, [audioBlob, addMessage, resetRecorder])

  const handleSend = () => {
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

  const toggleRecording = () => {
    if (isProcessingVoiceRef.current) return; 

    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
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
        
        {isRecording && (
             <div className="message user-message" style={{fontStyle: 'italic', opacity: 0.7}}>
                🎤 Đang nghe...
             </div>
        )}

        {isThinking && (
          <div className="message bot-message">
            <div className="thinking-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          placeholder={isThinking ? "AI đang trả lời..." : "Nhập tin nhắn..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isThinking || isRecording}
        />
        
        <button 
            className={`mic-btn ${isRecording ? "recording" : ""}`}
            onClick={toggleRecording}
            disabled={isThinking}
            title="Nói chuyện"
        >
            {isRecording ? "⏹" : "🎤"} 
        </button>

        <button 
            onClick={handleSend} 
            disabled={isThinking || !input.trim() || isRecording} 
            className={isThinking ? "disabled" : ""}
        >
            Gửi
        </button>
      </div>
    </div>
  )
}