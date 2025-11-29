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

  public connect(authToken: string): void {
    if (this.stompClient && this.stompClient.connected) {
      console.log('STOMP: Already connected.')
      return
    }

    const { setConnected, setConversationId, addMessage } = useChatStore.getState()

    const socket = new SockJS('/ws')
    this.stompClient = Stomp.over(socket)

    this.stompClient.debug = () => {}

    const connectHeaders = {
      Authorization: `Bearer ${authToken}`
    }

    this.stompClient.connect(
      connectHeaders,
      (frame: IFrame) => {
        console.log('STOMP: Connected successfully.', frame)
        setConnected(true)

        this.stompClient?.subscribe(
          '/user/queue/chat.reply',
          (message: IMessage) => {
            const response: ChatResponseDTO = JSON.parse(message.body)

            setConversationId(response.conversationId)

            const botMessage: Message = {
              role: 'assistant',
              content: response.assistantResponse,
            }
            addMessage(botMessage)
          }
        )
      },
      (error: string | IFrame) => {
        console.error('STOMP: Connection error.', error)
        setConnected(false)
      }
    )
  }

  public disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        useChatStore.getState().setConnected(false)
        console.log('STOMP: Disconnected.')
      })
    }
  }

  public sendMessage(message: string): void {
    const { conversationId } = useChatStore.getState()

    if (this.stompClient && this.stompClient.connected) {
      const request: ChatRequestDTO = {
        message: message,
        conversationId: conversationId,
      }

      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(request),
      })
    } else {
      console.error('STOMP: Cannot send message, not connected.')
    }
  }
}

export const stompService = new StompService()