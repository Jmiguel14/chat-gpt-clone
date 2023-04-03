import type { NextApiRequest, NextApiResponse } from 'next'

export interface Message {
    role?: string;
    content?: string;
}

export interface Choice {
    message: Message;
    index: number;
    logprobs?: any;
    finish_reason: string;
}

export interface Usage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

export interface OpenAIApiResponse {
    id?: string;
    object?: string;
    created?: number;
    model?: string;
    choices?: Choice[];
    usage?: Usage;
}

export interface LocalApiResponse extends Message {}

export interface Error {
    message: string;
    type?: string;
    param?: any;
    code?: any;
}

export interface ErrorResponse {
    error?: Error;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LocalApiResponse & ErrorResponse>
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages } = req.body

  if (!messages.length) {
    return res.status(400).json({ error: { message: 'Prompt is required', type: 'invalid-input' } })
  }

  console.log('messages', messages)
  try {
    console.log('antes de la response')
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })

    if (!response.ok) {
      console.error(response.statusText)
      return res.status(500).json({ error: { message: 'OpenAI API error' } })
    }

    const json: OpenAIApiResponse = await response.json()

    const messageResponse = json.choices ? json.choices[0].message : { role: 'assistant', content: 'I don\'t know what to say' }

    return res.status(200).json(messageResponse)
  } catch (e: any) {
    console.error(e)
    res.status(500).json({ error: { message: e.message } })
  }
}
