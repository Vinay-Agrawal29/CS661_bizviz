d3.csv("./data/downsampled_zomato.csv").then(function (json_data) {
  var json = {};
  json_data.forEach(function (d) {
    Object.keys(d).forEach(function (key) {
      if (!json[key]) {
        json[key] = [];
      }
      json[key].push(d[key]);
    });
  });

  let fix_cuisine = "northindian"; // should be variable.. hardcoded now.
  let fix_rate = 3.5; // should be variable.. hardcoded now.
  let targetArray = [];
  let count = 0;
  for (let i = 0; i < json["cuisines"].length; i++) {
    if (json["menu_item"][i] == []) {
      count += 1;
    }
    let list_cuisine = json["cuisines"][i].split(",");

    let cuisineExist = list_cuisine.some((cuisine) => {
      const cleanedCuisine = cuisine.toLowerCase().replace(/\s+/g, "");
      return cleanedCuisine == fix_cuisine;
    });

    if (cuisineExist) {
      //   console.log(json["rate"][i]);
      // console.log(i);
      if (parseFloat(json["rate"][i].slice(0, 3)) > fix_rate) {
        // console.log(typeof json["dish_liked"][i]);
        let arr = json["dish_liked"][i].split(", ");

        arr.forEach(function (item) {
          targetArray.push(item);
        });
      }
    }
  }
  console.log("--------------------------", targetArray);
  const frequencyMap = targetArray.reduce((map, val) => {
    const key = val.toLowerCase().replace(/\s+/g, "");
    map[key] = (map[key] || 0) + 1;
    return map;
  }, {});

  //   console.log(frequencyMap);
  delete frequencyMap[""];
  console.log(frequencyMap);

  //   const mapSize = frequencyMap.size;
  const mapSize = Object.keys(frequencyMap).length;
  //   console.log(numberOfKeys);

  const final_freq_map = new Map();

  if (mapSize <= 400) {
    // pick all key-value pairs

    final_freq_map = Object.entries(frequencyMap);
    // console.log(allKeyValuePairs);
  } else {
    // pick random 400 key-value pairs
    // const randomKeyValuePairs = new Map();
    const keys = Object.keys(frequencyMap);
    const randomKeys = [];

    while (randomKeys.length < 400) {
      const randomIndex = Math.floor(Math.random() * mapSize);
      const randomKey = keys[randomIndex];

      if (!randomKeys.includes(randomKey)) {
        randomKeys.push(randomKey);
        final_freq_map.set(randomKey, frequencyMap[randomKey]);
      }
    }

    // console.log(randomKeyValuePairs);
  }

  console.log("final mapping:::::::::::::::::", final_freq_map);
  const keys = Object.keys(frequencyMap);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  console.log("rand", randomKey);

  var dom = document.getElementById("chart-container");
  var myChart = echarts.init(dom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  var app = {};

  var option;

  // prettier-ignore
  const hours = [
    '1', '2', '3', '4', '5', '6' , '7','8','9','10','11','12','13', '14','15','16','17','18','19','20'
];
  // prettier-ignore
  const days = [

    '1', '2', '3', '4', '5', '6' , '7','8','9','10','11','12','13', '14','15','16','17','18','19','20'
];
 

  const data = [];
  for (let i = 0; i < 20; i++) {
    // loop over the columns

    for (let j = 0; j < 20; j++) {
    //   const keys = Object.keys(final_freq_map);
    //   const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomKey = Array.from(final_freq_map.keys())[Math.floor(Math.random() * final_freq_map.size)];
    const randomValue = final_freq_map.get(randomKey);
    console.log(randomKey);
        
      const cellName = randomKey;
      const value = randomValue;
      const obj = { name: cellName, value: [i, j, value] };
      data.push(obj);
      final_freq_map.delete(randomKey);
    }
  }
  console.log("final data", data);
  option = {
    tooltip: {
      position: "top",
    },
    grid: {
      height: "50%",
      top: "10%",
    },
    xAxis: {
      type: "category",
      data: hours,
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      type: "category",
      data: days,
      splitArea: {
        show: true,
      },
    },
    visualMap: {
      min: 0,
      max: 50,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "15%",
    },
    series: [
      {
        //   name: 'Punch Card',
        type: "heatmap",
        data: data,
        label: {
          show: true,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        //   ,
        //   formatter: function(params) {
        //     return 'vinay' + params.value[2];
        //   }
      },
    ],
    // series: [{
    //     type: 'heatmap',
    //     data: [
    //       [{value: 10, name: 'Cell 1'}, {value: 20, name: 'Cell 2'}, {value: 30, name: 'Cell 3'}],
    //       [{value: 40, name: 'Cell 4'}, {value: 50, name: 'Cell 5'}, {value: 60, name: 'Cell 6'}],
    //       [{value: 70, name: 'Cell 7'}, {value: 80, name: 'Cell 8'}, {value: 90, name: 'Cell 9'}]
    //     ],
    //     label: {show: true}
    //   }]
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }

  window.addEventListener("resize", myChart.resize);
});
