module.exports = {
    name: 'help',
    description: 'displate the list of command',
    execute(message){
        message.channel.send("The bot commands are as follows:");
        message.channel.send("B!bet{y|n} {bet} {subject}: to set up a be. y = yes and n = no, for to express your opinion.");
        message.channel.send("B!close{y|n}: for close the bet distribute the earnings according to the winner");
        message.channel.send("B!put {bet} {y|n} {@betCreator}: to bet token.");
        message.channel.send("B!summary {@betCreator}: to have the summary of the bet")
        message.channel.send("B!leaderboard: to have the top 10")
        message.channel.send("B!rank {@id}: to have your rank")
        message.channel.send("B!newChance: to have a new chance")
    }
}