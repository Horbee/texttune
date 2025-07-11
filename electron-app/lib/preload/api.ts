import { ipcRenderer } from 'electron'

import type { BackendState, HistoryItem } from '@/lib/main/types'

interface InvokeInterface {
  (channel: 'save-deepl-api-key', apiKey: string): Promise<void>
  (channel: 'delete-deepl-api-key'): Promise<void>
  (channel: 'check-deepl-api-key'): Promise<boolean>
  (channel: 'save-openai-api-key', apiKey: string): Promise<void>
  (channel: 'delete-openai-api-key'): Promise<void>
  (channel: 'check-openai-api-key'): Promise<boolean>
  (channel: 'get-backend-state'): Promise<BackendState>
  (channel: 'set-backend-state', state: Partial<BackendState>): Promise<void>
}
type ListenChannel = 'message-from-main'
interface ReceiveInterface {
  (
    channel: ListenChannel,
    func: (
      args: ErrorMessageInterface | FixSuccessInterface | FocusModelSelectorInterface | FocusApiKeyInputInterface
    ) => void
  ): void
}

interface ErrorMessageInterface {
  type: 'ERROR'
  title: string
  message: string
}

interface FixSuccessInterface {
  type: 'FIX_SUCCESS'
  historyState: HistoryItem[]
}

interface FocusModelSelectorInterface {
  type: 'FOCUS_MODEL_SELECTOR'
}

interface FocusApiKeyInputInterface {
  type: 'FOCUS_API_KEY_INPUT'
}

const api = {
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args)
  },
  receive: (channel: string, func: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_, ...args) => func(...args))
  },
  invoke: (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(channel, ...args)
  },
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  },
} as {
  send: (channel: string, ...args: any[]) => void
  receive: ReceiveInterface
  invoke: InvokeInterface
  removeAllListeners: (channel: ListenChannel) => void
}

export default api
