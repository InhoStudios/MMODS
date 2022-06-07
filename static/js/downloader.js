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