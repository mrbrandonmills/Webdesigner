/**
 * Webflow Rich Text Formatting Utilities
 * Converts plain text/markdown to Webflow rich text format
 */

export interface WebflowRichTextNode {
  type: string
  children?: WebflowRichTextNode[]
  text?: string
  bold?: boolean
  italic?: boolean
  url?: string
}

/**
 * Convert plain text description to Webflow rich text format
 */
export function convertToWebflowRichText(text: string): string {
  if (!text) return ''

  // Split into paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim())

  const richTextNodes: WebflowRichTextNode[] = paragraphs.map(paragraph => {
    // Check for basic markdown patterns
    let children: WebflowRichTextNode[] = []

    // Simple bold: **text**
    const boldRegex = /\*\*(.+?)\*\*/g
    // Simple italic: *text*
    const italicRegex = /\*(.+?)\*/g
    // Simple link: [text](url)
    const linkRegex = /\[(.+?)\]\((.+?)\)/g

    let lastIndex = 0
    let match

    // Parse the paragraph for formatting
    const segments: WebflowRichTextNode[] = []
    let currentText = paragraph

    // Replace bold
    while ((match = boldRegex.exec(paragraph)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', text: paragraph.slice(lastIndex, match.index) })
      }
      segments.push({ type: 'text', text: match[1], bold: true })
      lastIndex = boldRegex.lastIndex
    }

    // Add remaining text
    if (lastIndex < paragraph.length) {
      segments.push({ type: 'text', text: paragraph.slice(lastIndex) })
    }

    // If no formatting found, just use plain text
    if (segments.length === 0) {
      children = [{ type: 'text', text: paragraph }]
    } else {
      children = segments
    }

    return {
      type: 'paragraph',
      children,
    }
  })

  // Webflow expects stringified rich text
  return JSON.stringify(richTextNodes)
}

/**
 * Simple text-to-HTML converter for Webflow rich text fields
 * (Alternative simpler approach)
 */
export function convertToWebflowHTML(text: string): string {
  if (!text) return ''

  // Split into paragraphs and wrap in <p> tags
  const paragraphs = text
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => {
      // Convert **bold** to <strong>
      let formatted = p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

      // Convert *italic* to <em>
      formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>')

      // Convert [text](url) to <a>
      formatted = formatted.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')

      return `<p>${formatted}</p>`
    })
    .join('')

  return paragraphs
}
