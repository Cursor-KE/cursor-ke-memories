# NOC AI Assistant

A comprehensive Network Operations Center (NOC) AI assistant built with Next.js and the Vercel AI SDK. This intelligent system provides real-time network monitoring, incident management, and automated NOC operations with support for custom LLM integrations.

## 🚀 Features

### Core Capabilities
- **Intelligent Chat Interface**: AI-powered assistant specialized in network operations and troubleshooting
- **Real-time Network Monitoring**: Live infrastructure status tracking and performance metrics
- **Incident Management**: Automated incident detection, classification, and response workflows
- **Network Topology Visualization**: Interactive network maps and infrastructure overview
- **Custom LLM Integration**: Bring your own API keys (OpenAI, Gemini, Anthropic, Groq, Cohere)
- **Context-Aware Responses**: Maintains conversation history and learns from user interactions
- **Performance Optimization**: Advanced caching, request batching, and real-time monitoring

### Advanced Features
- **Learning Engine**: Adapts responses based on user feedback and interaction patterns
- **API Integration Management**: Connect and manage external network monitoring tools
- **Performance Analytics**: Detailed metrics and alerting for system optimization
- **Vercel Design System**: Clean, professional interface matching Vercel's aesthetic

## 🏗️ Architecture

### Frontend Components
\`\`\`
components/
├── ai-agent-dashboard.tsx      # Main NOC dashboard with tabbed interface
├── chat-interface.tsx          # AI chat with streaming responses
├── noc-network-topology.tsx    # Network visualization component
├── noc-incident-board.tsx      # Incident management interface
├── api-integrations.tsx        # LLM and API key management
├── performance-monitor.tsx     # Real-time performance metrics
├── context-manager.tsx         # Conversation context tracking
└── feedback-widget.tsx         # User feedback collection
\`\`\`

### Backend Services
\`\`\`
app/api/
├── chat/route.ts              # AI chat endpoint with streaming
├── context/route.ts           # Context management API
├── learning/route.ts          # Learning engine endpoints
├── integrations/route.ts      # API integration management
├── performance/route.ts       # Performance metrics API
└── summarize/route.ts         # Conversation summarization
\`\`\`

### Core Libraries
\`\`\`
lib/
├── ai-agent.ts               # Core AI agent logic and context management
├── learning-engine.ts        # Feedback analysis and response adaptation
├── performance-monitor.ts    # System performance tracking
├── cache-manager.ts          # Intelligent caching with LRU eviction
├── request-optimizer.ts      # Request batching and optimization
└── api-integrations.ts       # External API management
\`\`\`

### Custom Hooks
\`\`\`
hooks/
├── use-ai-agent.ts           # Main AI chat functionality
├── use-learning.ts           # Learning engine integration
├── use-performance.ts        # Performance monitoring
└── use-api-integrations.ts   # API management hooks
\`\`\`

## 🛠️ Implementation Details

### AI Agent Core
The AI agent is built around a sophisticated context management system that:
- Maintains conversation history with intelligent summarization
- Tracks user preferences and communication patterns
- Provides NOC-specific knowledge and troubleshooting capabilities
- Adapts responses based on feedback and learning data

### Performance Optimization
- **Caching Strategy**: LRU cache with automatic eviction and hit rate tracking
- **Request Batching**: Intelligent batching of API calls to reduce latency
- **Memory Management**: Automatic context optimization when memory usage exceeds thresholds
- **Real-time Monitoring**: Performance alerts and metrics dashboard

### Learning System
- **Feedback Collection**: Both quick (helpful/unhelpful) and detailed feedback
- **Pattern Analysis**: Identifies successful response patterns and improvement areas
- **Adaptive Responses**: Modifies response style based on user preferences
- **Continuous Improvement**: Tracks learning metrics and adaptation success

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
\`\`\`bash
git clone <your-repo-url>
cd noc-ai-assistant
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
\`\`\`env
# LLM API Keys - Add your API keys here
# You can get these from the respective providers:

# OpenAI (https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-openai-key-here

# Google AI (https://makersuite.google.com/app/apikey)
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key-here

# Anthropic (https://console.anthropic.com/)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here

# Groq (https://console.groq.com/keys)
GROQ_API_KEY=gsk_your-groq-key-here

# Cohere (https://dashboard.cohere.ai/api-keys)
COHERE_API_KEY=your-cohere-key-here

# For production deployment
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Note**: You only need to add the API keys for the LLM providers you want to use. The system will automatically detect which providers are available and use the first one found.
\`\`\`

4. **Run the development server**
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. **Open your browser**
Navigate to `http://localhost:3000` to see the application.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Vercel will automatically detect it's a Next.js project

3. **Configure Environment Variables**
In your Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add your LLM API keys (optional, users can add their own)
- Add `NEXT_PUBLIC_APP_URL` with your Vercel domain

4. **Deploy**
Vercel will automatically deploy your application. Future pushes to main will trigger automatic deployments.

### Alternative Deployment Options

#### Docker Deployment
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

#### Manual Server Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## ⚙️ Configuration

### LLM API Keys
Users can configure their own API keys through the Infrastructure tab:
1. Navigate to Infrastructure → LLM Models
2. Select your preferred LLM provider
3. Enter your API key securely
4. Test the connection
5. Save configuration

### Supported LLM Providers
- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Google AI**: Gemini Pro, Gemini Pro Vision
- **Anthropic**: Claude 3 Opus, Claude 3 Sonnet
- **Groq**: Llama 2, Mixtral
- **Cohere**: Command, Command Light

### Performance Tuning
Adjust performance settings in `lib/performance-monitor.ts`:
\`\`\`typescript
const PERFORMANCE_THRESHOLDS = {
  responseTime: 2000,    // Alert if response > 2s
  memoryUsage: 0.8,      // Alert if memory > 80%
  errorRate: 0.05,       // Alert if error rate > 5%
  cacheHitRate: 0.7      // Alert if cache hit rate < 70%
}
\`\`\`

## 📖 Usage

### Basic Chat
1. Open the application
2. Navigate to the "Chat" tab
3. Type your network-related questions or commands
4. The AI will provide specialized NOC assistance

### Incident Management
1. Go to the "Incidents" tab
2. View active incidents and their status
3. Use the AI chat to get troubleshooting assistance
4. Track incident resolution progress

### Network Monitoring
1. Access the "Monitoring" tab
2. View real-time network topology
3. Monitor performance metrics
4. Set up alerts and thresholds

### API Integration
1. Navigate to "Infrastructure" → "API Integrations"
2. Add your monitoring tools and external APIs
3. Test connections and configure webhooks
4. Monitor integration health and usage

## 🔧 Customization

### Adding New LLM Providers
Edit `components/api-integrations.tsx` to add new providers:
\`\`\`typescript
const llmProviders = [
  // ... existing providers
  {
    id: 'new-provider',
    name: 'New Provider',
    description: 'Description of the new provider',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password' }
    ]
  }
]
\`\`\`

### Custom NOC Workflows
Extend the incident management system in `components/noc-incident-board.tsx`:
\`\`\`typescript
const customWorkflows = [
  {
    name: 'Custom Escalation',
    steps: ['detect', 'analyze', 'escalate', 'resolve'],
    automation: true
  }
]
\`\`\`

## 🐛 Troubleshooting

### Common Issues

**Blank Page on Load**
- Check browser console for JavaScript errors
- Verify all dependencies are installed: `npm install`
- Ensure Node.js version is 18+

**API Key Not Working**
- Verify the API key is correct and has proper permissions
- Check if the provider's API is accessible from your deployment region
- Test the connection using the built-in connection tester

**Performance Issues**
- Monitor the Performance tab for bottlenecks
- Adjust cache settings in `lib/cache-manager.ts`
- Check memory usage and optimize context management

**Chat Not Responding**
- Verify LLM API key is configured correctly
- Check network connectivity to the LLM provider
- Review browser console for error messages

## 📊 Monitoring

### Built-in Analytics
The application includes comprehensive monitoring:
- Response time tracking
- Memory usage monitoring
- Cache hit rate analysis
- Error rate tracking
- User interaction metrics

### Performance Alerts
Automatic alerts are generated for:
- Slow response times (>2 seconds)
- High memory usage (>80%)
- Low cache hit rates (<70%)
- High error rates (>5%)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add new feature'`
5. Push to the branch: `git push origin feature/new-feature`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the troubleshooting section above
2. Review the GitHub issues for similar problems
3. Create a new issue with detailed information about your problem
4. For deployment issues on Vercel, check [Vercel's documentation](https://vercel.com/docs)

## 🔮 Future Enhancements

- Real-time network device integration
- Advanced ML-based anomaly detection
- Multi-tenant support for enterprise deployments
- Mobile application for on-call engineers
- Integration with popular NOC tools (Nagios, Zabbix, etc.)
- Advanced reporting and analytics dashboard
