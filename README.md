# ShengBot - AI Assistant in Kenyan Sheng

ShengBot is an AI assistant that communicates fluently in Kenyan Sheng, a unique blend of Swahili, English, and Nairobi urban slang. Built with Next.js, Vercel AI SDK, and shadcn/ui components.

## Features

- 🤖 AI-powered chat interface using Google Gemini
- 🇰🇪 Fluent in Kenyan Sheng language
- 🎨 Modern UI with Vercel theme styling
- 📱 Responsive design with shadcn/ui components
- ⚡ Real-time streaming responses
- 🌙 Dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Google AI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vercel-ship-25-coding-agent
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your Google AI API key to `.env.local`:
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting with ShengBot!

## How to Get Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key" in the left sidebar
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## ShengBot Features

ShengBot is designed to communicate naturally in Kenyan Sheng, using phrases like:

- **Sasa** - What's up/How are you
- **Vipi** - How are you  
- **Sawa** - Okay/Alright
- **Poa** - Cool/Fine
- **Mambo** - Things/What's going on
- **Safi** - Good/Clean
- **Kiasi** - A bit/Somewhat
- **Kwanza** - First/Especially
- **Bana** - Dude/Man

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI**: Vercel AI SDK with Google Gemini
- **UI**: shadcn/ui components with Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Deployment

Deploy easily on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/vercel-ship-25-coding-agent)

## Contributing

Feel free to contribute to make ShengBot even better! Some ideas:

- Add more Sheng phrases and expressions
- Improve the UI/UX
- Add voice input/output
- Add conversation history
- Add different Sheng dialects

## License

MIT License - feel free to use this project for your own ShengBot implementations!
