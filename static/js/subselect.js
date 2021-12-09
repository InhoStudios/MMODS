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