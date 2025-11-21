import { Stomp, type IFrame, type IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useChatStore, type Message } from '../stores/useChat.store'

type ChatRequestDTO = {
  message: string
  conversationId: string | null
}

type ChatResponseDTO = {
  assistantResponse: string
  conversationId: string
}

class StompService {
  private stompClient: any = null

  // Hàm kết nối
  public connect(authToken: string): void {
    if (this.stompClient && this.stompClient.connected) {
      console.log('STOMP: Already connected.')
      return
    }

    const { setConnected, setConversationId, addMessage } = useChatStore.getState()

    // 1. Tạo kết nối SockJS (Nó sẽ dùng proxy /ws trong vite.config.ts)
    const socket = new SockJS('/ws')
    this.stompClient = Stomp.over(socket)

    // Tắt log debug của STOMP
    this.stompClient.debug = () => {}

    // 2. Header xác thực (từ WebSocketAuthInterceptor)
    const connectHeaders = {
      Authorization: `Bearer ${authToken}`
    }

    // 3. Kết nối
    this.stompClient.connect(
      connectHeaders,
      (frame: IFrame) => {
        console.log('STOMP: Connected successfully.', frame)
        setConnected(true)

        // 4. Lắng nghe kênh /user/queue/chat.reply (từ ChatbotSocketController)
        this.stompClient?.subscribe(
          '/user/queue/chat.reply',
          (message: IMessage) => {
            // --- Nhận được tin nhắn từ BE ---
            const response: ChatResponseDTO = JSON.parse(message.body)

            // Cập nhật conversationId vào store
            setConversationId(response.conversationId)

            // Thêm tin nhắn của bot vào store
            const botMessage: Message = {
              role: 'assistant',
              content: response.assistantResponse,
            }
            addMessage(botMessage)
          }
        )
      },
      (error: string | IFrame) => {
        // --- Lỗi kết nối ---
        console.error('STOMP: Connection error.', error)
        setConnected(false)
      }
    )
  }

  // Hàm ngắt kết nối
  public disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        useChatStore.getState().setConnected(false)
        console.log('STOMP: Disconnected.')
      })
    }
  }

  // Hàm gửi tin nhắn
  public sendMessage(message: string): void {
    const { conversationId } = useChatStore.getState()

    if (this.stompClient && this.stompClient.connected) {
      const request: ChatRequestDTO = {
        message: message,
        conversationId: conversationId,
      }

      // 5. Gửi tin nhắn đến /app/chat.sendMessage (từ ChatbotSocketController)
      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(request),
      })
    } else {
      console.error('STOMP: Cannot send message, not connected.')
    }
  }
}

// Xuất ra một instance duy nhất (singleton)
export const stompService = new StompService()