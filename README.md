# Cloudflare Pages + Functions + React + TypeScript (OpenAI GraphQL Proxy)

This repo is a template to deploy a React + TypeScript frontend to Cloudflare Pages with a Pages Function
(`/api/chat`) that proxies GraphQL-like requests to the OpenAI Chat Completions API.

## Quick start

1. Install
```bash
npm install
```

2. Local dev
```bash
npm run dev
```

> Note: Pages Functions won't run locally with Vite — to fully test functions you can use Cloudflare `wrangler` or deploy to Pages preview.

3. Build
```bash
npm run build
```

4. Push to GitHub and connect the repo to Cloudflare Pages.
 - Build command: `npm run build`
 - Build output directory: `dist`
 - Add Pages Environment Variable: `OPENAI_API_KEY` with your OpenAI secret key.

## Usage
Front-end calls `/api/chat` with a GraphQL-like payload:
{
  "query": "mutation { chat { choices { message { content } } } }",
  "variables": {
    "model": "gpt-4o-mini",
    "messages": [{ "role": "user", "content": "Hello" }],
    "stream": false
  }
}

The function proxies to OpenAI and returns `{ "data": <openai-response> }` or streams SSE if `stream=true`.

## Notes
- Remember to set `OPENAI_API_KEY` in Pages environment variables.
- Monitor OpenAI usage (billing & rate limits).
- For production consider adding authentication and rate limiting in the function.
