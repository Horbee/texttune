import { Translator, TargetLanguageCode } from 'deepl-node'
import { Notification } from 'electron'
import type { FixTextFn } from '@/lib/main/types'
import { createOrShowWindow } from './app'

export const fixTextFactory = (apiKey: string) => {
  const translator = new Translator(apiKey)

  const fixText: FixTextFn = async (text, targetLang = 'de') => {
    console.log('fixing text with deepl')
    const langs = (['en-US', 'de'] as TargetLanguageCode[]).filter((lang) => lang !== targetLang)
    langs.push(targetLang)

    try {
      let fixedText = text
      for (const lang of langs) {
        const result = await translator.translateText(fixedText, null, lang)
        fixedText = result.text
      }

      return fixedText
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
