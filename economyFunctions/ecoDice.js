'use strict';

export function output(DB, userId, DiceNumber, toAdd) {
  var Input;

  if (!userId || !DiceNumber || !toAdd)
    throw new Error("ecoDice: missing parameters");

  if (!parseInt(DiceNumber) || ![1, 2, 3, 4, 5, 6].includes(parseInt(DiceNumber)))
    throw new Error("ecoDice: number should be 1-6");
  if (!parseInt(toAdd))
    throw new Error("ecoDice: toAdd needs to be a number");
  if (parseInt(toAdd) < 0)
    throw new Error("ecoDice: toAdd needs to be greater than 0");
  Input = parseInt(toAdd);
  DiceNumber = parseInt(DiceNumber);

  const ecoDiceProm = new Promise(async (resolve, error) => {

    const output = Math.floor(Math.random() * 6 + 1);

    const Info = await DB.findOne({
      where: {
        userId: userId
      }
    });
    if (Info) {
      if (Info.balance < Input)
        throw new Error("ecoDice: user doesn't have enough funds");

      if (DiceNumber != output) {
        const Info2 = await DB.update(
          {
            balance: Info.balance - Input
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
            diceGuess: DiceNumber,
            diceOutput: output,
            output: "lost"
          });
        }
        return error("ecoDice: unable to complete action 1");
      } else {
        const Info3 = await DB.update(
          {
            balance: Info.balance + Input
          },
          {
            where: {
              userId: userId
            }
          }
        );
        if (Info3 > 0) {
          return resolve({
            userId: userId,
            oldBalance: Info.balance,
            newBalance: Info.balance + Input,
            diceGuess: DiceNumber,
            diceOutput: output,
            output: "won"
          });
        }
        return error("ecoDice: unable to complete action 2");
      }
    }
    throw new Error("ecoDice: insufficient funds!");
  });
  return ecoDiceProm;
}