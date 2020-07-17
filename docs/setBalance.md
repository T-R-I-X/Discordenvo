---
id: setBalance
title: setBalance
sidebar_label: setBalance
---

### Code example
```javascript
const discordenvo = require('discordenvo');

discordenvo.setBalance(userId,toSet).then(output => {
  console.log(`${output.userId} new balance is ${output.newBalance}`)
})
```

### Input and output
```javascript
/** 
 * @param {*} userId
 * @returns {*} userId | newBalance
 *\
```