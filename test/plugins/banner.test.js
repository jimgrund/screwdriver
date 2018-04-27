'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const hapi = require('hapi');
const mockery = require('mockery');
const testBanner = require('./data/banner.json');

sinon.assert.expose(assert, { prefix: '' });

const getMock = (obj) => {
    const mock = Object.assign({}, obj);

    mock.update = sinon.stub();
    mock.toJson = sinon.stub().returns(obj);
    mock.remove = sinon.stub();

    return mock;
};

const getBannersMock = (banners) => {
    if (Array.isArray(banners)) {
        return banners.map(getMock);
    }

    return getMock(banners);
};

describe('banner plugin test', () => {
    let plugin;
    let server;
    let bannerFactoryMock;
    let bannerMock;
    const apiUri = 'http://foo.bar:12345';

    before(() => {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });
    });

    beforeEach((done) => {
        bannerFactoryMock = {
            create: sinon.stub(),
            get: sinon.stub(),
            list: sinon.stub()
        };

        bannerMock = getMock(testBanner);
        bannerMock.remove.resolves(null);
        bannerMock.update.resolves(bannerMock);
        bannerFactoryMock.create.resolves(bannerMock);

        /* eslint-disable global-require */
        plugin = require('../../plugins/banner');
        /* eslint-enable global-require */

        server = new hapi.Server();
        server.app = {
            bannerFactory: bannerFactoryMock
        };
        server.connection({
            host: 'localhost',
            port: 1234,
            uri: apiUri
        });

        server.auth.scheme('custom', () => ({
            authenticate: (request, reply) => reply.continue()
        }));
        server.auth.strategy('token', 'custom');

        console.log(server);

        return server.register([{
            register: plugin
        }], (err) => {
            console.log('errrrrr');
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

    it.only('registers the plugin', () => {
        assert.isOk(server.registrations.banner);
    });

    describe('GET /banner', () => {
        let options;

        beforeEach(() => {
            options = {
                method: 'GET',
                url: '/banner'
            };
        });

        it('returns 200 for a successful yaml', () => {
            bannerFactoryMock.list.resolves(getBannersMock(testBanner));

            return server.inject(options).then((reply) => {
                assert.equal(reply.statusCode, 200);
                assert.deepEqual(reply.result, testBanner);
            });
        });
    });
});
