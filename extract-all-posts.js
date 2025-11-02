const fs = require('fs');
const siteStructure = JSON.parse(fs.readFileSync('site-structure-complete.json', 'utf8'));

// Extract all 10 posts
const allPosts = siteStructure.posts.map(post => ({
  title: post.title,
  slug: post.slug,
  date: post.date,
  status: post.status,
  description: post.content,  // First 500 chars of content
  imageCount: post.imageCount,
  images: post.images,
  category: typeof post.category === 'string' ? post.category : post.category?.__cdata || 'Uncategorized',
  excerpt: post.excerpt,
}));

fs.writeFileSync('all-posts.json', JSON.stringify(allPosts, null, 2));

console.log(`✅ Extracted ${allPosts.length} posts to all-posts.json`);
console.log('\nPosts:');
allPosts.forEach((post, i) => {
  console.log(`${i + 1}. ${post.title} (${post.imageCount} images) - ${post.status}`);
});
