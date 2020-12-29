const config = require("../config.json")
const db = require("wio.db");
const { ownerID, default_prefix } = require("../config.json");
let cooldown = {}

module.exports.run = async (client, message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  
  let prefix = await db.fetch(`prefix_${message.guild.id}`);
  if (prefix === null) prefix = default_prefix;

  if (!message.content.startsWith(prefix)) return;

  if (!message.member)
    message.member = await message.guild.members.fetch(message);

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let cmdx = await db.fetch(`cmd_${message.guild.id}`)

  if (cmdx) {
    let cmdy = cmdx.find(x => x.name === cmd)
    if (cmdy) message.channel.send(cmdy.responce)
  }
  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (!command) return;
  
  if (command.botPermission) {
    let neededPerms = []

    command.botPermission.forEach(p => {
      if (!message.guild.me.hasPermission(p)) neededPerms.push("`" + p + "`")
    })

    if (neededPerms.length) return message.channel.send(`Yetersiz yetki. ${neededPerms.join(", ")} bu komutu kullanabilmek için yeterli yetkiye sahip olmalısın.`)
  } else if (command.authorPermission) {
    let neededPerms = []


    command.authorPermission.forEach(p => {
      if (!message.member.hasPermission(p)) neededPerms.push("`" + p + "`")
    })

    if (neededPerms.length) return message.channel.send(`Yetersiz yetki. ${neededPerms.join(", ")} bu komutu kullanabilmek için yeterli yetkiye sahip olmalısın.`)
  }

  if (command.ownerOnly) {
    if (message.author.id !== ownerID) return message.channel.send("Bu komut sadece kurucuya ait.")
  }

  let uCooldown = cooldown[message.author.id];
  if (!uCooldown) {
    cooldown[message.author.id] = {}
    uCooldown = cooldown[message.author.id]
  }
  let time = uCooldown[command.name] || 0
  if (time && (time > Date.now())) return message.channel.send(`${Math.ceil((time - Date.now()) / 1000)} saniye beklemelisin.`) 
  cooldown[message.author.id][command.name] = Date.now() + command.cooldown;
  if (command) command.run(client, message, args);
}