import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const imageSpec =
  "Generate a 3D, Pixar-style character. The character should be realistic and resemble a real person. Make sure that the character fits within a square frame and takes up approximately the same amount of space as the other characters. The character should be drawn from the shoulders up, similar to a portrait or avatar. There should be a single character."
  const prompts = [
    "Create a character of a young Inuit girl with traditional attire and a bright smile.",
    "Design a character of a middle-aged Middle Eastern man with a keffiyeh and a confident expression.",
    "Produce a character of an elderly South American woman with traditional attire and a warm look.",
    "Illustrate a character of a teenage Pacific Islander boy with traditional tattoos and a cheerful expression.",
    "Generate a character of a young African woman with colorful attire and a joyful expression.",
  ];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const promises = prompts.map((prompt: string) =>
    openai.images.generate({
      model: "dall-e-3",
      prompt: `${prompt} ${imageSpec}`,
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
