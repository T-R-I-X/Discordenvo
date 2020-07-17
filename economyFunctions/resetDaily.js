'use strict';

module.exports = {
  default: (DB,userId) => {
    if (!userId) throw new Error("resetDaily: missing userId");

    const resetDailyProm = new Promise(async (resolve, error) => {
      const Info = await DB.update(
        {
          daily: 0
        },
        {
          where: {
            userId: userId
          }
        }
      );
      if (Info > 0) {
        return resolve({
          userId:userId,
          reset:true
        });
      } else {
        try {
          const Info2 = await DB.create({
            userId: userId,
            balance: 0,
            daily: 0
          });
          return resolve({
            userId:userId,
            reset:true
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
    return resetDailyProm;
  }
};