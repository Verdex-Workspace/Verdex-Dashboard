import { describe, expect, it } from 'vitest'
import { extractText } from '@/lib/pdf'

describe('extractText', () => {
  it('lit le contenu texte des fichiers non-PDF', async () => {
    const file = new File(['ports:\n  - 5432'], 'docker-compose.yml', { type: 'text/yaml' })
    expect(await extractText(file)).toContain('5432')
  })

  it('tronque les contenus très longs', async () => {
    const big = 'a'.repeat(30_000)
    const file = new File([big], 'big.txt', { type: 'text/plain' })
    const out = await extractText(file)
    expect(out.length).toBeLessThanOrEqual(20_000)
  })
})
