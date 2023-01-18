module.exports = {
    name: 'leaderboard',
    description: 'Dispaly the 10 first of the leaderboard',
    execute(message, mysqldb){
        sql = "SELECT user_id, user_token FROM user ORDER BY user_token DESC";
        mysqldb.query(sql, function(err, result, fields){
            if(err) throw err;
            var i,line,content;
            var max = 10;
            
            if(result){
                if(result["length"] < max) max = result["length"];

                content = "Classement:\n";
                for(i = 0; i < max; i++){

                    line = (i + 1) + ": <@"+ result[i]["user_id"] + "> => " + result[i]["user_token"] + " token\n";
                    content += line;
                }
                message.channel.send(content);
            }
        });
    }
}