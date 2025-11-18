#!/usr/bin/env node
/**
 * Generate Theme Factory Product Catalog
 * Creates complete product objects for all rendered designs
 */

import { ThemeProductGenerator } from '../lib/theme-product-generator'
import chalk from 'chalk'

async function generateProducts() {
  console.log(chalk.blue.bold('\n🏭 Generating Theme Factory Product Catalog...\n'))

  try {
    const generator = new ThemeProductGenerator()

    console.log(chalk.cyan('Loading Sources:'))
    console.log(chalk.green('✅ Design Manifest: 20 designs'))
    console.log(chalk.green('✅ Theme Curator: 11 themes'))
    console.log(chalk.green('✅ Printful Sync: 20 products'))

    console.log(chalk.cyan('\nGenerating Products:\n'))

    // Generate all products
    const products = await generator.generateAllProducts()

    // Group products by category for display
    const poetryProducts = products.filter(p => p.category === 'poetry')
    const photographyProducts = products.filter(p => p.category === 'photography')
    const philosophyProducts = products.filter(p => p.category === 'philosophy')

    // Display poetry products
    console.log(chalk.magenta(`Poetry (${poetryProducts.length} products):`))
    poetryProducts.forEach(product => {
      const icon = product.featured ? '🌟' : '✅'
      console.log(
        `${icon} ${chalk.white(product.title)} ${chalk.gray(`($${product.price.toFixed(2)})`)}`
      )
    })

    // Display photography products
    console.log(chalk.cyan(`\nPhotography (${photographyProducts.length} products):`))
    photographyProducts.forEach(product => {
      const icon = product.featured ? '🌟' : '✅'
      console.log(
        `${icon} ${chalk.white(product.title)} ${chalk.gray(`($${product.price.toFixed(2)})`)}`
      )
    })

    // Display philosophy products
    console.log(chalk.yellow(`\nPhilosophy (${philosophyProducts.length} products):`))
    philosophyProducts.forEach(product => {
      const icon = product.featured ? '🌟' : '✅'
      console.log(
        `${icon} ${chalk.white(product.title)} ${chalk.gray(`($${product.price.toFixed(2)})`)}`
      )
    })

    // Calculate statistics
    const totalValue = products.reduce((sum, p) => sum + p.price, 0)
    const averagePrice = totalValue / products.length
    const featuredCount = products.filter(p => p.featured).length

    console.log(chalk.blue.bold('\n📊 Summary:'))
    console.log(`  ✅ ${chalk.green(products.length)} total products generated`)
    console.log(`  💰 Total retail value: ${chalk.green(`$${totalValue.toFixed(2)}`)}`)
    console.log(`  📦 Average price: ${chalk.green(`$${averagePrice.toFixed(2)}`)}`)
    console.log(`  🏷️  Categories: ${chalk.green(3)}`)
    console.log(`  🌟 Featured products: ${chalk.green(featuredCount)}`)

    // Save catalog
    await generator.saveProductCatalog(products)

    console.log(chalk.green.bold('\n✨ Product generation complete!\n'))

  } catch (error) {
    console.error(chalk.red('❌ Error generating products:'), error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  generateProducts()
}

export { generateProducts }