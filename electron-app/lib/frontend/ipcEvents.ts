import { ipcMain } from 'electron'
import { saveSecureConfig, deleteSecureConfig, getSecureConfig } from '@/lib/main/secure-store'
import { fixTextFactory as fixTextFactoryDeepl } from '@/lib/main/deepl-fix'
import { saveConfig } from '@/lib/main/config'

import type { BackendState, FixTextFn } from '@/lib/main/types'

const handleIPC = (channel: string, handler: (...args: any[]) => void) => {
  ipcMain.handle(channel, handler)
}

export const registerFrontendIPC = (setFixText: (fixText: FixTextFn | null) => void, backendState: BackendState) => {
  // DeepL Text Handlers
  handleIPC('save-deepl-api-key', (_e, deeplApiKey: string) => {
    try {
      saveSecureConfig({ deeplApiKey })
      setFixText(fixTextFactoryDeepl(deeplApiKey))
    } catch (error) {
      throw error
    }
  })

  handleIPC('delete-deepl-api-key', async () => {
    try {
      deleteSecureConfig('deeplApiKey')
      setFixText(null)
    } catch (error) {
      throw error
    }
  })

  handleIPC('check-deepl-api-key', async () => {
    const config = getSecureConfig()
    return !!config?.deeplApiKey
  })

  // OpenAI API Key Handlers
  handleIPC('save-openai-api-key', (_e, openaiApiKey: string) => {
    try {
      saveSecureConfig({ openaiApiKey })
      setFixText(fixTextFactoryDeepl(openaiApiKey))
    } catch (error) {
      throw error
    }
  })

  handleIPC('delete-openai-api-key', async () => {
    try {
      deleteSecureConfig('openaiApiKey')
      setFixText(null)
    } catch (error) {
      throw error
    }
  })

  handleIPC('check-openai-api-key', async () => {
    const config = getSecureConfig()
    return !!config?.openaiApiKey
  })

  handleIPC('get-backend-state', () => backendState)

  handleIPC('set-backend-state', async (_e, newState: Partial<BackendState>) => {
    setFixText(null)

    Object.assign(backendState, newState)

    saveConfig({
      workingMode: backendState.workingMode,
      ollamaModel: backendState.ollamaModel,
      openAIModel: backendState.openAIModel,
    })
  })
}
