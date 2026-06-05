function calculateAngle(a, b, c) {
    const ba = [a[0] - b[0], a[1] - b[1]];
    const bc = [c[0] - b[0], c[1] - b[1]];
    const dot = ba[0] * bc[0] + ba[1] * bc[1];
    const mag =
        Math.sqrt(ba[0] ** 2 + ba[1] ** 2) * Math.sqrt(bc[0] ** 2 + bc[1] ** 2);
    return Math.acos(Math.max(-1, Math.min(1, dot / mag))) * (180 / Math.PI);
}

export const gameConfigs = {
    1: {
        modelFile: "/models/pushup_model.onnx",
        scalerFile: "/models/pushup_model_scaler.json",
        landmarkIndices: [11, 12, 13, 14, 15, 16],
        visibilityThreshold: 0.6,
        positionLabels: { up: "Up", down: "Down" },
        computeAngles: (lm) => {
            const shoulderLeft = [lm[11].x, lm[11].y];
            const shoulderRight = [lm[12].x, lm[12].y];
            const elbowLeft = [lm[13].x, lm[13].y];
            const elbowRight = [lm[14].x, lm[14].y];
            const wristLeft = [lm[15].x, lm[15].y];
            const wristRight = [lm[16].x, lm[16].y];
            const angleLeft = calculateAngle(
                shoulderLeft,
                elbowLeft,
                wristLeft,
            );
            const angleRight = calculateAngle(
                shoulderRight,
                elbowRight,
                wristRight,
            );
            return [angleLeft, angleRight, (angleLeft + angleRight) / 2];
        },
    },
    2: {
        modelFile: "/models/squat_model.onnx",
        scalerFile: "/models/squat_model_scaler.json",
        visibilityThreshold: 0.6,
        positionLabels: { up: "Standing", down: "Squatting" },
        landmarkIndices: [11, 23, 24, 25, 26, 27, 28],
        computeAngles: (lm) => {
            const hipLeft = [lm[23].x, lm[23].y];
            const hipRight = [lm[24].x, lm[24].y];
            const kneeLeft = [lm[25].x, lm[25].y];
            const kneeRight = [lm[26].x, lm[26].y];
            const ankleLeft = [lm[27].x, lm[27].y];
            const ankleRight = [lm[28].x, lm[28].y];
            const shoulder = [lm[11].x, lm[11].y];
            const kneeAngleLeft = calculateAngle(hipLeft, kneeLeft, ankleLeft);
            const kneeAngleRight = calculateAngle(
                hipRight,
                kneeRight,
                ankleRight,
            );
            const hipAngle = calculateAngle(shoulder, hipLeft, kneeLeft);
            return [kneeAngleLeft, kneeAngleRight, hipAngle];
        },
    },
};
