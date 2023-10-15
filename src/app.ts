import * as dotenv from 'dotenv'
import fetch from "node-fetch";
import { App, AwsLambdaReceiver, LogLevel } from '@slack/bolt';

dotenv.config();

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET ?? "",
  logLevel: LogLevel.DEBUG,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
});

app.event('app_mention', async ({ say }) => {
  const response = await fetch("https://db.ygoprodeck.com/api/v7/randomcard.php");
  const jsonData: { name: string, card_images: [{ image_url: string }] } = await response.json();
  const cardName = jsonData.name;
  const imageUrl = jsonData.card_images[0].image_url;

  say(`<${imageUrl}|${cardName}>`);
});

export const handler = async (event: any, context: any, callback: any) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
}
