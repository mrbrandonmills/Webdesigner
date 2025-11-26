#!/usr/bin/env tsx
/**
 * Instagram Carousel Generator
 * Generates carousel slide images for Instagram
 * Brandon Mills - The Alchemy of Embodiment Campaign
 */

import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join } from 'path';

// Instagram carousel dimensions (1:1 square)
const CAROUSEL_SIZE = 1080;

interface CarouselSlide {
  type: 'title' | 'quote' | 'text';
  content: string;
  subtitle?: string;
  filename: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

const carouselSlides: CarouselSlide[] = [
  {
    type: 'title',
    content: 'Half Animal.',
    subtitle: 'Half Something Else.',
    filename: 'carousel_slide_1.jpg',
    backgroundColor: '#0A0A0A',
    textColor: '#FFFFFF',
    accentColor: '#D4AF37'
  },
  {
    type: 'quote',
    content: 'We are transitional beings—the bridge between instinct and intention.',
    filename: 'carousel_slide_2.jpg',
    backgroundColor: '#1A1A2E',
    textColor: '#FFFFFF',
    accentColor: '#D4AF37'
  },
  {
    type: 'text',
    content: 'You can\'t see your potential until you see your patterns.',
    filename: 'carousel_slide_3.jpg',
    backgroundColor: '#2C3E50',
    textColor: '#ECF0F1',
    accentColor: '#D4AF37'
  },
  {
    type: 'quote',
    content: 'Breaking patterns so clearly that when you speak, you\'re speaking from embodiment—not from need.',
    filename: 'carousel_slide_4.jpg',
    backgroundColor: '#34495E',
    textColor: '#FFFFFF',
    accentColor: '#F39C12'
  },
  {
    type: 'text',
    content: 'The veil between who we are and who we could become? We made it ourselves.',
    subtitle: 'And we\'re the only ones who can lift it.',
    filename: 'carousel_slide_5.jpg',
    backgroundColor: '#16213E',
    textColor: '#FFFFFF',
    accentColor: '#D4AF37'
  }
];

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

function generateSlideSVG(slide: CarouselSlide): string {
  const { type, content, subtitle, backgroundColor, textColor, accentColor } = slide;

  if (type === 'title') {
    return `
      <svg width="${CAROUSEL_SIZE}" height="${CAROUSEL_SIZE}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${CAROUSEL_SIZE}" height="${CAROUSEL_SIZE}" fill="${backgroundColor}"/>

        <!-- Decorative elements -->
        <circle cx="100" cy="100" r="200" fill="${accentColor}" opacity="0.1"/>
        <circle cx="980" cy="980" r="250" fill="${accentColor}" opacity="0.1"/>

        <!-- Main title -->
        <text x="50%" y="450"
              font-family="Arial, Helvetica, sans-serif"
              font-size="96"
              font-weight="bold"
              fill="${textColor}"
              text-anchor="middle">
          ${content}
        </text>

        <!-- Subtitle -->
        <text x="50%" y="600"
              font-family="Arial, Helvetica, sans-serif"
              font-size="96"
              font-weight="bold"
              fill="${accentColor}"
              text-anchor="middle">
          ${subtitle}
        </text>

        <!-- Bottom branding -->
        <line x1="340" y1="900" x2="740" y2="900" stroke="${accentColor}" stroke-width="3"/>
        <text x="50%" y="960"
              font-family="Arial, Helvetica, sans-serif"
              font-size="24"
              fill="${accentColor}"
              text-anchor="middle">
          BRANDON MILLS
        </text>
      </svg>
    `;
  }

  // Quote or text slide
  const wrappedContent = wrapText(content, 28);
  const contentLines = wrappedContent.map((line, i) =>
    `<tspan x="50%" dy="${i === 0 ? 0 : 70}" text-anchor="middle">${line}</tspan>`
  ).join('');

  const startY = 540 - (wrappedContent.length * 35);

  return `
    <svg width="${CAROUSEL_SIZE}" height="${CAROUSEL_SIZE}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${CAROUSEL_SIZE}" height="${CAROUSEL_SIZE}" fill="${backgroundColor}"/>

      <!-- Decorative circles -->
      <circle cx="900" cy="180" r="180" fill="${accentColor}" opacity="0.08"/>
      <circle cx="180" cy="900" r="200" fill="${accentColor}" opacity="0.08"/>

      <!-- Opening quote mark for quote type -->
      ${type === 'quote' ? `
        <text x="50%" y="280"
              font-family="Georgia, serif"
              font-size="160"
              fill="${accentColor}"
              text-anchor="middle"
              opacity="0.25">
          "
        </text>
      ` : ''}

      <!-- Content text -->
      <text y="${startY}"
            font-family="${type === 'quote' ? 'Georgia, serif' : 'Arial, Helvetica, sans-serif'}"
            font-size="52"
            font-weight="${type === 'quote' ? 'normal' : 'bold'}"
            font-style="${type === 'quote' ? 'italic' : 'normal'}"
            fill="${textColor}">
        ${contentLines}
      </text>

      ${subtitle ? `
        <text y="${startY + (wrappedContent.length * 70) + 80}"
              font-family="Arial, Helvetica, sans-serif"
              font-size="42"
              font-weight="300"
              fill="${accentColor}">
          <tspan x="50%" text-anchor="middle">${subtitle}</tspan>
        </text>
      ` : ''}

      <!-- Bottom branding -->
      <line x1="340" y1="960" x2="740" y2="960" stroke="${accentColor}" stroke-width="2"/>
      <text x="50%" y="1010"
            font-family="Arial, Helvetica, sans-serif"
            font-size="22"
            fill="${textColor}"
            text-anchor="middle"
            opacity="0.7">
        brandonmills.com
      </text>
    </svg>
  `;
}

async function generateCarousel() {
  const outputDir = join(process.cwd(), 'public', 'social-assets', 'instagram');

  mkdirSync(outputDir, { recursive: true });

  console.log('📸 Generating Instagram carousel slides...\n');

  for (const slide of carouselSlides) {
    const svg = generateSlideSVG(slide);
    const outputPath = join(outputDir, slide.filename);

    try {
      await sharp(Buffer.from(svg))
        .jpeg({
          quality: 95,
          mozjpeg: true
        })
        .toFile(outputPath);

      console.log(`✅ Generated: ${slide.filename}`);
    } catch (error) {
      console.error(`❌ Failed to generate ${slide.filename}:`, error);
    }
  }

  console.log(`\n✨ All carousel slides generated in: ${outputDir}`);
}

generateCarousel().catch(console.error);
