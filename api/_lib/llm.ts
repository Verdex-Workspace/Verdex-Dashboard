// ============================================================
// Connecteur LLM générique, compatible **API OpenAI** (`/chat/completions`).
// Piloté par 3 variables d'env (secrets serveur) → on change de fournisseur
// sans toucher au code :
//   LLM_BASE_URL  ex. https://models.github.ai/inference   (GitHub Models)
//   LLM_API_KEY   clé / PAT (GitHub : fine-grained, permission `models: read`)
//   LLM_MODEL     ex. openai/gpt-4.1 · deepseek/DeepSeek-R1 · mistral-ai/Mistral-Large
//   LLM_MAX_TOKENS (optionnel, défaut 4096)
//
// Compatible aussi : Groq, OpenRouter, Mistral, Together, OpenAI, Ollama (local)…
// `analyze` **lève une erreur explicite** en cas d'échec (le repli mock + le
// message d'erreur sont gérés par l'appelant — on ne masque plus la cause).
// ============================================================

/** Indique si un fournisseur LLM compatible OpenAI est configuré. */
export function isLlmConfigured(): boolean {
  return Boolean(process.env.LLM_BASE_URL && process.env.LLM_API_KEY && process.env.LLM_MODEL)
}

/** Retire le bloc de raisonnement `<think>…</think>` (modèles type DeepSeek-R1). */
function stripReasoning(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
}

/**
 * Envoie un prompt système + utilisateur et renvoie le texte (raisonnement
 * retiré). Lève une `Error` au message court en cas d'échec HTTP / réseau /
 * réponse vide, pour que l'appelant puisse remonter la raison.
 */
export async function analyze(system: string, user: string): Promise<string> {
  const base = process.env.LLM_BASE_URL
  const key = process.env.LLM_API_KEY
  const model = process.env.LLM_MODEL
  if (!base || !key || !model) throw new Error('llm_not_configured')
  const maxTokens = Number(process.env.LLM_MAX_TOKENS) || 4096

  let res: Response
  try {
    res = await fetch(`${base.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature: 0.2,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    })
  } catch {
    throw new Error('llm_unreachable')
  }
  if (!res.ok) {
    // 429 = quota / rate-limit (fréquent sur les tiers gratuits), 401 = clé invalide…
    const detail = await res.text().catch(() => '')
    throw new Error(`llm_http_${res.status}${detail ? `: ${detail.slice(0, 140)}` : ''}`)
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  const content = stripReasoning(data.choices?.[0]?.message?.content ?? '')
  if (!content) throw new Error('llm_empty_response')
  return content
}
