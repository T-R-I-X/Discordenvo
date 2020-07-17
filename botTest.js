//Requiring Packages
const Discord = require('discord.js');
const eco = require('../index');
 
//Create the bot client
const client = new Discord.Client();
 
//Set the prefix and token of the bot.
const settings = {
  prefix: ';',
  token: 'NjEzMTQzMzE4OTA1NDg3Mzcw.XxEXxA.b8t2Bm7WYUC2jxTCuRPO1F-SUcA'
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
    var output = await eco.fetchBalance(message.author.id)
    message.channel.send(`Hey ${message.author.tag}! You own ${output.balance} coins.`);
  }
 
  if (command === 'daily') {
 
    var output = await eco.ecoDaily(message.author.id, 100)
    //output.updated will tell you if the user already claimed his/her daily yes or no.
 
    if (output.updated) {
 
      message.reply(`You earned your daily of ${output.earned}.`);
 
    } else {
      message.channel.send(`Sorry, you already claimed your daily coins!\nBut no worries, over ${output.timetowait} you can daily again!`)
    }
 
  }
 
  if (command === 'resetdaily') {
 
    var output = await eco.resetDaily(message.author.id)
 
    message.reply(output.reset) //It wil send 'Daily Reset.'
 
  }
 
  if (command === 'leaderboard') {
 
    //If you use discord-economy guild based you can use the filter() function to only allow the database within your guild
    //(message.author.id + message.guild.id) can be your way to store guild based id's
    //filter: x => x.userid.endsWith(message.guild.id)
 
    //If you put a mention behind the command it searches for the mentioned user in database and tells the position.
    if (message.mentions.users.first()) {
 
      var output = await eco.ecoLeaderboard({
        filter: x => x.balance > 50,
        search: message.mentions.users.first().id
      })
      message.channel.send(`The user ${message.mentions.users.first().tag} is number ${output} on my leaderboard!`);
 
    } else {
 
      eco.ecoLeaderboard({
        limit: 3, //Only takes top 3 ( Totally Optional )
        filter: x => x.balance > 50 //Only allows people with more than 100 balance ( Totally Optional )
      }).then(async users => { //make sure it is async
 
        if (users[0]) var firstplace = await client.users.cache.get(users[0].userid) //Searches for the user object in discord for first place
        if (users[1]) var secondplace = await client.users.cache.get(users[1].userid) //Searches for the user object in discord for second place
        if (users[2]) var thirdplace = await client.users.cache.get(users[2].userid) //Searches for the user object in discord for third place
 
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
 
    var output = await eco.fetchBalance(message.author.id)
    if (output.balance < amount) return message.reply('You have less coins than the amount you want to transfer!')
 
    var transfer = await eco.ecoTransfer(message.author.id, user.id, amount)
    message.reply(`Transfering coins succesfully done!\nBalance from ${message.author.tag}: ${transfer.fromuserId}\nBalance from ${user.tag}: ${transfer.touserId}`);
  }
 
  if (command === 'coinflip') {
 
    var flip = args[0] //Heads or Tails
    var amount = args[1] //Coins to gamble
 
    if (!flip || !['heads', 'tails'].includes(flip)) return message.reply('Pls specify the flip, either heads or tails!')
    if (!amount) return message.reply('Specify the amount you want to gamble!')
 
    var output = await eco.fetchBalance(message.author.id)
    if (output.balance < amount) return message.reply('You have less coins than the amount you want to gamble!')
 
    var gamble = await eco.coinFlip(message.author.id, flip, amount).catch(console.error)
    message.reply(`You ${gamble.output}! New balance: ${gamble.newBalance}`)
 
  }
 
  if (command === 'dice') {
 
    var roll = args[0] //Should be number between 1 and 6
    var amount = args[1] //Coins to gamble
 
    if (!roll || ![1, 2, 3, 4, 5, 6].includes(parseInt(roll))) return message.reply('Specify the roll, it should be a number between 1-6')
    if (!amount) return message.reply('Specify the amount you want to gamble!')
 
    var output = eco.fetchBalance(message.author.id)
    if (output.balance < amount) return message.reply('You have less coins than the amount you want to gamble!')
 
    var gamble = await eco.ecoDice(message.author.id, roll, amount).catch(console.error)
    message.reply(`The dice rolled ${gamble.diceOutput}. So you ${gamble.output}! New balance: ${gamble.newBalance}`)
 
  }
 
  if (command == 'delete') { //You want to make this command admin only!
 
    var user = message.mentions.users.first()
    if (!user) return message.reply('Pls, Specify a user I have to delete in my database!')
 
    if (!message.guild.me.hasPermission(`ADMINISTRATION`)) return message.reply('You need to be admin to execute this command!')
 
    var output = await eco.ecoDelete(user.id)
    if (output.deleted == true) return message.reply('Succesfully deleted the user out of the database!')
 
    message.reply('Error: Could not find the user in database.')
 
  }
 
  if (command === 'work') { //I made 2 examples for this command! Both versions will work!
    var output = await eco.ecoWork(message.author.id)
    //50% chance to fail and earn nothing. You earn between 1-100 coins. And you get one out of 20 random jobs.
    if (output.earned == 0) return message.reply('Aww, you did not do your job well so you earned nothing!')
    message.channel.send(`${message.author.username}
You worked as a \` ${output.job} \` and earned :money_with_wings: ${output.earned}
You now own :money_with_wings: ${output.newBalance}`)
 
 
    var output = await eco.ecoWork(message.author.id, {
      failurerate: 10,
      money: Math.floor(Math.random() * 500),
      jobs: ['cashier', 'shopkeeper']
    })
    //10% chance to fail and earn nothing. You earn between 1-500 coins. And you get one of those 3 random jobs.
    if (output.earned == 0) return message.reply('Aww, you did not do your job well so you earned nothing!')
 
    message.channel.send(`${message.author.username}
    You worked as a \` ${output.job} \` and earned :money_with_wings: ${output.earned}
    You now own :money_with_wings: ${output.newBalance}`)
  }

  if (command === 'slots') {
    var user = message.author.id
    var input = args[0]
    var balance = eco.fetchBalance(user).balance
 
    if(input > balance) {
        message.reply('nono')
    } else {
    var output = await eco.ecoSlots(user, input, {Rolls: 3, Emojis: ['🍎','🍒','🍉']})
 
    if(output.output == 'lost') {
    message.channel.send(`
    __You Lost!__
 
    -----------------
   ${output.slotArray.map(e => e).join(' ')} <
    -----------------
    
    `)
    } else {
    message.channel.send(`
    __You Won!__
 
    -----------------
   ${console.log(output.slotArray)} <
    -----------------
    
    `)
    }
    }
  }
 
});
 
//Your secret token to log the bot in. (never show this to anyone!)
client.login(settings.token)