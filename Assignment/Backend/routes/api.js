var express = require('express');
var router = express.Router();
const db = require('../db/models/computer');
const User = db.User;
const Computer = db.Computer;
const GPU = db.GPU;
const OneSignalKey = db.OneSignalKey;
const sequelize = db.sequelize;
const Fields = db.Fields;
const Sequelize = require('sequelize');
const Setting = db.Setting;
const sendNoti = require('../Notification/notification');
const socket = require('../socket/socket');

//
// let cached = {
//     //
// };

let unReadNoti = {

};

let oneSignalPlayerIds = {

};

let computers = {

};

let cachedSettings = {

};

const DEFAULT_SETTING = {
    MinFanSpeed: 20,
    MaxFanSpeed: 100,
    MinTemperature: 40,
    MaxTemperature: 102,
    MinPowerUsage: 20,
    MaxPowerUsage: 250,
    MinMemoryUsage: null,
    MaxMemoryUsage: null
};

User.findAll({ include: [
    { model: OneSignalKey, required: true }
]
}).then((users) => {
    for (user of users) {
        oneSignalPlayerIds[user.ID.toString()] = user.OneSignalKeys.map((k) => k.OneSignalKey);
    }
});

Computer.findAll().then((coms) => {
    for (com of coms) {
        computers[com.ID.toString()] = com;
    }
});

Setting.findAll().then(async (settings) => {
    for (let st of settings) {
        if (!cachedSettings[st.UserID.toString()]) {
            cachedSettings[st.UserID.toString()] = {}
        }
        cachedSettings[st.UserID.toString()][st.Name] = st;
    }

    await loadNoti();
});

async function loadNoti() {

    GPU.findAll().then((gpus) => {
        for (let g of gpus) {
            //cached[g.ID.toString()] = ;

            let seenTime = g.SeenDate;

            Computer.findOne({ where: { ID: g.ComputerID }}).then((c) => {
                if (!c.isActiveNoti) {
                    unReadNoti[g.ID.toString()] = 0;
                } else {
                    let gpu = cachedSettings[c.UserID.toString()][g.Name];
                    Fields.count({
                        where: {
                            Time: {
                                $gt: seenTime
                            },
                            GPUID: g.GPUID,
                            $or: [
                                {
                                    FanSpeed: {
                                        $gte: gpu.MaxFanSpeed
                                    }
                                },
                                {
                                    FanSpeed: {
                                        $lte: gpu.MinFanSpeed
                                    }
                                },
                                {
                                    Temperature: {
                                        $gte: gpu.MaxTemperature
                                    }
                                },
                                {
                                    Temperature: {
                                        $lte: gpu.MinTemperature
                                    }
                                },
                                {
                                    PowerUsage: {
                                        $gte: gpu.MaxPowerUsage
                                    }
                                },
                                {
                                    PowerUsage: {
                                        $lte: gpu.MinPowerUsage
                                    }
                                },
                                {
                                    MemoryUsage: {
                                        $gte: gpu.MaxMemoryUsage
                                    }
                                },
                                {
                                    MemoryUsage: {
                                        $lte: gpu.MinMemoryUsage
                                    }
                                }
                            ]
                        }
                    }).then((c) => {
                        unReadNoti[g.ID.toString()] = c;
                    });
                }
            });
        }
    });
}

async function sendNotiIfNeed() {
    let usersToSend = new Set();
    for (unRead in unReadNoti) {
        if (unReadNoti[unRead]) {
            try {
                let userID = await sequelize.query('SELECT UserID from Computers c ' +
                    'WHERE (SELECT COUNT(*) FROM GPUs g WHERE g.ID = :gID AND ComputerID = c.ID) = 1', {
                    replacements: { gID: Number(unRead) }, type: sequelize.QueryTypes.SELECT
                });

                if (userID) {
                    let oneSignalPlayerId = oneSignalPlayerIds[userID.toString()];
                    usersToSend.add(oneSignalPlayerId);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    if (usersToSend.size) {
        sendNoti('Một số máy tính có vấn đề, vui lòng kiểm tra lại', Array.from(usersToSend));
    }
    setTimeout(sendNotiIfNeed, 3600000);
}

setTimeout(sendNotiIfNeed, 1000);

async function checkGpuHealth() {
    let timeToCheck = new Date(Date.now() - 60 * 10 * 1000);
    for (let userId in oneSignalPlayerIds) {
        let comIds = Object.values(computers).filter((c) => {
            return c.UserID === Number(userId)
        }).map((c) => c.ID);

        if (comIds.length === 0) {
            continue;
        }

        let comIdsStr = comIds.reduce((str, id) => {
            return str + id + ', '
        }, '(');
        comIdsStr = comIdsStr.substr(0, comIdsStr.length - 2) + ')';
        let gpusToSend = await sequelize.query('SELECT * FROM GPUs g WHERE ComputerID IN ' + comIdsStr +
            'AND (SELECT COUNT(*) FROM Fields WHERE GPUID = g.ID AND Time > :timeToCheck) = 0',
            { replacements: { cids: comIds, timeToCheck: timeToCheck }, model: GPU })

        if (gpusToSend.length) {
            let cIds = new Set(gpusToSend.map(g => { return g.ComputerID }));
            for (let id of Array.from(cIds)) {
                let mess = 'Máy tính: ' + computers[id.toString()].Name + '\n' + gpusToSend.filter(g => {
                    return g.ComputerID === id
                }).map(g => {
                    return 'Card: ' + g.Name + '\n'
                }) + 'Không hoạt động trong một thời gian dài, làm ơn kiểm tra lại\n\n';
                sendNoti(mess, oneSignalPlayerIds[userId]);
            }
        }
    }
}

setTimeout(checkGpuHealth, 900000);

async function resetData() {
    //7200000
    let res = await Fields.destroy({ where: { Time: { $lte: Date(Date().value - 24 * 3600 * 1000) } }});
    console.log(`delete ${res}`);
    let minID = await sequelize.query('SELECT MIN(ID) as min, MAX(ID) as max FROM Fields', {type: sequelize.QueryTypes.SELECT});
    if (minID['min']) {
        let max = minID['max'];
        await sequelize.query('UPDATE Fields SET ID = ID - :minID + 1', { replacements: { minID: minID['min'] } });
        await sequelize.query('ALTER TABLE Fields AUTO_INCREMENT = :max - :min + 2', { replacements: { max: max, min: minID['min'] } });
    }

    unReadNoti = {};
    await loadNoti();
    setTimeout(resetData, 6 * 3600 * 1000);
}

setTimeout(resetData, 6 * 3600 * 1000);

router.post('/fields', async (req, res, next) => {
    const body = req.body;
    const comName = body.ID;
    const userId = body.User;

    if (!userId || !comName) {
        res.status(400).json({
            error: 'missing User or id in body'
        });
        return;
    }

    const gpus = body.GPUs;

    // let trans = await sequelize.transaction();
    let u = await User.findOne({ where: { ID: userId }});
    try {
        if (!u) {
            u = new User({ ID: userId });
            // await u.save({ transaction: trans });
            await u.save();
            cachedSettings[u.ID.toString()] = {}
        }
        // await trans.commit();
    } catch (e) {
        // await trans.rollback();
        res.status(400).json(e);
        return;
    }

    let computer = await Computer.findOne({ where: { Name: comName, UserID: userId }});
    if (!computer) {
        computer = new Computer({ Name: comName, UserID: userId });
        await computer.save();
        computers[computer.ID.toString()] = computer;
    }

    let socketClient = socket[userId.toString()];
    let payload = { };
    if (socketClient) {
        payload['ID'] = computer.ID;
        payload['GPUs'] = [];
    }

    for (const gpuFields of gpus) {
        // let trans = await sequelize.transaction();
        let gpu = await GPU.findOne({ where: { STT: gpuFields.ID, ComputerID: computer.ID }});

        try {
            if (!gpu) {
                gpu = new GPU({ STT: gpuFields.ID, Name: gpuFields.Name, ComputerID: computer.ID });
                // await gpu.save({ transaction: trans });
                await gpu.save();
                unReadNoti[gpu.ID.toString()] = 0;

                if (!cachedSettings[userId.toString()][gpuFields.Name]) {
                    let isRadeon = gpuFields.Name.indexOf("Radeon") !== -1;

                    let setting = new Setting({
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
                    await setting.save();
                }
            }

            // await trans.commit();
        } catch (e) {
            // await trans.rollback();
            res.status(400).json(e);
            return;
        }

        let status = 0;
        let bounds = cachedSettings[userId.toString()][gpuFields.Name];
        if (computers[gpu.ComputerID.toString()].isActiveNoti) {
            if ((gpuFields.PowerUsage === 0 && gpu.Name.indexOf("Radeon") === -1) || gpuFields.MemoryUsage === -1) {
                status = -1;
                if (unReadNoti[gpu.ID.toString()] === 0) {
                    sendNoti('Máy tính: ' + computer.Name + '\n' + 'Card: ' + gpu.Name + '\n' + 'Không có tải', oneSignalPlayerIds[userId.toString()]);
                }
                unReadNoti[gpu.ID.toString()] += 1;
            } else if ((bounds.MaxFanSpeed && gpuFields.FanSpeed > bounds.MaxFanSpeed) ||
                (bounds.MinFanSpeed && gpuFields.FanSpeed < bounds.MinFanSpeed) ||
                (bounds.MaxMemoryUsage && gpuFields.MemoryUsage > bounds.MaxMemoryUsage) ||
                (bounds.MinMemoryUsage && gpuFields.MemoryUsage < bounds.MinMemoryUsage) ||
                (bounds.MaxPowerUsage && gpuFields.PowerUsage > bounds.MaxPowerUsage) ||
                (bounds.MinPowerUsage && gpuFields.PowerUsage < bounds.MinPowerUsage) ||
                (bounds.MaxTemperature && gpuFields.Temperature > bounds.MaxTemperature) ||
                (bounds.MinTemperature && gpuFields.Temperature < bounds.MinTemperature)) {
                status = 1;

                if (unReadNoti[gpu.ID.toString()] === 0) {
                    sendNoti('Máy tính: ' + computer.Name + '\n' + 'Card: ' + gpu.Name + '\n' + 'Vượt quá định mức', oneSignalPlayerIds[userId.toString()]);
                }
                unReadNoti[gpu.ID.toString()] += 1;
            }
        }

       const fs = new Fields({
            FanSpeed: gpuFields.FanSpeed,
            Temperature: gpuFields.Temperature,
            PowerUsage: gpuFields.PowerUsage,
            MemoryUsage: gpuFields.MemoryUsage,
            Time: Date(),
            Status: status,
            GPUID: gpu.ID
        });

        try {
            await fs.save();
        } catch (e) {
            res.status(400).json(e);
            return
        }

        if (socketClient) {
            payload.GPUs.push(fs);
        }

        if (socketClient) {
            socketClient.emit('event', payload);
        }
    }

    res.sendStatus(200);
});

router.get('/computers', async (req, res, next) => {
    let user = req.headers.user;
    if (!user) {
        res.status(400).json({
            error: 'missing user id'
        });
        return;
    }

    let comps = await Computer.findAll({
        where: {
          UserID: Number(user)
        },
        include: [ GPU ]
    });

    res.json(comps);
});

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

router.get('/gpus/:gid/fields', async (req, res, next) => {
    let begin = req.query['begin'];
    let limit = req.query['limit'];
    let gid = req.params.gid;

    if (!begin || !limit) {
        res.status(400).json({
            error: 'missing begin || limit in query params'
        });
        return;
    }

    let statuses = [0, 1, -1];
    let statusQuery = req.query['status'];
    if (statusQuery) {
        statuses = statusQuery.split(',').map((s) => parseInt(s));
    }



    let fields = await Fields.findAll({
        where: {
            ID: {
                [Sequelize.Op.lte]: Number(begin)
            },
            GPUID: gid,
            Status: {
                $in: statuses
            }
        },
        limit: Number(limit),
        order: [["ID","DESC"]]
    });

    res.json(fields);
});

router.get('/gpus/:gid/fields/latest', async (req, res, next) => {
    let time = new Date(Date.now() - 60 * 10 * 1000);
    let gid = req.params.gid;
    let fields = await Fields.findOne({ where: {
            Time: {
                $gte: time
            },
            GPUID: gid
        }
    });

    res.json(fields);
});

router.get('/gpus/:gid/exceeds', async (req, res, next) => {
    let user = req.headers.user;
    if (!user) {
        res.status(403).json({
            error: 'missing user in header'
        });
        return;
    }

    let gId = req.params.gid;
    let gpu = await GPU.findOne({ where: { ID: gId } });
    if (!gpu) {
        res.sendStatus(404);
        return;
    }
    let seenTime = gpu.SeenDate;


    let cached = cachedSettings[user][gpu.Name];
    if (!cached) {
        res.sendStatus(404);
        return;
    }

    let count = await Fields.count({
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

    res.json({
        count: count
    })
});

router.get('/gpus/:gid/fields/average', async (req, res, next) => {
    let time = req.query['from'];
    let user = req.headers.user;

    let gpuId = req.params.gid;
    let gpu = await GPU.findOne({ where: { ID: gpuId } });
    if (!gpu) {
        res.sendStatus(404);
        return;
    }

    if (!user) {
        res.status(403).json({
            error: 'missing user in header'
        });
        return;
    }

    if (!time) {
        time = 0;
    } else {
        time = Number(time);
    }

    time = new Date(time * 1000);

    try {
        let json = await Fields.findAll({
            where: {
                GPUID: gpuId,
                Time: {
                    $gt: time
                }
            },
            attributes: [
                [sequelize.fn('IFNULL', sequelize.fn('AVG', sequelize.col('FanSpeed')), 0), 'FanSpeed'],
                [sequelize.fn('IFNULL', sequelize.fn('AVG', sequelize.col('Temperature')), 0), 'Temperature'],
                [sequelize.fn('IFNULL', sequelize.fn('AVG', sequelize.col('PowerUsage')), 0), 'PowerUsage'],
                [sequelize.fn('IFNULL', sequelize.fn('AVG', sequelize.col('MemoryUsage')), 0), 'MemoryUsage']
            ]
        });

        if (cachedSettings[user][gpu.Name]) {
            json[0]['dataValues']['exceeds'] = await Fields.count({
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
        }

        if (json) {
            res.json(json);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        res.status(400).json(e);
    }


});

router.put('/gpus/:gid/exceeds/seen', async (req, res, next) => {
    let gpuId = req.params.gid;
    let user = req.headers.user;

    if (!user) {
        res.status(403).json({
            error: 'missing user in header'
        });
        return;
    }

    let updateResult = await GPU.update({
                                            SeenDate: Date()
                                        },{
                                            where: {
                                                ID: gpuId
                                            }
                                        });

    if (updateResult === 0) {
        res.sendStatus(404);
        return;
    } else {
        let count = updateResult[0];
        if (count === 1) {
            res.sendStatus(200);

            unReadNoti[gpuId.toString()] = 0;
        } else {
            res.sendStatus(404);
        }
    }

});

router.put('/notification/:id', async (req, res, next) => {
    let user = req.headers.user;
    let oneSignalId = req.params.id;
    if (!user) {
        res.status(403).json({
            error: 'missing user in header'
        });
        return;
    }

    try {
        let check = await OneSignalKey.count({ where: { OneSignalKey: oneSignalId } })
        if (check === 0) {
            let newOneSignalId = new OneSignalKey({ UserID: Number(user), OneSignalKey: oneSignalId });
            await newOneSignalId.save();
            res.sendStatus(200);

            if (!oneSignalPlayerIds[user]) {
                oneSignalPlayerIds[user] = []
            }
            oneSignalPlayerIds[user].push(oneSignalId);
        } else {
            res.sendStatus(200);
        }
    } catch (e) {
        res.status(400).json(e);
    }
});

router.get('/settings', async (req, res, next) => {
    const user = req.headers.user;
    if(!user) {
        res.status(403).json({
            error: 'missing user in header'
        });
        return;
    }

    try {
        let settings = await Setting.findAll({ where: { UserID: Number(user) }});
        res.json(settings);
    } catch (e) {
        res.status(400).json(e);
    }
});

router.put('/settings/:gpu', async (req, res, next) => {
    const user = req.headers.user;
    if(!user) {
        res.status(403).json({
            error: 'missing user in header'
        });
        return;
    }

    let gpu = req.params.gpu;
    try {
        let updateResult = await Setting.update(req.body, { where: { UserID: Number(user), Name: gpu }});
        if (updateResult.count === 0) {
            res.sendStatus(404);
            return;
        }

        cachedSettings[user][gpu].MaxFanSpeed = req.body.MaxFanSpeed;
        cachedSettings[user][gpu].MinFanSpeed = req.body.MinFanSpeed;
        cachedSettings[user][gpu].MaxTemperature = req.body.MaxTemperature;
        cachedSettings[user][gpu].MinTemperature = req.body.MinTemperature;
        cachedSettings[user][gpu].MaxPowerUsage = req.body.MaxPowerUsage;
        cachedSettings[user][gpu].MinPowerUsage = req.body.MinPowerUsage;
        cachedSettings[user][gpu].MaxMemoryUsage = req.body.MaxMemoryUsage;
        cachedSettings[user][gpu].MinMemoryUsage = req.body.MinMemoryUsage;
        let cachedSetting = cachedSettings[user][gpu];

        let updateResult2 = await sequelize.query('UPDATE Fields SET Status = ' +
            'IF(FanSpeed < :minf OR FanSpeed > :maxf ' +
            'OR Temperature < :mint OR Temperature > :maxt ' +
            'OR PowerUsage < :minp OR PowerUsage > :maxp ' +
            'OR MemoryUsage < :minm OR MemoryUsage > :maxm, 1, 0) ' +
            'WHERE GPUID IN ' +
            '(SELECT ID FROM GPUs WHERE ComputerID IN ' +
            '(SELECT ID FROM Computers WHERE UserID = :user)) AND Status != -1', {
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

        res.sendStatus(200);
    } catch (e) {
        res.status(400).json(e);
    }
});

router.delete('/computers/:id', async (req, res, next) => {
    let user = req.headers.user;
    if (!user) {
        res.status(403).json({
           error: 'missing user in header'
        });
        return;
    }
    let cId = req.params.id;

    let deleteResult = await Computer.destroy({ where: { UserID: Number(user), ID: cId } });
    if (deleteResult.count === 0) {
        res.sendStatus(404);
    } else {
        res.sendStatus(200);
    }
});

router.delete('/computers/:cId/gpus/:gId', async (req, res, next) => {
    let user = req.headers.user;
    if (!user) {
        res.status(403).json({
            error: 'missing user in header'
        });
        return;
    }

    let computerID = req.params.cId;
    let gpuID = req.params.gId;

    let requestResult = await sequelize.query('DELETE FROM GPUs WHERE ComputerID = :cId AND ID = :id AND (SELECT COUNT(*) FROM Computers WHERE ID = :n_comId AND UserID = :userId) = 1;',
        { replacements: { cId: computerID, id: gpuID, n_comId: computerID, userId: Number(user) }});

    if (requestResult.count === 0) {
        res.sendStatus(404);
    } else {
        res.sendStatus(200);
    }
});

router.get('/gpus/health', async (req, res, next) => {
    let user = req.headers.user;
    if (!user) {
        res.status(403).json({
            error: 'missing user in header'
        });
        return;
    }

    let timeToCheck = new Date(Date.now() - 600000);

    let result = await sequelize.query('SELECT ID, ' +
        'IF((SELECT 1 FROM Fields WHERE GPUID = g.ID AND Time > :timeToCheck LIMIT 1) = 1, ' +
        '(SELECT COUNT(*) FROM Fields WHERE GPUID = g.ID AND Time > g.SeenDate AND Status != 0), ' +
        '-1) as health ' +
        'FROM GPUs g WHERE g.ComputerID IN (SELECT ID FROM Computers WHERE UserID = :user)',
        { replacements: { timeToCheck: timeToCheck, user: Number(user) }, type: sequelize.QueryTypes.SELECT});

    res.json(result);
});

router.put('/computers/:id/active/:isActive', async (req, res, next) => {
    let user = req.headers.user;
    if (!user) {
        res.status(403).json({
            error: 'missing user in header'
        });
        return;
    }

    let comId = req.params.id;
    let isActive = req.params.isActive;

    try {
        let updateResult = Computer.update({ isActiveNoti: isActive === "true" }, { where: { UserID: Number(user), ID: Number(comId) }})
        if (updateResult.count === 0) {
            res.sendStatus(404);
        } else {
            computers[comId].isActiveNoti = isActive === "true";
            res.sendStatus(200);
        }
    } catch (e) {
        res.status(400).json(e);
    }
});

router.put('/computers/:name/new-name/:newname', async (req, res, next) => {
   let user = req.headers.user;
   if (!user) {
       res.status(403).json({
           error: 'missing user in header'
       });
       return;
   }

   let newName = req.params.newname;
   let oldName = req.params.name;

   try {
       let count = await Computer.count({ where: { Name: newName, UserID: Number(user) } });
       if (count !== 0) {
           res.sendStatus(403);
           return;
       }
       let result = await Computer.update({ Name: newName }, { where: { Name: oldName, UserID: Number(user) } });
       if (result.count === 0) {
           res.sendStatus(404);
       } else {
           res.sendStatus(200);

           for (let computer in computers) {
               if (computer.UserID === Number(user) && computer.Name === oldName) {
                   computer.Name = newName;
                   return;
               }
           }
       }

   } catch (e) {
       res.status(400).json(e);
   }
});


module.exports = router;
