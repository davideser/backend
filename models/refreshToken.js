const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

class RefreshToken extends Model {
  static associate(models) {
    RefreshToken.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
  static async createToken(user) {
    const refreshToken = require('crypto').randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    return await RefreshToken.create({ token: refreshToken, userId: user.id, expiresAt });
  }
  static async verifyToken(token) {
    const refreshToken = await RefreshToken.findOne({ where: { token } });
    if (!refreshToken) throw new Error('Token non valido');
    if (new Date() > refreshToken.expiresAt) {
      await refreshToken.destroy();
      throw new Error('Token scaduto');
    }
    return refreshToken;
  }
}

RefreshToken.init({
  token: { type: DataTypes.STRING, allowNull: false, unique: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'RefreshToken',
});

module.exports = RefreshToken;