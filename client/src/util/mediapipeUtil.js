import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { extractFeatures } from "./poseUtil.js";

export async function loadPoseLandmarker() {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
    );

    return await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "/models/pose_landmarker.task",
            delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
    });
}

export function startFrameLoop(videoEl, poseLandmarker, config, onFeatures) {
    let rafId = null;
    let lastTime = -1;

    function loop(timestamp) {
        rafId = requestAnimationFrame(loop);

        if (timestamp === lastTime) return;
        lastTime = timestamp;

        const result = poseLandmarker.detectForVideo(videoEl, timestamp);

        if (result.landmarks?.length > 0) {
            const features = extractFeatures(result.landmarks[0], config);
            onFeatures(features);
        } else {
            onFeatures(null);
        }
    }

    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
}
