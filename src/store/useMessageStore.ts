import { create } from 'zustand'
import { messagesMock } from '../mockApi'
import { MessageType } from '../pages'

type MessageStore = {
    messages: MessageType[]
}

type Actions = {
    sendPrompt: (message: string) => void
    clearMessages: () => void
    isLastMessage: (id: number) => boolean
}

export const useMessageStore = create<MessageStore & Actions>((set, get) => ({
  messages: [] || messagesMock,
  sendPrompt: async (prompt) => {
    set((state) => ({
      ...state,
      messages: [...state.messages, { role: 'user', content: prompt }, { role: 'assistant', content: '' }]
    }))

    const messageResponse = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: get().messages })
    }).then((res) => res.json())

    const newMessages = get().messages.map((message) => {
      if (message.role === 'assistant' && message.content === '') {
        return messageResponse
      }
      return message
    })

    set((state) => ({ ...state, messages: newMessages }))
  },
  isLastMessage: (_id) => {
    // const lastMessage = get().messages[get().messages.length - 1]
    return false
  },
  clearMessages: () => set(() => ({ messages: [] }))
}))
