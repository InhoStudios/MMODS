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
    siteField.value = anatomicSite;
    siteVal.value = index;
    try {
        var regionToOpen = document.getElementById(regionToOpen);
        var regionToClose = document.getElementById(regionToClose);
        regionToClose.classList.add("hidden-passthrough");
        if (regionToOpen.classList.contains("hidden-passthrough")) {
            regionToOpen.classList.remove("hidden-passthrough");
        }
        $('.map').maphilight();
    } catch(err) {
        console.log("region not found")
    }
    if (resetbtn.classList.contains("hidden-passthrough")) {
        resetbtn.classList.remove("hidden-passthrough");
    }
}

function resetMap() {
    siteField.value = "Choose anatomic site ↑";
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

function showBodyMap() {
    let element = document.getElementsByClassName("full-body-map")[0]
    let dropdown = document.getElementById("sitetext")
    let display = element.style.display;
    if (display == "none") {
        $('.map').maphilight();
        element.style.display = "block"
        dropdown.value = dropdown.value.replace("↓","↑")
    } else {
        element.style.display = "none"
        dropdown.value = dropdown.value.replace("↑","↓")
    }
}

function addImage() {
    let imageField = document.getElementById("imageuploads");
    let id = "asdfg";
    let imageUploadHTML = `<div id="${id}"> <div class="form-group mb-3 row"> <div class="col-lg-6"> <input type="file" class="form-control form-control-lg" id="imgUpload" name="filename" accept="image/*"> </div> <div class="col-lg-4"> <input type="button" class="form-control form-control-lg" id="sitetext" name="sitetext" value="Choose anatomic site ↓" onclick="showBodyMap()"> <input type="input" class="hidden-passthrough" id="anatomicsite" name="anatomicsite" value=""> </div> <div class="col-lg-2"> <input type="button" class="form-control form-control-lg btn btn-danger" id="remove" name="remove" value="✕" onclick="deleteField('${id}')"> </div> </div>`;
    imageUploadHTML += '<div class="form-group mb-3 row"> <div class="form-control-lg row"> <div class="col-lg-6"> <label>Image type</label> </div> <div class="col-lg-2"> <label for="clinical"> <input type="radio" class="form-check-input" id="clinical" name="imgtype" value="clinical"> Clinical </label> </div> <div class="col-lg-2"> <label for="dermoscopy"> <input type="radio" class="form-check-input" id="dermoscopy" name="imgtype" value="dermoscopy"> Dermoscopy </label> </div> <div class="col-lg-2"> <label for="other"> <input type="radio" class="form-check-input" id="other" name="imgtype" value="other"> Other </label> </div> </div> <div class="form-control-lg row"> <div class="col-lg-6 offset-lg-6"> <input type="input" class="form-control form-control-lg hidden-passthrough" id="otherimg" name="otherimg" placeholder="other"> </div> </div> </div> </div>';
    imageField.innerHTML += imageUploadHTML;
}

function deleteField(id) {
    let element = document.getElementById(id);
    element.remove();
}