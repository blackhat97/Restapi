
const Sequelize = require('sequelize'),
      AdminsModel = require('./models/admins'),
      CommentsModel = require('./models/comments'),
      config = require('./config');

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.pass, {
  host: config.db.host,
  dialect: 'mysql',
  pool: {
    max: 100,
    min: 1,
    idle: 10000
  },

});

const Admins = AdminsModel(sequelize, Sequelize);
const Comments = CommentsModel(sequelize, Sequelize);


sequelize.sync();

module.exports = {
   Admins,
   Comments
};
