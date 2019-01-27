const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../config/webpack.config.js');
const fetch = require('node-fetch');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

app.use(express.static(path.join(__dirname, '/../dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/purify', async (req, res) => {
  let receipts = await fetch('https://utdcometmarketing.com/api/receipts')
  receipts = await receipts.json();
  receipts = purifyJSON(receipts);
  res.send(receipts)
});

app.get('/api/piechart', async (req, res) => {
  // get data from rcpt-saver
  let receipts = await fetch('https://utdcometmarketing.com/api/receipts')
  receipts = await receipts.json();

  let sums = {
    'totalSum': 0, 
    'grocerySum': 0, 
    'gasSum': 0, 
    'foodSum': 0, 
    'luxurySum': 0, 
    'travelSum': 0, 
    'clothingSum': 0, 
    'miscSum': 0}
  let luxury = ['amusement_park', 'jewelry_store', 'liquor_store', 'beauty_salon']
  let travel = ['travel_agency', 'airport', 'bus_station', 'train_station', 'subway_station']
  let clothing = ['clothing_store', 'department_store', 'shoe_store', 'shopping_mall']
  let grocery = ['convenience_store', 'grocery_or_supermarket', 'supermarket', 'store']
  let food = ['bakery', 'bar', 'restaurant', 'cafe', 'meal_delivery', 'meal_takeaway']

  await receipts.forEach(element => {

    sums.totalSum += element.totalCost

    // split into categories
    // groceries, gas, food, luxury, misc., 
    let flag = true;
    if(flag)
    {
      element.categories.forEach(category => {
        if(category.name == 'gas_station')
        {
          sums.gasSum += element.totalCost;
          flag = false;
        }
      })
    }
    if(flag){
      element.categories.forEach(category => {
        if(luxury.includes(category.name))
        {
          sums.luxurySum += element.totalCost;
          flag = false;
        }
      })
    }
    if(flag){
      element.categories.forEach(category => {
        if(travel.includes(category.name))
        {
          sums.travelSum += element.totalCost;
          flag = false;
        }
      })
    }
    if(flag){
      element.categories.forEach(category => {
        if(clothing.includes(category.name))
        {
          sums.clothingSum += element.totalCost;
          flag = false;
        }
      })
    }
    if(flag){
      element.categories.forEach(category => {
        if(food.includes(category.name))
        {
          sums.foodSum += element.totalCost;
          flag = false;
        }
      })
    }
    if(flag){
      element.categories.forEach(category => {
        if(grocery.includes(category.name))
        {
          sums.grocerySum += element.totalCost;
          flag = false;
        }
      })
    }
    if(flag){
      sums.miscSum += element.totalCost;
      flag = false;
    }
    if(flag)
    {
      res.send('ERROR')
    }
  }); // end of jsondata foreach loop
  res.send(sums);
})

function purifyJSON(json)
{
  let temp = []
  for(let i = 0; i < json.length; i++)
  {
    if(json[i].date != null)
    {
      temp.push(json[i])
    }
  }
  return temp
}

function translateDate(json)
{
  // store the date of each element as a Date object
  let dates = []
  json.forEach(element => {
    if(element.date != null)
    {
      dates.push(new Date(element.date))
    }
    else{
      dates.push(new Date(element.createdAt))
    }
  })

  return dates
}

function sortByDate(json, dates) 
{
  // create an array of type Date
  //let date = translateDate(json)

  // insertionSort on the dates of each element
  json.forEach(element => {

    for(var i = 0; i < json.length; i++)
    {
      let value = dates[i]
      let temp = json[i]

      for(var j = i - 1; j > -1 && dates[j] < value; j--)
      {
        // loop through the items in the sorted array (the items from the current to the beginning)
        // copy each item to the next one
        dates[j + 1] = dates[j]
        json[j + 1] = json[j]
      }

      // the last item we've reached should now hold the value of the currently sorted item
      dates[j + 1] = value
      json[j + 1] = temp
    }

  })
  
  return json
}

app.get('/api/timechart/:option', async (req, res) => {
  // get data from rcpt-saver
  //let receipts = await fetch('https://utdcometmarketing.com/api/receipts')
  //receipts = await receipts.json();
  //receipts = await purifyJSON(receipts);

  let receipts = [
    {
      "_id": "5c4d65846c6029154d4bb5dd",
      "taxPaid": 0,
      "totalCost": 15,
      "business": "SPEAKEASY",
      "image": "uploads/image-1548576002153.jpeg",
      "__v": 0,
      "categories": [
          {
              "name": "point_of_interest",
              "_id": "5c4d65846c6029154d4bb5de"
          },
          {
              "name": "establishment",
              "_id": "5c4d65846c6029154d4bb5df"
          }
      ],
      "date": null,
      "listItems": [],
      "createdAt": "2019-01-27T08:02:12.835Z"
  },
  {
      "_id": "5c4d639f6c6029154d4bb5d9",
      "taxPaid": 0,
      "totalCost": 8,
      "business": "Boots",
      "image": "uploads/image-1548575502375.jpeg",
      "__v": 0,
      "categories": [
          {
              "name": "store",
              "_id": "5c4d639f6c6029154d4bb5da"
          },
          {
              "name": "shoe_store",
              "_id": "5c4d639f6c6029154d4bb5db"
          },
          {
              "name": "clothing_store",
              "_id": "5c4d639f6c6029154d4bb5dc"
          }
      ],
      "date": null,
      "listItems": [],
      "createdAt": "2019-01-27T07:54:07.094Z"
  },
  {
      "_id": "5c4d43286c6029154d4bb5d4",
      "taxPaid": 0,
      "totalCost": 4.6,
      "business": "Kungfu",
      "image": "uploads/image-1548567318960.jpeg",
      "__v": 0,
      "categories": [
          {
              "name": "health",
              "_id": "5c4d43296c6029154d4bb5d5"
          },
          {
              "name": "point_of_interest",
              "_id": "5c4d43296c6029154d4bb5d6"
          },
          {
              "name": "establishment",
              "_id": "5c4d43296c6029154d4bb5d7"
          }
      ],
      "date": "2019-01-26T09:25:00.000Z",
      "listItems": [],
      "createdAt": "2019-01-27T05:35:36.999Z"
  },
  {
      "_id": "5c4d1ea26c6029154d4bb5d0",
      "taxPaid": 0,
      "totalCost": 20.75,
      "business": "Ramen TatsuYa",
      "image": "uploads/image-1548557968724.jpeg",
      "__v": 0,
      "categories": [
          {
              "name": "restaurant",
              "_id": "5c4d1ea26c6029154d4bb5d1"
          },
          {
              "name": "point_of_interest",
              "_id": "5c4d1ea26c6029154d4bb5d2"
          },
          {
              "name": "food",
              "_id": "5c4d1ea26c6029154d4bb5d3"
          }
      ],
      "date": "2019-01-20T02:43:00.000Z",
      "listItems": [],
      "createdAt": "2019-01-27T02:59:46.563Z"
  },
  {
    "id_":"5c4d1ea26c6029154d4bb5d11",
    "business": "Foot Locker",
    "totalCost": 233.20,
    "categories": [
      {
        "name": "shoe_store",
        "_id": "5c4d639f6c6029154d4bb5d17"
      },
      {
        "name": "store",
        "_id": "5c4d639f6c6029154d4bb5da"
      },
      {
        "name": "clothing_store",
        "_id": "5c4d639f6c6029154d4bb5da"
    },
    ],
    "date": "2019-01-23T02:43:00.000Z",
    "success": "true",
    "createdAt": "2019-01-27T02:59:46.563Z"
 },
 {
  "id_":"5c4d1ea26c6029154d4bb5d11",
  "business": "mainstreet restaurant",
  "totalCost": 29.01,
  "categories": [
    {
      "name": "restaurant",
      "_id": "5c4d639f6c6029154d4bb5d17"
    },
    {
      "name": "point_of_interest",
      "_id": "5c4d639f6c6029154d4bb5da"
    },
  ],
  "date": "2019-01-22T02:43:00.000Z",
  "success": "true",
},
{
  "id_":"5c4d1ea26c6029154d4bb5d11",
  "business": "mainstreet restaurant",
  "totalCost": 10.00,
  "categories": [
    {
      "name": "restaurant",
      "_id": "5c4d639f6c6029154d4bb5d17"
    },
    {
      "name": "point_of_interest",
      "_id": "5c4d639f6c6029154d4bb5da"
    },
  ],
  "date": "2019-01-21T02:43:00.000Z",
  "success": "true",
}


]


  // create an array of Date objects
  let dates = translateDate(receipts)

  // sort receipts by Date
  receipts = await sortByDate(receipts, dates)

  let today = new Date()

  if(req.params.option == 'monthly')
  {
    if(req.query.startDate != null)
    {
      today = new Date(req.query.startDate)
    }

    let month = today.getMonth() // 0 = jan, 1 = feb, 2 = march ... 11 = december

    let daysInMonth = new Date(today.getFullYear(), month+1, 0).getDate()
    let result = new Array(daysInMonth)
    result.fill(0.0)
    daysInMonth--;

    let index = 0

    // get to the right year
    while(index < dates.length && dates[index].getFullYear() > today.getFullYear()){ index++; }
    // get to the right month
    while(index < dates.length && dates[index].getMonth() > month){ index++; }

    do{
      while(index < dates.length && dates[index].getDate() == daysInMonth)
      {
        result[daysInMonth] += receipts[index].totalCost
        index++
      }
      daysInMonth--;

    }while(index < dates.length && dates[index].getMonth() == month && daysInMonth > -1)

    res.send(result)
  }
  else if(req.params.option == 'yearly')
  {
    let year = today.getFullYear()

    if(req.query.year != null)
    {
      year = req.query.year
    }

    let month = 11 // 0 = jan, 1 = feb, 2 = march ... 11 = december
    let result = new Array(12) // index 0 = jan, 1 = feb ...
    result.fill(0.0)

    let index = 0
    while(index < dates.length && dates[index].getFullYear() > year){ index++; }

    do{
      while(index < dates.length && dates[index].getMonth() == month)
      {
        result[month] += receipts[index].totalCost;
        index++
      }
      month--;
    }while(index < dates.length && dates[index].getFullYear() == year && month > -1)

    res.send(result)
  }
  else // by default perform weekly calculation
  {
    if(req.query.startDate != null)
    {
      today = new Date(req.query.startDate)
    }
    console.log('date: ' + today.getDate())
    let day = today.getDay() // 0 = Sunday, 1 = Monday, 2 = Tuesday ...
    console.log('day: ' + today.getDay())


    let result = new Array(7) // index 0 = Sunday, 1 = Monday ... 
    result.fill(0.0)

    let index = 0;
    while(index < dates.length-1 && dates[index].getFullYear() > today.getFullYear()){ index++; }
    while(index < dates.length-1 && dates[index].getMonth() > today.getMonth()){ index++; }
    while(index < dates.length-1 && dates[index].getDate() > today.getDate())
    {
      console.log(dates[index].getDate() + ' > ' + today.getDate());
      index++;
    }

    if(dates[index].getFullYear() != today.getFullYear() || dates[index].getMonth() != today.getMonth() ||
    Math.floor(dates[index].getDate()/7) != Math.floor(today.getDate()/7))
    {
      res.send(result)
    }
    while(day != 0){
      while(index < dates.length-1 && dates[index].getDay() > day && 
      Math.floor(dates[index].getDate()/7) != Math.floor(today.getDate()/7))
      {
        console.log(dates[index].getDay() + ' > ' + day.toString())
        index++;
      }
      day--;
    }
    while(day < 7){
      while(index > -1 && dates[index].getDay() == day)
      {
        result[day] += receipts[index].totalCost;
        let temp = index;
        console.log('to (' + day + ') adding: ' + dates[temp].getDate())
        temp++;
        while(temp < dates.length-1 && dates[temp].getDay() == day && (dates[temp].getDate()/7 == dates[index].getDate()/7))
        {
          console.log(dates[temp].getDate()/7.0 + '==' + dates[index].getDate()/7.0)
          console.log('to (' + day + ') adding: ' + dates[temp].getDate())
          result[day] += receipts[temp].totalCost;
          temp++;
        }
        index--;
      }
      day++;
    }
    res.send(result)
  } // end of else 
})


app.listen(port, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  // eslint-disable-next-line no-console
  console.info(`Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
});
