//variebles
var home = document.getElementById('home');
var liveR = document.getElementById('liveR');
var about = document.getElementById('about');
var myMain = document.getElementById('myMain');
var template;

//listeners
home.addEventListener('click', function () {
    home.classList.add("active");
    liveR.classList.remove("active");
    about.classList.remove("active");
    myMain.innerHTML = "";
    myHomePage();
});
liveR.addEventListener('click', function () {
    home.classList.remove("active");
    liveR.classList.add("active");
    about.classList.remove("active");
    myMain.innerHTML = "";
});
about.addEventListener('click', function () {
    home.classList.remove("active");
    liveR.classList.remove("active");
    about.classList.add("active");
    myMain.innerHTML = "";
});
function templateCard() {
    $.ajax({
        method: "GET",
        url: "card.html",
        dataType: "html",
        success: function (t) {
            template = t;
        },
        error: function (jqXHR, textStatus) {
            alert("Request faied: " + textStatus);
        }
    });
}
///Api requests
function myHomePage() {
    templateCard();
    $.ajax({
        method: "GET",
        url: "https://api.coingecko.com/api/v3/coins/list",
        dataType: "json",
        success: function (obj) {
            for (i = 0; i < 10; i++) {
                //for (i = 0; i < obj.length; i++) {
                changeCTemplate(template, obj[i]);
            }
            console.log(myMain.childNodes);
            for (i = 0; i < 10; i++) {
                //for (i = 0; i < obj.length; i++) {
                myMain.childNodes[i].dataset.id = obj[i].id;
            }
            let cardList = document.getElementsByClassName("card");
            for (var i = 0; i < cardList.length; i++) {
                cardList[i].onclick = function () {
                    myDetailsTemplate(this.dataset.id);
                }
            }
        },
        error: function (jqXHR, textStatus) {
            alert("Request faied: " + textStatus);
        }
    });
}
//writinq html
function changeCTemplate(template, o) {
    template = template.replace('{{symbol}}', o.symbol);
    template = template.replace('{{id}}', o.id);
    myMain.innerHTML += template;
    console.log(template, o);
}
//Details template
function myDetailsTemplate(cId) {
    $.ajax({
        method: "GET",
        url: "https://api.coingecko.com/api/v3/coins/" + cId,
        dataType: "json",
        success: function (obj) {
            debugger;
            let t = `<div class="cardD">
        <img id="mImg" src="${obj.image.small}">
        <p>${obj.market_data.current_price.usd} $</p>
        <p>${obj.market_data.current_price.eur} €</p>
        <p>${obj.market_data.current_price.ils} ₪</p>
        </div>`;
            console.log(t);
        },
        error: function (jqXHR, textStatus) {
            alert("Request faied: " + textStatus);
        }
    });
}