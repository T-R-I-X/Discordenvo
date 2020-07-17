---
id: fetchBalance
title: fetchBalance
sidebar_label: fetchBalance
---

### Code example
```javascript
const discordenvo = require('discordenvo');

discordenvo.fetchBalance(userId).then(output => {
  console.log(`${output.userId} balance is ${output.balance}`)
})
```

### Input and output
```javascript
/** 
 * @param {*} userId
 * @returns {*} userId | balance
 *\
```