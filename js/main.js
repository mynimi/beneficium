// init variables

$(document).ready(function(){
    var playercount, total, distrib, players = {}, percentRich, richest, poorest, second, third, richTotal, remainder, poorestTotal, secondTotal, thirdTotal;

    if (window.location.href.indexOf("result.html") > -1) {
        if(!getCookie('players')){
            window.location.href = "index.html";
        }
    }

    $('.restart').click(function(e){
        var check = confirm('Bist du sicher, dass du neu starten möchtest? Alle gespeicherten Spielstände werden gelöscht.');
        if(!check){
            e.preventDefault();
        }
    });
    $('.playernames input').hide();
    $('input[name="playercount"]').click(function(){
        var c = $(this).val();
        $('.playernames input').each(function(){
            var v = $(this).val();
            v = v.replace('Name Spieler ', '');
            v = parseInt(v);
            if(v <= c){
                $(this).slideDown();
            } else{
                $(this).slideUp();
            }
        });
        console.log(c);
    });

    $('.generate').click(function(e){
        players = {};
        console.log(players);
        // get values from form
        playercount = parseInt($('input[name="playercount"]:checked').val());
        total = parseInt($('#total').val());
        distrib = $('input[name="distrib"]:checked').val();
        setCookie('playercount', playercount, 1);

        // generate prices
        dicePrice = Math.round(total*($('#roll').val()/100)); // .5% of total for additionall roll
        diceResult = Math.round(total*($('#res').val()/100)); // 5% of total for buying results
        setCookie('total', total, 1);
        setCookie('dicePrice', dicePrice, 1);
        setCookie('diceResult', diceResult, 1);

        if(playercount){
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
                poorestTotal = Math.round(total*(remainder/100));
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

            // generate objects for every player
            for (i = 0; i < playercount; i++) {
                player = {};
                player["ID"] = i+1;

                player["name"] = $('input[name="player'+(i+1)+'name"]').val();

                if(player["ID"] == lucky){
                    player["lucky"] = true;
                } else{
                    player["lucky"] = false;
                }

                if(distrib == "fair"){
                    player["Kontostand"] = total/playercount;
                } else{
                    if(player["ID"] == richest){
                        player["Kontostand"] = richTotal;
                    } if (player["ID"] == second){
                        player["Kontostand"] = secondTotal;
                    } if(player["ID"] == third){
                        player["Kontostand"] = thirdTotal;
                    } if(player["ID"] == poorest){
                        player["Kontostand"] = poorestTotal;
                    }
                }

                if(player["Kontostand"] > (total / 3)*2){
                    player["Status"] = "Reich";
                } else if (player["Kontostand"] > (total / 3)){
                    player["Status"] = "Mittelstand";
                } else{
                    player["Status"] = "Arm";
                }

                players["player"+(i+1)] = player;

            }

            setCookie("players", JSON.stringify(players), 1);
            console.log(players);
            // console.log(players['player1'].Kontostand);
        } else{
            alert('nicht alle Felder ausgefüllt');
            e.preventDefault();
        }
    });

    $('body').addClass('playertotal-'+getCookie('playercount'));
    $('#data .kosten').append('<p>Zusätzlicher Wurf: '+formatNumber(getCookie('dicePrice'))+'</p>');
    $('#data .kosten').append('<p>Wurfergebnis: '+formatNumber(getCookie('diceResult'))+'</p>');
    var players = JSON.parse(getCookie("players"));
    generatePlayers('#results');

    overlayOpener('paybank');
    moneyAction('paybank');

    overlayOpener('buydice');
    moneyAction('buydice', 'substract', false, true, getCookie('dicePrice'));

    overlayOpener('buydiceresult');
    moneyAction('buydiceresult', 'substract', false, true, getCookie('diceResult'));

    overlayOpener('getmoney');
    moneyAction('getmoney', 'add');

    overlayOpener('payplayer');
    moneyAction('payplayer', 'substract', true);

    $('.playerlist').each(function(){
        var s = '<select id="#playerlist">';
        s += '<option value="">Empfänger wählen</option>';

        for (var i = 0; i < parseInt(getCookie('playercount')); i++) {
            var p = players['player'+(i+1)];
            s += '<option value="player'+(i+1)+'">';
            s += p.name;
            s += '</option>';
        }
        s += '</select>';

        $(this).append(s);
    });


    $('.overlay').each(function(){
        $(this).hide();
        $(this).prepend('<span class="close">+</span>');
    });

    $('.overlay .close').click(function(){
        closeOverlay();
    });
    $('body').on('click touchstart', '.overlay-backdrop', function(){
        closeOverlay();
    });
    $(document).keyup(function(e) {
        if (e.keyCode === 27){
            closeOverlay();
        }
    });

    function overlayOpener(name){
        $('#results').on('click', '.'+name, function (){
            p = $(this).parent().attr('class');
            c = $(this).attr('class').replace('btn', '').replace(' ', '');
            $('#'+name+' .playerholder').data('is-player', p);
            $('#'+name+' .playerholder').text(players[p].name);
            openOverlay(c);
            $('.playerlist option').each(function(){
                if($(this).val() == p){
                    $(this).hide();
                } else{
                    $(this).show();
                }
            });
        });
    }

    function moneyAction(container, operation = 'substract',  recipient = false, short = false, shortValue = false){
        $('#'+container+' .done').click(function(){
            var isPlayer = $('#'+container+' .playerholder').data('is-player');
                p = players[isPlayer],
                m = parseInt(p.Kontostand),
                n = $('#'+container+'Number').val(),
                t = $('#'+container+'Type').val();
            if(recipient){
                var w = $('#'+container+' .playerlist select option:selected').val();
                var u;
            }
            var r;
            if(short){
                r = shortValue;
            }

            if(!short){
                if(n != '' && t != '' && w != ''){
                    if(t == '%'){
                        r = (m/100)*n;
                    }
                    if(t == 'x'){
                        var dp = parseInt(getCookie('dicePrice'));
                        r = n*dp;
                    }
                    if(recipient){
                        u = players[w];
                    }
                } else{
                    alert("Bitte fülle alle Felder aus");
                }
            }

            var confirmation;
            if(operation == 'substract'){
                var confirmation = 'Klicke "OK" um '+formatNumber(r)+' von deinem Konto abzubuchen.';
            } else{
                var confirmation = 'Klicke "OK" um '+formatNumber(r)+' deinem Konto hinzuzufügen.';
            }

            var plsConfirm = confirm(confirmation);

            if(plsConfirm){
                if(operation == 'substract' || recipient){
                    p["Kontostand"] = m - r;
                } else {
                    p["Kontostand"] = m + r;
                }
                if(recipient){
                    u["Kontostand"] = m + r;

                    if(u["Kontostand"] > (getCookie('total') / 3)*2){
                        u["Status"] = "Reich";
                    } else if (u["Kontostand"] > (getCookie('total') / 3)){
                        u["Status"] = "Mittelstand";
                    } else{
                        u["Status"] = "Arm";
                    }
                }

                if(p["Kontostand"] > (getCookie('total') / 3)*2){
                    p["Status"] = "Reich";
                } else if (p["Kontostand"] > (getCookie('total') / 3)){
                    p["Status"] = "Mittelstand";
                } else{
                    p["Status"] = "Arm";
                }

                setCookie("players", JSON.stringify(players), 1);
                players = JSON.parse(getCookie("players"));

                generatePlayers('#results');
                closeOverlay();
            } else {
                closeOverlay();
                alert('Aktion abgebroche');
            }
        });
    }

    function openOverlay(c) {
        $('#'+c).fadeIn();
        $('#'+c).addClass('active');
        $('body').addClass('overlay-open');
        $('body').append('<div class="overlay-backdrop"></div>');
    }

    function closeOverlay(){
        $('.overlay').fadeOut();
        $('.overlay').removeClass('active');
        $('body').removeClass('overlay-open');
        $('.overlay-backdrop').remove();
    }

    // generating  Players HTML
    function generatePlayers(containerSelector){
        $(containerSelector).empty();
        for (var i = 0; i < parseInt(getCookie('playercount')); i++) {
            var p = players['player'+(i+1)],
                pl = '';
            // console.log(p);

            pl += '<div class="player'+p.ID;
            if(p.Kontostand < 0){
                pl += ' player-dead '
            }
            pl += '">';
            if(p.lucky){
                pl += '<span class="lucky">Glückspilz!</span>';

                if($('#data .luck').text() == ''){
                    $('#data .luck').append('Würfelvorteil: '+p.name);                    
                }
            }

            pl += '<div class="player-head">'
            pl += '<h2 class="player-name">'+p.name+'</h2>';

            if(p.Status == 'Arm'){
                pl += '<svg class="icon"><use xlink:href="#money" /></svg>';
                pl += '<br>';
            } else if (p.Status == 'Mittelstand'){
                pl += '<svg class="icon"><use xlink:href="#money" /></svg>';
                pl += '<svg class="icon"><use xlink:href="#money" /></svg>';
                pl += '<br>';
            } else if (p.Status == 'Reich') {
                pl += '<svg class="icon"><use xlink:href="#money" /></svg>';
                pl += '<svg class="icon"><use xlink:href="#money" /></svg>';
                pl += '<svg class="icon"><use xlink:href="#money" /></svg>';
                pl += '<br>';
            }

            pl += '</div>';

            pl += '<p>Kontostand</p> <h3 class="konto">'+formatNumber(p.Kontostand)+'</h3>';


            pl += '<span class="btn paybank">Zahlungen</span><br>';
            pl += '<span class="btn payplayer">Überweisung</span><br>';
            pl += '<span class="btn getmoney">Einzahlung</span><br>';
            pl += '<span class="btn buydice">Wurf kaufen</span><br>';
            pl += '<span class="btn buydiceresult">Wurfergebnis kaufen</span><br>';
            pl += '</div><br>';

            $(containerSelector).append(pl);
        }
    }

    $('.digitalDice').click(function(){
        var r = getRandomInt(1, 6);
        alert('Du hast '+r+' gewürfelt.');
    });
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

function formatNumber(nStr){
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + "'" + '$2');
    }
    return x1 + x2;
}
