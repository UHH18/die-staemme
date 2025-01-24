var c, ctx, circleReference, lastMillis, lastTimingMillis, timerInterval, constOffset, runTimes, hitMs = getStorage("hit_ms"),
    milliPiFraction = 0.00628319,
    calibrationTime = getStorage("offset_ms"),
    imgSrc = {
        green: "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/green.png",
        yellow: "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/yellow.png",
        red: "https://dsen.innogamescdn.com/asset/04d88c84/graphic/dots/red.png",
        questionmark: "https://dsen.innogamescdn.com/asset/6be9bf502a/graphic/questionmark.png",
        watchtower: "https://dsen.innogamescdn.com/asset/04d88c84/graphic/big_buildings/watchtower1.png"
    };

if ("place" != game_data.screen) {
    alert("This script must be run from the rally point.\nRunning during command execution will add millisecond assist.\nRunning after command execution will show you by how many milliseconds you missed the target and allow you to adjust.");
} else if (window.location.href.split("try=").length == 2) {
    if (runTimes == null) {
        runTimes = 1;
        setTimeout(function () {
            addDisplay();
        }, 50);
    } else {
        runTimes++;
        var toReset = confirm("Script already running. Do you delete stored variables (May fix the script in case of recurring errors)?");
        if (toReset) clearStorage();
    }
} else if (runTimes == null) {
    runTimes = 0;
    promptCalibration();
}

function addDisplay() {
    try {
        var e = $("#date_arrival").parent().parent()[0];
        var i;

        for (var t = 2; t < e.children.length; t++) {
            try {
                if (e.children[t].children[1].innerHTML.match(":") != null) {
                    i = 1000 * Number(e.children[t].children[1].innerHTML.split(":")[2]);
                    break;
                }
            } catch (e) {
                console.log("Could not identify arrival second:\n" + e);
            }
        }

        constOffset = i + getStorage("const_offset");

        e.children[0].innerHTML += `
            <th colspan='4'>
                <span style='white-space:nowrap'>Timing assistant</span>
                <span>
                    <img src='${imgSrc.questionmark}' onclick='toggleTutorial()' style='float:right;display:inline;height:15px;width:15px;cursor:pointer'>
                </span>
            </th>`;

        // Additional table cell creation
        var s = document.createElement("TD");
        s.setAttribute("rowspan", e.children.length - 2);
        s.setAttribute("colspan", 2);
        s.setAttribute("style", "line-height:1px;text-align:center");
        s.innerHTML = `
            <div>
                <h2 style='position:absolute;display:block;margin-top:54px;margin-left:63px' id='second_display'></h2>
                <canvas id='millis_canvas' width='150px' height='130px' style='margin-top:-20px'></canvas>
            </div>`;
        // Add the rest of your elements similarly
        // ...

        $("#ds_body")[0].setAttribute("onsubmit", "sendFunction()");
        timerInterval = setInterval(drawCircle, 5);
    } catch (e) {
        console.log("Could not find table...\n" + e);
    }
}

// Define other functions here...

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

    var e = new Date();
    var t = (e = new Date(e.getTime() + calibrationTime + constOffset)).getMilliseconds();
    var i = new Date(e.getTime() - hitMs).getMilliseconds();

    if (t < lastMillis) {
        lastMillis = t;
        $("#second_display")[0].innerHTML = String(e.getSeconds()).padStart(2, "0");
    }
    if (i < lastTimingMillis) {
        ctx.clearRect(0, 0, 160, 160);
        lastTimingMillis = 0;
    }
    ctx.beginPath();
    ctx.arc(75, 75, 50, circleReference + lastTimingMillis * milliPiFraction, circleReference + i * milliPiFraction);
    ctx.stroke();
    lastMillis = t;
    lastTimingMillis = i;
}

// Add the rest of the code here...
