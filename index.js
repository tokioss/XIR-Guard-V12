const Discord = require("discord.js");
const { token } = require("./config.json");
const config = require("./config.json");
const discord = require("discord.js");
const db = require("wio.db");
const moment = require("moment");
const client = new discord.Client({disableEveryone: true});
require("events").EventEmitter.defaultMaxListeners = 15;
client.commands = new discord.Collection();
client.aliases = new discord.Collection();
["command", "events"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});
client.login(token);
let etkisizrol = config.saferole
let cezalırol = config.cezalırol
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on("channelCreate", async (oldChannel, newChannel) => {
  if(!etkisizrol || !cezalırol) return;
  let entry = await oldChannel.guild.fetchAuditLogs({type: "CHANNEL_CREATE"});
  let kullanıcı = await entry.entries.first();
  if(kullanıcı.executor.id === client.user.id) return;
  let entrytwo = oldChannel.guild.members.cache.get(kullanıcı.executor.id);
  if(entrytwo.roles.cache.some(roles => roles.id === etkisizrol) === true) return;
  oldChannel.delete({reason:"Oluşturulan Kanal Koruma"});
  let user = oldChannel.guild.members.cache.get(kullanıcı.executor.id);
  user.roles.set([cezalırol]);
})
client.on("channelDelete", async (oldChannel, newChannel) => {
  if(!etkisizrol || !cezalırol) return;
  let entry = await oldChannel.guild.fetchAuditLogs({type: "CHANNEL_DELETE"});
  let kullanıcı = await entry.entries.first();
  if(kullanıcı.executor.id === client.user.id) return;
  let entrytwo = oldChannel.guild.members.cache.get(kullanıcı.executor.id);
  if(entrytwo.roles.cache.some(roles => roles.id === etkisizrol) === true) return;
  let user = oldChannel.guild.members.cache.get(kullanıcı.executor.id);
  user.roles.set([cezalırol]);
  let silindi = await oldChannel.clone({
      name: oldChannel.name,
      permissions: oldChannel.permissionsOverwrites,
      type: oldChannel.type,
      topic: oldChannel.withTopic,
      nsfw: oldChannel.nsfw,
      birate: oldChannel.bitrate,
      userLimit: oldChannel.userLimit,
      rateLimitPerUser: oldChannel.rateLimitPerUser,
      permissions: oldChannel.withPermissions,
      position: oldChannel.rawPosition
    })
    let tarih = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" }
    let tarih2 = tarih;
    let user1 = client.users.cache.get(oldChannel.id)
    oldChannel.guild.owner.send(`Sunucunuzda bir kanal silindi benim sayemde kanal aynı şekilde geri açıldı, kanalı silen kullanıcının tüm rolleri alınıp cezalı rolü verildi.\n\n**DÖKÜMANLAR**\nSilinen Kanal: \`${oldChannel.id}\`\nKanalı Silen: \`${kullanıcı.executor.tag} | (${user.id})\`\nKullanıcının Hesabı Oluşturma Tarihi: \`${moment(oldChannel.createdAt).format("DD")} ${tarih2[moment(oldChannel.createdAt).format("MM")]} ${moment(oldChannel.createdAt).format("YYYY HH:mm:ss")}\``)
    return;
})
client.on("channelUpdate", async (oldChannel, newChannel) => {
  if(!etkisizrol || !cezalırol) return;
  let entry = await oldChannel.guild.fetchAuditLogs({type: "CHANNEL_UPDATE"});
  const type = await oldChannel.guild.fetchAuditLogs({ type: "CHANNEL_OVERWRITE_UPDATE" }).then(audit => audit.entries.first());
  let kullanıcı = await entry.entries.first();
  if(kullanıcı.executor.id === client.user.id) return;
  let entrytwo = oldChannel.guild.members.cache.get(kullanıcı.executor.id);
  if(entrytwo.roles.cache.some(roles => roles.id === etkisizrol) === true) return;
  let user = oldChannel.guild.members.cache.get(kullanıcı.executor.id);
  user.roles.set([cezalırol]);
  let düzenlendi = await oldChannel.edit({
      name: oldChannel.name,
      permissions: oldChannel.permissionsOverwrites,
      type: oldChannel.type,
      topic: oldChannel.withTopic,
      nsfw: oldChannel.nsfw,
      bitrate: oldChannel.bitrate,
      userLimi: oldChannel.userLimit,
      rateLlimitPerUser: oldChannel.rateLimitPerUser,
      permissions: oldChannel.withPermissions,
      position: oldChannel.rawPosition
    })
    let LastUpdate = await db.fetch(`LastUpdate.${oldChannel.guild.id}.${entrytwo.id}`);
    if(LastUpdate !== null && 120000-(Date.now()-LastUpdate)>0){
      let timeObj = require("parse-ms")(120000-(Date.now()-LastUpdate));
    } else {
      db.set(`LastUpdate.${oldChannel.guild.id}.${entrytwo.id}`, Date.now());
    }
    let tarih = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" }
    let tarih2 = tarih;
    let user1 = client.users.cache.get(oldChannel.id)
    oldChannel.guild.owner.send(`Sunucunuzda bir kanal düzenlendi benim sayemde kanal aynı şekilde geri dönüştürüldü, kanalı düzenleyen kullanıcının tüm rolleri alınıp cezalı rolü verildi.\n\n**DÖKÜMANLAR**\nDüzenlenen Kanal: \`${oldChannel.id}\`\nKanalı Düzenleyen: \`${kullanıcı.executor.tag} | (${user.id})\`\nKullanıcının Hesabı Oluşturma Tarihi: \`${moment(oldChannel.createdAt).format("DD")} ${tarih2[moment(oldChannel.createdAt).format("MM")]} ${moment(oldChannel.createdAt).format("YYYY HH:mm:ss")}\``)
    return;
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on("roleCreate", async (oldRole, newRole) => {
  if(!etkisizrol || !cezalırol) return;
  let entry = await oldRole.guild.fetchAuditLogs({type: "ROLE_CREATE"});
  let kullanıcı = await entry.entries.first();
  if(kullanıcı.executor.id === client.user.id) return;
  let entrytwo = oldRole.guild.members.cache.get(kullanıcı.executor.id);
  if(entrytwo.roles.cache.some(roles => roles.id === etkisizrol) === true) return;
  let user = oldRole.guild.members.cache.get(kullanıcı.executor.id);
  user.roles.set([cezalırol]);
  oldRole.delete({ reason: "Oluşturulan Rol Koruma" }).catch(error => console.log(error));
  let tarih = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" }
  let tarih2 = tarih;
  let user1 = client.users.cache.get(oldRole.id)
  oldRole.guild.owner.send(`Sunucunuzda bir rol oluşturuldu benim sayemde rol silindi, rolü oluşturan kullanıcının tüm rolleri alınıp cezalı rolü verildi.\n\n**DÖKÜMANLAR**\nOluşturulan Rol: \`yenirol\`\nRolü Oluşturan: \`${kullanıcı.executor.tag} | (${user.id})\`\nKullanıcının Hesabı Oluşturma Tarihi: \`${moment(oldRole.createdAt).format("DD")} ${tarih2[moment(oldRole.createdAt).format("MM")]} ${moment(oldRole.createdAt).format("YYYY HH:mm:ss")}\``)
  return;
})
client.on("roleDelete", async (oldRole, newRole) => {
  if(!etkisizrol || !cezalırol) return;
  let entry = await oldRole.guild.fetchAuditLogs({type: "ROLE_DELETE"});
  let kullanıcı = await entry.entries.first();
  if(kullanıcı.executor.id === client.user.id) return;
  let entrytwo = oldRole.guild.members.cache.get(kullanıcı.executor.id);
  if(entrytwo.roles.cache.some(roles => roles.id === etkisizrol) === true) return;
  let user = oldRole.guild.members.cache.get(kullanıcı.executor.id);
  user.roles.set([cezalırol]);
  let silindi = await oldRole.guild.roles.create({
      data: {
        name: oldRole.name,
        color: oldRole.hexColor,
        permissions: oldRole.permissions,
        hoist: oldRole.hoist,
        mentionable: oldRole.mentionable,
        position: oldRole.rawPosition,
        highest: oldRole.highest
      }
    })
    let tarih = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" }
    let tarih2 = tarih;
    let user1 = client.users.cache.get(oldRole.id)
    oldRole.guild.owner.send(`Sunucunuzda bir rol silindi benim sayemde rol aynı şekilde geri oluşturuldu, rolü silen kullanıcının tüm rolleri alınıp cezalı rolü verildi.\n\n**DÖKÜMANLAR**\nSilinen Rol: \`${oldRole.id}\`\nRolü Silen: \`${kullanıcı.executor.tag} | (${user.id})\`\nKullanıcının Hesabı Oluşturma Tarihi: \`${moment(oldRole.createdAt).format("DD")} ${tarih2[moment(oldRole.createdAt).format("MM")]} ${moment(oldRole.createdAt).format("YYYY HH:mm:ss")}\``)
    return;
})
client.on("roleUpdate", async (oldRole, newRole) => {
  if(!etkisizrol || !cezalırol) return;
  let entry = await oldRole.guild.fetchAuditLogs({type: "ROLE_UPDATE"});
  const type = await oldRole.guild.fetchAuditLogs({ type: "ROLE_OVERWRITE_UPDATE" }).then(audit => audit.entries.first());
  let kullanıcı = await entry.entries.first();
  if(kullanıcı.executor.id === client.user.id) return;
  let entrytwo = oldRole.guild.members.cache.get(kullanıcı.executor.id);
  if(entrytwo.roles.cache.some(roles => roles.id === etkisizrol) === true) return;
  let user = oldRole.guild.members.cache.get(kullanıcı.executor.id);
  user.roles.set([cezalırol]);
  let role = await oldRole.edit({
      data: {
        name: oldRole.name,
        color: oldRole.hexColor,
        permissions: oldRole.permissions,
        hoist: oldRole.hoist,
        mentionable: oldRole.mentionable,
        position: oldRole.rawPosition,
        highest: oldRole.highest
      }
    })
    let LastUpdate = await db.fetchs(`lasUpdate.${oldRole.guild.id}.${entrytwo.id}`);
    if(LastUpdate !== null && 120000-(Date.now()-LastUpdate) >0){
      let timeObj = require("parse-ms")(120000-(Date.now()-LastUpdate));
    } else {
      db.set(`LastUpdate.${oldRole.guild.id}.${entrytwo.id}`, Date.now());
    }
    let tarih = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" }
    let tarih2 = tarih;
    let user1 = client.users.cache.get(oldRole.id)
    oldRole.guild.owner.send(`Sunucunuzda bir rol güncellendi benim sayemde rol aynı şekilde geri döndürüldü, rolü düzenleyen kullanıcının tüm rolleri alınıp cezalı rolü verildi.\n\n**DÖKÜMANLAR**\nDüzenlenen Rol: \`${oldRole.id}\`\nRolü Düzenleyen: \`${kullanıcı.executor.tag} | (${user.id})\`\nKullanıcının Hesabı Oluşturma Tarihi: \`${moment(oldRole.createdAt).format("DD")} ${tarih2[moment(oldRole.createdAt).format("MM")]} ${moment(oldRole.createdAt).format("YYYY HH:mm:ss")}\``)
    return;
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on("emojiCreate", async (oldEmoji, newEmoji) => {
  if(!etkisizrol || !cezalırol) return;
  let entry = await oldEmoji.guild.fetchAuditLogs({type: "EMOJİ_CREATE"});
  let kullanıcı = await entry.entries.first();
  if(kullanıcı.executor.id === client.user.id) return;
  let entrytwo = oldEmoji.guild.members.cache.get(kullanıcı.executor.id);
  if(entrytwo.roles.cache.some(roles => roles.id === etkisizrol) === true) return;
  let user = oldEmoji.guild.members.cache.get(kullanıcı.executor.id);
  user.roles.set([cezalırol]);
  oldEmoji.delete({reason: "Oluşturulan Emoji Koruma"});
  let tarih = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" }
  let tarih2 = tarih;
  let user1 = client.users.cache.get(oldEmoji.id)
  oldEmoji.guild.owner.send(`Sunucunuzda bir kullanıcı emoji oluşturmaya çalıştı ama ben emojiyi silip kullanıcya cezalı rolünü verdim.\n\n**DÖKÜMANLAR**\nOluşturulan Emoji \`${oldEmoji.id}\`\nEmojiyi Açan: \`${entry.executor.tag} | (${user.id})\`\nKullanıcının Hesabı Oluşturma Tarihi: \`${moment(oldEmoji.createdAt).format("DD")} ${tarih2[moment(oldEmoji.createdAt).format("MM")]} ${moment(oldEmoji.createdAt).format("YYYY HH:mm:ss")}\``)
  return;
})
client.on("emojiDelete", async (oldEmoji, newEmoji) => {
  if(!etkisizrol || !cezalırol) return;
  let entry = await oldEmoji.guild.fetchAuditLogs({type: "EMOJİ_DELETE"});
  let kullanıcı = await entry.entries.first();
  if(kullanıcı.executor.id === client.user.id) return;
  let entrytwo = oldEmoji.guild.members.cache.get(kullanıcı.executor.id);
  if(entrytwo.roles.cache.some(roles => roles.id === etkisizrol) === true) return;
  let user = oldEmoji.guild.members.cache.get(kullanıcı.executor.id);
  user.roles.set([cezalırol]);
  let emojisilindi = oldEmoji.guild.emojis.create(oldEmoji.url, oldEmoji.name);
  let tarih = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" }
  let tarih2 = tarih;
  let user1 = client.users.cache.get(oldEmoji.id)
  oldEmoji.guild.owner.send(`Sunucunuzda bir kullanıcı emoji silindi çalıştı ama ben emojiyi aynı şekilde geri açıp kullanıcya cezalı rolünü verdim.\n\n**DÖKÜMANLAR**\nSilinen Emoji \`${oldEmoji.id}\`\nEmojiyi Silen: \`${kullanıcı.executor.tag} | (${user.id})\`\nKullanıcının Hesabı Oluşturma Tarihi: \`${moment(oldEmoji.createdAt).format("DD")} ${tarih2[moment(oldEmoji.createdAt).format("MM")]} ${moment(oldEmoji.createdAt).format("YYYY HH:mm:ss")}\``)
  return;
})
client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
  if(!etkisizrol || !cezalırol) return;
  let entry = await oldEmoji.guild.fetchAuditLogs({type: "EMOJİ_UPDATE"});
  let kullanıcı = await entry.entries.first();
  if(kullanıcı.executor.id === client.user.id) return;
  let entrytwo = oldEmoji.guild.members.cache.get(kullanıcı.executor.id);
  if(entrytwo.roles.cache.some(roles => roles.id === etkisizrol) === true) return;
  let user = oldEmoji.guild.members.cache.get(kullanıcı.executor.id);
  user.roles.set([cezalırol]);
  let düzenlendiemoji = oldEmoji.edit({ name: oldEmoji.name, url: oldEmoji.url});
  let tarih = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" }
  let tarih2 = tarih;
  let user1 = client.users.cache.get(oldEmoji.id)
  oldEmoji.guild.owner.send(`Sunucunuzda bir kullanıcı emoji düzenlendi çalıştı ama ben emojiyi aynı şekilde geri dönüştürüp kullanıcya cezalı rolünü verdim.\n\n**DÖKÜMANLAR**\nDüzenlenen Emoji \`${oldEmoji.id}\`\nEmojiyi Düzenleyen: \`${kullanıcı.executor.tag} | (${kullanıcı.id})\`\nKullanıcının Hesabı Oluşturma Tarihi: \`${moment(oldEmoji.createdAt).format("DD")} ${tarih2[moment(oldEmoji.createdAt).format("MM")]} ${moment(oldEmoji.createdAt).format("YYYY HH:mm:ss")}\``)
  return;
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on("guildBanAdd", async member => {
  if(!etkisizrol || !cezalırol || !member) return;
  let entry = await member.guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"});
  let kullanıcı = await entry.entries.first();
  if(kullanıcı.executor.id === client.user.id) return;
  let entrytwo = member.guild.members.cache.get(kullanıcı.executor.id);
  if(entrytwo.roles.cache.some(roles => roles.id === etkisizrol) === true) return;
  let user = member.guild.members.cache.get(kullanıcı.executor.id);
  user.ban({ reason: "Birisini banladığı için kendisi banlandı." });
    let tarih = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" }
    let tarih2 = tarih;
    let user1 = client.users.cache.get(member.id)
    member.guild.owner.send(`Sunucunuzda bir kullanıcının banlamaya çalıştı ama ben kullanıcının tüm rollerini alıp cezalı rolünü verdim.\n\n**DÖKÜMANLAR**\nBanlanılan Kullanıcı: \`${member.id}\`\nBanlayan: \`${kullanıcı.executor.tag} | (${user.id})\`\nKullanıcının Hesabı Oluşturma Tarihi: \`${moment(member.createdAt).format("DD")} ${tarih2[moment(member.createdAt).format("MM")]} ${moment(member.createdAt).format("YYYY HH:mm:ss")}\``)
    return;
})
client.on("guildMemberRemove", async member => {
  if(!etkisizrol || !cezalırol || !member) return;  
  let entry = await member.guild.fetchAuditLogs({type: "MEMBER_KICK"});
  let kullanıcı = await entry.entries.first();
  if(kullanıcı.executor.id === client.user.id) return;
  let entrytwo = member.guild.members.cache.get(kullanıcı.executor.id);
  if(entrytwo.roles.cache.some(roles => roles.id === etkisizrol) === true) return;
  let user = member.guild.members.cache.get(kullanıcı.executor.id);
  user.ban({reason:"Birisini Kicklediği için kicklendi"});
  let tarih = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" }
  let tarih2 = tarih;
  let user1 = client.users.cache.get(member.id)
  member.guild.owner.send(`Sunucunuzda bir kullanıcının kicklemeye çalıştı ama ben kullanıcının tüm rollerini alıp cezalı rolünü verdim.\n\n**DÖKÜMANLAR**\nKicklenilen Kullanıcı: \`${member.id}\`\nKickleyen: \`${kullanıcı.executor.tag} | (${user.id})\`\nKullanıcının Hesabı Oluşturma Tarihi: \`${moment(member.createdAt).format("DD")} ${tarih2[moment(member.createdAt).format("MM")]} ${moment(member.createdAt).format("YYYY HH:mm:ss")}\``)
  return;
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////