'use strict';

module.exports = {
  default: (DB,userId,toSubtract) => {
    if (!userId) throw new Error("subtractBalance: missing userId");

    if (!toSubtract && toSubtract != 0) throw new Error("subtractBalance: missing toSubtract");
    
    if (!parseInt(toSubtract)) throw new Error("subtractBalance: toSubtract needs to be a number");
    toSubtract = parseInt(toSubtract);

    const subtractBalanceProm = new Promise(async (resolve, error) => {
      const Info = await DB.findOne({
        where: {
          userId: userId
        }
      });
      if (Info) {
        const Info2 = await DB.update(
          {
            balance: Info.balance - toSubtract
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
            newBalance: Info.balance - toSubtract
          });
        }
        return error("subtractBalance: unable to complete action");
      }

      return resolve("subtractBalance: user has no record in database");
    });
    return subtractBalanceProm;
  }
};