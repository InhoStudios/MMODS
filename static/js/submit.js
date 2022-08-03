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
        if (!otherImgField.classList.contains("hidden-passthrough")) {
            otherImgField.classList.add("hidden-passthrough");
            console.log("unchecked");
        }
    }
});

function addMsg(msg) {
    console.log(msg)
    const marker = document.getElementById("marker")
    var e = window.event;
    var posx = e.pageX - 8;
    var posy = e.pageY - 20;
    marker.classList.remove('hidden-passthrough')
    marker.style.left = posx + "px";
    marker.style.top = posy + "px";
    marker.style.zIndex = 1;
    console.log(posx);
    console.log(posy);
}