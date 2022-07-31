# Getting started : Launch and use JK Bot

## ⚙️ Setup

- Create a folder on your computer, then type the following console command to clone this repository.

```bash
git clone https://github.com/youenPlusquellec/jk_bot
```

- Create a Discord Application and name it.

![bot create](https://i.imgur.com/luHPTGL.png "Step 2")

- Rename `example.env` to `.env` and `example.config` to `config.js` and fill the required values from the Discord **Bot** Page. **Do not show anyone these!**

- Install Node.js v16.6 or higher by selecting the **Current** tab, and then **"OS Name" Installer**. [Click here](https://nodejs.org/en/download/current/) for the download page.

![nodejs](https://i.imgur.com/mtJcz5E.png "Step 4")

- Install all of the required NPM modules, and `Visual Studio C++ Build Tools` on Windows (if you have issues).

```bash
npm install
```

```bash
npm i -g --add-python-to-path --vs2015 --production windows-build-tools
```

- Create MariaDB database and fill a new database with every scripts from **database** folder

- Start the bot.

```bash
npm start
```

## ⌨️ Usage

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
