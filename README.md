# JK Bot

A Discord Bot initially created for Japan Kankei discord [server](https://discord.gg/kR83CU3v4Z) using Slash Commands and Context Menus. Japan Kankei is a Japanese-oriented learning project, with learning Twitch lives as well as many activities on discord.

## Documentation

Just go [there](https://youenplusquellec.github.io/jk_bot/)

## ⚙️ Setup

1. Create a folder on your computer, then type the following console command to clone this repository.


```bash
git clone https://github.com/youenPlusquellec/jk_bot
```

2. Create a Discord Application and name it.

![bot create](https://i.imgur.com/luHPTGL.png "Step 2")

3. Rename `example.env` to `.env` and `example.config` to `config.js` and fill the required values from the Discord **Bot** Page. **Do not show anyone these!**

4. Install Node.js v16.6 or higher by selecting the **Current** tab, and then **"OS Name" Installer**. [Click here](https://nodejs.org/en/download/current/) for the download page.

![nodejs](https://i.imgur.com/mtJcz5E.png "Step 4")

5. Install all of the required NPM modules, and `Visual Studio C++ Build Tools` on Windows (if you have issues).

```bash
npm install
```

```bash
npm i -g --add-python-to-path --vs2015 --production windows-build-tools
```

6. Start the bot.

```bash
npm start
```

## ⌨️ ⌨️ Usage

To create slash commands on the server, you need to set to `true` deployOnStart variable in `config.js`:

To create slash commands on the server, you need to set to `true` deployOnStart variable in `config.js`:

```bash
module.exports = {
    deployOnStart: true,
};
```

These will create a new set of commands in the server.

> NOTE: You may need to wait an hour for the commands to create. 200 Command Creates per day is the limit.

**Command Folder Structure:**

- `context` folder contains the Context Menu commands.
- `general` and other folders are slash commands.

## 📚 Guides

- [Creating commands](https://discordjs.guide/creating-your-bot/creating-commands.html)
- [Replying to Slash Commands](https://discordjs.guide/interactions/slash-commands.html#replying-to-slash-commands)
- [Handling Commands](https://discordjs.guide/creating-your-bot/command-handling.html#command-handling)

## 👋 Support

If you have found an issue with using this command handler example or have any suggestions? Feel free to send an [issue](https://github.com/youenPlusquellec/jk_bot/issues). I'll be happy to help and take a look!

## ❤️ Thanks

The project was created on NTMNathan [Template](https://github.com/NTMNathan/djs-command-handler). Big up to him ❤️

Feel free to donating [here](https://buymeacoffee.com/ntmnathan) for his work on Buy me a coffee.

Also, don't forget to star the repo! 😋

## ⚖️ License

The `MIT` license applies to this repository. Please see the `LICENSE` file to learn more.
