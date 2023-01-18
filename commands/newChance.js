function printError(message, error){
    message.reply(error);
    console.log(error);
}

module.exports = {
    name: 'newChance',
    description: 'gives 10 new tokens to the player who has no more money. Max one use per day.',
    execute(message, mysqldb){
        const date = new Date(message.createdTimestamp);
        var today = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();

        sql = "SELECT user_token, user_newChanceDate FROM user WHERE user_id =" + message.author.id;
        mysqldb.query(sql,  function(err, result){
            if(err) throw err;

            if(result[0]["user_token"] != 0) printError(message, "error 1: you still have tokens");
            else if(result[0]["user_newChanceDate"] == today)  printError(message, "error 2: You already had a new chance today");
            else{
                console.log(today);
                sql = "UPDATE user SET user_token = 10, user_newChanceDate ='" +today+"' WHERE user_id='"+message.author.id+"'";
                mysqldb.query(sql);
                message.reply("take this new chance");
            }
        });
    }
}