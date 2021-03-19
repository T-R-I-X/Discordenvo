<div align="center">
  <br />
  <br />
  <p>
    <a href="https://discord.gg/Ym5BnJU"><img src="https://img.shields.io/discord/612023254055649280?color=green&label=online&style=flat-square" alt="Discord server"/></a>
    <a href="https://www.npmjs.com/package/discordenvo"><img src="https://img.shields.io/npm/v/discordenvo?color=orange&style=flat-square" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/discordenvo"><img src="https://img.shields.io/npm/dt/discordenvo?color=yellow&style=flat-square" alt="NPM downloads" /></a>
    <a href="https://www.npmjs.com/package/discordenvo"><img src="https://img.shields.io/bundlephobia/minzip/discordenvo?style=flat-square" alt="SIZE">
  </p>
  <p>
    <a href="https://nodei.co/npm/discordenvo/"><img src="https://nodei.co/npm/discordenvo.png?downloads=true&stars=true" alt="NPM info" /></a>
  </p>
</div>

## Installation

```js
$ npm i discordenvo --save
```

### Planed updates

- Add more economy games (working on)
- ~~Fix problems with bots that shard (temp fix maybe?)~~
- Add a better api documentation
- ~~Add daily count~~

### Required packages

- [sequelize](https://www.npmjs.com/package/sequelize) the DB wrapper of sqlite3 of this project (`npm install --save sequelize`)
- [sqlite3](https://www.npmjs.com/package/sqlite3) Core DB (`npm install --save sqlite3`)

### ChangeLog

- [1.1.9](https://www.npmjs.com/package/discordenvo/v/1.1.9) - This will break your bot. Changed function names, changed added and renamed output variables. Code split all economy functions. READ BELOW
- [1.2.0](https://www.npmjs.com/package/discordenvo/v/1.2.0) - This update brings a new feature to ecoDaily which is a counter for dailys in a row. ecoDaily returns a output.dailyCounter when you attempt to call the promise.

## New Names
```diff
+ addBalance
+ coinFlip
+ ecoDaily
+ ecoDelete
+ ecoDice
+ ecoSlots
+ ecoTransfer
+ ecoWork
+ fetchBalance
+ ecoLeaderboard
+ resetDaily
+ setBalance
+ subtractBalance
```

### Docs

- [Docs](#) - New page soon, just join the server for questions
