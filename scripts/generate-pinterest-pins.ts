#!/usr/bin/env tsx
/**
 * Pinterest Pin Image Generator
 * Generates quote card images for Pinterest pins
 * Brandon Mills - The Alchemy of Embodiment Campaign
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Pinterest recommended dimensions
const PIN_WIDTH = 1000;
const PIN_HEIGHT = 1500;

interface PinDesign {
  title: string;
  quote: string;
  filename: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

const pinDesigns: PinDesign[] = [
  {
    title: 'EMBODIMENT',
    quote: 'When I speak now, I\'m not setting traps. I\'m offering a reality. People can walk into it or not. That\'s leadership. That\'s embodiment.',
    filename: 'pin_embodiment_quote.jpg',
    backgroundColor: '#0A0A0A',
    textColor: '#FFFFFF',
    accentColor: '#D4AF37'
  },
  {
    title: 'HUMAN POTENTIAL',
    quote: 'Humans are half animal, half something with the potential to evolve into something completely different. We are the jump-off point from this planet to what\'s possible.',
    filename: 'pin_human_continuum.jpg',
    backgroundColor: '#1A1A2E',
    textColor: '#FFFFFF',
    accentColor: '#16213E'
  },
  {
    title: 'IMPOSTER SYNDROME',
    quote: 'Imposter syndrome makes you distrust your own voice. You feel like you\'re stealing time. Gaming the system. Even when you\'re just asking for what you deserve.',
    filename: 'pin_imposter_syndrome.jpg',
    backgroundColor: '#2C3E50',
    textColor: '#ECF0F1',
    accentColor: '#E74C3C'
  },
  {
    title: 'TIPPING POINT',
    quote: 'The instability of mind that comes from lacking purpose isn\'t weakness—it\'s feedback. Your system telling you it\'s time to anchor in something real.',
    filename: 'pin_tipping_point.jpg',
    backgroundColor: '#34495E',
    textColor: '#FFFFFF',
    accentColor: '#F39C12'
  }
];

// Function to wrap text
function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines;
}

// Generate SVG for pin
function generatePinSVG(design: PinDesign): string {
  const { title, quote, backgroundColor, textColor, accentColor } = design;

  // Wrap quote text
  const wrappedQuote = wrapText(quote, 35);
  const quoteLines = wrappedQuote.map((line, i) =>
    `<tspan x="50%" y="${550 + (i * 70)}" text-anchor="middle">${line}</tspan>`
  ).join('');

  return `
    <svg width="${PIN_WIDTH}" height="${PIN_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="${PIN_WIDTH}" height="${PIN_HEIGHT}" fill="${backgroundColor}"/>

      <!-- Accent bar at top -->
      <rect width="${PIN_WIDTH}" height="8" fill="${accentColor}"/>

      <!-- Decorative geometric elements -->
      <circle cx="100" cy="200" r="150" fill="${accentColor}" opacity="0.1"/>
      <circle cx="900" cy="1300" r="200" fill="${accentColor}" opacity="0.1"/>

      <!-- Title -->
      <text x="50%" y="300"
            font-family="Arial, Helvetica, sans-serif"
            font-size="48"
            font-weight="bold"
            fill="${accentColor}"
            text-anchor="middle"
            letter-spacing="4">
        ${title}
      </text>

      <!-- Opening quote mark -->
      <text x="50%" y="450"
            font-family="Georgia, serif"
            font-size="120"
            fill="${accentColor}"
            text-anchor="middle"
            opacity="0.3">
        "
      </text>

      <!-- Quote text -->
      <text font-family="Georgia, serif"
            font-size="42"
            fill="${textColor}"
            font-style="italic">
        ${quoteLines}
      </text>

      <!-- Closing quote mark -->
      <text x="50%" y="${650 + (wrappedQuote.length * 70)}"
            font-family="Georgia, serif"
            font-size="120"
            fill="${accentColor}"
            text-anchor="middle"
            opacity="0.3">
        "
      </text>

      <!-- Bottom attribution -->
      <line x1="300" y1="1350" x2="700" y2="1350" stroke="${accentColor}" stroke-width="2"/>

      <text x="50%" y="1400"
            font-family="Arial, Helvetica, sans-serif"
            font-size="32"
            font-weight="300"
            fill="${textColor}"
            text-anchor="middle">
        BRANDON MILLS
      </text>

      <text x="50%" y="1440"
            font-family="Arial, Helvetica, sans-serif"
            font-size="24"
            fill="${accentColor}"
            text-anchor="middle">
        brandonmills.com
      </text>
    </svg>
  `;
}

async function generatePins() {
  const outputDir = join(process.cwd(), 'public', 'social-assets', 'pinterest');

  // Create output directory
  mkdirSync(outputDir, { recursive: true });

  console.log('🎨 Generating Pinterest pin images...\n');

  for (const design of pinDesigns) {
    const svg = generatePinSVG(design);
    const outputPath = join(outputDir, design.filename);

    try {
      await sharp(Buffer.from(svg))
        .jpeg({
          quality: 95,
          mozjpeg: true
        })
        .toFile(outputPath);

      console.log(`✅ Generated: ${design.filename}`);
    } catch (error) {
      console.error(`❌ Failed to generate ${design.filename}:`, error);
    }
  }

  console.log(`\n✨ All pins generated in: ${outputDir}`);
}

// Run the generator
generatePins().catch(console.error);
