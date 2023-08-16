var checkboxes = document.querySelectorAll("input[type=checkbox][name=imgselect]");
let imageList = [];

var downloadBar = document.getElementById("downloadbar");
var downloadBarText = document.getElementById("downloadbartxt");
var imgPassThrough = document.getElementById("filelist");

checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
        imageList = 
            Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
            .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
            .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.
        if (imageList.length != 0) {
            if (downloadBar.classList.contains("hidden-passthrough")) {
                downloadBar.classList.remove("hidden-passthrough");
            }
            var num = imageList.length;
            var downloadConfirmation = num > 1 ? "Download " + num + " images?" : "Download " + num + " image?";
            downloadBarText.innerText = downloadConfirmation;

            fillPassthrough(imageList);

            // console.log(imageList);
        } else {
            if (!downloadBar.classList.contains("hidden-passthrough")) {
                downloadBar.classList.add("hidden-passthrough");
            }
        }
    })
});

function fillPassthrough(imageList) {
    var passthroughString = ""
    imageList.forEach(function(idstr) {
        var id = idstr.split("-")[0];
        passthroughString = passthroughString + id + ";";
    });
    imgPassThrough.value = passthroughString;
    console.log(imgPassThrough.value);
}

// modal
function openOverlay(id) {
    document.getElementById(id).style.display = "block";
}

function closeOverlay(id) {
    document.getElementById(id).style.display = "none";
}

// hashchange for categories
window.addEventListener('hashchange', showCategories)

function showCategories() {
    let category = location.hash.substring(1)
    console.log(category)
    let cards = document.querySelectorAll('.entrycard')
    cards.forEach(function(card) {
        if (card.classList.contains(category)) {
            if (card.classList.contains('hidden-passthrough')){
                card.classList.remove('hidden-passthrough')
            }
        } else {
            if (!card.classList.contains('hidden-passthrough')){
                card.classList.add('hidden-passthrough')
            }
        }
    });
}