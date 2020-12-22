'use strict';

export function output(DB, userId, data) {
  if (!userId)
    throw new Error("ecoWork: missing parameters");

  if (data.jobs && !Array.isArray(data.jobs))
    throw new Error("ecoWork: data.jobs is not an array");
  if (!data.jobs)
    data.jobs = ["Miner", "Bartender", "Cashier", "Cleaner", "Drugdealer", "Assistant", "Nurse", "Cleaner", "Teacher", "Accountants", "Security Guard", "Sheriff", "Lawyer", "Dishwasher", "Electrician", "Singer", "Dancer"];

  if (data.money && !parseInt(data.money))
    throw new Error("ecoWork: data.money needs to be a number");
  if (data.money)
    data.money = parseInt(data.money);
  if (!data.money)
    data.money = Math.floor(Math.random() * 101);

  if (data.failurerate && !parseInt(data.failurerate))
    throw new Error("Work Error: data.failurerate needs to be a number");
  if (data.failurerate)
    data.failurerate = parseInt(data.failurerate);
  if ((data.failurerate && data.failurerate < 0) || data.failurerate > 100)
    throw new Error("ecoWork: data.failurerate needs to be a number between 0-100");
  if (!data.failurerate)
    data.failurerate = 50;

  var success = true;

  var randomNumber = Math.random();
  if (randomNumber <= data.failurerate / 100)
    success = false;

  const ecoWorkProm = new Promise(async (resolve, error) => {
    const Info = await DB.findOne({
      where: {
        userId: userId
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
              userId: userId
            }
          }
        );

        if (Info2 > 0) {
          return resolve({
            userId: Info.userId,
            earned: data.money,
            job: data.jobs[Math.floor(Math.random() * data.jobs.length)],
            newBalance: Info.balance + data.money,
            oldBalance: Info.balance
          });
        }
      } else {
        return resolve({
          userId: Info.userId,
          earned: 0,
          job: data.jobs[Math.floor(Math.random() * data.jobs.length)],
          newBalance: Info.balance,
          oldBalance: Info.balance
        });
      }
    }

    try {
      if (!success)
        data.money = 0;

      const Info3 = await DB.create({
        userId: userId,
        balance: data.money,
        daily: 0
      });
      return resolve({
        userId: userId,
        earned: data.money,
        job: data.jobs[Math.floor(Math.random() * data.jobs.length)],
        newBalance: data.money,
        oldBalance: data.money
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
  return ecoWorkProm;
}