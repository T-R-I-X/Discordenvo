/**
 * @author developer_trix#8312
 * @name discordenvo
 * @version 1.1.9
 * @package https://www.npmjs.com/package/discordenvo
 * @server https://discord.com/invite/Ym5BnJU
 */
'use strict';

console.log('discordEnvo - v.1.1.9 - this update might break your bot.');

//-- Constants
const Sequelize = require("sequelize");
const queuing = require("./queue.js");
require("sqlite3");
const dbQueue = new queuing();

const sequelize = new Sequelize("economy", "discordenvo0001-23842", "hjdHs$8432jDmd923Jds", {
  host: "localhost",
  dialect: "sqlite",
  logging: 0,
  operatorsAliases: 0,
  storage: "economy.sqlite"
});

const DB = sequelize.define("Economy", {
  userId: {
    type: Sequelize.STRING,
    unique: true
  },
  balance: Sequelize.INTEGER,
  daily: Sequelize.INTEGER,
  weekly: Sequelize.INTEGER
});
DB.sync();


//-- Module export functions
module.exports = {
 /**
  * @param {integer} userId
  * @param {integer} toSet 
  */
  setBalance: function(userId, toSet) {
    return dbQueue.addToQueue({
      value: require('./economyFunctions/setBalance').default.bind(this),
      args: [DB,userId, toSet]
    });
  },


  /**
   * @param {integer} userId 
   * @param {integer} toAdd 
   */
  addBalance: function(userId, toAdd) {
    return dbQueue.addToQueue({
      value: require('./economyFunctions/addBalance').default.bind(this),
      args: [DB,userId, toAdd]
    });
  },


  /**
   * @param {integer} userId 
   * @param {integer} toSubtract 
   */
  subtractBalance: function(userId, toSubtract) {
    return dbQueue.addToQueue({
      value: require('./economyFunctions/subtractBalance').default.bind(this),
      args: [DB,userId, toSubtract]
    });
  },

  /**
   * @param {integer} userId 
   * @returns {integer} userId | balance
   */
  fetchBalance: function(userId) {
    return dbQueue.addToQueue({
      value: require('./economyFunctions/fetchBalance').default.bind(this),
      args: [DB,userId]
    });
  },

  /**
   * @param {Object} data - The data you want to attach to the function.
   All keys in this object are optional.
   * @param {integer} data.limit - Limit how much users to fetch.
   * @param {string} data.search - Search the placement of a user in leaderboard.
   */
  ecoLeaderboard: function(data = {}) {
    return dbQueue.addToQueue({
      value: require('./economyFunctions/leaderboard').default.bind(this),
      args: [DB,Sequelize,data]
    });
  },

  /**
   * @param {integer} userId 
   * @param {integer} toAdd
   */
  ecoDaily: function(userId, toAdd) {
    return dbQueue.addToQueue({
      value: require('./economyFunctions/ecoDaily').default.bind(this),
      args: [DB,userId, toAdd]
    });
  },

  /**
   * @param {integer} fromuserId 
   * @param {integer} touserId
   * @param {integer} toGive
   */
  ecoTransfer: function(fromuserId, touserId, toGive) {
    return dbQueue.addToQueue({
      value: require('./economyFunctions/ecoTransfer').default.bind(this),
      args: [DB,fromuserId,touserId,toGive]
    });
  },

  /**
   * @param {integer} userId 
   * @param {string} flip 
   * @param {integer} toAdd 
   */
  coinFlip: function(userId, flip, toAdd) {
    return dbQueue.addToQueue({
      value: require('./economyFunctions/coinFlip').default.bind(this),
      args: [DB,userId, flip, toAdd]
    });
  },

  /**
   * @param {integer} userId 
   * @param {integer} diceInput 
   * @param {integer} toAdd 
   */
  ecoDice: function(userId, diceInput, toAdd) {
    return dbQueue.addToQueue({
      value: require('./economyFunctions/ecoDice').default.bind(this),
      args: [DB,userId, diceInput, toAdd]
    });
  },

  /**
   * @param {integer} userId
   */
  ecoDelete: function(userId) {
    return dbQueue.addToQueue({
      value: require('./economyFunctions/ecoDelete').default.bind(this),
      args: [DB,userId]
    });
  },

  /**
   * @param {integer} userId 
   */
  resetDaily: function(userId) {
    return dbQueue.addToQueue({
      value: require('./economyFunctions/resetDaily').default.bind(this),
      args: [DB,userId]
    });
  },

  /**
   * @param {integer} userId
   * @param {object} data
   * @param {integer} data.money
   * @param {integer} data.failurerate
   * @param {array} data.jobs
   */
  ecoWork: function(userId, data = {}) {
    return dbQueue.addToQueue({
      value: require('./economyFunctions/ecoWork').default.bind(this),
      args: [DB,userId,data]
    });
  },

  /**
   * @param {integer} userId 
   * @param {integer} Input 
   * @param {object} data 
   */
  ecoSlots: function(userId,toAdd,data = {}) {
    return dbQueue.addToQueue({
      value: require('./economyFunctions/ecoSlots').default.bind(this),
      args: [DB,userId,toAdd,data]
    });
  }
}