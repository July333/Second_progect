//Draw graph
var chartInterval=-1;
function lifeReports() {
    var count = 10;
    let str = "";
    for (let i = 0; i < checkedCoins.length; i++) {
        str += checkedCoins[i].id + " ";
    }
    //let chartContainer = document.getElementById('chartContainer');
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
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries,
        },
        data: [],
    };
    $("#chartContainer").CanvasJSChart(options);
    let chart = $("#chartContainer").CanvasJSChart();
    for (let i = 0; i < checkedCoins.length; i++) {
        let coinObj = {
            type: "spline",
            name: " ",
            showInLegend: true,
            xValueFormatString: "DDD HH:mm:ss",
            yValueFormatString: "$#,##0.#",
            dataPoints: []
        }
        chart.options.data.push(coinObj);
    }
    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
    chartInterval = setInterval(() => {
        for (let i = 0; i < checkedCoins.length; i++) {
            $.getJSON("https://api.coingecko.com/api/v3/coins/" + checkedCoins[i].id, (d) => {
                let obj = {
                    x: new Date(),
                    y: d.market_data.current_price.usd
                }
                console.log(obj);
                chart.options.data[i].name=d.name;
                chart.options.data[i].dataPoints.push(obj);
                chart.render();
            })
            if (chart.options.data[i].dataPoints.length > count) {
                chart.options.data[i].dataPoints.shift();
            }
        }

    }, 2000);
}
function stopFn() {
    clearInterval(chartInterval);
  }