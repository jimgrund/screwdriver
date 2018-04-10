'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const hapi = require('hapi');
const mockery = require('mockery');

sinon.assert.expose(assert, { prefix: '' });

describe('banner plugin test', () => {
    let plugin;
    let server;
    let mockStats;

    before(() => {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });
    });

    beforeEach((done) => {
        mockStats = {
            banner: sinon.stub()
        };

        /* eslint-disable global-require */
        plugin = require('../../plugins/banner');
        /* eslint-enable global-require */

        server = new hapi.Server();
        server.connection({
            port: 1234
        });

        server.register([{
            register: plugin,
            options: {
                executor: mockStats,
                scm: mockStats
            }
        }], (err) => {
            done(err);
        });
    });

    afterEach(() => {
        server = null;
        mockery.deregisterAll();
        mockery.resetCache();
    });

    after(() => {
        mockery.disable();
    });

    it('registers the plugin', () => {
        assert.isOk(server.registrations.banner);
    });

    describe('GET /banner', () => {
        it('returns 200 for a successful yaml', () => {
            const mockReturn = {
                foo: 'bar'
            };

            mockStats.banner.returns(mockReturn);

            return server.inject({
                url: '/banner'
            }).then((reply) => {
                assert.equal(reply.statusCode, 200);
                assert.deepEqual(reply.result, {
                    executor: mockReturn,
                    scm: mockReturn
                });
            });
        });
    });
});
