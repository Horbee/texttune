import { safeStorage, app } from 'electron'
import fs from 'fs'
import path from 'path'

const configPath = path.join(app.getPath('userData'), 'secure-config.json')

type SecureAppConfig = {
  deeplApiKey: string | null
  openaiApiKey: string | null
}

export function saveSecureConfig(data: Partial<SecureAppConfig>) {
  const config = getSecureConfig()
  const updatedConfig = { ...config, ...data }

  if (safeStorage.isEncryptionAvailable()) {
    const encrypted = safeStorage.encryptString(JSON.stringify(updatedConfig))
    fs.writeFileSync(configPath, encrypted)
  }
}

export function getSecureConfig(): SecureAppConfig | null {
  if (!fs.existsSync(configPath)) return null

  const encrypted = fs.readFileSync(configPath)
  const decrypted = safeStorage.isEncryptionAvailable() ? safeStorage.decryptString(encrypted) : null

  if (!decrypted) return null

  return JSON.parse(decrypted) as SecureAppConfig
}

export function deleteSecureConfig(key: keyof SecureAppConfig) {
  const config = getSecureConfig()
  if (!config) return

  config[key] = null
  saveSecureConfig(config)
}
