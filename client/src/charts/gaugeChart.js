var GaugeChart = function(title, min, max, current, unit, container){
  var chart = new Highcharts.Chart( {

    chart: {
      type: 'solidgauge',
      renderTo: container,
    },

    title: null,

    pane: {
      center: ['50%', '85%'],
      size: '120%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }
    },

    tooltip: {
      enabled: false
    },

        // the value axis
        yAxis: {

          min: min,
          max: max,
          title: {
            text: title,
            style: {
              "fontSize": "18px"
            },
            y: -70
          },




          stops: [
                [0.1, '#DF5353'], // red
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#55BF3B'] // green
                ],
                lineWidth: 0,
                minorTickInterval: null,
                tickPixelInterval: 400,
                tickWidth: 0,
               
                labels: {
                  y: 16
                }
              },

              plotOptions: {
                solidgauge: {
                  dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                  }
                }
              },
            



            credits: {
              enabled: false
            },

            series: [{
              name: 'Speed',
              data: [current],
              dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color: white' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                '<span style="font-size:12px;color:silver">' + unit + '</span></div>'
              },
              tooltip: {
                valueSuffix: unit
              }
            }],

          })
}

module.exports = GaugeChart;
