const tmi = require('tmi.js');
const env = require('dotenv').config();

console.log("Initializing server...");

const commandRegex = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
    website: {
        response: 'https://ossm.space'
    },
    upvote: {
        response: (user) => `User ${user} was upvoted`
    }
}

const client = new tmi.Client({
    options: { debug: true },
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    },
    channels: ['programmingwhilesleeping']
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    // Ignore echoed messages.
    if (self) return;


    const [raw, command, argument] = message.match(commandRegex);

    const { response } = commands[command] || {};

    if (typeof response == 'function') {
        client.say(channel, response(tags.username))
    }
    else if (typeof response == 'string') {
        client.say(channel, response);
    }

    if (message.toLowerCase() === '!hello') {
        // "@alca, heya!"
        client.say(channel, `@${tags.username}, heya!`);
    }
});

console.log("server is running");
