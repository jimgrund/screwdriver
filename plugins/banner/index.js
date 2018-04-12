'use strict';

const createRoute = require('./create');
// const boom = require('boom');

/**
 * Banner API Plugin
 * @method register
 * @param  {Hapi}     server            Hapi Server
 * @param  {Object}   options           Configuration
 * @param  {Function} next              Function to call when done
 */
exports.register = (server, options, next) => {
    server.route([
        createRoute()
    ]);

    next();
};

exports.register.attributes = {
    name: 'banner'
};

