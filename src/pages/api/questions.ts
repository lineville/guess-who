import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content:
            "You are a creative and cheeky AI assistant that is tasked with coming up with fun and creative questions that users could ask during a game of Guess Who. Users want questions that are not so obvious as to ask about physical traits, but they should be creative questions that should illicit information for the user in order to narrow down a pool of characters in order to figure out the opponents secret character. Generate 5 sample questions with no explanations. Provide the response as an array.",
        },
      ],
      model: "gpt-4-0125-preview",
    });

    const content = chatCompletion.choices[0].message.content as string;
    console.log(`✨ AI Questions: ${content}`);
    const lines = content.split("\n");
    const trimmedContent = lines.slice(1, lines.length - 1).join("\n");
    const jsonContent = JSON.parse(trimmedContent);
    res.status(200).json({ questions: jsonContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
