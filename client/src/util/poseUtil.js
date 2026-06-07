export function extractFeatures(landmarks, config) {
    const relevant = config.landmarkIndices.map((i) => landmarks[i]);

    if (
        relevant.some(
            (landmark) => landmark.visibility < config.visibilityThreshold,
        )
    ) {
        return null;
    }

    const coords = relevant.flatMap((landmark) => [
        landmark.x,
        landmark.y,
        landmark.visibility,
    ]);
    const angles = config.computeAngles(landmarks);

    return [...coords, ...angles];
}
