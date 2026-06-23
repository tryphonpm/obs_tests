import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const defaultInputPath = 'public/source/baf_v1.txt'
const defaultOutputDir = 'public/texts'

const inputPath = process.argv[2] ?? defaultInputPath
const outputDir = process.argv[3] ?? defaultOutputDir

const pageMarkerPattern = /^\s*- (\d{1,2}) -\s*$/gm

function printUsage() {
  console.error(`Usage: node scripts/source/split-texts.js [fichier.txt] [dossier-sortie]

Exemple:
  node scripts/source/split-texts.js public/source/baf_v1.txt public/texts`)
}

function normalizeLineEndings(content) {
  return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

function splitByPageMarkers(content) {
  const normalizedContent = normalizeLineEndings(content)
  const matches = [...normalizedContent.matchAll(pageMarkerPattern)]

  if (matches.length === 0) {
    throw new Error('Aucun marqueur "- XX -" trouvé dans le fichier source')
  }

  const preamble = normalizedContent.slice(0, matches[0].index).trim()
  if (preamble.length > 0) {
    console.warn('Contenu avant le premier marqueur ignoré')
  }

  return matches.map((match, index) => {
    const label = match[1]
    const contentStart = match.index + match[0].length
    const contentEnd = index + 1 < matches.length
      ? matches[index + 1].index
      : normalizedContent.length

    const sectionContent = normalizedContent
      .slice(contentStart, contentEnd)
      .replace(/^\n+/, '')
      .replace(/\n+$/, '')

    return { label, content: sectionContent }
  })
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    printUsage()
    return
  }

  const resolvedInputPath = path.resolve(inputPath)
  const resolvedOutputDir = path.resolve(outputDir)
  const sourceContent = await readFile(resolvedInputPath, 'utf8')
  const sections = splitByPageMarkers(sourceContent)

  await mkdir(resolvedOutputDir, { recursive: true })

  const seenLabels = new Set()

  for (const section of sections) {
    if (seenLabels.has(section.label)) {
      throw new Error(`Marqueur dupliqué détecté: - ${section.label} -`)
    }

    seenLabels.add(section.label)

    const outputPath = path.join(resolvedOutputDir, `${section.label}.txt`)
    await writeFile(outputPath, `${section.content}\n`, 'utf8')
    console.log(`Écrit ${outputPath}`)
  }

  console.log(`${sections.length} fichier(s) extrait(s) dans ${resolvedOutputDir}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
