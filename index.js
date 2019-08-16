const Sequelize = require('sequelize');
const queuing = require("./queue.js");
require('sqlite3');
const dbQueue = new queuing();

const sequelize = new Sequelize('database', 'Hot123', '132435465768798', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  operatorsAliases: false,
  storage: 'database.sqlite',
});

const DB1 = sequelize.define('Economy', {
  userID: {
    type: Sequelize.STRING,
    unique: true,
  },
  balance: Sequelize.INTEGER,
  daily: Sequelize.INTEGER,
});

const DB2 = sequelize.define('Store', {
  guildID: {
    type: Sequelize.STRING,
    unique: true
  },
  //items: Sequelize.ARRAY(Sequelize.STRING),
 // price: Sequelize.ARRAY(Sequelize.INTEGER)
});

const DB3 = sequelize.define('Leveling', {
  userID: {
    type: Sequelize.STRING,
    unique: true,
  },
  xp: Sequelize.INTEGER,
  level: Sequelize.INTEGER
});

DB1.sync()
DB2.sync()
DB3.sync()

console.log(`(Discordenvo) loaded db`)

module.exports = {
//                             //
//┏━━━┓ ┏━━━┓ ┏━━━┓//
//┃┏━━┛ ┃┏━┓┃ ┃┏━┓┃//
//┃┗━━┓ ┃┃︱┗┛ ┃┃︱┃┃//
//┃┏━━┛ ┃┃︱┏┓ ┃┃︱┃┃//
//┃┗━━┓ ┃┗━┛┃ ┃┗━┛┃//
//┗━━━┛ ┗━━━┛ ┗━━━┛//
///////                   ///////    
////////                 ////////
/////////               /////////       
                               

SetBalance: function(UserID, toSet) {
  return dbQueue.addToQueue({
    "value": this._SetBalance.bind(this),
    "args": [UserID, toSet]
  });
},

_SetBalance: async function(UserID, toSet) {
  if (!UserID) throw new Error('SetBalance function is missing parameters!')
  if (!toSet && toSet != 0) throw new Error('SetBalance function is missing parameters!')
  if (!parseInt(toSet)) throw new Error('SetBalance function parameter toSet needs to be a number!')
  toSet = parseInt(toSet)

  const SetBalanceProm = new Promise(async (resolve, error) => {

    const Info = await DB1.update({
      balance: toSet
    }, {
      where: {
        userID: UserID
      }
    });
    if (Info > 0) {
      return resolve({
        userid: UserID,
        balance: toSet
      })
    } else {

      try {
        const Info2 = await DB1.create({
          userID: UserID,
          balance: 0,
          daily: 0
        });
        return resolve({
          userid: UserID,
          balance: toSet
        })
      } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
          return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
        }
        return error(e)
      }

    } 

  });
  return SetBalanceProm;
},

AddToBalance: function(UserID, toAdd) {
  return dbQueue.addToQueue({
    "value": this._AddToBalance.bind(this),
    "args": [UserID, toAdd]
  });
},

_AddToBalance: async function(UserID, toAdd) {
  if (!UserID) throw new Error('AddToBalance function is missing parameters!')
  if (!toAdd && toAdd != 0) throw new Error('AddToBalance function is missing parameters!')
  if (!parseInt(toAdd)) throw new Error('AddToBalance function parameter toAdd needs to be a number!')
  toAdd = parseInt(toAdd)

  const AddToBalanceProm = new Promise(async (resolve, error) => {

    const Info = await DB1.findOne({
      where: {
        userID: UserID
      }
    });
    if (Info) {

      const Info2 = await DB1.update({
        balance: Info.balance + toAdd
      }, {
        where: {
          userID: UserID
        }
      });
      if (Info2 > 0) {
        return resolve({
          userid: UserID,
          oldbalance: Info.balance,
          newbalance: Info.balance + toAdd,
        })
      }
      return error('Something went wrong in function AddToBalance')
    }

    return resolve('User has no record in database!')

  });
  return AddToBalanceProm;
},

SubtractFromBalance: function(UserID, toSubtract) {
  return dbQueue.addToQueue({
    "value": this._SubtractFromBalance.bind(this),
    "args": [UserID, toSubtract]
  });
},

_SubtractFromBalance: async function(UserID, toSubtract) {
  if (!UserID) throw new Error('SubtractFromBalance function is missing parameters!')
  if (!toSubtract && toSubtract != 0) throw new Error('SubtractFromBalance function is missing parameters!')
  if (!parseInt(toSubtract)) throw new Error('SubtractFromBalance function parameter toSubtract needs to be a number!')
  toSubtract = parseInt(toSubtract)

  const SubtractFromBalanceProm = new Promise(async (resolve, error) => {

    const Info = await DB1.findOne({
      where: {
        userID: UserID
      }
    });
    if (Info) {

      const Info2 = await DB1.update({
        balance: Info.balance - toSubtract
      }, {
        where: {
          userID: UserID
        }
      });
      if (Info2 > 0) {
        return resolve({
          userid: UserID,
          oldbalance: Info.balance,
          newbalance: Info.balance - toSubtract
        })
      }
      return error('Something went wrong in function SubtractFromBalance')
    }

    return resolve('User has no record in database!')

  });
  return SubtractFromBalanceProm;
},

FetchBalance: function(UserID) {
  return dbQueue.addToQueue({
    "value": this._FetchBalance.bind(this),
    "args": [UserID]
  });
},

_FetchBalance: async function(UserID) {
  if (!UserID) throw new Error('FetchBalance function is missing parameters!')
  const FetchBalanceProm = new Promise(async (resolve, error) => {

    const Info = await DB.findOne({
      where: {
        userID: UserID
      }
    });
    if (Info) {
      return resolve({
        userid: Info.userID,
        balance: Info.balance
      })
    }
    try {
      const Info2 = await DB.create({
        userID: UserID,
        balance: 0,
        daily: 0
      });
      return resolve({
        userid: UserID,
        balance: 0
      })
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
      }
      return error(e)
    }
  });
  return FetchBalanceProm;
},

EcoLeaderboard: function(data = {}) {
  return dbQueue.addToQueue({
    "value": this._EcoLeaderboard.bind(this),
    "args": [data]
  });
},

_EcoLeaderboard: async function(data) {
  if (data.limit && !parseInt(data.limit)) throw new Error('Leaderboard function parameter obj.limit needs to be a number!')
  if (data.limit) data.limit = parseInt(data.limit)
  if (data.filter && !data.filter instanceof Function) throw new Error('Leaderboard function parameter obj.filter needs to be a function!')
  if (!data.filter) data.filter = x => x;
  const EcoLeaderboardProm = new Promise(async (resolve, error) => {

    if (data.search) {

      const Info = await DB1.findAll({
        where: {
          balance: {
            [Sequelize.Op.gt]: 0
          }
        }
      })

      let output = Info.map(l => l.userID + ' ' + l.balance).sort((a, b) => b.split(' ')[1] - a.split(' ')[1]).map(l => new Object({
        userid: l.split(' ')[0],
        balance: l.split(' ')[1]
      })).filter(data.filter).slice(0, data.limit).findIndex(l => l.userid == data.search)

      if (output == -1) return resolve('Not found')
      return resolve(output + 1)

    } else {

      const Info = await DB1.findAll({
        where: {
          balance: {
            [Sequelize.Op.gt]: 0
          }
        }
      })

      let output = Info.map(l => l.userID + ' ' + l.balance).sort((a, b) => b.split(' ')[1] - a.split(' ')[1]).map(l => new Object({
        userid: l.split(' ')[0],
        balance: l.split(' ')[1]
      })).filter(data.filter).slice(0, data.limit)

      return resolve(output)

    }

  });
  return EcoLeaderboardProm;
},

Daily: function(UserID, Imput) {
  return dbQueue.addToQueue({
    "value": this._Daily.bind(this),
    "args": [UserID, Imput]
  });
},

_Daily: async function(UserID, Imput) {
  if (!UserID) throw new Error('Daily function is missing UserID!')
  if (!parseInt(Imput)) throw new Error('Daily function is missing Imput or Imput needs to be a number!')
  Imput = parseInt(Imput)

  const DailyProm = new Promise(async (resolve, error) => {

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


    const Info = await DB.findOne({
      where: {
        userID: UserID
      }
    });
    if (Info) {

      if (Info.daily != today) {
        const Info2 = await DB1.update({
          balance: Info.balance + Imput,
          daily: today
        }, {
          where: {
            userID: UserID
          }
        });
        if (Info2 > 0) {
          return resolve({
            userid: Info.userID,
            balance: Info.balance + Imput,
            earned: Imput,
            updated: true
          })
        }
      } else {
        return resolve({
          userid: Info.userID,
          updated: false,
          timetowait: days + "d " + hours + "h " + minutes + "m " + seconds + "s"
        })
      }
    }
    try {
      const Info3 = await DB1.create({
        userID: UserID,
        balance: 0,
        daily: today
      });
      return resolve({
        userid: UserID,
        updated: true
      })
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
      }
      return error(e)
    }
  });
  return DailyProm;
},

Transfer: function(FromUser, ToUser, Amount) {
  return dbQueue.addToQueue({
    "value": this._Transfer.bind(this),
    "args": [FromUser, ToUser, Amount]
  });
},

_Transfer: async function(FromUser, ToUser, Amount) {
  if (!FromUser || !ToUser || !Amount) throw new Error('Transfer function is missing parameters!')
  if (!parseInt(Amount)) throw new Error('Transfer function parameter Amount needs to be a number!')
  Amount = parseInt(Amount)

  const TransferProm = new Promise(async (resolve, error) => {

    const Info = await DB1.findOne({
      where: {
        userID: FromUser
      }
    });
    if (Info) {

      if (Info.balance < Amount) {
        throw new Error('The user that transfers has insufficient funds.')
        return
      }

      const Info6 = await DB1.update({
        balance: Info.balance - Amount
      }, {
        where: {
          userID: FromUser
        }
      });

      const Info2 = await DB1.findOne({
        where: {
          userID: ToUser
        }
      });
      if (Info2) {

        const Info3 = await DB1.update({
          balance: Info2.balance + Amount
        }, {
          where: {
            userID: ToUser
          }
        });
        if (Info3 > 0) {

          return resolve({
            FromUser: Info.balance - Amount,
            ToUser: Info2.balance + Amount
          })
        }
        return error('Something went wrong in function Transfer')
      } else {
        try {
          const Info5 = await DB1.create({
            userID: ToUser,
            balance: Amount,
            daily: 0
          });
          return resolve({
            FromUser: Info.balance - Amount,
            ToUser: Amount
          })
        } catch (e) {
          if (e.name === 'SequelizeUniqueConstraintError') {
            return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
          }
          return error(e)
        }
      }
    }
    throw new Error('The user that transfers has insufficient funds.')
  });
  return TransferProm;
},

Coinflip: function(UserID, Flip, Input) {
  return dbQueue.addToQueue({
    "value": this._Coinflip.bind(this),
    "args": [UserID, Flip, Input]
  });
},

_Coinflip: async function(UserID, Flip, Input) {
  Flip = Flip.toLowerCase()
  if (!UserID || !Flip || !Input) throw new Error('Coinflip function is missing parameters!')
  if (Flip != 'tails' && Flip != 'heads') throw new Error('Coinflip second parameter needs to be [tails  or heads]')
  if (!parseInt(Input)) throw new Error('Coinflip function parameter Input needs to be a number!')
  if (parseInt(Input) < 0) throw new Error('Coinflip function parameter Input needs to be greater than 0')
  Input = parseInt(Input)

  const CoinflipProm = new Promise(async (resolve, error) => {

    const random = ['tails', 'heads']
    const output = random[Math.floor(Math.random() * 2)]

    const Info = await DB1.findOne({
      where: {
        userID: UserID
      }
    });
    if (Info) {

      if (Info.balance < Input) {
        throw new Error('The user has insufficient funds.')
        return
      }

      if (Flip != output) {
        const Info2 = await DB1.update({
          balance: Info.balance - Input
        }, {
          where: {
            userID: UserID
          }
        });
        if (Info2 > 0) {
          return resolve({
            userid: UserID,
            oldbalance: Info.balance,
            newbalance: Info.balance - Input,
            output: 'lost'
          })
        }
        return error('Something went wrong in function Coinflip')
      } else {
        const Info3 = await DB1.update({
          balance: Info.balance + Input
        }, {
          where: {
            userID: UserID
          }
        });
        if (Info3 > 0) {

          return resolve({
            userid: UserID,
            oldbalance: Info.balance,
            newbalance: Info.balance + Input,
            output: 'won'
          })
        }
        return error('Something went wrong in function Coinflip')
      }

    }
    throw new Error('The user has insufficient funds.')

  });
  return CoinflipProm;
},

Dice: function(UserID, DiceNumber, Input) {
  return dbQueue.addToQueue({
    "value": this._Dice.bind(this),
    "args": [UserID, DiceNumber, Input]
  });
},

_Dice: async function(UserID, DiceNumber, Input) {
  if (!UserID || !DiceNumber || !Input) throw new Error('Dice function is missing parameters!')
  if (!parseInt(DiceNumber) || ![1, 2, 3, 4, 5, 6].includes(parseInt(DiceNumber))) throw new Error('The Dice number should be 1-6')
  if (!parseInt(Input)) throw new Error('Dice function parameter Input needs to be a number!')
  if (parseInt(Input) < 0) throw new Error('Dice function parameter Input needs to be greater than 0')
  Input = parseInt(Input)
  DiceNumber = parseInt(DiceNumber)

  const DiceProm = new Promise(async (resolve, error) => {

    const output = Math.floor((Math.random() * 6) + 1);

    const Info = await DB1.findOne({
      where: {
        userID: UserID
      }
    });
    if (Info) {

      if (Info.balance < Input) {
        throw new Error('The user has insufficient funds.')
        return
      }

      if (DiceNumber != output) {
        const Info2 = await DB1.update({
          balance: Info.balance - Input
        }, {
          where: {
            userID: UserID
          }
        });
        if (Info2 > 0) {
          return resolve({
            userid: UserID,
            oldbalance: Info.balance,
            newbalance: Info.balance - Input,
            guess: DiceNumber,
            dice: output,
            output: 'lost'
          })
        }
        return error('Something went wrong in function Dice')
      } else {
        const Info3 = await DB1.update({
          balance: Info.balance + Input
        }, {
          where: {
            userID: UserID
          }
        });
        if (Info3 > 0) {

          return resolve({
            userid: UserID,
            oldbalance: Info.balance,
            newbalance: Info.balance + Input,
            guess: DiceNumber,
            dice: output,
            output: 'won'
          })
        }
        return error('Something went wrong in function Dice')
      }

    }
    throw new Error('The user has insufficient funds.')

  });
  return DiceProm;
},

EcoDelete: function(UserID) {
  return dbQueue.addToQueue({
    "value": this._EcoDelete.bind(this),
    "args": [UserID]
  });
},

_EcoDelete: async function(UserID) {
  if (!UserID) throw new Error('Delete function is missing parameters!')

  const EcoDeleteProm = new Promise(async (resolve, error) => {

    const Info = await DB1.destroy({
      where: {
        userID: UserID
      }
    });
    if (Info) {
      return resolve({
        deleted: true
      })
    }

    return resolve({
      deleted: false
    })

  });
  return EcoDeleteProm;
},

ResetDaily: function(UserID) {
  return dbQueue.addToQueue({
    "value": this._ResetDaily.bind(this),
    "args": [UserID]
  });
},

_ResetDaily: async function(UserID) {
  if (!UserID) throw new Error('ResetDaily function is missing parameters!')

  const ResetDailyProm = new Promise(async (resolve, error) => {

    const Info = await DB1.update({
      daily: 0
    }, {
      where: {
        userID: UserID
      }
    });
    if (Info > 0) {
      return resolve(`Daily Reset.`);
    } else {

      try {
        const Info2 = await DB1.create({
          userID: UserID,
          balance: 0,
          daily: 0
        });
        return resolve(`Daily Reset.`)
      } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
          return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
        }
        return error(e)
      }

    }

  });
  return ResetDailyProm;
},

Work: function(UserID, data = {}) {
  return dbQueue.addToQueue({
    "value": this._Work.bind(this),
    "args": [UserID, data]
  });
},

_Work: async function(UserID, data = {}) {
  if (!UserID) throw new Error('Work function is missing parameters!')
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

  const WorkProm = new Promise(async (resolve, error) => {

    const Info = await DB1.findOne({
      where: {
        userID: UserID
      }
    });
    if (Info) {

      if (success) {

        const Info2 = await DB1.update({
          balance: Info.balance + data.money
        }, {
          where: {
            userID: UserID
          }
        });

        if (Info2 > 0) {
          return resolve({
            userid: Info.userID,
            earned: data.money,
            job: data.jobs[Math.floor(Math.random() * data.jobs.length)],
            balance: Info.balance + data.money
          })
        }

      } else {
        return resolve({
          userid: Info.userID,
          earned: 0,
          job: data.jobs[Math.floor(Math.random() * data.jobs.length)],
          balance: Info.balance
        })
      }

    }

    try {
      if (!success) data.money = 0;

      const Info3 = await DB1.create({
        userID: UserID,
        balance: data.money,
        daily: 0
      });
      return resolve({
        userid: UserID,
        earned: data.money,
        job: data.jobs[Math.floor(Math.random() * data.jobs.length)],
        balance: data.money
      })
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
      }
      return error(e)
    }
  });
  return WorkProm;
},

Slots: function(UserID, Input, data = {}) {
  return dbQueue.addToQueue({
    "value": this._Slots.bind(this),
    "args": [UserID, Input, data]
  });
},
 
_Slots: async function(UserID, Input, data) {
  if (!UserID || !Input) throw new Error('Slots function is missing parameters!')
  if (data.Rolls && !parseInt(data.Rolls)) throw new Error('Slots function parameter data.Rolls needs to be a number!')
  if (data.Emojis && !Array.isArray(data.Emojis)) throw new Error('Slots function parameter data.Emojis needs to be an array!')
  if (!parseInt(Input)) throw new Error('Slots function parameter Input needs to be a number!')
  if (!data.Rolls) data.Rolls = 3
  if (!data.Emojis) data.Emojis = ['🍎','🍒','🍉']
  if (parseInt(Input) < 0) throw new Error('Slots function parameter Input needs to be greater than 0')
  Input = parseInt(Input)



  const SlotsProm = new Promise(async (resolve, error) => {

    
   const Slot1 = data.Emojis[Math.floor(Math.random() * data.Emojis.length)]
   const Slot2 = data.Emojis[Math.floor(Math.random() * data.Emojis.length)]
   const Slot3 = data.Emojis[Math.floor(Math.random() * data.Emojis.length)]

    const Info = await DB1.findOne({
      where: {
        userID: UserID
      }
    });
    if (Info) {

      if (Info.balance < Input) {
        throw new Error('The user has insufficient funds.')
        return
      }

      if(Slot1 != Slot2 && Slot2 == Slot3 ) {
        const Info2 = await DB1.update({
          balance: Info.balance + Input
        }, {
          where: {
            userID: UserID
          }
        });
        if (Info2 > 0) {
          return resolve({
            userid: UserID,
            oldbalance: Info.balance,
            newbalance: Info.balance + Input,
            slots1: Slot1,
            slots2: Slot2,
            slots3: Slot3,
            output: 'won'
          })
        }
        return error('Something went wrong in function Slots')
      } else {
        if(Slot1 == Slot2 && Slot1 == Slot3 ) {
          const Info2 = await DB1.update({
            balance: Info.balance + Input
          }, {
            where: {
              userID: UserID
            }
          });
          if (Info2 > 0) {
            return resolve({
              userid: UserID,
              oldbalance: Info.balance,
              newbalance: Info.balance + Input,
              slots1: Slot1,
              slots2: Slot2,
              slots3: Slot3,
              output: 'won'
            })
          }
          return error('Something went wrong in function Slots')
        } else {
        const Info3 = await DB1.update({
          balance: Info.balance - Input
        }, {
          where: {
            userID: UserID
          }
        });
        if (Info3 > 0) {

          return resolve({
            userid: UserID,
            oldbalance: Info.balance,
            newbalance: Info.balance - Input,
            slots1: Slot1,
            slots2: Slot2,
            slots3: Slot3,
            output: 'lost'
          })
        }
        return error('Something went wrong in function Slots')
        }
      }
    }
    throw new Error('The user has insufficient funds.')
  });
  return SlotsProm;
},

//                                         //
//┏━━┓ ┏━┓︱┏┓ ┏┓︱︱┏┓ ┏━━━┓//
//┗┫┣┛ ┃┃┗┓┃┃ ┃┗┓┏┛┃ ┃┏━┓┃//
//︱┃┃︱ ┃┏┓┗┛┃ ┗┓┃┃┏┛ ┃┃︱┃┃//
//︱┃┃︱ ┃┃┗┓┃┃ ︱┃┗┛┃︱ ┃┃︱┃┃//
//┏┫┣┓ ┃┃︱┃┃┃ ︱┗┓┏┛︱ ┃┗━┛┃//
//┗━━┛ ┗┛︱┗━┛ ︱︱┗┛︱︱ ┗━━━┛//
///////                               ///////    
////////                             ////////
/////////                           /////////
/*FetchStore: function(GuildID) {
  return dbQueue.addToQueue({
    "value": this._FetchStore.bind(this),
    "args": [GuildID]
  });
},

_FetchStore: async function(GuildID) {
  if (!GuildID) throw new Error('FetchStore function is missing parameters!')
  const FetchStoreProm = new Promise(async (resolve, error) => {

    const Info = await DB2.findAll({
      where: {
        guildID: GuildID
      }
    });
    if (Info) {
      return resolve({
        guildid: Info.guildID,
        price:Info.price,
        items:Info.items
      })
    }
     try {
        const Info2 = await DB2.create({
        guildid: GuildID,
        price:(0),
        items:("")
      });

      return resolve({
        guildid: GuildID,
        price:"Nothing",
        items:"Nothing"
      })
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
      }
      return error(e)
    }
  });
  return FetchStoreProm;
},*/


//                                                   //
//┏┓︱︱︱ ┏━━━┓ ┏┓︱︱┏┓ ┏━━━┓ ┏┓︱︱︱//
//┃┃︱︱︱ ┃┏━━┛ ┃┗┓┏┛┃ ┃┏━━┛ ┃┃︱︱︱//
//┃┃︱︱︱ ┃┗━━┓ ┗┓┃┃┏┛ ┃┗━━┓ ┃┃︱︱︱//
//┃┃︱┏┓ ┃┏━━┛ ︱┃┗┛┃︱ ┃┏━━┛ ┃┃︱┏┓//
//┃┗━┛┃ ┃┗━━┓ ︱┗┓┏┛︱ ┃┗━━┓ ┃┗━┛┃//
//┗━━━┛ ┗━━━┛ ︱︱┗┛︱︱ ┗━━━┛ ┗━━━┛//
///////                                         ///////    
////////                                       ////////
/////////                                     /////////
SetXp: function(UserID, toSet) {
  return dbQueue.addToQueue({
    "value": this._SetXp.bind(this),
    "args": [UserID, toSet]
  });
},

_SetXp: async function(UserID, toSet) {
  if (!UserID || toSet == undefined) throw new Error('SetXpSetXp function is missing parameters!')
  if (!parseInt(toSet) && toSet != 0) throw new Error('SetXp function parameter toSet needs to be a number!')
  toSet = parseInt(toSet)

  const SetProm = new Promise(async (resolve, error) => {

    const Info = await DB3.update({
      xp: toSet
    }, {
      where: {
        userID: UserID
      }
    });
    if (Info > 0) {
      return resolve({
        userid: UserID,
        xp: toSet
      })
    } else {

      try {
        const Info2 = await DB3.create({
          userID: UserID,
          xp: 0
        });
        return resolve({
          userid: UserID,
          xp: toSet
        })
      } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
          return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
        }
        return error(e)
      }

    }

  });
  return SetProm;
},

SetLevel: function(UserID, toSet) {
  return dbQueue.addToQueue({
    "value": this._SetLevel.bind(this),
    "args": [UserID, toSet]
  });
},

_SetLevel: async function(UserID, toSet) {
  if (!UserID || toSet == undefined) throw new Error('SetLevel function is missing parameters!')
  if (!parseInt(toSet) && toSet != 0) throw new Error('SetLevel function parameter toSet needs to be a number!')
  toSet = parseInt(toSet)

  const SetProm = new Promise(async (resolve, error) => {

    const Info = await DB3.update({
      level: toSet
    }, {
      where: {
        userID: UserID
      }
    });
    if (Info > 0) {
      return resolve({
        userid: UserID,
        level: toSet
      })
    } else {

      try {
        const Info2 = await DB3.create({
          userID: UserID,
          level: 0
        });
        return resolve({
          userid: UserID,
          level: toSet
        })
      } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
          return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
        }
        return error(e)
      }

    }

  });
  return SetProm;
},

AddXp: function(UserID, toAdd) {
  return dbQueue.addToQueue({
    "value": this._AddXp.bind(this),
    "args": [UserID, toAdd]
  });
},

_AddXp: async function(UserID, toAdd) {
  if (!UserID || !toAdd) throw new Error('AddXp function is missing parameters!')
  if (!parseInt(toAdd)) throw new Error('AddXp function parameter toAdd needs to be a number!')
  toAdd = parseInt(toAdd)

  const AddProm = new Promise(async (resolve, error) => {

    const Info = await DB3.findOne({
      where: {
        userID: UserID
      }
    });
    if (Info) {

      const Info2 = await DB3.update({
        xp: Info.xp + toAdd
      }, {
        where: {
          userID: UserID
        }
      });
      if (Info2 > 0) {
        return resolve({
          userid: UserID,
          oldxp: Info.xp,
          newxp: Info.xp + toAdd,
        })
      }
      return error('Something went wrong in function AddXp')
    }

    return resolve('User has no record in database!')

  });
  return AddProm;
},

AddLevel: function(UserID, toAdd) {
  return dbQueue.addToQueue({
    "value": this._AddLevel.bind(this),
    "args": [UserID, toAdd]
  });
},

_AddLevel: async function(UserID, toAdd) {
  if (!UserID || !toAdd) throw new Error('AddLevel function is missing parameters!')
  if (!parseInt(toAdd)) throw new Error('AddLevel function parameter toAdd needs to be a number!')
  toAdd = parseInt(toAdd)

  const AddProm = new Promise(async (resolve, error) => {

    const Info = await DB3.findOne({
      where: {
        userID: UserID
      }
    });
    if (Info) {

      const Info2 = await DB3.update({
        level: Info.level + toAdd
      }, {
        where: {
          userID: UserID
        }
      });
      if (Info2 > 0) {
        return resolve({
          userid: UserID,
          oldlevel: Info.level,
          newlevel: Info.level + toAdd,
        })
      }
      return error('Something went wrong in function AddLevel')
    }

    return resolve('User has no record in database!')

  });
  return AddProm;
},

LevelDelete: function(UserID) {
  return dbQueue.addToQueue({
    "value": this._LevelDelete.bind(this),
    "args": [UserID]
  });
},

_LevelDelete: async function(UserID) {
  if (!UserID) throw new Error('LevelDelete function is missing parameters!')

  const LevelDeleteProm = new Promise(async (resolve, error) => {

    const Info = await DB3.destroy({
      where: {
        userID: UserID
      }
    });
    if (Info) {
      return resolve({
        deleted: true
      })
    }

    return resolve({
      deleted: false
    })

  });
  return LevelDeleteProm;
},

FetchLevel: function(UserID) {
  return dbQueue.addToQueue({
    "value": this._FetchLevel.bind(this),
    "args": [UserID]
  });
},

_FetchLevel: async function(UserID) {
  if (!UserID) throw new Error('FetchLevel function is missing parameters!')
  const FetchLevelProm = new Promise(async (resolve, error) => {

    const Info = await DB3.findOne({
      where: {
        userID: UserID
      }
    });
    if (Info) {
      return resolve({
        userid: Info.userID,
        xp: Info.xp,
        level: Info.level
      })
    }
    try {
      const Info2 = await DB3.create({
        userID: UserID,
        xp: 0,
        level: 0
      });
      return resolve({
        userid: UserID,
        xp: 0,
        level: 0
      })
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
      }
      return error(e)
    }
  });
  return FetchLevelProm;
},

LevelLeaderboard: function(data = {}) {
  return dbQueue.addToQueue({
    "value": this._LevelLeaderboard.bind(this),
    "args": [data]
  });
},

_LevelLeaderboard: async function(data) {
  if (data.limit && !parseInt(data.limit)) throw new Error('Leaderboard function parameter obj.limit needs to be a number!')
  if (data.limit) data.limit = parseInt(data.limit)
  if (data.filter && !data.filter instanceof Function) throw new Error('Leaderboard function parameter obj.filter needs to be a function!')
  if (!data.filter) data.filter = x => x;
  const LevelLeaderboardProm = new Promise(async (resolve, error) => {

    if (data.search) {

      const Info = await DB3.findAll({
        where: {
          xp: {
            [Sequelize.Op.gt]: 0
          },
          level: {
            [Sequelize.Op.gt]: 0
          }
        }
      })

      let output = Info.map(l => new Object({
        userid: l.userID,
        level: l.level,
        xp: l.xp
      })).sort((a, b) => {

        if (parseInt(b.level) > parseInt(a.level)) return 1;
        if (parseInt(b.level) == parseInt(a.level) && parseInt(b.xp) > parseInt(a.xp)) return 1;
        return -1;

      }).filter(data.filter).slice(0, data.limit).findIndex(l => l.userid == data.search)

      if (output == -1) return resolve('Not found')
      return resolve(output + 1)

    } else {

      const Info = await DB3.findAll({
        where: {
          xp: {
            [Sequelize.Op.gt]: 0
          },
          level: {
            [Sequelize.Op.gt]: 0
          }
        }
      })

      let output = Info.map(l => new Object({
        userid: l.userID,
        level: l.level,
        xp: l.xp
      })).sort((a, b) => {

        if (parseInt(b.level) > parseInt(a.level)) return 1;
        if (parseInt(b.level) == parseInt(a.level) && parseInt(b.xp) > parseInt(a.xp)) return 1;
        return -1;

      }).filter(data.filter).slice(0, data.limit)

      return resolve(output)

    }

  });
  return LevelLeaderboardProm;
},

LevelUp: function(UserID, data = {}) {
  return dbQueue.addToQueue({
    "value": this._LevelUp.bind(this),
    "args": [UserID, data]
  });
},

_LevelUp: async function(UserID, data) {
  if (!UserID) throw new Error('LevelUp function is missing parameters!')
  if (data.LevelsAdded && !parseInt(data.LevelsAdded)) throw new Error('LevelUp function LevelsAdded is not a number')
  if (data.XpNeeded && !parseInt(data.XpNeeded)) throw new Error('LevelUp function XpNeeded is not a number')
  if (data.XpGiven && !parseInt(data.XpGiven)) throw new Error('LevelUp function XpGiven is not a number')
  if (!data.LevelsAdded) data.LevelsAdded = 1
  if (!data.XpNeeded) data.XpNeeded = 100
  if (!data.XpGiven) data.XpGiven = 10
  const LevelUpProm = new Promise(async (resolve, error) => {

    const Info = await DB3.findOne({
      where: {
        userID: UserID
      }
    });
    if (Info) {
      const Update = await DB3.update({
        userID: UserID,
        xp: Info.xp + data.XpGiven
      })
      if (Info.xp === data.XpNeeded) {
      const Info = await DB3.update({
        userID: UserID,
        level: Info.level + data.LevelsAdded,
        xp: Info.xp - Info.xp
      });
      return resolve({
        userid: Info.userID,
        xp: Info.xp,
        level: Info.level
      })
    }
    }
    try {
      const Info2 = await DB3.create({
        userID: UserID,
        xp: 0 + data.XpGiven,
        level: 0
      });
      return resolve({
        userid: UserID,
        xp: 0 + data.XpGiven,
        level: 0
      })
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
      }
      return error(e)
    }
  });
  return LevelUpProm;
}
}