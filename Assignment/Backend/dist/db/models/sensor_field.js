'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var computerSchema = new Schema({
    comId: { type: 'String', required: true },

    gpus: [{
        gpuId: { type: 'String', required: true },

        defaultFieldValues: {
            temp: { type: 'Number', required: true },
            fan: { type: 'Number', required: true },
            load: { type: 'Number', required: true },
            mem: { type: 'Number', required: true }
        },

        fields: [{
            temp: { type: 'Number', required: true },
            fan: { type: 'Number', required: true },
            load: { type: 'Number', required: true },
            mem: { type: 'Number', required: true },
            dateAdded: { type: 'Date', default: Date.now, required: true, index: true }
        }]
    }]
});

exports.default = _mongoose2.default.model('Computer', computerSchema);
//# sourceMappingURL=computer.js.map