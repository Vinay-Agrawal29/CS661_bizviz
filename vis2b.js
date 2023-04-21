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

  let fix_cuisine = "desserts"; // should be variable.. hardcoded now.
  let fix_rate = 2.6; // should be variable.. hardcoded now.
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
      if (parseFloat(json["rate"][i].slice(0, 3)) > fix_rate) {
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

  delete frequencyMap[""];
  console.log("frequenct map",frequencyMap);
  const mapSize = Object.keys(frequencyMap).length;

  let final_freq_map = new Map();

  if (mapSize <= 225) {
    // pick all key-value pairs
    console.log("actually less that");
    final_freq_map = frequencyMap

    // console.log(allKeyValuePairs);
  } else {
    const keys = Object.keys(frequencyMap);
    const randomKeys = [];
    
    while (Object.keys(final_freq_map).length < 225) {
      const randomIndex = Math.floor(Math.random() * mapSize);
      const randomKey = keys[randomIndex];
        final_freq_map[randomKey] = frequencyMap[randomKey];
    }

  }
  console.log("final mapping::::::", final_freq_map);
  const keys = Object.keys(frequencyMap);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
//   console.log("rand", randomKey);

  var dom = document.getElementById("chart-container");
  var myChart = echarts.init(dom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  var app = {};

  var option;

  const hours = [
    '1', '2', '3', '4', '5', '6' , '7','8','9','10','11','12','13', '14','15'
    
];
  const days = [

    '1', '2', '3', '4', '5', '6' , '7','8','9','10','11','12','13', '14','15'
];
 
  const data = [];
const final_freq_map_values = Object.values(final_freq_map);
let final_freq_map_keys = Object.keys(final_freq_map).sort();
console.log("keys", final_freq_map_keys.sort());
let key_ind=0;
  for (let i = 0; i < 15; i++) {
    // loop over the columns
    for (let j = 0; j < 15; j++) {
        if(Object.keys(final_freq_map).length<=0){
            console.log("empty map");
            break;
        }
    
    const randomKey = final_freq_map_keys[key_ind++];
    
    const randomValue = final_freq_map[randomKey];
      const cellName = randomKey;
      const value = randomValue;
      const obj = { name: cellName, value: [j, i, value] };
      data.push(obj);
      delete final_freq_map[randomKey];


    }
  }
key_ind = 0;
  console.log("data: ",data[7]);
  option = {
    tooltip: {
      position: "top",
    },
    grid: {
      height: "70%",
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
      min: Math.min(...final_freq_map_values),
      max: Math.max(...final_freq_map_values)/3,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "5%",
      width:"100%",
    },
    series: [
      {
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
      },
    ],
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }

  window.addEventListener("resize", myChart.resize);
});
