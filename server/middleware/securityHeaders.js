const helmet = require('helmet');

const applySecurityHeaders = helmet({
    contentSecurityPolicy: false, // Adjust as needed
});

module.exports = applySecurityHeaders;
