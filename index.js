const DB = require("./functions")

console.log(`════════════════Database Loaded═══════════════════════════════════════\n════════════════Support: https://discord.gg/Hc9rC8X═══════════════════`)

module.exports = {

  delete: async function(ID) {
    if (!ID) throw new Error('Delete function is missing parameters!')

    return new Promise(async (resolve, error) => {

      const Info = await DB.destroy(ID)

      return resolve({
        deleted: false
      })

    });
  },

  fetchBalance: async function(ID) {
    if (!ID) throw new Error('FetchBalance function is missing parameters!')
    return new Promise(async (resolve, error) => {

      const Info = await DB.fetch(ID)
      return resolve({
        userid: ID,
        balance: Info.balance
      })
    });
  },

  setBalance: async function(ID, toSet) {
    if (!ID) throw new Error('SetBalance function is missing parameters!')
    if (!toSet && toSet != 0) throw new Error('SetBalance function is missing parameters!')
    if (!parseInt(toSet)) throw new Error('SetBalance function parameter toSet needs to be a number!')

    return new Promise(async (resolve, error) => {

      const Info = await DB.update(ID, 'balance', parseInt(toSet))
      return resolve({
        userid: ID,
        balance: toSet
      });
    });
  },

  addToBalance: async function(ID, toAdd) {
    if (!ID) throw new Error('AddToBalance function is missing parameters!')
    if (!toAdd && toAdd != 0) throw new Error('AddToBalance function is missing parameters!')
    if (!parseInt(toAdd)) throw new Error('AddToBalance function parameter toAdd needs to be a number!')

    return new Promise(async (resolve, error) => {

      const Info = await DB.fetch(ID)
      const Output = await DB.update(ID, 'balance', Info.balance + parseInt(toAdd))

      return resolve({
        userid: ID,
        oldbalance: Info.balance,
        newbalance: Info.balance + parseInt(toAdd),
      })
    });
  },

  subtractFromBalance: async function(ID, toSubstract) {
    if (!ID) throw new Error('SubstractFromBalance function is missing parameters!')
    if (!toSubstract && toSubstract != 0) throw new Error('SubstractFromBalance function is missing parameters!')
    if (!parseInt(toSubstract)) throw new Error('SubstractFromBalance function parameter toSubstract needs to be a number!')

    return new Promise(async (resolve, error) => {

      const Info = await DB.fetch(ID)
      const Output = await DB.update(ID, 'balance', Info.balance - parseInt(toSubstract))

      return resolve({
        userid: ID,
        oldbalance: Info.balance,
        newbalance: Info.balance - parseInt(toSubstract),
      })
    });
  },

  daily: async function(ID) {
    if (!ID) throw new Error('Daily function is missing parameters!')
    return new Promise(async (resolve, error) => {

      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //Januari is 0;
      var yyyy = today.getFullYear();

      var now = new Date(`${mm} ${dd}, ${yyyy}`)
      var nextDay = now.setDate(now.getDate() + 1);

      var difference = nextDay - today.getTime();

      var days = Math.floor(difference / (1000 * 60 * 60 * 24));
      var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;
      today = mm + dd + yyyy;

      const Info = await DB.fetch(ID)
      const Cooldowns = JSON.parse(Info.cooldowns);
      if (Cooldowns.daily != today) {
        Cooldowns.daily = today;
        const Output = await DB.update(ID, 'cooldowns', JSON.stringify(Cooldowns))
        return resolve({
          userid: ID,
          updated: true,
          timetowait: 0
        })
      } else {
        return resolve({
          userid: Info.userID,
          updated: false,
          timetowait: days + "d " + hours + "h " + minutes + "m " + seconds + "s"
        })
      }

    });

  },

  resetDaily: async function(ID) {
    if (!ID) throw new Error('ResetDaily function is missing parameters!')

    return new Promise(async (resolve, error) => {

      const Info = await DB.fetch(ID)
      const Cooldowns = JSON.parse(Info.cooldowns);
      Cooldowns.daily = 0;
      const Output = await DB.update(ID, 'cooldowns', JSON.stringify(Cooldowns))
      return resolve(`Resetting daily done.`);

    });
  },

  transfer: async function(fromUser, toUser, amount) {
    if (!fromUser || !toUser || !amount) throw new Error('Transfer function is missing parameters!')
    if (!parseInt(amount)) throw new Error('Transfer function parameter Amount needs to be a number!')

    return new Promise(async (resolve, error) => {

      const Info1 = await DB.fetch(fromUser)
      if (Info1.balance < amount) throw new Error('The user that transfers has insufficient funds.')
      const Info2 = await DB.fetch(toUser)
      const Output1 = await DB.update(fromUser, 'balance', Info1.balance - parseInt(amount))
      const Output2 = await DB.update(toUser, 'balance', Info2.balance + parseInt(amount))

      return resolve({
        trader: {
          id: fromUser,
          balance: Output1.balance
        },
        reciever: {
          id: toUser,
          balance: Output2.balance
        }
      })

    });
  },

  leaderboard: async function(data = {}) {
    if (data.search && typeof data.search != 'string') throw new Error('leaderboard function parameter Search needs to be a STRING!')
    if (data.limit && !parseInt(data.limit)) throw new Error('Leaderboard function parameter obj.limit needs to be a number!')
    if (data.limit) data.limit = parseInt(data.limit)
    if (data.filter && !data.filter instanceof Function) throw new Error('Leaderboard function parameter obj.filter needs to be a function!')
    if (!data.filter) data.filter = x => x;
    if (!data.limit) data.limit = -1;
    if (data.search) data.search = data.search.toString()

    return new Promise(async (resolve, error) => {

      const Info = await DB.fetchAll(data)
      return resolve(Info)

    });
  },

  coinflip: async function(ID, flip, input) {
    flip = flip.toLowerCase()
    if (!ID || !flip || !input) throw new Error('Coinflip function is missing parameters!')
    if (!['tails', 'heads'].includes(flip)) throw new Error('Coinflip second parameter needs to be [tails  or heads]')
    if (!parseInt(input)) throw new Error('Coinflip function parameter Input needs to be a number!')

    return new Promise(async (resolve, error) => {

      const random = ['tails', 'heads'][Math.floor(Math.random() * 2)]

      const Info = await DB.fetch(ID)
      if (Info.balance < input) throw new Error('The user has insufficient funds.')

      if (flip != random) {
        const Output = await DB.update(ID, 'balance', Info.balance - parseInt(input))
        return resolve({
          userid: ID,
          oldbalance: Info.balance,
          newbalance: Output.balance,
          result: 'lost'
        })
      } else {
        const Output = await DB.update(ID, 'balance', Info.balance + parseInt(input))
        return resolve({
          userid: ID,
          oldbalance: Info.balance,
          newbalance: Output.balance,
          result: 'won'
        })
      }

    });
  },

  dice: async function(ID, diceNumber, input) {
    if (!ID || !diceNumber || !input) throw new Error('Dice function is missing parameters!')
    if (!parseInt(diceNumber) || ![1, 2, 3, 4, 5, 6].includes(parseInt(diceNumber))) throw new Error('The Dice number should be 1-6')
    if (!parseInt(input)) throw new Error('Dice function parameter Input needs to be a number!')

    return new Promise(async (resolve, error) => {

      const output = Math.floor((Math.random() * 6) + 1);

      const Info = await DB.fetch(ID)
      if (Info.balance < input) throw new Error('The user has insufficient funds.')

      if (parseInt(diceNumber) != output) {
        const Output = await DB.update(ID, 'balance', Info.balance - parseInt(input))
        return resolve({
          userid: ID,
          oldbalance: Info.balance,
          newbalance: Output.balance,
          guess: parseInt(diceNumber),
          dice: output,
          result: 'lost'
        })
      } else {
        const Output = await DB.update(ID, 'balance', Info.balance + parseInt(input))
        return resolve({
          userid: ID,
          oldbalance: Info.balance,
          newbalance: Output.balance,
          guess: parseInt(diceNumber),
          dice: output,
          result: 'won'
        })
      }
    });
  },

  work: async function(ID, data = {}) {
    if (!ID) throw new Error('Work function is missing parameters!')
    if (data.jobs && !Array.isArray(data.jobs)) throw new Error('Work function parameter data.jobs is not an array!')
    if (data.money && !parseInt(data.money)) throw new Error('Work function parameter data.money needs to be a number!')
    if (data.failurerate && !parseInt(data.failurerate)) throw new Error('Work function parameter data.failurerate needs to be a number!')
    if (data.failurerate) data.failurerate = parseInt(data.failurerate)
    if (data.failurerate && data.failurerate < 0 || data.failurerate > 100) throw new Error('Work function parameter data.failurerate needs to be a number! between 0-100')
    if (data.money) data.money = parseInt(data.money)

    if (!data.jobs) data.jobs = ["Miner", "Bartender", "Cashier", "Cleaner", "Drugdealer", "Assistant", "Nurse", "Cleaner", "Teacher", "Accountants", "Security Guard", "Sheriff", "Lawyer", "Dishwasher", "Electrician", "Singer", "Dancer"];
    if (!data.money) data.money = Math.floor(Math.random() * 101)
    if (!data.failurerate) data.failurerate = 50

    var success = true;

    var randomnumber = Math.random()
    if (randomnumber <= data.failurerate / 100) success = false;

    return new Promise(async (resolve, error) => {

      const Info = await DB.fetch(ID)

      if (success) {
        const Output = await DB.update(ID, 'balance', Info.balance + data.money)
        return resolve({
          userid: Info.userID,
          earned: data.money,
          job: data.jobs[Math.floor(Math.random() * data.jobs.length)],
          balance: Info.balance + data.money
        })
      } else {
        return resolve({
          userid: Info.userID,
          earned: 0,
          job: data.jobs[Math.floor(Math.random() * data.jobs.length)],
          balance: Info.balance
        })
      }

    });
  },

  Steal: async function(stealer, victim, data = {
    failurerate: 50,
    min: 0,
    max: 100
  }) {
    if (!FromUser || !ToUser || !Amount) throw new Error('Steal function is missing parameters!')
    if (!parseInt(Amount)) throw new Error('Steal function parameter Amount needs to be a number!')
    Amount = parseInt(Amount)

    var success = true;

    return new Promise(async (resolve, error) => {

      var randomnumber = Math.random()
      if (randomnumber <= failureRate / 100) success = false;

      const Info1 = await DB.fetch(stealer)
      if (Info1.balance < amount) return error('The user that you try to steal off has insufficient funds.')
      const Info2 = await DB.fetch(victim)

      const Output1 = await DB.update(stealer, 'balance', Info1.balance + parseInt(amount))
      const Output2 = await DB.update(victim, 'balance', Info2.balance - parseInt(amount))

    });
  }

}
