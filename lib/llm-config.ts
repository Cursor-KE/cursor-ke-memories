import { openai } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'
import { anthropic } from '@ai-sdk/anthropic'
import { groq } from '@ai-sdk/groq'
import { cohere } from '@ai-sdk/cohere'

export type LLMProvider = 'openai' | 'google' | 'anthropic' | 'groq' | 'cohere'

export interface LLMConfig {
  provider: LLMProvider
  model: string
  apiKey?: string
  temperature?: number
  maxTokens?: number
}

export const LLM_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o-mini',
    apiKeyEnv: 'OPENAI_API_KEY',
    client: openai
  },
  google: {
    name: 'Google AI',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
    defaultModel: 'gemini-1.5-flash',
    apiKeyEnv: 'GOOGLE_AI_API_KEY',
    client: google
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
    defaultModel: 'claude-3-5-sonnet-20241022',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    client: anthropic
  },
  groq: {
    name: 'Groq',
    models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    defaultModel: 'llama-3.1-70b-versatile',
    apiKeyEnv: 'GROQ_API_KEY',
    client: groq
  },
  cohere: {
    name: 'Cohere',
    models: ['command-r-plus', 'command-r', 'command-light'],
    defaultModel: 'command-r-plus',
    apiKeyEnv: 'COHERE_API_KEY',
    client: cohere
  }
} as const

export function getLLMClient(provider: LLMProvider, apiKey?: string) {
  const providerConfig = LLM_PROVIDERS[provider]
  
  if (!providerConfig) {
    throw new Error(`Unsupported LLM provider: ${provider}`)
  }

  // Use provided API key or fall back to environment variable
  const key = apiKey || process.env[providerConfig.apiKeyEnv]
  
  if (!key) {
    throw new Error(`API key not found for ${providerConfig.name}. Please set ${providerConfig.apiKeyEnv} environment variable or provide an API key.`)
  }

  // Return the configured client
  return providerConfig.client({
    apiKey: key
  })
}

export function getDefaultLLMConfig(): LLMConfig {
  // Check which providers have API keys available
  const availableProviders = Object.entries(LLM_PROVIDERS).find(([_, config]) => 
    process.env[config.apiKeyEnv]
  )

  if (availableProviders) {
    const [provider, config] = availableProviders
    return {
      provider: provider as LLMProvider,
      model: config.defaultModel,
      temperature: 0.7,
      maxTokens: 1000
    }
  }

  // Fallback to OpenAI if no keys are found
  return {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 1000
  }
}

export function validateLLMConfig(config: Partial<LLMConfig>): LLMConfig {
  const defaultConfig = getDefaultLLMConfig()
  
  return {
    provider: config.provider || defaultConfig.provider,
    model: config.model || defaultConfig.model,
    apiKey: config.apiKey,
    temperature: config.temperature ?? defaultConfig.temperature,
    maxTokens: config.maxTokens ?? defaultConfig.maxTokens
  }
}
