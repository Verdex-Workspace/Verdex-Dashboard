/**
 * Extraction du texte d'un fichier fourni pour l'audit.
 * - PDF → `pdfjs-dist` (importé dynamiquement, uniquement pour ce cas) ;
 * - autres (.yml/.env/.md/.conf/.txt/.json…) → lecture texte directe.
 * Best-effort : toute erreur renvoie une chaîne vide (le doc reste listé sans
 * contenu, le pipeline continue). Contenu tronqué pour rester dans les limites LLM.
 */
const MAX_CHARS = 20_000

function isPdf(file: File): boolean {
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
}

async function extractPdf(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist')
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
  const buffer = await file.arrayBuffer()
  const doc = await pdfjs.getDocument({ data: buffer }).promise
  const parts: string[] = []
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p)
    const content = await page.getTextContent()
    parts.push(content.items.map((i) => ('str' in i ? i.str : '')).join(' '))
    if (parts.join('\n').length > MAX_CHARS) break
  }
  return parts.join('\n')
}

export async function extractText(file: File): Promise<string> {
  try {
    const text = isPdf(file) ? await extractPdf(file) : await file.text()
    return text.slice(0, MAX_CHARS)
  } catch {
    return ''
  }
}
