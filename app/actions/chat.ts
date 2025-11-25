"use server"

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

type ChatMessage = {
  role: "user" | "assistant" | "system"
  content: string
}

export async function sendChatMessage(
  messages: ChatMessage[],
  contextMessage: string,
): Promise<{ success: boolean; message: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    return {
      success: false,
      message:
        "AI assistant is not configured. Please add your OPENROUTER_API_KEY in the Vars section of the sidebar to enable this feature.",
    }
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: contextMessage },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to get response from AI")
    }

    const data = await response.json()
    const assistantMessage =
      data.choices?.[0]?.message?.content || "I apologize, but I couldn't process your request. Please try again."

    return { success: true, message: assistantMessage }
  } catch (error) {
    console.error("AI chat error:", error)
    return {
      success: false,
      message:
        "I'm having trouble connecting right now. Please try again later or contact Wessam directly via WhatsApp for assistance.",
    }
  }
}
