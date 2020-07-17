'use strict';

module.exports = {
  default: (DB,userId,toAdd,data) => {
    var Input;

    if (!userId || !toAdd) throw new Error("ecoSlots: missing parameter");

    if (data.Rolls && !parseInt(data.Rolls)) throw new Error("ecoSlots: data.Rolls needs to be a number");
    if (data.Emojis && !Array.isArray(data.Emojis)) throw new Error("ecoSlots: data.Emojis needs to be an array");
    if (!data.Rolls) data.Rolls = 3;
    if (!data.Emojis) data.Emojis = ["🍎", "🍒", "🍉"];
    
    if (!parseInt(toAdd)) throw new Error("ecoSlots: input needs to be a number");

    if (parseInt(toAdd) < 0) throw new Error("ecoSlots: toAdd needs to be greater than 0");
    Input = parseInt(toAdd);

    const ecoSlotsProm = new Promise(async (resolve, error) => {
      var thing = caculateSlots(data, data.Rolls);

      const output = thing[0];
      const slotArray = thing[1];

      const Info = await DB.findOne({
        where: {
          userId: userId
        }
      });
      if (Info) {
        if (Info.balance < Input) throw new Error("ecoSlots: user doesn't have enough funds");

        if (output == true) {
          const Info2 = await DB.update(
            {
              balance: Info.balance + Input
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
              newBalance: Info.balance + Input,
              slotArray: slotArray,
              output: "won"
            });
          }
          return error("ecoSlots: unable to complete action 1");
        } else {
          if (output == false) {
            const Info2 = await DB.update(
              {
                balance: Info.balance + Input
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
                newBalance: Info.balance - Input,
                slotArray:slotArray,
                output: "lost"
              });
            }
            return error("ecoSlots: unable to complete action 2");
          }
        }
      }
      throw new Error("ecoSlots: user doesn't have enough funds");
    });
    return ecoSlotsProm;
  }
};

function caculateSlots(data,Rolls) {
  var i;
  for (i=0;i>Rolls;i++) {
  var Slot1 = data.Emojis[Math.floor(Math.random() * data.Emojis.length)];
  var Slot2 = data.Emojis[Math.floor(Math.random() * data.Emojis.length)];
  var Slot3 = data.Emojis[Math.floor(Math.random() * data.Emojis.length)];
  }

  if (Slot1 != Slot2 && Slot3 == Slot1) return [true,[Slot1,Slot2,Slot3]]
  if (Slot1 == Slot2 && Slot3 != Slot2) return [false,[Slot1,Slot2,Slot3]]
  if (Slot1 == Slot2 && Slot3 == Slot2) return [true,[Slot1,Slot2,Slot3]]
  if (Slot2 != Slot1 && Slot1 != Slot3) return [false,[Slot1,Slot2,Slot3]]
  if (Slot3 == Slot1 && Slot2 != Slot1) return [true,[Slot1,Slot2,Slot3]]
  
  return [false,[Slot1,Slot2,Slot3]]
};