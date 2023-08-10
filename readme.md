### --- { OVERVIEW } --- ###
The Discord Voice Channel Manager Bot is a bot that helps manage temporary voice channels in Discord servers. It allows users to create temporary voice channels based on specified criteria. The bot also automatically deletes empty temporary voice channels to keep the server tidy.

### --- { FEATURES } --- ###
- Create temporary voice channels dynamically when all members in a designated channel is ready and 1 person from the party joins the ready channel.
- Automatically delete empty temporary voice channels to keep the server organized.
- Set a category for new temporary voice channels to be placed under.
- Customize the max amount of members which can be in a temporary voice channel.

### --- { REQUIREMENTS } --- ###
- Node version 16.17.1 or above

### --- { SETUP } --- ###
# env.js Setup
1. Locate the env.js file (./source/env.js) and open it up in notepad.
2. Here you will see a list of constants that are used throughout the code.
3. Goto https://discord.com/developers/applications and select your application.
4. You will find the APPLICATION_ID and PUBLIC_KEY under the tab "General Location".
5. You will find the CLIENT_SECRET under the tab "OAuth2", you will need to reset it to view it, do so if you don't have it written down somewhere.
6. You will find the TOKEN under the tab "Bot", you will again need to reset it to view it, do so if you haven't written it down somewhere.

# Permission Setup
1. Now you need to give the bot some permissions it needs.
2. Goto https://discord.com/developers/applications and select your application.
3. Navigate to the tab labelled "Bot"
4. Enable all Privileged Gateway Intents, (Presence Intent, Server Members Intent, Message Content Intent)
5. Edit this link to say "client_id=YOUR_BOT_CLIENT_ID", This will authorize the bot with the permissions it needs to perform actions. https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_CLIENT_ID&permissions=274894687248&scope=bot

# How To Launch (Windows 10/11)
1. Press Win + R and type `cmd` to open the Command Prompt.
2. Type `cd "PATH_TO_VOICE_BOT\source"`, replace the PATH_TO_VOICE_BOT with the correct path, you want to be to be in the `<./source>` directory.
3. Type `node ./index.js`  and press Enter. This will launch the discord bot, the cmd will now be the terminal where errors, commands and information will be displayed.