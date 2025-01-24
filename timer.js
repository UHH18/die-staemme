var c, ctx, circleReference, lastMillis, lastTimingMillis, timerInterval, constOffset, runTimes;
var hitMs = getStorage("hit_ms");
var milliPiFraction = 0.00628319;
var calibrationTime = getStorage("offset_ms");
var imgSrc = {
    green: "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/green.png",
    yellow: "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/yellow.png",
    red: "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/red.png",
    questionmark: "https://dsen.innogamescdn.com/asset/6be9bf502a/graphic/questionmark.png",
    watchtower: "https://dsen.innogamescdn.com/asset/04d88c84/graphic/big_buildings/watchtower1.png"
};

// Hauptlogik zur Prüfung, ob das Skript im richtigen Kontext läuft
if (game_data.screen != "place") {
    alert("This script must be run from the rally point.\nRunning during command execution will add millisecond assist.\nRunning after command execution will show you by how many milliseconds you missed the target.");
} else if (window.location.href.split("try=").length == 2) {
    if (runTimes == null) {
        runTimes = 1;
        setTimeout(function() {
            addDisplay();
        }, 50);
    } else {
        runTimes++;
        var toReset = confirm("Script already running. Do you delete stored variables (May fix the script in case of recurring errors)?");
        if (toReset == 1) clearStorage();
    }
} else if (runTimes == null) {
    runTimes = 0;
    promptCalibration();
}

// Funktion: Anzeige hinzufügen
function addDisplay() {
    try {
        var table = $("#date_arrival").parent().parent()[0];
        var i;
        for (var t = 2; t < table.children.length; t++) {
            try {
                if (table.children[t].children[1].innerHTML.match(":") != null) {
                    i = 1000 * Number(table.children[t].children[1].innerHTML.split(":")[2]);
                    break;
                }
            } catch (e) {
                console.log("Could not identify arrival second:\n" + e);
            }
        }
        constOffset = i + getStorage("const_offset");

        // Neue Anzeige hinzufügen
        table.children[0].innerHTML += `
            <th colspan='4'>
                <span style='white-space:nowrap'>Timing assistant</span>
                <span>
                    <img src='${imgSrc.questionmark}' onclick='toggleTutorial()' style='float:right;display:inline;height:15px;width:15px;cursor:pointer'>
                </span>
            </th>
        `;
        // Weiterer Code für das Interface...
    } catch (e) {
        console.log("Could not find table...\n" + e);
    }
}

// Funktion: Kreis zeichnen
function drawCircle() {
    if (c == null) {
        c = document.getElementById("millis_canvas");
        ctx = c.getContext("2d");
        circleReference = -Math.PI / 2;
        lastMillis = 0;
        lastTimingMillis = 0;
        hitMs = $("#hit_input")[0].value;
        $("#second_display")[0].innerHTML = $(".relative_time")[0].innerHTML.split(":")[2];
    }

    var now = new Date();
    now = new Date(now.getTime() + calibrationTime + constOffset);

    var t = now.getMilliseconds();
    var timing = new Date(now.getTime() - hitMs).getMilliseconds();

    if (t < lastMillis) {
        lastMillis = t;
        $("#second_display")[0].innerHTML = (String(now.getSeconds()).length === 1) ? "0" + now.getSeconds() : now.getSeconds();
    }

    if (timing < lastTimingMillis) {
        ctx.clearRect(0, 0, 160, 160);
        lastTimingMillis = 0;
    }

    ctx.beginPath();
    ctx.arc(75, 75, 50, circleReference + lastTimingMillis * milliPiFraction, circleReference + timing * milliPiFraction);
    ctx.stroke();
    lastMillis = t;
    lastTimingMillis = timing;
}

// Funktion: Übung durchführen
function practiceFunction() {
    var now = new Date();
    now = new Date(now.getTime() + calibrationTime + constOffset);
    var t = now.getMilliseconds();

    var buttonText = ["Try", "Reset"];
    var buttonDOM = $("#practice_button")[0];
    hitMs = $("#hit_input")[0].value;

    if (buttonDOM.innerHTML == buttonText[0]) {
        clearInterval(timerInterval);
        buttonDOM.innerHTML = buttonText[1];
        var miss = Math.abs(t - hitMs) <= 500 ? (t - hitMs) : -(1000 - (t - hitMs));
        $("#miss_display")[0].innerHTML = String(miss);
    } else {
        buttonDOM.innerHTML = buttonText[0];
        timerInterval = setInterval(drawCircle, 5);
    }
    lastTimingMillis = 1200;
}

// Funktion: Daten speichern
function storeData(key, value) {
    var data = localStorage.timeAssistant.split(",");
    var now = new Date();
    var result = "";

    if (key == "hit_ms") {
        hitMs = $("#hit_input")[0].value;
        hitMs = isNaN(Number(hitMs)) ? getStorage("hit_ms") : Number(hitMs);
        data[0] = hitMs;
    } else if (key == "offset_ms") {
        offsetMs = $("#offset_input")[0].value;
        offsetMs = isNaN(Number(offsetMs)) ? getStorage("offset_ms") : Number(offsetMs);
        data[1] = offsetMs;
        calibrationTime = Number(offsetMs);
        data[data.length - 2] = now.getTime();
        setTimeout(function() { updateColor(); }, 250);
    } else if (key == "offset") {
        value = isNaN(Number(value)) ? getStorage("offset_ms") : Number(value);
        data[1] = value;
        data[data.length - 2] = now.getTime();
    } else if (key == "last_hit") {
        data[2] = value;
    } else if (key == "const_offset") {
        value = isNaN(Number(value)) ? getStorage("const_offset") : Number(value);
        data[3] = value;
        data[data.length - 1] = now.getTime();
    }

    for (var i = 0; i < data.length - 1; i++) {
        result += data[i] + ",";
    }
    result += data[data.length - 1];
    localStorage.setItem("timeAssistant", result);
}

// Funktion: Daten abrufen
function getStorage(key) {
    var data = localStorage.timeAssistant;
    var keys = ["hit_ms", "offset_ms", "last_hit", "const_offset", "last_set_offset", "last_set_const"];
    var value;

    if (data == null) {
        data = "0,0,00:000,0,0,0";
        localStorage.setItem("timeAssistant", data);
        return 0;
    }

    data = data.split(",");

    for (var i = 0; i < keys.length; i++) {
        if (key == keys[i]) {
            value = (i === 2) ? data[i] : Number(data[i]);
        }
    }

    return value;
}

// Funktion: Speicherung löschen
function clearStorage() {
    localStorage.removeItem("timeAssistant");
    location.reload();
}

// Funktion: Initiale Kalibrierung
function getInitialOffset() {
    var now = new Date();
    var serverTime = Timing.getCurrentServerTime();

    storeData("const_offset", Math.round(serverTime - now.getTime()));
    updateColor();

    var table = $("#date_arrival").parent().parent()[0];
    for (var t = 2; t < table.children.length; t++) {
        try {
            if (table.children[t].children[1].innerHTML.match(":") != null) {
                constOffset = 1000 * Number(table.children[t].children[1].innerHTML.split(":")[2]);
                break;
            }
        } catch (e) {
            console.log("Could not identify arrival second:\n" + e);
        }
    }
    constOffset += (serverTime - now.getTime());
}
