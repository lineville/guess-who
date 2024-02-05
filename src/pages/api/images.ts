import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const imageSpec = `Generate a 3D, Pixar-style cartoonish character. 
The character should be drawn from the shoulders up, similar to a portrait or avatar and be the central figure on a white background.`;

const prompts = [
  "Create a character of a young Asian woman with a cheerful expression and sporty attire.",
  "Create a character of a tall elderly Hispanic man with a thoughtful expression and casual attire.",
  "Create a character of a middle-aged redhead woman with a confident look and business attire.",
  "Create a character of a young Middle Eastern man with a friendly expression and traditional attire.",
  "Create a character of a petite elderly Asian woman with a wise expression and elegant attire.",
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
