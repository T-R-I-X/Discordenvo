'use strict';

module.exports = {
  default: (DB,fromuserId,touserId,toGive) => {
    var Amount;

    if (!fromuserId || !touserId || !toGive) throw new Error("ecoTransfer: missing parameters");

    if (!parseInt(toGive)) throw new Error("ecoTransfer: amount needs to be a number");
    Amount = parseInt(toGive);

    const ecoTransferProm = new Promise(async (resolve, error) => {
        const Info = await DB.findOne({
        where: {
            userId: fromuserId
        }
    });
    
    if (Info) {
      if (Info.balance < Amount) {
        throw new Error("ecoTransfer: user doesn't have enough funds");
      }

      const Info6 = await DB.update(
        {
          balance: Info.balance - Amount
        },
        {
          where: {
            userId: fromuserId
          }
        }
      );

      const Info2 = await DB.findOne({
        where: {
          userId: touserId
        }
      });
      if (Info2) {
        const Info3 = await DB.update(
          {
            balance: Info2.balance + Amount
          },
          {
            where: {
              userId: touserId
            }
          }
        );
        if (Info3 > 0) {
          return resolve({
            fromuserId: fromuserId,
            touserId: touserId,
            fromUserBalance: Info.balance - Amount,
            toUserBalance: Info2.balance + Amount
          });
        }
        return error("ecoTransfer: couldn't complete action");
      } else {
        try {
          const Info5 = await DB.create({
            userId: touserId,
            balance: Amount,
            daily: 0,
            weekly:0
          });
          return resolve({
            fromuserId: fromuserId,
            touserId: touserId,
            fromUserBalance: Info.balance - Amount,
            toUserBalance: Amount
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
    throw new Error("ecoTransfer: user doesn't have enough funds");
  });
  return ecoTransferProm;
}
}