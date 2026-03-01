const User = require('./User');
const Radio = require('./Radio');
const Subscription = require('./Subscription');
const Translation = require('./Translation');

// Define associations
User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Radio.hasMany(Translation, { foreignKey: 'radioId', as: 'translations' });
Translation.belongsTo(Radio, { foreignKey: 'radioId', as: 'radio' });

module.exports = {
  User,
  Radio,
  Subscription,
  Translation
};
