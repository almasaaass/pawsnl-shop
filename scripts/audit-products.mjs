#!/usr/bin/env node

/**
 * Product Audit Script
 * Downloads product images and outputs product data as JSON
 * Used by /product-audit slash command for visual inspection
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import https from 'node:https'
import http from 'node:http'

// Load env vars from .env.local
const envPath = new URL('../.env.local', import.meta.url).pathname
const envFile = readFileSync(envPath, 'utf8')
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const AUDIT_DIR = '/tmp/pawsnl-audit'

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http

    const request = (currentUrl, redirects = 0) => {
      if (redirects > 5) return reject(new Error('Too many redirects'))

      const mod = currentUrl.startsWith('https') ? https : http
      mod.get(currentUrl, { timeout: 15000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return request(res.headers.location, redirects + 1)
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`))
        }

        const chunks = []
        res.on('data', (chunk) => chunks.push(chunk))
        res.on('end', () => {
          const buffer = Buffer.concat(chunks)
          if (buffer.length < 1000) {
            return reject(new Error(`Image too small (${buffer.length} bytes)`))
          }
          writeFileSync(destPath, buffer)
          resolve(destPath)
        })
        res.on('error', reject)
      }).on('error', reject)
    }

    request(url)
  })
}

async function main() {
  console.error('Product Audit — afbeeldingen downloaden...\n')

  // Create audit directory
  if (!existsSync(AUDIT_DIR)) {
    mkdirSync(AUDIT_DIR, { recursive: true })
  }

  // Fetch all products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, category, description, images, price, compare_price, stock, cj_pid, cj_vid')
    .order('category')
    .order('name')

  if (error) {
    console.error('Supabase error:', error.message)
    process.exit(1)
  }

  console.error(`${products.length} producten gevonden\n`)

  const results = []

  for (const product of products) {
    const result = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      description: product.description,
      price: product.price,
      compare_price: product.compare_price,
      stock: product.stock,
      cj_pid: product.cj_pid,
      cj_vid: product.cj_vid,
      image_count: Array.isArray(product.images) ? product.images.length : 0,
      image_path: null,
      download_error: null,
    }

    if (!product.images || product.images.length === 0) {
      result.download_error = 'Geen afbeeldingen'
      console.error(`  SKIP  ${product.name} — geen afbeeldingen`)
    } else {
      const imageUrl = product.images[0]
      const ext = imageUrl.match(/\.(jpg|jpeg|png|webp|gif)/i)?.[1] || 'jpg'
      const destPath = join(AUDIT_DIR, `${product.slug}.${ext}`)

      try {
        await downloadImage(imageUrl, destPath)
        result.image_path = destPath
        console.error(`  OK    ${product.name}`)
      } catch (err) {
        result.download_error = err.message
        console.error(`  FOUT  ${product.name} — ${err.message}`)
      }
    }

    results.push(result)
  }

  console.error(`\nKlaar! ${results.filter(r => r.image_path).length}/${results.length} afbeeldingen gedownload`)
  console.error(`Afbeeldingen: ${AUDIT_DIR}/\n`)

  // Output JSON to stdout
  console.log(JSON.stringify(results, null, 2))
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
