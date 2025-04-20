import fs from 'fs';
import path from 'path';

const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
const MODEL_DIR = './public/models';

const models = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
];

if (!fs.existsSync(MODEL_DIR)) {
  fs.mkdirSync(MODEL_DIR, { recursive: true });
}

async function downloadModels() {
  try {
    for (const model of models) {
      const response = await fetch(`${MODEL_URL}/${model}`);
      if (!response.ok) throw new Error(`Failed to download ${model}`);
      const blob = await response.blob();
      
      // Convert blob to base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      
      const file = fs.createWriteStream(path.join(MODEL_DIR, model));
      file.write(base64, 'base64');
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${model}`);
      });
    }
    console.log('All models downloaded successfully');
  } catch (error) {
    console.error('Error downloading models:', error);
  }
}

downloadModels(); 