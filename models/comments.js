
module.exports = (sequelize, type) => {
  var Comments = sequelize.define('Comments', {
    commentID: {
      type: type.BIGINT,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    senderID: {
      type: type.BIGINT,
      allowNull: false,
    },
    chapterID: {
      type: type.BIGINT,
      allowNull: false,
    },
    body: {
      type: type.STRING,
      allowNull: false,
    },
    favorited: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 0	
    }

  });

  return Comments;
}
