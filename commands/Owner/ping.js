const config = require("../../config.json");

module.exports = {
  name: "test",
  usage: "",
  ownerOnly: true,
  cooldown: 5000,
  botPermission: [],
  authorPermission: [],
  aliases: [],
  description: "",
  run: async (client, message, args) => {
    return message.channel.send("Sa").then(x => x.delete({timeout: 5000}))
  }
};