import { useEffect, useState } from 'react'

export function TypeEffect({ text }: {text:string}) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let i = 0
    setIsTyping(true)
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i))
      i++
      if (i > text.length) {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, 20)
    return () => clearInterval(interval)
  }, [text])

  return <span className={`${isTyping ? 'after:content-["▋"] after:ml-1 after:animate-pulse' : ''}`}>{displayText}</span>
}
