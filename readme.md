<div align="center">
  <br />
  <br />
  <p>
    <a href="https://discord.gg/Ym5BnJU"><img src="https://img.shields.io/badge/online-5-GREEN" alt="Discord server"/></a>
    <a href="https://www.npmjs.com/package/discordenvo"><img src="https://img.shields.io/npm/v/discordenvo.svg" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/discordenvo"><img src="https://img.shields.io/npm/dt/discordenvo.svg" alt="NPM downloads" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/discordenvo/"><img src="https://nodei.co/npm/discordenvo.png?downloads=true&stars=true" alt="NPM info" /></a>
  </p>
</div>

## Installation

```js
$ npm install --save discordevo
```

### Required packages

-   [sequelize](https://www.npmjs.com/package/sequelize) the DB wrapper of sqlite3 of this project (`npm install --save sequelize`)
-   [sqlite3](https://www.npmjs.com/package/sqlite3) Core DB (`npm install --save sqlite3`)

### Optional

-   [discord.js](https://www.npmjs.com/package/discord.js) - (`npm install --save discord.js`)
-   [discord.js-commando](https://www.npmjs.com/package/discord.js-commando) - (`npm install --save discord.js-commando`)
-   [eris](https://www.npmjs.com/package/eris) - (`npm install --save eris`)

## ChangeLog
- [1.0.0](https://www.npmjs.com/package/discordenvo/v/1.0.0) Package was made -- made daily cooldown from when it was used until 12am -- added slots function -- fixed mispell "SubstractFromBalance" to SubtractFromBalance
- [1.0.1](https://www.npmjs.com/package/discordenvo/v/1.0.1) Added Readme.md
- [1.0.2](https://www.npmjs.com/package/discordenvo/v/1.0.2) Fixed some bugs hopefully 
- [1.0.3](https://www.npmjs.com/package/discordenvo/v/1.0.3) Added slots function again 
- [1.0.4](https://www.npmjs.com/package/discordenvo/v/1.0.4) Mispells fixed
- [1.0.5](https://www.npmjs.com/package/discordenvo/v/1.0.5) Exm bot updated and bugs fixed
- [1.0.6](https://www.npmjs.com/package/discordenvo/v/1.0.6) Made slots look better and have more out comes -- fixed readme
- [1.0.7](https://www.npmjs.com/package/discordenvo/v/1.0.7) Fixed bug
- [1.0.8](https://www.npmjs.com/package/discordenvo/v/1.0.8) Fixed random error -- added slots function into readme
- [1.0.9](https://www.npmjs.com/package/discordenvo/v/1.0.9) Changed SubstractFromBalance to SubtractFromBalance
- [1.1.0](https://www.npmjs.com/package/discordenvo/v/1.1.0) Added to slots function, it looks better, and more outputs, output1 = what you rolled, output2 = what you almost rolled, output3 = what you almost rolled -- Added to slots function, Imput is what you want the user to earn this saves you from writing more code :) -- check readme for more information
- [1.1.0](https://www.npmjs.com/package/discordenvo/v/1.1.1) Added to slots function check readme for information -- fixed Subtract function -- other misc stuff

**SetBalance**

```js
/**
 * @param {string} [UserID] - Somebody's discord user ID.
 * @param {string} [toSet] - How much money you want the user to have.
 */
 
var eco = require('discord-economy')
eco.SetBalance(UserID, toSet)
 
/**
Expected Promise Output
{userid, balance}
 */
```

**AddToBalance**

```js
/**
 * @param {string} [UserID] - Somebody's discord user ID.
 * @param {integer} [toAdd] - How much money you want to add.
 */
 
var eco = require('discord-economy')
eco.AddToBalance(UserID, toAdd)
 
/**
Expected Promise Output
{userid, oldbalance, newbalance}
 */
```

**SubtractFromBalance**

```js
/**
 * @param {string} [UserID] - Somebody's discord user ID.
 * @param {integer} [toSubtract] - How much money you want to substract.
 */
 
var eco = require('discord-economy')
eco.SubstractFromBalance(UserID, toSubtract)
 
/**
Expected Promise Output
{userid, oldbalance, newbalance}
 */
```

**FetchBalance**

```js
/**
 * @param {string} [UserID] - Somebody's discord user ID.
 */
 
var eco = require('discord-economy')
eco.FetchBalance(UserID)
 
/**
Expected Promise Output
{userid, balance}
 */
```

**Leaderboard**

```js
/**
 * @param {Object} data - The data you want to attach to the function.
  All keys in this object are optional.
 * @param {integer} data.limit - Limit how much users to fetch.
 * @param {string} data.search - Search the placement of a user in leaderboard.
 */
 
var eco = require('discord-economy')
eco.Leaderboard({limit: NUMBER, search: 'UserID'})
 
/**
Expected Promise Output without data.search
[ {userid, balance}, {userid, balance}, {userid, balance} ]
array[0] is the first place of the leaderboard. array[1] second etc.
 */
 
 /**
Expected Promise Output with data.search
{userid, balance}
 */
```

**Daily**

```js
/**
 * @param {string} [UserID] - Somebody's discord user ID.
 * @param {string} [Imput] - Cash you want added when daily is ran.
 */
 
var eco = require('discord-economy')
eco.Daily(UserID, Imput)
 
/**
Expected Promise Output
{userid, updated, earned, timetowait}
 */
```

**ResetDaily**

```js
/**
 * @param {string} [UserID] - Somebody's discord user ID.
 */
 
var eco = require('discord-economy')
eco.ResetDaily(UserID)
 
/**
Expected Promise Output
('Daily Reset.')
 */
```

**Transfer**

```js
/**
 * @param {string} FromUser - Somebody's discord user ID.
 * @param {string} ToUser - Somebody's discord user ID.
 * @param {integer} Amount - Amount of money to transfer.
 */
 
var eco = require('discord-economy')
eco.Transfer(FromUser, ToUser, Amount)
 
/**
Expected Promise Output
{FromUser, ToUser}
 */
```

**Coinflip**

```js
/**
* @param {string} [UserID] - Somebody's discord user ID.
* @param {string} [Flip] - Either tails or heads.
* @param {integer} [Input] - Amount of money to gamble.
 */
 
var eco = require('discord-economy')
eco.Coinflip(UserID, Flip, Input)
})
 
/**
Expected Promise Output
{userid, oldbalance, newbalance, output}
 */
```

**Dice**

```js
/**
* @param {string} [UserID] - Somebody's discord user ID.
* @param {integer} [Dice] - number between 1-6.
* @param {integer} [Input] - Amount of money to gamble.
 */
 
var eco = require('discord-economy')
eco.Dice(UserID, Dice, Input)
 
/**
Expected Promise Output
{userid, oldbalance, newbalance, guess, dice, output}
 */
```

**Delete**

```js
/**
 * @param {string} [UserID] - Somebody's discord user ID.
 */
var eco = require('discord-economy')
eco.Delete(UserID)
 
/**
Expected Promise Output
{deleted} 
 */
```

**Work**

```js
/**
 * @param {string} [UserID] - Somebody's discord user ID.
 
 * @param {Object} data - The data you want to attach to the function.
 All keys in this object are optional. They have a default fallback.
 * @param {integer} data.failurerate - FailureRate of Working. Default = 50%
 * @param {integer} data.money - How much money to gain with working.
 * @param {array} data.jobs - Array of jobs you can do.
 */
 
var eco = require('discord-economy')
eco.Work(UserID, {failurerate: 50, money: 100, jobs: ['cashier', 'gambler']})
 
/**
Expected Promise Output
{userid, earned, job, balance}
 */
```

**Slots**

```js
/**
 * @param {string} [UserID] - Somebody's discord user ID.
 * @param {interger} [imput] - How much they are betting.
 * @param {Object} data - The data you want to attach to the function.
 All keys in this object are optional. They have a default fallback.
 * @param {integer} data.Rolls - How many times you wanna roll the slot.
 * @param {array} data.Emojis - The emojis you want to have.
 */
 
var eco = require('discord-economy')
eco.Slots(UserID, imput, {Rolls: 3, Emojis: ['🍎','🍒','🍉']})
 
/**
Expected Promise Output
{oldbalance,newbalance,slots1,slots2,slots3,output}
 */
```

## Example Bot (discord.js)

```js
/*
If you want to make discord-economy guild based you have to use message.author.id + message.guild.id as ID for example:
eco.Daily(message.author.id + message.guild.id)
 
This will create an unique ID for each guild member
*/
 
 
//Requiring Packages
const Discord = require('discord.js'); //This can also be discord.js-commando or other node based packages!
const eco = require("./discordeco.js");
 
//Create the bot client
const client = new Discord.Client();
 
//Set the prefix and token of the bot.
const settings = {
  prefix: ';',
  token: 'YOURTOKEN'
}
 
//Whenever someone types a message this gets activated.
//(If you use 'await' in your functions make sure you put async here)
client.on('message', async message => {
 
  //This reads the first part of your message behind your prefix to see which command you want to use.
  var command = message.content.toLowerCase().slice(settings.prefix.length).split(' ')[0];
 
  //These are the arguments behind the commands.
  var args = message.content.split(' ').slice(1);
 
  //If the message does not start with your prefix return.
  //If the user that types a message is a bot account return.
  if (!message.content.startsWith(settings.prefix) || message.author.bot) return;
 
  if (command === 'balance') {
 
    var output = await eco.FetchBalance(message.author.id)
    message.channel.send(`Hey ${message.author.tag}! You own ${output.balance} coins.`);
  }
 
  if (command === 'daily') {
 
    var output = await eco.Daily(message.author.id, 100)
    //output.updated will tell you if the user already claimed his/her daily yes or no.
 
    if (output.updated) {
 
      message.reply(`You earned your daily of ${output.earned}.`);
 
    } else {
      message.channel.send(`Sorry, you already claimed your daily coins!\nBut no worries, over ${output.timetowait} you can daily again!`)
    }
 
  }
 
  if (command === 'resetdaily') {
 
    var output = await eco.ResetDaily(message.author.id)
 
    message.reply(output) //It wil send 'Daily Reset.'
 
  }
 
  if (command === 'leaderboard') {
 
    //If you use discord-economy guild based you can use the filter() function to only allow the database within your guild
    //(message.author.id + message.guild.id) can be your way to store guild based id's
    //filter: x => x.userid.endsWith(message.guild.id)
 
    //If you put a mention behind the command it searches for the mentioned user in database and tells the position.
    if (message.mentions.users.first()) {
 
      var output = await eco.Leaderboard({
        filter: x => x.balance > 50,
        search: message.mentions.users.first().id
      })
      message.channel.send(`The user ${message.mentions.users.first().tag} is number ${output} on my leaderboard!`);
 
    } else {
 
      eco.Leaderboard({
        limit: 3, //Only takes top 3 ( Totally Optional )
        filter: x => x.balance > 50 //Only allows people with more than 100 balance ( Totally Optional )
      }).then(async users => { //make sure it is async
 
        if (users[0]) var firstplace = await client.fetchUser(users[0].userid) //Searches for the user object in discord for first place
        if (users[1]) var secondplace = await client.fetchUser(users[1].userid) //Searches for the user object in discord for second place
        if (users[2]) var thirdplace = await client.fetchUser(users[2].userid) //Searches for the user object in discord for third place
 
        message.channel.send(`My leaderboard:
 
1 - ${firstplace && firstplace.tag || 'Nobody Yet'} : ${users[0] && users[0].balance || 'None'}
2 - ${secondplace && secondplace.tag || 'Nobody Yet'} : ${users[1] && users[1].balance || 'None'}
3 - ${thirdplace && thirdplace.tag || 'Nobody Yet'} : ${users[2] && users[2].balance || 'None'}`)
 
      })
 
    }
  }
 
  if (command === 'transfer') {
 
    var user = message.mentions.users.first()
    var amount = args[1]
 
    if (!user) return message.reply('Reply the user you want to send money to!')
    if (!amount) return message.reply('Specify the amount you want to pay!')
 
    var output = await eco.FetchBalance(message.author.id)
    if (output.balance < amount) return message.reply('You have less coins than the amount you want to transfer!')
 
    var transfer = await eco.Transfer(message.author.id, user.id, amount)
    message.reply(`Transfering coins succesfully done!\nBalance from ${message.author.tag}: ${transfer.FromUser}\nBalance from ${user.tag}: ${transfer.ToUser}`);
  }
 
  if (command === 'coinflip') {
 
    var flip = args[0] //Heads or Tails
    var amount = args[1] //Coins to gamble
 
    if (!flip || !['heads', 'tails'].includes(flip)) return message.reply('Pls specify the flip, either heads or tails!')
    if (!amount) return message.reply('Specify the amount you want to gamble!')
 
    var output = await eco.FetchBalance(message.author.id)
    if (output.balance < amount) return message.reply('You have less coins than the amount you want to gamble!')
 
    var gamble = await eco.Coinflip(message.author.id, flip, amount).catch(console.error)
    message.reply(`You ${gamble.output}! New balance: ${gamble.newbalance}`)
 
  }
 
  if (command === 'dice') {
 
    var roll = args[0] //Should be number between 1 and 6
    var amount = args[1] //Coins to gamble
 
    if (!roll || ![1, 2, 3, 4, 5, 6].includes(parseInt(roll))) return message.reply('Specify the roll, it should be a number between 1-6')
    if (!amount) return message.reply('Specify the amount you want to gamble!')
 
    var output = eco.FetchBalance(message.author.id)
    if (output.balance < amount) return message.reply('You have less coins than the amount you want to gamble!')
 
    var gamble = await eco.Dice(message.author.id, roll, amount).catch(console.error)
    message.reply(`The dice rolled ${gamble.dice}. So you ${gamble.output}! New balance: ${gamble.newbalance}`)
 
  }
 
  if (command == 'delete') { //You want to make this command admin only!
 
    var user = message.mentions.users.first()
    if (!user) return message.reply('Pls, Specify a user I have to delete in my database!')
 
    if (!message.guild.me.hasPermission(`ADMINISTRATION`)) return message.reply('You need to be admin to execute this command!')
 
    var output = await eco.Delete(user.id)
    if (output.deleted == true) return message.reply('Succesfully deleted the user out of the database!')
 
    message.reply('Error: Could not find the user in database.')
 
  }
 
  if (command === 'work') { //I made 2 examples for this command! Both versions will work!
 
    var output = await eco.Work(message.author.id)
    //50% chance to fail and earn nothing. You earn between 1-100 coins. And you get one out of 20 random jobs.
    if (output.earned == 0) return message.reply('Aww, you did not do your job well so you earned nothing!')
    message.channel.send(`${message.author.username}
You worked as a \` ${output.job} \` and earned :money_with_wings: ${output.earned}
You now own :money_with_wings: ${output.balance}`)
 
 
    var output = await eco.Work(message.author.id, {
      failurerate: 10,
      money: Math.floor(Math.random() * 500),
      jobs: ['cashier', 'shopkeeper']
    })
    //10% chance to fail and earn nothing. You earn between 1-500 coins. And you get one of those 3 random jobs.
    if (output.earned == 0) return message.reply('Aww, you did not do your job well so you earned nothing!')
 
    message.channel.send(`${message.author.username}
You worked as a \` ${output.job} \` and earned :money_with_wings: ${output.earned}
You now own :money_with_wings: ${output.balance}`)
 
  },
  if (command === 'slots') {
    var user = message.author.id
    var imput = args[0]
    var balance = eco.FetchBalance(user).balance
 
    if(imput > balance) {
        message.reply('nono')
    } else {
    var output = await eco.Slots(user, imput, {Rolls: 3, Emojis: ['🍎','🍒','🍉']})
 
    if(output.output == 'lost') {
    message.channel.send(`
    __You Lost!__

    -----------------
   ${output.slots1}  ${output.slots2} ${output.slots3} <
    -----------------
    
    `)
    } else {
    message.channel.send(`
    __You Won!__

    -----------------
   ${output.slots1} ${output.slots2} ${output.slots3} <
    -----------------
    
    `)
    }
    }
  }
 
});
 
//Your secret token to log the bot in. (never show this to anyone!)
client.login(settings.token)
```
