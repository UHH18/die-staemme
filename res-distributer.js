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
            allMerchants = $(page).find('a[href*="market"]');
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
        console.log(villagesData);
    });
