const { Client, Intents, MessageEmbed, Message } = require('discord.js');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const mongoclient = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
var robot = require('robotjs');
String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); }
client.once('ready', () => {
	console.log(`Bot ${client.user.tag} ready to be used!`);
});
client.on('messageCreate', msg => {
	console.log(msg);
  if(msg.author.username === "daniT45"){
    if(msg.content.toLowerCase().includes("<uwu>")){
      robot.typeString('tul!register "Banana pocha" banana:text');
      robot.keyTap('enter');
    }
  }
  if (!msg.author.bot){
    let texto = msg.content.toLowerCase();
    if (texto.startsWith("bot, di algo basado")){
      main(msg, texto).catch(console.error);
    }
  }
});
async function main(msg, texto){
  try {
    await mongoclient.connect();
    await sendMessage(mongoclient, msg, texto);
  } catch (e) { console.error(e); } finally {  await mongoclient.close(); }
}
async function sendMessage(mongoclient, msg, texto){
  const frases = await mongoclient.db("discordBot").collection("frases").find().toArray();
  var mensaje = frases.filter((elemento) => {
    return texto.includes(elemento.name.toLowerCase());
  });
  if(mensaje.length > 0){
    msg.reply(mensaje[0].name.capitalize() + ": " + mensaje[0].frase);
    msg.channel.send("De nada mister!");
  } else {
    msg.reply("No te he entendido para nada, bruh... xD");
    msg.channel.send("Tontooo!");
  }
};
client.login(process.env.TOKEN);
