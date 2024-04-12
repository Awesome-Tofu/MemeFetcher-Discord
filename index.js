const Discord = require('discord.js-selfbot-v13');
const client = new Discord.Client();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const app = express();
const config = require('./config.js');
console.log('\x1b[31m%s\x1b[0m', 'Make sure to join the server of channel ID from the account you use the token from');

app.use(cors());

app.get('/', (req, res) => {
    res.json({
        use: '/meme',
        optional_params: {
            type: 'image or video',
            channel: 'channel id'
        }
    });
});

let requestCount = {
    meme: 0,
    image: 0,
    video: 0
}

app.get('/meme', (req, res) => {
    const channelIds = config.CHANNEL_IDs;
    const randomChannelId = channelIds[Math.floor(Math.random() * channelIds.length)];

    let { type, channel } = req.query;
    if (!channel) {
        channel = randomChannelId;
    }

    client.channels.fetch(channel).then(channel => {
        channel.messages.fetch({ limit: 100 })
            .then(messages => {
                const attachments = messages.flatMap(message => message.attachments);
                let selectedAttachment;

                if (type === 'image') {
                    requestCount.image++;
                    const imageAttachments = attachments.filter(attachment => attachment.contentType.startsWith('image/'));

                    if (imageAttachments.length > 0) {
                        selectedAttachment = imageAttachments[Math.floor(Math.random() * imageAttachments.length)];
                    } else {
                        res.status(404).send("No image attachments found.");
                        return;
                    }
                } else if (type === 'video') {
                    requestCount.video++;
                    const videoAttachments = attachments.filter(attachment => attachment.contentType.startsWith('video/'));

                    if (videoAttachments.length > 0) {
                        selectedAttachment = videoAttachments[Math.floor(Math.random() * videoAttachments.length)];
                    } else {
                        res.status(404).send("No video attachments found.");
                        return;
                    }
                } else {
                    requestCount.meme++;
                    const randomMessage = messages.random();
                    if (randomMessage.attachments.size > 0) {
                        selectedAttachment = randomMessage.attachments.random();
                    } else {
                        console.log('No media attachments found in the random message.');
                        res.status(404).send('No media attachments found in the random message.');
                        return;
                    }
                }

                if (selectedAttachment) {
                    res.status(200).send({
                        media: selectedAttachment.url,
                        name: selectedAttachment.name,
                        size: selectedAttachment.size,
                        contentType: selectedAttachment.contentType,
                        channel: channel.id,
                        height: selectedAttachment.height,
                        width: selectedAttachment.width
                    });
                } else {
                    console.log('No media attachments found.');
                    res.status(404).send('No media attachments found.');
                }
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
                res.status(500).send('Error fetching messages');
            });
    }).catch(error => {
        console.error('Error fetching channel:', error);
        res.status(404).send('Channel not found');
    });
});

app.get('/traffic', (req, res) => {
    res.json({ totalRequests: requestCount });
});

// Log in to Discord
const TOKEN = config.TOKEN;
if (!TOKEN) {
    console.log('\x1b[31m%s\x1b[0m', 'Please provide a valid token.');
    process.exit(1);
}

client.on('ready', () => {
    console.log('\x1b[32m%s\x1b[0m\x1b[33m%s\x1b[0m', 'Logged in as ', client.user.tag + '!');
});

client.login(TOKEN);

app.listen(PORT, () => {
    console.log('Server is ready. http://localhost:' + PORT + '/');
});
