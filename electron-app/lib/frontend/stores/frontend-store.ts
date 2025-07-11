import { create } from 'zustand'
import { showErrorNotification } from '../App'

import type { HistoryItem, WorkingMode } from '@/lib/main/types'

type Store = {
  deeplApiKeySaved: boolean
  ollamaModelSelected: boolean
  openAIApiKeySaved: boolean
  workingMode: WorkingMode
  setWorkingMode: (mode: WorkingMode) => Promise<void>
  fixHistory: HistoryItem[]
  initStore: () => Promise<void>
  setupListeners: () => void
  cleanupListeners: () => void
  // Ollama Config
  selectedOllamaModel: string | null
  setSelectedOllamaModel: (model: string | null) => Promise<void>
  // OpenAI Config
  selectedOpenAIModel: string | null
  setSelectedOpenAIModel: (model: string | null) => Promise<void>
  saveOpenAIApiKey: (apiKey: string) => Promise<void>
  deleteOpenAIApiKey: () => Promise<void>
  // Deepl Config
  saveDeeplApiKey: (apiKey: string) => Promise<void>
  deleteDeeplApiKey: () => Promise<void>
}

export const useFrontendStore = create<Store>()((set) => ({
  deeplApiKeySaved: false,
  openAIApiKeySaved: false,
  ollamaModelSelected: false,
  chatgptConfigured: false,
  workingMode: 'deepl',
  selectedOllamaModel: null,
  selectedOpenAIModel: null,
  selectedChatgptModel: null,
  chatgptApiKey: '',
  fixHistory: [],

  initStore: async () => {
    const deeplApiKeySaved = await window.api.invoke('check-deepl-api-key')
    const openAIApiKeySaved = await window.api.invoke('check-openai-api-key')
    const backendState = await window.api.invoke('get-backend-state')

    set({
      deeplApiKeySaved,
      openAIApiKeySaved,
      workingMode: backendState.workingMode,
      ollamaModelSelected: !!backendState.ollamaModel,
      selectedOllamaModel: backendState.ollamaModel,
      selectedOpenAIModel: backendState.openAIModel,
      fixHistory: backendState.translateHistory,
    })
  },

  setSelectedOllamaModel: async (model) => {
    try {
      await window.api.invoke('set-backend-state', { ollamaModel: model })
      set({ selectedOllamaModel: model, ollamaModelSelected: !!model })
    } catch (error) {
      showErrorNotification('Ollama model was not set!', 'Please try again.')
    }
  },
  setWorkingMode: async (mode) => {
    console.log(mode)
    try {
      await window.api.invoke('set-backend-state', { workingMode: mode })
      set({ workingMode: mode })
    } catch (error) {
      showErrorNotification('Working mode was not set!', 'Please try again.')
    }
  },
  saveDeeplApiKey: async (apiKey: string) => {
    try {
      await window.api.invoke('save-deepl-api-key', apiKey)
      set({ deeplApiKeySaved: true })
    } catch (error) {
      showErrorNotification('Api Key was not saved!', 'Please try again.')
      set({ deeplApiKeySaved: false })
    }
  },
  deleteDeeplApiKey: async () => {
    try {
      await window.api.invoke('delete-deepl-api-key')
      set({ deeplApiKeySaved: false })
    } catch (error) {
      showErrorNotification('Api Key was not deleted!', 'Please try again.')
    }
  },
  setSelectedOpenAIModel: async (model) => {
    try {
      await window.api.invoke('set-backend-state', { openAIModel: model })
      set({ selectedOpenAIModel: model })
    } catch (error) {
      showErrorNotification('OpenAI model was not set!', 'Please try again.')
    }
  },
  saveOpenAIApiKey: async (apiKey) => {
    try {
      await window.api.invoke('save-openai-api-key', apiKey)
      set({ openAIApiKeySaved: true })
    } catch (error) {
      showErrorNotification('OpenAI Api Key was not saved!', 'Please try again.')
      set({ openAIApiKeySaved: false })
    }
  },
  deleteOpenAIApiKey: async () => {
    try {
      await window.api.invoke('delete-openai-api-key')
      set({ openAIApiKeySaved: false })
    } catch (error) {
      showErrorNotification('OpenAI Api Key was not deleted!', 'Please try again.')
    }
  },
  setupListeners: () => {
    window.api.receive('message-from-main', (args) => {
      if (args.type === 'ERROR') {
        showErrorNotification(args.title, args.message)
      }
      if (args.type === 'FIX_SUCCESS') {
        set({ fixHistory: args.historyState })
      }
    })
  },
  cleanupListeners: () => {
    window.api.removeAllListeners('message-from-main')
  },
}))
