import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

const catalog = JSON.parse(await readFile(new URL('../registry.json', import.meta.url), 'utf8'))
const expected = new Set(['api-client', 'mocktoon', 'stripe'])
if (catalog.schemaVersion !== 1 || catalog.plugins?.length !== 3)
  throw new Error('Expected the three-plugin catalog.')
const outcomes = await Promise.allSettled(catalog.plugins.map(async plugin => {
  if (!expected.delete(plugin.id) || !plugin.version || plugin.official !== false ||
    !/^[a-f0-9]{64}$/.test(plugin.artifact?.sha256 ?? '')) throw new Error('Invalid or duplicate entry: ' + plugin.id)
  const url = new URL(plugin.artifact.url)
  if (url.protocol !== 'https:' || url.hostname !== 'github.com' || !url.pathname.startsWith('/mspacemedia/'))
    throw new Error('Unexpected release URL: ' + plugin.id)
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) })
  if (!response.ok) throw new Error(plugin.id + ': HTTP ' + response.status)
  const bytes = Buffer.from(await response.arrayBuffer())
  if (createHash('sha256').update(bytes).digest('hex') !== plugin.artifact.sha256)
    throw new Error(plugin.id + ': checksum mismatch')
  console.log(`${plugin.id}@${plugin.version}: ${bytes.length} bytes, SHA-256 verified`)
}))
let failed = false
for (const outcome of outcomes) if (outcome.status === 'rejected') {
  failed = true
  console.error(outcome.reason instanceof Error ? outcome.reason.message : String(outcome.reason))
}
if (failed || expected.size) process.exitCode = 1
