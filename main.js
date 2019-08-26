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
//Templates
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
    $("#loader").show();
    templateCard();
    $.ajax({
        method: "GET",
        url: "https://api.coingecko.com/api/v3/coins/list",
        dataType: "json",
        success: function (obj) {
            $("#loader").hide();
            for (let i = 0; i < 200; i++) {
                //for (i = 0; i < obj.length; i++) {
                changeCTemplate(template, obj[i]);
                $("#myMain section:last-child").attr("data-id", obj[i].id);
            }
            let cardList = document.getElementsByClassName("card");
            for (let i = 0; i < cardList.length; i++) {
                cardList[i].onclick = function () {
                    myDetailsTemplate(obj[i].id);
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
    let temp = template;
    temp = temp.replace('{{symbol}}', o.symbol);
    temp = temp.replace('{{id}}', o.id);
    myMain.innerHTML += temp;
}
//Details template
function myDetailsTemplate(cId) {
    let a="section[data-id = '" + cId +"'] ";
    $(a+".infoM .load .loader").show();
    $.ajax({
        method: "GET",
        url: "https://api.coingecko.com/api/v3/coins/" + cId,
        dataType: "json",
        success: function (obj) {
            $(a+".infoM .load .loader").hide();
            //let a="section[data-id = '" + cId +"'] ";
            $(a+".infoM .mImg").attr("src",obj.image.small);
            $(a+".infoM .p1").text(obj.market_data.current_price.usd+"$");
            $(a+".infoM .p2").text(obj.market_data.current_price.eur+'€');
            $(a+".infoM .p3").text(obj.market_data.current_price.ils+'₪');
            $(a+".infoM").slideToggle();
        },
        error: function (jqXHR, textStatus) {
            alert("Request faied: " + textStatus);
        }
    });
}

////