# Mock Server

The mock server is used to return canned API responses to HTTP requests and validate the content of those requests.

## Using the Mock server

```javascript
import MockServer from '../../util/mock-server';

let mockServer = new MockServer();

// Expect the provided request, respond with the given response
mockServer.expect({
    method: 'GET',
    endpoint: '/api/item',
    qs: {
        address: 'iGwEZUvfA'
    },
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
});

// listen on port 8080, defaults to 80
mockServer.listen(8080).then(() => {
    /**
     * Make the API Request
     * GET /api/item
     * {
     *     "address": "iGwEZUvfA"
     * }
     */
}).then(() => {
    // Validate that the expected calls, and only the expected calls, were made
    mockServer.validate();
    // Shut the server down
    mockServer.stop();
});
```
