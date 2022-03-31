var checkboxes = document.querySelectorAll("input[type=checkbox][name=imgselect]");
let enabledSettings = [];

var downloadBar = document.getElementById("downloadbar");
var downloadBarText = document.getElementById("downloadbartxt");

checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
        enabledSettings = 
            Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
            .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
            .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.
        if (enabledSettings.length != 0) {
            if (downloadBar.classList.contains("hidden-passthrough")) {
                downloadBar.classList.remove("hidden-passthrough");
            }
            var num = enabledSettings.length;
            var downloadConfirmation = num > 1 ? "Download " + num + " images?" : "Download " + num + " image?";
            downloadBarText.innerText = downloadConfirmation;
            console.log(enabledSettings);
        } else {
            if (!downloadBar.classList.contains("hidden-passthrough")) {
                downloadBar.classList.add("hidden-passthrough");
            }
        }
    })
});