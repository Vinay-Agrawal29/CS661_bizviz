d3.csv("./data/downsampled_zomato.csv").then(function (data) {
  var json = {};

  data.forEach(function (d) {
    Object.keys(d).forEach(function (key) {
      if (!json[key]) {
        json[key] = [];
      }
      json[key].push(d[key]);
    });
  });

  console.log("json keys: ", Object.keys(json));

  cuisines = json["cuisines"];
  let targetArray = [];
  console.log(cuisines[0]);
  for (let i = 0; i < cuisines.length; i++) {
    let arr = cuisines[i].split(", ");

    arr.forEach(function (item) {
      targetArray.push(item);
    });
  }

  const uniqueCount = targetArray.reduce((countMap, str) => {
    const key = str.toLowerCase().replace(/\s+/g, "");
    countMap.set(key, (countMap.get(key) || 0) + 1);
    return countMap;
  }, new Map());

  const sortedUniqueCount = new Map(
    [...uniqueCount.entries()].sort((a, b) => b[1] - a[1])
  );

  const top9cuisines = [...sortedUniqueCount.keys()].slice(0, 9);
  const counts = top9cuisines.map((key) => sortedUniqueCount.get(key));

  let map = new Map();
  for (j = 0; j < top9cuisines.length; j++) {
    const count_rate = new Array(4).fill(0);
    for (let i = 0; i < json["cuisines"].length; i++) {
      let rate = json["rate"][i];
      let cuisines = json["cuisines"][i];
      cuisines = cuisines.split(", ");

      let cuisineExist = cuisines.some((cuisine) => {
        const cleanedCuisine = cuisine.toLowerCase().replace(/\s+/g, "");
        return cleanedCuisine == top9cuisines[j];
      });
      if (cuisineExist) {
        console.log("rate",rate.slice(0,3));
        let rate_float = parseFloat(rate.slice(0,3));

        if(rate_float<=3){
          count_rate[0] += 1;
        }
        else if(rate_float > 3 && rate_float< 3.5){
          count_rate[1] += 1;
        }
        else if(rate_float >= 3.5 && rate_float< 4){
          count_rate[2] += 1;
        }
        else{
          count_rate[3] += 1;
        }

      }
    }
    map.set(top9cuisines[j], count_rate);
    console.log("count rate: ", count_rate);
  }

  console.log(map);

  const newMap = new Map([
    ["index 0", []],
    ["index 1", []],
    ["index 2", []],
    ["index 3", []],
  ]);
  console.log(newMap);

  for (const [key, arr] of map) {
    for (let i = 0; i < arr.length; i++) {
      newMap.get(`index ${i}`).push(arr[i]);
    }
  }

  var dom = document.getElementById("chart-container");
  var myChart = echarts.init(dom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  var app = {};

  var option;

  option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    //   formatter: function(params) {
    //     var data = params[0].data; // Get the original data for the hovered bar
    //     var list = new Array(3).fill(0);
    //     var x = 10; // Value of additional variable
    //     return 'Value: ' + list[0] + '<br>' + list[1]+ '<br>' + 'X: ' + x;
    // }
    },
    legend: {},
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: top9cuisines,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "below 3",
        type: "bar",
        stack: "Ad",
        emphasis: {
          focus: "series",
        },
        data: newMap.get("index 0"),
      },
      {
        name: "Between 3 and 3.5",
        type: "bar",
        stack: "Ad",
        label: {show: false,text: "cfy" },
        emphasis: {
          focus: "series",
        },
        data: newMap.get("index 1"),
      },
      {
        name: "Between 3.5 and 4",
        type: "bar",
        stack: "Ad",
        emphasis: {
          focus: "series",
        },
        data: newMap.get("index 2"),
      },{
        name: "Above 4",
        type: "bar",
        stack: "Ad",
        emphasis: {
          focus: "series",
        },
        data: newMap.get("index 3"),
      },
    ],
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }

  window.addEventListener("resize", myChart.resize);
});
