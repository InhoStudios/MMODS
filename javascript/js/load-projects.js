let database;
let storageService;
let storageRef;
let category="";

function getHTML(){

    var img = "img/stock_img.jpg";
    var author = "NAME";
    var commentCount = " ";
    var title = "Lorem ipsum dolor sit amet elit";
    var desc = "Lorem ipsum dolor sit amet elit<br>Lorem ipsum dolor sit amet elit<br>Lorem ipsum dolor sit amet elit<br>Lorem ipsum dolor sit amet elit";
    var id;
    var url = "#";

    var format ="<div class='col-lg-3 col-md-3'>" +
        "<div class='media d-block media-custom text-left'>" +
        "<img src='" + img + "' class='crop-img img-fluid' style='opacity:25%'>" +
        "<div class='media-body'>" +
        "<span class='meta-post'>"+ author +"</span>" +
        "<h3 class='mt-0 text-black'><a href='#' class='text-black'>"+ title + "</a></h3>" +
        "<p>"+ desc + "</p>" +
        "<p class='clearfix'>" +
        "<a href='" + url + "' class='float-left'>Read more</a>" +
        "<a class='float-right meta-chat'>"+ commentCount +"</a>" +
        "</p>" +
        "</div>" +
        "</div>" +
        "</div>";

    return format;

}

// database reading and writing grrrr

function insertNewSubmission() {
    var html = "";
    var i = 0;
    while (i < 8){
        html = html + getHTML();
        i++;
    }
    console.log(getHTML());
    document.getElementById("submissions").innerHTML = html;
}

function loadShowcase() {
    initFirebase()

    var submissions = [];
    let webURLs = [];
    let sections = document.getElementsByClassName("showcase-div");

    database.collection("submissions").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var submission = {};
            submission.key = doc.id;
            submission.fname1 = doc.data().first_name1;
            submission.lname1 = doc.data().last_name1;
            submission.email1 = doc.data().email1;
            submission.grade1 = doc.data().grade_1;
            submission.fname2 = doc.data().first_name2;
            submission.lname2 = doc.data().last_name2;
            submission.email2 = doc.data().email2;
            submission.grade2 = doc.data().grade_2;
            submission.school = doc.data().school;
            submission.country = doc.data().country;
            submission.title = doc.data().title;
            submission.category = doc.data().category;
            submission.abstract = doc.data().abstract;
            submission.youtube_link = doc.data().youtube_link;
            submission.linkedin = doc.data().linkedin;
            submission.website = doc.data().website;
            submissions.push(submission);
        });
    }).then(function () {

        for(let index = 0; index < sections.length; index++) {

            section = sections[index]

            let submissionSection = document.getElementById(section.id);
            submissionSection.innerHTML = "";
            let totalHTML = "";

            var disp = 1;

            for (let i = 0; i < submissions.length; i++) {
                var submission = submissions[i];
                if(submission.category === section.id){
                    console.log(submission.key);

                    var img = "img/stock_img.jpg";
                    var author = "Andy Zhao";
                    var country = "United States";
                    var title = "Lorem ipsum dolor sit amet elit";
                    var desc = "abc";
                    var id = submission.key;
                    var link = "#";

                    author = submission.fname1 + " " + submission.lname1;
                    if (submission.fname2 != "" && submission.lname2 != "") {
                        author += " + " + submission.fname2 + " " + submission.lname2;
                    }

                    school = submission.school;

                    title = submission.title;
                    desc = submission.abstract;
                    country = submission.country;

                    if (desc.length > 75) {
                        desc = desc.substring(0, 50);
                        desc = desc + "...";
                    }

                    link = "work.html?id=" + id;

                    var format = "<div class='col-lg-3 col-md-3'>" +
                        "<div class='media d-block media-custom text-left'>" +
                        "<img src='" + img + "' class='img-fluid crop-img' id='" + submission.key + "IMG'>" +
                        "<div class='media-body'>" +
                        "<span class='meta-post mb-2'>" + author +"<br>" + school +"</span>" +
                        "<h3 class='mt-2 text-black'><a href='#' class='text-black'>" + title + "</a></h3>" +
                        "<p>" + desc + "</p>" +
                        "<p class='clearfix'>" +
                        "<a href='" + link + "' class='float-left'>Read more</a>" +
                        "<a class='float-right meta-chat'>" + country + "</a>" +
                        "</p>" +
                        "</div>" +
                        "</div>" +
                        "</div>";

                    submissionSection.innerHTML += format;

                    disp++;

                    if(disp > 4) break;

                }
            }
        }

    }).then(function() {

        for(let i = 0; i < submissions.length; i++) {
            var submission = submissions[i];
            var webURL;

            var spaceRef = storageRef.child('/' + submission.key + "/coverimg");
            spaceRef.getDownloadURL().then( function(url) {
                console.log("Image added to " + submission.key + " with URL " + url);
                if(url !== undefined){
                    webURLs[i] = url;
                }

            }).then(function () {
                for(let i = 0; i < submissions.length; i++) {
                    var imgElement = document.getElementById(submissions[i].key + "IMG");
                    if(imgElement !== null){
                        if(webURLs[i] === undefined) {
                            imgElement.src = "img/stock_img.jpg";
                        } else {
                            imgElement.src = webURLs[i];
                        }
                    }
                }
            });
        }
    });


}

function loadSubmissions() {
    initFirebase();

    queried = getQueryVariable("category");
    var submissions = [];
    let webURLs = [];

    database.collection("submissions").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var submission = {};
            submission.key = doc.id;
            submission.fname1 = doc.data().first_name1;
            submission.lname1 = doc.data().last_name1;
            submission.email1 = doc.data().email1;
            submission.grade1 = doc.data().grade_1;
            submission.fname2 = doc.data().first_name2;
            submission.lname2 = doc.data().last_name2;
            submission.email2 = doc.data().email2;
            submission.grade2 = doc.data().grade_2;
            submission.school = doc.data().school;
            submission.country = doc.data().country;
            submission.title = doc.data().title;
            submission.category = doc.data().category;
            submission.abstract = doc.data().abstract;
            submission.youtube_link = doc.data().youtube_link;
            submission.linkedin = doc.data().linkedin;
            submission.website = doc.data().website;
            submissions.push(submission);
        });
    }).then(function () {
            let submissionSection = document.getElementById("submissions");
            submissionSection.innerHTML = "";
            let totalHTML = "";

            for(let i = 0; i < submissions.length; i++) {
                var submission = submissions[i];
                if(queried){
                    console.log("queried");
                    console.log(queried)
                    if(submission.category !== queried){
                        continue;
                    }
                }
                console.log(submission.key);

                var img = "img/stock_img.jpg";
                var author = "Andy Zhao";
                var country = "United States";
                var title = "Lorem ipsum dolor sit amet elit";
                var desc = "abc";
                var id = submission.key;
                var link = "#";

                author = submission.fname1 + " " + submission.lname1;
                if(submission.fname2 != "" && submission.lname2 != "") {
                    author += " + " + submission.fname2 + " " + submission.lname2;
                }

                title = submission.title;
                desc = submission.abstract;
                country = submission.country;

                school = submission.school;

                if(desc.length > 90) {
                    desc = desc.substring(0, 90);
                    desc = desc + "...";
                }

                link = "work.html?id=" + id;

                var format ="<div class='col-lg-3 col-md-3 mb-3'>" +
                    "<div class='media d-block media-custom text-left'>" +
                    "<img src='" + img + "' class='img-fluid crop-img' id='" + submission.key + "IMG'>" +
                    "<div class='media-body'>" +
                    "<span class='meta-post mb-2'>"+ author +"<br>" + school +"</span>" +
                    "<h3 class='mt-2 text-black'><a href='#' class='text-black'>"+ title + "</a></h3>" +
                    "<p>"+ desc + "</p>" +
                    "<p class='clearfix'>" +
                    "<a href='" + link + "' class='float-left'>Read more</a>" +
                    "<a class='float-right meta-chat'>"+ country +"</a>" +
                    "</p>" +
                    "</div>" +
                    "</div>" +
                    "</div>";

                submissionSection.innerHTML += format;

            }

    }).then(function() {

        for(let i = 0; i < submissions.length; i++) {
            var submission = submissions[i];
            var webURL;

            var spaceRef = storageRef.child('/' + submission.key + "/coverimg");
            spaceRef.getDownloadURL().then( function(url) {
                console.log("Image added to " + submission.key + " with URL " + url);
                if(url !== undefined){
                    webURLs[i] = url;
                }

            }).then(function () {
                for(let i = 0; i < submissions.length; i++) {
                    var imgElement = document.getElementById(submissions[i].key + "IMG");
                    if(imgElement !== null){
                        if(webURLs[i] === undefined) {
                            imgElement.src = "img/stock_img.jpg";
                        } else {
                            imgElement.src = webURLs[i];
                        }
                    }
                }
            });
        }
    });


}

function initFirebase() {

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyBBXin346Rje84WSNDtj_YFyQj_hGLi56g",
        authDomain: "icd-explorer.firebaseapp.com",
        projectId: "icd-explorer",
        storageBucket: "icd-explorer.appspot.com",
        messagingSenderId: "523929532496",
        appId: "1:523929532496:web:9cee1a3d6b20fca8bb7955",
        measurementId: "G-N0TNR2EYX7"
    };
    
    // Initialize Firebase
    if(firebase.apps.length === 0){
        firebase.initializeApp(firebaseConfig);
    } else {
        console.log("firebase running");
    }
    firebase.analytics();

    database = firebase.firestore();
    storageService = firebase.storage();
    storageRef = storageService.ref();
}

let selectedFile;
let selectedPaper;
let headshot1;
let headshot2;
let consent1;
let consent2;
let extraIMG = [];
let extraFiles = [];

let maxImgSize = 10000000;

document.querySelector('#headshot1').addEventListener('change', function (e) {
    headshot1 = e.target.files[0];

    if(headshot1.size > maxImgSize) {
		swal({
		  title: "Image Size Invalid",
		  text: "Image is too large, please upload less than 10MB",
		  icon: "warning",
		});
    } else {
        document.getElementById("hs1").innerText = headshot1.name;
    }
});
document.querySelector('#headshot2').addEventListener('change', function (e) {
    headshot2 = e.target.files[0];

    if(headshot2.size > maxImgSize) {
		swal({
		  title: "Image Size Invalid",
		  text: "Image is too large, please upload less than 10MB",
		  icon: "warning",
		});
    } else {
        document.getElementById("hs2").innerText = headshot2.name;
    }
});
document.querySelector('#consent1').addEventListener('change', function (e) {
    consent1 = e.target.files[0];

    if(consent1.size > maxImgSize) {
		swal({
		  title: "File Size Invalid",
		  text: "File is too large, please upload less than 10MB",
		  icon: "warning",
		});
    } else {
        document.getElementById("cs1").innerText = consent1.name;
    }
});
document.querySelector('#consent2').addEventListener('change', function (e) {
    consent2 = e.target.files[0];

    if(consent2.size > maxImgSize) {
		swal({
		  title: "File Size Invalid",
		  text: "File is too large, please upload less than 10MB",
		  icon: "warning",
		});
    } else {
        document.getElementById("cs2").innerText = consent2.name;
    }
});
document.querySelector('#thumbnail').addEventListener('change', function (e) {
    selectedFile = e.target.files[0];

    if(selectedFile.size > maxImgSize) {
		swal({
		  title: "Image Size Invalid",
		  text: "Image is too large, please upload less than 10MB",
		  icon: "warning",
		});
    } else {
        document.getElementById("thumbnail-file-name").innerText = selectedFile.name;
    }
});
document.querySelector('#paper').addEventListener('change', function (e) {
    selectedPaper = e.target.files[0];

    if(selectedPaper.size > maxImgSize) {
		swal({
		  title: "File Size Invalid",
		  text: "File is too large, please upload less than 10MB",
		  icon: "warning",
		});
    } else {
        document.getElementById("paper-file-name").innerText = selectedPaper.name;
    }
});

let totalImgSize = 50000000;
let totalFileSize = 50000000;

let addedImg = "";
document.querySelector('#extraimg').addEventListener('change', function (e) {
    var netFileSize = 0;
    var changeName = true;
    for(var i = 0; i < e.target.files.length; i++) {
        console.log(e.target.files[i]);
        extraIMG.push(e.target.files[i]);
        addedImg += e.target.files[i].name;
        console.log(addedImg);

        netFileSize += e.target.files[i].size;

        if(netFileSize > totalImgSize) {
            extraIMG = [];
			swal({
			  title: "Image Size Invalid",
			  text: "Images are too large, please upload less than 50MB",
			  icon: "warning",
			});
            changeName = false;
            addedImg = "";
            break;
        }

        if(i < e.target.files.length - 1) {
            addedImg += ", "
        }
        if(i >= 6) break;
        if(extraIMG.length >= 7) break;

    }
    addedImg = addedImg + ", ";
    if(changeName) {
		document.getElementById("img-files").style.fontSize = "9px";
		document.getElementById("img-files").innerHTML = addedImg;
	}
});
let addedFiles = "";
document.querySelector('#extradoc').addEventListener('change', function(e) {
    var netFileSize = 0;
    var changeName = true;
    for(var i = 0; i < e.target.files.length; i++) {
        console.log(e.target.files[i]);
        extraFiles.push(e.target.files[i]);
        addedFiles += e.target.files[i].name;
        console.log(addedFiles);

        netFileSize += e.target.files[i].size;

        if(netFileSize > totalFileSize) {
            extraFiles = [];
			swal({
			  title: "File Size Invalid",
			  text: "Files are too large, please upload less than 50MB",
			  icon: "warning",
			});
            changeName = false;
            addedFiles = "";
            break;
        }

        if(i < e.target.files.length - 1) {
            addedFiles += ", "
        }
        if(i >= 6) break;
        if(extraFiles.length >= 7) break;
    }
    addedFiles = addedFiles + ", ";
    if(changeName) {
		document.getElementById("supp-files").style.fontSize = "9px";
		document.getElementById("supp-files").innerHTML = addedFiles;
	}
});


function chooseCategory(cat){
    category = cat;
    tech = document.getElementById("TECH");
    tech.style.backgroundColor = "rgba(0,0,0,0)";

    bio = document.getElementById("BIO");
    bio.style.backgroundColor = "rgba(0,0,0,0)";

    enviro = document.getElementById("ENVIRO");
    enviro.style.backgroundColor = "rgba(0,0,0,0)";

    phys = document.getElementById("PHYS");
    phys.style.backgroundColor = "rgba(0,0,0,0)";

    catElem = document.getElementById(cat);
    catElem.style.backgroundColor = "rgba(51, 161, 255, 0.3)";
    catElem = document.getElementById(cat + "IMG");

    console.log(category)
    cat = "";
}

function checkAllUploadConfirm(){
    //display success screen
    //reload page

}

function writeSubmission() {


        // show popup that just says "hey wait we're uploading your project"

        // database.collection("submissions").get().then((querySnapshot) => {
        //     querySnapshot.forEach((doc) => {
        //         console.log('${doc.id} => ${doc.data()}');
        //     });
        // });

        var fname1 = document.getElementById("fname1").value;
        var lname1 = document.getElementById("lname1").value;
        var email1 = document.getElementById("email1").value;
        var grade1 = document.getElementById("grade1").value;

        var fname2 = document.getElementById("fname2").value;
        var lname2 = document.getElementById("lname2").value;
        var email2 = document.getElementById("email2").value;
        var grade2 = document.getElementById("grade2").value;

        var school1 = document.getElementById("school1").value;
        var school2 = document.getElementById("school2").value;

        var address1 = document.getElementById("address1").value;
        var address2 = document.getElementById("address2").value;

        var postal1 = document.getElementById("postal1").value;
        var postal2 = document.getElementById("postal2").value;

        var country1 = document.getElementById("country1").value;
        var country2 = document.getElementById("country2").value;
		
        var title = document.getElementById("title").value;
        var cat = category;

        var abstract = document.getElementById("abstract").value;
        var youtube = document.getElementById("video").value;

        var eng = document.getElementById("English").checked;
        var fr = document.getElementById("French").checked;
        var es = document.getElementById("Spanish").checked;

        var Flammable = document.getElementById("Flammable").checked;
        var PHBAs = document.getElementById("PHBAs").checked;
        var Electrical = document.getElementById("Electrical").checked;
        var Firearms = document.getElementById("Firearms").checked;
        var X_ray = document.getElementById("X-ray").checked;
        var Animals = document.getElementById("Animals").checked;
        var Microorganisms = document.getElementById("Microorganisms").checked;

        var nokia = document.getElementById("nokia").checked;
        var patent = document.getElementById("patent").checked;
        var shad = document.getElementById("shad").checked;
        var forum = document.getElementById("forum").checked;
        var wisest = document.getElementById("wisest").checked;
        var western = document.getElementById("western").checked;
        var stem_fellowship = document.getElementById("stem-fellowship").checked;

        var linkedin1 = document.getElementById("linkedin1").value;
        var website1 = document.getElementById("website1").value;
        var linkedin2 = document.getElementById("linkedin2").value;
        var website2 = document.getElementById("website2").value;

        var authentic = document.getElementById("authentic").checked;
        var originality = document.getElementById("originality").checked;
        var writeID = Date.now() + title;

        hsUpload1 = false;
        hsUpload2 = false;
        csUpload1 = false;
        csUpload2 = false;
        tnUpload = false;
        paperUpload = false;
        suppUpload = false;
        imgUpload = false;


        if(fname2 === "") {
            hsUpload2 = true;
            csUpload2 = true;
        }

        if (fname1 === "") {
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have entered in your first name!",
			  icon: "error",
			});
		} else if (lname1 === "") {
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have entered in your last name!",
			  icon: "error",
			});
		} else if (email1 === "") {
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have entered in your email!",
			  icon: "error",
			});
		} else if (grade1 === "") {
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have entered in your grade!",
			  icon: "error",
			});
		} else if (school1 === "") {
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have entered in your educational institution!",
			  icon: "error",
			});
		} else if (address1 === "") {
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have entered in your address!",
			  icon: "error",
			});
		} else if (postal1 === "") {
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have entered in your postal code!",
			  icon: "error",
			});
		} else if (country1 === "") {
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have selected your country!",
			  icon: "error",
			});
		} else if (!headshot1) {
			
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have uploaded a headshot!",
			  icon: "error",
			});
        } else if (!consent1) {
			
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have uploaded the signed consent form!",
			  icon: "error",
			});
        } else if ((fname2 !== "") && (lname2 === "" || email2 === "" || grade2 === "" || school2 === "" || address2 === "" || postal2 === "" || country2 === "" || !headshot2 || !consent2)) {
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure to fill out all of your partner's information!",
			  icon: "error",
			});
        } else if (title === "") {
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have entered in your project title!",
			  icon: "error",
			});
		} else if (cat === "") {
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have selected your project category!",
			  icon: "error",
			});
		} else if (!selectedFile) {
			
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have uploaded a cover image!",
			  icon: "error",
			});
        } else if (abstract === "") {
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have entered in your project abstract!",
			  icon: "error",
			});
		} else if (!selectedPaper) {
			
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have uploaded your project report!",
			  icon: "error",
			});
        } else if (youtube === "") {
			swal({
			  title: "Form Incomplete!",
			  text: "Please make sure you have provided a youtube link to your project video presentation!",
			  icon: "error",
			});
		} else if (!authentic) {
			swal({
			  title: "Form Incomplete!",
			  text: "Please make confirm that you abide with our ethics & due care notice!",
			  icon: "error",
			});
		} else if (!originality) {
			
			swal({
			  title: "Form Incomplete!",
			  text: "Please confirm that the work submitted is your own!",
			  icon: "error",
			});
        } else {

            //var submission = database.collection("submissions").doc(submissionCount);

            database.collection("submissions").doc(writeID).set({
                first_name1: fname1,
                last_name1: lname1,
                grade_1: grade1,
                email1: email1,
                school1: school1,
                address1: address1,
                postal1: postal1,
                country1: country1,

                first_name2: fname2,
                last_name2: lname2,
                grade_2: grade2,
                email2: email2,
                school2: school2,
                address2: address2,
                postal2: postal2,
                country2: country2,
				
				eng: eng,
				fr: fr,
				es: es,

                title: title,
                category: cat,
                abstract: abstract,
                youtube_link: youtube,

                flammable: Flammable,
                phbas: PHBAs,
                electrical: Electrical,
                firearms: Firearms,
                xray: X_ray,
                animals: Animals,
                microorganisms: Microorganisms,

                linkedin: linkedin1,
                website: website1,
                linkedin2: linkedin2,
                website2: website2,

                nokia: nokia,
                patent: patent,
				shad: shad,
                forum: forum,
                wisest: wisest,
                western: western,
                stem_fellowship: stem_fellowship
            })
                .then(function (docRef) {
					swal({
					  title: "Submitted Successfully!",
					  text: "Thank you for your application! Round 1 Judging will take place June 22-28.",
					  icon: "success",
					});
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                });

            if (selectedFile) {
                const uploadImageTask = storageRef.child('/' + writeID + '/coverimg').put(selectedFile);

                uploadImageTask.on('state_changed', (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById("thumbnail-file-name").innerText = progress + "%";
                }, (error) => {
					
                }, () => {
                    tnUpload = true;
                    console.log("tn");
                    if(csUpload1 && csUpload2 && paperUpload && tnUpload && hsUpload1 && imgUpload && suppUpload) {
						swal({
						  title: "Submitted Successfully!",
						  text: "Thank you for your application! Round 1 Judging will take place June 22-28.",
						  icon: "success",
						});
                        window.location.reload();
                    }
                });
            }
            if (selectedPaper) {
                const uploadPaperTask = storageRef.child('/' + writeID + '/paper').put(selectedPaper);

                uploadPaperTask.on('state_changed', (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById("paper-file-name").innerText = progress + "%";

                }, (error) => {

                }, () => {
                    paperUpload = true;
                    console.log("pap");
                    if(csUpload1 && csUpload2 && paperUpload && tnUpload && hsUpload1 && imgUpload && suppUpload) {
						swal({
						  title: "Submitted Successfully!",
						  text: "Thank you for your application! Round 1 Judging will take place June 22-28.",
						  icon: "success",
						});
                        window.location.reload();
                    }
                });
            }
            if (headshot1) {
                const uploadImageTask = storageRef.child('/' + writeID + '/hs1').put(headshot1);

                uploadImageTask.on('state_changed', (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById("hs1").innerText = progress + "%";

                }, (error) => {
					
                }, () => {
                    hsUpload1 = true;
                    console.log("hs1");
                    if(csUpload1 && csUpload2 && paperUpload && tnUpload && hsUpload1 && imgUpload && suppUpload) {
						swal({
						  title: "Submitted Successfully!",
						  text: "Thank you for your application! Round 1 Judging will take place June 22-28.",
						  icon: "success",
						});
                        window.location.reload();
                    }
                });
            }
            if (headshot2) {
                const uploadPaperTask = storageRef.child('/' + writeID + '/hs2').put(headshot2);

                uploadPaperTask.on('state_changed', (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById("hs2").innerText = progress + "%";

                }, (error) => {

                }, () => {
                    hsUpload2 = true;
                    console.log("hs2");
                    if(csUpload1 && csUpload2 && paperUpload && tnUpload && hsUpload1 && imgUpload && suppUpload) {
						swal({
						  title: "Submitted Successfully!",
						  text: "Thank you for your application! Round 1 Judging will take place June 22-28.",
						  icon: "success",
						});
                        window.location.reload();
                    }
                });
            }
            if (consent1) {
                const uploadImageTask = storageRef.child('/' + writeID + '/cs1').put(consent1);

                uploadImageTask.on('state_changed', (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById("cs1").innerText = progress + "%";

                }, (error) => {
					
                }, () => {
                    csUpload1 = true;
                    console.log("cs1");
                    if(csUpload1 && csUpload2 && paperUpload && tnUpload && hsUpload1 && imgUpload && suppUpload) {
                        swal({
						  title: "Submitted Successfully!",
						  text: "Thank you for your application! Round 1 Judging will take place June 22-28.",
						  icon: "success",
						});
                        window.location.reload();
                    }
                });
            }
            if (consent2) {
                const uploadPaperTask = storageRef.child('/' + writeID + '/cs2').put(consent2);

                uploadPaperTask.on('state_changed', (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById("cs2").innerText = progress + "%";

                }, (error) => {

                }, () => {
                    csUpload2 = true;
                    console.log("cs2");
                    if(csUpload1 && csUpload2 && paperUpload && tnUpload && hsUpload1 && imgUpload && suppUpload) {
                        swal({
						  title: "Submitted Successfully!",
						  text: "Thank you for your application! Round 1 Judging will take place June 22-28.",
						  icon: "success",
						});
                        window.location.reload();
                    }
                });
            }
            console.log(extraIMG.length);
            var totImg = extraIMG.length;
            for (var i = 0; i < extraIMG.length; i++) {
                const uploadImagesTask = storageRef.child('/' + writeID + '/suppImages/' + extraIMG[i]['name']).put(extraIMG[i]);

                uploadImagesTask.on('state_changed', (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById("img-files").innerText = progress + "%";
                }, (error) => {

                }, () => {
                    totImg--;
                    if(totImg <= 0) {
                        imgUpload = true;
                        console.log("img");
                        if(csUpload1 && csUpload2 && paperUpload && tnUpload && hsUpload1 && imgUpload && suppUpload) {
                            swal({
							  title: "Submitted Successfully!",
							  text: "Thank you for your application! Round 1 Judging will take place June 22-28.",
							  icon: "success",
							});
                            window.location.reload();
                        }
                    }
                });
            }
            console.log(extraFiles.length);
            var totFiles = extraFiles.length;
            for (var i = 0; i < extraFiles.length; i++) {
                const uploadFilesTask = storageRef.child('/' + writeID + '/suppFiles/' + extraFiles[i]['name']).put(extraFiles[i]);

                uploadFilesTask.on('state_changed', (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById("supp-files").innerText = progress + "%";
                }, (error) => {

                }, () => {
                    totFiles--;
                    if(totFiles <= 0) {
                        suppUpload = true;
                        console.log("supp");
                        if(csUpload1 && csUpload2 && paperUpload && tnUpload && hsUpload1 && imgUpload && suppUpload) {
                            swal({
							  title: "Submitted Successfully!",
							  text: "Thank you for your application! Round 1 Judging will take place June 22-28.",
							  icon: "success",
							});
                            window.location.reload();
                        }
                    }
                });
            }

            //blah code

        }

}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}