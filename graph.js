
function lifeReports() {
    var dps = []; // dataPoints
    let str = "";
    for (let i = 0; i < checkedCoins.length; i++) {
        str += checkedCoins[i].id + " ";
    }

    let chartContainer = document.getElementById('chartContainer');
    var options =  {
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: str + " to USD",
        },

        axisX: {
            title: "Time"
        },
        axisY: {
            title: "Coin Value",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC",
            includeZero: false
        },
        axisY2: {
            titleFontColor: "#C0504E",
            lineColor: "#C0504E",
            labelFontColor: "#C0504E",
            tickColor: "#C0504E",
            includeZero: false
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries,
        },
        data: dps,
    };
    $(chartContainer).CanvasJSChart(options);
    let chart = $(chartContainer).CanvasJSChart();
    setInterval(() => {
        for (let i = 0; i < checkedCoins.length; i++) {
            $.getJSON("https://api.coingecko.com/api/v3/coins/" + checkedCoins[i].id, (data) => {

                let obj = {
                    x:new Date().toLocaleTimeString(),
                    y:data.market_data.current_price.usd
                }
                console.log(obj);
                dps.push(obj);
                console.log(dps)
            })

        }
       
        chart.render();
    }, 2000);



    // var xVal = 0;
    // var yVal = 100; 
    // var updateInterval = 1000;
    // var dataLength = 20; // number of dataPoints visible at any point

    // var updateChart = function (count) {

    //     count = count || 1;

    //     for (var j = 0; j < count; j++) {
    //         yVal = yVal +  Math.round(5 + Math.random() *(-5-5));
    //         dps.push({
    //             x: xVal,
    //             y: yVal
    //         });
    //         xVal++;
    //     }

    //     if (dps.length > dataLength) {
    //         dps.shift();
    //     }

    //     chart.render();
    // };


}
function toggleDataSeries(e) {
	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	} else {
		e.dataSeries.visible = true;
	}
	e.chart.render();
}