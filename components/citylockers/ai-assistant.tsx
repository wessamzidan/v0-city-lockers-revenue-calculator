"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useCityLockers, CURRENCY } from "@/lib/citylockers-context"
import { sendChatMessage } from "@/app/actions/chat"

type Message = {
  role: "user" | "assistant"
  content: string
}

const SYSTEM_PROMPT = `You are a helpful AI assistant for CityLockers Sales OS, a B2B revenue calculator for smart locker partnerships.

You help users understand:
- How the revenue calculator works
- Locker specifications and pricing
- Business model (Zero Capex/Opex - partners earn commission without any investment)
- Configuration options (location factors, property types, occupancy rates)
- How to create and manage scenarios

Key facts:
- CityLockers provides smart storage solutions for hospitality, residential, and commercial properties
- Partners earn 15-30% revenue share with zero capital expenditure
- Locker sizes: XL (48x55x85cm), L (48x33x85cm), M (48x28x58cm)
- Services include luggage storage, e-scooter rentals, and luggage transfers
- Seasonality factor affects revenue calculations
- 1 Unit = 14 Lockers = 2.2m wall space

Be concise, helpful, and professional. If asked about specific calculations, explain the formulas used.`

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your CityLockers AI assistant. I can help you understand the revenue calculator, locker specifications, and partnership benefits. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { state, financials } = useCityLockers()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    const contextMessage = `Current configuration context:
- Client: ${state.clientName}
- Property Type: ${state.propertyType}
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
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting. Please try again or contact Wessam via WhatsApp.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-xl shadow-2xl border z-50 flex flex-col max-h-[500px] print:hidden animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-[#FF9900] text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold">CityLockers AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-[#FF9900] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    msg.role === "user" ? "bg-[#FF9900] text-white" : "bg-gray-100 text-gray-800",
                  )}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
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
              />
              <Button type="submit" size="icon" className="bg-[#FF9900] hover:bg-[#E68A00]" disabled={isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-24 right-6 md:bottom-6 md:right-24 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50 print:hidden",
          isOpen ? "bg-gray-600 hover:bg-gray-700" : "bg-[#FF9900] hover:bg-[#E68A00]",
        )}
        aria-label="AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>
    </>
  )
}
