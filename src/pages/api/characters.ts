import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import fs from "fs";
import path from "path";

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  const dirPath = path.join(process.cwd(), "public/characters");

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
    const fileNames = files.map((file) => path.parse(file).name);
    return res.status(200).json({ characters: fileNames });
  });
}

export const config = {
  api: {
    externalResolver: true,
  },
};
