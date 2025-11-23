/**
 * Instagram Book Poster - @lab.of.living
 *
 * Posts quotes from Random Acts of Self-Actualization (Blocks A, B, C)
 * Jesse's account - BOOKS ONLY
 */

import * as fs from 'fs'
import * as path from 'path'
import { logger } from './logger'

// Book quotes from Random Acts of Self-Actualization
const BOOK_QUOTES = [
  {
    quote: "The Laboratory of Living - where self-actualization isn't a destination, it's the experiment itself.",
    book: "Block 3: The Laboratory of Living",
    chapter: "Introduction"
  },
  {
    quote: "Breaking addiction isn't about willpower. It's about designing a life you don't need to escape from.",
    book: "Volume 1: Building a Non-Addictive Life",
    chapter: "Chapter 1"
  },
  {
    quote: "Your discomfort is data. Your resistance is information. Stop fighting it. Start studying it.",
    book: "Block B",
    chapter: "Chapter 3"
  },
  {
    quote: "Self-actualization is ruthlessly honest self-observation. Nothing more. Nothing less.",
    book: "Block 3",
    chapter: "Chapter 2"
  },
  {
    quote: "The polymath doesn't know everything. They know how to learn anything.",
    book: "Volume 1",
    chapter: "Chapter 5"
  },
  {
    quote: "Philosophy without action is mental masturbation. Action without philosophy is chaos.",
    book: "Block B",
    chapter: "Chapter 7"
  },
  {
    quote: "From NASA engineer to philosopher - because the universe is more interesting than rockets.",
    book: "Block 3",
    chapter: "Author Bio"
  },
  {
    quote: "You can't think your way out of a problem you behaved your way into.",
    book: "Volume 1",
    chapter: "Chapter 4"
  }
]

async function postToInstagram(username: string, password: string): Promise<void> {
  logger.info('INSTAGRAM_BOOKS', `Posting from Random Acts of Self-Actualization`)

  // Select random quote
  const quote = BOOK_QUOTES[Math.floor(Math.random() * BOOK_QUOTES.length)]

  const caption = `"${quote.quote}"

— ${quote.book}
${quote.chapter}

The Laboratory of Living trilogy explores breaking free from addiction and building an intentional life through radical self-actualization.

Read Block 3 free: brandonmills.com/book/block-3
Get Volumes 1 & 2: amazon.com/author/brandonmills

#SelfActualization #Philosophy #PersonalGrowth #AddictionRecovery #IntentionalLiving #Polymath #RandomActs #TheLaboratoryOfLiving`

  logger.info('INSTAGRAM_BOOKS', `Caption: ${caption.substring(0, 100)}...`)

  // TODO: Implement Instagram Graph API posting
  // For now, just log the quote
  console.log('\n📚 BOOK QUOTE TO POST:\n')
  console.log(caption)
  console.log('\n')

  logger.success('INSTAGRAM_BOOKS', 'Quote prepared for @lab.of.living')
}

// Run if called directly
if (require.main === module) {
  const username = process.env.JESSE_INSTAGRAM_USERNAME || 'lab.of.living'
  const password = process.env.JESSE_INSTAGRAM_PASSWORD || ''

  if (!password) {
    console.error('Error: JESSE_INSTAGRAM_PASSWORD not set')
    console.error('Load from .env.jesse file')
    process.exit(1)
  }

  postToInstagram(username, password)
    .then(() => {
      logger.success('INSTAGRAM_BOOKS', 'Complete')
      process.exit(0)
    })
    .catch(error => {
      logger.error('INSTAGRAM_BOOKS', error.message)
      process.exit(1)
    })
}

export { postToInstagram }
