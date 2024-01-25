import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const imageSpec =
  "Generate a 3D, Pixar-style character. The character should be realistic and resemble a real person. Make sure that the character fits within a square frame and takes up approximately the same amount of space as the other characters. The character should be drawn from the shoulders up, similar to a portrait or avatar. There should be a single character.";

const prompts = [
  "A plain white background with a red question mark in the center.",
  // "Create a 3D image of a red question mark on a white background and appear like it might appear on the back of a playing card for a board game. The image should just be a question mark nothing else."
  // "Create a character of a young white Man with a comical look and a student attire.",
  // "Create a character of a chubby middle aged brown-haired Indian woman with a curious expression.",
  // "Create a character of a kind elderly white woman with frizzy blonde hair and eclectic attire.",
  // "Create a character of a young black American man, with a serious expression and urban attire.",
  // "Create a character of a middle aged black American man, with a calm expression and academic attire.",
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const promises = prompts.map((prompt: string) =>
    openai.images.generate({
      model: "dall-e-3",
      prompt: `${prompt}`,
    })
  );

  try {
    const data = await Promise.all(promises);
    const images = data.map((i) => i.data[0].url);
    console.log(images);
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}


// Code to call the endpoint

  // const generateImages = async () => {

  //   fetch('/api/images')
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Failed to generate images');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       console.log('Generated images:', data);
  //       // setGameState({
  //       //   ...gameState,
  //       //   board: [...gameState.board, data.map((url: string) => ({
  //       //     name: 'Name',
  //       //     image: url,
  //       //     alive: true
  //       //   }))],
  //       // });
  //     })
  //     .catch(error => {
  //       console.error('Failed to generate images:', error);
  //     });
  // }