import ort from "onnxruntime-web";

export async function loadModel(modelFile) {
    return await ort.InferenceSession.create(modelFile);
}

export async function loadScaler(scalerFile) {
    const res = await fetch(scalerFile);
    return await res.json();
}

export async function runInference(session, frameBuffer, scaler) {
    const seqLen = frameBuffer.length;
    const featSize = frameBuffer[0].length;

    const scaled = frameBuffer.map((frame) =>
        frame.map((val, i) => (val - scaler.mean[i]) / scaler.scale[i]),
    );

    const flat = new Float32Array(scaled.flat());
    const tensor = new ort.Tensor("float32", flat, [1, seqLen, featSize]);

    const inputName = session.inputNames[0];
    const result = await session.run({ [inputName]: tensor });

    const outputName = session.outputNames[0];
    return result[outputName].data[0];
}
