let app = {

    pages: null,
    list: [],
    reviewIndex: "",
    key: "verv0022",
    img: "",


    init: function () {
        if (window.hasOwnProperty("cordova")) {
            console.log("You're on a mobile device");
        }
        let isReady = (window.hasOwnProperty("cordova")) ? 'deviceready' : 'DOMContentLoaded';

        document.addEventListener(isReady, () => {
            app.pages = document.querySelectorAll('.page');
            app.pages[0].classList.add('active');

            app.pages.forEach(page => {
                page.querySelector('.nav').addEventListener('click', app.navigate);
            });

            let stars = document.querySelectorAll('.star');
            stars.forEach(function (star) {
                star.addEventListener('click', app.setRating);
            });

            let rating = parseInt(document.querySelector('.stars').getAttribute('data-rating'));
            let target = stars[rating - 1];
            target.dispatchEvent(new MouseEvent('click'));


        });
        document.getElementById('fabButton').addEventListener('click', app.takephoto);

        document.getElementById("saveButton").addEventListener("click", app.saveReview);
        document.getElementById("deleteButton").addEventListener("click", app.navigate);

        app.checkLocalStorage();
    },


    takephoto: function () {
        let options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            cameraDirection: Camera.Direction.BACK,
            quality: 100,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1920,
            targetHeight: 1080,
            correctOrientation: true

        };

        navigator.camera.getPicture(app.ftw, app.wtf, options)
    },


    checkLocalStorage: function () {
        let storage = localStorage.getItem(app.key);

        if (storage) {

            app.list = JSON.parse(storage);
            console.log(app.list, "list");
            app.list.forEach(item => {
                app.createReviewList(item);
            })
        } else {
            let container = document.getElementById("listDiv"),
                h1 = document.createElement("h1");

            h1.textContent = "No Reviews";
            h1.setAttribute("id", "noReviews")
            h1.style.textTransform = "uppercase";
            h1.style.margin = "50px 0px 0px 0px";

            container.appendChild(h1);
        }
    },


    createReviewList: function () {
        let unorderedList = document.getElementById("reviewList");

        unorderedList.innerHTML = "";

        unorderedList.style.listStyle = "none";

        let reviews = app.list,
            fragment = document.createDocumentFragment();

        reviews.forEach(function (list) {

            let reviewList = document.createElement("li"),
                reviewTitle = document.createElement("h1");

            reviewList.setAttribute("class", "reviewList");

            reviewTitle.setAttribute("class", "reviewTitle");
            reviewTitle.setAttribute("data-id", list.id);
            reviewTitle.textContent = list.title;
            reviewTitle.addEventListener("click", app.createDetails);
            reviewTitle.style.textAlign = "left";

            reviewList.appendChild(reviewTitle);
            fragment.appendChild(reviewList);
        });

        unorderedList.appendChild(fragment);
    },


    setRating: function (ev) {
        let span = ev.currentTarget;
        let stars = document.querySelectorAll('.star');
        let match = false;
        let num = 0;
        stars.forEach(function (star, index) {
            if (match) {
                star.classList.remove('rated');
            } else {
                star.classList.add('rated');
            }
            if (star === span) {
                match = true;
                num = index + 1;
            }
        });
        document.querySelector('.stars').setAttribute('data-rating', num);
    },


    createDetails: function (ev) {
        ev.preventDefault();
        let reviewId = ev.currentTarget.getAttribute("data-id"),
            list = app.list,
            reviewList = list.filter(function (list) {
                if (list.id == reviewId) {
                    return list;
                }
            });

        app.reviewIndex = reviewId;

        let detailsDiv = document.getElementById("detailsDiv"),
            reviewIMG = document.createElement("img"),
            reviewTitle = document.createElement("h1"),
            reviewRating = document.createElement("h1"),
            fragment = document.createDocumentFragment();

        detailsDiv.innerHTML = "";

        reviewIMG.setAttribute("class", "reviewIMG");
        reviewIMG.setAttribute("src", reviewList[0].img);
        reviewIMG.setAttribute("alt", reviewList[0].title);
        reviewIMG.setAttribute("width", "100%");
        reviewIMG.setAttribute("height", "500px");
        reviewIMG.setAttribute("data-id", list.id);

        reviewTitle.setAttribute("class", "reviewTitle");
        reviewTitle.textContent = reviewList[0].title;

        reviewRating.setAttribute("class", "reviewRating");
        reviewRating.textContent = reviewList[0].rating + "/5";

        fragment.appendChild(reviewIMG);
        fragment.appendChild(reviewTitle);
        fragment.appendChild(reviewRating);

        detailsDiv.appendChild(fragment);

        document.getElementById("homePage").classList.remove("active");
        document.getElementById("detailsPage").classList.add("active");

        document.getElementById("deleteButton").addEventListener("click", () => {
            app.deleteReview(reviewId);
        });
    },


    deleteReview: function (reviewId) {
        reviewList = app.list.filter(function (list) {

            if (list.id != reviewId) {
                return true;
            } else {
                let index = app.list.indexOf(list);
                listOfReviews = document.getElementById('reviewList');
                listOfReviews.removeChild(listOfReviews.children[index]);
            }
        });

        app.list = reviewList;
        localStorage.setItem(app.key, JSON.stringify(app.list));
        console.log(app.list);
    },


    saveReview: function (ev) {
        let title = document.getElementById('titleInput').value,
            rating = parseInt(document.querySelector('.stars').getAttribute('data-rating'));
        id = Date.now(),

            object = {
                id,
                title,
                rating,
                "img": app.img
            }

        app.list.push(object);

        localStorage.setItem(app.key, JSON.stringify(app.list));

        console.log(app.key)

        app.createReviewList();

        if (document.getElementById("noReviews")) {
            document.getElementById("noReviews").style.display = "none";
        }

        app.navigate(ev);
    },

    ftw: function (imgURI) {
        document.getElementById("photo").src = imgURI;

        app.img = imgURI;

        let inputDiv = document.getElementById("inputDiv");
        inputDiv.style.display = "flex";

        let photoCtrl = document.getElementById("photoCtrlDiv");
        photoCtrl.style.display = "flex";


    },


    wtf: function (msg) {
        document.getElementById("msg").textContent = msg;
    },


    navigate: function (ev) {
        ev.preventDefault();
        let tapped = ev.currentTarget;
        if (tapped.getAttribute("data-id")) {
            app.reviewIndex = tapped.getAttribute("data-id");
        }

        console.log(tapped);

        document.querySelector('.active').classList.remove('active');
        let target = tapped.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
    },
};


app.init();