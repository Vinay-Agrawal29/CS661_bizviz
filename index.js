function showOptions() {
  var category = document.getElementById("category").value;
  var subCategoryLabel = document.getElementById("sub-category-label");
  var subCategory = document.getElementById("sub-category");
  if (category === "business") {
    subCategory.innerHTML =
      '<option value="">Select</option><option value="new">Setting up New Restaurant</option><option value="already">Already Existing Restraunt</option>';
    subCategoryLabel.style.display = "block";
    subCategory.style.display = "block";
  } else if (category === "user") {
    subCategory.innerHTML = "";
    subCategoryLabel.style.display = "none";
    subCategory.style.display = "none";
  } else {
    subCategory.innerHTML = '<option value="">Select</option>';
    subCategoryLabel.style.display = "block";
    subCategory.style.display = "block";
  }
  document.getElementById("options").style.display = "block";
}

function showGraph() {
  var category = document.getElementById("category").value;
  var subcategory = document.getElementById("sub-category").value;
  var coptionsEle = document.getElementById("c-options");
  var title = document.getElementById("chart-title");
  var pieLabel = document.getElementById("pie-label");
  var gridLabel = document.getElementById("grid-label");
  pieLabel.style.zIndex = "2";

  console.log(category, subcategory);

  if (category == "business" && subcategory == "new") {
    title.innerHTML = "Identifying Popular Cuisines";

    pieLabel.style.display = "none";
    gridLabel.style.display = "none";
    var pie = document.getElementById("pie-container");
    pie.style.display = "none";
    var grid = document.getElementById("grid-container");
    grid.style.display = "none";

    coptionsEle.style.display = "none";
    

    var bar = document.getElementById("bar-container");
    bar.style.display = "block";
    bar.style.height = "82vh";
    bar.style.width = "90%";
    // BAR CHART
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

      //console.log("json keys: ", Object.keys(json));

      cuisines = json["cuisines"];
      let targetArray = [];
      //console.log(cuisines[0]);
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
            //console.log("rate",rate.slice(0,3));
            let rate_float = parseFloat(rate.slice(0, 3));

            if (rate_float <= 3) {
              count_rate[0] += 1;
            } else if (rate_float > 3 && rate_float < 3.5) {
              count_rate[1] += 1;
            } else if (rate_float >= 3.5 && rate_float < 4) {
              count_rate[2] += 1;
            } else {
              count_rate[3] += 1;
            }
          }
        }
        map.set(top9cuisines[j], count_rate);
        //console.log("count rate: ", count_rate);
      }

      //console.log(map);

      const newMap = new Map([
        ["index 0", []],
        ["index 1", []],
        ["index 2", []],
        ["index 3", []],
      ]);
      //console.log("---------------------------",newMap);

      for (const [key, arr] of map) {
        for (let i = 0; i < arr.length; i++) {
          newMap.get(`index ${i}`).push(arr[i]);
        }
      }

      var dom = document.getElementById("bar-container");
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
            name: " Rating: < 3",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: newMap.get("index 0"),
          },
          {
            name: "Rating: 3-3.5",
            type: "bar",
            stack: "Ad",
            label: { show: false, text: "cfy" },
            emphasis: {
              focus: "series",
            },
            data: newMap.get("index 1"),
          },
          {
            name: "Rating: 3.5-4",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: newMap.get("index 2"),
          },
          {
            name: "Rating: >4",
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
  }

  if (category == "business" && subcategory == "already") {
    title.innerHTML = "Comparison based Performance Analysis";
    pieLabel.style.display = "block";
    gridLabel.style.display = "block";
    var bar = document.getElementById("bar-container");
    bar.style.display = "none";

    var pie = document.getElementById("pie-container");
    pie.style.display = "block";
    pie.style.height = "82vh";
    pie.style.width = "90%";

    pieLabel.innerHTML = "*Average Rating of each section is written on the donut chart";

    var grid = document.getElementById("grid-container");
    grid.style.display = "block";
    grid.style.height = "82vh";
    grid.style.width = "90%";

    gridLabel.innerHTML = "*Select count of dishes liked served by better performing similar restaurants";

    var cCategory = document.getElementById("c-category");
    document.getElementById("c-options").style.display = "block";
    // PIE CHART
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
      let fix_cuisine = "mughlai"; // should be variable.. hardcoded now.
      let coptions = [];
      for (let i = 0; i < json["cuisines"].length; i++) {
        let list_cuisine = json["cuisines"][i].split(",");
        let cuisineExist = list_cuisine.some((cuisine) => {
          const cleanedCuisine = cuisine.toLowerCase().replace(/\s+/g, "");
          let pattern = /^[a-zA-Z]+$/;
          if (pattern.test(cleanedCuisine) && cleanedCuisine.length < 30) {
            coptions.push(cleanedCuisine);
          }
        });
      }
      coptions = Array.from(new Set(coptions));
      for (var i = 0; i < coptions.length; i++) {
        var option = document.createElement("option");
        option.text = coptions[i];
        option.value = coptions[i]; // Set the value attribute of the option to the index of the option
        cCategory.appendChild(option);
      }
      fix_cuisine = cCategory.value;
      //   online - book table
      let YY = 0;
      let YN = 0;
      let NY = 0;
      let NN = 0;
      let ratingYY = 0.0;
      let ratingYN = 0.0;
      let ratingNY = 0.0;
      let ratingNN = 0.0;

      for (let i = 0; i < json["cuisines"].length; i++) {
        let list_cuisine = json["cuisines"][i].split(",");
        let cuisineExist = list_cuisine.some((cuisine) => {
          const cleanedCuisine = cuisine.toLowerCase().replace(/\s+/g, "");
          return cleanedCuisine == fix_cuisine;
        });

        if (cuisineExist) {
          //console.log("i: ",i);
          // //console.log(typeof json["online_order"][i]);
          if (
            json["online_order"][i].toLowerCase() == "yes" &&
            json["book_table"][i].toLowerCase() == "yes"
          ) {
            YY += 1;
            if (!isNaN(parseFloat(json["rate"][i].slice(0, 3)))) {
              ratingYY += parseFloat(json["rate"][i].slice(0, 3));
            }
          } else if (
            json["online_order"][i].toLowerCase() == "yes" &&
            json["book_table"][i].toLowerCase() == "no"
          ) {
            YN += 1;
            if (!isNaN(parseFloat(json["rate"][i].slice(0, 3)))) {
              ratingYN += parseFloat(json["rate"][i].slice(0, 3));
            }
          } else if (
            json["online_order"][i].toLowerCase() == "no" &&
            json["book_table"][i].toLowerCase() == "yes"
          ) {
            NY += 1;
            if (!isNaN(parseFloat(json["rate"][i].slice(0, 3)))) {
              ratingNY += parseFloat(json["rate"][i].slice(0, 3));
            }
          } else {
            NN += 1;
            if (!isNaN(parseFloat(json["rate"][i].slice(0, 3)))) {
              ratingNN += parseFloat(json["rate"][i].slice(0, 3));
            }
            // ratingNN += parseFloat(json['rate'][i].slice(0,3))
          }
        }
      }
      //console.log("YY, YN, NY, NN", ratingYY,ratingYN,ratingNY,ratingNN);

      var dom = document.getElementById("pie-container");
      var myChart = echarts.init(dom, null, {
        renderer: "canvas",
        useDirtyRect: false,
      });
      var app = {};

      var option;

      option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        // graphic: [
        //   {
        //     type: "text",
        //     left: "center",
        //     top: "center",
        //     style: {
        //       text: "Avg. rating for corresponding sections written on the donut",
        //       textAlign: "center",
        //       fill: "#000",
        //       fontSize: 10,
        //     },
        //   },
        // ],
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: true,
              position: "inside",
              fontSize: 15,
              fontWeight: "bold",
              color: "#fff",
            },
            emphasis: {
              label: {
                show: false,
                fontSize: 10,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: YY,
                name: "Accepting Online-order & Book-table                                                                                          ",
                label: { formatter: (ratingYY / YY).toFixed(1).toString() },
              },
              {
                value: YN,
                name: "Accepting Online-order",
                label: { formatter: (ratingYN / YN).toFixed(1).toString() },
              },
              {
                value: NY,
                name: "Accepting Book-table                                                                                                      ",
                label: { formatter: (ratingNY / NY).toFixed(1).toString() },
              },
              {
                value: NN,
                name: "Dine-in Only",
                label: { formatter: (ratingNN / NN).toFixed(1).toString() },
              },
            ],
          },
        ],
      };

      if (option && typeof option === "object") {
        myChart.setOption(option);
      }

      window.addEventListener("resize", myChart.resize);
    });

    // GRID CHART
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

      var rCategory = document.getElementById("r-category");
      for (var i = 1; i <= 50; i++) {
        var option = document.createElement("option");
        var optionValue = (i / 10).toFixed(1); // Generate the option value
        option.text = optionValue.toString();
        option.value = optionValue;
        rCategory.appendChild(option); // Add the option to the dropdown
      }
      fix_cuisine = cCategory.value;
      fix_rate = rCategory.value;
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
      //console.log("--------------------------", targetArray);
      const frequencyMap = targetArray.reduce((map, val) => {
        const key = val.toLowerCase().replace(/\s+/g, "");
        map[key] = (map[key] || 0) + 1;
        return map;
      }, {});

      delete frequencyMap[""];
      //console.log("frequenct map",frequencyMap);
      const mapSize = Object.keys(frequencyMap).length;

      let final_freq_map = new Map();

      if (mapSize <= 225) {
        // pick all key-value pairs
        //console.log("actually less that");
        final_freq_map = frequencyMap;

        // //console.log(allKeyValuePairs);
      } else {
        const keys = Object.keys(frequencyMap);
        const randomKeys = [];

        while (Object.keys(final_freq_map).length < 225) {
          const randomIndex = Math.floor(Math.random() * mapSize);
          const randomKey = keys[randomIndex];
          final_freq_map[randomKey] = frequencyMap[randomKey];
        }
      }
      //console.log("final mapping::::::", final_freq_map);
      const keys = Object.keys(frequencyMap);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      //   //console.log("rand", randomKey);

      var dom = document.getElementById("grid-container");
      var myChart = echarts.init(dom, null, {
        renderer: "canvas",
        useDirtyRect: false,
      });
      var app = {};

      var option;

      const hours = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
      ];
      const days = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
      ];

      const data = [];
      const final_freq_map_values = Object.values(final_freq_map);
      let final_freq_map_keys = Object.keys(final_freq_map).sort();
      //console.log("keys", final_freq_map_keys.sort());
      let key_ind = 0;
      for (let i = 0; i < 15; i++) {
        // loop over the columns
        for (let j = 0; j < 15; j++) {
          if (Object.keys(final_freq_map).length <= 0) {
            //console.log("empty map");
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
      //console.log("data: ",data[7]);
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
          max: Math.max(...final_freq_map_values) / 3,
          calculable: true,
          orient: "horizontal",
          left: "center",
          bottom: "5%",
          width: "100%",
          itemHeight: "380%",
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
  }
}
