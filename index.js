const Sequelize = require("sequelize");
const queuing = require("./queue.js");
require("sqlite3");
const dbQueue = new queuing();

//-- Setting Database --\\
const sequelize = new Sequelize("database", "Hot123", "132435465768798", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  operatorsAliases: false,
  storage: "database.sqlite"
});

const DB = sequelize.define("Economy", {
  userID: {
    type: Sequelize.STRING,
    unique: true
  },
  balance: Sequelize.INTEGER,
  daily: Sequelize.INTEGER,
  lootboxes: Sequelize.INTEGER,
  weekly: Sequelize.INTEGER
});

DB.sync();
//

module.exports = {
  //-- Economy.SetBalance(UserID, Amount)
  SetBalance: function(UserID, toSet) {
    return dbQueue.addToQueue({
      value: this._SetBalance.bind(this),
      args: [UserID, toSet]
    });
  },

  _SetBalance: async function(UserID, toSet) {
    if (!UserID) throw new Error("SetBalance Error: missing UserID!");
    if (!toSet && toSet != 0)
      throw new Error("SetBalance Error: missing toSet!");
    if (!parseInt(toSet))
      throw new Error("SetBalance Error: toSet needs to be a number!");
    toSet = parseInt(toSet);

    const SetBalanceProm = new Promise(async (resolve, error) => {
      const Info = await DB.update(
        {
          balance: toSet
        },
        {
          where: {
            userID: UserID
          }
        }
      );
      if (Info > 0) {
        return resolve({
          userid: UserID,
          balance: toSet
        });
      } else {
        try {
          const Info2 = await DB.create({
            userID: UserID,
            balance: 0,
            daily: 0
          });
          return resolve({
            userid: UserID,
            balance: toSet
          });
        } catch (e) {
          if (e.name === "SequelizeUniqueConstraintError") {
            return resolve(
              `Duplicate Found, shouldn\'t happen in this function, check typo\'s`
            );
          }
          return error(e);
        }
      }
    });
    return SetBalanceProm;
  },
  //--

  //-- Economy.AddToBalance(UserID,Amount)
  AddBalance: function(UserID, toAdd) {
    return dbQueue.addToQueue({
      value: this._AddBalance.bind(this),
      args: [UserID, toAdd]
    });
  },

  _AddBalance: async function(UserID, toAdd) {
    if (!UserID) throw new Error("AddBalance Error: missing UserID!");
    if (!toAdd && toAdd != 0)
      throw new Error("AddBalance Error: missing toAdd!");
    if (!parseInt(toAdd))
      throw new Error("AddBalance Error: toAdd needs to be a number!");
    toAdd = parseInt(toAdd);

    const AddBalanceProm = new Promise(async (resolve, error) => {
      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        const Info2 = await DB.update(
          {
            balance: Info.balance + toAdd
          },
          {
            where: {
              userID: UserID
            }
          }
        );
        if (Info2 > 0) {
          return resolve({
            userid: UserID,
            oldbalance: Info.balance,
            newbalance: Info.balance + toAdd
          });
        }
        return error("AddBalance Error: something went wrong!");
      }

      return resolve("AddBalance Error: user has no record in database!");
    });
    return AddBalanceProm;
  },
  //--

  //-- Economy.SubtractBalance(UserID,Amount)
  SubtractBalance: function(UserID, toSubtract) {
    return dbQueue.addToQueue({
      value: this._SubtractBalance.bind(this),
      args: [UserID, toSubtract]
    });
  },

  _SubtractBalance: async function(UserID, toSubtract) {
    if (!UserID) throw new Error("SubtractBalance Error: missing UserID!");
    if (!toSubtract && toSubtract != 0)
      throw new Error("SubtractBalance Error: missing toSubtract!");
    if (!parseInt(toSubtract))
      throw new Error(
        "SubtractBalance Error: toSubtract needs to be a number!"
      );
    toSubtract = parseInt(toSubtract);

    const SubtractBalanceProm = new Promise(async (resolve, error) => {
      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        const Info2 = await DB.update(
          {
            balance: Info.balance - toSubtract
          },
          {
            where: {
              userID: UserID
            }
          }
        );
        if (Info2 > 0) {
          return resolve({
            userid: UserID,
            oldbalance: Info.balance,
            newbalance: Info.balance - toSubtract
          });
        }
        return error("SubtractBalance Error: something went wrong!");
      }

      return resolve("SubtractBalance Error: user has no record in database!");
    });
    return SubtractBalanceProm;
  },

  FetchBalance: function(UserID) {
    return dbQueue.addToQueue({
      value: this._FetchBalance.bind(this),
      args: [UserID]
    });
  },

  _FetchBalance: async function(UserID) {
    if (!UserID) throw new Error("FetchBalance Error: missing UserID!");
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
        });
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
        });
      } catch (e) {
        if (e.name === "SequelizeUniqueConstraintError") {
          return resolve(
            `Duplicate Found, shouldn\'t happen in this function, check typo\'s`
          );
        }
        return error(e);
      }
    });
    return FetchBalanceProm;
  },

  Leaderboard: function(data = {}) {
    return dbQueue.addToQueue({
      value: this._Leaderboard.bind(this),
      args: [data]
    });
  },

  _Leaderboard: async function(data) {
    if (data.limit && !parseInt(data.limit))
      throw new Error("Leaderboard Error: obj.limit needs to be a number!");
    if (data.limit) data.limit = parseInt(data.limit);
    if (data.filter && !data.filter instanceof Function)
      throw new Error("Leaderboard Error: obj.filter needs to be a function!");
    if (!data.filter) data.filter = x => x;
    const LeaderboardProm = new Promise(async (resolve, error) => {
      if (data.search) {
        const Info = await DB.findAll({
          where: {
            balance: {
              [Sequelize.Op.gt]: 0
            }
          }
        });

        let output = Info.map(l => l.userID + " " + l.balance)
          .sort((a, b) => b.split(" ")[1] - a.split(" ")[1])
          .map(
            l =>
              new Object({
                userid: l.split(" ")[0],
                balance: l.split(" ")[1]
              })
          )
          .filter(data.filter)
          .slice(0, data.limit)
          .findIndex(l => l.userid == data.search);

        if (output == -1) return resolve("Leaderboard Error: user not found");
        return resolve(output + 1);
      } else {
        const Info = await DB.findAll({
          where: {
            balance: {
              [Sequelize.Op.gt]: 0
            }
          }
        });

        let output = Info.map(l => l.userID + " " + l.balance)
          .sort((a, b) => b.split(" ")[1] - a.split(" ")[1])
          .map(
            l =>
              new Object({
                userid: l.split(" ")[0],
                balance: l.split(" ")[1]
              })
          )
          .filter(data.filter)
          .slice(0, data.limit);

        return resolve(output);
      }
    });
    return LeaderboardProm;
  },

  Daily: function(UserID, Input) {
    return dbQueue.addToQueue({
      value: this._Daily.bind(this),
      args: [UserID, Input]
    });
  },

  _Daily: async function(UserID, Input) {
    if (!UserID) throw new Error("Daily Error: missing UserID!");
    if (!parseInt(Input))
      throw new Error("Daily Error: input needs to be a number!");
    Input = parseInt(Input);

    const DailyProm = new Promise(async (resolve, error) => {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //Januari is 0;
      var yyyy = today.getFullYear();

      var now = new Date(`${mm} ${dd}, ${yyyy}`);
      var nextDay = now.setDate(now.getDate() + 1);

      var difference = nextDay - today.getTime();

      var days = Math.floor(difference / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;
      today = mm + dd + yyyy;

      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        if (Info.daily != today) {
          const Info2 = await DB.update(
            {
              balance: Info.balance + Input,
              daily: today
            },
            {
              where: {
                userID: UserID
              }
            }
          );
          if (Info2 > 0) {
            return resolve({
              userid: Info.userID,
              balance: Info.balance + Input,
              earned: Input,
              updated: true
            });
          }
        } else {
          return resolve({
            userid: Info.userID,
            updated: false,
            timetowait:
              days + "d " + hours + "h " + minutes + "m " + seconds + "s"
          });
        }
      }
      try {
        const Info3 = await DB.create({
          userID: UserID,
          balance: 0,
          daily: today
        });
        return resolve({
          userid: UserID,
          updated: true
        });
      } catch (e) {
        if (e.name === "SequelizeUniqueConstraintError") {
          return resolve(
            `Duplicate Found, shouldn\'t happen in this function, check typo\'s`
          );
        }
        return error(e);
      }
    });
    return DailyProm;
  },

  Transfer: function(FromUser, ToUser, Amount) {
    return dbQueue.addToQueue({
      value: this._Transfer.bind(this),
      args: [FromUser, ToUser, Amount]
    });
  },

  _Transfer: async function(FromUser, ToUser, Amount) {
    if (!FromUser || !ToUser || !Amount)
      throw new Error("Transfer Error: missing parameters!");
    if (!parseInt(Amount))
      throw new Error("Transfer Error: amount needs to be a number!");
    Amount = parseInt(Amount);

    const TransferProm = new Promise(async (resolve, error) => {
      const Info = await DB.findOne({
        where: {
          userID: FromUser
        }
      });
      if (Info) {
        if (Info.balance < Amount) {
          throw new Error("Transfer Error: user has insufficient funds.");
          return;
        }

        const Info6 = await DB.update(
          {
            balance: Info.balance - Amount
          },
          {
            where: {
              userID: FromUser
            }
          }
        );

        const Info2 = await DB.findOne({
          where: {
            userID: ToUser
          }
        });
        if (Info2) {
          const Info3 = await DB.update(
            {
              balance: Info2.balance + Amount
            },
            {
              where: {
                userID: ToUser
              }
            }
          );
          if (Info3 > 0) {
            return resolve({
              FromUser: Info.balance - Amount,
              ToUser: Info2.balance + Amount
            });
          }
          return error("Transfer Error: something went wrong!");
        } else {
          try {
            const Info5 = await DB.create({
              userID: ToUser,
              balance: Amount,
              daily: 0
            });
            return resolve({
              FromUser: Info.balance - Amount,
              ToUser: Amount
            });
          } catch (e) {
            if (e.name === "SequelizeUniqueConstraintError") {
              return resolve(
                `Duplicate Found, shouldn\'t happen in this function, check typo\'s`
              );
            }
            return error(e);
          }
        }
      }
      throw new Error("Transfer Error: user has insufficient funds.");
    });
    return TransferProm;
  },

  Coinflip: function(UserID, Flip, Input) {
    return dbQueue.addToQueue({
      value: this._Coinflip.bind(this),
      args: [UserID, Flip, Input]
    });
  },

  _Coinflip: async function(UserID, Flip, Input) {
    Flip = Flip.toLowerCase();
    if (!UserID || !Flip || !Input)
      throw new Error("Coinflip Error: missing parameters!");
    if (Flip != "tails" && Flip != "heads")
      throw new Error("Coinflip Error: flip needs to be [tails  or heads]");
    if (!parseInt(Input))
      throw new Error("Coinflip Error: input needs to be a number!");
    if (parseInt(Input) < 0)
      throw new Error("Coinflip Error: input needs to be greater than 0");
    Input = parseInt(Input);

    const CoinflipProm = new Promise(async (resolve, error) => {
      const random = ["tails", "heads"];
      const output = random[Math.floor(Math.random() * 2)];

      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        if (Info.balance < Input) {
          throw new Error("Coinflip Error: the user has insufficient funds.");
          return;
        }

        if (Flip != output) {
          const Info2 = await DB.update(
            {
              balance: Info.balance - Input
            },
            {
              where: {
                userID: UserID
              }
            }
          );
          if (Info2 > 0) {
            return resolve({
              userid: UserID,
              oldbalance: Info.balance,
              newbalance: Info.balance - Input,
              output: "lost"
            });
          }
          return error("Coinflip Error: something went wrong ID:1!");
        } else {
          const Info3 = await DB.update(
            {
              balance: Info.balance + Input
            },
            {
              where: {
                userID: UserID
              }
            }
          );
          if (Info3 > 0) {
            return resolve({
              userid: UserID,
              oldbalance: Info.balance,
              newbalance: Info.balance + Input,
              output: "won"
            });
          }
          return error("Coinflip Error: something went wrong ID:2!");
        }
      }
      throw new Error("Coinflip Error: the user has insufficient funds.");
    });
    return CoinflipProm;
  },

  Dice: function(UserID, DiceNumber, Input) {
    return dbQueue.addToQueue({
      value: this._Dice.bind(this),
      args: [UserID, DiceNumber, Input]
    });
  },

  _Dice: async function(UserID, DiceNumber, Input) {
    if (!UserID || !DiceNumber || !Input)
      throw new Error("Dice Error: missing parameters!");
    if (
      !parseInt(DiceNumber) ||
      ![1, 2, 3, 4, 5, 6].includes(parseInt(DiceNumber))
    )
      throw new Error("Dice Error: number should be 1-6");
    if (!parseInt(Input))
      throw new Error("Dice Error: input needs to be a number!");
    if (parseInt(Input) < 0)
      throw new Error("Dice Error: input needs to be greater than 0");
    Input = parseInt(Input);
    DiceNumber = parseInt(DiceNumber);

    const DiceProm = new Promise(async (resolve, error) => {
      const output = Math.floor(Math.random() * 6 + 1);

      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        if (Info.balance < Input) {
          throw new Error("Dice Error: insufficient funds!");
          return;
        }

        if (DiceNumber != output) {
          const Info2 = await DB.update(
            {
              balance: Info.balance - Input
            },
            {
              where: {
                userID: UserID
              }
            }
          );
          if (Info2 > 0) {
            return resolve({
              userid: UserID,
              oldbalance: Info.balance,
              newbalance: Info.balance - Input,
              guess: DiceNumber,
              dice: output,
              output: "lost"
            });
          }
          return error("Dice Error: something went wrong ID:1!");
        } else {
          const Info3 = await DB.update(
            {
              balance: Info.balance + Input
            },
            {
              where: {
                userID: UserID
              }
            }
          );
          if (Info3 > 0) {
            return resolve({
              userid: UserID,
              oldbalance: Info.balance,
              newbalance: Info.balance + Input,
              guess: DiceNumber,
              dice: output,
              output: "won"
            });
          }
          return error("Dice Error: something went wrong ID:2!");
        }
      }
      throw new Error("Dice Error: insufficient funds!");
    });
    return DiceProm;
  },

  Delete: function(UserID) {
    return dbQueue.addToQueue({
      value: this._Delete.bind(this),
      args: [UserID]
    });
  },

  _Delete: async function(UserID) {
    if (!UserID) throw new Error("Delete Error: missing UserID!");

    const DeleteProm = new Promise(async (resolve, error) => {
      const Info = await DB.destroy({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        return resolve({
          deleted: true
        });
      }

      return resolve({
        deleted: false
      });
    });
    return DeleteProm;
  },

  ResetDaily: function(UserID) {
    return dbQueue.addToQueue({
      value: this._ResetDaily.bind(this),
      args: [UserID]
    });
  },

  _ResetDaily: async function(UserID) {
    if (!UserID) throw new Error("ResetDaily Error: missing UserID!");

    const ResetDailyProm = new Promise(async (resolve, error) => {
      const Info = await DB.update(
        {
          daily: 0
        },
        {
          where: {
            userID: UserID
          }
        }
      );
      if (Info > 0) {
        return resolve(`Daily Reset.`);
      } else {
        try {
          const Info2 = await DB.create({
            userID: UserID,
            balance: 0,
            daily: 0
          });
          return resolve(`Daily Reset.`);
        } catch (e) {
          if (e.name === "SequelizeUniqueConstraintError") {
            return resolve(
              `Duplicate Found, shouldn\'t happen in this function, check typo\'s`
            );
          }
          return error(e);
        }
      }
    });
    return ResetDailyProm;
  },

  Work: function(UserID, data = {}) {
    return dbQueue.addToQueue({
      value: this._Work.bind(this),
      args: [UserID, data]
    });
  },

  _Work: async function(UserID, data = {}) {
    if (!UserID) throw new Error("Work Error: missing parameters!");
    if (data.jobs && !Array.isArray(data.jobs))
      throw new Error("Work Error: data.jobs is not an array!");
    if (data.money && !parseInt(data.money))
      throw new Error("Work Error: data.money needs to be a number!");
    if (data.failurerate && !parseInt(data.failurerate))
      throw new Error("Work Error: data.failurerate needs to be a number!");
    if (data.failurerate) data.failurerate = parseInt(data.failurerate);
    if ((data.failurerate && data.failurerate < 0) || data.failurerate > 100)
      throw new Error(
        "Work Error: data.failurerate needs to be a number between 0-100!"
      );
    if (data.money) data.money = parseInt(data.money);

    if (!data.jobs)
      data.jobs = [
        "Miner",
        "Bartender",
        "Cashier",
        "Cleaner",
        "Drugdealer",
        "Assistant",
        "Nurse",
        "Cleaner",
        "Teacher",
        "Accountants",
        "Security Guard",
        "Sheriff",
        "Lawyer",
        "Dishwasher",
        "Electrician",
        "Singer",
        "Dancer"
      ];
    if (!data.money) data.money = Math.floor(Math.random() * 101);
    if (!data.failurerate) data.failurerate = 50;

    var success = true;

    var randomnumber = Math.random();
    if (randomnumber <= data.failurerate / 100) success = false;

    const WorkProm = new Promise(async (resolve, error) => {
      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        if (success) {
          const Info2 = await DB.update(
            {
              balance: Info.balance + data.money
            },
            {
              where: {
                userID: UserID
              }
            }
          );

          if (Info2 > 0) {
            return resolve({
              userid: Info.userID,
              earned: data.money,
              job: data.jobs[Math.floor(Math.random() * data.jobs.length)],
              balance: Info.balance + data.money
            });
          }
        } else {
          return resolve({
            userid: Info.userID,
            earned: 0,
            job: data.jobs[Math.floor(Math.random() * data.jobs.length)],
            balance: Info.balance
          });
        }
      }

      try {
        if (!success) data.money = 0;

        const Info3 = await DB.create({
          userID: UserID,
          balance: data.money,
          daily: 0
        });
        return resolve({
          userid: UserID,
          earned: data.money,
          job: data.jobs[Math.floor(Math.random() * data.jobs.length)],
          balance: data.money
        });
      } catch (e) {
        if (e.name === "SequelizeUniqueConstraintError") {
          return resolve(
            `Duplicate Found, shouldn\'t happen in this function, check typo\'s`
          );
        }
        return error(e);
      }
    });
    return WorkProm;
  },

  Slots: function(UserID, Input, data = {}) {
    return dbQueue.addToQueue({
      value: this._Slots.bind(this),
      args: [UserID, Input, data]
    });
  },

  _Slots: async function(UserID, Input, data) {
    if (!UserID || !Input) throw new Error("Slots Error: missing parameter");
    if (data.Rolls && !parseInt(data.Rolls))
      throw new Error("Slots Error: data.Rolls needs to be a number!");
    if (data.Emojis && !Array.isArray(data.Emojis))
      throw new Error("Slots Error: data.Emojis needs to be an array!");
    if (!parseInt(Input))
      throw new Error("Slots Error: Input needs to be a number!");
    if (!data.Rolls) data.Rolls = 3;
    if (!data.Emojis) data.Emojis = ["🍎", "🍒", "🍉"];
    if (parseInt(Input) < 0)
      throw new Error("Slots Error: Input needs to be greater than 0");
    Input = parseInt(Input);

    const SlotsProm = new Promise(async (resolve, error) => {
      const Slot1 = data.Emojis[Math.floor(Math.random() * data.Emojis.length)];
      const Slot2 = data.Emojis[Math.floor(Math.random() * data.Emojis.length)];
      const Slot3 = data.Emojis[Math.floor(Math.random() * data.Emojis.length)];

      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        if (Info.balance < Input) {
          throw new Error("Slots Error: The user has insufficient funds!");
          return;
        }

        if (Slot1 != Slot2 && Slot2 == Slot3) {
          const Info2 = await DB.update(
            {
              balance: Info.balance + Input
            },
            {
              where: {
                userID: UserID
              }
            }
          );
          if (Info2 > 0) {
            return resolve({
              userid: UserID,
              oldbalance: Info.balance,
              newbalance: Info.balance + Input,
              slots1: Slot1,
              slots2: Slot2,
              slots3: Slot3,
              output: "won"
            });
          }
          return error("Slots Error: Something went wrong ID:1");
        } else {
          if (Slot1 == Slot2 && Slot1 == Slot3) {
            const Info2 = await DB.update(
              {
                balance: Info.balance + Input
              },
              {
                where: {
                  userID: UserID
                }
              }
            );
            if (Info2 > 0) {
              return resolve({
                userid: UserID,
                oldbalance: Info.balance,
                newbalance: Info.balance + Input,
                slots1: Slot1,
                slots2: Slot2,
                slots3: Slot3,
                output: "won"
              });
            }
            return error("Slots Error: Something went wrong ID:2!");
          } else {
            const Info3 = await DB.update(
              {
                balance: Info.balance - Input
              },
              {
                where: {
                  userID: UserID
                }
              }
            );
            if (Info3 > 0) {
              return resolve({
                userid: UserID,
                oldbalance: Info.balance,
                newbalance: Info.balance - Input,
                slots1: Slot1,
                slots2: Slot2,
                slots3: Slot3,
                output: "lost"
              });
            }
            return error("Slots Error: Something went wrong ID:3!");
          }
        }
      }
      throw new Error("Slots Error: The user has insufficient funds!");
    });
    return SlotsProm;
  },
  ResetEconomy: function() {
    return dbQueue.addToQueue({
      value: this._ResetEconomy.bind(this),
      args: []
    });
  },

  _ResetEconomy: async function() {
    const ResetEcoProm = new Promise(async (resolve, error) => {
      const Info = await DB.findAll({
        where: {
          balance: {
            [Sequelize.Op.gt]: 0
          }
        }
      });

      if (Info) {
        let output = Info.map(l => {
          const Info3 = DB.update(
            {
              balance: 0
            },
            {
              where: {
                userID: l.userID
              }
            }
          );
          if (!Info3)
            return new Error(
              "ResetEconomy Error: This is a bug report it in the discord server listed in the npm webpage!"
            );
          return resolve({
            reset: true
          });
        });
      } else {
        try {
          return resolve({
            reset: false
          });
        } catch (e) {
          if (e.name === "SequelizeUniqueConstraintError") {
            return resolve(
              `Duplicate Found, shouldn\'t happen in this function, check typo\'s`
            );
          }
          return error(e);
        }
      }
      throw new Error("ResetEconomy Error: Something went wrong.");
    });
    return ResetEcoProm;
  },
  SetAll: function(toSet) {
    return dbQueue.addToQueue({
      value: this._SetAll.bind(this),
      args: [toSet]
    });
  },

  _SetAll: async function(toSet) {
    if (!toSet) throw new Error("SetAll Error: missing toSet!");

    const SetAllProm = new Promise(async (resolve, error) => {
      const Info = await DB.findAll({
        where: {
          balance: {
            [Sequelize.Op.gt]: 0
          }
        }
      });

      if (Info) {
        let output = Info.map(l => {
          const Info3 = DB.update(
            {
              balance: toSet
            },
            {
              where: {
                userID: l.userID
              }
            }
          );
          if (!Info3)
            return new Error(
              "SetAll Error: This is a bug report it in the discord server listed in the npm webpage!"
            );
          return resolve({
            set: true
          });
        });
      } else {
        try {
          return resolve({
            set: false
          });
        } catch (e) {
          if (e.name === "SequelizeUniqueConstraintError") {
            return resolve(
              `Duplicate Found, shouldn\'t happen in this function, check typo\'s`
            );
          }
          return error(e);
        }
      }
      throw new Error("SetAll Error: Something went wrong.");
    });
    return SetAllProm;
  },
  AddAll: function(toAdd) {
    return dbQueue.addToQueue({
      value: this._AddAll.bind(this),
      args: [toAdd]
    });
  },

  _AddAll: async function(toAdd) {
    if (!toAdd) throw new Error("AddAll Error: missing toAdd!");

    const AddAllProm = new Promise(async (resolve, error) => {
      const Info = await DB.findAll({
        where: {
          balance: {
            [Sequelize.Op.gt]: 0
          }
        }
      });

      if (Info) {
        let output = Info.map(l => {
          const Info3 = DB.update(
            {
              balance: Info.balance + toAdd
            },
            {
              where: {
                userID: l.userID
              }
            }
          );
          if (!Info3)
            return new Error(
              "AddAll Error: This is a bug report it in the discord server listed in the npm webpage!"
            );
          return resolve({
            added: true
          });
        });
      } else {
        try {
          return resolve({
            added: false
          });
        } catch (e) {
          if (e.name === "SequelizeUniqueConstraintError") {
            return resolve(
              `Duplicate Found, shouldn\'t happen in this function, check typo\'s`
            );
          }
          return error(e);
        }
      }
      throw new Error("AddAll Error: Something went wrong.");
    });
    return AddAllProm;
  },
  SubtractAll: function(toSubtract) {
    return dbQueue.addToQueue({
      value: this._SubtractAll.bind(this),
      args: [toSubtract]
    });
  },

  _SubtractAll: async function(toSubtract) {
    if (!toSubtract) throw new Error("SubtractAll Error: missing toSubtract!");

    const SubtractAllProm = new Promise(async (resolve, error) => {
      const Info = await DB.findAll({
        where: {
          balance: {
            [Sequelize.Op.gt]: 0
          }
        }
      });

      if (Info) {
        let output = Info.map(l => {
          const Info3 = DB.update(
            {
              balance: Info.balance - toSubtract
            },
            {
              where: {
                userID: l.userID
              }
            }
          );
          if (!Info3)
            return new Error(
              "SubtractAll Error: This is a bug report it in the discord server listed in the npm webpage!"
            );
          return resolve({
            subtracted: true
          });
        });
      } else {
        try {
          return resolve({
            subtracted: false
          });
        } catch (e) {
          if (e.name === "SequelizeUniqueConstraintError") {
            return resolve(
              `Duplicate Found, shouldn\'t happen in this function, check typo\'s`
            );
          }
          return error(e);
        }
      }
      throw new Error("SubtractAll Error: something went wrong.");
    });
    return SubtractAllProm;
  },
  DeleteAll: function() {
    return dbQueue.addToQueue({
      value: this._DeleteAll.bind(this),
      args: []
    });
  },

  _DeleteAll: async function() {
    const DeleteAllProm = new Promise(async (resolve, error) => {
      const Info = await DB.findAll({
        where: {
          balance: {
            [Sequelize.Op.gt]: 0
          }
        }
      });

      if (Info) {
        let output = Info.map(l => {
          const Info3 = DB.destroy({
            where: {
              userID: l.userID
            }
          });
          if (!Info3)
            return new Error(
              "DeleteAll Error: This is a bug report it in the discord server listed in the npm webpage!"
            );
          return resolve({
            deleted: true
          });
        });
      } else {
        try {
          return resolve({
            deleted: false
          });
        } catch (e) {
          if (e.name === "SequelizeUniqueConstraintError") {
            return resolve(
              `Duplicate Found, shouldn\'t happen in this function, check typo\'s`
            );
          }
          return error(e);
        }
      }
      throw new Error("DeleteAll Error: something went wrong.");
    });
    return DeleteAllProm;
  },
  AddLootBox: function(UserID, toAdd) {
    return dbQueue.addToQueue({
      value: this._AddLootBox.bind(this),
      args: []
    });
  },

  _AddLootBox: async function(UserID, toAdd) {
    const AddLootBoxProm = new Promise(async (resolve, error) => {
      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });

      if (Info) {
        const Info3 = DB.update(
          {
            lootboxes: Info.lootboxes + toAdd
          },
          {
            where: {
              userID: UserID
            }
          }
        );
        if (!Info3)
          return new Error(
            "AddLootBox Error: This is a bug report it in the discord server listed in the npm webpage!"
          );
        return resolve({
          added: true,
          newlootamt: Info.lootboxes,
          oldlootamt: Info.lootboxes - toAdd
        });
      } else {
        try {
          return resolve({
            added: false,
            newlootamt: Info.lootboxes,
            oldlootamt: Info.lootboxes
          });
        } catch (e) {
          if (e.name === "SequelizeUniqueConstraintError") {
            return resolve(
              `Duplicate Found, shouldn\'t happen in this function, check typo\'s`
            );
          }
          return error(e);
        }
      }
      throw new Error("AddLootBox Error: something went wrong.");
    });
    return AddLootBoxProm;
  }
};
