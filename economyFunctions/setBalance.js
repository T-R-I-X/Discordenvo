'use strict';

export function output(DB, userId, toSet) {
  if (!userId)
    throw new Error("setBalance: missing userId");

  if (!toSet && toSet > 0)
    throw new Error("setBalance: missing toSet");

  if (!parseInt(toSet))
    throw new Error("setBalance: toSet needs to be a number");
  toSet = parseInt(toSet);

  const setBalanceProm = new Promise(async (resolve, error) => {
    const Info = await DB.update(
      {
        balance: toSet
      },
      {
        where: {
          userId: userId
        }
      }
    );
    if (Info > 0) {
      return resolve({
        userId: userId,
        balance: toSet
      });
    } else {
      try {
        const Info2 = await DB.create({
          userId: userId,
          balance: 0,
          daily: 0
        });
        return resolve({
          userId: userId,
          newBalance: toSet
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
  return setBalanceProm;
}