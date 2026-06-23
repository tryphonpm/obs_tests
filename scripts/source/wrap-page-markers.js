import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const defaultInputPath = 'public/source/bac_a_fables-chap_1.txt'
const inputPath = process.argv[2] ?? defaultInputPath
const outputPath = process.argv[3] ?? inputPath

const pageMarkerPattern = /(- \d\d -)/g
const wrappedPageMarkerPattern = /\n+(- \d\d -)\n+/g

function printUsage() {
  console.error(`Usage: node scripts/source/wrap-page-markers.js [fichier.txt] [sortie.txt]

Exemple:
  node scripts/source/wrap-page-markers.js public/source/bac_a_fables-chap_1.txt`)
}

function normalizeLineEndings(content) {
  return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

function wrapPageMarkers(content) {
  const normalizedContent = normalizeLineEndings(content)
  const matches = normalizedContent.match(pageMarkerPattern) ?? []

  if (matches.length === 0) {
    return { content: normalizedContent, matches: 0 }
  }

  const wrappedContent = normalizedContent
    .replace(wrappedPageMarkerPattern, '\n$1\n')
    .replace(pageMarkerPattern, '\n$1\n')

  return { content: wrappedContent, matches: matches.length }
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    printUsage()
    return
  }

  const resolvedInputPath = path.resolve(inputPath)
  const resolvedOutputPath = path.resolve(outputPath)
  const content = await readFile(resolvedInputPath, 'utf8')
  const { content: result, matches } = wrapPageMarkers(content)

  if (matches === 0) {
    console.warn(`Aucun marqueur "- XX -" trouvé dans ${resolvedInputPath}`)
    return
  }

  await writeFile(resolvedOutputPath, result, 'utf8')
  console.log(`${matches} marqueur(s) encadré(s) dans ${resolvedOutputPath}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
