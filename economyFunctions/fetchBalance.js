'use strict';

module.exports = {
  default: (DB,userId) => {
    if (!userId) throw new Error("fetchBalance: missing userId");

    const fetchBalanceProm = new Promise(async (resolve, error) => {
      const Info = await DB.findOne({
        where: {
          userId: userId
        }
      });
      if (Info) {
        return resolve({
          userId: Info.userId,
          balance: Info.balance
        });
      }
      try {
        const Info2 = await DB.create({
          userId: userId,
          balance: 0,
          daily: 0
        });
        return resolve({
          userId: userId,
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
    return fetchBalanceProm;
  }
};