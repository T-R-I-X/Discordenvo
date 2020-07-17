'use strict';

module.exports = {
    default: (DB,userId,toAdd) => {
    if (!userId) throw new Error("addBalance: missing userId");

    if (!toAdd && toAdd != 0) throw new Error("addBalance: missing toAdd");
    
    if (!parseInt(toAdd)) throw new Error("addBalance: toAdd needs to be a number");
    toAdd = parseInt(toAdd);

    const addBalanceProm = new Promise(async (resolve, error) => {
      const Info = await DB.findOne({
        where: {
          userId: userId
        }
      });
      if (Info) {
        const Info2 = await DB.update(
          {
            balance: Info.balance + toAdd
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
            newBalance: Info.balance + toAdd
          });
        }
        return error("addBalance: unable to complete action");
      }

      return resolve("addBalance: user has no record in database");
    });
    return addBalanceProm;
  }
};