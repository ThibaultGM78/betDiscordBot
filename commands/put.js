//Error
function printError(message, error){
    message.reply(error);
    console.log(error);
}

module.exports = {
    name: 'put',
    description: 'B!put {bet} {y|n} {@betCreator}',
    execute(message, mysqldb){
        //Variables
        var tab = message.content.split(" ")
        var bet = tab[1]
        var answer = tab[2]
        var mention = message.mentions.users.first();
        var addition = bet;

        //create a profile for new players
        sql = 'SELECT * FROM user WHERE user_id = ' + message.author.id;
        mysqldb.query(sql, function(err, result){
            if(err) throw err;
    
            if(result == ""){
                sql = "INSERT INTO user (user_id, user_token, use_newChanceDate) VALUES ('" + message.author.id + "','100','00/00/0000')"; 
                mysqldb.query(sql);
            }
        });
        
        //parameter verification
        if(isNaN(bet)){
            printError(message, "error 1: enter a number. B!put {bet} {y|n} {@betCreator}")
        }
        else if(mention == null){
            printError(message, "error 2: enter a mention. B!put {bet} {y|n} {@betCreator}")
        }
        else{
            //Checks if the player has enough tokens to withdraw
            sql = 'SELECT * FROM user WHERE user_id = ' +  message.author.id;
            mysqldb.query(sql, function(err, result, fields){
                if(err) throw err;

                if(result[0]["user_token"] < bet){
                    printError(message, "error 3: you don't have enough token");
                }
                else{  
                    //Check if the bet exist  
                    sql = 'SELECT * FROM bets WHERE bets_bettor =' + mention;
                    mysqldb.query(sql, function(err, result, fields){
                        if(err) throw err;
                           
                        if(result[0] == null){
                            printError(message, "error 4: this bet not existing");
                        }
                        else{
                            sql = 'SELECT * FROM bet'+ mention +' WHERE bet_bettor =' + message.author.id;
                            mysqldb.query(sql, function(err, result, fields){
                                if(err) throw err;
                                
                                //Check if the betor has already bet
                                if(result[0] == null){
                                    if(answer != "y" && answer != "n"){
                                        printError(message, "error 5: enter an answer. B!put {bet} {y|n} {@betCreator}");
                                    }
                                    else{
                                        //Add put
                                        sql = "INSERT INTO bet"+message.author.id+" (bet_bettor, bet_token, bet_answer) VALUES ('" + message.author.id + "','"+ bet +"','"+ answer+"')";
                                        mysqldb.query(sql); 
                                        //We retire token of the profil of the betor
                                        sql = "UPDATE user SET user_token=user_token-"+bet+" WHERE user_id='"+message.author.id+"'";
                                        mysqldb.query(sql);
                                    }
                                }
                                else{
                                    if(result[0]["bet_token"] >= bet){
                                        printError(message, "error 6: You can only bet more. Actual bet:"+ result[0]["bet_token"] +". B!put {bet} {y|n} {@betCreator}");
                                    }
                                    else{
                                        console.log("coucoulalou");
                                        sql = "UPDATE bet"+mention+" SET bet_token="+ bet +" WHERE bet_bettor='"+message.author.id+"'";
                                        mysqldb.query(sql);
                                        //We retire token of the profil of the betor
                                        addition = bet - result[0]["bet_token"];
                                        sql = "UPDATE user SET user_token=user_token-"+addition+" WHERE user_id='"+message.author.id+"'";
                                        mysqldb.query(sql);
                                    }   
                                }  
                            });
                        }
                    });
                }
            });
        }
    }
}