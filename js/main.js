$(document).ready(function(){
    // init variables
    var playercount, total, distrib, players = {}, percentRich, richest, poorest, second, third, richTotal, remainder, poorestTotal, secondTotal, thirdTotal;

    // when generate button on index is clicked, HTML is built which will be appended in the results page
    $('.generate').click(function(){
        // get values from form
        playercount = parseInt($('#playercount').val());
        total = parseInt($('#total').val());
        distrib = $('input[name="distrib"]:checked').val();

        // sessionStorage.getItem("Test");
        // sessionStorage.setItem("Test",playercount
        // empty sessionstorages for new generating
        sessionStorage.pl = '';

        if(playercount != null && total != null && distrib != null){
            // find difference between poor and rich
            if(distrib == 'fair'){
                percentRich = 100/playercount;
            } else if (distrib == 'small') {
                percentRich = getRandom5(40, 60);
            } else if (distrib == 'large') {
                percentRich = getRandom5(70, 85);
            }

            richest = Math.floor(Math.random() * playercount) + 1;
            richTotal = Math.round(total*(percentRich/100));

            remainder = 100 - percentRich;

            if(playercount == 2){
                poorestTotal = remainder;
            }
            if(playercount > 2){
                var totals = [];
                totals.push(getRandom5(5, remainder - 5));
                totals.push(remainder - totals[0]);
                totals.sort(function(a, b){return b-a}); // sort in ascending order

                secondTotal = Math.round(total*(totals[0]/100));
                poorestTotal = Math.round(total*(totals[1]/100));
            }
            if(playercount > 3){
                var totals = [];
                totals.push(getRandom5(5, remainder - 10));
                totals.push(getRandom5(5, remainder - totals[0] - 5));
                totals.push(getRandom5(5, remainder - totals[1]));
                totals.sort(function(a, b){return b-a}); // sort in ascending order

                secondTotal = Math.round(total*(totals[0]/100));
                thirdTotal = Math.round(total*(totals[1]/100));
                poorestTotal = Math.round(total*(totals[2]/100));
            }


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

                while(richest == third || poorest == third || second == third){
                    third = Math.floor(Math.random() * playercount) + 1;
                }
            }

            // find glückspilz ID
            lucky = Math.floor(Math.random() * playercount) + 1;

            // generate div container for every player
            for (i = 0; i < playercount; i++) {
                player = {};
                player["ID"] = i+1;

                if(player["ID"] == lucky){
                    player["lucky"] = true;
                } else{
                    player["lucky"] = false;
                }

                if(player["ID"] == richest){
                    player["Kontostand"] = richTotal;
                } if (player["ID"] == second){
                    player["Kontostand"] = secondTotal;
                } if(player["ID"] == third){
                    player["Kontostand"] = thirdTotal;
                } if(player["ID"] == poorest){
                    player["Kontostand"] = poorestTotal;
                }

                if(player["Kontostand"] > (total / 3)*2){
                    player["Status"] = "Reich";
                } else if (player["Kontostand"] > (total / 3)){
                    player["Status"] = "Mittelstand";
                } else{
                    player["Status"] = "Arm";
                }

                players["player"+(i+1)] = player;

                var pl;
                pl = '<div class="player-'+(i+1)+'">';
                pl += 'Spieler '+(i+1)+'<br>';
                if(player["lucky"]){
                    pl += 'Glückspilz!<br>';
                }
                pl += 'ID: '+player["ID"]+'<br>';
                pl += 'Kontostand: '+player["Kontostand"]+'<br>';
                pl += 'Status: '+player["Status"]+'<br>';
                pl += '<span class="btn paybank">Zahlung tätigen (an Bank)</span><br>';
                pl += '<span class="btn payplayer">Geld anderem Spieler überweisen</span><br>';
                pl += '<span class="btn addmoney">Erhält Geld von Bank</span><br>';
                pl += '<span class="btn buydice">Weiteren Wurf kaufen</span><br>';
                pl += '<span class="btn buydiceresult">Würfelergebnis kaufen</span><br>';
                pl += '</div><br>';

                // $('#results').append(pl);
                sessionStorage.pl += pl;



            }
            setCookie('players', players, 1);
            setCookie("players", JSON.stringify(players), 1);
            // console.log(players);
            // console.log(players['player1'].Kontostand);
        } else{
            console.log('nicht alle Felder ausgefüllt');
        }
    });

    $('#results').append(sessionStorage.getItem("pl"));
    console.log(JSON.parse(getCookie("players")));

    // later on...
    // var people = $.parseJSON(getCookie("players"));
    // people.push(
    //     { 'name' : 'Daniel', 'age' : 4 }
    // );
    // $.cookie("people", JSON.stringify(people));

});

function getRandom5(min, max) {
  return getRandomInt(min / 5, max / 5) * 5;
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
