import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')

const defaultTextsDir = 'public/texts'
const defaultOutputPath = 'public/data/texts.json'

function printUsage() {
  console.error(`Usage: node scripts/source/db_generate.js [dossier-textes] [fichier-sortie]

Exemple:
  node scripts/source/db_generate.js public/texts public/data/texts.json`)
}

function normalizeLineEndings(content) {
  return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/')
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    printUsage()
    return
  }

  const textsDirArg = process.argv[2] ?? defaultTextsDir
  const outputPathArg = process.argv[3] ?? defaultOutputPath

  const resolvedTextsDir = path.resolve(projectRoot, textsDirArg)
  const resolvedOutputPath = path.resolve(projectRoot, outputPathArg)

  const entries = await readdir(resolvedTextsDir)
  const txtFiles = entries.filter((filename) => /^\d+\.txt$/.test(filename))

  const texts = []

  for (const filename of txtFiles) {
    const filePath = path.join(resolvedTextsDir, filename)
    const content = normalizeLineEndings(await readFile(filePath, 'utf8'))
    const titre = content.split('\n')[0]?.trim() ?? ''
    const page = Number.parseInt(path.basename(filename, '.txt'), 10)

    texts.push({
      titre,
      page,
      content_path: toPosixPath(path.join(textsDirArg, filename)),
    })
  }

  texts.sort((a, b) => a.page - b.page)

  await writeFile(resolvedOutputPath, `${JSON.stringify(texts, null, 2)}\n`, 'utf8')
  console.log(`${texts.length} entrée(s) écrites dans ${resolvedOutputPath}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
