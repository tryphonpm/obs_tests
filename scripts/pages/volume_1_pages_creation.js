import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import {
  escapeHtml,
  prepareTextContent,
  renderEnrichedHtml,
} from './lib/enriched-text.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')
const sourcePagesDir = path.join(projectRoot, 'app/pages')
const outputPagesDir = path.join(projectRoot, 'app/pages/volume_1')
const enrichedTextComponentPath = path.join(projectRoot, 'app/components/EnrichedText.vue')

function printUsage() {
  console.error(`Usage: node scripts/pages/volume_1_pages_creation.js

Génère app/pages/volume_1/*.vue à partir de app/pages/*.vue (hors index.vue).
Chaque page contient le HTML, les styles et le contenu texte figés (sans EnrichedText).`)
}

async function fileExists(filePath) {
  try {
    await access(filePath)
    return true
  }
  catch {
    return false
  }
}

function parsePageVueSource(source) {
  const importMatch = source.match(/import textContentRaw from ['"]([^'"]+)['"]/)
  const pageLabelMatch = source.match(/const pageLabel = ['"]([^'"]+)['"]/)
  const pageTitleMatch = source.match(/const pageTitle = ("(?:[^"\\]|\\.)*")/)

  if (!importMatch || !pageLabelMatch || !pageTitleMatch) {
    return null
  }

  const rawImportPath = importMatch[1].replace(/\?raw$/, '')
  const textRelativePath = rawImportPath.replace(/^(\.\.\/)+/, '')

  return {
    pageLabel: pageLabelMatch[1],
    pageTitle: JSON.parse(pageTitleMatch[1]),
    textRelativePath,
  }
}

async function loadEnrichedTextStyles() {
  const source = await readFile(enrichedTextComponentPath, 'utf8')
  const match = source.match(/<style scoped>\s*([\s\S]*?)\s*<\/style>/)

  if (!match) {
    throw new Error('Styles EnrichedText introuvables.')
  }

  return match[1].trim()
}

function indentBlock(text, spaces) {
  const pad = ' '.repeat(spaces)
  return text.split('\n').map(line => (line.length ? pad + line : line)).join('\n')
}

function buildVolumePageSource({ pageLabel, pageTitle, enrichedHtml, enrichedStyles }) {
  return `<template>
  <article class="book-page">
    <blockquote class="title-blockquote">
      ${escapeHtml(pageTitle)}
    </blockquote>

${indentBlock(enrichedHtml, 4)}

    <p class="book-page__number">
      - ${escapeHtml(pageLabel)} -
    </p>
  </article>
</template>

<style scoped>
${enrichedStyles}
</style>
`
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    printUsage()
    return
  }

  const entries = await readdir(sourcePagesDir)
  const pageFiles = entries
    .filter(name => /^\d+\.vue$/.test(name))
    .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10))

  if (pageFiles.length === 0) {
    console.error('Aucune page source trouvée dans app/pages/.')
    process.exit(1)
  }

  await mkdir(outputPagesDir, { recursive: true })

  const enrichedStyles = await loadEnrichedTextStyles()
  let createdCount = 0
  let skippedCount = 0

  for (const filename of pageFiles) {
    const sourcePath = path.join(sourcePagesDir, filename)
    const outputPath = path.join(outputPagesDir, filename)
    const source = await readFile(sourcePath, 'utf8')
    const metadata = parsePageVueSource(source)

    if (!metadata) {
      console.warn(`Avertissement: format non reconnu, ignoré: ${filename}`)
      skippedCount += 1
      continue
    }

    const textPath = path.resolve(projectRoot, metadata.textRelativePath)

    if (!(await fileExists(textPath))) {
      console.warn(`Avertissement: texte introuvable (${metadata.textRelativePath}), ignoré: ${filename}`)
      skippedCount += 1
      continue
    }

    const rawContent = await readFile(textPath, 'utf8')
    const textContent = prepareTextContent(rawContent)
    const enrichedHtml = renderEnrichedHtml(textContent)
    const pageSource = buildVolumePageSource({
      pageLabel: metadata.pageLabel,
      pageTitle: metadata.pageTitle,
      enrichedHtml,
      enrichedStyles,
    })

    await writeFile(outputPath, pageSource, 'utf8')
    createdCount += 1
    console.log(`Page générée: app/pages/volume_1/${filename} → /volume_1/${metadata.pageLabel}`)
  }

  console.log(`${createdCount} page(s) générée(s), ${skippedCount} ignorée(s).`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
