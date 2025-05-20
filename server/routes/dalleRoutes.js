import express from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import FormData from 'form-data';

dotenv.config();
const router = express.Router();

const STABILITY_API_KEY = process.env.OPENAI_API_KEY;

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  try {
    const form = new FormData();
    form.append('prompt', prompt);
    form.append('output_format', 'png');
    form.append('mode', 'text-to-image');

    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${STABILITY_API_KEY}`,
        },
      }
    );

    const imageBase64 = response.data.image;
    res.status(200).json({ photo: imageBase64 });
  } catch (error) {
    console.error('Error from Stability API:', error.response?.data || error.message);
    res.status(500).send('Image generation failed');
  }
});

export default router;
