import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
  useTLS: true
});

const handler = async (req: any, res: any) => {
  const channel = `${process.env.NEXT_PUBLIC_PUSHER_CHANNEL as string}-${req.body.gameId}`;
  await pusher.trigger(channel, req.body.event, req.body);
  res.status(200).end('sent event successfully');
};

export default handler;