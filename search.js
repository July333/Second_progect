//search
function mySearch(cId) {
    $("#loader").show();
    $.ajax({
        method: "GET",
        url: "https://api.coingecko.com/api/v3/coins/" + cId,
        dataType: "json",
        success: function (obj) {
            $("#loader").hide();
            let m;
            if (localStorage.getItem(cId)) {
                m = JSON.parse(localStorage.getItem(cId));
            }
            else {
                //cache
                m = new MyObj(cId, obj.image.small, obj.market_data.current_price.usd,
                    obj.market_data.current_price.eur, obj.market_data.current_price.ils);
                localStorage.setItem(cId, JSON.stringify(m));
                setTimeout(function () { localStorage.removeItem(cId) }, MIN * 1000);
            }
            $("#myMain").prepend(template);
            $("#myMain section:first-child").attr("data-id", obj.id);
            $("#myMain section:first-child").attr("id", "searchC");
            $("#myMain section:first-child .card-title").text(obj.symbol);
            $("#myMain section:first-child .card-subtitle").text(obj.id);
            let b = "section[data-id = '" + obj.id + "'] ";
            //more info
            $(b + ".myB").on('click', function () {
                if ($(b + ".infoM").is(':visible')) {
                    $(b + ".infoM").slideToggle();
                }
                else {
                    $(b + ".infoM .load .loader").hide();
                    $(b + ".infoM .mImg").attr("src", m.img);
                    $(b + ".infoM .p1").text(m.usd + "$");
                    $(b + ".infoM .p2").text(m.eur + '€');
                    $(b + ".infoM .p3").text(m.ils + '₪');
                    $(b + ".infoM").slideToggle();
                }
            });
            for (let i = 0; i < checkedCoins.length; i++) {
                if (checkedCoins[i].id == obj.id) {
                    $(b + ".myToggle input").prop('checked', true);
                }
            }
            $(b + ".myToggle .slider").on('click', function (e) {
                stopFn();
                if ($(b + ".myToggle input").is(':checked')) {//is already checked
                    //del
                    let p = $(this).parent().parent()[0];
                    let valueId = $(p).attr("data-id");
                    checkedCoins = checkedCoins.filter(function (value, index, arr) {
                        return value.id != valueId;
                    });
                }
                else {
                    checkedCoins.push(obj);
                    if (checkedCoins.length == 6) {
                        //more than 5
                        for (let i = 0; i < checkedCoins.length - 1; i++) {
                            $("#myModal .modal-dialog .modal-content .modal-body #c" + i + " .myToggle input").prop('checked', true);
                        }
                        fiveCoins();
                        $("#myModal").modal('toggle');
                    }
                    else { }
                }
            });
            $("#inp").val("");
        },
        error: function (jqXHR, textStatus) {
            $("#loader").hide();
            alert("Request faied: " + "there is no such Id ");
        }
    });
};