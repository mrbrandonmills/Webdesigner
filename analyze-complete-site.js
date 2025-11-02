const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

console.log('🔍 ANALYZING COMPLETE SQUARESPACE SITE STRUCTURE...\n');

const xmlContent = fs.readFileSync('Squarespace-Wordpress-Export-11-02-2025.xml', 'utf8');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
  cdataPropName: "__cdata",
  ignoreDeclaration: true
});

const result = parser.parse(xmlContent);
const channel = result.rss.channel;
const items = channel.item;

// Separate posts from attachments from pages
const posts = items.filter(item => item['wp:post_type'] === 'post');
const attachments = items.filter(item => item['wp:post_type'] === 'attachment');
const pages = items.filter(item => item['wp:post_type'] === 'page');
const other = items.filter(item => !['post', 'attachment', 'page'].includes(item['wp:post_type']));

console.log('📊 SITE OVERVIEW:');
console.log('='.repeat(60));
console.log(`Total Items: ${items.length}`);
console.log(`├─ Posts (Portfolio): ${posts.length}`);
console.log(`├─ Pages: ${pages.length}`);
console.log(`├─ Attachments: ${attachments.length}`);
console.log(`└─ Other: ${other.length}\n`);

// Analyze posts
console.log('📸 PORTFOLIO POSTS:');
console.log('='.repeat(60));
posts.forEach((post, i) => {
  const content = post['content:encoded']?.__cdata || '';
  const imageMatches = content.match(/src="(https:\/\/images\.squarespace-cdn\.com[^"]+)"/g) || [];
  const images = imageMatches.map(m => m.match(/src="([^"]+)"/)[1]);

  console.log(`${i + 1}. ${post.title}`);
  console.log(`   Slug: ${post['wp:post_name']}`);
  console.log(`   Date: ${post['wp:post_date']}`);
  console.log(`   Status: ${post['wp:status']}`);
  console.log(`   Images: ${images.length}`);
  console.log(`   Category: ${post.category || 'None'}`);
  console.log('');
});

// Analyze pages
console.log('\n📄 SITE PAGES:');
console.log('='.repeat(60));
pages.forEach((page, i) => {
  const content = page['content:encoded']?.__cdata || '';
  console.log(`${i + 1}. ${page.title}`);
  console.log(`   Slug: ${page['wp:post_name']}`);
  console.log(`   Status: ${page['wp:status']}`);
  console.log(`   Content Length: ${content.length} chars`);
  console.log('');
});

// Site metadata
console.log('\n🌐 SITE METADATA:');
console.log('='.repeat(60));
console.log(`Site Title: ${channel.title}`);
console.log(`Site URL: ${channel.link}`);
console.log(`Language: ${channel.language}`);
console.log(`Export Date: ${channel.pubDate}`);

// Author info
const author = channel['wp:author'];
console.log(`\nAuthor: ${author['wp:author_display_name']}`);
console.log(`Email: ${author['wp:author_email']}`);

// Create comprehensive site structure document
const siteStructure = {
  metadata: {
    title: channel.title,
    url: channel.link,
    language: channel.language,
    exportDate: channel.pubDate,
    author: {
      name: author['wp:author_display_name'],
      email: author['wp:author_email'],
      firstName: author['wp:author_first_name'],
      lastName: author['wp:author_last_name'],
    }
  },

  posts: posts.map(post => {
    const content = post['content:encoded']?.__cdata || '';
    const imageMatches = content.match(/src="(https:\/\/images\.squarespace-cdn\.com[^"]+)"/g) || [];
    const images = imageMatches.map(m => m.match(/src="([^"]+)"/)[1]);

    // Extract text content (strip HTML)
    const textContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    return {
      title: post.title,
      slug: post['wp:post_name'],
      date: post['wp:post_date'],
      status: post['wp:status'],
      link: post.link,
      excerpt: post['excerpt:encoded']?.__cdata || '',
      content: textContent.substring(0, 500), // First 500 chars
      fullHtmlContent: content,
      images: images,
      imageCount: images.length,
      category: post.category || 'Uncategorized',
      thumbnailId: null, // Not needed for structure analysis
    };
  }),

  pages: pages.map(page => {
    const content = page['content:encoded']?.__cdata || '';
    const textContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    return {
      title: page.title,
      slug: page['wp:post_name'],
      status: page['wp:status'],
      content: textContent,
      fullHtmlContent: content,
    };
  }),

  navigation: {
    mainMenu: posts.map(p => ({
      title: p.title,
      slug: p['wp:post_name'],
      type: 'portfolio'
    })),
    pages: pages.map(p => ({
      title: p.title,
      slug: p['wp:post_name'],
      type: 'page'
    }))
  },

  images: {
    totalAttachments: attachments.length,
    uniqueImages: [...new Set(posts.flatMap(post => {
      const content = post['content:encoded']?.__cdata || '';
      const imageMatches = content.match(/src="(https:\/\/images\.squarespace-cdn\.com[^"]+)"/g) || [];
      return imageMatches.map(m => m.match(/src="([^"]+)"/)[1]);
    }))],
  }
};

// Calculate total images
siteStructure.images.totalCount = siteStructure.images.uniqueImages.length;

// Save comprehensive analysis
fs.writeFileSync('site-structure-complete.json', JSON.stringify(siteStructure, null, 2));

console.log('\n\n✅ ANALYSIS COMPLETE!');
console.log('='.repeat(60));
console.log(`Saved detailed structure to: site-structure-complete.json`);
console.log(`\nTotal Unique Images: ${siteStructure.images.totalCount}`);
console.log(`Portfolio Posts: ${siteStructure.posts.length}`);
console.log(`Site Pages: ${siteStructure.pages.length}`);
console.log(`\nReady to build Webflow site!`);
