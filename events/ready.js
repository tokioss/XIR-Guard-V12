const config = require("../config.json");
const db = require("wio.db");
module.exports.run = async client => {
  console.log("Bot is ready!");
  client.user.setActivity(await db.fetch(`status`));
};
