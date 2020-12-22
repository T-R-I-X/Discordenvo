'use strict';

export function output(DB, userId) {
  if (!userId)
    throw new Error("ecoDelete: missing userId");

  const ecoDeleteProm = new Promise(async (resolve, error) => {
    const Info = await DB.destroy({
      where: {
        userId: userId
      }
    });
    if (Info) {
      return resolve({
        deleted: true
      });
    }

    return resolve({
      deleted: false
    });
  });
  return ecoDeleteProm;
}