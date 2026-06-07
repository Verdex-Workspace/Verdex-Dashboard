import { describe, expect, it, vi } from 'vitest'

// Mock du client Supabase pour exercer les chemins persistés du service Cyber.
vi.mock('@/lib/supabase', () => {
  const docRow = { id: 'd1', name: 'infra.txt', status: 'ok', content: 'ports: 5432' }
  const reportRow = {
    id: 'r1',
    scores: [{ key: 'Score sécurité', value: '80 / 100', kind: 'ok' }],
    vulnerabilities: [
      {
        id: 'v1',
        severity: 'warn',
        severityLabel: 'élevée',
        cvss: '7.0',
        finding: 'F',
        component: 'c',
        why: 'w',
        how: 'h',
        benefits: ['b'],
      },
    ],
    created_at: '2026-06-07',
  }
  const builder = {
    select: () => builder,
    eq: () => builder,
    // `order` est terminal pour listDocuments (await direct) ET chaînable pour le rapport.
    order: () =>
      Object.assign(Promise.resolve({ data: [docRow], error: null }), {
        limit: () => ({ maybeSingle: () => Promise.resolve({ data: reportRow, error: null }) }),
      }),
    insert: () =>
      Object.assign(Promise.resolve({ error: null }), {
        select: () => ({ single: () => Promise.resolve({ data: docRow, error: null }) }),
      }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
  }
  const storage = {
    from: () => ({ upload: () => Promise.resolve({ data: { path: 'me/x' }, error: null }) }),
  }
  return { supabase: { from: () => builder, storage }, isSupabaseConfigured: true }
})

const { listDocuments, fetchLatestReport, fetchAudit, saveReport, removeDocument, uploadDocument } =
  await import('@/services/cyber.service')

describe('cyber.service (Supabase mocké)', () => {
  it('listDocuments mappe les lignes', async () => {
    const docs = await listDocuments('me')
    expect(docs[0]).toMatchObject({ id: 'd1', name: 'infra.txt', statusLabel: 'indexé' })
  })

  it('fetchLatestReport renvoie le dernier rapport', async () => {
    const r = await fetchLatestReport('me')
    expect(r?.vulnerabilities[0].finding).toBe('F')
  })

  it('fetchAudit fusionne le rapport persisté', async () => {
    const data = await fetchAudit('me')
    expect(data.scores[0].value).toBe('80 / 100')
    expect(data.vulnerabilities[0].finding).toBe('F')
  })

  it('saveReport se résout', async () => {
    await expect(
      saveReport({ scores: [], vulnerabilities: [] }, { synthesis: 'S', documents: ['a'] }, 'me'),
    ).resolves.toBeUndefined()
  })

  it('removeDocument se résout', async () => {
    await expect(removeDocument('d1')).resolves.toBeUndefined()
  })

  it('uploadDocument téléverse et renvoie le document', async () => {
    const file = new File(['ports: 5432'], 'infra.txt', { type: 'text/plain' })
    const doc = await uploadDocument(file, 'me')
    expect(doc.id).toBe('d1')
    expect(doc.content).toContain('5432')
  })
})
