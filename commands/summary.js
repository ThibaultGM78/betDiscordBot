function printError(message, error){
    message.reply(error);
    console.log(error);
}

module.exports = {
    name: 'summary',
    description: 'Display the summary bet of the @. B!summary {@user}',
    execute(message, mysqldb){
        var totYes, avgYes, totNo, avgNo;
        var mention = message.mentions.users.first();
        if(mention == null) mention = message.author.id;

        //Check if the bet exist
        sql = "SELECT * FROM bets WHERE bets_bettor ='"+ mention + "'";
        mysqldb.query(sql, function(err, result, fields){
            if(err) throw err;
            
            //Check if the bet exist
            if(result[0] == null){
                printError(message, "error 1: this bet not existing");
            }
            else{
                //recup totYes
                sql = "SELECT IFNULL(SUM(bet_token),0) totYes, COUNT(*) nYes FROM bet"+ mention +" WHERE bet_answer = 'y'";
                mysqldb.query(sql, function(err, result, fields){
                    if(err) throw err;
                    totYes = result[0]["totYes"];
                    nYes = result[0]["nYes"];

                    //recup totNo
                    sql = "SELECT IFNULL(SUM(bet_token),0) totNo, COUNT(*) nNo FROM bet"+ mention +" WHERE bet_answer = 'n'";
                    mysqldb.query(sql, function(err, result, fields){
                        if(err) throw err;
                        
                        totNo = result[0]["totNo"];
                        nNo = result[0]["nNo"];

                        message.channel.send("Summary <@" + mention +">");
                        message.channel.send("Bet sum on yes: " + totYes +" | Average bet on yes: " + totYes/nYes + " | " + nYes + " betor");
                        message.channel.send("Bet sum on no: " + totNo +" | Average bet on no: " + totNo/nNo + " | " + nNo + " betor");
                    });
                });
            }
        });
    }
}