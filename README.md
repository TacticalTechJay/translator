<div align="center">
    <h1>Translator Discord Bot</h2>
    <h2>A meant-to-be simple translator bot that uses <a href="https://github.com/LibreTranslate/LibreTranslate">LibreTranslate</a> API<h2>
</div>
 
# Config

This bot is configurable through environmental variables that can be defined like so:

```
PREFIX=! node index.js
```

These are the following variables that you are required to set:

|Config  | Default |Description|
|--------|---------|-----------|
|`TLURL` |"localhost"|Base URL to your own [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate)|
|`PORT`  |   "80"  |Used for a translator api *if* it is hosted locally on your computer. **Used with default `TLURL` and if it was not previously defined.**|
|`PREFIX`|   "!"   |The prefix used to interact with the discord bot.|
|`DISCORD_TOKEN`|""|A discord token for running a discord bot. Refer [here](https://discord.com/developers/docs/intro#bots-and-apps). **Not an optional variable.**|
|`DATABASE_URL`|""|A database URL used for [Prisma](https://prisma.io) to store a guild's config. **Not an optional variable.**|

# Installing and Running

Hold onto your environmental variables, there are some prerequisites to using this discord bot.

- A selfhosted [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) API
- NodeJS
- NPM
- A database that Prisma [supports](https://www.prisma.io/docs/reference/database-reference/supported-databases).
- A Discord Account.

Everything checks out? Ok, now to get with setting this mayhem up!

1. Initial setup

    Install all dependencies
    ```shell
    npm install
    ```

    Generate Prisma Client
    ```shell
    npx prisma generate
    ```
2. Prepare your environemtnal variables!

    Run the bot!
    ```shell
    TLURL="https://libretranslate.com" PREFIX="tl!" DISCORD_TOKEN="totallylegittoken" DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public" node index.js
    ```