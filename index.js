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

client.on('ready', () => {
    //   console.log(`Logged in as ${client.user.tag}!`);
    console.log('\x1b[32m%s\x1b[0m\x1b[33m%s\x1b[0m', 'Logged in as ', client.user.tag + '!');
    app.get('/meme', (req, res) => {
        const channelIds = config.CHANNEL_IDs;
        const randomChannelId = channelIds[Math.floor(Math.random() * channelIds.length)];

        let {
            type,
            channel
        } = req.query;
        if (!channel) {
            channel = randomChannelId;
        }

        client.channels.cache.get(channel).messages.fetch({
            limit: 100
        }).then((messages) => {
            // Filter out messages with no attachments
            const attachments = JSON.parse(`${JSON.stringify(messages.flatMap(message => message.attachments))}`.replace(/=> MessageAttachment/g, ':').replace(/flags: AttachmentFlags { bitfield: 0 }/g, ''));

            let selectedAttachment;

            if (type === 'image') {
                requestCount.image++;
                // Filter out attachments with content type starting with 'image/'
                const imageAttachments = attachments.filter(attachment => attachment.contentType.startsWith('image/'));

                if (imageAttachments.length > 0) {
                    const randomImageAttachment = imageAttachments[Math.floor(Math.random() * imageAttachments.length)];

                    selectedAttachment = randomImageAttachment;
                } else {
                    res.status(404).send("No image attachments found.");
                }
            } else if (type === 'video') {
                requestCount.video++;
                // Filter out attachments with content type starting with 'video/'
                const videoAttachments = attachments.filter(attachment => attachment.contentType.startsWith('video/'));

                if (videoAttachments.length > 0) {
                    const randomImageAttachment = videoAttachments[Math.floor(Math.random() * videoAttachments.length)];

                    selectedAttachment = randomImageAttachment;
                } else {
                    res.status(404).send("No video attachments found.");
                }
            } else {
                requestCount.meme++;
                // Select a random message
                const randomMessage = messages.random();
                if (randomMessage.attachments.size > 0) {
                    const randomAttachment = randomMessage.attachments.random();
                    // console.log(`Found random media attachment: ${randomAttachment.url}`);
                    selectedAttachment = randomAttachment;
                } else {
                    console.log('No media attachments found in the random message.');
                    res.status(404).send('No media attachments found in the random message.');
                }
            }

            if (selectedAttachment) {
                // Send the selected attachment
                res.status(200).send({
                    media: selectedAttachment.url,
                    name: selectedAttachment.name,
                    size: selectedAttachment.size,
                    contentType: selectedAttachment.contentType,
                    channel: channel,
                    height: selectedAttachment.height,
                    width: selectedAttachment.width
                });
            } else {
                // If no attachments are found, send a 404 response
                console.log('No media attachments found in the random message.');
                res.status(404).send('No media attachments found in the random message.');
            }
        }).catch((error) => {
            // Log the error message
            console.error(error.message);
            // If the channel ID is invalid, send a 404 response
            if (error.message.includes("Cannot read properties of undefined (reading 'messages')")) {
                res.status(404).json({
                    error: 'unable to find the channel, make sure the channel ID is correct. And make sure bot is in the server of the channel ID.'
                });
            }
            res.status(500).json({
                error: error.message
            });
        });
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

client.login(TOKEN);

app.listen(PORT, () => {
    console.log('Server is ready. http://localhost:' + PORT + '/');
});
