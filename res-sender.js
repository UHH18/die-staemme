javascript:
var warehouseCapacity = [];
var allWoodTotals = [];
var allClayTotals = [];
var allIronTotals = [];
var availableMerchants = [];
var totalMerchants = [];
var farmSpaceUsed = [];
var farmSpaceTotal = [];
var villagesData = [];
var allWoodObjects, allClayObjects, allIronObjects, allVillages;
var totalsAndAverages = "";
var data, totalWood = 0, totalStone = 0, totalIron = 0, resLimit = 0, customWood = '', customClay = '', customIron = '';
var sendBack;
var totalWoodSent = 0; totalStoneSent = 0; totalIronSent = 0;
if (typeof woodPercentage == 'undefined') {
    woodPercentage = 28000 / 83000;
    stonePercentage = 30000 / 83000;
    ironPercentage = 25000 / 83000;
}
// percentages for coins, 83000 is how much all 3 is combined

var backgroundColor = "#36393f";
var borderColor = "#3e4147";
var headerColor = "#202225";
var titleColor = "#ffffdf";
var langShinko = [
    "Resource sender for flag boost minting",
    "Enter coordinate to send to",
    "Save",
    "Creator",
    "Player",
    "Village",
    "Points",
    "Coordinate to send to",
    "Keep WH% behind",
    "Recalculate res/change",
    "Res sender",
    "Source village",
    "Target village",
    "Distance",
    "Wood",
    "Clay",
    "Iron",
    "Send resources",
    "Created by Sophie 'Shinko to Kuma'"
]
if (game_data.locale == "en_DK") {
    langShinko = [
        "Resource sender for flag boost minting",
        "Enter coordinate to send to",
        "Save",
        "Creator",
        "Player",
        "Village",
        "Points",
        "Coordinate to send to",
        "Keep WH% behind",
        "Recalculate res/change",
        "Res sender",
        "Source village",
        "Target village",
        "Distance",
        "Wood",
        "Clay",
        "Iron",
        "Send resources",
        "Created by Sophie 'Shinko to Kuma'"
    ]
}
if (game_data.locale == "el_GR") {
    langShinko = [
        "Αποστολή πόρων",
        "Εισάγετε τις συντεταγμένες - στόχο",
        "Αποθήκευση",
        "Δημιουργός",
        "Παίκτης",
        "Χωριό",
        "Πόντοι",
        "Στόχος",
        "Διατήρησε το % Αποθήκης κάτω από",
        "Υπολογισμός πόρων/αλλαγή στόχου",
        "Αποστολή πόρων",
        "Προέλευση",
        "Χωριό στόχος",
        "Απόσταση",
        "Ξύλο",
        "Πηλός",
        "Σίδερο",
        "Αποστολή πόρων",
        "Δημιουργήθηκε από την Sophie 'Shinko to Kuma'"
    ]
}
if (game_data.locale == "nl_NL") {
    langShinko = [
        "Grondstoffen versturen voor vlagfarmen",
        "Geef coordinaat in om naar te sturen",
        "Opslaan",
        "Scripter",
        "Speler",
        "Dorp",
        "Punten",
        "Coordinaat om naar te sturen",
        "Hou WH% achter",
        "Herbereken gs/doelwit",
        "Gs versturen",
        "Oorsprong",
        "Doelwit",
        "Afstand",
        "Hout",
        "Leem",
        "Ijzer",
        "Verstuur grondstoffen",
        "Gemaakt door Sophie 'Shinko to Kuma'"
    ]
}
if (game_data.locale == "it_IT") {
    langShinko = [
        "Script pushing per coniare",
        "Inserire le coordinate a cui mandare risorse",
        "Salva",
        "Creatrice",
        "Giocatore",
        "Villaggio",
        "Punti",
        "Coordinate a cui mandare",
        "Conserva % magazzino",
        "Ricalcola trasporti",
        "Invia risorse",
        "Villaggio di origine",
        "Villaggio di destinazione",
        "Distanza",
        "Legno",
        "Argilla",
        "Ferro",
        "Manda risorse",
        "Creato da Sophie 'Shinko to Kuma'"
    ]
}
if (game_data.locale == "pt_BR") {
    langShinko = [
        "Enviar recursos para cunhagem de moedas",
        "Insira coordenada para enviar recursos",
        "Salvar",
        "Criador",
        "Jogador",
        "Aldeia",
        "Pontos",
        "Enviar para",
        "Manter % no armazém",
        "Recalcular transporte",
        "Enviar recursos",
        "Origem",
        "Destino",
        "Distância",
        "Madeira",
        "Argila",
        "Ferro",
        "Enviar recursos",
        "Criado por Sophie 'Shinko to Kuma'"
    ]
}

cssClassesSophie = `
<style>
.sophRowA {
background-color: #32353b;
color: white;
}
.sophRowB {
background-color: #36393f;
color: white;
}
.sophHeader {
background-color: #202225;
font-weight: bold;
color: white;
}
</style>`

$("#contentContainer").eq(0).prepend(cssClassesSophie);
$("#mobileHeader").eq(0).prepend(cssClassesSophie);


//check if we have a limit set for the res we want to keep in the villages
if ("resLimit" in sessionStorage) {
    //found resLimit in storage, get it
    console.log('ok');
    resLimit = parseInt(sessionStorage.getItem("resLimit", resLimit));
}
else {
    //create resLimit for first time in sessionstorage
    sessionStorage.setItem("resLimit", resLimit);
    console.log('not found');
}

//collect overview so we can get all the information necessary from all villages
if (game_data.player.sitter > 0) {
    URLReq = `game.php?t=${game_data.player.id}&screen=overview_villages&mode=prod&page=-1&`;
}
else {
    URLReq = "game.php?&screen=overview_villages&mode=prod&page=-1&";
}
$.get(URLReq, function () {
    console.log("Managed to grab the page");
})
    .done(function (page) {

        //different HTML for mobile devices, so have to seperate
        if ($("#mobileHeader")[0]) {
            console.log("mobile");
            allWoodObjects = $(page).find(".res.mwood,.warn_90.mwood,.warn.mwood");
            allClayObjects = $(page).find(".res.mstone,.warn_90.mstone,.warn.mstone");
            allIronObjects = $(page).find(".res.miron,.warn_90.miron,.warn.miron");
            allWarehouses = $(page).find(".mheader.ressources");
            allVillages = $(page).find(".quickedit-vn");
            allFarms = $(page).find(".header.population");
            // allMerchants = $(page).find('a[href*="market"]');
            allMerchants = $(page).find(".production_column:has(.trader_img) .vertical_center");
            //grabbing wood amounts
            for (var i = 0; i < allWoodObjects.length; i++) {
                n = allWoodObjects[i].textContent;
                n = n.replace(/\./g, '').replace(',', '');
                allWoodTotals.push(n);
            };


            //grabbing clay amounts
            for (var i = 0; i < allClayObjects.length; i++) {
                n = allClayObjects[i].textContent;
                n = n.replace(/\./g, '').replace(',', '');
                allClayTotals.push(n);
            };


            //grabbing iron amounts
            for (var i = 0; i < allIronObjects.length; i++) {
                n = allIronObjects[i].textContent;
                n = n.replace(/\./g, '').replace(',', '');
                allIronTotals.push(n);
            };

            //grabbing warehouse capacity
            for (var i = 0; i < allVillages.length; i++) {
                warehouseCapacity.push(allWarehouses[i].parentElement.innerText);
            };

            //grabbing available merchants and total merchants
            for (var i = 0; i < allVillages.length; i++) {
                for (var j = 1; j < allMerchants.length; j++) {
                    availableMerchants.push(allMerchants[j].innerText);
                }
                totalMerchants.push("999");
            };

            //grabbing used farmspace and total farmspace
            for (var i = 0; i < allVillages.length; i++) {
                farmSpaceUsed.push(allFarms[i].parentElement.innerText.match(/(\d*)\/(\d*)/)[1]);
                farmSpaceTotal.push(allFarms[i].parentElement.innerText.match(/(\d*)\/(\d*)/)[2]);
            };

        }
        else {
            console.log("desktop");
            allWoodObjects = $(page).find(".res.wood,.warn_90.wood,.warn.wood");
            allClayObjects = $(page).find(".res.stone,.warn_90.stone,.warn.stone");
            allIronObjects = $(page).find(".res.iron,.warn_90.iron,.warn.iron")
            allVillages = $(page).find(".quickedit-vn");
            //grabbing wood amounts
            for (var i = 0; i < allWoodObjects.length; i++) {
                n = allWoodObjects[i].textContent;
                n = n.replace(/\./g, '').replace(',', '');
                allWoodTotals.push(n);
            };


            //grabbing clay amounts
            for (var i = 0; i < allClayObjects.length; i++) {
                n = allClayObjects[i].textContent;
                n = n.replace(/\./g, '').replace(',', '');
                allClayTotals.push(n);
            };


            //grabbing iron amounts
            for (var i = 0; i < allIronObjects.length; i++) {
                n = allIronObjects[i].textContent;
                n = n.replace(/\./g, '').replace(',', '');
                allIronTotals.push(n);
            };


            //grabbing warehouse capacity
            for (var i = 0; i < allVillages.length; i++) {
                warehouseCapacity.push(allIronObjects[i].parentElement.nextElementSibling.innerHTML);
            };

            //grabbing available merchants and total merchants
            for (var i = 0; i < allVillages.length; i++) {
                availableMerchants.push(allIronObjects[i].parentElement.nextElementSibling.nextElementSibling.innerText.match(/(\d*)\/(\d*)/)[1]);
                totalMerchants.push(allIronObjects[i].parentElement.nextElementSibling.nextElementSibling.innerText.match(/(\d*)\/(\d*)/)[2]);
            };

            //grabbing used farmspace and total farmspace
            for (var i = 0; i < allVillages.length; i++) {
                farmSpaceUsed.push(allIronObjects[i].parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerText.match(/(\d*)\/(\d*)/)[1]);
                farmSpaceTotal.push(allIronObjects[i].parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerText.match(/(\d*)\/(\d*)/)[2]);
            };
        }


        //making one big array to work with
        for (var i = 0; i < allVillages.length; i++) {
            villagesData.push({
                "id": allVillages[i].dataset.id,
                "url": allVillages[i].children[0].children[0].href,
                "coord": allVillages[i].innerText.trim().match(/\d+\|\d+/)[0],
                "name": allVillages[i].innerText.trim(),
                "wood": allWoodTotals[i],
                "stone": allClayTotals[i],
                "iron": allIronTotals[i],
                "availableMerchants": availableMerchants[i],
                "totalMerchants": totalMerchants[i],
                "warehouseCapacity": warehouseCapacity[i],
                "farmSpaceUsed": farmSpaceUsed[i],
                "farmSpaceTotal": farmSpaceTotal[i]
            });
        };

    });


//ask user what coordinate they want to send resources to
askCoordinate();

async function createList() {
    //if list is already made, delete both the older(possibly out of date list), with new one and readd the target and WH limit 
    if ($("#sendResources")[0]) {
        $("#sendResources")[0].remove();
        $("#resourceSender")[0].remove();
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    //UI creation of the list
    var htmlString = `
                <div id="resourceSender">
                    <table id="Settings" width="100%">
                        <thead>
                            <tr>
                                <td class="sophHeader">${langShinko[7]}</td>
                                <td class="sophHeader">Custom resource amount</td>
                                <td class="sophHeader">${langShinko[8]}</td>
                                <td class="sophHeader"></td>
                                <td class="sophHeader"></td>
                            </tr>
                        </tdead>
                        <tbody>
                        <tr >
                            <td class="sophRowA">
                                <input type="text" ID="coordinateTarget" name="coordinateTarget" size="20" margin="5" align=left>
                            </td>
                            <td class="sophRowA" align=left>
                                <input type="text" ID="customWood" name="customWood" size="5" value=${customWood}>
                                <span class="icon header wood"> </span>
                                <input type="text" ID="customClay" name="customClay" size="5" value=${customClay}>
                                <span class="icon header stone"> </span>
                                <input type="text" ID="customIron" name="customIron" size="5" value=${customIron}>
                                <span class="icon header iron"> </span>
                            </td>
                            <td class="sophRowA" align=left>
                                <input type="text" ID="resPercent" name="resPercent" size="1">%
                            </td>
                            <td class="sophRowA" margin="5">
                                <button type="button" ID="button" class="btn-confirm-yes" >${langShinko[2]}</button>
                            </td>
                            <td class="sophRowA">
                                <button type="button" ID="sendRes" class="btn" name="sendRes" onclick=reDo()> ${langShinko[9]}</button>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                    </br>
                </div>`.trim();
    //adding the target and WH limit DIV to the page
    uiDiv = document.createElement('div');
    uiDiv.innerHTML = htmlString;

    //creating header for the actual list of sends
    // <td class="sophHeader" width="25%" style="text-align:center">${langShinko[12]}</td>
    htmlCode = `
            <div id="sendResources" border=0>
                <table id="tableSend" width="100%">
                    <tbody id="appendHere">
                        <tr>
                            <td class="sophHeader" colspan=7 width=“550” style="text-align:center" >${langShinko[10]}</td>
                        </tr>
                        <tr>
                            <td class="sophHeader" width="25%" style="text-align:center">${langShinko[11]}</td>
                            <td class="sophHeader" width="5%" style="text-align:center">${langShinko[13]}</td>
                            <td class="sophHeader" width="15%" style="text-align:center">${langShinko[14]}</td>
                            <td class="sophHeader" width="15%" style="text-align:center">${langShinko[15]}</td>
                            <td class="sophHeader" width="15%" style="text-align:center">${langShinko[16]}</td>
                            <td class="sophHeader" width="10%" style="text-align:center">Händler</td>
                            <td class="sophHeader" width="15%"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            `;

    //append the page, mobileHeader will only work on mobile devices, and contentContainer won't, and vice versa, no need to add code to seperate
    $("#mobileHeader").eq(0).append(htmlCode);
    $("#contentContainer").eq(0).prepend(htmlCode);
    $("#mobileHeader").prepend(uiDiv.firstChild);
    $("#contentContainer").prepend(uiDiv.firstChild);
    $("#resPercent")[0].value = resLimit;
    $("#coordinateTarget")[0].value = coordinate;

    // save coordinate and reslimit functionality
    $('#button').click(function () {
        coordinate = $("#coordinateTarget")[0].value.match(/\d+\|\d+/)[0];
        sessionStorage.setItem("coordinate", coordinate);
        customWood = $("#customWood")[0].value;
        customClay = $("#customClay")[0].value;
        customIron = $("#customIron")[0].value;
        resLimit = $("#resPercent")[0].value;
        sessionStorage.setItem("resLimit", resLimit);
    });
    listHTML = ``;

    //adding sent so far

    $("#resourceSender").eq(0).prepend(`<table id="playerTarget" width="100%">
    <tbody>
        <tr>
            <td class="sophHeader" rowspan="3"><img src="`+ sendBack[2] + `"></td>
            <td class="sophHeader">${langShinko[4]}:</td>
            <td class="sophRowA">`+ sendBack[3] + `</td>
            <td class="sophHeader"><span class="icon header wood"> </span></td>
            <td class="sophRowB" id="woodSent"></td>
        </tr>
        <tr>
            <td class="sophHeader">${langShinko[5]}:</td>
            <td class="sophRowB">`+ sendBack[1] + `</td>
            <td class="sophHeader"><span class="icon header stone"> </span></td>
            <td class="sophRowA" id="stoneSent"></td>
        </tr>
        <tr>
            <td class="sophHeader">${langShinko[6]}: </td>
            <td class="sophRowA">`+ sendBack[4] + `</td>
            <td class="sophHeader"><span class="icon header iron"> </span></td>
            <td class="sophRowB" id="ironSent"></td>
        </tr>
    </tbody>
</table>`);


    //creating table rows
    for (var i = 0; i < villagesData.length; i++) {
        if (i % 2 == 0) {
            tempRow = " id='" + i + "' class='sophRowB'";
        }
        else {
            tempRow = " id='" + i + "' class='sophRowA'";
        }
        res = calculateResAmounts(villagesData[i].wood, villagesData[i].stone, villagesData[i].iron, villagesData[i].warehouseCapacity, villagesData[i].availableMerchants);
        if (res.wood + res.stone + res.iron != 0 && villagesData[i].id != sendBack[0]) {
            // <td> <a href="" style="color:#40D0E0;">${sendBack[1]}</a> </td>
            listHTML += `
        <tr ${tempRow} height="40">
            <td><a href="${villagesData[i].url}" style="color:#40D0E0;">${villagesData[i].name} </a></td>
            <td>${checkDistance(sendBack[5], sendBack[6], villagesData[i].coord.substring(0, 3), villagesData[i].coord.substring(4, 7))}</td>
            <td width="75" style="text-align:center">${res.wood.toLocaleString()} (${Number(villagesData[i].wood).toLocaleString()})<span class="icon header wood"> </span></td>
            <td width="75" style="text-align:center">${res.stone.toLocaleString()} (${Number(villagesData[i].stone).toLocaleString()})<span class="icon header stone"> </span></td>
            <td width="75" style="text-align:center">${res.iron.toLocaleString()} (${Number(villagesData[i].iron).toLocaleString()})<span class="icon header iron"> </span></td>
            <td width="50" style="text-align:center">${villagesData[i].availableMerchants}/${villagesData[i].totalMerchants}<span> </span></td>
            <td style="text-align:center"><input type="button" class="btn evt-confirm-btn btn-confirm-yes" id="sendResources" value="${langShinko[17]}" onclick=sendResource(${villagesData[i].id},${sendBack[0]},${customWood?.length > 0 ? customWood : res.wood},${customClay?.length > 0 ? customClay : res.stone},${customIron?.length > 0 ? customIron :res.iron},${i})></td>
        </tr>`
        }
    }
    $("#appendHere").eq(0).append(listHTML);
    //      redo the rows appearances cause some are ommited 
    //      (if you target yourself, you dont want to have the option to send to your own village from that same village, 
    //      wont work and breaks script, or if you would have to send 0 res, breaks script too)
    sortTableTest(2);
    formatTable();

    //put the focus on the first button in the list so the user can start cycling through them
    $(":button,#sendResources")[3].focus();
}

function sendResource(sourceID, targetID, woodAmount, stoneAmount, ironAmount, rowNr) {
    $(':button[id^="sendResources"]').prop('disabled', true);
    setTimeout(function () { $("#" + rowNr)[0].remove(); $(':button[id^="sendResources"]').prop('disabled', false); $(":button,#sendResources")[3].focus(); if($("#tableSend tr").length<=2)
    {
        alert("Finished sending!");
        
        if($(".btn-pp").length>0)
        {
            $(".btn-pp").remove(); 
        }
        throw Error("Done.");
    }}, 200);
    var e = { "target_id": targetID, "wood": woodAmount, "stone": stoneAmount, "iron": ironAmount };
    TribalWars.post("market", {
        ajaxaction: "map_send", village: sourceID
    }, e, function (e) {
        Dialog.close(),
            UI.SuccessMessage(e.message)
        console.log(e.message)
        totalWoodSent += woodAmount;
        totalStoneSent += stoneAmount;
        totalIronSent += ironAmount;
        $("#woodSent").eq(0).text(`${numberWithCommas(totalWoodSent)}`);
        $("#stoneSent").eq(0).text(`${numberWithCommas(totalStoneSent)}`);
        $("#ironSent").eq(0).text(`${numberWithCommas(totalIronSent)}`);
       },
        !1
    );
    
}

function numberWithCommas(x) {
    // add . to make numbers more readable
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1.$2");
    return x;
}

function checkDistance(x1, y1, x2, y2) {
    //calculate distance from current village
    var a = x1 - x2;
    var b = y1 - y2;
    var distance = Math.round(Math.hypot(a, b));
    return distance;
}

function askCoordinate() {
    const currentURL = window.location.href;
    const coordinates = currentURL.match(/#(\d+;\d+)/)?.[1];
    let prefillCoords = document.querySelector('#content_value > .mobileKeyValue > div:nth-of-type(1) > span:last-of-type')?.textContent?.trim();
    if(!prefillCoords && coordinates?.includes(';')){
        prefillCoords = coordinates.replace(';', '|');
    }

    //ask for coordinate
    var content = `<div style=max-width:1000px;>
    <h2 class="popup_box_header">
       <center><u>
          <font color="darkgreen">${langShinko[0]}</font>
          </u>
       </center>
    </h2>
    <hr>
    <p>
    <center>
       <font color=maroon><b>${langShinko[1]}</b>
       </font>
    </center>
    </p>
    <center> 
        <table>
            <tr><td><center><input type="text" ID="coordinateTargetFirstTime" name="coordinateTargetFirstTime" size="20" margin="5" align=left value=${prefillCoords}></center></td></tr>
            <tr></tr>
            <tr><td><center><input type="button"
                class="btn evt-cancel-btn btn-confirm-yes" id="saveCoord"
                value="${langShinko[2]}">&emsp;</center></td></tr>
            <tr></tr>
        </table>
    </center>
    <br>
 </div>`;
    Dialog.show('Supportfilter', content);
    $("#saveCoord").click(function () {
        coordinate = $("#coordinateTargetFirstTime")[0].value.match(/\d+\|\d+/)[0];
        sessionStorage.setItem("coordinate", coordinate);
        var close_this = document.getElementsByClassName(
            'popup_box_close');
        close_this[0].click();
        targetID = coordToId(coordinate);
    });
}




function calculateResAmounts(wood, stone, iron, warehouse, merchants) {
    var merchantCarry = merchants * 1500;
    //available to use resources in village and substracting what we wanna leave behind
    leaveBehindRes = Math.floor(warehouse / 100 * resLimit);
    var localWood = wood - leaveBehindRes;
    var localStone = stone - leaveBehindRes;
    var localIron = iron - leaveBehindRes;
    localWood = Math.max(0, localWood);
    localStone = Math.max(0, localStone);
    localIron = Math.max(0, localIron);



    //recalculate how much can be sent according to how much is available
    //how much the merchant can take maximum
    merchantWood = (merchantCarry * woodPercentage);
    merchantStone = (merchantCarry * stonePercentage);
    merchantIron = (merchantCarry * ironPercentage);

    //check each type if we have enough available
    var perc = 1;
    if (merchantWood > localWood) {
        perc = localWood / merchantWood;
        merchantWood = merchantWood * perc;
        merchantStone = merchantStone * perc;
        merchantIron = merchantIron * perc;
    }
    if (merchantStone > localStone) {
        perc = localStone / merchantStone;
        merchantWood = merchantWood * perc;
        merchantStone = merchantStone * perc;
        merchantIron = merchantIron * perc;
    }
    if (merchantIron > localIron) {
        perc = localIron / merchantIron;
        merchantWood = merchantWood * perc;
        merchantStone = merchantStone * perc;
        merchantIron = merchantIron * perc;
    }
    thisVillaData = { "wood": Math.floor(merchantWood), "stone": Math.floor(merchantStone), "iron": Math.floor(merchantIron) }
    return thisVillaData;

}

function compareDates(x) {
    var start = x,
        end = new Date(),
        diff = new Date(end - start),
        hours = diff / 1000 / 60 / 60;
    console.log("checked " + hours + " ago for village list");
    return hours;
}
function coordToId(coordinate) {
    //get village data from the coordinate we gained from the user
    if (game_data.player.sitter > 0) {
        sitterID = `game.php?t=${game_data.player.id}&screen=api&ajax=target_selection&input=${coordinate}&type=coord`;
    }
    else {
        sitterID = '/game.php?&screen=api&ajax=target_selection&input=' + coordinate + '&type=coord';
    }
    var data;
    $.get(sitterID, function (json) {
        if(parseFloat(game_data.majorVersion)>8.217)data = json;
        else data=JSON.parse(json);

    }).done(function(){
        console.log(data);
        sendBack = [data.villages[0].id, data.villages[0].name, data.villages[0].image, data.villages[0].player_name, data.villages[0].points, data.villages[0].x, data.villages[0].y]
        createList();
    })
}

function reDo() {
    coordToId(coordinate);
}

function formatTable() {
    //reformat the rows so they are clean
    var tableRows = $("#table tr");
    for (var i = 1; i < tableRows.length; i++) {
        if (i % 2 == 0) {
            $("#table tr")[i].className = "sophRowB";
        }
        else {
            $("#table tr")[i].className = "sophRowA";
        }
    }
}

function sortTableTest(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("tableSend");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 2; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if (Number(x.innerHTML) > Number(y.innerHTML)) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (Number(x.innerHTML) < Number(y.innerHTML)) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}
