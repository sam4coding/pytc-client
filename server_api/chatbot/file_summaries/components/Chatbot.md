# client/src/components/Chatbot.js

AI assistant panel for helping users navigate PyTC Client. Renders a chat UI with message history, Markdown rendering, and server-backed responses.

## Props

- **`onClose`** — Callback when user closes the chat (e.g. drawer)

## Features

- **Message persistence** — Saves messages to `localStorage` under `chatMessages`
- **Markdown rendering** — Uses `react-markdown` with `remarkGfm` for lists, tables, code blocks
- **Keyboard shortcut** — Enter (without Shift) sends message
- **Clear chat** — Popconfirm to clear; calls `clearChat()` API and resets to initial greeting

## API Calls

- `queryChatBot(query)` — Sends user message, displays response
- `clearChat()` — Clears server-side history and local state

## UI Layout

- Header: "AI Assistant" title, Clear button, Close button
- Scrollable message list (user messages right-aligned, blue; bot messages left-aligned, gray)
- TextArea + Send button at bottom
