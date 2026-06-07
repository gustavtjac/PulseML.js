export function extractFeatures(landmarks, config) {
    const relevantLandmarks = config.landmarkIndices.map((i) => landmarks[i]);

    if (
        relevantLandmarks.some(
            (landmark) => landmark.visibility < config.visibilityThreshold,
        )
    ) {
        return null;
    }

    const coords = relevantLandmarks.flatMap((landmark) => [
        landmark.x,
        landmark.y,
        landmark.visibility,
    ]);
    const angles = config.computeAngles(landmarks);

    return [...coords, ...angles];
}
