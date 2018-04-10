'use strict';

// const boom = require('boom');
const schema = require('screwdriver-data-schema');
// const urlLib = require('url');

module.exports = () => ({
    method: 'POST',
    path: '/banners',
    config: {
        description: 'Create a new banner',
        notes: 'Create a specific banner',
        tags: ['api', 'banner'],
        auth: {
            strategies: ['token', 'banners'],
            scope: ['user']
        },
        plugins: {
            'hapi-swagger': {
                security: [{ token: [] }]
            }
        },
        validate: {
            payload: schema.models.banner.create
        }
    }
});
