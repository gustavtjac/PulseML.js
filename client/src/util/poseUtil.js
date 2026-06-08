export function extractFeatures (landmarks, config) {
  const relevantLandmarks = config.landmarkIndices.map((indice) => landmarks[indice])

  if (
    relevantLandmarks.some(
      (landmark) => landmark.visibility < config.visibilityThreshold
    )
  ) {
    return null
  }

  const coords = relevantLandmarks.flatMap((landmark) => [
    landmark.x,
    landmark.y,
    landmark.visibility
  ])
  const angles = config.computeAngles(landmarks)

  return [...coords, ...angles]
}
