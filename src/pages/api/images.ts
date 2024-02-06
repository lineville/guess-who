import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const imageSpec = `Generate a 3D, Pixar-style cartoonish character. 
The character should be drawn from the shoulders up, similar to a portrait or avatar and be the central figure on a white background.`;

const prompts = [
  "Create a character of a young Aboriginal boy with a happy expression and traditional attire.",
  "Create a character of a bougie, high-society white woman with a snooty expression and a designer outfit.",
  "Create a character of an intellectual, elegant middle aged white woman with a sophisticated expression and a chic outfit.",
  "Create a character of a gorgeous red-haired white woman with a sultry expression and a glamorous outfit.",
  "Create a character of a sweet elderly Mexican woman with a warm expression and traditional attire.",
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
