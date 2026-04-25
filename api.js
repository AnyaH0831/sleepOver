// ─── Magic Hour key rotation ──────────────────────────────────────────────────
// Reads up to 3 Magic Hour API keys from .env and rotates when one is exhausted.
// "Exhausted" = 402 Payment Required or a credits-related error message.

const MH_KEYS = [
  import.meta.env.VITE_MAGIC_HOUR_API_KEY_1,
  import.meta.env.VITE_MAGIC_HOUR_API_KEY_2,
  import.meta.env.VITE_MAGIC_HOUR_API_KEY_3,
].filter(Boolean)

if (MH_KEYS.length === 0) {
  console.error('No Magic Hour API keys found. Add VITE_MAGIC_HOUR_API_KEY_1 (and optionally _2, _3) to your .env')
}

// Persisted index so rotation survives across calls within a session.
// If a key is exhausted we mark it and move to the next.
const exhausted = new Set()

function getActiveKey() {
  const available = MH_KEYS.filter((_, i) => !exhausted.has(i))
  if (available.length === 0) throw new Error('All Magic Hour API keys are exhausted. Please add credits or use new keys.')
  // Return the first non-exhausted key and its original index
  const idx = MH_KEYS.findIndex((_, i) => !exhausted.has(i))
  return { key: MH_KEYS[idx], idx }
}

function markExhausted(idx) {
  exhausted.add(idx)
  console.warn(`Magic Hour key #${idx + 1} exhausted — switching to next key`)
}

function isCreditsError(status, body) {
  // 402 = payment required / out of credits
  if (status === 402) return true
  // Some APIs return 400/403 with a credits message
  const msg = (body?.message || body?.error || '').toLowerCase()
  return msg.includes('credit') || msg.includes('quota') || msg.includes('insufficient')
}

// Wrapper that auto-rotates keys on credit exhaustion
async function magicHourFetch(url, options = {}, retries = MH_KEYS.length) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const { key, idx } = getActiveKey()
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        Authorization: `Bearer ${key}`,
      },
    })

    if (res.ok) return { res, key, idx }

    const body = await res.json().catch(() => ({}))

    if (isCreditsError(res.status, body)) {
      markExhausted(idx)
      // Loop around and try the next key
      continue
    }

    // Non-credits error — throw immediately
    throw new Error(body?.message || body?.error || `Magic Hour error ${res.status}: ${res.statusText}`)
  }

  throw new Error('All Magic Hour API keys are exhausted.')
}


// ─── Groq: Enhance dream text into a cinematic video prompt ──────────────────

export async function enhanceDreamPrompt(dreamText) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY is not set in .env')

  const response = await fetch(
    `https://api.groq.com/openai/v1/chat/completions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `Convert to a short cinematic video prompt (20 words max). Focus on motion, lighting, mood, and surreal atmosphere.\n\n${dreamText}`,
          },
        ],
        max_tokens: 100,
      }),
    }
  )

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Groq API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}


// ─── Magic Hour: Text-to-Video (5 seconds) ───────────────────────────────────

export async function generateDreamVideo(prompt) {
  const { res, key, idx } = await magicHourFetch(
    'https://api.magichour.ai/v1/text-to-video',
    {
      method: 'POST',
      body: JSON.stringify({
        aspect_ratio: '16:9',
        end_seconds: 5,
        style: {
          prompt,
        },
      }),
    }
  )

  const fullResponse = await res.json()
  console.log('Magic Hour full response:', JSON.stringify(fullResponse, null, 2))
  
  const jobId = fullResponse.id || fullResponse.job_id
  console.log('Job ID:', jobId)
  
  return { jobId, videoUrl: null, keyIdx: idx }
}

export async function pollVideoJob(jobId) {
  console.log(`Sending job ${jobId} to backend poller`)

  const response = await fetch('/api/poll-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId }),
  })

  if (!response.ok) throw new Error(`Backend error: ${response.status}`)

  const result = await response.json()
  console.log('Backend result:', result)

  // Throw on error so catch block in index.html handles it cleanly
  if (result.status === 'error') throw new Error(result.error || 'Video generation failed')

  // Return as-is — index.html reads result.videoUrl directly
  return result
}

// ─── Shared polling utility ───────────────────────────────────────────────────

async function pollMagicHourJob(url, apiKey, maxAttempts = 90, intervalMs = 4000) {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(intervalMs)

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error('Polling error response:', { status: res.status, statusText: res.statusText, error: err })
      throw new Error(err.message || `Polling error: ${res.status}`)
    }

    const data = await res.json()
    console.log('Poll response:', data)

    if (data.status === 'complete') {
      const outputs = data.downloads || data.assets || []
      const outputUrl = outputs[0]?.url || outputs[0] || data.url
      return outputUrl
    }

    if (data.status === 'error' || data.status === 'failed') {
      throw new Error('Generation job failed on Magic Hour servers')
    }

    // 'queued' or 'in_progress' — keep polling
  }

  throw new Error('Generation timed out after 6 minutes')
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Expose which key slot is currently active (for UI display)
export function getKeyStatus() {
  return MH_KEYS.map((_, i) => ({
    index: i + 1,
    exhausted: exhausted.has(i),
    active: !exhausted.has(i) && MH_KEYS.findIndex((__, j) => !exhausted.has(j)) === i,
  }))
}