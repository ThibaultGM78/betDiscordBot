const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))
for(const file of commandFiles){
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command) 
}

//#MySQL
const mysql = require('mysql');
//Connection parameter of database
const mysqldb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'betBotDB'
})
//database connection
mysqldb.connect(function(err) {
    if(err) throw err;
    console.log("Connected !");
})

//#Main
const prefix = "B!";
client.on("ready", () => {
        console.log("operational bot");
        mysqldb.query(`CREATE TABLE IF NOT EXISTS user(
            id_user INT NOT NULL AUTO_INCREMENT, 
            user_id CHAR(50) NOT NULL,
            user_token INT NOT NULL,
            user_newChanceDate CHAR(10) NOT NULL,  
            PRIMARY KEY(id_user)
        )`);
        mysqldb.query(`CREATE TABLE IF NOT EXISTS bets(
            id_bets INT NOT NULL AUTO_INCREMENT, 
            bets_bettor CHAR(50) NOT NULL,
            bets_subject TEXT NOT NULL,
            PRIMARY KEY(id_bets)
        )`);
});
client.on("messageCreate", async message => {
    if(!message.content.startsWith(prefix)||message.author.bot) return;
    console.log(message.author.id);
    console.log(message);
    
    if(message.content.startsWith(prefix + "test")){
        client.commands.get('test').execute();
    }
    else if(message.content.startsWith(prefix + "help")){
        client.commands.get('help').execute(message);
    }
    else if(message.content.startsWith(prefix + "bet")){
        client.commands.get('bet').execute(message, mysqldb);
    }
    else if(message.content.startsWith(prefix + "put")){
        client.commands.get('put').execute(message, mysqldb);
    }
    else if(message.content.startsWith(prefix + "close")){
        client.commands.get('close').execute(message, mysqldb);
    }
    else if(message.content.startsWith(prefix + "leaderboard")){
        client.commands.get('leaderboard').execute(message, mysqldb);
    }
    else if(message.content.startsWith(prefix + "summary")){
        client.commands.get('summary').execute(message, mysqldb);
    }
    else if(message.content.startsWith(prefix + "newChance")){
        client.commands.get('newChance').execute(message, mysqldb);
    }
    else if(message.content.startsWith(prefix + "rank")){
        client.commands.get('rank').execute(message, mysqldb);
    }
     
})

client.login(token);