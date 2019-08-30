//variebles
var home = document.getElementById('home');
var liveR = document.getElementById('liveR');
var about = document.getElementById('about');
var myMain = document.getElementById('myMain');
var template;
var checkedCoins = [];
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
            //download coins
            for (let i = 0; i < 10; i++) {
                //for (i = 0; i < obj.length; i++) {
                changeCTemplate(template, obj[i]);
                $("#myMain section:last-child").attr("data-id", obj[i].id);
            }
            //events
            for (let i = 0; i < 10; i++) {
                //for (i = 0; i < obj.length; i++) {
                let b = "section[data-id = '" + obj[i].id + "'] ";
                //more info
                $(b + ".myB").on('click', function () {
                    if ($(b + ".infoM").is(':visible')) {
                        $(b + ".infoM").slideToggle();
                    }
                    else {
                        myDetailsTemplate(obj[i].id);
                    }
                });
                //graph
                $(b + ".myToggle .slider").on('click', function (e) {
                    console.log(checkedCoins);
                    checkedCoins.push(obj[i]);
                    if (checkedCoins.length == 6) {
                        console.log(checkedCoins);
                        //more than 5
                        for (let i = 0; i < checkedCoins.length - 1; i++) {
                            $("#myModal .modal-dialog .modal-content .modal-body #c" + i + " .myToggle input").prop('checked', true);
                        }
                        fiveCoins();
                        $("#myModal").modal('toggle');
                    }
                    else {
                    }

                });
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

/////////////////constructor
function MyObj(cId, img, usd, eur, ils) {
    this.cId = cId;
    this.img = img;
    this.usd = usd;
    this.eur = eur;
    this.ils = ils;
}
//Details template
function myDetailsTemplate(cId) {
    let a = "section[data-id = '" + cId + "'] ";
    $(a + ".infoM .load .loader").show();
    $.ajax({
        method: "GET",
        url: "https://api.coingecko.com/api/v3/coins/" + cId,
        dataType: "json",
        success: function (obj) {
            let m;
            if (localStorage.getItem(cId)) {
                m = JSON.parse(localStorage.getItem(cId));
            }
            else {
                //cache
                m = new MyObj(cId, obj.image.small, obj.market_data.current_price.usd,
                    obj.market_data.current_price.eur, obj.market_data.current_price.ils);
                localStorage.setItem(cId, JSON.stringify(m));
                setTimeout(function () { localStorage.removeItem(cId) }, 120 * 1000);
            }
            $(a + ".infoM .load .loader").hide();
            $(a + ".infoM .mImg").attr("src", m.img);
            $(a + ".infoM .p1").text(m.usd + "$");
            $(a + ".infoM .p2").text(m.eur + '€');
            $(a + ".infoM .p3").text(m.ils + '₪');
            $(a + ".infoM").slideToggle();
        },
        error: function (jqXHR, textStatus) {
            alert("Request faied: " + textStatus);
        }
    });
}
////
function fiveCoins() {
    console.log("fiveCoins");
    for (let i = 0; i < checkedCoins.length; i++) {
        let t = "#myModal .modal-dialog .modal-content .modal-body #c" + i;
        $(t + " h5").text(checkedCoins[i].id);
    }
    let sl="#myModal .modal-dialog .modal-content .modal-body .cn .myToggle .slider";
    $(sl).on('click', function () {
        let p = $(this).parent().parent()[0];
        let tp=p.id[1];
        ///deleteCoin
        console.log(checkedCoins);
        let a = "section[data-id = '" + checkedCoins[tp].id + "']";
        $(a + " .myToggle input").prop('checked', false);
        $("#myModal").modal('toggle');
        let c = checkedCoins.splice(tp, 1);
        $(sl).off('click');
    });
    $("#myModal").modal('toggle');
}
