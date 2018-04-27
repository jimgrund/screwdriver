'use strict';

const boom = require('boom');
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
            strategies: ['token'],
            scope: ['user', '!guest']
        },
        plugins: {
            'hapi-swagger': {
                security: [{ token: [] }]
            }
        },
        handler: (request, reply) => {
            const { bannerFactory } = request.server.app;

            return bannerFactory.get({ id: request.banner.id })
                // something broke, respond with error
                .catch(err => reply(boom.wrap(err)));
        },
        validate: {
            payload: schema.models.banner.create
        }
    }
});
