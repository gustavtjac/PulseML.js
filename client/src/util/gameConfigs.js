function calculateAngle (pointA, vertex, pointC) {
  const vectorToA = [pointA[0] - vertex[0], pointA[1] - vertex[1]]
  const vectorToC = [pointC[0] - vertex[0], pointC[1] - vertex[1]]
  const dotProduct =
        vectorToA[0] * vectorToC[0] + vectorToA[1] * vectorToC[1]
  const magnitude =
        Math.sqrt(vectorToA[0] ** 2 + vectorToA[1] ** 2) *
        Math.sqrt(vectorToC[0] ** 2 + vectorToC[1] ** 2)
  return (
    Math.acos(Math.max(-1, Math.min(1, dotProduct / magnitude))) *
        (180 / Math.PI)
  )
}

export const gameConfigs = {
  1: {
    modelFile: '/models/pushup_model.onnx',
    scalerFile: '/models/pushup_model_scaler.json',
    landmarkIndices: [11, 12, 13, 14, 15, 16],
    visibilityThreshold: 0.6,
    positionLabels: { up: 'Up', down: 'Down' },
    computeAngles: (landmarks) => {
      const shoulderLeft = [landmarks[11].x, landmarks[11].y]
      const shoulderRight = [landmarks[12].x, landmarks[12].y]
      const elbowLeft = [landmarks[13].x, landmarks[13].y]
      const elbowRight = [landmarks[14].x, landmarks[14].y]
      const wristLeft = [landmarks[15].x, landmarks[15].y]
      const wristRight = [landmarks[16].x, landmarks[16].y]
      const angleLeft = calculateAngle(
        shoulderLeft,
        elbowLeft,
        wristLeft
      )
      const angleRight = calculateAngle(
        shoulderRight,
        elbowRight,
        wristRight
      )
      return [angleLeft, angleRight, (angleLeft + angleRight) / 2]
    }
  },
  2: {
    modelFile: '/models/squat_model.onnx',
    scalerFile: '/models/squat_model_scaler.json',
    visibilityThreshold: 0.6,
    positionLabels: { up: 'Standing', down: 'Squatting' },
    landmarkIndices: [11, 23, 24, 25, 26, 27, 28],
    computeAngles: (landmarks) => {
      const hipLeft = [landmarks[23].x, landmarks[23].y]
      const hipRight = [landmarks[24].x, landmarks[24].y]
      const kneeLeft = [landmarks[25].x, landmarks[25].y]
      const kneeRight = [landmarks[26].x, landmarks[26].y]
      const ankleLeft = [landmarks[27].x, landmarks[27].y]
      const ankleRight = [landmarks[28].x, landmarks[28].y]
      const shoulder = [landmarks[11].x, landmarks[11].y]
      const kneeAngleLeft = calculateAngle(hipLeft, kneeLeft, ankleLeft)
      const kneeAngleRight = calculateAngle(
        hipRight,
        kneeRight,
        ankleRight
      )
      const hipAngle = calculateAngle(shoulder, hipLeft, kneeLeft)
      return [kneeAngleLeft, kneeAngleRight, hipAngle]
    }
  }
}
