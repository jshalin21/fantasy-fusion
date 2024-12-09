/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));
    app.use('/api/users', require('./users.js')(router));
    app.use('/api/users/:id', require('./users.js')(router));
    app.use('/api/leagues', require('./leagues.js')(router));

};
