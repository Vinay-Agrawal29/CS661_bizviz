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
   let fix_cuisine = "northindian";
//   online - book table
   let YY = 0;
   let YN = 0;
   let NY = 0;
   let NN = 0;
   let ratingYY = 0.0;
   let ratingYN = 0.0;
   let ratingNY = 0.0;
   let ratingNN = 0.0;


   for(let i = 0; i < json["cuisines"].length; i++){
    
     let list_cuisine = json["cuisines"][i].split(',');

     let cuisineExist = list_cuisine.some((cuisine) => {
        const cleanedCuisine = cuisine.toLowerCase().replace(/\s+/g, "");
        return cleanedCuisine == fix_cuisine;
      });

      if(cuisineExist){
        // console.log("i: ",i);
        // console.log(typeof json["online_order"][i]);
        if(json["online_order"][i].toLowerCase() == 'yes' && json["book_table"][i].toLowerCase() == "yes"){
             YY += 1;  
             if(! isNaN(parseFloat(json['rate'][i].slice(0,3)) ))
             {ratingYY += parseFloat(json['rate'][i].slice(0,3))}
            
        }else if(json["online_order"][i].toLowerCase() == 'yes' && json["book_table"][i].toLowerCase() == "no") {
            YN += 1;
            if(! isNaN(parseFloat(json['rate'][i].slice(0,3))))
             {ratingYN += parseFloat(json['rate'][i].slice(0,3))}
        } else if(json["online_order"][i].toLowerCase() == 'no' && json["book_table"][i].toLowerCase() == "yes"){
            NY += 1;
            if(! isNaN(parseFloat(json['rate'][i].slice(0,3))))
             {ratingNY += parseFloat(json['rate'][i].slice(0,3))}
        }else{
            NN += 1;
            if(! isNaN(parseFloat(json['rate'][i].slice(0,3))))
             {ratingNN += parseFloat(json['rate'][i].slice(0,3))}
            // ratingNN += parseFloat(json['rate'][i].slice(0,3))
        }
      }     
   }
   console.log("YY, YN, NY, NN", ratingYY,ratingYN,ratingNY,ratingNN);
   



var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app = {};

var option;

option = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
    label: {
        show: true,
        position: 'inside',
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff'
      },
      emphasis: {
        label: {
          show: false,
          fontSize: 10,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: YY, name: 'Online-order: Yes, Book-table: Yes', label: {formatter : (ratingYY/YY).toFixed(1).toString()}},
        { value: YN, name: 'Online-order: Yes, Book-table: No', label: {formatter : (ratingYN/YN).toFixed(1).toString()} },
        { value: NY, name: 'Online-order: No, Book-table: Yes', label: {formatter : (ratingNY/NY).toFixed(1).toString()} },
        { value: NN, name: 'Online-order: No, Book-table: No', label: {formatter : (ratingNN/NN).toFixed(1).toString()} }
      ]
    }
  ]
};

if (option && typeof option === 'object') {
  myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);

});