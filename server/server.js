/* eslint-disable quotes */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('http'), require('fs'), require('crypto')) :
        typeof define === 'function' && define.amd ? define(['http', 'fs', 'crypto'], factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Server = factory(global.http, global.fs, global.crypto));
}(this, (function (http, fs, crypto) {
    'use strict';

    function _interopDefaultLegacy(e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
    var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
    var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

    class ServiceError extends Error {
        constructor(message = 'Service Error') {
            super(message);
            this.name = 'ServiceError';
        }
    }

    class NotFoundError extends ServiceError {
        constructor(message = 'Resource not found') {
            super(message);
            this.name = 'NotFoundError';
            this.status = 404;
        }
    }

    class RequestError extends ServiceError {
        constructor(message = 'Request error') {
            super(message);
            this.name = 'RequestError';
            this.status = 400;
        }
    }

    class ConflictError extends ServiceError {
        constructor(message = 'Resource conflict') {
            super(message);
            this.name = 'ConflictError';
            this.status = 409;
        }
    }

    class AuthorizationError extends ServiceError {
        constructor(message = 'Unauthorized') {
            super(message);
            this.name = 'AuthorizationError';
            this.status = 401;
        }
    }

    class CredentialError extends ServiceError {
        constructor(message = 'Forbidden') {
            super(message);
            this.name = 'CredentialError';
            this.status = 403;
        }
    }

    var errors = {
        ServiceError,
        NotFoundError,
        RequestError,
        ConflictError,
        AuthorizationError,
        CredentialError
    };

    const { ServiceError: ServiceError$1 } = errors;

    function createHandler(plugins, services) {
        return async function handler(req, res) {
            const method = req.method;
            console.info(`<< ${req.method} ${req.url}`);

            // Redirect fix for admin panel relative paths
            if (req.url.slice(-6) == '/admin') {
                res.writeHead(302, {
                    'Location': `http://${req.headers.host}/admin/`
                });
                return res.end();
            }

            let status = 200;
            let headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            };
            let result = '';
            let context;

            // NOTE: the OPTIONS method results in undefined result and also it never processes plugins - keep this in mind
            if (method == 'OPTIONS') {
                Object.assign(headers, {
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Credentials': false,
                    'Access-Control-Max-Age': '86400',
                    'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Authorization, X-Admin'
                });
            } else {
                try {
                    context = processPlugins();
                    await handle(context);
                } catch (err) {
                    if (err instanceof ServiceError$1) {
                        status = err.status || 400;
                        result = composeErrorObject(err.code || status, err.message);
                    } else {
                        // Unhandled exception, this is due to an error in the service code - REST consumers should never have to encounter this;
                        // If it happens, it must be debugged in a future version of the server
                        console.error(err);
                        status = 500;
                        result = composeErrorObject(500, 'Server Error');
                    }
                }
            }

            res.writeHead(status, headers);
            if (context != undefined && context.util != undefined && context.util.throttle) {
                await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
            }
            res.end(result);

            function processPlugins() {
                const context = { params: {} };
                plugins.forEach(decorate => decorate(context, req));
                return context;
            }

            async function handle(context) {
                const { serviceName, tokens, query, body } = await parseRequest(req);
                if (serviceName == 'admin') {
                    return ({ headers, result } = services['admin'](method, tokens, query, body));
                } else if (serviceName == 'favicon.ico') {
                    return ({ headers, result } = services['favicon'](method, tokens, query, body));
                }

                const service = services[serviceName];

                if (service === undefined) {
                    status = 400;
                    result = composeErrorObject(400, `Service "${serviceName}" is not supported`);
                    console.error('Missing service ' + serviceName);
                } else {
                    result = await service(context, { method, tokens, query, body });
                }

                // NOTE: logout does not return a result
                // in this case the content type header should be omitted, to allow checks on the client
                if (result !== undefined) {
                    result = JSON.stringify(result);
                } else {
                    status = 204;
                    delete headers['Content-Type'];
                }
            }
        };
    }

    function composeErrorObject(code, message) {
        return JSON.stringify({
            code,
            message
        });
    }

    async function parseRequest(req) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const tokens = url.pathname.split('/').filter(x => x.length > 0);
        const serviceName = tokens.shift();
        const queryString = url.search.split('?')[1] || '';
        const query = queryString
            .split('&')
            .filter(s => s != '')
            .map(x => x.split('='))
            .reduce((p, [k, v]) => Object.assign(p, { [k]: decodeURIComponent(v) }), {});
        const body = await parseBody(req);

        return {
            serviceName,
            tokens,
            query,
            body
        };
    }

    function parseBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', (chunk) => body += chunk.toString());
            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (err) {
                    resolve(body);
                }
            });
        });
    }

    var requestHandler = createHandler;

    class Service {
        constructor() {
            this._actions = [];
            this.parseRequest = this.parseRequest.bind(this);
        }

        /**
         * Handle service request, after it has been processed by a request handler
         * @param {*} context Execution context, contains result of middleware processing
         * @param {{method: string, tokens: string[], query: *, body: *}} request Request parameters
         */
        async parseRequest(context, request) {
            for (let { method, name, handler } of this._actions) {
                if (method === request.method && matchAndAssignParams(context, request.tokens[0], name)) {
                    return await handler(context, request.tokens.slice(1), request.query, request.body);
                }
            }
        }

        /**
         * Register service action
         * @param {string} method HTTP method
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        registerAction(method, name, handler) {
            this._actions.push({ method, name, handler });
        }

        /**
         * Register GET action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        get(name, handler) {
            this.registerAction('GET', name, handler);
        }

        /**
         * Register POST action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        post(name, handler) {
            this.registerAction('POST', name, handler);
        }

        /**
         * Register PUT action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        put(name, handler) {
            this.registerAction('PUT', name, handler);
        }

        /**
         * Register PATCH action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        patch(name, handler) {
            this.registerAction('PATCH', name, handler);
        }

        /**
         * Register DELETE action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        delete(name, handler) {
            this.registerAction('DELETE', name, handler);
        }
    }

    function matchAndAssignParams(context, name, pattern) {
        if (pattern == '*') {
            return true;
        } else if (pattern[0] == ':') {
            context.params[pattern.slice(1)] = name;
            return true;
        } else if (name == pattern) {
            return true;
        } else {
            return false;
        }
    }

    var Service_1 = Service;

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    var util = {
        uuid
    };

    const uuid$1 = util.uuid;

    const data = fs__default['default'].existsSync('./data') ? fs__default['default'].readdirSync('./data').reduce((p, c) => {
        const content = JSON.parse(fs__default['default'].readFileSync('./data/' + c));
        const collection = c.slice(0, -5);
        p[collection] = {};
        for (let endpoint in content) {
            p[collection][endpoint] = content[endpoint];
        }
        return p;
    }, {}) : {};

    const actions = {
        get: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            let responseData = data;
            for (let token of tokens) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            return responseData;
        },
        post: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            // TODO handle collisions, replacement
            let responseData = data;
            for (let token of tokens) {
                if (responseData.hasOwnProperty(token) == false) {
                    responseData[token] = {};
                }
                responseData = responseData[token];
            }

            const newId = uuid$1();
            responseData[newId] = Object.assign({}, body, { _id: newId });
            return responseData[newId];
        },
        put: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            let responseData = data;
            for (let token of tokens.slice(0, -1)) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            if (responseData !== undefined && responseData[tokens.slice(-1)] !== undefined) {
                responseData[tokens.slice(-1)] = body;
            }
            return responseData[tokens.slice(-1)];
        },
        patch: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            let responseData = data;
            for (let token of tokens) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            if (responseData !== undefined) {
                Object.assign(responseData, body);
            }
            return responseData;
        },
        delete: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            let responseData = data;

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (responseData.hasOwnProperty(token) == false) {
                    return null;
                }
                if (i == tokens.length - 1) {
                    const body = responseData[token];
                    delete responseData[token];
                    return body;
                } else {
                    responseData = responseData[token];
                }
            }
        }
    };

    const dataService = new Service_1();
    dataService.get(':collection', actions.get);
    dataService.post(':collection', actions.post);
    dataService.put(':collection', actions.put);
    dataService.patch(':collection', actions.patch);
    dataService.delete(':collection', actions.delete);

    var jsonstore = dataService.parseRequest;

    /*
     * This service requires storage and auth plugins
     */

    const { AuthorizationError: AuthorizationError$1 } = errors;

    const userService = new Service_1();

    userService.get('me', getSelf);
    userService.post('register', onRegister);
    userService.post('login', onLogin);
    userService.get('logout', onLogout);


    function getSelf(context, tokens, query, body) {
        if (context.user) {
            const result = Object.assign({}, context.user);
            delete result.hashedPassword;
            return result;
        } else {
            throw new AuthorizationError$1();
        }
    }

    function onRegister(context, tokens, query, body) {
        return context.auth.register(body);
    }

    function onLogin(context, tokens, query, body) {
        return context.auth.login(body);
    }

    function onLogout(context, tokens, query, body) {
        return context.auth.logout();
    }

    var users = userService.parseRequest;

    const { NotFoundError: NotFoundError$1, RequestError: RequestError$1 } = errors;

    var crud = {
        get,
        post,
        put,
        patch,
        delete: del
    };


    function validateRequest(context, tokens, query) {
        /*
        if (context.params.collection == undefined) {
            throw new RequestError('Please, specify collection name');
        }
        */
        if (tokens.length > 1) {
            throw new RequestError$1();
        }
    }

    function parseWhere(query) {
        const operators = {
            '<=': (prop, value) => record => record[prop] <= JSON.parse(value),
            '<': (prop, value) => record => record[prop] < JSON.parse(value),
            '>=': (prop, value) => record => record[prop] >= JSON.parse(value),
            '>': (prop, value) => record => record[prop] > JSON.parse(value),
            '=': (prop, value) => record => record[prop] == JSON.parse(value),
            ' like ': (prop, value) => record => record[prop].toLowerCase().includes(JSON.parse(value).toLowerCase()),
            ' in ': (prop, value) => record => JSON.parse(`[${/\((.+?)\)/.exec(value)[1]}]`).includes(record[prop]),
        };
        const pattern = new RegExp(`^(.+?)(${Object.keys(operators).join('|')})(.+?)$`, 'i');

        try {
            let clauses = [query.trim()];
            let check = (a, b) => b;
            let acc = true;
            if (query.match(/ and /gi)) {
                // inclusive
                clauses = query.split(/ and /gi);
                check = (a, b) => a && b;
                acc = true;
            } else if (query.match(/ or /gi)) {
                // optional
                clauses = query.split(/ or /gi);
                check = (a, b) => a || b;
                acc = false;
            }
            clauses = clauses.map(createChecker);

            return (record) => clauses
                .map(c => c(record))
                .reduce(check, acc);
        } catch (err) {
            throw new Error('Could not parse WHERE clause, check your syntax.');
        }

        function createChecker(clause) {
            let [match, prop, operator, value] = pattern.exec(clause);
            [prop, value] = [prop.trim(), value.trim()];

            return operators[operator.toLowerCase()](prop, value);
        }
    }

    function get(context, tokens, query, body) {
        validateRequest(context, tokens);

        let responseData;

        try {
            if (query.where) {
                responseData = context.storage.get(context.params.collection).filter(parseWhere(query.where));
            } else if (context.params.collection) {
                responseData = context.storage.get(context.params.collection, tokens[0]);
            } else {
                // Get list of collections
                return context.storage.get();
            }

            if (query.sortBy) {
                const props = query.sortBy
                    .split(',')
                    .filter(p => p != '')
                    .map(p => p.split(' ').filter(p => p != ''))
                    .map(([p, desc]) => ({ prop: p, desc: desc ? true : false }));

                // Sorting priority is from first to last, therefore we sort from last to first
                for (let i = props.length - 1; i >= 0; i--) {
                    let { prop, desc } = props[i];
                    responseData.sort(({ [prop]: propA }, { [prop]: propB }) => {
                        if (typeof propA == 'number' && typeof propB == 'number') {
                            return (propA - propB) * (desc ? -1 : 1);
                        } else {
                            return propA.localeCompare(propB) * (desc ? -1 : 1);
                        }
                    });
                }
            }

            if (query.offset) {
                responseData = responseData.slice(Number(query.offset) || 0);
            }
            const pageSize = Number(query.pageSize) || 10;
            if (query.pageSize) {
                responseData = responseData.slice(0, pageSize);
            }

            if (query.distinct) {
                const props = query.distinct.split(',').filter(p => p != '');
                responseData = Object.values(responseData.reduce((distinct, c) => {
                    const key = props.map(p => c[p]).join('::');
                    if (distinct.hasOwnProperty(key) == false) {
                        distinct[key] = c;
                    }
                    return distinct;
                }, {}));
            }

            if (query.count) {
                return responseData.length;
            }

            if (query.select) {
                const props = query.select.split(',').filter(p => p != '');
                responseData = Array.isArray(responseData) ? responseData.map(transform) : transform(responseData);

                function transform(r) {
                    const result = {};
                    props.forEach(p => result[p] = r[p]);
                    return result;
                }
            }

            if (query.load) {
                const props = query.load.split(',').filter(p => p != '');
                props.map(prop => {
                    const [propName, relationTokens] = prop.split('=');
                    const [idSource, collection] = relationTokens.split(':');
                    console.log(`Loading related records from "${collection}" into "${propName}", joined on "_id"="${idSource}"`);
                    const storageSource = collection == 'users' ? context.protectedStorage : context.storage;
                    responseData = Array.isArray(responseData) ? responseData.map(transform) : transform(responseData);

                    function transform(r) {
                        const seekId = r[idSource];
                        const related = storageSource.get(collection, seekId);
                        delete related.hashedPassword;
                        r[propName] = related;
                        return r;
                    }
                });
            }

        } catch (err) {
            console.error(err);
            if (err.message.includes('does not exist')) {
                throw new NotFoundError$1();
            } else {
                throw new RequestError$1(err.message);
            }
        }

        context.canAccess(responseData);

        return responseData;
    }

    function post(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length > 0) {
            throw new RequestError$1('Use PUT to update records');
        }
        context.canAccess(undefined, body);

        body._ownerId = context.user._id;
        let responseData;

        try {
            responseData = context.storage.add(context.params.collection, body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function put(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing, body);

        try {
            responseData = context.storage.set(context.params.collection, tokens[0], body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function patch(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing, body);

        try {
            responseData = context.storage.merge(context.params.collection, tokens[0], body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function del(context, tokens, query, body) {
        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing);

        try {
            responseData = context.storage.delete(context.params.collection, tokens[0]);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    /*
     * This service requires storage and auth plugins
     */

    const dataService$1 = new Service_1();
    dataService$1.get(':collection', crud.get);
    dataService$1.post(':collection', crud.post);
    dataService$1.put(':collection', crud.put);
    dataService$1.patch(':collection', crud.patch);
    dataService$1.delete(':collection', crud.delete);

    var data$1 = dataService$1.parseRequest;

    const imgdata = 'iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAPNnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHja7ZpZdiS7DUT/uQovgSQ4LofjOd6Bl+8LZqpULbWm7vdnqyRVKQeCBAKBAFNm/eff2/yLr2hzMSHmkmpKlq9QQ/WND8VeX+38djac3+cr3af4+5fj5nHCc0h4l+vP8nJicdxzeN7Hxz1O43h8Gmi0+0T/9cT09/jlNuAeBs+XuMuAvQ2YeQ8k/jrhwj2Re3mplvy8hH3PKPr7SLl+jP6KkmL2OeErPnmbQ9q8Rmb0c2ynxafzO+eET7mC65JPjrM95exN2jmmlYLnophSTKLDZH+GGAwWM0cyt3C8nsHWWeG4Z/Tio7cHQiZ2M7JK8X6JE3t++2v5oj9O2nlvfApc50SkGQ5FDnm5B2PezJ8Bw1PUPvl6cYv5G788u8V82y/lPTgfn4CC+e2JN+Ds5T4ubzCVHu8M9JsTLr65QR5m/LPhvh6G/S8zcs75XzxZXn/2nmXvda2uhURs051x51bzMgwXdmIl57bEK/MT+ZzPq/IqJPEA+dMO23kNV50HH9sFN41rbrvlJu/DDeaoMci8ez+AjB4rkn31QxQxQV9u+yxVphRgM8CZSDDiH3Nxx2499oYrWJ6OS71jMCD5+ct8dcF3XptMNupie4XXXQH26nCmoZHT31xGQNy+4xaPg19ejy/zFFghgvG4ubDAZvs1RI/uFVtyACBcF3m/0sjlqVHzByUB25HJOCEENjmJLjkL2LNzQXwhQI2Ze7K0EwEXo59M0geRRGwKOMI292R3rvXRX8fhbuJDRkomNlUawQohgp8cChhqUWKIMZKxscQamyEBScaU0knM1E6WxUxO5pJrbkVKKLGkkksptbTqq1AjYiWLa6m1tobNFkyLjbsbV7TWfZceeuyp51567W0AnxFG1EweZdTRpp8yIayZZp5l1tmWI6fFrLDiSiuvsupqG6xt2WFHOCXvsutuj6jdUX33+kHU3B01fyKl1+VH1Diasw50hnDKM1FjRsR8cEQ8awQAtNeY2eJC8Bo5jZmtnqyInklGjc10thmXCGFYzsftHrF7jdy342bw9Vdx89+JnNHQ/QOR82bJm7j9JmqnGo8TsSsL1adWyD7Or9J8aTjbXx/+9v3/A/1vDUS9tHOXtLaM6JoBquRHJFHdaNU5oF9rKVSjYNewoFNsW032cqqCCx/yljA2cOy7+7zJ0biaicv1TcrWXSDXVT3SpkldUqqPIJj8p9oeWVs4upKL3ZHgpNzYnTRv5EeTYXpahYRgfC+L/FyxBphCmPLK3W1Zu1QZljTMJe5AIqmOyl0qlaFCCJbaPAIMWXzurWAMXiB1fGDtc+ld0ZU12k5cQq4v7+AB2x3qLlQ3hyU/uWdzzgUTKfXSputZRtp97hZ3z4EE36WE7WtjbqMtMr912oRp47HloZDlywxJ+uyzmrW91OivysrM1Mt1rZbrrmXm2jZrYWVuF9xZVB22jM4ccdaE0kh5jIrnzBy5w6U92yZzS1wrEao2ZPnE0tL0eRIpW1dOWuZ1WlLTqm7IdCESsV5RxjQ1/KWC/y/fPxoINmQZI8Cli9oOU+MJYgrv006VQbRGC2Ug8TYzrdtUHNjnfVc6/oN8r7tywa81XHdZN1QBUhfgzRLzmPCxu1G4sjlRvmF4R/mCYdUoF2BYNMq4AjD2GkMGhEt7PAJfKrH1kHmj8eukyLb1oCGW/WdAtx0cURYqtcGnNlAqods6UnaRpY3LY8GFbPeSrjKmsvhKnWTtdYKhRW3TImUqObdpGZgv3ltrdPwwtD+l1FD/htxAwjdUzhtIkWNVy+wBUmDtphwgVemd8jV1miFXWTpumqiqvnNuArCrFMbLPexJYpABbamrLiztZEIeYPasgVbnz9/NZxe4p/B+FV3zGt79B9S0Jc0Lu+YH4FXsAsa2YnRIAb2thQmGc17WdNd9cx4+y4P89EiVRKB+CvRkiPTwM7Ts+aZ5aV0C4zGoqyOGJv3yGMJaHXajKbOGkm40Ychlkw6c6hZ4s+SDJpsmncwmm8ChEmBWspX8MkFB+kzF1ZlgoGWiwzY6w4AIPDOcJxV3rtUnabEgoNBB4MbNm8GlluVIpsboaKl0YR8kGnXZH3JQZrH2MDxxRrHFUduh+CvQszakraM9XNo7rEVjt8VpbSOnSyD5dwLfVI4+Sl+DCZc5zU6zhrXnRhZqUowkruyZupZEm/dA2uVTroDg1nfdJMBua9yCJ8QPtGw2rkzlYLik5SBzUGSoOqBMJvwTe92eGgOVx8/T39TP0r/PYgfkP1IEyGVhYHXyJiVPU0skB3dGqle6OZuwj/Hw5c2gV5nEM6TYaAryq3CRXsj1088XNwt0qcliqNc6bfW+TttRydKpeJOUWTmmUiwJKzpr6hkVzzLrVs+s66xEiCwOzfg5IRgwQgFgrriRlg6WQS/nGyRUNDjulWsUbO8qu/lWaWeFe8QTs0puzrxXH1H0b91KgDm2dkdrpkpx8Ks2zZu4K1GHPpDxPdCL0RH0SZZrGX8hRKTA+oUPzQ+I0K1C16ZSK6TR28HUdlnfpzMsIvd4TR7iuSe/+pn8vief46IQULRGcHvRVUyn9aYeoHbGhEbct+vEuzIxhxJrgk1oyo3AFA7eSSSNI/Vxl0eLMCrJ/j1QH0ybj0C9VCn9BtXbz6Kd10b8QKtpTnecbnKHWZxcK2OiKCuViBHqrzM2T1uFlGJlMKFKRF1Zy6wMqQYtgKYc4PFoGv2dX2ixqGaoFDhjzRmp4fsygFZr3t0GmBqeqbcBFpvsMVCNajVWcLRaPBhRKc4RCCUGZphKJdisKdRjDKdaNbZfwM5BulzzCvyv0AsAlu8HOAdIXAuMAg0mWa0+0vgrODoHlm7Y7rXUHmm9r2RTLpXwOfOaT6iZdASpqOIXfiABLwQkrSPFXQgAMHjYyEVrOBESVgS4g4AxcXyiPwBiCF6g2XTPk0hqn4D67rbQVFv0Lam6Vfmvq90B3WgV+peoNRb702/tesrImcBCvIEaGoI/8YpKa1XmDNr1aGUwjDETBa3VkOLYVLGKeWQcd+WaUlsMdTdUg3TcUPvdT20ftDW4+injyAarDRVVRgc906sNTo1cu7LkDGewjkQ35Z7l4Htnx9MCkbenKiNMsif+5BNVnA6op3gZVZtjIAacNia+00w1ZutIibTMOJ7IISctvEQGDxEYDUSxUiH4R4kkH86dMywCqVJ2XpzkUYUgW3mDPmz0HLW6w9daRn7abZmo4QR5i/A21r4oEvCC31oajm5CR1yBZcIfN7rmgxM9qZBhXh3C6NR9dCS1PTMJ30c4fEcwkq0IXdphpB9eg4x1zycsof4t6C4jyS68eW7OonpSEYCzb5dWjQH3H5fWq2SH41O4LahPrSJA77KqpJYwH6pdxDfDIgxLR9GptCKMoiHETrJ0wFSR3Sk7yI97KdBVSHXeS5FBnYKIz1JU6VhdCkfHIP42o0V6aqgg00JtZfdK6hPeojtXvgfnE/VX0p0+fqxp2/nDfvBuHgeo7ppkrr/MyU1dT73n5B/qi76+lzMnVnHRJDeZOyj3XXdQrrtOUPQunDqgDlz+iuS3QDafITkJd050L0Hi2kiRBX52pIVso0ZpW1YQsT2VRgtxm9iiqU2qXyZ0OdvZy0J1gFotZFEuGrnt3iiiXvECX+UcWBqpPlgLRkdN7cpl8PxDjWseAu1bPdCjBSrQeVD2RHE7bRhMb1Qd3VHVXVNBewZ3Wm7avbifhB+4LNQrmp0WxiCNkm7dd7mV39SnokrvfzIr+oDSFq1D76MZchw6Vl4Z67CL01I6ZiX/VEqfM1azjaSkKqC+kx67tqTg5ntLii5b96TAA3wMTx2NvqsyyUajYQHJ1qkpmzHQITXDUZRGTYtNw9uLSndMmI9tfMdEeRgwWHB7NlosyivZPlvT5KIOc+GefU9UhA4MmKFXmhAuJRFVWHRJySbREImpQysz4g3uJckihD7P84nWtLo7oR4tr8IKdSBXYvYaZnm3ffhh9nyWPDa+zQfzdULsFlr/khrMb7hhAroOKSZgxbUzqdiVIhQc+iZaTbpesLXSbIfbjwXTf8AjbnV6kTpD4ZsMdXMK45G1NRiMdh/bLb6oXX+4rWHen9BW+xJDV1N+i6HTlKdLDMnVkx8tdHryus3VlCOXXKlDIiuOkimXnmzmrtbGqmAHL1TVXU73PX5nx3xhSO3QKtBqbd31iQHHBNXXrYIXHVyQqDGIcc6qHEcz2ieN+radKS9br/cGzC0G7g0YFQPGdqs7MI6pOt2BgYtt/4MNW8NJ3VT5es/izZZFd9yIfwY1lUubGSSnPiWWzDpAN+sExNptEoBx74q8bAzdFu6NocvC2RgK2WR7doZodiZ6OgoUrBoWIBM2xtMHXUX3GGktr5RtwPZ9tTWfleFP3iEc2hTar6IC1Y55ktYKQtXTsKkfgQ+al0aXBCh2dlCxdBtLtc8QJ4WUKIX+jlRR/TN9pXpNA1bUC7LaYUzJvxr6rh2Q7ellILBd0PcFF5F6uArA6ODZdjQYosZpf7lbu5kNFfbGUUY5C2p7esLhhjw94Miqk+8tDPgTVXX23iliu782KzsaVdexRSq4NORtmY3erV/NFsJU9S7naPXmPGLYvuy5USQA2pcb4z/fYafpPj0t5HEeD1y7W/Z+PHA2t8L1eGCCeFS/Ph04Hafu+Uf8ly2tjUNDQnNUIOqVLrBLIwxK67p3fP7LaX/LjnlniCYv6jNK0ce5YrPud1Gc6LQWg+sumIt2hCCVG3e8e5tsLAL2qWekqp1nKPKqKIJcmxO3oljxVa1TXVDVWmxQ/lhHHnYNP9UDrtFdwekRKCueDRSRAYoo0nEssbG3znTTDahVUXyDj+afeEhn3w/UyY0fSv5b8ZuSmaDVrURYmBrf0ZgIMOGuGFNG3FH45iA7VFzUnj/odcwHzY72OnQEhByP3PtKWxh/Q+/hkl9x5lEic5ojDGgEzcSpnJEwY2y6ZN0RiyMBhZQ35AigLvK/dt9fn9ZJXaHUpf9Y4IxtBSkanMxxP6xb/pC/I1D1icMLDcmjZlj9L61LoIyLxKGRjUcUtOiFju4YqimZ3K0odbd1Usaa7gPp/77IJRuOmxAmqhrWXAPOftoY0P/BsgifTmC2ChOlRSbIMBjjm3bQIeahGwQamM9wHqy19zaTCZr/AtjdNfWMu8SZAAAA13pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHjaPU9LjkMhDNtzijlCyMd5HKflgdRdF72/xmFGJSIEx9ihvd6f2X5qdWizy9WH3+KM7xrRp2iw6hLARIfnSKsqoRKGSEXA0YuZVxOx+QcnMMBKJR2bMdNUDraxWJ2ciQuDDPKgNDA8kakNOwMLriTRO2Alk3okJsUiidC9Ex9HbNUMWJz28uQIzhhNxQduKhdkujHiSJVTCt133eqpJX/6MDXh7nrXydzNq9tssr14NXuwFXaoh/CPiLRfLvxMyj3GtTgAAAGFaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1NFKfUD7CDikKE6WRAVESepYhEslLZCqw4ml35Bk4YkxcVRcC04+LFYdXBx1tXBVRAEP0Dc3JwUXaTE/yWFFjEeHPfj3b3H3TtAqJeZanaMA6pmGclYVMxkV8WuVwjoRQCz6JeYqcdTi2l4jq97+Ph6F+FZ3uf+HD1KzmSATySeY7phEW8QT29aOud94hArSgrxOfGYQRckfuS67PIb54LDAs8MGenkPHGIWCy0sdzGrGioxFPEYUXVKF/IuKxw3uKslquseU/+wmBOW0lxneYwYlhCHAmIkFFFCWVYiNCqkWIiSftRD/+Q40+QSyZXCYwcC6hAheT4wf/gd7dmfnLCTQpGgc4X2/4YAbp2gUbNtr+PbbtxAvifgSut5a/UgZlP0mstLXwE9G0DF9ctTd4DLneAwSddMiRH8tMU8nng/Yy+KQsM3AKBNbe35j5OH4A0dbV8AxwcAqMFyl73eHd3e2//nmn29wOGi3Kv+RixSgAAEkxpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjdjZDM3NWM3LTcwNmItNDlkMy1hOWRkLWNmM2Q3MmMwY2I4ZCIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NGY2YTJlYy04ZjA5LTRkZTMtOTY3ZC05MTUyY2U5NjYxNTAiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMmE1NzI5Mi1kNmJkLTRlYjQtOGUxNi1hODEzYjMwZjU0NWYiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjEzMzAwNzI5NTMwNjQzIgogICBHSU1QOlZlcnNpb249IjIuMTAuMTIiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBwaG90b3Nob3A6Q3JlZGl0PSJHZXR0eSBJbWFnZXMvaVN0b2NrcGhvdG8iCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwczovL3d3dy5pc3RvY2twaG90by5jb20vbGVnYWwvbGljZW5zZS1hZ3JlZW1lbnQ/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmwiPgogICA8aXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgIDxpcHRjRXh0OkxvY2F0aW9uU2hvd24+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvblNob3duPgogICA8aXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgIDxpcHRjRXh0OlJlZ2lzdHJ5SWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpSZWdpc3RyeUlkPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjOTQ2M2MxMC05OWE4LTQ1NDQtYmRlOS1mNzY0ZjdhODJlZDkiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoV2luZG93cykiCiAgICAgIHN0RXZ0OndoZW49IjIwMjEtMDItMTRUMTM6MDU6MjkiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogICA8cGx1czpJbWFnZVN1cHBsaWVyPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VTdXBwbGllcj4KICAgPHBsdXM6SW1hZ2VDcmVhdG9yPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VDcmVhdG9yPgogICA8cGx1czpDb3B5cmlnaHRPd25lcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkNvcHlyaWdodE93bmVyPgogICA8cGx1czpMaWNlbnNvcj4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgcGx1czpMaWNlbnNvclVSTD0iaHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL3Bob3RvL2xpY2Vuc2UtZ20xMTUwMzQ1MzQxLT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIvPgogICAgPC9yZGY6U2VxPgogICA8L3BsdXM6TGljZW5zb3I+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5WbGFkeXNsYXYgU2VyZWRhPC9yZGY6bGk+CiAgICA8L3JkZjpTZXE+CiAgIDwvZGM6Y3JlYXRvcj4KICAgPGRjOmRlc2NyaXB0aW9uPgogICAgPHJkZjpBbHQ+CiAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5TZXJ2aWNlIHRvb2xzIGljb24gb24gd2hpdGUgYmFja2dyb3VuZC4gVmVjdG9yIGlsbHVzdHJhdGlvbi48L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpkZXNjcmlwdGlvbj4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PmWJCnkAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflAg4LBR0CZnO/AAAARHRFWHRDb21tZW50AFNlcnZpY2UgdG9vbHMgaWNvbiBvbiB3aGl0ZSBiYWNrZ3JvdW5kLiBWZWN0b3IgaWxsdXN0cmF0aW9uLlwvEeIAAAMxSURBVHja7Z1bcuQwCEX7qrLQXlp2ynxNVWbK7dgWj3sl9JvYRhxACD369erW7UMzx/cYaychonAQvXM5ABYkpynoYIiEGdoQog6AYfywBrCxF4zNrX/7McBbuXJe8rXx/KBDULcGsMREzCbeZ4J6ME/9wVH5d95rogZp3npEgPLP3m2iUSGqXBJS5Dr6hmLm8kRuZABYti5TMaailV8LodNQwTTUWk4/WZk75l0kM0aZQdaZjMqkrQDAuyMVJWFjMB4GANXr0lbZBxQKr7IjI7QvVWkok/Jn5UHVh61CYPs+/i7eL9j3y/Au8WqoAIC34k8/9k7N8miLcaGWHwgjZXE/awyYX7h41wKMCskZM2HXAddDkTdglpSjz5bcKPbcCEKwT3+DhxtVpJvkEC7rZSgq32NMSBoXaCdiahDCKrND0fpX8oQlVsQ8IFQZ1VARdIF5wroekAjB07gsAgDUIbQHFENIDEX4CQANIVe8Iw/ASiACLXl28eaf579OPuBa9/mrELUYHQ1t3KHlZZnRcXb2/c7ygXIQZqjDMEzeSrOgCAhqYMvTUE+FKXoVxTxgk3DEPREjGzj3nAk/VaKyB9GVIu4oMyOlrQZgrBBEFG9PAZTfs3amYDGrP9Wl964IeFvtz9JFluIvlEvcdoXDOdxggbDxGwTXcxFRi/LdirKgZUBm7SUdJG69IwSUzAMWgOAq/4hyrZVaJISSNWHFVbEoCFEhyBrCtXS9L+so9oTy8wGqxbQDD350WTjNESVFEB5hdKzUGcV5QtYxVWR2Ssl4Mg9qI9u6FCBInJRXgfEEgtS9Cgrg7kKouq4mdcDNBnEHQvWFTdgdgsqP+MiluVeBM13ahx09AYSWi50gsF+I6vn7BmCEoHR3NBzkpIOw4+XdVBBGQUioblaZHbGlodtB+N/jxqwLX/x/NARfD8ADxTOCKIcwE4Lw0OIbguMYcGTlymEpHYLXIKx8zQEqIfS2lGJPaADFEBR/PMH79ErqtpnZmTBlvM4wgihPWDEEhXn1LISj50crNgfCp+dWHYQRCfb2zgfnBZmKGAyi914anK9Coi4LOMhoAn3uVtn+AGnLKxPUZnCuAAAAAElFTkSuQmCC';
    const img = Buffer.from(imgdata, 'base64');

    var favicon = (method, tokens, query, body) => {
        console.log('serving favicon...');
        const headers = {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        };
        let result = img;

        return {
            headers,
            result
        };
    };

    var require$$0 = "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>SUPS Admin Panel</title>\r\n    <style>\r\n        * {\r\n            padding: 0;\r\n            margin: 0;\r\n        }\r\n\r\n        body {\r\n            padding: 32px;\r\n            font-size: 16px;\r\n        }\r\n\r\n        .layout::after {\r\n            content: '';\r\n            clear: both;\r\n            display: table;\r\n        }\r\n\r\n        .col {\r\n            display: block;\r\n            float: left;\r\n        }\r\n\r\n        p {\r\n            padding: 8px 16px;\r\n        }\r\n\r\n        table {\r\n            border-collapse: collapse;\r\n        }\r\n\r\n        caption {\r\n            font-size: 120%;\r\n            text-align: left;\r\n            padding: 4px 8px;\r\n            font-weight: bold;\r\n            background-color: #ddd;\r\n        }\r\n\r\n        table, tr, th, td {\r\n            border: 1px solid #ddd;\r\n        }\r\n\r\n        th, td {\r\n            padding: 4px 8px;\r\n        }\r\n\r\n        ul {\r\n            list-style: none;\r\n        }\r\n\r\n        .collection-list a {\r\n            display: block;\r\n            width: 120px;\r\n            padding: 4px 8px;\r\n            text-decoration: none;\r\n            color: black;\r\n            background-color: #ccc;\r\n        }\r\n        .collection-list a:hover {\r\n            background-color: #ddd;\r\n        }\r\n        .collection-list a:visited {\r\n            color: black;\r\n        }\r\n    </style>\r\n    <script type=\"module\">\nimport { html, render } from 'https://unpkg.com/lit-html?module';\nimport { until } from 'https://unpkg.com/lit-html/directives/until?module';\n\nconst api = {\r\n    async get(url) {\r\n        return json(url);\r\n    },\r\n    async post(url, body) {\r\n        return json(url, {\r\n            method: 'POST',\r\n            headers: { 'Content-Type': 'application/json' },\r\n            body: JSON.stringify(body)\r\n        });\r\n    }\r\n};\r\n\r\nasync function json(url, options) {\r\n    return await (await fetch('/' + url, options)).json();\r\n}\r\n\r\nasync function getCollections() {\r\n    return api.get('data');\r\n}\r\n\r\nasync function getRecords(collection) {\r\n    return api.get('data/' + collection);\r\n}\r\n\r\nasync function getThrottling() {\r\n    return api.get('util/throttle');\r\n}\r\n\r\nasync function setThrottling(throttle) {\r\n    return api.post('util', { throttle });\r\n}\n\nasync function collectionList(onSelect) {\r\n    const collections = await getCollections();\r\n\r\n    return html`\r\n    <ul class=\"collection-list\">\r\n        ${collections.map(collectionLi)}\r\n    </ul>`;\r\n\r\n    function collectionLi(name) {\r\n        return html`<li><a href=\"javascript:void(0)\" @click=${(ev) => onSelect(ev, name)}>${name}</a></li>`;\r\n    }\r\n}\n\nasync function recordTable(collectionName) {\r\n    const records = await getRecords(collectionName);\r\n    const layout = getLayout(records);\r\n\r\n    return html`\r\n    <table>\r\n        <caption>${collectionName}</caption>\r\n        <thead>\r\n            <tr>${layout.map(f => html`<th>${f}</th>`)}</tr>\r\n        </thead>\r\n        <tbody>\r\n            ${records.map(r => recordRow(r, layout))}\r\n        </tbody>\r\n    </table>`;\r\n}\r\n\r\nfunction getLayout(records) {\r\n    const result = new Set(['_id']);\r\n    records.forEach(r => Object.keys(r).forEach(k => result.add(k)));\r\n\r\n    return [...result.keys()];\r\n}\r\n\r\nfunction recordRow(record, layout) {\r\n    return html`\r\n    <tr>\r\n        ${layout.map(f => html`<td>${JSON.stringify(record[f]) || html`<span>(missing)</span>`}</td>`)}\r\n    </tr>`;\r\n}\n\nasync function throttlePanel(display) {\r\n    const active = await getThrottling();\r\n\r\n    return html`\r\n    <p>\r\n        Request throttling: </span>${active}</span>\r\n        <button @click=${(ev) => set(ev, true)}>Enable</button>\r\n        <button @click=${(ev) => set(ev, false)}>Disable</button>\r\n    </p>`;\r\n\r\n    async function set(ev, state) {\r\n        ev.target.disabled = true;\r\n        await setThrottling(state);\r\n        display();\r\n    }\r\n}\n\n//import page from '//unpkg.com/page/page.mjs';\r\n\r\n\r\nfunction start() {\r\n    const main = document.querySelector('main');\r\n    editor(main);\r\n}\r\n\r\nasync function editor(main) {\r\n    let list = html`<div class=\"col\">Loading&hellip;</div>`;\r\n    let viewer = html`<div class=\"col\">\r\n    <p>Select collection to view records</p>\r\n</div>`;\r\n    display();\r\n\r\n    list = html`<div class=\"col\">${await collectionList(onSelect)}</div>`;\r\n    display();\r\n\r\n    async function display() {\r\n        render(html`\r\n        <section class=\"layout\">\r\n            ${until(throttlePanel(display), html`<p>Loading</p>`)}\r\n        </section>\r\n        <section class=\"layout\">\r\n            ${list}\r\n            ${viewer}\r\n        </section>`, main);\r\n    }\r\n\r\n    async function onSelect(ev, name) {\r\n        ev.preventDefault();\r\n        viewer = html`<div class=\"col\">${await recordTable(name)}</div>`;\r\n        display();\r\n    }\r\n}\r\n\r\nstart();\n\n</script>\r\n</head>\r\n<body>\r\n    <main>\r\n        Loading&hellip;\r\n    </main>\r\n</body>\r\n</html>";

    const mode = process.argv[2] == '-dev' ? 'dev' : 'prod';

    const files = {
        index: mode == 'prod' ? require$$0 : fs__default['default'].readFileSync('./client/index.html', 'utf-8')
    };

    var admin = (method, tokens, query, body) => {
        const headers = {
            'Content-Type': 'text/html'
        };
        let result = '';

        const resource = tokens.join('/');
        if (resource && resource.split('.').pop() == 'js') {
            headers['Content-Type'] = 'application/javascript';

            files[resource] = files[resource] || fs__default['default'].readFileSync('./client/' + resource, 'utf-8');
            result = files[resource];
        } else {
            result = files.index;
        }

        return {
            headers,
            result
        };
    };

    /*
     * This service requires util plugin
     */

    const utilService = new Service_1();

    utilService.post('*', onRequest);
    utilService.get(':service', getStatus);

    function getStatus(context, tokens, query, body) {
        return context.util[context.params.service];
    }

    function onRequest(context, tokens, query, body) {
        Object.entries(body).forEach(([k, v]) => {
            console.log(`${k} ${v ? 'enabled' : 'disabled'}`);
            context.util[k] = v;
        });
        return '';
    }

    var util$1 = utilService.parseRequest;

    var services = {
        jsonstore,
        users,
        data: data$1,
        favicon,
        admin,
        util: util$1
    };

    const { uuid: uuid$2 } = util;


    function initPlugin(settings) {
        const storage = createInstance(settings.seedData);
        const protectedStorage = createInstance(settings.protectedData);

        return function decoreateContext(context, request) {
            context.storage = storage;
            context.protectedStorage = protectedStorage;
        };
    }


    /**
     * Create storage instance and populate with seed data
     * @param {Object=} seedData Associative array with data. Each property is an object with properties in format {key: value}
     */
    function createInstance(seedData = {}) {
        const collections = new Map();

        // Initialize seed data from file    
        for (let collectionName in seedData) {
            if (seedData.hasOwnProperty(collectionName)) {
                const collection = new Map();
                for (let recordId in seedData[collectionName]) {
                    if (seedData.hasOwnProperty(collectionName)) {
                        collection.set(recordId, seedData[collectionName][recordId]);
                    }
                }
                collections.set(collectionName, collection);
            }
        }


        // Manipulation

        /**
         * Get entry by ID or list of all entries from collection or list of all collections
         * @param {string=} collection Name of collection to access. Throws error if not found. If omitted, returns list of all collections.
         * @param {number|string=} id ID of requested entry. Throws error if not found. If omitted, returns of list all entries in collection.
         * @return {Object} Matching entry.
         */
        function get(collection, id) {
            if (!collection) {
                return [...collections.keys()];
            }
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!id) {
                const entries = [...targetCollection.entries()];
                let result = entries.map(([k, v]) => {
                    return Object.assign(deepCopy(v), { _id: k });
                });
                return result;
            }
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }
            const entry = targetCollection.get(id);
            return Object.assign(deepCopy(entry), { _id: id });
        }

        /**
         * Add new entry to collection. ID will be auto-generated
         * @param {string} collection Name of collection to access. If the collection does not exist, it will be created.
         * @param {Object} data Value to store.
         * @return {Object} Original value with resulting ID under _id property.
         */
        function add(collection, data) {
            const record = assignClean({ _ownerId: data._ownerId }, data);

            let targetCollection = collections.get(collection);
            if (!targetCollection) {
                targetCollection = new Map();
                collections.set(collection, targetCollection);
            }
            let id = uuid$2();
            // Make sure new ID does not match existing value
            while (targetCollection.has(id)) {
                id = uuid$2();
            }

            record._createdOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Replace entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @param {Object} data Value to store. Record will be replaced!
         * @return {Object} Updated entry.
         */
        function set(collection, id, data) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }

            const existing = targetCollection.get(id);
            const record = assignSystemProps(deepCopy(data), existing);
            record._updatedOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Modify entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @param {Object} data Value to store. Shallow merge will be performed!
         * @return {Object} Updated entry.
         */
        function merge(collection, id, data) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }

            const existing = deepCopy(targetCollection.get(id));
            const record = assignClean(existing, data);
            record._updatedOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Delete entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @return {{_deletedOn: number}} Server time of deletion.
         */
        function del(collection, id) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }
            targetCollection.delete(id);

            return { _deletedOn: Date.now() };
        }

        /**
         * Search in collection by query object
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {Object} query Query object. Format {prop: value}.
         * @return {Object[]} Array of matching entries.
         */
        function query(collection, query) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            const result = [];
            // Iterate entries of target collection and compare each property with the given query
            for (let [key, entry] of [...targetCollection.entries()]) {
                let match = true;
                for (let prop in entry) {
                    if (query.hasOwnProperty(prop)) {
                        const targetValue = query[prop];
                        // Perform lowercase search, if value is string
                        if (typeof targetValue === 'string' && typeof entry[prop] === 'string') {
                            if (targetValue.toLocaleLowerCase() !== entry[prop].toLocaleLowerCase()) {
                                match = false;
                                break;
                            }
                        } else if (targetValue != entry[prop]) {
                            match = false;
                            break;
                        }
                    }
                }

                if (match) {
                    result.push(Object.assign(deepCopy(entry), { _id: key }));
                }
            }

            return result;
        }

        return { get, add, set, merge, delete: del, query };
    }


    function assignSystemProps(target, entry, ...rest) {
        const whitelist = [
            '_id',
            '_createdOn',
            '_updatedOn',
            '_ownerId'
        ];
        for (let prop of whitelist) {
            if (entry.hasOwnProperty(prop)) {
                target[prop] = deepCopy(entry[prop]);
            }
        }
        if (rest.length > 0) {
            Object.assign(target, ...rest);
        }

        return target;
    }


    function assignClean(target, entry, ...rest) {
        const blacklist = [
            '_id',
            '_createdOn',
            '_updatedOn',
            '_ownerId'
        ];
        for (let key in entry) {
            if (blacklist.includes(key) == false) {
                target[key] = deepCopy(entry[key]);
            }
        }
        if (rest.length > 0) {
            Object.assign(target, ...rest);
        }

        return target;
    }

    function deepCopy(value) {
        if (Array.isArray(value)) {
            return value.map(deepCopy);
        } else if (typeof value == 'object') {
            return [...Object.entries(value)].reduce((p, [k, v]) => Object.assign(p, { [k]: deepCopy(v) }), {});
        } else {
            return value;
        }
    }

    var storage = initPlugin;

    const { ConflictError: ConflictError$1, CredentialError: CredentialError$1, RequestError: RequestError$2 } = errors;

    function initPlugin$1(settings) {
        const identity = settings.identity;

        return function decorateContext(context, request) {
            context.auth = {
                register,
                login,
                logout
            };

            const userToken = request.headers['x-authorization'];
            if (userToken !== undefined) {
                let user;
                const session = findSessionByToken(userToken);
                if (session !== undefined) {
                    const userData = context.protectedStorage.get('users', session.userId);
                    if (userData !== undefined) {
                        console.log('Authorized as ' + userData[identity]);
                        user = userData;
                    }
                }
                if (user !== undefined) {
                    context.user = user;
                } else {
                    throw new CredentialError$1('Invalid access token');
                }
            }

            function register(body) {
                if (body.hasOwnProperty(identity) === false ||
                    body.hasOwnProperty('password') === false ||
                    body[identity].length == 0 ||
                    body.password.length == 0) {
                    throw new RequestError$2('Missing fields');
                } else if (context.protectedStorage.query('users', { [identity]: body[identity] }).length !== 0) {
                    throw new ConflictError$1(`A user with the same ${identity} already exists`);
                } else {
                    const newUser = Object.assign({}, body, {
                        [identity]: body[identity],
                        hashedPassword: hash(body.password)
                    });
                    const result = context.protectedStorage.add('users', newUser);
                    delete result.hashedPassword;

                    const session = saveSession(result._id);
                    result.accessToken = session.accessToken;

                    return result;
                }
            }

            function login(body) {
                const targetUser = context.protectedStorage.query('users', { [identity]: body[identity] });
                if (targetUser.length == 1) {
                    if (hash(body.password) === targetUser[0].hashedPassword) {
                        const result = targetUser[0];
                        delete result.hashedPassword;

                        const session = saveSession(result._id);
                        result.accessToken = session.accessToken;

                        return result;
                    } else {
                        throw new CredentialError$1('Login or password don\'t match');
                    }
                } else {
                    throw new CredentialError$1('Login or password don\'t match');
                }
            }

            function logout() {
                if (context.user !== undefined) {
                    const session = findSessionByUserId(context.user._id);
                    if (session !== undefined) {
                        context.protectedStorage.delete('sessions', session._id);
                    }
                } else {
                    throw new CredentialError$1('User session does not exist');
                }
            }

            function saveSession(userId) {
                let session = context.protectedStorage.add('sessions', { userId });
                const accessToken = hash(session._id);
                session = context.protectedStorage.set('sessions', session._id, Object.assign({ accessToken }, session));
                return session;
            }

            function findSessionByToken(userToken) {
                return context.protectedStorage.query('sessions', { accessToken: userToken })[0];
            }

            function findSessionByUserId(userId) {
                return context.protectedStorage.query('sessions', { userId })[0];
            }
        };
    }


    const secret = 'This is not a production server';

    function hash(string) {
        const hash = crypto__default['default'].createHmac('sha256', secret);
        hash.update(string);
        return hash.digest('hex');
    }

    var auth = initPlugin$1;

    function initPlugin$2(settings) {
        const util = {
            throttle: false
        };

        return function decoreateContext(context, request) {
            context.util = util;
        };
    }

    var util$2 = initPlugin$2;

    /*
     * This plugin requires auth and storage plugins
     */

    const { RequestError: RequestError$3, ConflictError: ConflictError$2, CredentialError: CredentialError$2, AuthorizationError: AuthorizationError$2 } = errors;

    function initPlugin$3(settings) {
        const actions = {
            'GET': '.read',
            'POST': '.create',
            'PUT': '.update',
            'PATCH': '.update',
            'DELETE': '.delete'
        };
        const rules = Object.assign({
            '*': {
                '.create': ['User'],
                '.update': ['Owner'],
                '.delete': ['Owner']
            }
        }, settings.rules);

        return function decorateContext(context, request) {
            // special rules (evaluated at run-time)
            const get = (collectionName, id) => {
                return context.storage.get(collectionName, id);
            };
            const isOwner = (user, object) => {
                return user._id == object._ownerId;
            };
            context.rules = {
                get,
                isOwner
            };
            const isAdmin = request.headers.hasOwnProperty('x-admin');

            context.canAccess = canAccess;

            function canAccess(data, newData) {
                const user = context.user;
                const action = actions[request.method];
                let { rule, propRules } = getRule(action, context.params.collection, data);

                if (Array.isArray(rule)) {
                    rule = checkRoles(rule, data);
                } else if (typeof rule == 'string') {
                    rule = !!(eval(rule));
                }
                if (!rule && !isAdmin) {
                    throw new CredentialError$2();
                }
                propRules.map(r => applyPropRule(action, r, user, data, newData));
            }

            function applyPropRule(action, [prop, rule], user, data, newData) {
                // NOTE: user needs to be in scope for eval to work on certain rules
                if (typeof rule == 'string') {
                    rule = !!eval(rule);
                }

                if (rule == false) {
                    if (action == '.create' || action == '.update') {
                        delete newData[prop];
                    } else if (action == '.read') {
                        delete data[prop];
                    }
                }
            }

            function checkRoles(roles, data, newData) {
                if (roles.includes('Guest')) {
                    return true;
                } else if (!context.user && !isAdmin) {
                    throw new AuthorizationError$2();
                } else if (roles.includes('User')) {
                    return true;
                } else if (context.user && roles.includes('Owner')) {
                    return context.user._id == data._ownerId;
                } else {
                    return false;
                }
            }
        };



        function getRule(action, collection, data = {}) {
            let currentRule = ruleOrDefault(true, rules['*'][action]);
            let propRules = [];

            // Top-level rules for the collection
            const collectionRules = rules[collection];
            if (collectionRules !== undefined) {
                // Top-level rule for the specific action for the collection
                currentRule = ruleOrDefault(currentRule, collectionRules[action]);

                // Prop rules
                const allPropRules = collectionRules['*'];
                if (allPropRules !== undefined) {
                    propRules = ruleOrDefault(propRules, getPropRule(allPropRules, action));
                }

                // Rules by record id 
                const recordRules = collectionRules[data._id];
                if (recordRules !== undefined) {
                    currentRule = ruleOrDefault(currentRule, recordRules[action]);
                    propRules = ruleOrDefault(propRules, getPropRule(recordRules, action));
                }
            }

            return {
                rule: currentRule,
                propRules
            };
        }

        function ruleOrDefault(current, rule) {
            return (rule === undefined || rule.length === 0) ? current : rule;
        }

        function getPropRule(record, action) {
            const props = Object
                .entries(record)
                .filter(([k]) => k[0] != '.')
                .filter(([k, v]) => v.hasOwnProperty(action))
                .map(([k, v]) => [k, v[action]]);

            return props;
        }
    }

    var rules = initPlugin$3;

    var identity = "email";
    var protectedData = {
        users: {
            "35c62d76-8152-4626-8712-eeb96381bea8": {
                email: "zarko@abv.bg",
                hashedPassword: "83313014ed3e2391aa1332615d2f053cf5c1bfe05ca1cbcb5582443822df6eb1",
                admin: true
            },
        },
        sessions: {
        }
    };


    // -------------------------------------------------------------------------------------- //////////

    var seedData = {
        menu: {
            // duner----------------------------
            // ТЕЛЕШКО ИЗКУШЕНИЕ---------------------------
            "fd436770-76c5-40e2-b231-77409eda7a61": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a61",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ТЕЛЕШКО ИЗКУШЕНИЕ",
                "type": "offer",
                "category": "doner",
                "category1": "ДЮНЕР",
                "offerdesc": 'Изкушихме се да сглобим едно примамливо комбо, за всички почитатели на нашия телешки дюнер. Събрахме аромотния ни телешки дюнер с картфоки и кенче Pepsi, а за да няма сърдити го умножихме по две. Така ще се спасите от гладните хора, които дебнат отвсякъде :) *Промоцията важи за услугата "Доставки" и е валидна от 17.02.2023 г. до 30.04.2023 г.**Напитката в промоцията може да се замени с Mirinda или SevenUp от 330мл.',
                "imageUrl": "/images/TM_580x500.png",
                "imageUrl1": "/images/teleshko-izkushenie.jpg",
                "imageUrl2": "/images/offers/teleshko-izkushenie.jpg",
                "content": ["2 x Телешки дюнер classic",
                    "2 x Картофки classic",
                    "2 x Pepsi/Mirinda/Seven Up 330ml"],
                "_createdOn": 1617194128641,
                "price": 19.90,
                "priceLv": "19.",
                "priceSt": "90",
            },

            // Roller-----------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a62": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a62",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ROLLER",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/roller.png",
                "content": ["Хрупкаво бонфиле",
                    "Салата айсберг",
                    "Домати",
                    "Сос майонеза",
                    "Сладко-кисел сос",
                    "Арабска питка Classic"],
                "_createdOn": 1617194128642,
                "price": 5.50,
                "priceLv": "5.",
                "priceSt": "90",
            },

            // A!Box Chicken--------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a63": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a63",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "A!BOX CHICKEN",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/2_Composite_za_obrabotka.png",
                "content": ["Пилешко месо от дюнер",
                    "Пържени картофки",
                    "Пресни домати",
                    "Пресни краставици",
                    "Кисели краставички",
                    "Маруля",
                    "Червено зеле",
                    "Сос 'Аладин'"],
                "_createdOn": 1617194128643,
                "price": 7.90,
                "priceLv": "7.",
                "priceSt": "90",
            },

            // A!Box Beef------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a64": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a64",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "A!BOX BEEF",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/2_Composite_za_obrabotka.png",
                "content": ["Teleшко месо",
                    "Пържени картофки",
                    "Пресни домати",
                    "Пресни краставици",
                    "Кисели краставички",
                    "Маруля",
                    "Червено зеле",
                    "Сос 'Аладин'"],
                "_createdOn": 1617194128644,
                "price": 8.90,
                "priceLv": "8.",
                "priceSt": "90",
            },

            // ДЮНЕР LIGHT-------------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a65": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a65",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ДЮНЕР LIGHT",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/duner-ligth.png",
                "content": ["Пилешко месо",
                    "Зеле",
                    "Маруля",
                    "Домати",
                    "Пресни краставици",
                    "Маруля",
                    "Арабска питка CLASSIC",
                    "Сос 'Аладин'"],
                "_createdOn": 1617194128645,
                "price": 5.90,
                "priceLv": "5.",
                "priceSt": "90",
            },

            // ПИЛЕШКИ ДЮНЕР GRAND---------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a66": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a66",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ПИЛЕШКИ ДЮНЕР GRAND",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/chicken-duner-grand.png",
                "content": ["Пилешко месо",
                    "Пържени картофки",
                    "Домати",
                    "Кисели краставички",
                    "Арабска питка Grand",
                    "Сос 'Аладин'"],
                "_createdOn": 1617194128646,
                "price": 6.90,
                "priceLv": "6.",
                "priceSt": "90",
            },

            // ПИЛЕШКИ ДЮНЕР CLASSIC------------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a67": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a67",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ПИЛЕШКИ ДЮНЕР CLASSIC",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/chicken-duner-grand.png",
                "content": ["Пилешко месо",
                    "Пържени картофки",
                    "Домати",
                    "Кисели краставички",
                    "Арабска питка Grand",
                    "Сос 'Аладин'"],
                "_createdOn": 1617194128647,
                "price": 5.90,
                "priceLv": "5.",
                "priceSt": "90",
            },

            // ПИЛЕШКИ ДЮНЕР SLIM------------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a68": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a68",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ПИЛЕШКИ ДЮНЕР SLIM",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/chicken-duner-grand.png",
                "content": ["Пилешко месо",
                    "Пържени картофки",
                    "Домати",
                    "Кисели краставички",
                    "Арабска питка Grand",
                    "Сос 'Аладин'"],
                "_createdOn": 1617194128648,
                "price": 5.90,
                "priceLv": "5.",
                "priceSt": "90",
            },


            // ПОРЦИЯ ПИЛ.ДЮНЕР С КАРТОФИ------------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a71": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a71",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ПОРЦИЯ ПИЛ.ДЮНЕР С КАРТОФИ",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/duner-pack-chips.png",
                "content": ["Пилешко месо",
                    "Пържени картофки",
                    "Маруля",
                    "Зеле",
                    "Домати",
                    "Кис.краставички",
                    "Арабска питка Grand",
                    "Сос 'Аладин' 40г"],
                "_createdOn": 1617194128671,
                "price": 7.90,
                "priceLv": "7.",
                "priceSt": "90",
            },

            // ПОРЦИЯ ПИЛ.ДЮНЕР С ОРИЗ------------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a72": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a72",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ПОРЦИЯ ПИЛ.ДЮНЕР С ОРИЗ",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/duner-pack-rice.png",
                "content": ["Пилешко месо",
                    "Ориз със зеленчуци",
                    "Маруля",
                    "Зеле",
                    "Домати",
                    "Кис.краставички",
                    "Арабска питка Grand",
                    "Сос 'Аладин' 40г"],
                "_createdOn": 1617194128672,
                "price": 7.90,
                "priceLv": "7.",
                "priceSt": "90",
            },

            // VEGGIE ДЮНЕР CLASSIC------------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a73": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a73",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "VEGGIE ДЮНЕР CLASSIC",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/duner-veg.png",
                "content": ["Фалафел - 3 броя",
                    "Пържени картофки",
                    "Домати",
                    "Пресни краставици",
                    "Зеле",
                    "Маруля",
                    "Арабска питка Classic",
                    "Сос 'Аладин'"],
                "_createdOn": 1617194128673,
                "price": 4.90,
                "priceLv": "4.",
                "priceSt": "90",
            },

            // ТЕЛЕШКИ ДЮНЕР GRAND------------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a74": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a74",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ТЕЛЕШКИ ДЮНЕР GRAND",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/duner-beef.png",
                "content": ["Телешко месо",
                    "Домати",
                    "Кисели краставички",
                    "Пресен червен лук с магданоз",
                    "Арабска питка Classic",
                    "Млечен сос 'Аладин'"],
                "_createdOn": 1617194128674,
                "price": 7.90,
                "priceLv": "7.",
                "priceSt": "90",
            },

            // ТЕЛЕШКИ ДЮНЕР CLASSIC------------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a75": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a75",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ТЕЛЕШКИ ДЮНЕР CLASSIC",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/duner-beef.png",
                "content": ["Телешко месо",
                    "Домати",
                    "Кисели краставички",
                    "Пресен червен лук с магданоз",
                    "Арабска питка Classic",
                    "Млечен сос 'Аладин'"],
                "_createdOn": 1617194128675,
                "price": 6.90,
                "priceLv": "6.",
                "priceSt": "90",
            },

            // ТЕЛЕШКИ ДЮНЕР SLIM------------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a76": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a76",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ТЕЛЕШКИ ДЮНЕР SLIM",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/duner-beef.png",
                "content": ["Телешко месо",
                    "Домати",
                    "Кисели краставички",
                    "Пресен червен лук с магданоз",
                    "Арабска питка Classic",
                    "Млечен сос 'Аладин'"],
                "_createdOn": 1617194128676,
                "price": 5.90,
                "priceLv": "5.",
                "priceSt": "90",
            },

            //ПОРЦИЯ ТЕЛЕШКИ ДЮНЕР С КАРТОФИ------------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a77": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a77",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ПОРЦИЯ ТЕЛЕШКИ ДЮНЕР С КАРТОФИ",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/duner-beef-chips.png",
                "content": ["Телешко месо",
                    "Пържени картофи",
                    "Маруля",
                    "Домати",
                    "Кисели краставички",
                    "Пресен червен лук с магданоз",
                    "Арабска питка Classic",
                    "Малък млечен сос 'Аладин'"],
                "_createdOn": 1617194128677,
                "price": 8.90,
                "priceLv": "8.",
                "priceSt": "90",
            },

            //ПОРЦИЯ ТЕЛЕШКИ ДЮНЕР С ОРИЗ------------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a78": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a78",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ПОРЦИЯ ТЕЛЕШКИ ДЮНЕР С ОРИЗ",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/duner-beef-rice.png",
                "content": ["Телешко месо",
                    "Ориз със зеленчуци",
                    "Маруля",
                    "Домати",
                    "Кисели краставички",
                    "Пресен червен лук с магданоз",
                    "Арабска питка Classic",
                    "Малък млечен сос 'Аладин'"],
                "_createdOn": 1617194128678,
                "price": 8.90,
                "priceLv": "8.",
                "priceSt": "90",
            },

            //СУДЖУ CHICKEN------------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a79": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a79",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "СУДЖУ CHICKEN",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/suju-chicken.png",
                "content": ["Пилешка кайма - пикантна",
                    "Ориз със зеленчуци",
                    "Домати",
                    "Айсберг",
                    "Кисели краставички",
                    "Пържени картофки",
                    "Сок от нар",
                    "Кетчуп",
                    "Арабска питка Classic",
                    "Сос 'Аладин'"],
                "_createdOn": 1617194128679,
                "price": 4.90,
                "priceLv": "4.",
                "priceSt": "90",
            },

            //3 ПИЛЕШКИ ДЮНЕР CLASSIC ------------------------------------------------
            "fd436770-76c5-40e2-b231-77409eda7a81": {
                "_id": "ff436770-76c5-40e2-b231-77409eda7a81",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "3 ПИЛЕШКИ ДЮНЕР CLASSIC",
                "category": "doner",
                "category1": "ДЮНЕР",
                "imageUrl": "/images/3chicken-duner.png",
                "content": ["3 пил. дюнера classic"],
                "_createdOn": 1617194128681,
                "price": 14.90,
                "priceLv": "14.",
                "priceSt": "90",
            },

            // BURGERS ------------------------------------------------------

            //МАСТЪР КОМБО ------------------------------------------------
            "fb436770-76c5-40e2-b231-77409eda7a11": {
                "_id": "bf436770-76c5-40e2-b231-77409eda7a11",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "МАСТЪР КОМБО",
                "type": "offer",
                "category": "burger",
                "category1": "БУРГЕР",
                "offerdesc": 'Представяме ви господарят на всички комбота- МАСТЪР КОМБО. Неустоимия BMB, хрупкави картофки и освежаващо Pepsi 500мл, а за малко да забравим, че всичко това го умножаваме по две. Събери компанията и се приготви за среща нашия мастър: "НЕКА СИЛАТА БЪДЕ С ТЕБ".*Промоцията важи за услугата "Доставки" в периода от 17.02.2023 г. до 30.03.2023 г. **Напитката в промоцията може да се замени с Mirinda или SevenUp от 500мл.',
                "imageUrl": "/images/burgers/master-combo.png",
                "imageUrl1": "/images/burgers/master-combo.jpg",
                "imageUrl2": "/images/offers/master-conbo.jpg",
                "content": ["500g"],
                "_createdOn": 1617194128611,
                "price": 23.90,
                "priceLv": "23.",
                "priceSt": "90",
            },

            //BMB ------------------------------------------------
            "fb436770-76c5-40e2-b231-77409eda7a12": {
                "_id": "bf436770-76c5-40e2-b231-77409eda7a12",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "BMB",
                "category": "burger",
                "category1": "БУРГЕР",
                "imageUrl": "/images/burgers/BMB1.png",
                "content": ['Beef Master Burger:',
                    'Телешко кюфте',
                    'Айсберг',
                    'Чедър',
                    'Кисели краставици',
                    'Червен лук',
                    'Майонеза',
                    'Бургер сос',
                    'Питка със сусам'],
                "_createdOn": 1617194128612,
                "price": 7.90,
                "priceLv": "7.",
                "priceSt": "90",
            },

            //HARD BURGER ------------------------------------------------
            "fb436770-76c5-40e2-b231-77409eda7a13": {
                "_id": "bf436770-76c5-40e2-b231-77409eda7a13",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "HARD BURGER",
                "category": "burger",
                "category1": "БУРГЕР",
                "imageUrl": "/images/burgers/burger.png",
                "content": ["Панирано пилешко филе",
                    "Питка със сусам",
                    "Домати",
                    "Айсберг",
                    "Сос майонеза"],
                "_createdOn": 1617194128613,
                "price": 6.90,
                "priceLv": "6.",
                "priceSt": "90",
            },

            //ТЕЛЕШКИ БУРГЕР ------------------------------------------------
            "fb436770-76c5-40e2-b231-77409eda7a14": {
                "_id": "bf436770-76c5-40e2-b231-77409eda7a14",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ТЕЛЕШКИ БУРГЕР",
                "category": "burger",
                "category1": "БУРГЕР",
                "imageUrl": "/images/burgers/Teleshki_burger.png",
                "content": ["Телешко кюфте",
                    "Домати",
                    "Айсберг",
                    "Пресен червен лук",
                    "Кисели краставички",
                    "Майонеза",
                    "Сладко-кисел сос",
                    "Питка със сусам"],
                "_createdOn": 1617194128614,
                "price": 6.90,
                "priceLv": "6.",
                "priceSt": "90",
            },

            //DЮНЕР В ПИТКА CHICKEN ------------------------------------------------
            "fb436770-76c5-40e2-b231-77409eda7a15": {
                "_id": "bf436770-76c5-40e2-b231-77409eda7a15",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "DЮНЕР В ПИТКА CHICKEN",
                "category": "burger",
                "category1": "БУРГЕР",
                "imageUrl": "/images/burgers/burger-pitka-chicken.png",
                "content": ["Телешко кюфте",
                    "Домати",
                    "Айсберг",
                    "Пресен червен лук",
                    "Кисели краставички",
                    "Майонеза",
                    "Сладко-кисел сос",
                    "Питка със сусам"],
                "_createdOn": 1617194128615,
                "price": 5.90,
                "priceLv": "5.",
                "priceSt": "90",
            },

            //DЮНЕР В ПИТКА BEEF ------------------------------------------------
            "fb436770-76c5-40e2-b231-77409eda7a16": {
                "_id": "bf436770-76c5-40e2-b231-77409eda7a16",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "DЮНЕР В ПИТКА BEEF",
                "category": "burger",
                "category1": "БУРГЕР",
                "imageUrl": "/images/burgers/burger-pitka-beef.png",
                "content": ["Телешко месо от дюнер",
                    "Домати",
                    "Айсберг",
                    "Пресен червен лук",
                    "Кисели краставички",
                    "Майонеза",
                    "Сладко-кисел сос",
                    "Питка със сусам",],
                "_createdOn": 1617194128616,
                "price": 6.90,
                "priceLv": "6.",
                "priceSt": "90",
            },

            //ПИЛЕШКИ БУРГЕР DOUBLE ------------------------------------------------
            "fb436770-76c5-40e2-b231-77409eda7a17": {
                "_id": "bf436770-76c5-40e2-b231-77409eda7a17",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ПИЛЕШКИ БУРГЕР DOUBLE",
                "category": "burger",
                "category1": "БУРГЕР",
                "imageUrl": "/images/burgers/pileshki_burger_double.png",
                "content": ["Пилешко кюфте - 2 броя",
                    "Пържени картофки",
                    "Домати",
                    "Пресни краставички",
                    "Зеле",
                    "Маруля",
                    "Сос 'Аладин'",
                    "Кетчуп",
                    "Питка със сусам"],
                "_createdOn": 1617194128617,
                "price": 5.90,
                "priceLv": "5.",
                "priceSt": "90",
            },

            //ПИЛЕШКИ БУРГЕР CLASSIC ------------------------------------------------
            "fb436770-76c5-40e2-b231-77409eda7a18": {
                "_id": "bf436770-76c5-40e2-b231-77409eda7a18",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ПИЛЕШКИ БУРГЕР CLASSIC",
                "category": "burger",
                "category1": "БУРГЕР",
                "imageUrl": "/images/burgers/pileshki_burger_classic.png",
                "content": ["Пилешко кюфте - 1 брой",
                    "Пържени картофки",
                    "Домати",
                    "Пресни краставички",
                    "Зеле",
                    "Маруля",
                    "Сос 'Аладин'",
                    "Кетчуп",
                    "Питка със сусам"],
                "_createdOn": 1617194128618,
                "price": 5.50,
                "priceLv": "5.",
                "priceSt": "50",
            },

            //VEGGIE БУРГЕР ------------------------------------------------
            "fb436770-76c5-40e2-b231-77409eda7a19": {
                "_id": "bf436770-76c5-40e2-b231-77409eda7a19",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "VEGGIE БУРГЕР",
                "category": "burger",
                "category1": "БУРГЕР",
                "imageUrl": "/images/burgers/veggie_burger.png",
                "content": ["Питка със сусаm",
                    "Яйце",
                    "Кашкавал за тост",
                    "Пържени картофки",
                    "Маруля",
                    "Зеле",
                    "Пресни краставици",
                    "Домати",
                    "Сос 'Аладин'",
                    "Кетчуп"],
                "_createdOn": 1617194128619,
                "price": 5.50,
                "priceLv": "5.",
                "priceSt": "50",
            },

            //2 ПИЛ.ДЮНЕР CLASSIC I 2 ПИЛ.БУРГЕР CLASSIC ------------------------------------------------
            "fb436770-76c5-40e2-b231-77409eda7a21": {
                "_id": "bf436770-76c5-40e2-b231-77409eda7a21",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "2 ПИЛ.ДЮНЕР CLASSIC I 2 ПИЛ.БУРГЕР CLASSIC",
                "category": "burger",
                "category1": "БУРГЕР",
                "imageUrl": "/images/burgers/2burgers-2duners-classic.png",
                "content": ["Питка със сусаm",
                    "Яйце",
                    "Кашкавал за тост",
                    "Пържени картофки",
                    "Маруля",
                    "Зеле",
                    "Пресни краставици",
                    "Домати",
                    "Сос 'Аладин'",
                    "Кетчуп"],
                "_createdOn": 1617194128621,
                "price": 18.90,
                "priceLv": "18.",
                "priceSt": "90",
            },

            // PIZZAS --------------------------------------------------------
            
            // ПИЦА, ТА ДРЪНКА ------------------------------------------------
            "fp436770-76c5-40e2-b231-77409eda7a11": {
                "_id": "pf436770-76c5-40e2-b231-77409eda7a11",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": "ПИЦА, ТА ДРЪНКА",
                "type": "offer",
                "category": "pizza",
                "category1": "ПИЦА",
                "offerdesc": ' В българският език има няколко фрази, почти невъзможни за превод и една от тях е "Пица, та дрънка". Докато обесним на някой чужденец как и защо тази пица дрънка минава прекалено много време, по-лесно е да му дадеш едно парче и ще разбере, че думите са излишни. Неустоима Тава пица, Хрупкави Бонфиленца, четири различни соса 50гр и освежаващо Pepsi 2л.*Промоцията важи за услугата "Доставки" в периода от 17.02.2023 г. до 30.03.2023 г.**Към промоцията НЕ може да бъде избрана пица "Асорти", "Вълча", "Хот дог", "Ривиера",BBQ или BBQ Beef.***Напитката в промоцията може да се замени с Mirinda или SevenUp от 2л.****Сосовете в промоцията са Барбекю, Сладко-кисел, Майонеза и Аладин, като те не могат да се променят',
                "imageUrl": "/images/pizza/pizza-drunka.png",
                "imageUrl1": "/images/pizza-ta-dranka.jpg",
                "imageUrl2": "/images/offers/pizza-drinka.jpg",
                "content": ["300g"],
                "_createdOn": 1617194128611,
                "price": 25.90,
                "priceLv": "25.",
                "priceSt": "90",
            },

            // ПИЦА РИВИЕРА ------------------------------------------------
            "fp436770-76c5-40e2-b231-77409eda7a12": {
                "_id": "pf436770-76c5-40e2-b231-77409eda7a12",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'ПИЦА "РИВИЕРА"',
                "category": "pizza",
                "category1": "ПИЦА",
                "imageUrl": "/images/pizza/pizza-riviera.png",
                "content": ["Пилешко месо от дюнер",
                    "Телешка луканка",
                    "Моцарела",
                    "Крема сирене (пълнеж в ръбчето)",
                    "Домати на кубчета",
                    "Червен лук",
                    "Бургер сос",
                    "Основа: Доматен+Барбекю сос",
                    "(50 см, 8 парчета)"],
                "_createdOn": 1617194128612,
                "price": 25.90,
                "priceLv": "25.",
                "priceSt": "90",
            },

            // ПИЦА АСОРТИ ------------------------------------------------
            "fp436770-76c5-40e2-b231-77409eda7a13": {
                "_id": "pf436770-76c5-40e2-b231-77409eda7a13",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'ПИЦА "АСОРТИ"',
                "category": "pizza",
                "category1": "ПИЦА",
                "imageUrl": "/images/pizza/pizza-asorti.png",
                "content": ["Телешка луканка",
                    "Шпеков колбас",
                    "Пилешко филе",
                    "Топено сирене",
                    "Моцарела",
                    "Гъби",
                    "Домати на кубчета",
                    "Маслини",
                    "Чубрица",
                    "Основа: Доматен сос",
                    "(50 см, 8 парчета)"],
                "_createdOn": 1617194128613,
                "price": 21.90,
                "priceLv": "21.",
                "priceSt": "90",
            },

            // ПИЦА ХОТ-ДОГ ------------------------------------------------
            "fp436770-76c5-40e2-b231-77409eda7a14": {
                "_id": "pf436770-76c5-40e2-b231-77409eda7a14",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'ПИЦА "ХОТ-ДОГ"',
                "category": "pizza",
                "category1": "ПИЦА",
                "imageUrl": "/images/pizza/pizza-hot-dog.png",
                "content": ["Пилешки кренвирши",
                    "Моцарела",
                    "Топено сирене",
                    "Чубрица",
                    "Основа: Доматен сос",
                    "(50 см, 8 парчета)"],
                "_createdOn": 1617194128614,
                "price": 17.90,
                "priceLv": "17.",
                "priceSt": "90",
            },

            // ПИЦА ВЪЛЧА ------------------------------------------------
            "fp436770-76c5-40e2-b231-77409eda7a15": {
                "_id": "pf436770-76c5-40e2-b231-77409eda7a15",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'ПИЦА "ВЪЛЧА"',
                "category": "pizza",
                "category1": "ПИЦА",
                "imageUrl": "/images/pizza/pizza-wolf.png",
                "content": ["Телешка луканка",
                    "Шунков колбас",
                    "Топено сирене",
                    "Моцарела",
                    "Чубрица",
                    "Основа: Доматен сос",
                    "(50 см, 8 парчета)"],
                "_createdOn": 1617194128615,
                "price": 17.90,
                "priceLv": "17.",
                "priceSt": "90",
            },

            // ПИЦА "МАРГАРИТА" БЯЛА ------------------------------------------------
            "fp436770-76c5-40e2-b231-77409eda7a16": {
                "_id": "pf436770-76c5-40e2-b231-77409eda7a16",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'ПИЦА "МАРГАРИТА" БЯЛА',
                "category": "pizza",
                "category1": "ПИЦА",
                "imageUrl": "/images/pizza/pizza-margarita-white.png",
                "content": ["Моцарела",
                    "Пресни домати на кръгове",
                    "Чубрица",
                    'Основа: сос "Аладин"',
                    "(50 см, 8 парчета)"],
                "_createdOn": 1617194128616,
                "price": 16.90,
                "priceLv": "16.",
                "priceSt": "90",
            },
            
            // CHICKEN ----------------------------------------------------------------
            
            // БОНФИЛЕНЦА -----------------------------------------------------------
            "ch436770-76c5-40e2-b231-77409eda7a10": {
                "_id": "hc436770-76c5-40e2-b231-77409eda7a10",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'БОНФИЛЕНЦА',
                "category": "chicken",
                "category1": "ПИЛЕ",
                "imageUrl": "/images/chicken/chicken-fillet.png",
                "content": ["160g"],
                "_createdOn": 1617194128610,
                "price": 6.90,
                "priceLv": "6.",
                "priceSt": "90",
            },

            // ХРУПКАВО БУТЧЕ --------------------------------------------------------------
            "ch436770-76c5-40e2-b231-77409eda7a11": {
                "_id": "hc436770-76c5-40e2-b231-77409eda7a11",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'ХРУПКАВО БУТЧЕ',
                "category": "chicken",
                "category1": "ПИЛЕ",
                "imageUrl": "/images/chicken/chicken-butche.png",
                "content": ["100g"],
                "_createdOn": 1617194128611,
                "price": 1.90,
                "priceLv": "1.",
                "priceSt": "90",
            },

            // МЕНЮ 2 ХРУПКАВИ БУТЧЕТА --------------------------------------------
            "ch436770-76c5-40e2-b231-77409eda7a12": {
                "_id": "hc436770-76c5-40e2-b231-77409eda7a12",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'МЕНЮ 2 ХРУПКАВИ БУТЧЕТА',
                "category": "chicken",
                "category1": "ПИЛЕ",
                "imageUrl": "/images/chicken/chicken-2butcheta-menu.png",
                "content": ["240g"],
                "_createdOn": 1617194128612,
                "price": 6.70,
                "priceLv": "6.",
                "priceSt": "70",
            },

            //10 ХРУПКАВИ БУТЧЕТА СЪС СОС ---------------------------------------------
            "ch436770-76c5-40e2-b231-77409eda7a13": {
                "_id": "hc436770-76c5-40e2-b231-77409eda7a13",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": '10 ХРУПКАВИ БУТЧЕТА СЪС СОС',
                "category": "chicken",
                "category1": "ПИЛЕ",
                "imageUrl": "/images/chicken/chicken-10-sos.png",
                "content": ["600g"],
                "_createdOn": 1617194128613,
                "price": 17.90,
                "priceLv": "17.",
                "priceSt": "90",
            },

            // 20 ПИЛЕШКИ ХАПКИ + 2*СОС ---------------------------------------------
            "ch436770-76c5-40e2-b231-77409eda7a14": {
                "_id": "hc436770-76c5-40e2-b231-77409eda7a14",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": '20 ПИЛЕШКИ ХАПКИ + 2*СОС',
                "category": "chicken",
                "category1": "ПИЛЕ",
                "imageUrl": "/images/chicken/chicken-20-hapki.png",
                "content": ["800g"],
                "_createdOn": 1617194128614,
                "price": 9.90,
                "priceLv": "9.",
                "priceSt": "90",
            },

            // 12 ПИЛЕШКИ ХАПКИ МЕНЮ --------------------------------------------------
            "ch436770-76c5-40e2-b231-77409eda7a15": {
                "_id": "hc436770-76c5-40e2-b231-77409eda7a15",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": '12 ПИЛЕШКИ ХАПКИ МЕНЮ',
                "category": "chicken",
                "category1": "ПИЛЕ",
                "imageUrl": "/images/chicken/chicken-12hapki-menu.png",
                "content": ["480g"],
                "_createdOn": 1617194128615,
                "price": 9.80,
                "priceLv": "9.",
                "priceSt": "80",
            },

            // FALAFELL -----------------------------------------------------------------------------------
            // ПОРЦИЯ ФАЛАФЕЛ ------------------------------------------------------------------------------
            "FL436770-76c5-40e2-b231-77409eda7a10": {
                "_id": "LF436770-76c5-40e2-b231-77409eda7a10",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'ПОРЦИЯ ФАЛАФЕЛ',
                "category": "falafel",
                "category1": "ФАЛАФЕЛ",
                "imageUrl": "/images/falafel/falafel-porcia.png",
                "content": ["320g"],
                "_createdOn": 1657194128610,
                "price": 6.00,
                "priceLv": "6.",
                "priceSt": "00",
            },

            // 20 ФАЛАФЕЛА + СОС ----------------------------------------------------
            "FL436770-76c5-40e2-b231-77409eda7a11": {
                "_id": "LF436770-76c5-40e2-b231-77409eda7a11",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": '20 ФАЛАФЕЛА + СОС',
                "category": "falafel",
                "category1": "ФАЛАФЕЛ",
                "imageUrl": "/images/falafel/falafel20.png",
                "content": [
                    'В пакета е включен 1 сос "Аладин" - 200 г'
                ],
                "_createdOn": 1657194128611,
                "price": 9.50,
                "priceLv": "9.",
                "priceSt": "50",
            },

            // 10 ФАЛАФЕЛА + СОС -------------------------------------------------------
            "FL436770-76c5-40e2-b231-77409eda7a12": {
                "_id": "LF436770-76c5-40e2-b231-77409eda7a12",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": '10 ФАЛАФЕЛА + СОС',
                "category": "falafel",
                "category1": "ФАЛАФЕЛ",
                "imageUrl": "/images/falafel/falafel10-sos.png",
                "content": [
                    'В пакета е включен 1 сос "Аладин" - 200 г'
                ],
                "_createdOn": 1657194128612,
                "price": 5.50,
                "priceLv": "5.",
                "priceSt": "50",
            },

            // 5 ФАЛАФЕЛА + СОС ------------------------------------------------------------------------------
            "FL436770-76c5-40e2-b231-77409eda7a13": {
                "_id": "LF436770-76c5-40e2-b231-77409eda7a13",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": '5 ФАЛАФЕЛА + СОС',
                "category": "falafel",
                "category1": "ФАЛАФЕЛ",
                "imageUrl": "/images/falafel/falafel5.png",
                "content": [
                    'В пакета е включен 1 сос "Аладин" - 200 г'
                ],
                "_createdOn": 1657194128613,
                "price": 2.90,
                "priceLv": "2.",
                "priceSt": "90",
            },

            // SOUCES ------------------------------------------------------------------------------------
            // КАРТОФКИ CLASSIC ------------------------------------------------------------------------------
            "sc436770-76c5-40e2-b231-77409eda7a10": {
                "_id": "cs436770-76c5-40e2-b231-77409eda7a10",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'КАРТОФКИ CLASSIC',
                "category": "souces",
                "category1": "ГАРНИТУРИ И СОСОВЕ",
                "imageUrl": "/images/souces/chips.png",
                "content": ["130g"],
                "_createdOn": 1657194128610,
                "price": 2.90,
                "priceLv": "2.",
                "priceSt": "90",
            },

            // КАРТОФКИ MINI ------------------------------------------------------------------
            "sc436770-76c5-40e2-b231-77409eda7a11": {
                "_id": "cs436770-76c5-40e2-b231-77409eda7a11",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'КАРТОФКИ MINI',
                "category": "souces",
                "category1": "ГАРНИТУРИ И СОСОВЕ",
                "imageUrl": "/images/souces/chips-mini.png",
                "content": ["98g"],
                "_createdOn": 1657194128611,
                "price": 2.50,
                "priceLv": "2.",
                "priceSt": "50",
            },

            // ОРИЗ СЪС ЗЕЛЕНЧУЦИ ------------------------------------------------------------------------------
            "sc436770-76c5-40e2-b231-77409eda7a12": {
                "_id": "cs436770-76c5-40e2-b231-77409eda7a12",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'ОРИЗ СЪС ЗЕЛЕНЧУЦИ',
                "category": "souces",
                "category1": "ГАРНИТУРИ И СОСОВЕ",
                "imageUrl": "/images/souces/oriz-zelenchuci.png",
                "content": ["230g"],
                "_createdOn": 1657194128612,
                "price": 2.90,
                "priceLv": "2.",
                "priceSt": "90",
            },

            // САЛАТА АМЕРИКАНСКА -----------------------------------------------------------
            "sc436770-76c5-40e2-b231-77409eda7a13": {
                "_id": "cs436770-76c5-40e2-b231-77409eda7a13",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'САЛАТА АМЕРИКАНСКА',
                "category": "souces",
                "category1": "ГАРНИТУРИ И СОСОВЕ",
                "imageUrl": "/images/souces/american-salad.png",
                "content": ["510g"],
                "_createdOn": 1657194128613,
                "price": 2.90,
                "priceLv": "2.",
                "priceSt": "90",
            },

            // САЛАТА ПИЛЕ ------------------------------------------------------------------------------
            "sc436770-76c5-40e2-b231-77409eda7a14": {
                "_id": "cs436770-76c5-40e2-b231-77409eda7a14",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'САЛАТА ПИЛЕ',
                "category": "souces",
                "category1": "ГАРНИТУРИ И СОСОВЕ",
                "imageUrl": "/images/souces/salad-chicken.png",
                "content": ["515g"],
                "_createdOn": 1657194128614,
                "price": 4.90,
                "priceLv": "4.",
                "priceSt": "90",
            },

            // СОС АЛАДИН BOTTLE -----------------------------------------------------
            "sc436770-76c5-40e2-b231-77409eda7a15": {
                "_id": "cs436770-76c5-40e2-b231-77409eda7a15",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'СОС АЛАДИН BOTTLE',
                "category": "souces",
                "category1": "ГАРНИТУРИ И СОСОВЕ",
                "imageUrl": "/images/souces/souce-aladin-botle.png",
                "content": ["500ml"],
                "_createdOn": 1657194128615,
                "price": 4.90,
                "priceLv": "4.",
                "priceSt": "90",
            },

            // СОС АЛАДИН 200гр ------------------------------------------------------------
            "sc436770-76c5-40e2-b231-77409eda7a16": {
                "_id": "cs436770-76c5-40e2-b231-77409eda7a16",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'СОС АЛАДИН 200гр',
                "category": "souces",
                "category1": "ГАРНИТУРИ И СОСОВЕ",
                "imageUrl": "/images/souces/souce-aladin.png",
                "content": ["200g"],
                "_createdOn": 1657194128616,
                "price": 1.90,
                "priceLv": "1.",
                "priceSt": "90",
            },

            // СОС КЕТЧУП ----------------------------------------------------------------------
            "sc436770-76c5-40e2-b231-77409eda7a17": {
                "_id": "cs436770-76c5-40e2-b231-77409eda7a17",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'СОС КЕТЧУП',
                "category": "souces",
                "category1": "ГАРНИТУРИ И СОСОВЕ",
                "imageUrl": "/images/souces/souce-ketchup.png",
                "content": ["202g"],
                "_createdOn": 1657194128617,
                "price": 1.90,
                "priceLv": "1.",
                "priceSt": "90",
            },

            // СОС МАЙОНЕЗА ------------------------------------------------------------------------------
            "sc436770-76c5-40e2-b231-77409eda7a18": {
                "_id": "cs436770-76c5-40e2-b231-77409eda7a18",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'СОС МАЙОНЕЗА',
                "category": "souces",
                "category1": "ГАРНИТУРИ И СОСОВЕ",
                "imageUrl": "/images/souces/souce-mayo.png",
                "content": ["202g"],
                "_createdOn": 1657194128618,
                "price": 1.00,
                "priceLv": "1.",
                "priceSt": "00",
            },

            // СОС БАРБЕКЮ ------------------------------------------------------------------
            "sc436770-76c5-40e2-b231-77409eda7a19": {
                "_id": "cs436770-76c5-40e2-b231-77409eda7a19",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'СОС БАРБЕКЮ',
                "category": "souces",
                "category1": "ГАРНИТУРИ И СОСОВЕ",
                "imageUrl": "/images/souces/souce-barbequ.png",
                "content": ["204g"],
                "_createdOn": 1657194128619,
                "price": 1.00,
                "priceLv": "1.",
                "priceSt": "00",
            },

            // СОС СЛАДКО-КИСЕЛ -------------------------------------------------------------
            "sc436770-76c5-40e2-b231-77409eda7a20": {
                "_id": "cs436770-76c5-40e2-b231-77409eda7a20",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'СОС СЛАДКО-КИСЕЛ',
                "category": "souces",
                "category1": "ГАРНИТУРИ И СОСОВЕ",
                "imageUrl": "/images/souces/souce-sweet-x.png",
                "content": ["23g"],
                "_createdOn": 1657194128620,
                "price": 1.00,
                "priceLv": "1.",
                "priceSt": "00",
            },

            // АРАБСКА ПИТКА CLASSIC 1БР. ---------------------------------------------------------
            "sc436770-76c5-40e2-b231-77409eda7a21": {
                "_id": "cs436770-76c5-40e2-b231-77409eda7a21",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'АРАБСКА ПИТКА CLASSIC 1БР.',
                "category": "souces",
                "category1": "ГАРНИТУРИ И СОСОВЕ",
                "imageUrl": "/images/souces/arabska-pitka.png",
                "content": ["48g"],
                "_createdOn": 1657194128621,
                "price": 1.00,
                "priceLv": "1.",
                "priceSt": "00",
            },

            // DRINKS --------------------------------------------------------------------------------
            // PEPSI 2L ------------------------------------------------------------------------------
            "dr436770-76c5-40e2-b231-77409eda7a10": {
                "_id": "rd436770-76c5-40e2-b231-77409eda7a10",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'PEPSI 2L',
                "category": "drinks",
                "category1": "НАПИТКИ",
                "imageUrl": "/images/drinks/pepsi2L.png",
                "content": ["2l"],
                "_createdOn": 1657194128610,
                "price": 3.90,
                "priceLv": "3.",
                "priceSt": "90",
            },

            // MIRINDA 2L ------------------------------------------------------------------------------
            "dr436770-76c5-40e2-b231-77409eda7a11": {
                "_id": "rd436770-76c5-40e2-b231-77409eda7a11",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'MIRINDA 2L',
                "category": "drinks",
                "category1": "НАПИТКИ",
                "imageUrl": "/images/drinks/mirinda2L.png",
                "content": ["2l"],
                "_createdOn": 1657194128611,
                "price": 3.90,
                "priceLv": "3.",
                "priceSt": "90",
            },

            // SEVEN UP 2L ---------------------------------------------------------------------
            "dr436770-76c5-40e2-b231-77409eda7a12": {
                "_id": "rd436770-76c5-40e2-b231-77409eda7a12",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'SEVEN UP 2L',
                "category": "drinks",
                "category1": "НАПИТКИ",
                "imageUrl": "/images/drinks/sevenup2L.png",
                "content": ["2l"],
                "_createdOn": 1657194128612,
                "price": 3.90,
                "priceLv": "3.",
                "priceSt": "90",
            },

            // PEPSI 500ML -------------------------------------------------------------------
            "dr436770-76c5-40e2-b231-77409eda7a13": {
                "_id": "rd436770-76c5-40e2-b231-77409eda7a13",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'PEPSI 500ML',
                "category": "drinks",
                "category1": "НАПИТКИ",
                "imageUrl": "/images/drinks/pepsi500ml.png",
                "content": ["2l"],
                "_createdOn": 1657194128613,
                "price": 2.20,
                "priceLv": "2.",
                "priceSt": "20",
            },

            // MIRINDA 500ML ------------------------------------------------------------------------------
            "dr436770-76c5-40e2-b231-77409eda7a14": {
                "_id": "rd436770-76c5-40e2-b231-77409eda7a14",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'MIRINDA 500ML',
                "category": "drinks",
                "category1": "НАПИТКИ",
                "imageUrl": "/images/drinks/mirinda500ml.png",
                "content": ["500ml"],
                "_createdOn": 1657194128614,
                "price": 2.20,
                "priceLv": "2.",
                "priceSt": "20",
            },

            // SEVEN UP 500ML ------------------------------------------------------------------------------
            "dr436770-76c5-40e2-b231-77409eda7a15": {
                "_id": "rd436770-76c5-40e2-b231-77409eda7a15",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'SEVEN UP 500ML',
                "category": "drinks",
                "category1": "НАПИТКИ",
                "imageUrl": "/images/drinks/sevenup500ml.png",
                "content": ["500ml"],
                "_createdOn": 1657194128615,
                "price": 2.20,
                "priceLv": "2.",
                "priceSt": "20",
            },

            // PEPSI 330ML ------------------------------------------------------------------------------
            "dr436770-76c5-40e2-b231-77409eda7a16": {
                "_id": "rd436770-76c5-40e2-b231-77409eda7a16",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'PEPSI 330ML',
                "category": "drinks",
                "category1": "НАПИТКИ",
                "imageUrl": "/images/drinks/pepsi330ml.png",
                "content": ["330ml"],
                "_createdOn": 1657194128616,
                "price": 1.90,
                "priceLv": "1.",
                "priceSt": "90",
            },

            // MIRINDA 330ML ------------------------------------------------------------------------------
            "dr436770-76c5-40e2-b231-77409eda7a17": {
                "_id": "rd436770-76c5-40e2-b231-77409eda7a17",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'MIRINDA 330ML',
                "category": "drinks",
                "category1": "НАПИТКИ",
                "imageUrl": "/images/drinks/mirinda330ml.png",
                "content": ["330ml"],
                "_createdOn": 1657194128617,
                "price": 1.90,
                "priceLv": "1.",
                "priceSt": "90",
            },

            // SEVEN UP 330ML ------------------------------------------------------------------------------
            "dr436770-76c5-40e2-b231-77409eda7a18": {
                "_id": "rd436770-76c5-40e2-b231-77409eda7a18",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'SEVEN UP 330ML',
                "category": "drinks",
                "category1": "НАПИТКИ",
                "imageUrl": "/images/drinks/sevenup330ml.png",
                "content": ["330ml"],
                "_createdOn": 1657194128618,
                "price": 1.90,
                "priceLv": "1.",
                "priceSt": "90",
            },

            // LIPTION 500ML ------------------------------------------------------------------------------
            "dr436770-76c5-40e2-b231-77409eda7a19": {
                "_id": "rd436770-76c5-40e2-b231-77409eda7a19",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'LIPTION 500ML',
                "category": "drinks",
                "category1": "НАПИТКИ",
                "imageUrl": "/images/drinks/liption500ml.png",
                "content": ["330ml"],
                "_createdOn": 1657194128619,
                "price": 2.90,
                "priceLv": "2.",
                "priceSt": "90",
            },

            // PRISON 500ML ------------------------------------------------------------------------------
            "dr436770-76c5-40e2-b231-77409eda7a20": {
                "_id": "rd436770-76c5-40e2-b231-77409eda7a20",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'PRISON 500ML',
                "category": "drinks",
                "category1": "НАПИТКИ",
                "imageUrl": "/images/drinks/prisun500ml.png",
                "content": ["500ml"],
                "_createdOn": 1657194128620,
                "price": 1.90,
                "priceLv": "1.",
                "priceSt": "90",
            },

            // АЙРЯН АЛАДИН 500ML ---------------------------------------------------------------
            "dr436770-76c5-40e2-b231-77409eda7a21": {
                "_id": "rd436770-76c5-40e2-b231-77409eda7a21",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'АЙРЯН АЛАДИН 500ML',
                "category": "drinks",
                "category1": "НАПИТКИ",
                "imageUrl": "/images/drinks/ayran.png",
                "content": ["500ml"],
                "_createdOn": 1657194128621,
                "price": 1.90,
                "priceLv": "1.",
                "priceSt": "90",
            },

            // АЙРЯН АЛАДИН 250ML -----------------------------------------------------------
            "dr436770-76c5-40e2-b231-77409eda7a22": {
                "_id": "rd436770-76c5-40e2-b231-77409eda7a22",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'АЙРЯН АЛАДИН 250ML',
                "category": "drinks",
                "category1": "НАПИТКИ",
                "imageUrl": "/images/drinks/airan250ml.png",
                "content": ["250ml"],
                "_createdOn": 1657194128622,
                "price": 1.50,
                "priceLv": "1.",
                "priceSt": "50",
            },

            // МИНЕРАЛНА ВОДА 500ML ----------------------------------------------------
            "dr436770-76c5-40e2-b231-77409eda7a23": {
                "_id": "rd436770-76c5-40e2-b231-77409eda7a23",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'МИНЕРАЛНА ВОДА 500ML',
                "category": "drinks",
                "category1": "НАПИТКИ",
                "imageUrl": "/images/drinks/voda500ml.png",
                "content": ["500ml"],
                "_createdOn": 1657194128623,
                "price": 1.50,
                "priceLv": "1.",
                "priceSt": "50",
            },

            // DESERTS ---------------------------------------------------------------------
            // МЪФИН ТРОЕН ШОКОЛАД ---------------------------------------------------------
            "dt436770-76c5-40e2-b231-77409eda7a10": {
                "_id": "td436770-76c5-40e2-b231-77409eda7a10",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'МЪФИН ТРОЕН ШОКОЛАД',
                "category": "deserts",
                "category1": "ДЕСЕРТИ",
                "imageUrl": "/images/deserts/muffin-3choco.png",
                "content": ["80g"],
                "_createdOn": 1657194128610,
                "price": 3.90,
                "priceLv": "3.",
                "priceSt": "90",
            },

            // МЪФИН ЯБЪЛКА И КАРАМЕЛ --------------------------------------------------
            "dt436770-76c5-40e2-b231-77409eda7a11": {
                "_id": "td436770-76c5-40e2-b231-77409eda7a11",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'МЪФИН ЯБЪЛКА И КАРАМЕЛ',
                "category": "deserts",
                "category1": "ДЕСЕРТИ",
                "imageUrl": "/images/deserts/muffin-apple.png",
                "content": ["80g"],
                "_createdOn": 1657194128611,
                "price": 3.90,
                "priceLv": "3.",
                "priceSt": "90",
            },

            // KIDS MENU ------------------------------------------------------------
            // СУПЕР МЕНЮ ДЮНЕР -----------------------------------------------------
            "dk436770-76c5-40e2-b231-77409eda7a10": {
                "_id": "kd436770-76c5-40e2-b231-77409eda7a10",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'СУПЕР МЕНЮ ДЮНЕР',
                "category": "kids",
                "category1": "ДЕТСКО МЕНЮ",
                "imageUrl": "/images/kids/duner.png",
                "content": ["509g"],
                "_createdOn": 1657194128610,
                "price": 7.50,
                "priceLv": "7.",
                "priceSt": "50",
            },

            // СУПЕР МЕНЮ БУРГЕР --------------------------------------------------
            "dk436770-76c5-40e2-b231-77409eda7a11": {
                "_id": "kd436770-76c5-40e2-b231-77409eda7a11",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'СУПЕР МЕНЮ БУРГЕР',
                "category": "kids",
                "category1": "ДЕТСКО МЕНЮ",
                "imageUrl": "/images/kids/burger.png",
                "content": ["513g"],
                "_createdOn": 1657194128611,
                "price": 7.80,
                "priceLv": "7.",
                "priceSt": "80",
            },

            // СУПЕР МЕНЮ ФИЛЕНЦА  ----------------------------------------------------------------
            "dk436770-76c5-40e2-b231-77409eda7a12": {
                "_id": "kd436770-76c5-40e2-b231-77409eda7a12",
                "_ownerId": "35c62d76-8152-4626-8712-eeb96381bea8",
                "title": 'СУПЕР МЕНЮ ФИЛЕНЦА',
                "category": "kids",
                "category1": "ДЕТСКО МЕНЮ",
                "imageUrl": "/images/kids/filenca.png",
                "content": ["300g"],
                "_createdOn": 1657194128612,
                "price": 7.60,
                "priceLv": "7.",
                "priceSt": "60",
            },
        },

        comments: {
            '1': {
                '_id': 1,
                'comment': `Супер качество, пресни зеленчуци, крехко месо на топ цени. :)`,
                'username': `Gosho`,
                'imageUrl': 'https://www.aladinfoods.bg/files/images/294/light_duner.png',
                "_ownerId": "c1",
            },
            '2': {
                '_id': 2,
                'comment': `Топ дюнери , топ пици всичко е номер едно! Най добрите в града !!!`,
                'username': `Tosho`,
                'imageUrl': '/images/comments/pizza-two.jpg',
                "_ownerId": "c2",
            },
            '3': {
                '_id': 3,
                'comment': `Топ дюнери , топ пици всичко е номер едно! Най добрите в града !!!`,
                'username': `Tosho`,
                'imageUrl': 'https://www.takeaway.com/bg/foodwiki/uploads/sites/9/2019/10/doner_kebab_1-1080x961.jpg',
                "_ownerId": "c3",
            }
        },
        likes: {}
    };

    var rules$1 = {
        users: {
            ".create": false,
            ".read": [
                "Owner"
            ],
            ".update": false,
            ".delete": false
        }
    };
    
    var settings = {
        identity: identity,
        protectedData: protectedData,
        seedData: seedData,
        rules: rules$1
    };

    const plugins = [
        storage(settings),
        auth(settings),
        util$2(),
        rules(settings)
    ];

    const server = http__default['default'].createServer(requestHandler(plugins, services));
    const port = 3030;
    server.listen(port);
    console.log(`Server started on port ${port}. You can make requests to http://localhost:${port}/`);
    console.log(`Admin panel located at http://localhost:${port}/admin`);

    var softuniPracticeServer = {};
    return softuniPracticeServer;
})));
