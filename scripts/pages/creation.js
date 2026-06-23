import { access, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')
const pagesDir = path.join(projectRoot, 'app/pages')

function printUsage() {
  console.error(`Usage: node scripts/pages/creation.js --label "<titre>" --page <numéro> --content <chemin.txt>

Paramètres:
  --label     Titre affiché dans le blockquote (pageTitle)
  --page      Numéro de page affiché en bas (pageLabel)
  --content   Chemin vers le fichier .txt source (depuis la racine du projet ou absolu)

Exemple:
  node scripts/pages/creation.js --label "Arts, billes, corps." --page 46 --content public/texts/46.txt`)
}

function parseArgs(argv) {
  const args = {}

  for (let index = 2; index < argv.length; index += 1) {
    const key = argv[index]
    const value = argv[index + 1]

    if (!value || value.startsWith('--')) {
      throw new Error(`Valeur manquante pour l'argument ${key}`)
    }

    switch (key) {
      case '--label':
        args.label = value
        index += 1
        break
      case '--page':
        args.page = value
        index += 1
        break
      case '--content':
        args.content = value
        index += 1
        break
      default:
        throw new Error(`Argument inconnu: ${key}`)
    }
  }

  return args
}

function toRawImportPath(pageFilePath, contentPath) {
  const absoluteContent = path.resolve(projectRoot, contentPath)
  const relativePath = path.relative(path.dirname(pageFilePath), absoluteContent)
  const importPath = relativePath.split(path.sep).join('/')

  if (importPath.startsWith('.')) {
    return `${importPath}?raw`
  }

  return `./${importPath}?raw`
}

function buildPageSource({ label, page, contentImportPath }) {
  return `<script setup lang="ts">
import textContent from '${contentImportPath}'

const pageLabel = '${String(page)}'
const pageTitle = ${JSON.stringify(label)}
</script>

<template>
  <article class="book-page">
    <blockquote class="title-blockquote">
      {{ pageTitle }}
    </blockquote>

    <EnrichedText
      :content="textContent"
      :show-paragraph-indexes="false"
    />

    <p class="book-page__number">
      - {{ pageLabel }} -
    </p>
  </article>
</template>
`
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

async function main() {
  let args

  try {
    args = parseArgs(process.argv)
  }
  catch (error) {
    console.error(error.message)
    printUsage()
    process.exit(1)
  }

  const { label, page, content } = args

  if (!label?.trim()) {
    console.error('Erreur: --label est requis.')
    printUsage()
    process.exit(1)
  }

  if (!page || !/^\d+$/.test(page)) {
    console.error('Erreur: --page doit être un entier positif.')
    printUsage()
    process.exit(1)
  }

  if (!content?.trim()) {
    console.error('Erreur: --content est requis.')
    printUsage()
    process.exit(1)
  }

  const absoluteContentPath = path.resolve(projectRoot, content)
  const pageFilePath = path.join(pagesDir, `${page}.vue`)

  if (!absoluteContentPath.endsWith('.txt')) {
    console.error('Erreur: --content doit pointer vers un fichier .txt')
    process.exit(1)
  }

  if (!(await fileExists(absoluteContentPath))) {
    console.error(`Erreur: fichier introuvable: ${absoluteContentPath}`)
    process.exit(1)
  }

  if (await fileExists(pageFilePath)) {
    console.error(`Erreur: la page existe déjà: ${pageFilePath}`)
    process.exit(1)
  }

  const contentImportPath = toRawImportPath(pageFilePath, content)
  const pageSource = buildPageSource({
    label: label.trim(),
    page,
    contentImportPath,
  })

  await writeFile(pageFilePath, pageSource, 'utf8')

  console.log(`Page créée: ${path.relative(projectRoot, pageFilePath)}`)
  console.log(`Route: /${page}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
