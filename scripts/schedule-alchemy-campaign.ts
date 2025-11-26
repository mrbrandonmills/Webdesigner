#!/usr/bin/env tsx
/**
 * Content Scheduler - The Alchemy of Embodiment Campaign
 * 2-Week Content Calendar Implementation
 * Brandon Mills
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface ScheduledPost {
  date: string;
  time: string;
  platform: string;
  type: string;
  content: string;
  media?: string[];
  link?: string;
  status: 'pending' | 'scheduled' | 'posted';
}

// Calculate dates starting from today
const today = new Date();
const getDate = (daysFromNow: number): string => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// Week 1: Launch Sequence
const week1Schedule: ScheduledPost[] = [
  // Monday - Week 1
  {
    date: getDate(0),
    time: '09:00',
    platform: 'Twitter',
    type: 'Thread',
    content: `Thread 1: The Trap and The Offering

1/5: I used to think speaking my desires into existence was manipulation. A trap I was setting. A trick to get people to do what I wanted.

2/5: That's what imposter syndrome does. It makes you distrust your own voice. You feel like you're stealing time. Gaming the system. Even when you're just... asking.

3/5: The difference between codependency and self-actualization isn't in what you say. It's in what you embody when you say it.

4/5: When I write now about what I want, I'm not baiting anyone. I'm offering a reality. People can walk into it or not. That's leadership. That's healthy masculine energy. That's embodiment.

5/5: The words haven't changed. The person speaking them has. And that residual feeling of empowerment instead of guilt? That's how you know you've crossed the threshold.`,
    status: 'pending'
  },

  // Tuesday - Week 1
  {
    date: getDate(1),
    time: '10:00',
    platform: 'Instagram',
    type: 'Photo Post',
    content: `I got an email from my agent about an artistic photography project—the kind of work I actually want to be doing. Essay photography. Visual storytelling with depth.

And I realized something:

I've been so deep in AI research and academic work that I forgot how much I love this. The embodiment work. The performer archetype.

But here's what's different now:

I'm not coming back to modeling from a place of needing validation. I'm coming back because I've built something real inside myself over the past few years. The codependency patterns are broken. The imposter syndrome has been transmuted into something else entirely.

When I told her I feel close to a tipping point—that I just need more shoots to push things over the edge—I wasn't manipulating. I wasn't setting a trap.

I was offering a reality I believe in. And inviting her to walk into it with me.

That's the difference between speaking from lack and speaking from power.

#modeling #selfdiscovery #archetypes #embodiment #artisticphotography #transformation #performer #renaissance #selfactualization #themindset`,
    media: ['portrait_or_bts_shot.jpg'],
    status: 'pending'
  },
  {
    date: getDate(1),
    time: '10:30',
    platform: 'Pinterest',
    type: 'Pin',
    content: 'The Difference Between Manipulation and Leadership',
    media: ['public/social-assets/pinterest/pin_embodiment_quote.jpg'],
    link: 'https://brandonmills.com',
    status: 'pending'
  },

  // Wednesday - Week 1
  {
    date: getDate(2),
    time: '09:00',
    platform: 'Website Blog',
    type: 'Blog Post',
    content: 'What I Learned When My Collaborators Ghosted Me',
    link: 'https://brandonmills.com/blog/ghosted-collaborators',
    status: 'pending'
  },

  // Thursday - Week 1
  {
    date: getDate(3),
    time: '09:00',
    platform: 'Twitter',
    type: 'Standalone Tweets',
    content: `Tweet 1: The instability of mind that comes from lacking purpose isn't weakness—it's feedback. Your system telling you it's time to anchor in something real.

Tweet 2: I didn't manifest the opportunity. I became the person the opportunity was looking for.

Tweet 3: When collaborators ghost you, they're actually giving you the gift of redirection. That frustration is transmutable energy. Use it.`,
    status: 'pending'
  },
  {
    date: getDate(3),
    time: '14:00',
    platform: 'Instagram',
    type: 'Reel',
    content: `Script: I used to think that when I asked for what I wanted, I was manipulating people. Like I was setting traps. Using psychology to trick them into helping me. That's what happens when you're not anchored in yourself. You distrust your own voice. But after years of breaking codependency patterns and building a real connection with myself... now when I speak about what I want, I'm not baiting anyone. I'm offering a reality. And people can take it or leave it. That's healthy leadership. That's what embodiment actually looks like.`,
    status: 'pending'
  },

  // Friday - Week 1
  {
    date: getDate(4),
    time: '10:00',
    platform: 'Medium',
    type: 'Article',
    content: 'The Alchemy of Asking: How I Stopped Manipulating and Started Embodying',
    link: 'Submit to: Human Parts, The Startup, Mind Cafe, or self-publish',
    status: 'pending'
  }
];

// Week 2: Expansion
const week2Schedule: ScheduledPost[] = [
  // Monday - Week 2
  {
    date: getDate(7),
    time: '09:00',
    platform: 'Twitter',
    type: 'Thread',
    content: `Thread 2: The Human Continuum

1/4: If you stretch the scale of what's possible—from where we came from to where we could go—doesn't it seem like humans are half-animal, half-something else entirely?

2/4: We are the jump-off point from this planet to whatever exists in the rest of the universe. But we can't see that potential clearly until we see ourselves clearly.

3/4: The veil between who we are and who we could become? It's made of our own unprocessed patterns. The animal tendencies we haven't yet transmuted.

4/4: Self-actualization isn't about becoming something new. It's about remembering what you already are—and finally believing it.`,
    status: 'pending'
  },

  // Tuesday - Week 2
  {
    date: getDate(8),
    time: '10:00',
    platform: 'Instagram',
    type: 'Carousel',
    content: `If you stretch the scale of human potential—from where we came from to where we could go—we look like transitional beings.

Half animal. Half something with the capacity to transcend everything we've known.

We are the jump-off point from this planet. The bridge between instinct and intention. Between survival and creation.

But here's what I've learned in my own laboratory of living:

You can't see your potential until you see your patterns. The animal tendencies. The survival systems. The codependent loops that kept you safe but kept you small.

That's the work. Breaking those patterns so clearly that when you speak, you're speaking from embodiment—not from need.

The veil between who we are and who we could become? We made it ourselves. And we're the only ones who can lift it.

#humanpotential #consciousness #evolution #spiritualgrowth #archetypes #laboratoryofliving #selfdiscovery #transformation #awakening`,
    media: [
      'public/social-assets/instagram/carousel_slide_1.jpg',
      'public/social-assets/instagram/carousel_slide_2.jpg',
      'public/social-assets/instagram/carousel_slide_3.jpg',
      'public/social-assets/instagram/carousel_slide_4.jpg',
      'public/social-assets/instagram/carousel_slide_5.jpg'
    ],
    status: 'pending'
  },
  {
    date: getDate(8),
    time: '10:30',
    platform: 'Pinterest',
    type: 'Pins',
    content: 'We Are Transitional Beings + Imposter Syndrome',
    media: [
      'public/social-assets/pinterest/pin_human_continuum.jpg',
      'public/social-assets/pinterest/pin_imposter_syndrome.jpg'
    ],
    link: 'https://brandonmills.com',
    status: 'pending'
  },

  // Wednesday - Week 2
  {
    date: getDate(9),
    time: '09:00',
    platform: 'Website',
    type: 'Essay',
    content: 'The Threshold Between Trap and Offering',
    link: 'https://brandonmills.com/essays/threshold-trap-offering',
    status: 'pending'
  },

  // Thursday - Week 2
  {
    date: getDate(10),
    time: '10:00',
    platform: 'Pinterest',
    type: 'Pin',
    content: 'Recognizing Your Tipping Point',
    media: ['public/social-assets/pinterest/pin_tipping_point.jpg'],
    link: 'https://brandonmills.com',
    status: 'pending'
  },
  {
    date: getDate(10),
    time: '14:00',
    platform: 'Twitter',
    type: 'Engagement',
    content: 'Engage with followers, reply to comments, reshare best-performing tweets',
    status: 'pending'
  },

  // Friday - Week 2
  {
    date: getDate(11),
    time: '09:00',
    platform: 'Website Research',
    type: 'Research Paper',
    content: 'Archetypal Transitions and Communication Modalities: From Codependent Extraction to Self-Actualized Offering',
    link: 'https://brandonmills.com/research/archetypal-transitions',
    status: 'pending'
  }
];

const allScheduledPosts = [...week1Schedule, ...week2Schedule];

// Generate schedule output
function generateScheduleReport() {
  console.log('📅 THE ALCHEMY OF EMBODIMENT - 2-WEEK CONTENT CALENDAR\n');
  console.log('=' .repeat(80));
  console.log('\n📍 WEEK 1: LAUNCH SEQUENCE\n');

  week1Schedule.forEach((post, i) => {
    console.log(`\n${post.date} at ${post.time} - ${post.platform} (${post.type})`);
    console.log('-'.repeat(80));
    if (post.media) {
      console.log(`📎 Media: ${post.media.join(', ')}`);
    }
    if (post.link) {
      console.log(`🔗 Link: ${post.link}`);
    }
    if (post.content.length > 200) {
      console.log(`📝 ${post.content.substring(0, 200)}...`);
    } else {
      console.log(`📝 ${post.content}`);
    }
  });

  console.log('\n\n📍 WEEK 2: EXPANSION\n');

  week2Schedule.forEach((post, i) => {
    console.log(`\n${post.date} at ${post.time} - ${post.platform} (${post.type})`);
    console.log('-'.repeat(80));
    if (post.media) {
      console.log(`📎 Media: ${post.media.join(', ')}`);
    }
    if (post.link) {
      console.log(`🔗 Link: ${post.link}`);
    }
    if (post.content.length > 200) {
      console.log(`📝 ${post.content.substring(0, 200)}...`);
    } else {
      console.log(`📝 ${post.content}`);
    }
  });

  console.log('\n\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY');
  console.log(`Total posts scheduled: ${allScheduledPosts.length}`);
  console.log(`Week 1 posts: ${week1Schedule.length}`);
  console.log(`Week 2 posts: ${week2Schedule.length}`);

  // Platform breakdown
  const platformCounts: Record<string, number> = {};
  allScheduledPosts.forEach(post => {
    platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
  });

  console.log('\n📱 By Platform:');
  Object.entries(platformCounts).forEach(([platform, count]) => {
    console.log(`  ${platform}: ${count} posts`);
  });

  console.log('\n✨ All visual assets have been generated and are ready to use!');
  console.log('\n📁 Assets Location:');
  console.log('  Pinterest Pins: /public/social-assets/pinterest/');
  console.log('  Instagram Carousel: /public/social-assets/instagram/');
}

// Save schedule to JSON
function saveScheduleToFile() {
  const scheduleData = {
    campaign: 'The Alchemy of Embodiment',
    startDate: getDate(0),
    endDate: getDate(11),
    totalPosts: allScheduledPosts.length,
    week1: week1Schedule,
    week2: week2Schedule
  };

  const outputPath = join(process.cwd(), 'scripts', 'automation', 'content', 'alchemy-campaign-schedule.json');
  writeFileSync(outputPath, JSON.stringify(scheduleData, null, 2));

  console.log(`\n💾 Schedule saved to: ${outputPath}`);
}

// Main execution
generateScheduleReport();
saveScheduleToFile();

console.log('\n\n🚀 NEXT STEPS:\n');
console.log('1. Review the schedule above');
console.log('2. Update .env.local with your social media API credentials');
console.log('3. Run platform-specific posting scripts:');
console.log('   - Twitter: npx tsx scripts/automation/twitter-poster.ts');
console.log('   - Pinterest: npx tsx scripts/automation/pinterest-api-poster.ts');
console.log('   - Instagram: npx tsx scripts/automation/instagram-smart-poster.ts');
console.log('4. For Medium, manually publish the article with the content provided');
console.log('5. For website blog/essay/research, add to your CMS');
console.log('\n💡 TIP: Set up cron jobs or use a scheduler service to automate posting!');
