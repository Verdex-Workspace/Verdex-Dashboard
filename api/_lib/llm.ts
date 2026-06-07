// ============================================================
// Connecteur LLM générique, compatible **API OpenAI** (`/chat/completions`).
// Piloté par 3 variables d'env (secrets serveur) → on change de fournisseur
// sans toucher au code :
//   LLM_BASE_URL  ex. https://models.github.ai/inference   (GitHub Models)
//   LLM_API_KEY   clé / PAT (GitHub : fine-grained, permission `models: read`)
//   LLM_MODEL     ex. openai/gpt-4.1 · deepseek/DeepSeek-R1 · meta/Llama-3.3-70B-Instruct
//
// Compatible aussi : Groq, OpenRouter, Mistral, Together, OpenAI, Ollama (local)…
// Sans configuration → `analyze` renvoie null → repli mock côté appelant.
// ============================================================

/** Indique si un fournisseur LLM compatible OpenAI est configuré. */
export function isLlmConfigured(): boolean {
  return Boolean(process.env.LLM_BASE_URL && process.env.LLM_API_KEY && process.env.LLM_MODEL)
}

/** Envoie un prompt système + utilisateur et renvoie le texte de la réponse (ou null). */
export async function analyze(system: string, user: string): Promise<string | null> {
  const base = process.env.LLM_BASE_URL
  const key = process.env.LLM_API_KEY
  const model = process.env.LLM_MODEL
  if (!base || !key || !model) return null
  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        temperature: 0.2,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    return data.choices?.[0]?.message?.content ?? null
  } catch {
    return null
  }
}
