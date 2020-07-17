---
id: addBalance
title: addBalance
sidebar_label: addBalance
---

### Code example
```javascript
const discordenvo = require('discordenvo');

discordenvo.addBalance(userId,toAdd).then(output => {
  console.log(`${output.userId} new balance is ${output.newBalance} and their old balance is ${output.oldBalance}`)
})
```

### Input and output
```javascript
/** 
 * @param {*} userId
 * @param {*} toAdd
 * @returns {*} userId | newBalance | oldBalance
 *\
```