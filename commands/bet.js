//Error
function printError(message, error){
    message.reply(error);
    console.log(error);
}

module.exports = {
    name: 'bet',
    description: 'B!bet{y|n} {bet} {subject}',
    execute(message, mysqldb){
        //Variable
        const answer = message.content.substring(5, 6);
        const str = message.content.substring(7);
        var bet;
        var digitsNumber = 0;
        var char = parseInt(str.slice(digitsNumber, digitsNumber + 1));

        //create a profile for new players
        sql = 'SELECT * FROM user WHERE user_id = ' + message.author.id;
        mysqldb.query(sql, function(err, result){
            if(err) throw err;
    
            if(result == ""){
                sql = "INSERT INTO user (user_id, user_token, user_newChanceDate) VALUES ('" + message.author.id + "','100','00/00/0000')"; 
                mysqldb.query(sql);
            }
        });
       
        //we recover the bet
        //We can't use split becasue the answer contain " "
        while(!isNaN(char)){
            digitsNumber += 1;
            char = parseInt(str.slice(digitsNumber, digitsNumber + 1));
        }
        bet = parseInt(str.slice(0, digitsNumber + 1));
        console.log(answer+"/"+bet);

        //parameter verification
        if(answer != "y" && answer != "n"){
            printError(message, "error 1: enter an answer. B!bet{y|n} {bet} {subject}")
        }
        else if(isNaN(bet)){
            printError(message, "error 2: enter a number. B!bet{y|n} {bet} {subject}")
        }
        else if(message.content.substring(8 + digitsNumber) == ""){
            printError(message, "error 3: enter a subject. B!bet{y|n} {bet} {subject}")
        }
        //If all pramter are good
        else{
            sql = 'SELECT * FROM bets WHERE bets_bettor =' + message.author.id;
            mysqldb.query(sql, function(err, result, fields){
                if(err) throw err;
            
                //Check if the bet exist
                if(result[0] != null){
                    printError(message, "error 4: you already have a bet. For close this one use B!close");
                }
                else{
                    //Checks if the player has enough tokens to withdraw
                    sql = 'SELECT * FROM user WHERE user_id = ' +  message.author.id;
                    mysqldb.query(sql, function(err, result, fields){
                        if(err) throw err;

                        if(result[0]["user_token"] >= bet){
                            //We retire token of the profil of the betor
                            sql = "UPDATE user SET user_token=user_token-"+bet+" WHERE user_id='"+message.author.id+"'";
                            mysqldb.query(sql);
                            //We add the bet on the table
                            sql = "INSERT INTO bets (bets_bettor, bets_subject) VALUES ('"+ message.author.id + "','"+ message.content.substring(8 + digitsNumber) +"')";
                            mysqldb.query(sql);
                            //we create the bet table
                            sql = `CREATE TABLE IF NOT EXISTS bet`+ message.author.id +`(
                                id_bet INT NOT NULL AUTO_INCREMENT, 
                                bet_bettor CHAR(50) NOT NULL,
                                bet_token INT NOT NULL,
                                bet_answer CHAR(1),
                                PRIMARY KEY(id_bet)
                            )`
                            mysqldb.query(sql);
                            //We write in the first bet
                            sql = "INSERT INTO bet"+message.author.id+" (bet_bettor, bet_token, bet_answer) VALUES ('" + message.author.id + "','"+ bet +"','"+ answer+"')";
                            mysqldb.query(sql); 
                        }
                        else{
                            printError(message, "error 4: you don't have enough token")
                        }
                    });
                }
            });    
        }
    }
}