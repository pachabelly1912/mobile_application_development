'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/minertracker',
    port: process.env.PORT || 8000
};

exports.default = config;
//# sourceMappingURL=config.js.map