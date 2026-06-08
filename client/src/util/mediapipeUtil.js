import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import { extractFeatures } from './poseUtil.js'

export async function loadPoseLandmarker () {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
  )

  return await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: '/models/pose_landmarker.task',
      delegate: 'GPU'
    },
    runningMode: 'VIDEO',
    numPoses: 1
  })
}

export function startFrameLoop (videoElement, poseLandmarker, config, onFeatures) {
  let animationFrameId = null
  let lastTimestamp = -1

  function loop (timestamp) {
    animationFrameId = requestAnimationFrame(loop)

    if (timestamp === lastTimestamp) return
    lastTimestamp = timestamp

    const result = poseLandmarker.detectForVideo(videoElement, timestamp)

    if (result.landmarks?.length > 0) {
      const features = extractFeatures(result.landmarks[0], config)
      onFeatures(features)
    } else {
      onFeatures(null)
    }
  }

  animationFrameId = requestAnimationFrame(loop)

  return () => cancelAnimationFrame(animationFrameId)
}
