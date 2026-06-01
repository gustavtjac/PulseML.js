export function extractFeatures(landmarks, config) {
    const relevant = config.landmarkIndices.map((i) => landmarks[i]);

    if (relevant.some((lm) => lm.visibility < config.visibilityThreshold)) {
        return null;
    }

    const coords = relevant.flatMap((lm) => [lm.x, lm.y, lm.visibility]);
    const angles = config.computeAngles(landmarks);

    return [...coords, ...angles];
}
