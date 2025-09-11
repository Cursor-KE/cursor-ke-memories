"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAPIIntegrations } from "@/hooks/use-api-integrations"

const KeyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
    />
  </svg>
)

const BrainIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const PlugIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3V1m10 20a4 4 0 004-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4zM17 3V1"
    />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const LoaderIcon = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

export function APIIntegrations() {
  const { integrations, stats, isLoading, error, testConnection, toggleIntegration, addIntegration } =
    useAPIIntegrations()
  const [testingId, setTestingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    type: "Custom" as const,
    config: { baseUrl: "", apiKey: "", timeout: 10000 },
    capabilities: [""],
  })

  const [llmKeys, setLlmKeys] = useState({
    openai: "",
    gemini: "",
    anthropic: "",
    groq: "",
    cohere: "",
  })
  const [showLlmForm, setShowLlmForm] = useState(false)

  const handleTest = async (integrationId: string) => {
    setTestingId(integrationId)
    await testConnection(integrationId)
    setTestingId(null)
  }

  const handleToggle = async (integrationId: string) => {
    await toggleIntegration(integrationId)
  }

  const handleAddIntegration = async () => {
    const capabilities = newIntegration.capabilities.filter((cap) => cap.trim() !== "")
    const result = await addIntegration({
      ...newIntegration,
      status: "disconnected",
      enabled: false,
      capabilities,
    })

    if (result) {
      setShowAddForm(false)
      setNewIntegration({
        name: "",
        type: "Custom",
        config: { baseUrl: "", apiKey: "", timeout: 10000 },
        capabilities: [""],
      })
    }
  }

  const handleSaveLlmKeys = () => {
    // Save to localStorage or send to API
    localStorage.setItem("llm-keys", JSON.stringify(llmKeys))
    setShowLlmForm(false)
    // Show success message
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoaderIcon />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Infrastructure & API Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowLlmForm(true)} variant="outline" className="flex items-center gap-2">
            <BrainIcon />
            LLM Keys
          </Button>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <PlusIcon />
            Add Integration
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="llm-models">LLM Models</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Integration Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <PlugIcon />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Connected</p>
                    <p className="text-2xl font-bold text-primary">{stats.connected}</p>
                  </div>
                  <CheckCircleIcon />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-primary">{stats.enabled}</p>
                  </div>
                  <BrainIcon />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">API Calls</p>
                    <p className="text-2xl font-bold">{stats.totalRequests}</p>
                  </div>
                  <KeyIcon />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          {/* Integration List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlugIcon />
                Available Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            integration.status === "connected"
                              ? "bg-primary"
                              : integration.status === "testing"
                                ? "bg-primary animate-pulse"
                                : integration.status === "error"
                                  ? "bg-destructive"
                                  : "bg-muted-foreground"
                          }`}
                        />
                        {testingId === integration.id && <LoaderIcon />}
                      </div>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{integration.type}</span>
                          {integration.usage && <span>• {integration.usage.requestCount} calls</span>}
                          {integration.testResult?.responseTime && (
                            <span>• {integration.testResult.responseTime}ms</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge variant={integration.status === "connected" ? "secondary" : "outline"}>
                        {integration.status}
                      </Badge>

                      {integration.status === "connected" && (
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`toggle-${integration.id}`} className="text-sm">
                            Enable
                          </Label>
                          <Switch
                            id={`toggle-${integration.id}`}
                            checked={integration.enabled}
                            onCheckedChange={() => handleToggle(integration.id)}
                          />
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTest(integration.id)}
                        disabled={testingId === integration.id}
                      >
                        {testingId === integration.id ? <LoaderIcon /> : "Test"}
                      </Button>

                      <Button variant="outline" size="sm">
                        <SettingsIcon />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llm-models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainIcon />
                LLM API Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure your own LLM API keys to use different models. Keys are stored securely and encrypted.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input
                    id="openai-key"
                    type="password"
                    placeholder="sk-..."
                    value={llmKeys.openai}
                    onChange={(e) => setLlmKeys((prev) => ({ ...prev, openai: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gemini-key">Google Gemini API Key</Label>
                  <Input
                    id="gemini-key"
                    type="password"
                    placeholder="AIza..."
                    value={llmKeys.gemini}
                    onChange={(e) => setLlmKeys((prev) => ({ ...prev, gemini: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                  <Input
                    id="anthropic-key"
                    type="password"
                    placeholder="sk-ant-..."
                    value={llmKeys.anthropic}
                    onChange={(e) => setLlmKeys((prev) => ({ ...prev, anthropic: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groq-key">Groq API Key</Label>
                  <Input
                    id="groq-key"
                    type="password"
                    placeholder="gsk_..."
                    value={llmKeys.groq}
                    onChange={(e) => setLlmKeys((prev) => ({ ...prev, groq: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cohere-key">Cohere API Key</Label>
                  <Input
                    id="cohere-key"
                    type="password"
                    placeholder="..."
                    value={llmKeys.cohere}
                    onChange={(e) => setLlmKeys((prev) => ({ ...prev, cohere: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveLlmKeys}>Save API Keys</Button>
                <Button
                  variant="outline"
                  onClick={() => setLlmKeys({ openai: "", gemini: "", anthropic: "", groq: "", cohere: "" })}
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add New Integration Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusIcon />
              Add New Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="integration-name">Integration Name</Label>
                <Input
                  id="integration-name"
                  placeholder="Enter integration name"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="integration-type">Type</Label>
                <Select
                  value={newIntegration.type}
                  onValueChange={(value: any) => setNewIntegration((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AI Model">AI Model</SelectItem>
                    <SelectItem value="Data Source">Data Source</SelectItem>
                    <SelectItem value="Productivity">Productivity</SelectItem>
                    <SelectItem value="Communication">Communication</SelectItem>
                    <SelectItem value="Storage">Storage</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-url">API Base URL</Label>
              <Input
                id="api-url"
                placeholder="https://api.example.com"
                value={newIntegration.config.baseUrl}
                onChange={(e) =>
                  setNewIntegration((prev) => ({
                    ...prev,
                    config: { ...prev.config, baseUrl: e.target.value },
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">API Key (Optional)</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter API key"
                value={newIntegration.config.apiKey}
                onChange={(e) =>
                  setNewIntegration((prev) => ({
                    ...prev,
                    config: { ...prev.config, apiKey: e.target.value },
                  }))
                }
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddIntegration}>Add Integration</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button variant="outline">{/* Documentation link */}</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
