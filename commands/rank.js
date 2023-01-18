//Error
function printError(message, error){
    message.reply(error);
    console.log(error);
}


module.exports = {
    name: 'rank',
    description: 'displate your or the @user rank',
    execute(message, mysqldb){
        var nToken;
        var mention = message.mentions.users.first();
        if(mention == null) mention = message.author.id;

       sql = "SELECT user_token FROM user WHERE user_id =" + mention;
       mysqldb.query(sql, function(err, result){
            if(err) throw err;
            if(result != ''){
                nToken = result[0]["user_token"];
                sql = "SELECT COUNT(id_user) nUser FROM user WHERE user_token > " + result[0]["user_token"];
                mysqldb.query(sql, function(err, result){
                    if(err) throw err;
        
                    message.reply("<@" + mention + "> is ranked " + (result[0]["nUser"] + 1) +" => " + nToken + " token");
                });
            }
            else{
                message.reply("<@" + mention + "> is not in the game");
            }
        });
    }
}
