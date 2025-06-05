This is the [assistant-ui](https://github.com/Yonom/assistant-ui) starter project.

## Getting Started

### Option 1: With OpenAI API Key (Full AI Features)

Add your OpenAI API key to `.env.local` file:

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Option 2: Without API Key (Mock Responses)

The app will automatically use mock AI responses when no OpenAI API key is found. This is perfect for:
- Testing the UI without incurring API costs
- Deploying to Vercel without exposing API keys
- Development environments where you don't need real AI responses

### Running the Development Server

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
