---
id: subtractBalance
title: subtractBalance
sidebar_label: subtractBalance
---

### Code example
```javascript
const discordenvo = require('discordenvo');

discordenvo.subtractBalance(userId,toSubtract).then(output => {
  console.log(`${output.userId} new balance is ${output.newBalance} and their old balance is ${output.oldBalance}`)
})
```

### Input and output
```javascript
/** 
 * @param {*} userId
 * @param {*} toSubtract
 * @returns {*} userId | newBalance | oldBalance
 *\
```