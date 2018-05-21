'use strict';

var Sequelize = require('sequelize');

// const sequelize = new Sequelize('vanlang', 'dev_nghia', 'nghiahoangdev@123', {
//     host: '103.1.238.181',
//     dialect: 'mysql',
//     define: {
//         timestamps: false // true by default
//     },
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// });

var sequelize = new Sequelize('minertracker', 'dev_nghia', 'nghiahoangdev@123', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false // true by default
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 60000
    },
    timezone: '+07:00',
    logging: false
});

var User = sequelize.define('User', {
    ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
}, {
    rowFormat: "COMPRESSED"
});

var OneSignalKey = sequelize.define('OneSignalKey', {
    UserID: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'ID'
        }
    },
    OneSignalKey: Sequelize.STRING
});

User.hasMany(OneSignalKey);
OneSignalKey.belongsTo(User);

var Setting = sequelize.define('Setting', {
    Name: {
        type: Sequelize.STRING
    },
    MinFanSpeed: { type: Sequelize.FLOAT },
    MaxFanSpeed: { type: Sequelize.FLOAT },
    MinTemperature: { type: Sequelize.FLOAT },
    MaxTemperature: { type: Sequelize.FLOAT },
    MinPowerUsage: { type: Sequelize.FLOAT },
    MaxPowerUsage: { type: Sequelize.FLOAT },
    MinMemoryUsage: { type: Sequelize.FLOAT },
    MaxMemoryUsage: { type: Sequelize.FLOAT },
    UserID: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'ID'
        }
    }
});

User.hasMany(Setting);
Setting.belongsTo(User);

var Computer = sequelize.define('Computer', {
    ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Name: {
        type: Sequelize.STRING
    },
    isActiveNoti: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    UserID: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'ID'
        }
    }
}, {
    rowFormat: "COMPRESSED",
    indexes: [{
        unique: true,
        fields: ['Name', 'UserID']
    }]
});

User.hasMany(Computer);
Computer.belongsTo(User);

var GPU = sequelize.define('GPU', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    STT: {
        type: Sequelize.INTEGER
    },
    Name: {
        type: Sequelize.STRING
    },
    ComputerID: {
        type: Sequelize.INTEGER,
        references: {
            model: Computer,
            key: 'ID'
        }
    },
    SeenDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, {
    rowFormat: "COMPRESSED",
    indexes: [{
        // unique: true,
        fields: ['STT', 'ComputerID']
    }]
});

Computer.hasMany(GPU);
GPU.belongsTo(Computer);

var Fields = sequelize.define('Fields', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    FanSpeed: Sequelize.FLOAT,
    Temperature: { type: Sequelize.FLOAT },
    PowerUsage: { type: Sequelize.FLOAT },
    MemoryUsage: { type: Sequelize.FLOAT },
    Time: Sequelize.DATE,
    Status: Sequelize.INTEGER,
    GPUID: {
        type: Sequelize.INTEGER,
        references: {
            model: GPU,
            key: 'ID'
        }
    }
}, {
    rowFormat: "COMPRESSED",
    indexes: [{
        fields: ['Time']
    }, {
        fields: ['GPUID', 'Time']
    }, {
        fields: ['GPUID', 'Time', 'Status']
    }, {
        fields: ['Status']
    }]
});

GPU.hasMany(Fields);
Fields.belongsTo(GPU);

User.sync({ force: false }).then(function () {
    OneSignalKey.sync({ force: false }).then(function () {});

    Computer.sync({ force: false }).then(function () {
        GPU.sync({ force: false }).then(function () {
            Fields.sync({ force: false }).then(function () {
                Setting.sync({ force: false }).then(function () {});
            });
        });
    });
});

module.exports = {
    Setting: Setting,
    Computer: Computer,
    GPU: GPU,
    Fields: Fields,
    User: User,
    OneSignalKey: OneSignalKey,
    sequelize: sequelize
};
//# sourceMappingURL=computer.js.map