'use strict';

var loadNoti = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:

                        GPU.findAll().then(function (gpus) {
                            var _loop = function _loop(g) {
                                //cached[g.ID.toString()] = ;

                                var seenTime = g.SeenDate;

                                Computer.findOne({ where: { ID: g.ComputerID } }).then(function (c) {
                                    if (!c.isActiveNoti) {
                                        unReadNoti[g.ID.toString()] = 0;
                                    } else {
                                        var gpu = cachedSettings[c.UserID.toString()][g.Name];
                                        Fields.count({
                                            where: {
                                                Time: {
                                                    $gt: seenTime
                                                },
                                                GPUID: g.GPUID,
                                                $or: [{
                                                    FanSpeed: {
                                                        $gte: gpu.MaxFanSpeed
                                                    }
                                                }, {
                                                    FanSpeed: {
                                                        $lte: gpu.MinFanSpeed
                                                    }
                                                }, {
                                                    Temperature: {
                                                        $gte: gpu.MaxTemperature
                                                    }
                                                }, {
                                                    Temperature: {
                                                        $lte: gpu.MinTemperature
                                                    }
                                                }, {
                                                    PowerUsage: {
                                                        $gte: gpu.MaxPowerUsage
                                                    }
                                                }, {
                                                    PowerUsage: {
                                                        $lte: gpu.MinPowerUsage
                                                    }
                                                }, {
                                                    MemoryUsage: {
                                                        $gte: gpu.MaxMemoryUsage
                                                    }
                                                }, {
                                                    MemoryUsage: {
                                                        $lte: gpu.MinMemoryUsage
                                                    }
                                                }]
                                            }
                                        }).then(function (c) {
                                            unReadNoti[g.ID.toString()] = c;
                                        });
                                    }
                                });
                            };

                            var _iteratorNormalCompletion4 = true;
                            var _didIteratorError4 = false;
                            var _iteratorError4 = undefined;

                            try {
                                for (var _iterator4 = gpus[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                    var g = _step4.value;

                                    _loop(g);
                                }
                            } catch (err) {
                                _didIteratorError4 = true;
                                _iteratorError4 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                        _iterator4.return();
                                    }
                                } finally {
                                    if (_didIteratorError4) {
                                        throw _iteratorError4;
                                    }
                                }
                            }
                        });

                    case 1:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function loadNoti() {
        return _ref2.apply(this, arguments);
    };
}();

var sendNotiIfNeed = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var usersToSend, userID, oneSignalPlayerId;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        usersToSend = new Set();
                        _context3.t0 = regeneratorRuntime.keys(unReadNoti);

                    case 2:
                        if ((_context3.t1 = _context3.t0()).done) {
                            _context3.next = 17;
                            break;
                        }

                        unRead = _context3.t1.value;

                        if (!unReadNoti[unRead]) {
                            _context3.next = 15;
                            break;
                        }

                        _context3.prev = 5;
                        _context3.next = 8;
                        return sequelize.query('SELECT UserID from Computers c ' + 'WHERE (SELECT COUNT(*) FROM GPUs g WHERE g.ID = :gID AND ComputerID = c.ID) = 1', {
                            replacements: { gID: Number(unRead) }, type: sequelize.QueryTypes.SELECT
                        });

                    case 8:
                        userID = _context3.sent;


                        if (userID) {
                            oneSignalPlayerId = oneSignalPlayerIds[userID.toString()];

                            usersToSend.add(oneSignalPlayerId);
                        }
                        _context3.next = 15;
                        break;

                    case 12:
                        _context3.prev = 12;
                        _context3.t2 = _context3['catch'](5);

                        console.log(_context3.t2);

                    case 15:
                        _context3.next = 2;
                        break;

                    case 17:
                        if (usersToSend.size) {
                            sendNoti('Một số máy tính có vấn đề, vui lòng kiểm tra lại', Array.from(usersToSend));
                        }
                        setTimeout(sendNotiIfNeed, 3600000);

                    case 19:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this, [[5, 12]]);
    }));

    return function sendNotiIfNeed() {
        return _ref3.apply(this, arguments);
    };
}();

var checkGpuHealth = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _this = this;

        var timeToCheck, _loop2, userId, _ret2;

        return regeneratorRuntime.wrap(function _callee4$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        timeToCheck = new Date(Date.now() - 60 * 10 * 1000);
                        _loop2 = /*#__PURE__*/regeneratorRuntime.mark(function _loop2(userId) {
                            var comIds, comIdsStr, gpusToSend, cIds, _loop3, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, id;

                            return regeneratorRuntime.wrap(function _loop2$(_context4) {
                                while (1) {
                                    switch (_context4.prev = _context4.next) {
                                        case 0:
                                            comIds = Object.values(computers).filter(function (c) {
                                                return c.UserID === Number(userId);
                                            }).map(function (c) {
                                                return c.ID;
                                            });

                                            if (!(comIds.length === 0)) {
                                                _context4.next = 3;
                                                break;
                                            }

                                            return _context4.abrupt('return', 'continue');

                                        case 3:
                                            comIdsStr = comIds.reduce(function (str, id) {
                                                return str + id + ', ';
                                            }, '(');

                                            comIdsStr = comIdsStr.substr(0, comIdsStr.length - 2) + ')';
                                            _context4.next = 7;
                                            return sequelize.query('SELECT * FROM GPUs g WHERE ComputerID IN ' + comIdsStr + 'AND (SELECT COUNT(*) FROM Fields WHERE GPUID = g.ID AND Time > :timeToCheck) = 0', { replacements: { cids: comIds, timeToCheck: timeToCheck }, model: GPU });

                                        case 7:
                                            gpusToSend = _context4.sent;

                                            if (!gpusToSend.length) {
                                                _context4.next = 30;
                                                break;
                                            }

                                            cIds = new Set(gpusToSend.map(function (g) {
                                                return g.ComputerID;
                                            }));

                                            _loop3 = function _loop3(id) {
                                                var mess = 'Máy tính: ' + computers[id.toString()].Name + '\n' + gpusToSend.filter(function (g) {
                                                    return g.ComputerID === id;
                                                }).map(function (g) {
                                                    return 'Card: ' + g.Name + '\n';
                                                }) + 'Không hoạt động trong một thời gian dài, làm ơn kiểm tra lại\n\n';
                                                sendNoti(mess, oneSignalPlayerIds[userId]);
                                            };

                                            _iteratorNormalCompletion5 = true;
                                            _didIteratorError5 = false;
                                            _iteratorError5 = undefined;
                                            _context4.prev = 14;

                                            for (_iterator5 = Array.from(cIds)[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                                id = _step5.value;

                                                _loop3(id);
                                            }
                                            _context4.next = 22;
                                            break;

                                        case 18:
                                            _context4.prev = 18;
                                            _context4.t0 = _context4['catch'](14);
                                            _didIteratorError5 = true;
                                            _iteratorError5 = _context4.t0;

                                        case 22:
                                            _context4.prev = 22;
                                            _context4.prev = 23;

                                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                                _iterator5.return();
                                            }

                                        case 25:
                                            _context4.prev = 25;

                                            if (!_didIteratorError5) {
                                                _context4.next = 28;
                                                break;
                                            }

                                            throw _iteratorError5;

                                        case 28:
                                            return _context4.finish(25);

                                        case 29:
                                            return _context4.finish(22);

                                        case 30:
                                        case 'end':
                                            return _context4.stop();
                                    }
                                }
                            }, _loop2, _this, [[14, 18, 22, 30], [23,, 25, 29]]);
                        });
                        _context5.t0 = regeneratorRuntime.keys(oneSignalPlayerIds);

                    case 3:
                        if ((_context5.t1 = _context5.t0()).done) {
                            _context5.next = 11;
                            break;
                        }

                        userId = _context5.t1.value;
                        return _context5.delegateYield(_loop2(userId), 't2', 6);

                    case 6:
                        _ret2 = _context5.t2;

                        if (!(_ret2 === 'continue')) {
                            _context5.next = 9;
                            break;
                        }

                        return _context5.abrupt('continue', 3);

                    case 9:
                        _context5.next = 3;
                        break;

                    case 11:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee4, this);
    }));

    return function checkGpuHealth() {
        return _ref4.apply(this, arguments);
    };
}();

var resetData = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var res, minID, max;
        return regeneratorRuntime.wrap(function _callee5$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return Fields.destroy({ where: { Time: { $lte: Date(Date().value - 24 * 3600 * 1000) } } });

                    case 2:
                        res = _context6.sent;

                        console.log('delete ' + res);
                        _context6.next = 6;
                        return sequelize.query('SELECT MIN(ID) as min, MAX(ID) as max FROM Fields', { type: sequelize.QueryTypes.SELECT });

                    case 6:
                        minID = _context6.sent;

                        if (!minID['min']) {
                            _context6.next = 13;
                            break;
                        }

                        max = minID['max'];
                        _context6.next = 11;
                        return sequelize.query('UPDATE Fields SET ID = ID - :minID + 1', { replacements: { minID: minID['min'] } });

                    case 11:
                        _context6.next = 13;
                        return sequelize.query('ALTER TABLE Fields AUTO_INCREMENT = :max - :min + 2', { replacements: { max: max, min: minID['min'] } });

                    case 13:

                        unReadNoti = {};
                        _context6.next = 16;
                        return loadNoti();

                    case 16:
                        setTimeout(resetData, 6 * 3600 * 1000);

                    case 17:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee5, this);
    }));

    return function resetData() {
        return _ref5.apply(this, arguments);
    };
}();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var router = express.Router();
var db = require('../db/models/computer');
var User = db.User;
var Computer = db.Computer;
var GPU = db.GPU;
var OneSignalKey = db.OneSignalKey;
var sequelize = db.sequelize;
var Fields = db.Fields;
var Sequelize = require('sequelize');
var Setting = db.Setting;
var sendNoti = require('../Notification/notification');
var socket = require('../socket/socket');

//
// let cached = {
//     //
// };

var unReadNoti = {};

var oneSignalPlayerIds = {};

var computers = {};

var cachedSettings = {};

var DEFAULT_SETTING = {
    MinFanSpeed: 20,
    MaxFanSpeed: 100,
    MinTemperature: 40,
    MaxTemperature: 102,
    MinPowerUsage: 20,
    MaxPowerUsage: 250,
    MinMemoryUsage: null,
    MaxMemoryUsage: null
};

User.findAll({ include: [{ model: OneSignalKey, required: true }]
}).then(function (users) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = users[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            user = _step.value;

            oneSignalPlayerIds[user.ID.toString()] = user.OneSignalKeys.map(function (k) {
                return k.OneSignalKey;
            });
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
});

Computer.findAll().then(function (coms) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = coms[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            com = _step2.value;

            computers[com.ID.toString()] = com;
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
});

Setting.findAll().then(function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(settings) {
        var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, st;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _iteratorNormalCompletion3 = true;
                        _didIteratorError3 = false;
                        _iteratorError3 = undefined;
                        _context.prev = 3;

                        for (_iterator3 = settings[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            st = _step3.value;

                            if (!cachedSettings[st.UserID.toString()]) {
                                cachedSettings[st.UserID.toString()] = {};
                            }
                            cachedSettings[st.UserID.toString()][st.Name] = st;
                        }

                        _context.next = 11;
                        break;

                    case 7:
                        _context.prev = 7;
                        _context.t0 = _context['catch'](3);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context.t0;

                    case 11:
                        _context.prev = 11;
                        _context.prev = 12;

                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }

                    case 14:
                        _context.prev = 14;

                        if (!_didIteratorError3) {
                            _context.next = 17;
                            break;
                        }

                        throw _iteratorError3;

                    case 17:
                        return _context.finish(14);

                    case 18:
                        return _context.finish(11);

                    case 19:
                        _context.next = 21;
                        return loadNoti();

                    case 21:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[3, 7, 11, 19], [12,, 14, 18]]);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}());

setTimeout(sendNotiIfNeed, 1000);

setTimeout(checkGpuHealth, 900000);

setTimeout(resetData, 6 * 3600 * 1000);

router.post('/fields', function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
        var body, comName, userId, gpus, u, computer, socketClient, payload, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, gpuFields, gpu, isRadeon, setting, status, bounds, fs;

        return regeneratorRuntime.wrap(function _callee6$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        body = req.body;
                        comName = body.ID;
                        userId = body.User;

                        if (!(!userId || !comName)) {
                            _context7.next = 6;
                            break;
                        }

                        res.status(400).json({
                            error: 'missing User or id in body'
                        });
                        return _context7.abrupt('return');

                    case 6:
                        gpus = body.GPUs;

                        // let trans = await sequelize.transaction();

                        _context7.next = 9;
                        return User.findOne({ where: { ID: userId } });

                    case 9:
                        u = _context7.sent;
                        _context7.prev = 10;

                        if (u) {
                            _context7.next = 16;
                            break;
                        }

                        u = new User({ ID: userId });
                        // await u.save({ transaction: trans });
                        _context7.next = 15;
                        return u.save();

                    case 15:
                        cachedSettings[u.ID.toString()] = {};

                    case 16:
                        _context7.next = 22;
                        break;

                    case 18:
                        _context7.prev = 18;
                        _context7.t0 = _context7['catch'](10);

                        // await trans.rollback();
                        res.status(400).json(_context7.t0);
                        return _context7.abrupt('return');

                    case 22:
                        _context7.next = 24;
                        return Computer.findOne({ where: { Name: comName, UserID: userId } });

                    case 24:
                        computer = _context7.sent;

                        if (computer) {
                            _context7.next = 30;
                            break;
                        }

                        computer = new Computer({ Name: comName, UserID: userId });
                        _context7.next = 29;
                        return computer.save();

                    case 29:
                        computers[computer.ID.toString()] = computer;

                    case 30:
                        socketClient = socket[userId.toString()];
                        payload = {};

                        if (socketClient) {
                            payload['ID'] = computer.ID;
                            payload['GPUs'] = [];
                        }

                        _iteratorNormalCompletion6 = true;
                        _didIteratorError6 = false;
                        _iteratorError6 = undefined;
                        _context7.prev = 36;
                        _iterator6 = gpus[Symbol.iterator]();

                    case 38:
                        if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                            _context7.next = 79;
                            break;
                        }

                        gpuFields = _step6.value;
                        _context7.next = 42;
                        return GPU.findOne({ where: { STT: gpuFields.ID, ComputerID: computer.ID } });

                    case 42:
                        gpu = _context7.sent;
                        _context7.prev = 43;

                        if (gpu) {
                            _context7.next = 55;
                            break;
                        }

                        gpu = new GPU({ STT: gpuFields.ID, Name: gpuFields.Name, ComputerID: computer.ID });
                        // await gpu.save({ transaction: trans });
                        _context7.next = 48;
                        return gpu.save();

                    case 48:
                        unReadNoti[gpu.ID.toString()] = 0;

                        if (cachedSettings[userId.toString()][gpuFields.Name]) {
                            _context7.next = 55;
                            break;
                        }

                        isRadeon = gpuFields.Name.indexOf("Radeon") !== -1;
                        setting = new Setting({
                            UserID: userId,
                            Name: gpuFields.Name,
                            MinFanSpeed: DEFAULT_SETTING.MinFanSpeed,
                            MaxFanSpeed: DEFAULT_SETTING.MaxFanSpeed,
                            MinTemperature: DEFAULT_SETTING.MinTemperature,
                            MaxTemperature: DEFAULT_SETTING.MaxTemperature,
                            MinMemoryUsage: DEFAULT_SETTING.MinMemoryUsage,
                            MaxMemoryUsage: DEFAULT_SETTING.MaxMemoryUsage,
                            MinPowerUsage: isRadeon ? 0 : DEFAULT_SETTING.MinPowerUsage,
                            MaxPowerUsage: DEFAULT_SETTING.MaxPowerUsage
                        });

                        cachedSettings[userId.toString()][gpuFields.Name] = setting;
                        _context7.next = 55;
                        return setting.save();

                    case 55:
                        _context7.next = 61;
                        break;

                    case 57:
                        _context7.prev = 57;
                        _context7.t1 = _context7['catch'](43);

                        // await trans.rollback();
                        res.status(400).json(_context7.t1);
                        return _context7.abrupt('return');

                    case 61:
                        status = 0;
                        bounds = cachedSettings[userId.toString()][gpuFields.Name];

                        if (computers[gpu.ComputerID.toString()].isActiveNoti) {
                            if (gpuFields.PowerUsage === 0 && gpu.Name.indexOf("Radeon") === -1 || gpuFields.MemoryUsage === -1) {
                                status = -1;
                                if (unReadNoti[gpu.ID.toString()] === 0) {
                                    sendNoti('Máy tính: ' + computer.Name + '\n' + 'Card: ' + gpu.Name + '\n' + 'Không có tải', oneSignalPlayerIds[userId.toString()]);
                                }
                                unReadNoti[gpu.ID.toString()] += 1;
                            } else if (bounds.MaxFanSpeed && gpuFields.FanSpeed > bounds.MaxFanSpeed || bounds.MinFanSpeed && gpuFields.FanSpeed < bounds.MinFanSpeed || bounds.MaxMemoryUsage && gpuFields.MemoryUsage > bounds.MaxMemoryUsage || bounds.MinMemoryUsage && gpuFields.MemoryUsage < bounds.MinMemoryUsage || bounds.MaxPowerUsage && gpuFields.PowerUsage > bounds.MaxPowerUsage || bounds.MinPowerUsage && gpuFields.PowerUsage < bounds.MinPowerUsage || bounds.MaxTemperature && gpuFields.Temperature > bounds.MaxTemperature || bounds.MinTemperature && gpuFields.Temperature < bounds.MinTemperature) {
                                status = 1;

                                if (unReadNoti[gpu.ID.toString()] === 0) {
                                    sendNoti('Máy tính: ' + computer.Name + '\n' + 'Card: ' + gpu.Name + '\n' + 'Vượt quá định mức', oneSignalPlayerIds[userId.toString()]);
                                }
                                unReadNoti[gpu.ID.toString()] += 1;
                            }
                        }

                        fs = new Fields({
                            FanSpeed: gpuFields.FanSpeed,
                            Temperature: gpuFields.Temperature,
                            PowerUsage: gpuFields.PowerUsage,
                            MemoryUsage: gpuFields.MemoryUsage,
                            Time: Date(),
                            Status: status,
                            GPUID: gpu.ID
                        });
                        _context7.prev = 65;
                        _context7.next = 68;
                        return fs.save();

                    case 68:
                        _context7.next = 74;
                        break;

                    case 70:
                        _context7.prev = 70;
                        _context7.t2 = _context7['catch'](65);

                        res.status(400).json(_context7.t2);
                        return _context7.abrupt('return');

                    case 74:

                        if (socketClient) {
                            payload.GPUs.push(fs);
                        }

                        if (socketClient) {
                            socketClient.emit('event', payload);
                        }

                    case 76:
                        _iteratorNormalCompletion6 = true;
                        _context7.next = 38;
                        break;

                    case 79:
                        _context7.next = 85;
                        break;

                    case 81:
                        _context7.prev = 81;
                        _context7.t3 = _context7['catch'](36);
                        _didIteratorError6 = true;
                        _iteratorError6 = _context7.t3;

                    case 85:
                        _context7.prev = 85;
                        _context7.prev = 86;

                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }

                    case 88:
                        _context7.prev = 88;

                        if (!_didIteratorError6) {
                            _context7.next = 91;
                            break;
                        }

                        throw _iteratorError6;

                    case 91:
                        return _context7.finish(88);

                    case 92:
                        return _context7.finish(85);

                    case 93:

                        res.sendStatus(200);

                    case 94:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee6, undefined, [[10, 18], [36, 81, 85, 93], [43, 57], [65, 70], [86,, 88, 92]]);
    }));

    return function (_x2, _x3, _x4) {
        return _ref6.apply(this, arguments);
    };
}());

router.get('/computers', function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res, next) {
        var user, comps;
        return regeneratorRuntime.wrap(function _callee7$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        user = req.headers.user;

                        if (user) {
                            _context8.next = 4;
                            break;
                        }

                        res.status(400).json({
                            error: 'missing user id'
                        });
                        return _context8.abrupt('return');

                    case 4:
                        _context8.next = 6;
                        return Computer.findAll({
                            where: {
                                UserID: Number(user)
                            },
                            include: [GPU]
                        });

                    case 6:
                        comps = _context8.sent;


                        res.json(comps);

                    case 8:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function (_x5, _x6, _x7) {
        return _ref7.apply(this, arguments);
    };
}());

// router.get('/settings/computers/:cid/gpus/:gid', async (req, res, next) => {
//     let body = req.body;
//     let comId = req.params.cid;
//     let gId = req.params.gid;
//     let user = req.headers.user;
//
//     if (!comId || !gId || !user) {
//         res.status(400).json({
//             error: 'missing user id'
//         });
//         return;
//     }
//
//     try {
//         let gpu = await GPU.findOne({
//             where: {
//                 ID: gId, ComputerID: comId
//             },
//             attributes: ['MaxFanSpeed', 'MaxTemperature', 'MaxPowerUsage', 'MaxMemoryUsage',
//                         'MinFanSpeed', 'MinTemperature', 'MinPowerUsage', 'MinMemoryUsage'
//             ]
//         });
//         if (gpu) {
//             res.json(gpu);
//         } else {
//             res.sendStatus(404);
//         }
//     } catch (e) {
//         res.status(400).json(e);
//     }
// });
//
// router.put('/settings/computers/:cid/gpus/:gid', async (req, res, next) => {
//    let body = req.body;
//    let comId = req.params.cid;
//    let gId = req.params.gid;
//    let user = req.headers.user;
//
//    if (!comId || !gId || !user) {
//        res.status(400).json({
//            error: 'missing user id'
//        });
//        return;
//    }
//
//    let computer = await Computer.findOne({ where: { ID: comId, UserID: Number(user) }});
//    if (computer) {
//        let gpus = await computer.getGPUs({ where: { ID: gId }});
//        let gpu = gpus.pop();
//
//        if (gpu) {
//            gpu.MaxFanSpeed = body.MaxFanSpeed;
//            gpu.MaxTemperature = body.MaxTemperature;
//            gpu.MaxPowerUsage = body.MaxPowerUsage;
//            gpu.MaxMemoryUsage = body.MaxMemoryUsage;
//            gpu.MinFanSpeed = body.MinFanSpeed;
//            gpu.MinTemperature = body.MinTemperature;
//            gpu.MinPowerUsage = body.MinPowerUsage;
//            gpu.MinMemoryUsage = body.MinMemoryUsage;
//            gpu.SeenDate = Date();
//            try {
//                await gpu.save();
//                res.sendStatus(200);
//            } catch (e) {
//                res.sendStatus(400).json(e);
//            }
//            cached[gpu.ID.toString()] = gpu;
//            unReadNoti[gpu.ID.toString()] = 0;
//
//        } else {
//            res.sendStatus(404);
//        }
//    } else {
//        res.sendStatus(404);
//    }
// });

// router.get('/settings/global', async (req, res, next) => {
//     let userId = req.headers.user;
//
//     if (!userId) {
//         res.status(403).json('missing user in header');
//         return;
//     }
//
//     let user = await User.findOne({
//         where: { ID: userId },
//         attributes: ['MaxFanSpeed', 'MaxTemperature', 'MaxPowerUsage', 'MaxMemoryUsage',
//             'MinFanSpeed', 'MinTemperature', 'MinPowerUsage', 'MinMemoryUsage'
//         ]
//     });
//     if (!user) {
//         res.sendStatus(404);
//     }
//
//     res.json(user);
// });
//
// router.put('/settings/global', async (req, res, next) => {
//     let userId = req.headers.user;
//     if(!userId) {
//         res.status(403).json('missing user in header');
//         return;
//     }
//
//     let updateValues = req.body;
//
//     try {
//         await User.update(updateValues, { where: { ID: userId }});
//         res.sendStatus(200);
//     } catch (e) {
//         res.status(400).json(e);
//     }
// });

router.get('/gpus/:gid/fields', function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res, next) {
        var begin, limit, gid, statuses, statusQuery, fields;
        return regeneratorRuntime.wrap(function _callee8$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        begin = req.query['begin'];
                        limit = req.query['limit'];
                        gid = req.params.gid;

                        if (!(!begin || !limit)) {
                            _context9.next = 6;
                            break;
                        }

                        res.status(400).json({
                            error: 'missing begin || limit in query params'
                        });
                        return _context9.abrupt('return');

                    case 6:
                        statuses = [0, 1, -1];
                        statusQuery = req.query['status'];

                        if (statusQuery) {
                            statuses = statusQuery.split(',').map(function (s) {
                                return parseInt(s);
                            });
                        }

                        _context9.next = 11;
                        return Fields.findAll({
                            where: {
                                ID: _defineProperty({}, Sequelize.Op.lte, Number(begin)),
                                GPUID: gid,
                                Status: {
                                    $in: statuses
                                }
                            },
                            limit: Number(limit),
                            order: [["ID", "DESC"]]
                        });

                    case 11:
                        fields = _context9.sent;


                        res.json(fields);

                    case 13:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function (_x8, _x9, _x10) {
        return _ref8.apply(this, arguments);
    };
}());

router.get('/gpus/:gid/fields/latest', function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res, next) {
        var time, gid, fields;
        return regeneratorRuntime.wrap(function _callee9$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        time = new Date(Date.now() - 60 * 10 * 1000);
                        gid = req.params.gid;
                        _context10.next = 4;
                        return Fields.findOne({ where: {
                                Time: {
                                    $gte: time
                                },
                                GPUID: gid
                            }
                        });

                    case 4:
                        fields = _context10.sent;


                        res.json(fields);

                    case 6:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee9, undefined);
    }));

    return function (_x11, _x12, _x13) {
        return _ref9.apply(this, arguments);
    };
}());

router.get('/gpus/:gid/exceeds', function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res, next) {
        var user, gId, gpu, seenTime, cached, count;
        return regeneratorRuntime.wrap(function _callee10$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        user = req.headers.user;

                        if (user) {
                            _context11.next = 4;
                            break;
                        }

                        res.status(403).json({
                            error: 'missing user in header'
                        });
                        return _context11.abrupt('return');

                    case 4:
                        gId = req.params.gid;
                        _context11.next = 7;
                        return GPU.findOne({ where: { ID: gId } });

                    case 7:
                        gpu = _context11.sent;

                        if (gpu) {
                            _context11.next = 11;
                            break;
                        }

                        res.sendStatus(404);
                        return _context11.abrupt('return');

                    case 11:
                        seenTime = gpu.SeenDate;
                        cached = cachedSettings[user][gpu.Name];

                        if (cached) {
                            _context11.next = 16;
                            break;
                        }

                        res.sendStatus(404);
                        return _context11.abrupt('return');

                    case 16:
                        _context11.next = 18;
                        return Fields.count({
                            where: {
                                Time: {
                                    $gt: seenTime
                                },
                                Status: {
                                    $ne: 0
                                },
                                GPUID: gId
                            }
                        });

                    case 18:
                        count = _context11.sent;


                        res.json({
                            count: count
                        });

                    case 20:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, _callee10, undefined);
    }));

    return function (_x14, _x15, _x16) {
        return _ref10.apply(this, arguments);
    };
}());

router.get('/gpus/:gid/fields/average', function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(req, res, next) {
        var time, user, gpuId, gpu, json;
        return regeneratorRuntime.wrap(function _callee11$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        time = req.query['from'];
                        user = req.headers.user;
                        gpuId = req.params.gid;
                        _context12.next = 5;
                        return GPU.findOne({ where: { ID: gpuId } });

                    case 5:
                        gpu = _context12.sent;

                        if (gpu) {
                            _context12.next = 9;
                            break;
                        }

                        res.sendStatus(404);
                        return _context12.abrupt('return');

                    case 9:
                        if (user) {
                            _context12.next = 12;
                            break;
                        }

                        res.status(403).json({
                            error: 'missing user in header'
                        });
                        return _context12.abrupt('return');

                    case 12:

                        if (!time) {
                            time = 0;
                        } else {
                            time = Number(time);
                        }

                        time = new Date(time * 1000);

                        _context12.prev = 14;
                        _context12.next = 17;
                        return Fields.findAll({
                            where: {
                                GPUID: gpuId,
                                Time: {
                                    $gt: time
                                }
                            },
                            attributes: [[sequelize.fn('IFNULL', sequelize.fn('AVG', sequelize.col('FanSpeed')), 0), 'FanSpeed'], [sequelize.fn('IFNULL', sequelize.fn('AVG', sequelize.col('Temperature')), 0), 'Temperature'], [sequelize.fn('IFNULL', sequelize.fn('AVG', sequelize.col('PowerUsage')), 0), 'PowerUsage'], [sequelize.fn('IFNULL', sequelize.fn('AVG', sequelize.col('MemoryUsage')), 0), 'MemoryUsage']]
                        });

                    case 17:
                        json = _context12.sent;

                        if (!cachedSettings[user][gpu.Name]) {
                            _context12.next = 22;
                            break;
                        }

                        _context12.next = 21;
                        return Fields.count({
                            where: {
                                Time: {
                                    $gt: time
                                },
                                Status: {
                                    $ne: 0
                                },
                                GPUID: gpuId
                            }
                        });

                    case 21:
                        json[0]['dataValues']['exceeds'] = _context12.sent;

                    case 22:

                        if (json) {
                            res.json(json);
                        } else {
                            res.sendStatus(404);
                        }
                        _context12.next = 28;
                        break;

                    case 25:
                        _context12.prev = 25;
                        _context12.t0 = _context12['catch'](14);

                        res.status(400).json(_context12.t0);

                    case 28:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _callee11, undefined, [[14, 25]]);
    }));

    return function (_x17, _x18, _x19) {
        return _ref11.apply(this, arguments);
    };
}());

router.put('/gpus/:gid/exceeds/seen', function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(req, res, next) {
        var gpuId, user, updateResult, count;
        return regeneratorRuntime.wrap(function _callee12$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        gpuId = req.params.gid;
                        user = req.headers.user;

                        if (user) {
                            _context13.next = 5;
                            break;
                        }

                        res.status(403).json({
                            error: 'missing user in header'
                        });
                        return _context13.abrupt('return');

                    case 5:
                        _context13.next = 7;
                        return GPU.update({
                            SeenDate: Date()
                        }, {
                            where: {
                                ID: gpuId
                            }
                        });

                    case 7:
                        updateResult = _context13.sent;

                        if (!(updateResult === 0)) {
                            _context13.next = 13;
                            break;
                        }

                        res.sendStatus(404);
                        return _context13.abrupt('return');

                    case 13:
                        count = updateResult[0];

                        if (count === 1) {
                            res.sendStatus(200);

                            unReadNoti[gpuId.toString()] = 0;
                        } else {
                            res.sendStatus(404);
                        }

                    case 15:
                    case 'end':
                        return _context13.stop();
                }
            }
        }, _callee12, undefined);
    }));

    return function (_x20, _x21, _x22) {
        return _ref12.apply(this, arguments);
    };
}());

router.put('/notification/:id', function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(req, res, next) {
        var user, oneSignalId, check, newOneSignalId;
        return regeneratorRuntime.wrap(function _callee13$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        user = req.headers.user;
                        oneSignalId = req.params.id;

                        if (user) {
                            _context14.next = 5;
                            break;
                        }

                        res.status(403).json({
                            error: 'missing user in header'
                        });
                        return _context14.abrupt('return');

                    case 5:
                        _context14.prev = 5;
                        _context14.next = 8;
                        return OneSignalKey.count({ where: { OneSignalKey: oneSignalId } });

                    case 8:
                        check = _context14.sent;

                        if (!(check === 0)) {
                            _context14.next = 18;
                            break;
                        }

                        newOneSignalId = new OneSignalKey({ UserID: Number(user), OneSignalKey: oneSignalId });
                        _context14.next = 13;
                        return newOneSignalId.save();

                    case 13:
                        res.sendStatus(200);

                        if (!oneSignalPlayerIds[user]) {
                            oneSignalPlayerIds[user] = [];
                        }
                        oneSignalPlayerIds[user].push(oneSignalId);
                        _context14.next = 19;
                        break;

                    case 18:
                        res.sendStatus(200);

                    case 19:
                        _context14.next = 24;
                        break;

                    case 21:
                        _context14.prev = 21;
                        _context14.t0 = _context14['catch'](5);

                        res.status(400).json(_context14.t0);

                    case 24:
                    case 'end':
                        return _context14.stop();
                }
            }
        }, _callee13, undefined, [[5, 21]]);
    }));

    return function (_x23, _x24, _x25) {
        return _ref13.apply(this, arguments);
    };
}());

router.get('/settings', function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(req, res, next) {
        var user, settings;
        return regeneratorRuntime.wrap(function _callee14$(_context15) {
            while (1) {
                switch (_context15.prev = _context15.next) {
                    case 0:
                        user = req.headers.user;

                        if (user) {
                            _context15.next = 4;
                            break;
                        }

                        res.status(403).json({
                            error: 'missing user in header'
                        });
                        return _context15.abrupt('return');

                    case 4:
                        _context15.prev = 4;
                        _context15.next = 7;
                        return Setting.findAll({ where: { UserID: Number(user) } });

                    case 7:
                        settings = _context15.sent;

                        res.json(settings);
                        _context15.next = 14;
                        break;

                    case 11:
                        _context15.prev = 11;
                        _context15.t0 = _context15['catch'](4);

                        res.status(400).json(_context15.t0);

                    case 14:
                    case 'end':
                        return _context15.stop();
                }
            }
        }, _callee14, undefined, [[4, 11]]);
    }));

    return function (_x26, _x27, _x28) {
        return _ref14.apply(this, arguments);
    };
}());

router.put('/settings/:gpu', function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(req, res, next) {
        var user, gpu, updateResult, cachedSetting, updateResult2;
        return regeneratorRuntime.wrap(function _callee15$(_context16) {
            while (1) {
                switch (_context16.prev = _context16.next) {
                    case 0:
                        user = req.headers.user;

                        if (user) {
                            _context16.next = 4;
                            break;
                        }

                        res.status(403).json({
                            error: 'missing user in header'
                        });
                        return _context16.abrupt('return');

                    case 4:
                        gpu = req.params.gpu;
                        _context16.prev = 5;
                        _context16.next = 8;
                        return Setting.update(req.body, { where: { UserID: Number(user), Name: gpu } });

                    case 8:
                        updateResult = _context16.sent;

                        if (!(updateResult.count === 0)) {
                            _context16.next = 12;
                            break;
                        }

                        res.sendStatus(404);
                        return _context16.abrupt('return');

                    case 12:

                        cachedSettings[user][gpu].MaxFanSpeed = req.body.MaxFanSpeed;
                        cachedSettings[user][gpu].MinFanSpeed = req.body.MinFanSpeed;
                        cachedSettings[user][gpu].MaxTemperature = req.body.MaxTemperature;
                        cachedSettings[user][gpu].MinTemperature = req.body.MinTemperature;
                        cachedSettings[user][gpu].MaxPowerUsage = req.body.MaxPowerUsage;
                        cachedSettings[user][gpu].MinPowerUsage = req.body.MinPowerUsage;
                        cachedSettings[user][gpu].MaxMemoryUsage = req.body.MaxMemoryUsage;
                        cachedSettings[user][gpu].MinMemoryUsage = req.body.MinMemoryUsage;
                        cachedSetting = cachedSettings[user][gpu];
                        _context16.next = 23;
                        return sequelize.query('UPDATE Fields SET Status = ' + 'IF(FanSpeed < :minf OR FanSpeed > :maxf ' + 'OR Temperature < :mint OR Temperature > :maxt ' + 'OR PowerUsage < :minp OR PowerUsage > :maxp ' + 'OR MemoryUsage < :minm OR MemoryUsage > :maxm, 1, 0) ' + 'WHERE GPUID IN ' + '(SELECT ID FROM GPUs WHERE ComputerID IN ' + '(SELECT ID FROM Computers WHERE UserID = :user)) AND Status != -1', {
                            replacements: {
                                'minf': cachedSetting.MinFanSpeed,
                                'maxf': cachedSetting.MaxFanSpeed,
                                'mint': cachedSetting.MinTemperature,
                                'maxt': cachedSetting.MaxTemperature,
                                'minp': cachedSetting.MinPowerUsage,
                                'maxp': cachedSetting.MaxPowerUsage,
                                'minm': cachedSetting.MinMemoryUsage,
                                'maxm': cachedSetting.MaxMemoryUsage,
                                'user': Number(user)
                            }
                        });

                    case 23:
                        updateResult2 = _context16.sent;


                        res.sendStatus(200);
                        _context16.next = 30;
                        break;

                    case 27:
                        _context16.prev = 27;
                        _context16.t0 = _context16['catch'](5);

                        res.status(400).json(_context16.t0);

                    case 30:
                    case 'end':
                        return _context16.stop();
                }
            }
        }, _callee15, undefined, [[5, 27]]);
    }));

    return function (_x29, _x30, _x31) {
        return _ref15.apply(this, arguments);
    };
}());

router.delete('/computers/:id', function () {
    var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(req, res, next) {
        var user, cId, deleteResult;
        return regeneratorRuntime.wrap(function _callee16$(_context17) {
            while (1) {
                switch (_context17.prev = _context17.next) {
                    case 0:
                        user = req.headers.user;

                        if (user) {
                            _context17.next = 4;
                            break;
                        }

                        res.status(403).json({
                            error: 'missing user in header'
                        });
                        return _context17.abrupt('return');

                    case 4:
                        cId = req.params.id;
                        _context17.next = 7;
                        return Computer.destroy({ where: { UserID: Number(user), ID: cId } });

                    case 7:
                        deleteResult = _context17.sent;

                        if (deleteResult.count === 0) {
                            res.sendStatus(404);
                        } else {
                            res.sendStatus(200);
                        }

                    case 9:
                    case 'end':
                        return _context17.stop();
                }
            }
        }, _callee16, undefined);
    }));

    return function (_x32, _x33, _x34) {
        return _ref16.apply(this, arguments);
    };
}());

router.delete('/computers/:cId/gpus/:gId', function () {
    var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(req, res, next) {
        var user, computerID, gpuID, requestResult;
        return regeneratorRuntime.wrap(function _callee17$(_context18) {
            while (1) {
                switch (_context18.prev = _context18.next) {
                    case 0:
                        user = req.headers.user;

                        if (user) {
                            _context18.next = 4;
                            break;
                        }

                        res.status(403).json({
                            error: 'missing user in header'
                        });
                        return _context18.abrupt('return');

                    case 4:
                        computerID = req.params.cId;
                        gpuID = req.params.gId;
                        _context18.next = 8;
                        return sequelize.query('DELETE FROM GPUs WHERE ComputerID = :cId AND ID = :id AND (SELECT COUNT(*) FROM Computers WHERE ID = :n_comId AND UserID = :userId) = 1;', { replacements: { cId: computerID, id: gpuID, n_comId: computerID, userId: Number(user) } });

                    case 8:
                        requestResult = _context18.sent;


                        if (requestResult.count === 0) {
                            res.sendStatus(404);
                        } else {
                            res.sendStatus(200);
                        }

                    case 10:
                    case 'end':
                        return _context18.stop();
                }
            }
        }, _callee17, undefined);
    }));

    return function (_x35, _x36, _x37) {
        return _ref17.apply(this, arguments);
    };
}());

router.get('/gpus/health', function () {
    var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(req, res, next) {
        var user, timeToCheck, result;
        return regeneratorRuntime.wrap(function _callee18$(_context19) {
            while (1) {
                switch (_context19.prev = _context19.next) {
                    case 0:
                        user = req.headers.user;

                        if (user) {
                            _context19.next = 4;
                            break;
                        }

                        res.status(403).json({
                            error: 'missing user in header'
                        });
                        return _context19.abrupt('return');

                    case 4:
                        timeToCheck = new Date(Date.now() - 600000);
                        _context19.next = 7;
                        return sequelize.query('SELECT ID, ' + 'IF((SELECT 1 FROM Fields WHERE GPUID = g.ID AND Time > :timeToCheck LIMIT 1) = 1, ' + '(SELECT COUNT(*) FROM Fields WHERE GPUID = g.ID AND Time > g.SeenDate AND Status != 0), ' + '-1) as health ' + 'FROM GPUs g WHERE g.ComputerID IN (SELECT ID FROM Computers WHERE UserID = :user)', { replacements: { timeToCheck: timeToCheck, user: Number(user) }, type: sequelize.QueryTypes.SELECT });

                    case 7:
                        result = _context19.sent;


                        res.json(result);

                    case 9:
                    case 'end':
                        return _context19.stop();
                }
            }
        }, _callee18, undefined);
    }));

    return function (_x38, _x39, _x40) {
        return _ref18.apply(this, arguments);
    };
}());

router.put('/computers/:id/active/:isActive', function () {
    var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(req, res, next) {
        var user, comId, isActive, updateResult;
        return regeneratorRuntime.wrap(function _callee19$(_context20) {
            while (1) {
                switch (_context20.prev = _context20.next) {
                    case 0:
                        user = req.headers.user;

                        if (user) {
                            _context20.next = 4;
                            break;
                        }

                        res.status(403).json({
                            error: 'missing user in header'
                        });
                        return _context20.abrupt('return');

                    case 4:
                        comId = req.params.id;
                        isActive = req.params.isActive;


                        try {
                            updateResult = Computer.update({ isActiveNoti: isActive === "true" }, { where: { UserID: Number(user), ID: Number(comId) } });

                            if (updateResult.count === 0) {
                                res.sendStatus(404);
                            } else {
                                computers[comId].isActiveNoti = isActive === "true";
                                res.sendStatus(200);
                            }
                        } catch (e) {
                            res.status(400).json(e);
                        }

                    case 7:
                    case 'end':
                        return _context20.stop();
                }
            }
        }, _callee19, undefined);
    }));

    return function (_x41, _x42, _x43) {
        return _ref19.apply(this, arguments);
    };
}());

router.put('/computers/:name/new-name/:newname', function () {
    var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(req, res, next) {
        var user, newName, oldName, count, result, computer;
        return regeneratorRuntime.wrap(function _callee20$(_context21) {
            while (1) {
                switch (_context21.prev = _context21.next) {
                    case 0:
                        user = req.headers.user;

                        if (user) {
                            _context21.next = 4;
                            break;
                        }

                        res.status(403).json({
                            error: 'missing user in header'
                        });
                        return _context21.abrupt('return');

                    case 4:
                        newName = req.params.newname;
                        oldName = req.params.name;
                        _context21.prev = 6;
                        _context21.next = 9;
                        return Computer.count({ where: { Name: newName, UserID: Number(user) } });

                    case 9:
                        count = _context21.sent;

                        if (!(count !== 0)) {
                            _context21.next = 13;
                            break;
                        }

                        res.sendStatus(403);
                        return _context21.abrupt('return');

                    case 13:
                        _context21.next = 15;
                        return Computer.update({ Name: newName }, { where: { Name: oldName, UserID: Number(user) } });

                    case 15:
                        result = _context21.sent;

                        if (!(result.count === 0)) {
                            _context21.next = 20;
                            break;
                        }

                        res.sendStatus(404);
                        _context21.next = 29;
                        break;

                    case 20:
                        res.sendStatus(200);

                        _context21.t0 = regeneratorRuntime.keys(computers);

                    case 22:
                        if ((_context21.t1 = _context21.t0()).done) {
                            _context21.next = 29;
                            break;
                        }

                        computer = _context21.t1.value;

                        if (!(computer.UserID === Number(user) && computer.Name === oldName)) {
                            _context21.next = 27;
                            break;
                        }

                        computer.Name = newName;
                        return _context21.abrupt('return');

                    case 27:
                        _context21.next = 22;
                        break;

                    case 29:
                        _context21.next = 34;
                        break;

                    case 31:
                        _context21.prev = 31;
                        _context21.t2 = _context21['catch'](6);

                        res.status(400).json(_context21.t2);

                    case 34:
                    case 'end':
                        return _context21.stop();
                }
            }
        }, _callee20, undefined, [[6, 31]]);
    }));

    return function (_x44, _x45, _x46) {
        return _ref20.apply(this, arguments);
    };
}());

module.exports = router;
//# sourceMappingURL=api.js.map