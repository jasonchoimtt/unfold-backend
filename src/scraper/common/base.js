/**
 * A singleton resource provider. Wraps an asynchronous function, caches the
 * resources and exposes an `invalidate` function.
 */
export class Provider {
    constructor(request) {
        this.resource = this.promise = null;
        this.request = /* promise */ request;
    }

    invalidate(resource) {
        if (this.resource === resource)
            this.resource = this.promise = null;
    }

    async get() {
        if (!this.promise) {
            this.promise = this.request();
            this.promise
                .then(resource => (this.resource = resource))
                .catch(err => {
                    // If error happens, resource should be requested the next
                    // time it is needed, so we invalidate the promise
                    this.promise = null;
                    throw err;
                });
        }

        return this.promise;
    }
}
