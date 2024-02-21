import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const imageSpec = `Generate a 3D, Pixar style character of a Marvel Super Hero. 
The character should be drawn from the shoulders up, similar to a portrait or avatar and be the central figure on a white background.`;

const prompts = [
  "Create a character of Miss Captain Marvel",
  "Create a character of Cat Woman",
  "Create a character of Batman",
  "Create a character of Thanos",
  "Create a character of Ant man",
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
