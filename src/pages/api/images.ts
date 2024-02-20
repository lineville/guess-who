import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const imageSpec = `Generate a 3D, Pixar-style cartoonish character. 
The character should be drawn from the shoulders up, similar to a portrait or avatar and be the central figure on a white background.`;

const prompts = [
  "Create a character of a young Ukrainian girl with a scarf wrapped around her head and a warm expression.", //Anna
  "Create a character of a middle aged chubby red haired bearded man with a big smile and blue eyes.", //Carl
  "Create a character of an elderly African man with a traditional head wrap and a wise expression.", //Chimezi
  "Create a character of a beautiful black woman with wavy hair and a confident expression.", //Gwen
  "Create a character of a nerdy white student with glasses and an eager smile", //Kevin
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
