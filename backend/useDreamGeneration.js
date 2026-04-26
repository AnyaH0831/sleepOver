import { useCallback } from 'react'
import useDreamStore from '../store/dreamStore'
import {
  enhanceDreamPrompt,
  generateDreamVideo,
  pollVideoJob,
} from '../utils/api'

export function useDreamGeneration() {
  const updateDream = useDreamStore((s) => s.updateDream)

  const generateDream = useCallback(async (dreamId) => {
    const dream = useDreamStore.getState().getDream(dreamId)
    if (!dream) return

    try {
      // ── Step 1: Enhance the raw dream text into a cinematic video prompt ──
      updateDream(dreamId, { status: 'enhancing' })
      const enhancedPrompt = await enhanceDreamPrompt(dream.enrichedDescription || dream.description)
      updateDream(dreamId, { enhancedPrompt })

      // ── Step 2: Submit text-to-video job ──
      updateDream(dreamId, { status: 'generating_video' })
      const { jobId, keyIdx } = await generateDreamVideo(enhancedPrompt)
      updateDream(dreamId, { videoJobId: jobId })

      // ── Step 3: Poll until the 5-second clip is ready ──
      const videoUrl = await pollVideoJob(jobId, keyIdx)
      updateDream(dreamId, { videoUrl, status: 'complete' })
    } catch (err) {
      console.error('Dream generation failed:', err)
      updateDream(dreamId, {
        status: 'error',
        error: err.message || 'An unknown error occurred',
      })
    }
  }, [updateDream])

  return { generateDream }
}
