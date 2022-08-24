diagSelect = document.getElementById("results");

diagSelect.onchange = function (e) {
    var selectedOption = this[this.selectedIndex];
    var selectedText = selectedOption.value;
    uriField = document.getElementById("uri");
    uriField.value = "/icd/entity/" + selectedText;
}

window.onload = function() {
    var selectedOption = diagSelect[diagSelect.selectedIndex];
    var selectedText = selectedOption.value;
    uriField = document.getElementById("uri")
    if (selectedText != "null") {
        uriField.value = "/icd/entity/" + selectedText;
    }
}

let imgOtherType = document.getElementById("other");
let otherImgField = document.getElementById("otherimg");

imgOtherType.addEventListener('change', function() {
    if(imgOtherType.checked) {
        if (otherImgField.classList.contains("hidden-passthrough")) {
            otherImgField.classList.remove("hidden-passthrough");
            console.log("checked");
        }
    } else {
        otherImgField.classList.add("hidden-passthrough");
        console.log("unchecked");
    }
});

let siteField = document.getElementById("sitetext")
let siteVal = document.getElementById("anatomicsite")
let map = document.getElementById("tier-1-body")
let resetbtn = document.getElementById("resetbtn")

function openRegion(regionToClose, regionToOpen, anatomicSite, index) {
    var regionToOpen = document.getElementById(regionToOpen);
    var regionToClose = document.getElementById(regionToClose);
    regionToClose.classList.add("hidden-passthrough");
    if (regionToOpen.classList.contains("hidden-passthrough")) {
        regionToOpen.classList.remove("hidden-passthrough");
    }
    $('.map').maphilight();
    siteField.value = anatomicSite;
    siteVal.value = index;

    if (resetbtn.classList.contains("hidden-passthrough")) {
        resetbtn.classList.remove("hidden-passthrough");
    }
}

function resetMap() {
    siteField.value = "Choose anatomic site below";
    siteVal.value = -1;
    maps = document.getElementsByTagName("map");
    console.log(maps)
    for (var i = 0; i < maps.length; i++) {
        var elem = document.getElementById(maps[i].id);
        if (!elem.classList.contains("hidden-passthrough")) {
            elem.classList.add("hidden-passthrough");
        }
    }
    if (map.classList.contains("hidden-passthrough")) {
        map.classList.remove("hidden-passthrough");
        $('.map').maphilight();
    }
    resetbtn.classList.add("hidden-passthrough");
}

function addMsg(event, msg, index) {
    let sites_text = siteField.value + ", ";
    let sites_value = siteVal.value + ".";
    if (!event.shiftKey){
        sites_text = ""
        sites_value = ""
        var previous_markers = document.getElementsByClassName("marker")
        for (var i = previous_markers.length; i > 0; i--) {
            previous_markers.item(i - 1).remove();
        }
    }
    sites_text = sites_text + msg;
    sites_value = sites_value + index.toString();
    const marker = document.createElement("p");
    const node = document.createTextNode("X");
    marker.appendChild(node);
    marker.classList.add("marker")

    const marker_div = document.getElementById("markers")
    marker_div.appendChild(marker)

    var e = window.event;
    var posx = e.pageX - 8;
    var posy = e.pageY - 20;
    marker.style.left = posx + "px";
    marker.style.top = posy + "px";
    marker.style.zIndex = 1;
    console.log(posx);
    console.log(posy);
    siteField.value = sites_text;
    siteVal.value = sites_value;
}