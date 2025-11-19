/**
 * Automation Module Index
 *
 * Central export for all automation functionality
 */

export { default as config } from './config'
export { logger } from './logger'
export { stateManager } from './state-manager'
export { postToReddit, getRedditStatus } from './reddit-poster'
export { postToTwitter, getTwitterStatus, postThread } from './twitter-poster'
export { postToQuora, getQuoraStatus } from './quora-poster'
export {
  generateAllContent,
  generateForPlatform,
  getGeneratorStatus,
} from './content-generator'
export {
  startScheduler,
  stopScheduler,
  runOnce,
  displayStatus,
} from './scheduler'
