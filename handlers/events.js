const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Events");
table.setHeading("Events", "Load status");

module.exports = client => {
  const commands = readdirSync(`./events/`).filter(file =>
    file.endsWith(".js")
  );

  for (let file of commands) {
    try {
      let pull = require(`../events/${file}`);

      if (pull.event && typeof pull.event !== "string") {
        table.addRow(file, `❌ -> String değer bulunamadı.`);
        continue;
      }

      pull.event = pull.event || file.replace(".js", "");

      client.on(pull.event, pull.run.bind(null, client));

      table.addRow(file, "✅");
    } catch (err) {
      console.log(err);
      table.addRow(file, `❌ -> Event yüklenirken bir hata oluştu.`);
    }
  }

  console.log(table.toString());
};
