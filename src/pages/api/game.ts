// pages/api/createGame.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { v4 as uuidv4 } from 'uuid';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const newGameId = uuidv4();
//     res.status(200).json({ gameId: newGameId });
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }