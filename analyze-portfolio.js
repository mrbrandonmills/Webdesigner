const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

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
const items = result.rss.channel.item;

// Filter for actual posts only
const posts = items.filter(item => item['wp:post_type'] === 'post');

// Focus on the 4 recent quality posts
const qualityPosts = [
  'Good Company w/Emma &amp; Melida',
  'Silver &amp; Gold w/AM REED',
  'Golden Touch w/ John Schell',
  'Top Shots of 2024'
];

const analysis = posts
  .filter(post => {
    const title = post.title || '';
    return qualityPosts.some(qt => title.includes(qt.split('&amp;')[0].trim()));
  })
  .map(post => {
    // Extract all image URLs from content
    const content = post['content:encoded']?.__cdata || '';
    const imageMatches = content.match(/src="(https:\/\/images\.squarespace-cdn\.com[^"]+)"/g) || [];
    const images = imageMatches.map(m => m.match(/src="([^"]+)"/)[1]);
    
    // Extract description
    const descMatch = content.match(/<h[34][^>]*>(.*?)<\/h[34]>/s);
    const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';
    
    return {
      title: post.title,
      slug: post['wp:post_name'],
      date: post['wp:post_date'],
      status: post['wp:status'],
      description: description,
      imageCount: images.length,
      images: images.slice(0, 5), // First 5 images for preview
      totalContent: content.length
    };
  });

console.log(JSON.stringify(analysis, null, 2));
