/**
 * @author Trix#
 * @name discordenvo
 * @version 1.1.9
 * @package https://www.npmjs.com/package/discordenvo
 * @server https://discord.com/invite/Ym5BnJU
 */
'use strict';

//-- Constants
import Sequelize, { STRING, INTEGER } from "sequelize";
import queuing from "./queue.js";
import "sqlite3";
const dbQueue = new queuing();

const sequelize = new Sequelize("economy", "discordenvo0001-23842", "hjdHs$8432jDmd923Jds", {
  host: "localhost",
  dialect: "sqlite",
  logging: 0,
  operatorsAliases: 0,
  storage: "economy.sqlite"
});

const db = sequelize.define("Economy", {
  userId: {
    type: STRING,
    unique: true
  },
  balance: INTEGER,
  daily: INTEGER,
  weekly: INTEGER
});

db.sync();


// Module 
// export 
// functions

/**
 * @param {*} userId 
 * @param {*} toSet 
 * @returns {*} promise
 */
export function setBalance(userId, toSet) {
  return dbQueue.addToQueue({
    value: require('./economyFunctions/setBalance').bind(this),
    args: [DB, userId, toSet]
  });
}

/**
 * @param {*} userId 
 * @param {*} toAdd 
 * @returns {*} promise
 */
export function addBalance(userId, toAdd) {
  return dbQueue.addToQueue({
    value: require('./economyFunctions/addBalance').bind(this),
    args: [DB, userId, toAdd]
  });
}

/**
 * @param {*} userId 
 * @param {*} toSubtract
 * @returns {*} promise
 */
export function subtractBalance(userId, toSubtract) {
  return dbQueue.addToQueue({
    value: require('./economyFunctions/subtractBalance').bind(this),
    args: [DB, userId, toSubtract]
  });
}

/**
 * @param {*} userId 
 * @returns {*} promise
 */
export function fetchBalance(userId) {
  return dbQueue.addToQueue({
    value: require('./economyFunctions/fetchBalance').bind(this),
    args: [DB, userId]
  });
}

/**
 * @param {*} data 
 * @returns {*} promise
 */
export function ecoLeaderboard(data = {}) {
  return dbQueue.addToQueue({
    value: require('./economyFunctions/leaderboard').bind(this),
    args: [DB, Sequelize, data]
  });
}

/**
 * @param {*} userId 
 * @param {*} toAdd 
 * @returns {*} promise
 */
export function ecoDaily(userId, toAdd) {
  return dbQueue.addToQueue({
    value: require('./economyFunctions/ecoDaily').bind(this),
    args: [DB, userId, toAdd]
  });
}

/**
 * @param {*} fromuserId 
 * @param {*} touserId 
 * @param {*} toGive 
 * @returns {*} promise
 */
export function ecoTransfer(fromuserId, touserId, toGive) {
  return dbQueue.addToQueue({
    value: require('./economyFunctions/ecoTransfer').bind(this),
    args: [DB, fromuserId, touserId, toGive]
  });
}

/**
 * @param {*} userId 
 * @param {*} flip 
 * @param {*} toAdd 
 * @returns {*} promise
 */
export function coinFlip(userId, flip, toAdd) {
  return dbQueue.addToQueue({
    value: require('./economyFunctions/coinFlip').bind(this),
    args: [DB, userId, flip, toAdd]
  });
}

/**
 * @param {*} userId 
 * @param {*} diceInput 
 * @param {*} toAdd 
 * @returns {*} promise
 */
export function ecoDice(userId, diceInput, toAdd) {
  return dbQueue.addToQueue({
    value: require('./economyFunctions/ecoDice').bind(this),
    args: [DB, userId, diceInput, toAdd]
  });
}

/**
 * @param {*} userId 
 * @returns {*} promise
 */
export function ecoDelete(userId) {
  return dbQueue.addToQueue({
    value: require('./economyFunctions/ecoDelete').bind(this),
    args: [DB, userId]
  });
}

/**
 * @param {*} userId 
 * @returns {*} promise
 */
export function resetDaily(userId) {
  return dbQueue.addToQueue({
    value: require('./economyFunctions/resetDaily').bind(this),
    args: [DB, userId]
  });
}

/**
 * @param {*} userId 
 * @param {*} data 
 * @returns {*} promise
 */
export function ecoWork(userId, data = {}) {
  return dbQueue.addToQueue({
    value: require('./economyFunctions/ecoWork').bind(this),
    args: [DB, userId, data]
  });
}

/**
 * @param {*} userId 
 * @param {*} toAdd 
 * @param {*} data 
 */
export function ecoSlots(userId, toAdd, data = {}) {
  return dbQueue.addToQueue({
    value: require('./economyFunctions/ecoSlots').bind(this),
    args: [DB, userId, toAdd, data]
  });
}