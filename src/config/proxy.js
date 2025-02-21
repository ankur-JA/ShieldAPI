module.exports = {
    defaultTarget: process.env.TARGET_URL,
    timeout: 30000,
    proxyTimeout: 31000,
    routes: {
        '/api/v1': 'https://api-v1.target.com',
        '/api/v2': 'https://api-v2.target.com'
    },
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    blacklistedIPs: []
}; 