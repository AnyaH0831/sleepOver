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
  process.env.VITE_MAGIC_HOUR_API_KEY_4,
  process.env.VITE_MAGIC_HOUR_API_KEY_5,
  process.env.VITE_MAGIC_HOUR_API_KEY_6,
  process.env.VITE_MAGIC_HOUR_API_KEY_7,
  process.env.VITE_MAGIC_HOUR_API_KEY_8,
  process.env.VITE_MAGIC_HOUR_API_KEY_9,
  process.env.VITE_MAGIC_HOUR_API_KEY_10,
].filter(Boolean)

// Poll Magic Hour for video status
app.post('/api/poll-video', async (req, res) => {
  const { jobId } = req.body

  if (!jobId) {
    return res.status(400).json({ error: 'Job ID required' })
  }

  try {
    const apiKey = MAGIC_HOUR_API_KEYS[0]
    if (!apiKey) {
      return res.status(500).json({ error: 'No API key configured' })
    }

    // Wait 2 seconds before first check to let video generation start
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Poll with reasonable intervals - max 6 minutes, checking every 3 seconds
    for (let i = 0; i < 120; i++) {
      const response = await fetch(
        `https://api.magichour.ai/v1/video-projects/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (response.ok && data) {
        console.log(`✓ Poll ${i + 1}: status=${data.status}`)

        if (data.status === 'complete') {
          const url = data.url || data.downloads?.[0]?.url
          if (url) {
            console.log('Video ready:', url.substring(0, 50) + '...')
            return res.json({ status: 'complete', videoUrl: url })
          }
        }

        if (data.status === 'error' || data.status === 'failed') {
          return res.json({ status: 'error', error: data.error_message || 'Generation failed' })
        }

        // Keep polling if still processing
        await new Promise(resolve => setTimeout(resolve, 3000))
      } else {
        // Keep polling even on errors
        console.log(`- Poll ${i + 1}: HTTP ${response.status}`)
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
    }

    // Final timeout message
    return res.json({
      status: 'timeout',
      message: 'Video is still generating. Check back shortly.',
      jobId,
    })
  } catch (error) {
    console.error('Poll error:', error)
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🎬 Dream Server running on http://localhost:${PORT}`)
})
