// This script must be run while the Next.js dev server is running
// It calls a temp migration API endpoint

const APP_URL = 'http://localhost:3000'
const CRON_SECRET = 'pawsnl-cron-2024'

async function migrate() {
  console.log('Calling migration endpoint...')
  const res = await fetch(`${APP_URL}/api/admin/migrate-variants`, {
    method: 'POST', 
    headers: { 'x-cron-secret': CRON_SECRET }
  })
  const data = await res.json()
  console.log('Result:', JSON.stringify(data, null, 2))
}

migrate().catch(console.error)
