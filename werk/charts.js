// Use this later.
// var chartURL = 'https://quickchart.io/chart?bkg=white&c=';
// let donughtData = await getDonutChartParams(['Projects'], [0], 0);
// chartURL += donughtData;
// console.log('chartURL', chartURL);
async function getDonutChartParams(labels, data, total) {
  try {
    const urlEncodedJson = await JSON.stringify({
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
          },
        ],
      },
      options: {
        plugins: {
          doughnutlabel: {
            labels: [
              {
                text: total,
                font: {
                  size: 20,
                },
              },
              {
                text: 'Total',
              },
            ],
          },
        },
      },
    });
    console.log(urlEncodedJson);
    // return encodeURI(urlEncodedJson);
    return urlEncodedJson;
  } catch (error) {
    console.error(error);
  }
}
