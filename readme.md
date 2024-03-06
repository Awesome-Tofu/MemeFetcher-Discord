# MemeFetcher-Discord

This is a Discord self-bot that fetches random memes from specified channels and serves them through an [Express.js](https://expressjs.com/) web server and uses [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13/) in backend.

## Setup

1. Clone this repository through `git clone https://github.com/Awesome-Tofu/MemeFetcher-Discord` and `cd MemeFetcher-Discord`.
2. Install the necessary dependencies with `npm install`.
3. Edit the `config.js` file in the root directory with the following structure:

```javascript
module.exports = {
    TOKEN: process.env.TOKEN || "your-discord-token",
    CHANNEL_IDs: ["channel_id1", "channel_id2", "you can add more this way..."]
};
```

If you dont want to add your TOKEN here, you can add in `.env` file. I would prefer you to add it in environment.

Replace `'your-discord-token'` with your [Discord token](https://github.com/aiko-chan-ai/discord.js-selfbot-v13?tab=readme-ov-file#get-token-) and `'channel-id-1', 'channel-id-2', 'channel-id-3'` with the IDs of the channels you want to fetch memes from.

## Config

### TOKEN

To get Dicord token, go [here](https://github.com/aiko-chan-ai/discord.js-selfbot-v13?tab=readme-ov-file#get-token-)

### CHANNEL_IDs

To get the ID of a channel in Discord, you can follow these steps:

1. **Enable Developer Mode:** Go to your Discord settings, then navigate to the "Appearance" tab. Under the "Advanced" section, toggle on "Developer Mode".
2. **Right-click the Channel:** Once Developer Mode is enabled, go back to your Discord server. Right-click on the meme channel whose ID you want to obtain.
3. **Select "Copy ID":** After right-clicking on the channel, you should see an option to "Copy ID". Click on it, and the ID of the channel will be copied to your clipboard.
4. **Paste the ID:** You can now paste the channel ID wherever you need it, such as in your code or in any other Discord-related context.

## Usage

Start the bot with `node index.js` or `npm start`. The bot will log into Discord and start the web server.

You can then access the `/meme` route on `localhost:3000` to fetch a random message with a media attachment from the specified channels. If no media attachments are found, the server will respond with a 404 error.

## Note

It's important to note that you should use channel IDs responsibly and in accordance with Discord's terms of service. Misusing channel IDs or any other Discord-related information can lead to your account being banned.