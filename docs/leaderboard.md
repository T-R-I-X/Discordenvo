---
id: leaderboard
title: leaderboard
sidebar_label: leaderboard
---

### Code example
```javascript
const discordenvo = require('discordenvo');

discordenvo.leaderboard({limit:?,search:?,filter:?}).then(output => {
    // Finding one user with object.search
    var oneUser = output

    console.log('${output.userId} is ${output.place} on my leaderboard')

})
```

### Input and output
```javascript
/** 
 * @param {*} userId
 * @returns {*} userId | balance
 *\
```