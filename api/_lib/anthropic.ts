// ============================================================
// Client Anthropic (API Claude) — côté serveur uniquement.
// La clé ANTHROPIC_API_KEY reste un secret serveur, jamais exposée au client.
// Dégradation gracieuse : sans clé, `analyze` renvoie null → repli mock côté appelant.
// ============================================================
import Anthropic from '@anthropic-ai/sdk'

let client: Anthropic | null | undefined

function getClient(): Anthropic | null {
  if (client !== undefined) return client
  const apiKey = process.env.ANTHROPIC_API_KEY
  client = apiKey ? new Anthropic({ apiKey }) : null
  return client
}

/** Indique si l'API Claude est configurée (clé présente). */
export function isAnthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

/** Envoie un prompt système + utilisateur à Claude et renvoie le texte (ou null). */
export async function analyze(system: string, user: string): Promise<string | null> {
  const c = getClient()
  if (!c) return null
  const model = process.env.ANTHROPIC_MODEL ?? 'claude-3-5-sonnet-latest'
  try {
    const res = await c.messages.create({
      model,
      max_tokens: 2048,
      system,
      messages: [{ role: 'user', content: user }],
    })
    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    return text || null
  } catch {
    return null
  }
}
