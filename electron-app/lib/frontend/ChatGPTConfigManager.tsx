import { Alert, Select, Stack, Title, Text, type StackProps, PasswordInput, Button } from '@mantine/core'
import { hasLength, useForm } from '@mantine/form'
import { useRef } from 'react'
import { useEffect } from 'react'
import { FaRegHeart } from 'react-icons/fa'

type Props = {
  selectedModel: string | null
  setSelectedModel: (model: string | null) => void
  apiKeySaved: boolean
  saveApiKey: (apiKey: string) => Promise<void>
  deleteApiKey: () => void
} & StackProps

const CHATGPT_MODELS = ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo']

export const ChatGPTConfigManager = ({
  selectedModel,
  setSelectedModel,
  saveApiKey,
  deleteApiKey,
  apiKeySaved,
  ...props
}: Props) => {
  const apiKeyInputRef = useRef<HTMLInputElement>(null)
  const modelSelectorRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    mode: 'controlled',
    initialValues: { apiKey: '' },
    validate: {
      apiKey: hasLength({ min: 1 }, 'Must be at least 1 character'),
    },
  })

  const submit = (values: typeof form.values) => {
    saveApiKey(values.apiKey.trim())
    form.reset()
  }

  useEffect(() => {
    // Set default model if none selected
    if (!selectedModel && CHATGPT_MODELS.length > 0) {
      setSelectedModel(CHATGPT_MODELS[0]) // gpt-4o-mini as default
    }

    window.api.receive('message-from-main', (args) => {
      if (args.type === 'FOCUS_MODEL_SELECTOR') {
        modelSelectorRef.current?.focus()
      }
    })
  }, [selectedModel, setSelectedModel])

  return (
    <Stack gap="sm" {...props}>
      <Title order={2}>ChatGPT Configuration</Title>

      {apiKeySaved && (
        <Select
          ref={modelSelectorRef}
          label="Model"
          data={CHATGPT_MODELS}
          value={selectedModel}
          onChange={setSelectedModel}
          description="Select the ChatGPT model to use"
        />
      )}

      {!apiKeySaved ? (
        <form onSubmit={form.onSubmit(submit)} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <PasswordInput
            ref={apiKeyInputRef}
            label="API Key"
            placeholder="Enter your API key"
            {...form.getInputProps('apiKey')}
          />

          <Button type="submit">Save</Button>
        </form>
      ) : (
        <Alert variant="light" color="green" title="Your API Key is saved" icon={<FaRegHeart />}>
          <Text>You can now select a model and use the extension.</Text>
          <Button mt={5} variant="outline" size="compact-sm" color="red" onClick={deleteApiKey}>
            Delete API Key
          </Button>
        </Alert>
      )}
    </Stack>
  )
}
