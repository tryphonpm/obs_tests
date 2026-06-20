import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const inputPath = process.argv[2];
const outputPath = process.argv[3];

function printUsage() {
  console.error('Usage: node scripts/tests/analyse_1.js <fichier.txt> [sortie.json]');
}

function getDefaultOutputPath(filePath) {
  const parsedPath = path.parse(filePath);
  return path.join(parsedPath.dir, `${parsedPath.name}.json`);
}

function analyseText(content) {
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedContent.split('\n');
  const characters = [];

  let paragraphIndex = 0;
  let lineIndexInParagraph = 0;
  let isInsideParagraph = false;

  lines.forEach((line) => {
    if (line.length === 0) {
      if (isInsideParagraph) {
        paragraphIndex += 1;
        lineIndexInParagraph = 0;
        isInsideParagraph = false;
      }

      return;
    }

    isInsideParagraph = true;

    Array.from(line).forEach((character, positionInLine) => {
      const unicodeCodePoint = character.codePointAt(0);

      characters.push({
        character,
        asciiCode: unicodeCodePoint <= 127 ? unicodeCodePoint : null,
        unicodeCodePoint,
        positionInLine,
        lineIndexInParagraph,
        paragraphIndexInPage: paragraphIndex,
      });
    });

    lineIndexInParagraph += 1;
  });

  return {
    pageIndex: 0,
    paragraphCount: isInsideParagraph ? paragraphIndex + 1 : paragraphIndex,
    characterCount: characters.length,
    characters,
  };
}

async function main() {
  if (!inputPath || path.extname(inputPath).toLowerCase() !== '.txt') {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const resolvedInputPath = path.resolve(inputPath);
  const resolvedOutputPath = path.resolve(outputPath ?? getDefaultOutputPath(resolvedInputPath));
  const content = await readFile(resolvedInputPath, 'utf8');
  const analysis = analyseText(content);

  await writeFile(resolvedOutputPath, `${JSON.stringify(analysis, null, 2)}\n`, 'utf8');
  console.log(`Analyse écrite dans ${resolvedOutputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
