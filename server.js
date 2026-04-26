import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// ─── MongoDB Connection ────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI not found in .env')
} else {
  mongoose.connect(MONGODB_URI, {
    dbName: 'SleepOver',
  })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err))
}

// ─── Dream Schema ──────────────────────────────────────────────────────────
const dreamSchema = new mongoose.Schema({
  description: { type: String, required: true },
  videoUrl: { type: String },
  jobId: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'processing' } // processing, complete, error
})

const Dream = mongoose.model('ArchiveDream', dreamSchema)

// ─── API: Save Dream ──────────────────────────────────────────────────────
app.post('/api/save-dream', async (req, res) => {
  try {
    const { description, jobId, videoUrl } = req.body

    if (!description) {
      return res.status(400).json({ error: 'Description required' })
    }

    const dream = new Dream({
      description,
      jobId,
      videoUrl: videoUrl || null,
      status: videoUrl ? 'complete' : 'processing'
    })

    await dream.save()
    console.log('💾 Dream saved:', dream._id)
    res.json({ success: true, dreamId: dream._id })
  } catch (error) {
    console.error('Save dream error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─── API: Get All Dreams ───────────────────────────────────────────────────
app.get('/api/dreams', async (req, res) => {
  try {
    const dreams = await Dream.find().sort({ createdAt: -1 })
    res.json(dreams)
  } catch (error) {
    console.error('Get dreams error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─── API: Update Dream with Video URL ───────────────────────────────────
app.post('/api/update-dream', async (req, res) => {
  try {
    const { jobId, videoUrl, status } = req.body

    if (!jobId) {
      return res.status(400).json({ error: 'jobId required' })
    }

    const dream = await Dream.findOneAndUpdate(
      { jobId },
      { videoUrl, status: status || 'complete' },
      { new: true }
    )

    if (!dream) {
      return res.status(404).json({ error: 'Dream not found' })
    }

    console.log('✅ Dream updated:', dream._id)
    res.json({ success: true, dream })
  } catch (error) {
    console.error('Update dream error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─── Magic Hour API Keys ──────────────────────────────────────────────────
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
  process.env.VITE_MAGIC_HOUR_API_KEY_10
].filter(Boolean)

console.log(`📌 Loaded ${MAGIC_HOUR_API_KEYS.length} Magic Hour API keys`)
MAGIC_HOUR_API_KEYS.forEach((key, i) => {
  console.log(`   Key ${i + 1}: ${key?.substring(0, 10)}...${key?.substring(key.length - 10)}`)
})

// Poll Magic Hour for video status
app.post('/api/poll-video', async (req, res) => {
  const { jobId, keyIdx } = req.body

  if (!jobId) {
    return res.status(400).json({ error: 'Job ID required' })
  }

  console.log(`\n🔍 Starting poll for job: ${jobId}`)
  console.log(`📊 Using ${MAGIC_HOUR_API_KEYS.length} API keys`)

  try {
    if (MAGIC_HOUR_API_KEYS.length === 0) {
      return res.status(500).json({ error: 'No API keys configured' })
    }

    // Wait 2 seconds before first check to let video generation start
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Use the same key that created the video
    let currentKeyIndex = keyIdx || 0
    let pollCount = 0

    console.log(`🔑 Starting with key ${currentKeyIndex + 1}/${MAGIC_HOUR_API_KEYS.length}`)

    // Poll with reasonable intervals - max 2 minutes, checking every 3 seconds
    for (let i = 0; i < 40; i++) {
      const apiKey = MAGIC_HOUR_API_KEYS[currentKeyIndex]
      pollCount++
      
      if (!apiKey) {
        console.error(`❌ Key index ${currentKeyIndex} is out of bounds! Only ${MAGIC_HOUR_API_KEYS.length} keys loaded`)
        return res.json({
          status: 'error',
          error: `Invalid key index: ${currentKeyIndex}`
        })
      }

      // Try the correct endpoint
      let response = await fetch(
        `https://api.magichour.ai/v1/video-projects/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      // If 404, try alternative endpoint
      if (response.status === 404) {
        response = await fetch(
          `https://api.magichour.ai/v1/text-to-video/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        )
      }

      const data = await response.json().catch(() => ({}))

      if (response.ok && data) {
        console.log(`✓ Poll ${i + 1} (key ${currentKeyIndex + 1}/${MAGIC_HOUR_API_KEYS.length}): status=${data.status}`)

        if (data.status === 'complete') {
          const url = data.url || data.downloads?.[0]?.url
          if (url) {
            console.log('✅ Video ready:', url.substring(0, 50) + '...')
            
            // Save/update dream with video URL in MongoDB
            await Dream.findOneAndUpdate(
              { jobId },
              { videoUrl: url, status: 'complete' },
              { new: true }
            ).catch(err => console.log('Note: Dream update skipped (may not exist yet)'))
            
            return res.json({ status: 'complete', videoUrl: url })
          }
        }

        if (data.status === 'error' || data.status === 'failed') {
          // Save error status
          await Dream.findOneAndUpdate(
            { jobId },
            { status: 'error' },
            { new: true }
          ).catch(err => console.log('Note: Dream error update skipped'))
          
          return res.json({ status: 'error', error: data.error_message || 'Generation failed' })
        }

        // Keep polling if still processing
        await new Promise(resolve => setTimeout(resolve, 3000))
      } else if (response.status === 429) {
        // Rate limited - switch to next API key
        console.log(`⚠️  Poll ${i + 1} (key ${currentKeyIndex + 1}): Rate limited (429). Switching to next key...`)
        
        if (currentKeyIndex < MAGIC_HOUR_API_KEYS.length - 1) {
          currentKeyIndex++
          console.log(`🔄 Now using API key ${currentKeyIndex + 1}/${MAGIC_HOUR_API_KEYS.length}`)
          pollCount = 0 // Reset poll count for new key
        } else {
          console.log('❌ All API keys exhausted')
          return res.json({
            status: 'error',
            error: 'All API keys have been rate limited'
          })
        }
        
        await new Promise(resolve => setTimeout(resolve, 3000))
      } else {
        // Other errors - keep polling with current key
        const errorBody = data.message || data.error || 'Unknown error'
        console.log(`- Poll ${i + 1} (key ${currentKeyIndex + 1}): HTTP ${response.status} - ${errorBody}`)
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
