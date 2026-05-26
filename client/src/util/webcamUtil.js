

export async function startWebcam(videoElement) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = stream;
      await videoElement.play();
      return stream;
  }

export function stopWebcam(stream) {
      if (stream) {
          stream.getTracks().forEach(track => track.stop());
      }
  }