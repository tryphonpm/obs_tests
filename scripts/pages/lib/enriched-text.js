const inlineLineBreak = '\uE000'

export function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function getIndentLevel(line) {
  const indentation = line.match(/^[\t ]*/)?.[0] ?? ''
  const tabCount = (indentation.match(/\t/g) ?? []).length
  const spaceCount = (indentation.match(/ /g) ?? []).length

  return Math.min(tabCount + Math.floor(spaceCount / 2), 8)
}

function getExtraIndentLevel(rawLine, baseIndentLevel) {
  return Math.max(0, getIndentLevel(rawLine) - baseIndentLevel)
}

function renderMultilineInlineHtml(text, baseIndentLevel) {
  const lines = text.split('\n')

  return lines.map((rawLine, index) => {
    const lineText = escapeHtml(rawLine.trimStart())

    if (index === 0) {
      return lineText
    }

    const extraIndent = getExtraIndentLevel(rawLine, baseIndentLevel)

    if (extraIndent === 0) {
      return `<br>${lineText}`
    }

    return `<br><span class="enriched-text__inline-indent" style="--extra-indent-level: ${extraIndent}">${lineText}</span>`
  }).join('')
}

function preserveMultilineTaggedBlocks(text) {
  return text.replace(/<(i|m)>([\s\S]*?)<\/\1>/gi, (_, tagName, taggedText) =>
    `<${tagName}>${taggedText.replace(/\n/g, inlineLineBreak)}</${tagName}>`)
}

function restoreInlineLineBreaks(text) {
  return text.replaceAll(inlineLineBreak, '\n')
}

function normalizeImageSrc(filename) {
  const trimmed = filename.trim()

  if (!/^[A-Za-z0-9._-]+$/.test(trimmed)) {
    return null
  }

  return trimmed
}

function parseTextSegments(text, lineId) {
  const segments = []
  const taggedTextPattern = /<(i|m)>(.*?)<\/\1>|<hr\s*\/?>/gi
  let currentIndex = 0
  let match
  let segmentIndex = 0

  while ((match = taggedTextPattern.exec(text)) !== null) {
    const [fullMatch, tagName, taggedText] = match
    const matchIndex = match.index

    if (matchIndex > currentIndex) {
      segments.push({
        id: `${lineId}-segment-${segmentIndex}`,
        text: restoreInlineLineBreaks(text.slice(currentIndex, matchIndex)),
        kind: 'normal',
      })
      segmentIndex += 1
    }

    if (/^<hr/i.test(fullMatch)) {
      segments.push({
        id: `${lineId}-segment-${segmentIndex}`,
        text: '',
        kind: 'rule',
      })
    }
    else {
      segments.push({
        id: `${lineId}-segment-${segmentIndex}`,
        text: restoreInlineLineBreaks(taggedText),
        kind: tagName.toLowerCase() === 'm' ? 'marked' : 'italic',
      })
    }

    segmentIndex += 1
    currentIndex = matchIndex + fullMatch.length
  }

  if (currentIndex < text.length) {
    segments.push({
      id: `${lineId}-segment-${segmentIndex}`,
      text: restoreInlineLineBreaks(text.slice(currentIndex)),
      kind: 'normal',
    })
  }

  if (segments.length === 0) {
    segments.push({
      id: `${lineId}-segment-0`,
      text: restoreInlineLineBreaks(text),
      kind: 'normal',
    })
  }

  return segments
}

function createEnrichedLine(rawLine, lineId, lineIndexInParagraph) {
  return {
    id: lineId,
    segments: parseTextSegments(rawLine.trimStart(), lineId),
    indentLevel: getIndentLevel(rawLine),
    lineIndexInParagraph,
  }
}

export function parseBlocks(content) {
  const normalizedContent = preserveMultilineTaggedBlocks(
    content.replace(/\r\n/g, '\n').replace(/\r/g, '\n'),
  )
  const textLines = normalizedContent.split('\n')
  const parsedBlocks = []
  let currentLines = []
  let paragraphCount = 0
  let ruleCount = 0
  let colBreakCount = 0
  let espaceCount = 0
  let imageCount = 0

  function closeParagraph() {
    if (currentLines.length === 0) {
      return
    }

    parsedBlocks.push({
      id: `paragraph-${paragraphCount}`,
      kind: 'paragraph',
      paragraphIndexInPage: paragraphCount,
      lines: currentLines,
    })

    paragraphCount += 1
    currentLines = []
  }

  textLines.forEach((line) => {
    const trimmedLine = line.trim()

    if (trimmedLine.length === 0) {
      closeParagraph()
      return
    }

    if (/^<hr\s*\/?>$/i.test(trimmedLine)) {
      closeParagraph()
      parsedBlocks.push({ id: `rule-${ruleCount}`, kind: 'rule' })
      ruleCount += 1
      return
    }

    if (/^<col\s*\/?>$/i.test(trimmedLine)) {
      closeParagraph()
      parsedBlocks.push({ id: `col-break-${colBreakCount}`, kind: 'col-break' })
      colBreakCount += 1
      return
    }

    if (/^<espace\s*\/?>$/i.test(trimmedLine)) {
      closeParagraph()
      parsedBlocks.push({ id: `espace-${espaceCount}`, kind: 'espace' })
      espaceCount += 1
      return
    }

    const imageMatch = trimmedLine.match(/^<img>([\s\S]*?)<\/img>$/i)
    const imageSrc = imageMatch?.[1] ? normalizeImageSrc(imageMatch[1]) : null

    if (imageMatch && imageSrc) {
      closeParagraph()
      parsedBlocks.push({ id: `image-${imageCount}`, kind: 'image', src: imageSrc })
      imageCount += 1
      return
    }

    currentLines.push(createEnrichedLine(
      line,
      `paragraph-${paragraphCount}-line-${currentLines.length}`,
      currentLines.length,
    ))
  })

  closeParagraph()

  return parsedBlocks
}

export function extractDropcapFromBlocks(blocks) {
  for (let blockIndex = 0; blockIndex < blocks.length; blockIndex += 1) {
    const block = blocks[blockIndex]

    if (block.kind !== 'paragraph') {
      continue
    }

    for (let lineIndex = 0; lineIndex < block.lines.length; lineIndex += 1) {
      const line = block.lines[lineIndex]

      for (let segmentIndex = 0; segmentIndex < line.segments.length; segmentIndex += 1) {
        const segment = line.segments[segmentIndex]

        if (segment.kind === 'rule' || segment.text.length === 0) {
          continue
        }

        const letter = segment.text.charAt(0)

        return {
          letter,
          blocks: blocks.map((currentBlock, currentBlockIndex) => {
            if (currentBlock.kind !== 'paragraph' || currentBlockIndex !== blockIndex) {
              return currentBlock
            }

            return {
              ...currentBlock,
              lines: currentBlock.lines.map((currentLine, currentLineIndex) => {
                if (currentLineIndex !== lineIndex) {
                  return currentLine
                }

                return {
                  ...currentLine,
                  segments: currentLine.segments.map((currentSegment, currentSegmentIndex) => {
                    if (currentSegmentIndex !== segmentIndex) {
                      return currentSegment
                    }

                    return {
                      ...currentSegment,
                      text: currentSegment.text.slice(1),
                    }
                  }),
                }
              }),
            }
          }),
        }
      }
    }
  }

  return { letter: null, blocks }
}

function splitColumns(blocks) {
  const cols = [[]]

  for (const block of blocks) {
    if (block.kind === 'col-break') {
      cols.push([])
      continue
    }

    cols[cols.length - 1].push(block)
  }

  return cols
}

function renderSegments(segments, baseIndentLevel) {
  return segments.map((segment) => {
    switch (segment.kind) {
      case 'rule':
        return '<span class="enriched-text__rule" role="separator"></span>'
      case 'italic':
        return `<em class="enriched-text__italic">${renderMultilineInlineHtml(segment.text, baseIndentLevel)}</em>`
      case 'marked':
        return `<span class="enriched-text__marked">${renderMultilineInlineHtml(segment.text, baseIndentLevel)}</span>`
      default:
        return escapeHtml(segment.text)
    }
  }).join('')
}

function renderLine(line) {
  return `<span class="enriched-text__line" data-line-index="${line.lineIndexInParagraph}" style="--indent-level: ${line.indentLevel}">${renderSegments(line.segments, line.indentLevel)}</span>`
}

function renderParagraph(block, columnIndex, dropcap) {
  const showDropcap = dropcap && columnIndex === 0 && block.paragraphIndexInPage === 0
  const dropcapHtml = showDropcap
    ? `<div class="enrichment-dropcap" aria-hidden="true">${escapeHtml(dropcap)}</div>`
    : ''
  const linesHtml = block.lines.map(renderLine).join('\n')

  return `<section class="enriched-text__paragraph" data-paragraph-index="${block.paragraphIndexInPage}">
  <div class="enriched-text__lines">
    ${dropcapHtml}
    ${linesHtml}
  </div>
</section>`
}

function renderBlock(block, columnIndex, dropcap) {
  switch (block.kind) {
    case 'paragraph':
      return renderParagraph(block, columnIndex, dropcap)
    case 'espace':
      return '<div class="enriched-text__espace" aria-hidden="true"></div>'
    case 'image':
      return `<figure class="enriched-text__image">
  <img src="/images/${encodeURIComponent(block.src)}" alt="${escapeHtml(block.src)}" class="enriched-text__image-el">
</figure>`
    case 'rule':
      return '<span class="enriched-text__block-rule" role="separator"></span>'
    default:
      return ''
  }
}

export function renderEnrichedHtml(content) {
  const parsed = extractDropcapFromBlocks(parseBlocks(content))
  const columns = splitColumns(parsed.blocks)
  const columnHtml = columns.map((columnBlocks, columnIndex) => {
    const blocksHtml = columnBlocks
      .map(block => renderBlock(block, columnIndex, parsed.letter))
      .join('\n')

    return `<div class="enriched-text__column">
${blocksHtml}
</div>`
  }).join('\n')

  return `<article class="enriched-text enriched-text--no-indexes" aria-label="Texte enrichi" style="--col-count: ${columns.length}">
  <div class="enriched-text__columns">
${columnHtml}
  </div>
  <div class="enriched-text__footer">
    <a href="/" class="enriched-text__nav-btn" aria-label="Retour à l'accueil"></a>
  </div>
</article>`
}

export function prepareTextContent(rawContent) {
  return rawContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').slice(1).join('\n')
}
