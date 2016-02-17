# Inside Trader v 1.0.0

Inside Trader is a Javascript app designed for the less scrupulous investor.  Using secret techniques, Inside Trader not only allows you to model your investments and to centralise your portfolio, but also allows... less savoury investment strategies.

## Features
- View beautiful big data, with chart breakdowns of share prices, portfolio spread, updated in realtime
- Futures modelling, with predictive display
- Modify your current investments, categorised by purchase event
- Sell shares on short!
- Crash local economies... after short selling their stock!
- Pump up specific share values... after investing in them!

## Update history
- v 1.0.0: initial MVP release

## Installing and running the app
1. Clone the repository using `git clone https://github.com/bananaCypher/project2.git`
2. Install MongoDB [Install instructions](https://docs.mongodb.org/manual/installation/)
3. Install webpack using `npm install webpack -g`
4. Seed the default user data by running `node seedBarry.js` from the root project folder
5. Start the server by either using `node server.js` or `npm start` from the root project folder
6. You can also start in dev mode using `npm run start-dev` which will watch for changes to the code and rerun webpack, the mocha tests and the server

### Known issues
- Currently certain functions are depreciated in Firefox/Safari/etc. and as such the developers recommend vewiing in Chrome.
