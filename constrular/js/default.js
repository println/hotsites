var RIOxmlDoc;
var RIOxmlIndex;
var RIOxmlSync;
var RIOrelativeUrl;
var RIOloadUrl;
var RIOpwdXmlFile;
var RIOindexFile;
var RIOsyncFile;
var RIOvideoFile = new Array();
var RIOcurrent_slide = 0;
var RIOcurrent_action = -1;
var RIOcurrent_topic = 0;
var RIOsession_id = 0;
var RIOxmlTitle;
var RIOxmlAuthor;
var RIOxmlCourse;
var RIOvideoElem;
var RIOindexElem;
var RIOslidesElem;
var RIOsyncCheckBox = "true";
var RIOos;
var RIOlogVersion = "1.2";
var RIOwebserver;
var RIOlogWebServer = "logvideoaula-idc.rnp.br";
var RIOurllog = location.protocol + "//" + RIOlogWebServer + "/userlog.rio?logline=";
var RIOforceLog = "false";
var RIOlocalAccess = "false";
var RIOopinion = "false";
var RIOdownloadlog;
var RIObufferVideoMsgInterval = "5000";
var xmlOldVersion = "false";
var videoSlidePos = 0;

function RIOdebug(a) {
    document.getElementById("RIOdebug").innerHTML += RIOgetDateTime() + ": " + a + "<br>";
    document.getElementById("RIOdebug").scrollTop = document.getElementById("RIOdebug").scrollHeight
}

function RIOdebugControl() {
    var b = false;
    var c = false;
    var a = false;
    RIOdebug("RIOdebugControl: Shortcut debug");
    document.onkeyup = function(d) {
        if (d.which == 16) {
            b = false
        }
    };
    document.onkeyup = function(d) {
        if (d.which == 17) {
            c = false
        }
    };
    document.onkeyup = function(d) {
        if (d.which == 18) {
            a = false
        }
    };
    document.onkeydown = function(d) {
        if (d.which == 16) {
            b = true
        }
        if (d.which == 17) {
            c = true
        }
        if (d.which == 18) {
            a = true
        }
        if (d.which == 68 && b == true && c == true && a == true) {
            if (document.getElementById("RIOdebug").style.display != "inline") {
                document.getElementById("RIOdebug").style.display = "inline"
            } else {
                document.getElementById("RIOdebug").style.display = "none"
            }
            return false
        }
    }
}

function RIOenableDebug() {
    if (document.getElementById("RIOdebug").style.display != "inline") {
        document.getElementById("RIOdebug").style.display = "inline"
    } else {
        document.getElementById("RIOdebug").style.display = "none"
    }
}

function RIOsetOS() {
    var a = RIOdetectOS();
    return (a.isUbuntu) ? ("Ubuntu") : (a.isAndroid) ? ("Android") : (a.isLinux) ? ("Linux") : (a.isiOS) ? ("iOS") : (a.isiPad) ? ("iOS") : (a.isOSX) ? ("OSX") : (a.isBlackBerry) ? ("BlackBerry") : (a.isWP) ? ("Windows_Phone") : (a.isWin) ? ("Windows") : ("Unknown")
}

function RIOdetectOS() {
    var a = navigator.userAgent.toLowerCase();
    return {
        isUbuntu: /ubuntu/.test(a),
        isAndroid: /android/.test(a),
        isLinux: /linux/.test(a),
        isiOS: /iphone os/.test(a),
        isiPad: /ipad/.test(a),
        isOSX: /mac os x/.test(a),
        isBlackBerry: /blackberry/.test(a),
        isWP: /windows phone/.test(a),
        isWin: /trindent/.test(a),
        isWin: /windows nt/.test(a)
    }
}

function RIOloadXMLDoc(d, a) {
    var c;
    var e;
    if (RIOlocalAccess == "true" && RIObrowser().substr(0, 4) == "MSIE") {
        c = new ActiveXObject("Microsoft.XMLHTTP");
        if (a == "true") {
            c.open("GET", d, true)
        } else {
            c.open("GET", d, false)
        }
        c.send(null);
        if ((c.status != 200) && (c.status != 0)) {
            if (c.status == 403) {
                RIOdebug("Erro ao ler " + d + ": Permissão negada");
                alert("Permissão negada")
            } else {
                RIOdebug("Erro ao ler " + d + ": " + c.statusText);
                alert(c.statusText)
            }
        } else {
            e = (new DOMParser()).parseFromString(c.responseText, "text/xml")
        }
    } else {
        c = new XMLHttpRequest();
        if (a == "true") {
            c.open("GET", d, true)
        } else {
            c.open("GET", d, false)
        }
        if (RIObrowser().substr(0, 4) != "MSIE") {
            c.overrideMimeType("text/xml")
        }
        try {
            c.send(null);
            if ((c.status != 200) && (c.status != 0)) {
                if (c.status == 403) {
                    RIOdebug("Erro ao ler " + d + ": Permissão negada");
                    alert("Permissão negada")
                } else {
                    RIOdebug("Erro ao ler " + d + ": " + c.statusText);
                    alert(c.statusText)
                }
            } else {
                e = c.responseXML
            }
        } catch (b) {
            e = b.description;
            RIOdebug("RIOloadXMLDoc: " + b.toString())
        }
    }
    return e
}

function RIObrowser() {
    var c = navigator.appName,
        b = navigator.userAgent,
        a;
    var d = b.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (d && (a = b.match(/version\/([\.\d]+)/i)) != null) {
        d[2] = a[1]
    }
    d = d ? [d[1], d[2]] : [c, navigator.appVersion, "-?"];
    if (String(d) == "Trident,7.0") {
        d = "MSIE,11"
    }
    return String(d)
}

function RIOstateMsg() {
    RIObuildStatusLogMsg("STATE")
}

function RIObufferVideoMsg() {
    var b = RIOdownloadlog;
    RIOdownloadlog = RIOvideoElem.buffered.length;
    for (i = 0; i < RIOvideoElem.buffered.length; i++) {
        RIOdownloadlog += " " + RIOvideoElem.buffered.start(i) + " " + RIOvideoElem.buffered.end(i)
    }
    if (b != RIOdownloadlog) {
        var a = RIOsession_id + "*" + RIOgetDateTime() + "*BUFFERVIDEO*" + RIOvideoElem.duration + "*" + RIOdownloadlog;
        RIOsendlog(a)
    }
}

function RIOloadVideo() {
    var a = "";
    RIOdebug("RIOloadVideo: Loading Video");
    RIOvideoElem = document.getElementById("RIOvideo");
    for (i = 0; i < RIOvideoFile.length; i++) {
        switch (RIOvideoFile[i].substr(RIOvideoFile[i].lastIndexOf("."), RIOvideoFile[i].length)) {
            case ".mp4":
                a += '<source src="' + RIOvideoFile[i] + '" type="video/mp4" />';
                break;
            case ".webm":
                a += '<source src="' + RIOvideoFile[i] + '" type="video/webm" />';
                break;
            case ".flv":
                a += '<source src="' + RIOvideoFile[i].substr(0, RIOvideoFile[i].lastIndexOf(".")) + '.mp4" type="video/mp4" />';
                a += '<source src="' + RIOvideoFile[i].substr(0, RIOvideoFile[i].lastIndexOf(".")) + '.webm" type="video/webm" />';
                break
        }
    }
    a += "Este navegador não tem suporte a tag video do HTML!";
    RIOvideoElem.innerHTML += a;
    RIOvideoElem.addEventListener("timeupdate", function(b) {
        RIOupdateCurrentTopic(RIOvideoElem.currentTime);
        RIOloadSlides(RIOvideoElem.currentTime)
    }, false);
    RIOvideoElem.addEventListener("canplaythrough", function(b) {
        RIObuildStatusLogMsg("PLAY")
    }, false);
    RIOvideoElem.addEventListener("play", function(b) {
        RIObuildStatusLogMsg("PLAY")
    }, false);
    RIOvideoElem.addEventListener("pause", function(b) {
        RIObuildStatusLogMsg("PAUSE")
    }, false);
    RIOvideoElem.addEventListener("ended", function(b) {
        RIObuildStatusLogMsg("STOP")
    }, false);
    RIOvideoElem.addEventListener("seeked", function(b) {
        RIOexecSeekedListener(RIOvideoElem.currentTime)
    }, false)
}

function RIOloadXmlFile() {
    RIOdebug("RIOloadXmlFile: Loading XmlFile");
    document.getElementById("RIOinfo").innerHTML = '<table class="RIOtableInfoBar"><tr><td><strong>Disciplina:</strong> ' + RIOxmlCourse + " - </td><td><strong>Aula:</strong> " + RIOxmlTitle + " - </td><td><strong>Professor:</strong> " + RIOxmlAuthor + "</td</tr></table>"
}

function RIOexecSeekedListener(c) {
    var b = RIOfindNewSlideIndex(c);
    var a = RIOfindNewTopicIndex(c);
    RIObuildSendLog("PROGRESSBAR_CHANGED", b, a)
}

function RIOfindNewSlideIndex(a) {
    for (i = 0; i < RIOxmlSync.getElementsByTagName("slide").length; i++) {
        if (i == (RIOxmlSync.getElementsByTagName("slide").length - 1)) {
            break
        } else {
            if (a >= RIOxmlSync.getElementsByTagName("slide")[i].attributes.getNamedItem("time").nodeValue && a < RIOxmlSync.getElementsByTagName("slide")[i + 1].attributes.getNamedItem("time").nodeValue) {
                break
            }
        }
    }
    return i
}

function RIOfindNewTopicIndex(a) {
    for (i = 0; i < RIOxmlIndex.getElementsByTagName("ind_item").length; i++) {
        if (i == (RIOxmlIndex.getElementsByTagName("ind_item").length - 1)) {
            break
        } else {
            if (a >= RIOxmlIndex.getElementsByTagName("ind_item")[i].getElementsByTagName("time")[0].childNodes[0].nodeValue && a < RIOxmlIndex.getElementsByTagName("ind_item")[i + 1].getElementsByTagName("time")[0].childNodes[0].nodeValue) {
                break
            }
        }
    }
    return i
}

function RIOgotoIndex(a) {
    RIObuildSendLog("TOPIC_CHANGED", RIOfindNewSlideIndex(RIOvideoElem.currentTime), a);
    RIOvideoElem.currentTime = RIOxmlIndex.getElementsByTagName("ind_item")[a].getElementsByTagName("time")[0].childNodes[0].nodeValue
}

function RIOloadIndex() {
    RIOdebug("RIOloadIndex: Loading Index");
    var d = RIOxmlIndex.getElementsByTagName("ind_item").length;
    var c = new Array();
    var b = new Array();
    var a = "<ul>";
    RIOindexElem = document.getElementById("index");
    for (i = 0; i < d; i++) {
        c[i] = RIOxmlIndex.getElementsByTagName("ind_item")[i].getElementsByTagName("ind_item").length
    }
    for (i = 0; i < d; i++) {
        if (c[i] == 0) {
            a += RIOgetIndex(i)
        } else {
            b.push(c[i]);
            a += RIOgetIndex(i);
            a += "<ul>"
        }
        for (j = 0; j < b.length; j++) {
            b[j] = b[j] - 1;
            if (b[j] == -1) {
                a += "</ul>"
            }
        }
    }
    a += "<hr>";
    a += "</ul>";
    RIOindexElem.innerHTML += a
}

function RIOgetIndex(a) {
    var d = RIOxmlIndex.getElementsByTagName("ind_item")[a].getElementsByTagName("time")[0].childNodes[0].nodeValue;
    var b = RIOxmlIndex.getElementsByTagName("ind_item")[a].getElementsByTagName("text")[0].childNodes[0].nodeValue;
    child = RIOxmlIndex.getElementsByTagName("ind_item")[a];
    hours = parseInt(d / 3600) % 24;
    minutes = parseInt(d / 60) % 60;
    seconds = Math.round(d % 60);
    if (hours == 0) {
        var c = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
    } else {
        var c = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
    }
    return ('<li id="index' + (a + 1) + '"><a href="javascript:RIOgotoIndex(' + a + ');">' + c + ": " + b + "</a></li>")
}

function RIOlike(b) {
    var a = RIOsession_id + "*" + RIOgetDateTime() + "*" + b;
    RIOsendlog(a);
    RIOopinion = "true";
    RIOloadtoolBar()
}

function RIOsendlog(a) {
    if (RIOlocalAccess == "false" || RIOforceLog == "true") {
        RIOdebug("RIOsendlog: " + RIOurllog + a);
        RIOloadXMLDoc(RIOurllog + a, "true")
    }
}

function RIOgetDateTime() {
    Date.prototype.customFormat = function(f) {
        var E, l, t, c, r, k, n, g, x, q, y, d, z, A, v, w, p, o, C, b, e, u;
        var B = this;
        l = ((E = B.getFullYear()) + "").slice(-2);
        r = (k = B.getMonth() + 1) < 10 ? ("0" + k) : k;
        c = (t = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][k - 1]).substring(0, 3);
        x = (q = B.getDate()) < 10 ? ("0" + q) : q;
        g = (n = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][B.getDay()]).substring(0, 3);
        e = (q >= 10 && q <= 20) ? "th" : ((b = q % 10) == 1) ? "st" : (b == 2) ? "nd" : (b == 3) ? "rd" : "th";
        f = f.replace("#YYYY#", E).replace("#YY#", l).replace("#MMMM#", t).replace("#MMM#", c).replace("#MM#", r).replace("#M#", k).replace("#DDDD#", n).replace("#DDD#", g).replace("#DD#", x).replace("#D#", q).replace("#th#", e);
        z = (y = B.getHours());
        if (z == 0) {
            z = 24
        }
        if (z > 12) {
            z -= 12
        }
        d = z < 10 ? ("0" + z) : z;
        C = (o = y < 12 ? "am" : "pm").toUpperCase();
        A = (v = B.getMinutes()) < 10 ? ("0" + v) : v;
        w = (p = B.getSeconds()) < 10 ? ("0" + p) : p;
        ms_aux = B.getMilliseconds();
        u = (ms_aux < 100 && ms_aux >= 10) ? ("0" + ms_aux) : (ms_aux < 10) ? ("00" + ms_aux) : ms_aux;
        return f.replace("#hhh#", y).replace("#hh#", d).replace("#h#", z).replace("#mm#", A).replace("#m#", v).replace("#ss#", w).replace("#s#", p).replace("#ampm#", o).replace("#AMPM#", C).replace("#ms#", u)
    };
    var a = new Date;
    return a.customFormat("#YYYY##MM##DD##hh##mm##ss##ms#")
}

function RIObuildSendLogStartMsg() {
    var a = RIOsession_id + "*" + RIOgetDateTime() + "*" + RIOpwdXmlFile + "*" + RIObrowser() + "*" + RIOlogVersion + "*" + RIOos;
    RIOsendlog(a)
}

function RIOvideoStatus() {
    var a;
    if (RIOvideoElem.ended) {
        a = "STOP"
    } else {
        if (RIOvideoElem.paused) {
            a = "PAUSE"
        } else {
            a = "PLAY"
        }
    }
    return a
}

function RIObuildStatusLogMsg(b) {
    var a = RIOsession_id + "*" + RIOgetDateTime() + "*" + b + "*" + RIOvideoStatus() + "*" + RIOvideoElem.currentTime + "*" + RIOcurrent_slide + "*" + RIOcurrent_topic + "*" + RIOxmlIndex.getElementsByTagName("ind_item")[(RIOcurrent_topic != 0) ? (RIOcurrent_topic - 1) : 0].getElementsByTagName("time")[0].childNodes[0].nodeValue + "*" + String(RIOsyncCheckBox).toUpperCase() + "*" + fullscreenMode();
    RIOsendlog(a)
}

function fullscreenMode() {
    var a;
    if (RIObrowser().substr(0, 4) == "MSIE") {
        a = "UNKNOWN"
    } else {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.oFullscreenElement) {
            a = "FULLSCREENVIDEO"
        } else {
            a = "REGULAR"
        }
    }
    return a
}

function RIObuildSendLog(c, e, a) {
    var f;
    var d;
    if (c == "TOPIC_CHANGED" || c == "PROGRESSBAR_CHANGED") {
        f = c;
        c = -1;
        if (String(RIOsyncCheckBox).toUpperCase() == "FALSE") {
            d = -1;
            e = -1
        } else {
            d = RIOxmlIndex.getElementsByTagName("ind_item")[a].getElementsByTagName("time")[0].childNodes[0].nodeValue;
            e++
        }
        a++
    } else {
        f = "SLIDE_CHANGED";
        if (String(RIOsyncCheckBox).toUpperCase() == "FALSE") {
            d = -1;
            a = -1
        } else {
            d = RIOxmlSync.getElementsByTagName("slide")[e].attributes.getNamedItem("time").nodeValue;
            a++
        }
        e++
    }
    var b = RIOsession_id + "*" + RIOgetDateTime() + "*" + f + "*" + RIOvideoStatus() + "*" + RIOvideoElem.currentTime + "*" + RIOcurrent_slide + "*" + RIOcurrent_topic + "*" + RIOxmlIndex.getElementsByTagName("ind_item")[RIOcurrent_topic - 1].getElementsByTagName("time")[0].childNodes[0].nodeValue + "*" + String(RIOsyncCheckBox).toUpperCase() + "*" + fullscreenMode() + "*" + d + "*" + e + "*" + a + "*" + c;
    RIOsendlog(b)
}

function RIOchangeSlide(a) {
    var b;
    switch (a) {
        case "FIRST":
            b = 0;
            break;
        case "PREV":
            b = RIOcurrent_slide - 2;
            break;
        case "NEXT":
            b = RIOcurrent_slide;
            break;
        case "LAST":
            b = RIOxmlSync.getElementsByTagName("slide").length - 1;
            break
    }
    RIOdebug("RIOchangeSlide: pressed_but=" + a);
    RIObuildSendLog(a, b, RIOfindNewTopicIndex(RIOxmlSync.getElementsByTagName("slide")[b].attributes.getNamedItem("time").nodeValue));
    if (RIOsyncCheckBox) {
        RIOvideoElem.currentTime = RIOxmlSync.getElementsByTagName("slide")[b].attributes.getNamedItem("time").nodeValue
    } else {
        RIOloadSlide(b)
    }
    document.getElementById("index" + (RIOfindNewTopicIndex(RIOvideoElem.currentTime) + 1)).scrollIntoView(true)
}

function RIOloadSlideBar() {
    RIOdebug("RIOloadSlideBar: Loading SlideBar slide=" + RIOcurrent_slide);
    var b = document.getElementById("RIOslideBar");
    var a = '<table class="RIOtableSlideBar"><tr>';
    if (RIOcurrent_slide != 1) {
        a += '<td><img id="firstslide" class="bars" alt="Primeiro slide" title="Primeiro slide" onclick="RIOchangeSlide(\'FIRST\');" src="images/first.png"></td>';
        a += '<td><img id="prevslide" class="bars" alt="Slide anterior" title="Slide anterior" onclick="RIOchangeSlide(\'PREV\');" src="images/prev.png"></td>'
    } else {
        a += '<td><img id="firstslide" class="bars" alt="Primeiro slide" title="Primeiro slide" src="images/first.png"></td>';
        a += '<td><img id="prevslide" class="bars" alt="Slide anterior" title="Slide anterior" src="images/prev.png"></td>'
    }
    var c = RIOxmlSync.getElementsByTagName("slide").length;
    a += "<td><em>" + (RIOcurrent_slide < 10 ? "0" + RIOcurrent_slide : RIOcurrent_slide) + " / " + (c < 10 ? "0" + c : c) + "</em></td>";
    if (RIOcurrent_slide != RIOxmlSync.getElementsByTagName("slide").length) {
        a += '<td><img id="nextslide" class="bars" alt="Próximo slide" title="Próximo slide" onclick="RIOchangeSlide(\'NEXT\');" src="images/next.png"></td>';
        a += '<td><img id="lastslide" class="bars" alt="Último slide" title="Último slide" onclick="RIOchangeSlide(\'LAST\');" src="images/last.png"></td>'
    } else {
        a += '<td><img id="nextslide" class="bars" alt="Próximo slide" title="Próximo slide" src="images/next.png"></td>';
        a += '<td><img id="lastslide" class="bars" alt="Último slide" title="Último slide" src="images/last.png"></td>'
    }
    a += "</tr></table>";
    b.innerHTML = a
}

function RIOalternateVideoSlide() {
    var a;
    var b;
    RIOdebug("RIOalternateVideoSlide: Alternate");
    if (videoSlidePos == 0) {
        videoSlidePos = 1;
        a = "divvideo";
        b = "RIOslides"
    } else {
        videoSlidePos = 0;
        a = "RIOslides";
        b = "divvideo"
    }
    if (window.innerWidth > window.innerHeight) {
        document.getElementById(a).style.top = "7%";
        document.getElementById(a).style.left = "34%";
        document.getElementById(a).style.height = "86%";
        document.getElementById(a).style.width = "66%";
        document.getElementById(b).style.top = "7%";
        document.getElementById(b).style.left = "0%";
        document.getElementById(b).style.height = "40%";
        document.getElementById(b).style.width = "34%"
    } else {
        document.getElementById(a).style.top = "47%";
        document.getElementById(a).style.left = "33%";
        document.getElementById(a).style.height = "46%";
        document.getElementById(a).style.width = "67%";
        document.getElementById(b).style.top = "7%";
        document.getElementById(b).style.left = "0%";
        document.getElementById(b).style.height = "40%";
        document.getElementById(b).style.width = "100%"
    }
}

function RIOloadtoolBar() {
    RIOdebug("RIOloadtoolBar: Loading ToolBar slide=" + RIOcurrent_slide);
    var a = document.getElementById("RIOtoolBar");
    var b = '<table class="RIOtableSlideBar"><tr>';
    if (RIOsyncCheckBox) {
        b += '<td><em>Sincronizar</em><input id="sync" type="checkbox" name="sync" value="sync" onclick="RIOonSyncClick();" checked></td>'
    } else {
        b += '<td><em>Sincronizar</em><input id="sync" type="checkbox" name="sync" value="sync" onclick="RIOonSyncClick();"></td>'
    }
    b += "</tr></table>";
    a.innerHTML = b
}

function RIOonSyncClick() {
    RIOsyncCheckBox = document.getElementById("sync").checked;
    RIOdebug("RIOonSyncClick: Sync=" + RIOsyncCheckBox);
    RIObuildStatusLogMsg("SYNC")
}

function RIOloadSlide(a) {
    var b = a;
    RIOcurrent_slide = b + 1;
    RIOdebug("RIOloadSlide: local_i=" + b);
    RIOdebug("RIOloadSlide: loading slide=" + RIOcurrent_slide);
    for (j = 1; j <= RIOxmlSync.getElementsByTagName("slide").length; j++) {
        if (j != RIOcurrent_slide) {
            document.getElementById("slide" + j).className = "hide"
        }
    }
    document.getElementById("slide" + RIOcurrent_slide).className = "div.RIOslides";
    RIOcurrent_action = -1;
    RIOloadSlideBar();
    RIOloadtoolBar()
}

function RIOloadAction(currentTime) {
    var prev_RIOcurrent_slide = (RIOcurrent_slide != 0) ? (RIOcurrent_slide - 1) : 0;
    var slide_name = RIOxmlSync.getElementsByTagName("slide")[prev_RIOcurrent_slide].attributes.getNamedItem("relative_path").nodeValue;
    for (j = 0; j < RIOxmlSync.getElementsByTagName("slide")[prev_RIOcurrent_slide].getElementsByTagName("action").length; j++) {
        if ((RIOcurrent_action != j) && (currentTime >= RIOxmlSync.getElementsByTagName("slide")[prev_RIOcurrent_slide].getElementsByTagName("action")[j].attributes.getNamedItem("time").nodeValue) && ((j == (RIOxmlSync.getElementsByTagName("slide")[prev_RIOcurrent_slide].getElementsByTagName("action").length - 1)) || (currentTime < RIOxmlSync.getElementsByTagName("slide")[prev_RIOcurrent_slide].getElementsByTagName("action")[j + 1].attributes.getNamedItem("time").nodeValue))) {
            if (RIOlocalAccess == "true") {
                var action = 'document.getElementById("slide' + RIOcurrent_slide + '").contentWindow.execAction("' + RIOxmlSync.getElementsByTagName("slide")[prev_RIOcurrent_slide].getElementsByTagName("action")[j].childNodes[0].nodeValue + '")'
            } else {
                var action = 'document.getElementById("slide' + RIOcurrent_slide + '").contentWindow.postMessage("' + RIOxmlSync.getElementsByTagName("slide")[prev_RIOcurrent_slide].getElementsByTagName("action")[j].childNodes[0].nodeValue + '","' + RIOwebserver + '")'
            }
            eval(action);
            RIOcurrent_action = j;
            RIOdebug("RIOloadAction: slide=" + RIOcurrent_slide + " action=" + j)
        }
    }
}

function RIOloadSlides(a) {
    if (RIOsyncCheckBox) {
        for (i = 0; i < RIOxmlSync.getElementsByTagName("slide").length; i++) {
            if (i == (RIOxmlSync.getElementsByTagName("slide").length - 1)) {
                if (a >= RIOxmlSync.getElementsByTagName("slide")[i].attributes.getNamedItem("time").nodeValue) {
                    if (RIOcurrent_slide != (i + 1)) {
                        RIOloadSlide(i)
                    } else {
                        RIOloadAction(a)
                    }
                }
            } else {
                if ((a >= RIOxmlSync.getElementsByTagName("slide")[i].attributes.getNamedItem("time").nodeValue && a < RIOxmlSync.getElementsByTagName("slide")[i + 1].attributes.getNamedItem("time").nodeValue)) {
                    if (RIOcurrent_slide != (i + 1)) {
                        RIOloadSlide(i)
                    } else {
                        RIOloadAction(a)
                    }
                    break
                }
            }
        }
    }
}

function RIOupdateCurrentTopic(a) {
    for (i = 0; i < RIOxmlIndex.getElementsByTagName("ind_item").length; i++) {
        if (i == (RIOxmlIndex.getElementsByTagName("ind_item").length - 1)) {
            if (a > RIOxmlIndex.getElementsByTagName("ind_item")[i].getElementsByTagName("time")[0].childNodes[0].nodeValue && RIOcurrent_topic != (i + 1)) {
                document.getElementById("index" + RIOcurrent_topic).style.background = "#FFFFFF";
                RIOcurrent_topic = i + 1;
                document.getElementById("index" + RIOcurrent_topic).style.background = "#B6B6B4"
            }
        } else {
            if ((a >= RIOxmlIndex.getElementsByTagName("ind_item")[i].getElementsByTagName("time")[0].childNodes[0].nodeValue && a < RIOxmlIndex.getElementsByTagName("ind_item")[i + 1].getElementsByTagName("time")[0].childNodes[0].nodeValue) || a == 0) {
                if (RIOcurrent_topic != (i + 1)) {
                    if (RIOcurrent_topic == 0) {
                        document.getElementById("index1").style.background = "#FFFFFF"
                    } else {
                        document.getElementById("index" + RIOcurrent_topic).style.background = "#FFFFFF"
                    }
                    RIOcurrent_topic = i + 1;
                    document.getElementById("index" + RIOcurrent_topic).style.background = "#B6B6B4"
                }
                break
            }
        }
    }
}

function RIOinsertSlide(a) {
    RIOdebug("RIOinsertSlide: Load Slide=" + (a + 1));
    document.getElementById("slide" + (a + 1)).src = RIOloadUrl + RIOrelativeUrl + RIOxmlSync.getElementsByTagName("slide")[a].attributes.getNamedItem("relative_path").nodeValue
}

function RIObuildSlides() {
    var a;
    var b = "";
    RIOdebug("RIObuildSlides: Loading slides");
    for (i = 0; i < RIOxmlSync.getElementsByTagName("slide").length; i++) {
        RIOdebug("RIObuildSlides: Load Slide=" + (i + 1));
        a = RIOxmlSync.getElementsByTagName("slide")[i].attributes.getNamedItem("relative_path").nodeValue;
        b += '<iframe id="slide' + (i + 1) + '" src=""></iframe>'
    }
    RIOslidesElem.innerHTML += b
}

function RIOprefetchSlides() {
    var a = "";
    for (i = 0; i < RIOxmlSync.getElementsByTagName("slide").length; i++) {
        RIOdebug("RIOprefetchSlides: Prefetch Slide=" + (i + 1));
        a += '<link rel="prefetch" href="' + RIOrelativeUrl + RIOxmlSync.getElementsByTagName("slide")[i].attributes.getNamedItem("relative_path").nodeValue + '">';
        a += '<link rel="prerender" href="' + RIOrelativeUrl + RIOxmlSync.getElementsByTagName("slide")[i].attributes.getNamedItem("relative_path").nodeValue + '">'
    }
    document.getElementById("RIOhead").innerHTML += a
}

function RIOinit(d, f, g) {
    RIOdebugControl();
    if (g == "true") {
        RIOenableDebug()
    }
    RIOos = RIOsetOS();
    RIOsession_id = RIOgetDateTime();
    RIOdebug("RIOinit: O.S.=" + RIOos);
    RIOdebug("RIOinit: Browser=" + RIObrowser());
    RIOdebug("RIOinit: xmlfile=" + d);
    RIOslidesElem = document.getElementById("RIOslides");
    if (d.search("file:///") != -1) {
        RIOlocalAccess = "true";
        RIOloadUrl = "rioload.html?f=";
        RIOpwdXmlFile = d;
        RIOxmlfile = d
    } else {
        if (f == "false") {
            var c = RIOloadXMLDoc("serverredirect.rio", "false");
            RIOwebserver = c.getElementsByTagName("rioserverredirect")[0].childNodes[0].nodeValue
        } else {
            RIOwebserver = location.protocol + "//" + location.host
        }
        RIOxmlfile = RIOwebserver + "/riotransfer" + d;
        RIOpwdXmlFile = RIOxmlfile.substr(RIOxmlfile.indexOf("/riotransfer") + 12, RIOxmlfile.length);
        RIOloadUrl = RIOwebserver + "/rioload.html?f="
    }
    RIOrelativeUrl = RIOxmlfile.substr(0, RIOxmlfile.lastIndexOf("/")) + "/";
    RIOdebug("RIOinit: RIOlocalAccess=" + RIOlocalAccess);
    RIOdebug("RIOinit: RIOloadUrl=" + RIOloadUrl);
    RIOdebug("RIOinit: RIOpwdXmlFile=" + d);
    RIOdebug("RIOinit: RIOxmlfile=" + RIOxmlfile);
    RIOdebug("RIOinit: RIOwebserver=" + RIOwebserver);
    RIOdebug("RIOinit: RIOrelativeUrl=" + RIOrelativeUrl);
    RIOxmlDoc = RIOloadXMLDoc(RIOxmlfile, "false");
    try {
        RIOxmlTitle = RIOxmlDoc.getElementsByTagName("OBAA_Videoaula")[0].getElementsByTagName("general")[0].getElementsByTagName("title")[0].getElementsByTagName("string")[0].childNodes[0].nodeValue
    } catch (e) {
        RIOdebug("RIOinit: err=" + e.toString());
        xmlOldVersion = "true"
    }
    RIOdebug("RIOinit: xmlOldVersion=" + xmlOldVersion);
    if (xmlOldVersion == "false") {
        RIOxmlTitle = RIOxmlDoc.getElementsByTagName("OBAA_Videoaula")[0].getElementsByTagName("general")[0].getElementsByTagName("title")[0].getElementsByTagName("string")[0].childNodes[0].nodeValue;
        var b = RIOxmlDoc.getElementsByTagName("OBAA_Videoaula")[0].getElementsByTagName("lifecycle")[0].getElementsByTagName("contribute")[1].getElementsByTagName("entity")[0].childNodes[0].nodeValue;
        RIOxmlAuthor = b.substr(16, (b.length - 27));
        RIOxmlCourse = RIOxmlDoc.getElementsByTagName("OBAA_Videoaula")[0].getElementsByTagName("videoaula")[0].getElementsByTagName("educational")[0].getElementsByTagName("course")[0].getElementsByTagName("string")[0].childNodes[0].nodeValue;
        var a = 0;
        for (i = 0; i < RIOxmlDoc.getElementsByTagName("OBAA_Videoaula")[0].getElementsByTagName("videoaula")[0].getElementsByTagName("technical")[0].getElementsByTagName("relatedmedia").length; i++) {
            switch (RIOxmlDoc.getElementsByTagName("OBAA_Videoaula")[0].getElementsByTagName("videoaula")[0].getElementsByTagName("technical")[0].getElementsByTagName("relatedmedia")[i].getElementsByTagName("catalog")[0].childNodes[0].nodeValue) {
                case "index":
                    RIOindexFile = RIOrelativeUrl + RIOxmlDoc.getElementsByTagName("OBAA_Videoaula")[0].getElementsByTagName("videoaula")[0].getElementsByTagName("technical")[0].getElementsByTagName("relatedmedia")[i].getElementsByTagName("entry")[0].childNodes[0].nodeValue;
                    break;
                case "sync":
                    RIOsyncFile = RIOrelativeUrl + RIOxmlDoc.getElementsByTagName("OBAA_Videoaula")[0].getElementsByTagName("videoaula")[0].getElementsByTagName("technical")[0].getElementsByTagName("relatedmedia")[i].getElementsByTagName("entry")[0].childNodes[0].nodeValue;
                    break;
                case "video":
                    RIOvideoFile[a] = RIOrelativeUrl + RIOxmlDoc.getElementsByTagName("OBAA_Videoaula")[0].getElementsByTagName("videoaula")[0].getElementsByTagName("technical")[0].getElementsByTagName("relatedmedia")[i].getElementsByTagName("entry")[0].childNodes[0].nodeValue;
                    a++;
                    break
            }
        }
    } else {
        RIOxmlTitle = RIOxmlDoc.getElementsByTagName("rio_object")[0].getElementsByTagName("obj_title")[0].childNodes[0].nodeValue;
        RIOxmlAuthor = RIOxmlDoc.getElementsByTagName("rio_object")[0].getElementsByTagName("professor")[0].childNodes[0].nodeValue;
        RIOxmlCourse = RIOxmlDoc.getElementsByTagName("rio_object")[0].getElementsByTagName("course")[0].childNodes[0].nodeValue;
        var a = 0;
        for (i = 0; i < RIOxmlDoc.getElementsByTagName("rio_object")[0].getElementsByTagName("related_media")[0].getElementsByTagName("rm_item").length; i++) {
            switch (RIOxmlDoc.getElementsByTagName("rio_object")[0].getElementsByTagName("related_media")[0].getElementsByTagName("rm_item")[i].getElementsByTagName("rm_type")[0].childNodes[0].nodeValue) {
                case "index":
                    RIOindexFile = RIOrelativeUrl + RIOxmlDoc.getElementsByTagName("rio_object")[0].getElementsByTagName("related_media")[0].getElementsByTagName("rm_item")[i].getElementsByTagName("rm_filename")[0].childNodes[0].nodeValue;
                    break;
                case "sync":
                    RIOsyncFile = RIOrelativeUrl + RIOxmlDoc.getElementsByTagName("rio_object")[0].getElementsByTagName("related_media")[0].getElementsByTagName("rm_item")[i].getElementsByTagName("rm_filename")[0].childNodes[0].nodeValue;
                    break;
                case "video":
                    RIOvideoFile[a] = RIOrelativeUrl + RIOxmlDoc.getElementsByTagName("rio_object")[0].getElementsByTagName("related_media")[0].getElementsByTagName("rm_item")[i].getElementsByTagName("rm_filename")[0].childNodes[0].nodeValue;
                    a++;
                    break
            }
        }
    }
    RIOloadXmlFile();
    RIOxmlIndex = RIOloadXMLDoc(RIOindexFile, "false");
    RIOxmlSync = RIOloadXMLDoc(RIOsyncFile, "false");
    RIOloadSlideBar();
    RIOloadtoolBar();
    RIObuildSlides();
    for (i = 0; i < RIOxmlSync.getElementsByTagName("slide").length; i++) {
        RIOinsertSlide(i)
    }
    RIOloadIndex();
    RIOloadVideo();
    RIObuildSendLogStartMsg();
    setInterval(RIOstateMsg, 30000);
    setInterval(RIObufferVideoMsg, RIObufferVideoMsgInterval);
    window.onbeforeunload = function() {
        RIObuildStatusLogMsg("CLOSE")
    }
};