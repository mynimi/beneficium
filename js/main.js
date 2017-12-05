$(document).ready(function(){
    var playercount,
        total,
        minimum,
        distrib,
        players = {},
        percentRich;

    $('#test').append(sessionStorage.getItem("Test"));
    $('#results').append(sessionStorage.getItem("pl"));

    $('.generate').click(function(){
        playercount = parseInt($('#playercount').val());
        total = parseInt($('#total').val());
        minimum = parseInt($('#minimum').val());
        distrib = $('input[name="distrib"]:checked').val();

        console.log(sessionStorage.Test = playercount);
        // sessionStorage.getItem("Test");
        // sessionStorage.setItem("Test",playercount);
        sessionStorage.pl = '';

        if(playercount != null && total != null && minimum != null && distrib != null){
            // find difference between poor and rich
            if(distrib == 'fair'){
                percentRich = 100/playercount;
            } else if (distrib == 'small') {
                percentRich = getRandom5(40, 60);
            } else if (distrib == 'large') {
                percentRich = getRandom5(70, 90);
            }

            percentRich = percentRich/100;

            richest = Math.floor(Math.random() * playercount) + 1;
            poorest = Math.floor(Math.random() * playercount) + 1;

            while(richest == poorest){
                poorest = Math.floor(Math.random() * playercount) + 1;
            }

            if(playercount > 2){
                second = Math.floor(Math.random() * playercount) + 1;

                while(richest == second || poorest == second){
                    second = Math.floor(Math.random() * playercount) + 1;
                }
            }

            if(playercount > 3){
                third = Math.floor(Math.random() * playercount) + 1;
            }


            $('#results').append('<p>Ungleichheitsfaktor: '+percentRich+'%</p>');
            // find glückspilz ID
            lucky = Math.floor(Math.random() * playercount) + 1;

            // generate div container for every player
            for (i = 0; i < playercount; i++) {
                player = {};
                player["ID"] = i+1;
                player["Kontostand"] = (i+1)*10;
                if(player["ID"] == lucky){
                    player["lucky"] = true;
                } else{
                    player["lucky"] = false;
                }

                if(player["ID"] == richest){
                    player["Kontostand"] = total*percentRich;
                }

                players["player"+(i+1)] = player;

                var pl;
                pl = '<div class="player-'+(i+1)+'">';
                pl += 'Spieler '+(i+1)+'<br>';
                if(player["lucky"]){
                    pl += 'Glückspilz!<br>';
                }
                pl += 'ID: '+player["ID"]+'<br>';
                pl += 'Kontostand: '+player["Kontostand"];
                pl += '</div><br>';

                // $('#results').append(pl);
                sessionStorage.pl += pl;

            }
            // console.log(players);
            // console.log(players['player1'].Kontostand);
        } else{
            console.log('nicht alle Felder ausgefüllt');
        }
    });
});

function getRandom5(min, max) {
  return getRandomInt(min / 5, max / 5) * 5;
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
