'use strict';

module.exports = {
  default: (DB,S,data) => {
    if (data.limit && !parseInt(data.limit)) throw new Error("leaderboard: data.limit needs to be a number");
    if (data.limit) data.limit = parseInt(data.limit);
 
    if (data.filter && !data.filter instanceof Function) throw new Error("leaderboard: data.filter needs to be a function");
    if (!data.filter) data.filter = x => x;
    
    const ecoLeaderboardProm = new Promise(async (resolve, error) => {
        if (data.search) {
        const Info = await DB.findAll({
            where: {
                balance: {
                    [S.Op.gt]: 0
                }
            }
        });

        let output = Info.map(l => l.userId + " " + l.balance)
            .sort((a, b) => b.split(" ")[1] - a.split(" ")[1])
            .map(l =>
                new Object({
                    userId: l.split(" ")[0],
                    balance: l.split(" ")[1]
                })
        )
        .filter(data.filter)
        .slice(0, data.limit)
        .findIndex(l => l.userId == data.search);

      if (output == -1) return resolve("leaderboard: user not found");
      return resolve(output + 1);
    } else {
      const Info = await DB.findAll({
        where: {
          balance: {
            [S.Op.gt]: 0
          }
        }
      });

      let output = Info.map(l => l.userId + " " + l.balance)
        .sort((a, b) => b.split(" ")[1] - a.split(" ")[1])
        .map(l =>
            new Object({
              userId: l.split(" ")[0],
              balance: l.split(" ")[1]
            })
        )
        .filter(data.filter)
        .slice(0, data.limit);

      return resolve(output);
    }
  });
  return ecoLeaderboardProm;
}
};