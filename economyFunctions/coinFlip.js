'use strict';

module.exports =  {
    default: (DB,userId,flip,toAdd) => {
    var Flip;
    var Input;
    
    if (!userId || !flip || !toAdd) throw new Error("coinFlip: missing parameters");

    Flip = flip.toLowerCase();
    if (Flip != "tails" && Flip != "heads") throw new Error("coinFlip: flip needs to be [tails  or heads]");
    
    if (!parseInt(toAdd)) throw new Error("coinFlip: input needs to be a number");
    if (parseInt(toAdd) < 0) throw new Error("coinFlip: input needs to be greater than 0");
    Input = parseInt(toAdd);

    const coinFlipProm = new Promise(async (resolve, error) => {
      const random = ["tails", "heads"];
      const output = random[Math.floor(Math.random() * 2)];

      const Info = await DB.findOne({
        where: {
          userId: userId
        }
      });
      if (Info) {
        if (Info.balance < Input) {
          throw new Error("coinFlip: the user has insufficient funds");
          return;
        }

        if (Flip != output) {
          const Info2 = await DB.update(
            {
              balance: Info.balance - Input
            },
            {
              where: {
                userId: userId
              }
            }
          );
          if (Info2 > 0) {
            return resolve({
              userId: userId,
              oldBalance: Info.balance,
              newBalance: Info.balance - Input,
              output: "lost"
            });
          }
          return error("coinFlip: couldn't complete action 1");
        } else {
          const Info3 = await DB.update(
            {
              balance: Info.balance + Input
            },
            {
              where: {
                userId: userId
              }
            }
          );
          if (Info3 > 0) {
            return resolve({
              userId: userId,
              oldBalance: Info.balance,
              newBalance: Info.balance + Input,
              output: "won"
            });
          }
          return error("coinFlip: couldn't complete action 2");
        }
      }
      throw new Error("coinFlip: user doesn't have enough funds");
    });
    return coinFlipProm;
  }
};