import ort from "onnxruntime-web";

export async function loadModel(modelFile) {
    return await ort.InferenceSession.create(modelFile);
}

export async function loadScaler(scalerFile) {
    const response = await fetch(scalerFile);
    return await response.json();
}

export async function runInference(session, frameBuffer, scaler) {
    const sequenceLength = frameBuffer.length;
    const featureSize = frameBuffer[0].length;

    const scaledFrames = frameBuffer.map((frame) =>
        frame.map(
            (value, index) =>
                (value - scaler.mean[index]) / scaler.scale[index],
        ),
    );

    const flattenedData = new Float32Array(scaledFrames.flat());
    const tensor = new ort.Tensor("float32", flattenedData, [
        1,
        sequenceLength,
        featureSize,
    ]);

    const inputName = session.inputNames[0];
    const result = await session.run({ [inputName]: tensor });

    const outputName = session.outputNames[0];
    return result[outputName].data[0];
}
