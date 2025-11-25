"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, memo } from "react"
import { BotMessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useCityLockers, CURRENCY } from "@/lib/citylockers-context"
import { sendChatMessage } from "@/app/actions/chat"

/**
 * Message type for chat history
 * @property role - Either 'user' or 'assistant'
 * @property content - The message text content
 */
type Message = {
  role: "user" | "assistant"
  content: string
}

/**
 * Initial greeting message shown when chat opens
 */
const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: `Welcome! I'm your CityLockers AI assistant.

**I can help you with:**
• Revenue calculations & projections
• Locker specifications & dimensions
• Partnership benefits (Zero Capex/Opex)
• Pricing & services information

What would you like to know?

_For official inquiries, visit citylockers.com_`,
}

/**
 * Formats AI response text with basic styling
 * Handles bold, bullets, and line breaks
 */
function formatMessage(content: string): React.ReactNode {
  const lines = content.split("\n")

  return lines.map((line, lineIndex) => {
    // Handle empty lines as breaks
    if (line.trim() === "") {
      return <br key={lineIndex} />
    }

    // Process the line for inline formatting
    let formattedLine: React.ReactNode[] = []
    let currentText = line

    // Handle bullet points
    const isBullet =
      currentText.trim().startsWith("•") || currentText.trim().startsWith("-") || currentText.trim().startsWith("*")
    if (isBullet) {
      currentText = currentText.replace(/^\s*[•\-*]\s*/, "")
    }

    // Split by bold markers (**text** or __text__)
    const boldRegex = /(\*\*|__)(.*?)\1/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match

    while ((match = boldRegex.exec(currentText)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(currentText.slice(lastIndex, match.index))
      }
      // Add bolded text
      parts.push(
        <strong key={`bold-${lineIndex}-${match.index}`} className="font-semibold">
          {match[2]}
        </strong>,
      )
      lastIndex = match.index + match[0].length
    }
    // Add remaining text
    if (lastIndex < currentText.length) {
      parts.push(currentText.slice(lastIndex))
    }

    formattedLine = parts.length > 0 ? parts : [currentText]

    // Handle italic (_text_)
    formattedLine = formattedLine.flatMap((part, partIndex) => {
      if (typeof part === "string") {
        const italicRegex = /_(.*?)_/g
        const italicParts: React.ReactNode[] = []
        let italicLastIndex = 0
        let italicMatch

        while ((italicMatch = italicRegex.exec(part)) !== null) {
          if (italicMatch.index > italicLastIndex) {
            italicParts.push(part.slice(italicLastIndex, italicMatch.index))
          }
          italicParts.push(
            <em key={`italic-${lineIndex}-${partIndex}-${italicMatch.index}`} className="italic text-gray-500">
              {italicMatch[1]}
            </em>,
          )
          italicLastIndex = italicMatch.index + italicMatch[0].length
        }
        if (italicLastIndex < part.length) {
          italicParts.push(part.slice(italicLastIndex))
        }
        return italicParts.length > 0 ? italicParts : part
      }
      return part
    })

    // Render bullet point or regular line
    if (isBullet) {
      return (
        <div key={lineIndex} className="flex gap-2 ml-1">
          <span className="text-[#FF9900]">•</span>
          <span>{formattedLine}</span>
        </div>
      )
    }

    // Check if it's a header (starts with ##)
    if (line.trim().startsWith("##")) {
      return (
        <div key={lineIndex} className="font-semibold text-[#FF9900] mt-2 mb-1">
          {line.replace(/^#+\s*/, "")}
        </div>
      )
    }

    return <div key={lineIndex}>{formattedLine}</div>
  })
}

/**
 * ChatMessages Component - Memoized for performance
 * Renders the list of chat messages with proper styling
 */
const ChatMessages = memo(function ChatMessages({
  messages,
  isLoading,
  messagesEndRef,
}: {
  messages: Message[]
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
      {messages.map((msg, idx) => (
        <div key={idx} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
          {msg.role === "assistant" && (
            <div className="w-7 h-7 rounded-full bg-[#FF9900] flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}
          <div
            className={cn(
              "max-w-[85%] rounded-lg px-3 py-2 text-sm",
              msg.role === "user" ? "bg-[#FF9900] text-white" : "bg-gray-100 text-gray-800",
            )}
          >
            {msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
          </div>
          {msg.role === "user" && (
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="flex gap-2 items-center text-gray-500">
          <div className="w-7 h-7 rounded-full bg-[#FF9900]/20 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-[#FF9900]" />
          </div>
          <span className="text-sm">Thinking...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
})

/**
 * AIAssistant Component
 *
 * A floating AI chatbot that provides contextual help about CityLockers
 * services, pricing, and the revenue calculator. Uses OpenRouter API
 * for AI responses with a comprehensive system prompt containing
 * all CityLockers business information.
 *
 * Features:
 * - Floating action button with chat window
 * - Real-time context from current calculator state
 * - Trained on CityLockers products, pricing, and business model
 * - Fallback to website/contact when unsure
 *
 * @requires OPENROUTER_API_KEY environment variable
 */
export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { state, financials } = useCityLockers()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /**
   * Handles sending a message to the AI
   * Includes current calculator context for relevant responses
   */
  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    // Build context from current calculator state
    const contextMessage = `Current configuration context:
- Client: ${state.clientName}
- Property Type: ${state.propertyType}
- Location Factor: ${state.locationFactor}x
- Lockers: M=${state.lockerM.qty}, L=${state.lockerL.qty}, XL=${state.lockerXL.qty}
- Revenue Share: ${state.revenueShare}%
- Estimated Annual Income: ${CURRENCY} ${financials.partnerAnnual.toLocaleString()}

User question: ${userMessage}`

    try {
      const result = await sendChatMessage(
        messages.map((m) => ({ role: m.role, content: m.content })),
        contextMessage,
      )
      setMessages((prev) => [...prev, { role: "assistant", content: result.message }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting. Please try again or visit citylockers.com for assistance.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages, state, financials])

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-xl shadow-2xl border z-50 flex flex-col max-h-[500px] print:hidden animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-[#FF9900] text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BotMessageSquare className="w-5 h-5" />
              <div>
                <span className="font-semibold block">CityLockers Assistant</span>
                <span className="text-xs opacity-80">Powered by AI</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <ChatMessages messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />

          {/* Input Form */}
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about lockers, pricing, revenue..."
                className="flex-1"
                disabled={isLoading}
                aria-label="Chat message"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-[#FF9900] hover:bg-[#E68A00]"
                disabled={isLoading}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-24 right-6 md:bottom-6 md:right-24 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50 print:hidden",
          isOpen ? "bg-gray-600 hover:bg-gray-700" : "bg-[#FF9900] hover:bg-[#E68A00]",
        )}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <BotMessageSquare className="w-6 h-6 text-white" />}
      </button>
    </>
  )
}
