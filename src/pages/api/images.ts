import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const imageSpec =
  "Ensure that the image is from the shoulders and above and that the character is expressive and cartoonish. The background should be white and the character should be centered in the image.";

const prompts = [
  // "Generate an elderly woman with curly gray hair, wearing a vibrant headscarf, holding a knitting needle. " +
  //   imageSpec,
  // "Create a young boy with messy hair, glasses, and a backpack, grinning with excitement. " +
  //   imageSpec,
  // "Generate a middle-aged man with a beard, wearing a stylish bow tie, confidently posing with a briefcase. " +
  //   imageSpec,
  // "Create a teenage girl with long braided hair, a hoodie, and a skateboard tucked under her arm. " +
  //   imageSpec,
  // "Generate a man in his 30s with a shaved head, sunglasses, and a tattoo on his forearm, playing a guitar. " +
  //   imageSpec,
  "Create a young Caribbean woman with natural curls, wearing a sun hat, and enjoying a tropical fruit with a carefree and relaxed expression. " + imageSpec,
  "Generate a Scandinavian man with blonde hair, a beard, and holding a Nordic rune stone with a stoic and mystical presence. " + imageSpec,
  "Create a South American teenager with colorful traditional clothing, playing a traditional instrument, and radiating a passion for cultural heritage. " + imageSpec,
  "Generate an Australian Aboriginal elder with distinct facial markings, wearing ceremonial attire, and holding a didgeridoo with a wise and spiritual demeanor. " + imageSpec,
  "Create an Eastern European young adult with a unique hairstyle, wearing avant-garde fashion, and posing with a paintbrush for a creative and avant-garde look. " + imageSpec,
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const promises = prompts.map((p) =>
    openai.images.generate({
      model: "dall-e-3",
      prompt: p,
    })
  );

  try {
    const data = await Promise.all(promises);
    const images = data.map(i => i.data[0].url)
    console.log(images);
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
