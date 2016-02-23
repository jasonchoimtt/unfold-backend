import axios from 'axios';
import _ from 'lodash';


class RequestWrapper {
    constructor(promise) {
        this.promise = promise;
    }

    then(onFulfilled, onRejected) {
        return this.promise.then(onFulfilled, onRejected);
    }

    catch(onRejected) {
        return this.promise.catch(onRejected);
    }

    backoff() {
        // TODO
        return this;
    }

    data() {
        return this.promise.then(x => x.data);
    }
}

function create(options) {
    let client = {
        raw: axios.create(_.omit(options, 'requestHandler')),
    };

    for (let method of ['get', 'delete', 'head', 'post', 'put', 'patch']) {
        // e.g. client.get will delegate to client.request, which calls client.raw.*
        // this makes use of the fact that methods call this.request directly
        client[method] = client.raw[method].bind(client);
    }

    client.request = function(config) {
        let ret = options.requestHandler.call(this, config);
        return new RequestWrapper(ret);
    };

    return client;
}

export const client = create({
    requestHandler(config) {
        return this.raw.request(config);
    },
});

client.create = create;
