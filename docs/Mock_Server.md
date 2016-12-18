# Mock Server

The mock server is used to return canned API responses to HTTP requests and validate the content of those requests.

## Using the Mock server

```javascript
import MockServer from '../../util/mock-server';

MockServer.listen({
    method: 'GET',
    endpoint: '/api/item',
    response: {
        status: 'success',
        data: {
            item: {
                address: 'iGwEZUvfA',
                modelAddress: 'm8y7nEtAe',
                status: 'AVAILABLE'
            }
        }
    }
}).then(() => {
    /**
     * Make the API Request
     * GET /api/item
     * {
     *     "address": "iGwEZUvfA"
     * }
     */
}).then(() => {
    MockServer.validate({
        address: 'iGwEZUvfA'
    });
});
```
