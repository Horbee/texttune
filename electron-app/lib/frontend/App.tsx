import { useEffect } from 'react'
import { Grid, Stack, SegmentedControl, Transition, Box } from '@mantine/core'
import { showNotification } from '@mantine/notifications'

import { DeeplConfigManager } from './DeeplConfigManager'
import { Instructions } from './Instructions'
import { FixHistoryContainer } from './FixHistoryContainer'
import { OllamaConfigManager } from './OllamaConfigManager'
import { ChatGPTConfigManager } from './ChatGPTConfigManager'
import { useFrontendStore } from './stores/frontend-store'

export const showErrorNotification = (title: string, message: string) => {
  showNotification({
    withBorder: true,
    title,
    message,
    color: 'red',
    autoClose: false,
  })
}

function App() {
  const {
    initStore,
    workingMode,
    setWorkingMode,
    setupListeners,
    cleanupListeners,
    // Configs
    deeplApiKeySaved,
    ollamaModelSelected,
    openAIApiKeySaved,
    // Ollama
    selectedOllamaModel,
    setSelectedOllamaModel,
    // OpenAI
    selectedOpenAIModel,
    setSelectedOpenAIModel,
    saveOpenAIApiKey,
    deleteOpenAIApiKey,
    // DeepL
    saveDeeplApiKey,
    deleteDeeplApiKey,
  } = useFrontendStore()

  useEffect(() => {
    initStore()

    setupListeners()

    return () => {
      cleanupListeners()
    }
  }, [])

  const readyToFix =
    (workingMode === 'deepl' && deeplApiKeySaved) ||
    (workingMode === 'ollama' && ollamaModelSelected) ||
    (workingMode === 'chatgpt' && openAIApiKeySaved)

  return (
    <Grid p="lg">
      <Grid.Col span={5} p="lg">
        <Stack gap="xl">
          <SegmentedControl
            value={workingMode}
            onChange={(value) => setWorkingMode(value as 'deepl' | 'ollama')}
            data={[
              { label: 'DeepL', value: 'deepl' },
              { label: 'Ollama', value: 'ollama' },
              { label: 'ChatGPT', value: 'chatgpt' },
            ]}
          />

          <Box style={{ position: 'relative' }} h="250px">
            <Transition
              mounted={workingMode === 'deepl'}
              transition="slide-right"
              // enterDelay={500}
            >
              {(styles) => (
                <DeeplConfigManager
                  apiKeySaved={deeplApiKeySaved}
                  saveApiKey={saveDeeplApiKey}
                  deleteApiKey={deleteDeeplApiKey}
                  style={{ ...styles, position: 'absolute' }}
                />
              )}
            </Transition>

            <Transition
              mounted={workingMode === 'ollama'}
              transition="slide-left"
              // enterDelay={500}
            >
              {(styles) => (
                <OllamaConfigManager
                  selectedModel={selectedOllamaModel}
                  setSelectedModel={setSelectedOllamaModel}
                  style={{ ...styles, position: 'absolute' }}
                />
              )}
            </Transition>

            <Transition
              mounted={workingMode === 'chatgpt'}
              transition="slide-left"
              // enterDelay={500}
            >
              {(styles) => (
                <ChatGPTConfigManager
                  selectedModel={selectedOpenAIModel}
                  setSelectedModel={setSelectedOpenAIModel}
                  apiKeySaved={openAIApiKeySaved}
                  saveApiKey={saveOpenAIApiKey}
                  deleteApiKey={deleteOpenAIApiKey}
                  style={{ ...styles, position: 'absolute' }}
                />
              )}
            </Transition>
          </Box>

          <Instructions readyToFix={readyToFix} />
        </Stack>
      </Grid.Col>
      <Grid.Col span={7} p="lg">
        <FixHistoryContainer />
      </Grid.Col>
    </Grid>
  )
}

export default App
