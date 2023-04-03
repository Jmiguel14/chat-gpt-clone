import Head from 'next/head'
import React, { useRef } from 'react'
import Avatar from '../components/Avatar'
import { SendIcon, PlusIcon, ChatGPTIcon } from '../components/Icons'
import { TypeEffect } from '../components/TypeEffect'
import { useMessageStore } from '../store/useMessageStore'

interface LayoutProps {
  children: React.ReactNode
}

export type MessageType = {
  role: 'user' | 'assistant' | 'system',
  content: string
}

interface MessageProps {
  message: MessageType
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>chat gpt clone</title>
      </Head>
      <div className='w-full relative bg-gptgray min-h-screen text-cyan-50 pb-32'>
        <Aside />
        {children}
      </div>
    </>
  )
}

const Aside = () => {
  return (
    <aside className='bg-gptdarkgray fixed flex w-64 h-screen flex-col'>
      <nav className='flex flex-col flex-1 h-full p-2'>
        <button className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20'>
          <PlusIcon />
          New chat
        </button>
      </nav>
    </aside>
  )
}

const UserIcon = () => <img alt='user' src='https://pbs.twimg.com/profile_images/745029460752211968/7DiwQsyz_400x400.jpg' />

const Message = ({ message }: MessageProps) => {
  const { content, role } = message
  const imgAvatar = role === 'assistant' ? <ChatGPTIcon /> : <UserIcon />
  const textElement = role === 'assistant' ? <TypeEffect text={content} /> : <p>{content}</p>

  return (
    <div className={`${message.role === 'assistant' ? 'bg-gptlightgray' : 'bg-gptgray'}`}>
      <article className='flex gap-4 p-6 m-auto max-w-3xl'>
        <Avatar>
          {imgAvatar}
        </Avatar>
        {textElement}
      </article>
    </div>
  )
}

const Chat = () => {
  const messages = useMessageStore(state => state.messages)

  return (
    <div className='flex h-full flex-col flex-1 pl-64'>
      <main>
        {
          messages.map((message, index) => (
            <Message key={index} message={message} />
          ))
        }
      </main>
      <ChatForm />
    </div>
  )
}

function ChatForm() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const sendPrompt = useMessageStore(state => state.sendPrompt)

  const handleChange = () => {
    const el = textAreaRef.current
    if (!el) return
    el.style.height = '0px'
    const scrollHeight = el.scrollHeight
    el.style.height = scrollHeight + 'px'
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const el = textAreaRef.current
    if (!el) return
    const text = el.value
    sendPrompt(text)
    el.value = ''
    console.log('Submit')
  }

  return (
    <section className='fixed bottom-0 w-full left-0 right-0 ml-32'>
      <form
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
        className='flex flex-row max-w-3xl pt-6 m-auto mb-6'
        onSubmit={handleSubmit}
      >
        <div className='relative flex flex-col flex-grow w-full px-4 py-4 text-white border rounded-md shadow-lg
         bg-gptlightgray border-gray-900/50'
        >
          <textarea onChange={handleChange} ref={textAreaRef} className='w-full h-[24px] resize-none bg-transparent m-0 border-0 outline-none' />
          <button className='absolute p-1 rounded-md bottom-3 right-3'>
            <SendIcon />
          </button>
        </div>
      </form>
    </section>
  )
}

export default function Home () {
  return (
    <Layout>
      <Chat />
    </Layout>
  )
}
