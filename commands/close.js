function printError(message, error){
    message.reply(error);
    console.log(error);
}

module.exports = {
    name: 'close',
    description: 'B!close{y|n}',
    execute(message, mysqldb){
        var answer = message.content.substring(7, 8);
        var totYes, totNo, i, token;
        
        //verification
        if(answer != "y" && answer != "n"){
            printError(message, "error 1: enter an answer. B!close{y|n}");
            return;
        }
    
        //Check if the bet exist
        sql = "SELECT * FROM bets WHERE bets_bettor ='"+ message.author.id + "'";
        mysqldb.query(sql, function(err, result, fields){
            if(err) throw err;
            
            //Check if the bet exist
            if(result[0] == null){
                printError(message, "error 2: this bet not existing");
            }
            else{
                //recup totYes
                sql = "SELECT SUM(bet_token) totYes FROM bet"+ message.author.id+" WHERE bet_answer = 'y'";
                mysqldb.query(sql, function(err, result, fields){
                    if(err) throw err;
                    totYes = result[0]["totYes"];
    
                    //recup totNo
                    sql = "SELECT SUM(bet_token) totNo FROM bet"+ message.author.id +" WHERE bet_answer = 'n'";
                    mysqldb.query(sql, function(err, result, fields){
                        if(err) throw err;
                        
                        totNo = result[0]["totNo"];

                        //If there no bet for y or n
                        if(totYes == null || totNo == null){
                            console.log("totYes == null || totNo == null");
                            sql = "SELECT bet_bettor, bet_token FROM bet"+ message.author.id;
                            mysqldb.query(sql, function(err, result, fields){
                                if(err) throw err;
                                
                                //we give back the amount bet to the bettor
                                for(i = 0; i < result["length"]; i++){
                                    console.log("=>" + result[i]["bet_token"] +" / " + result[i]["bet_bettor"]);
                                    sql = "UPDATE user SET user_token=user_token+"+result[i]["bet_token"]+" WHERE user_id='" + result[i]["bet_bettor"] + "'";
                                    mysqldb.query(sql);
                                }
                                //We reset the table
                                sql = "DELETE FROM bets WHERE bets_bettor = '" + message.author.id + "'";
                                mysqldb.query(sql);
                                var sql = "DROP TABLE bet" + message.author.id;
                                mysqldb.query(sql); 
                            });
                        }
                        else{
                            console.log("!(totYes == null || totNo == null)");
                            sql = "SELECT bet_bettor, bet_token FROM bet"+ message.author.id +" WHERE bet_answer ='" + answer +"'";
                            mysqldb.query(sql, function(err, result, fields){
                                if(err) throw err;
                                console.log(result);

                                //The winnings are calculated according to the odds
                                for(i = 0; i < result["length"]; i++){
                                      
                                    token = result[i]["bet_token"];
                                    if(answer == "y"){
                                        gain = totNo * (token/totYes);
                                    }
                                    else{
                                        gain = totYes * (token/totNo);
                                    }
                                    console.log(gain);
                                    sql = "UPDATE user SET user_token=user_token+"+gain+" WHERE user_id='" + result[i]["bet_bettor"] + "'";
                                    mysqldb.query(sql); 
                                } 
                                //We reset the table
                                sql = "DELETE FROM bets WHERE bets_bettor = '" + message.author.id + "'";
                                mysqldb.query(sql);
                                var sql = "DROP TABLE bet" + message.author.id;
                                mysqldb.query(sql); 
                            });
                        }
                    });
                });
            }
        });
    }
}
