const Discord = require('discord.js-selfbot-v13');
const client = new Discord.Client();
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const config = require('./config.js');
console.log('\x1b[31m%s\x1b[0m', 'Make sure to join the server of channel ID from the account you use the token from');

app.get('/', (req, res) => {
    res.redirect('/meme');
});

client.on('ready', () => {
    //   console.log(`Logged in as ${client.user.tag}!`);
    console.log('\x1b[32m%s\x1b[0m\x1b[33m%s\x1b[0m', 'Logged in as ', client.user.tag + '!');
    const channelIds = config.CHANNEL_IDs;
    const randomChannelId = channelIds[Math.floor(Math.random() * channelIds.length)];
    app.get('/meme', (req, res) => {
        client.channels.cache.get(randomChannelId).messages.fetch().then((messages) => {
            const randomMessage = messages.random();
            if (randomMessage.attachments.size > 0) {
                const randomAttachment = randomMessage.attachments.random();
                // console.log(`Found random media attachment: ${randomAttachment.url}`);
                res.status(200).send({media:randomAttachment.url});
            } else {
                console.log('No media attachments found in the random message.');
                res.status(404).send('No media attachments found in the random message.');
            }
        });
    });

});

const TOKEN = config.TOKEN;
if (!TOKEN) {
    console.log('\x1b[31m%s\x1b[0m', 'Please provide a valid token.');
    process.exit(1);
}

client.login(TOKEN);

app.listen(PORT, () => {
    console.log('Server is ready');
});