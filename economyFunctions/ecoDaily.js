'use strict';

export function output(DB, userId, toAdd) {
  var Input;
  if (!userId)
    throw new Error("ecoDaily: missing userId");

  if (!parseInt(toAdd))
    throw new Error("ecoDaily: input needs to be a number");
  Input = parseInt(toAdd);

  const ecoDailyProm = new Promise(async (resolve, error) => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //Jan is 0;
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

    if (dd < 10)
      dd = "0" + dd;
    if (mm < 10)
      mm = "0" + mm;
    today = mm + dd + yyyy;

    const Info = await DB.findOne({
      where: {
        userId: userId
      }
    });
    if (Info) {
      if (Info.daily != today) {
        let count = Info.dailyCount ? Info.dailyCount + 1 : 0

        if (Info.daily - today > 0 + 0 + 24) {
         count = 0 
        }

        const Info2 = await DB.update(
          {
            balance: Info.balance + Input,
            daily: today,
            dailyCount: count
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
            balance: Info.balance + Input,
            earned: Input,
            dailyCount: count,
            updated: true
          });
        }
      } else {
        return resolve({
          userId: Info.userId,
          updated: false,
          timetowait: days + "d " + hours + "h " + minutes + "m " + seconds + "s"
        });
      }
    }
    try {
      const Info3 = await DB.create({
        userId: userId,
        balance: 0,
        daily: today,
        dailyCount: 1
      });
      return resolve({
        userId: userId,
        dailyCount: 1,
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
  return ecoDailyProm;
}