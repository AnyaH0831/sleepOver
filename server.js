import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const MAGIC_HOUR_API_KEYS = [
  process.env.VITE_MAGIC_HOUR_API_KEY_1,
  process.env.VITE_MAGIC_HOUR_API_KEY_2,
  process.env.VITE_MAGIC_HOUR_API_KEY_3,
].filter(Boolean)

app.post('/api/poll-video', async (req, res) => {
  const { jobId, keyIdx } = req.body

  if (!jobId) return res.status(400).json({ error: 'Job ID required' })

  // FIX 1: Extend HTTP timeout to 8 min so the connection doesn't drop mid-poll
  req.setTimeout(480000)
  res.setTimeout(480000)

  // Use the same key that created the video
  const apiKeyIndex = keyIdx || 0
  const apiKey = MAGIC_HOUR_API_KEYS[apiKeyIndex]
  if (!apiKey) return res.status(500).json({ error: 'No API key configured' })

  try {
    // FIX 2: Wait 10s first — Magic Hour needs time to queue the job
    console.log(`Starting poll for job: ${jobId}`)
    await new Promise(resolve => setTimeout(resolve, 10000))

    // FIX 3: Poll every 5 seconds for up to 6 minutes (72 attempts = 360s + 10s head start)
    for (let i = 0; i < 72; i++) {
      // Try both endpoints - text-to-video (new) and video-projects (old)
      let response = await fetch(
        `https://api.magichour.ai/v1/text-to-video/${jobId}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      )

      // If 404, try the alternative endpoint
      if (response.status === 404) {
        response = await fetch(
          `https://api.magichour.ai/v1/video-projects/${jobId}`,
          { headers: { Authorization: `Bearer ${apiKey}` } }
        )
      }

      const data = await response.json().catch(() => ({}))
      console.log(`Poll ${i + 1}: HTTP ${response.status} | status=${data.status}`)

      if (response.ok) {
        if (data.status === 'complete') {
          // FIX 4: Check downloads array first (Magic Hour's actual response shape),
          // then fall back to assets and top-level url
          const url = data.downloads?.[0]?.url
                   || data.assets?.[0]?.url
                   || data.url
                   || null

          if (url) {
            console.log('Video ready:', url.substring(0, 80))
            return res.json({ status: 'complete', videoUrl: url })
          } else {
            // Complete but no URL — log full response so we can debug
            console.error('Complete but no URL. Response:', JSON.stringify(data, null, 2))
            return res.json({ status: 'error', error: 'Video completed but no download URL was returned' })
          }
        }

        if (data.status === 'error' || data.status === 'failed') {
          return res.json({ status: 'error', error: data.error_message || data.message || 'Generation failed' })
        }

        // 'queued' or 'in_progress' — keep waiting
      } else {
        console.log('Non-OK response body:', JSON.stringify(data))
        // Don't throw — transient errors are common, just keep polling
      }

      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    return res.json({ status: 'error', error: 'Timed out after 6 minutes. Please try again.' })

  } catch (error) {
    console.error('Poll error:', error)
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Dream Server running on http://localhost:${PORT}`)
})
