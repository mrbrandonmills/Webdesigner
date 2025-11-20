/**
 * Instagram Product Queue System
 * Manages which products to promote and when
 * Integrates with Printful sync products
 */

import { logger } from '../logger';
import fs from 'fs/promises';
import path from 'path';

interface PrintfulProduct {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url?: string;
  is_ignored?: boolean;
}

interface QueuedProduct {
  productId: string;
  name: string;
  category: string;
  imageUrl: string;
  price?: number;
  addedAt: string;
  promotedAt?: string;
  promotionCount: number;
  priority: number;
  isNewArrival: boolean;
  lastPromotedDaysAgo?: number;
}

interface ProductQueueConfig {
  queuePath: string;
  printfulApiKey: string;
  printfulStoreId: string;
  rotationDays: number; // Days before re-promoting same product
  newArrivalPriority: number;
}

class InstagramProductQueue {
  private config: ProductQueueConfig;
  private queue: QueuedProduct[] = [];

  constructor(config?: Partial<ProductQueueConfig>) {
    this.config = {
      queuePath: config?.queuePath || path.join(process.cwd(), 'data/instagram-product-queue.json'),
      printfulApiKey: config?.printfulApiKey || process.env.PRINTFUL_API_KEY || '',
      printfulStoreId: config?.printfulStoreId || process.env.PRINTFUL_STORE_ID || '',
      rotationDays: config?.rotationDays || 30,
      newArrivalPriority: config?.newArrivalPriority || 100,
    };
  }

  /**
   * Initialize queue and sync with Printful
   */
  async initialize(): Promise<void> {
    await this.loadQueue();
    await this.syncWithPrintful();
    logger.info('Product queue initialized');
  }

  /**
   * Load queue from file
   */
  private async loadQueue(): Promise<void> {
    try {
      const data = await fs.readFile(this.config.queuePath, 'utf-8');
      this.queue = JSON.parse(data);
      logger.info(`Loaded ${this.queue.length} products from queue`);
    } catch (error) {
      this.queue = [];
      logger.info('No existing queue found, starting fresh');
    }
  }

  /**
   * Save queue to file
   */
  private async saveQueue(): Promise<void> {
    try {
      const dir = path.dirname(this.config.queuePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(
        this.config.queuePath,
        JSON.stringify(this.queue, null, 2)
      );
    } catch (error) {
      logger.error('Error saving queue:', error);
    }
  }

  /**
   * Fetch products from Printful
   */
  private async fetchPrintfulProducts(): Promise<PrintfulProduct[]> {
    try {
      const response = await fetch(
        `https://api.printful.com/store/products`,
        {
          headers: {
            Authorization: `Bearer ${this.config.printfulApiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Printful API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      logger.error('Error fetching Printful products:', error);
      return [];
    }
  }

  /**
   * Get product details from Printful
   */
  private async getPrintfulProductDetails(productId: number): Promise<any> {
    try {
      const response = await fetch(
        `https://api.printful.com/store/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.printfulApiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Printful API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      logger.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  }

  /**
   * Extract category from product name
   */
  private extractCategory(name: string): string {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('t-shirt') || lowerName.includes('tee')) {
      return 'T-Shirt';
    } else if (lowerName.includes('hoodie')) {
      return 'Hoodie';
    } else if (lowerName.includes('sweatshirt')) {
      return 'Sweatshirt';
    } else if (lowerName.includes('mug')) {
      return 'Mug';
    } else if (lowerName.includes('poster') || lowerName.includes('print')) {
      return 'Print';
    } else if (lowerName.includes('tank')) {
      return 'Tank Top';
    } else if (lowerName.includes('bag') || lowerName.includes('tote')) {
      return 'Bag';
    } else if (lowerName.includes('hat') || lowerName.includes('cap')) {
      return 'Hat';
    }

    return 'Apparel';
  }

  /**
   * Sync queue with Printful products
   */
  async syncWithPrintful(): Promise<void> {
    try {
      logger.info('Syncing with Printful...');

      const printfulProducts = await this.fetchPrintfulProducts();
      const existingProductIds = new Set(this.queue.map(p => p.productId));

      let newProductsAdded = 0;

      for (const product of printfulProducts) {
        if (product.is_ignored) continue;

        const productId = product.id.toString();

        if (!existingProductIds.has(productId)) {
          // Get detailed info
          const details = await this.getPrintfulProductDetails(product.id);

          if (!details) continue;

          // Determine if new arrival (added in last 7 days)
          const isNewArrival = true; // For now, treat all as new on first sync

          const queuedProduct: QueuedProduct = {
            productId,
            name: product.name,
            category: this.extractCategory(product.name),
            imageUrl: product.thumbnail_url || details.sync_product?.thumbnail_url || '',
            price: details.sync_variants?.[0]?.retail_price,
            addedAt: new Date().toISOString(),
            promotionCount: 0,
            priority: isNewArrival ? this.config.newArrivalPriority : 50,
            isNewArrival,
          };

          this.queue.push(queuedProduct);
          newProductsAdded++;

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      if (newProductsAdded > 0) {
        logger.info(`Added ${newProductsAdded} new products to queue`);
        await this.saveQueue();
      }

      logger.info(`Total products in queue: ${this.queue.length}`);
    } catch (error) {
      logger.error('Error syncing with Printful:', error);
    }
  }

  /**
   * Get next product to promote
   * Priority: new arrivals > least promoted > longest time since last promotion
   */
  getNextProduct(): QueuedProduct | null {
    if (this.queue.length === 0) {
      logger.warn('Product queue is empty');
      return null;
    }

    // Calculate priority scores for each product
    const scoredProducts = this.queue.map(product => {
      let score = product.priority;

      // Boost new arrivals
      if (product.isNewArrival) {
        score += 100;
      }

      // Penalize recently promoted products
      if (product.promotedAt) {
        const daysSincePromotion = this.getDaysSince(product.promotedAt);
        product.lastPromotedDaysAgo = daysSincePromotion;

        if (daysSincePromotion < this.config.rotationDays) {
          score -= 50;
        }
      }

      // Reward least promoted
      score -= product.promotionCount * 10;

      return { product, score };
    });

    // Sort by score (highest first)
    scoredProducts.sort((a, b) => b.score - a.score);

    // Return top product
    const selected = scoredProducts[0].product;
    logger.info(`Selected product: ${selected.name} (score: ${scoredProducts[0].score})`);

    return selected;
  }

  /**
   * Mark product as promoted
   */
  async markAsPromoted(productId: string): Promise<void> {
    const product = this.queue.find(p => p.productId === productId);

    if (product) {
      product.promotedAt = new Date().toISOString();
      product.promotionCount += 1;

      // Reduce priority after promotion
      product.priority = Math.max(10, product.priority - 20);

      // No longer a new arrival after first promotion
      if (product.isNewArrival && product.promotionCount > 0) {
        product.isNewArrival = false;
      }

      await this.saveQueue();
      logger.info(`Marked ${product.name} as promoted (count: ${product.promotionCount})`);
    }
  }

  /**
   * Get days since a date
   */
  private getDaysSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Add product manually
   */
  async addProduct(product: Omit<QueuedProduct, 'addedAt' | 'promotionCount' | 'promotedAt'>): Promise<void> {
    const queuedProduct: QueuedProduct = {
      ...product,
      addedAt: new Date().toISOString(),
      promotionCount: 0,
    };

    this.queue.push(queuedProduct);
    await this.saveQueue();
    logger.info(`Added product to queue: ${product.name}`);
  }

  /**
   * Remove product from queue
   */
  async removeProduct(productId: string): Promise<void> {
    const index = this.queue.findIndex(p => p.productId === productId);

    if (index !== -1) {
      const removed = this.queue.splice(index, 1)[0];
      await this.saveQueue();
      logger.info(`Removed product from queue: ${removed.name}`);
    }
  }

  /**
   * Get queue statistics
   */
  getQueueStats(): {
    totalProducts: number;
    newArrivals: number;
    neverPromoted: number;
    averagePromotionCount: number;
    oldestProduct: string | null;
  } {
    const stats = {
      totalProducts: this.queue.length,
      newArrivals: this.queue.filter(p => p.isNewArrival).length,
      neverPromoted: this.queue.filter(p => p.promotionCount === 0).length,
      averagePromotionCount: 0,
      oldestProduct: null as string | null,
    };

    if (this.queue.length > 0) {
      stats.averagePromotionCount =
        this.queue.reduce((sum, p) => sum + p.promotionCount, 0) / this.queue.length;

      const sorted = [...this.queue].sort(
        (a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
      );
      stats.oldestProduct = sorted[0]?.name || null;
    }

    return stats;
  }

  /**
   * Get product by ID
   */
  getProduct(productId: string): QueuedProduct | undefined {
    return this.queue.find(p => p.productId === productId);
  }

  /**
   * Get all products
   */
  getAllProducts(): QueuedProduct[] {
    return [...this.queue];
  }
}

export default InstagramProductQueue;
export type { QueuedProduct, ProductQueueConfig, PrintfulProduct };
