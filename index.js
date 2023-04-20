// Load the CSV data using D3.js
d3.csv("./data/downsampled_zomato.csv").then(function(data) {
  // Define an empty object to hold the column-wise data
  var json = {};
  // console.log("data",data);

  // Loop through each row of the CSV data
  data.forEach(function(d) {
    // Loop through each column of the row
    Object.keys(d).forEach(function(key) {
      // If the column doesn't exist in the JSON object, create it
      if (!json[key]) {
        json[key] = [];
      }
      // Add the value to the column array
      json[key].push(d[key]); 
    });
  });

  console.log("json keys: ",Object.keys(json));

  cuisines = json["cuisines"];
  let targetArray = [];
  console.log(cuisines[0]);
  for (let i =0; i< cuisines.length;i++){
    let arr = cuisines[i].split(", ");

// Use a for loop to iterate over the elements of the array
    arr.forEach(function(item) {
    targetArray.push(item);
    });
  }
  

const uniqueCount = targetArray.reduce((countMap, str) => {
  const key = str.toLowerCase().replace(/\s+/g, '');
  countMap.set(key, (countMap.get(key) || 0) + 1);
  return countMap;
}, new Map());

const sortedUniqueCount = new Map(
  [...uniqueCount.entries()].sort((a, b) => b[1] - a[1])
);

// const top9cuisines = [...sortedUniqueCount.keys()].sort((a, b) => sortedUniqueCount.get(b) - sortedUniqueCount.get(a));
// const counts = [...sortedUniqueCount.values()];

// console.log(top9cuisines);
// console.log(counts);
// console.log(uniqueCount);
const top9cuisines = [...sortedUniqueCount.keys()].slice(0, 9);
const counts = top9cuisines.map(key => sortedUniqueCount.get(key));


console.log(top9cuisines);
console.log(counts);  



// let fix_cuisine = "northindian";
let map = new Map();
// console.log(top9cuisines.length,"dfuf");
for (j = 0; j< top9cuisines.length; j++)
{
  const count_rate = new Array(5).fill(0);
// console.log(json.length(),"total length")
for (let i=0; i< json["cuisines"].length;i++){
  // console.log('value of i', i);
  
  let rate =  json["rate"][i];
  let cuisines = json["cuisines"][i];
  cuisines = cuisines.split(", ");
  // console.log(cuisines);

  let cuisineExist = cuisines.some((cuisine) => {
    const cleanedCuisine = cuisine.toLowerCase().replace(/\s+/g, '');
    // console.log(cleanedCuisine == fix_cuisine);
    return cleanedCuisine == top9cuisines[j];
  });
  if (cuisineExist) {
    // console.log("rate/ cuisines/i",rate, cuisines,i);
    console.log(rate[0]);
    switch(rate[0]){
      
      case "0": {count_rate[0] += 1;break;}
      case "1": {count_rate[1] += 1;break;}
      case "2": {count_rate[2] += 1;break;}
      case "3": {count_rate[3] += 1;break;}
      case "4": {count_rate[4] += 1;break;}
      case "5": {count_rate[4]+= 1;break;}
      default: console.log("fault index", i);

    }
  } 
    
}
map[top9cuisines[j]]= count_rate;
console.log("count rate: ",count_rate);


}

console.log(Object.keys(map));

const under_1 = new Array(9);
const under_2 = new Array(9);
const under_3 = new Array(9);
const under_4 = new Array(9);
const under_5 = new Array(9);

Object.keys(map).forEach(function(key) {
  console.log(key);
  });  


// // Use a for loop to iterate over the elements of the array
//   arr.forEach(function(item) {
//   targetArray.push(item);
//   });




var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app = {};

var option;

option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data:top9cuisines
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '<2',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: [320, 332, 301, 334, 390, 330, 320,89,1]
    },
    {
      name: '2-3.5',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: [120, 132, 101, 134, 90, 230, 210,89,1]
    },
    {
      name: '>= 3.5',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series'
      },
      data: [220, 182, 191, 234, 290, 330, 310,89,1]
    },
    {
            name: 'Video Ads',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: [150, 232, 201, 154, 190, 330, 410,89,1]
          },
          {
            name: 'Search Engine',
            stack: 'Ad',
            type: 'bar',
            data: [862, 1018, 964, 1026, 1679, 1600, 1570,89,1],
            emphasis: {
              focus: 'series'
            }},
    
  ]
};

if (option && typeof option === 'object') {
  myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);
  
});

// var dom = document.getElementById('chart-container');
// var myChart = echarts.init(dom, null, {
//   renderer: 'canvas',
//   useDirtyRect: false
// });
// var app = {};

// var option;

// option = {
//   tooltip: {
//     trigger: 'axis',
//     axisPointer: {
//       type: 'shadow'
//     }
//   },
//   legend: {},
//   grid: {
//     left: '3%',
//     right: '4%',
//     bottom: '3%',
//     containLabel: true
//   },
//   xAxis: [
//     {
//       type: 'category',
//       data: ['northindian', 'chinese', 'southindian', 'fastfood', 'biryani', 'desserts', 'cafe']
//     }
//   ],
//   yAxis: [
//     {
//       type: 'value'
//     }
//   ],
//   series: [
//     {
//       name: '<2',
//       type: 'bar',
//       stack: 'Ad',
//       emphasis: {
//         focus: 'series'
//       },
//       data: [320, 332, 301, 334, 390, 330, 320]
//     },
//     {
//       name: '2-3.5',
//       type: 'bar',
//       stack: 'Ad',
//       emphasis: {
//         focus: 'series'
//       },
//       data: [120, 132, 101, 134, 90, 230, 210]
//     },
//     {
//       name: '>= 3.5',
//       type: 'bar',
//       stack: 'Ad',
//       emphasis: {
//         focus: 'series'
//       },
//       data: [220, 182, 191, 234, 290, 330, 310]
//     },
//     // {
//     //   name: 'Video Ads',
//     //   type: 'bar',
//     //   stack: 'Ad',
//     //   emphasis: {
//     //     focus: 'series'
//     //   },
//     //   data: [150, 232, 201, 154, 190, 330, 410]
//     // },
//     // {
//     //   name: 'Search Engine',
//     //   type: 'bar',
//     //   data: [862, 1018, 964, 1026, 1679, 1600, 1570],
//     //   emphasis: {
//     //     focus: 'series'
//     //   },
//     //   markLine: {
//     //     lineStyle: {
//     //       type: 'dashed'
//     //     },
//     //     data: [[{ type: 'min' }, { type: 'max' }]]
//     //   }
//     // },
//     // {
//     //   name: 'Baidu',
//     //   type: 'bar',
//     //   barWidth: 5,
//     //   stack: 'Search Engine',
//     //   emphasis: {
//     //     focus: 'series'
//     //   },
//     //   data: [620, 732, 701, 734, 1090, 1130, 1120]
//     // },
//     // {
//     //   name: 'Google',
//     //   type: 'bar',
//     //   stack: 'Search Engine',
//     //   emphasis: {
//     //     focus: 'series'
//     //   },
//     //   data: [120, 132, 101, 134, 290, 230, 220]
//     // },
//     // {
//     //   name: 'Bing',
//     //   type: 'bar',
//     //   stack: 'Search Engine',
//     //   emphasis: {
//     //     focus: 'series'
//     //   },
//     //   data: [60, 72, 71, 74, 190, 130, 110]
//     // },
//     // {
//     //   name: 'Others',
//     //   type: 'bar',
//     //   stack: 'Search Engine',
//     //   emphasis: {
//     //     focus: 'series'
//     //   },
//     //   data: [62, 82, 91, 84, 109, 110, 120]
//     // }
//   ]
// };

// if (option && typeof option === 'object') {
//   myChart.setOption(option);
// }

// window.addEventListener('resize', myChart.resize);