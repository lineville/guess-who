import Pusher from "pusher";
import { NextApiRequest, NextApiResponse } from 'next';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
  useTLS: true
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const channel = `${process.env.NEXT_PUBLIC_PUSHER_CHANNEL as string}-${req.body.gameId}`;
  switch (req.body.event) {
    case 'ask':
      // TODO
      await pusher.trigger(channel, req.body.event, req.body);
      break;
    case 'flip':
      // TODO eliminate/revive the player from the gamestate
      await pusher.trigger(channel, req.body.event, req.body);
      break;
    default:
      break;
  }

  res.status(200).end('sent event successfully');
};

export default handler;