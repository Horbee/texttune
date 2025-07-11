import OpenAI from 'openai'
import { Notification } from 'electron'
import type { FixTextFn } from '@/lib/main/types'
import { createOrShowWindow } from './app'

const getPromptTemplate = (text: string) => {
  return `Fix all typos and casing and punctuation in this text and make it grammatically correct, but keep the source language:

  ${text}

  Return only the corrected text, don't include a preamble.
  `
}

export const fixTextFactory = (model: string, apiKey: string) => {
  const openai = new OpenAI({
    apiKey: apiKey,
  })

  const fixText: FixTextFn = async (text) => {
    console.log('fixing text with ChatGPT')

    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: getPromptTemplate(text),
          },
        ],
        max_tokens: 1000,
        temperature: 0.1,
      })

      return response.choices[0]?.message?.content?.trim() || text
    } catch (error: any) {
      console.error('Error fixing text with Ollama:', error)

      new Notification({
        title: 'Text Tune',
        body: error.message || 'An error occurred while fixing the text.',
      })
        .on('click', () => {
          createOrShowWindow()
        })
        .show()

      return 'An error occurred while fixing the text.'
    }
  }

  return fixText
}
