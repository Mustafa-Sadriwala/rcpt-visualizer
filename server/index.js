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

app.get('/api/piechart', async (req, res) => {
  // get data from Al
  let receipts = await fetch('https://utdcometmarketing.com/api/receipts')
  let jsondata = await receipts.json();

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

  await jsondata.forEach(element => {

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

app.get('/api/weeklytimechart/:enddate', async (req, res) => {
  // get data from Al
  // sort data based on date for last 7 days
  // return daily sums
})

app.get('/api/monthlytimechart/:enddate', async (req, res) => {
  // get data from Al
  // sort data based on date for the month
  // return weekly sums?
})

app.get('/api/yearlytimechart/:year', async (req, res) => {
  // get data from Al
  // sort data based on date for the year
  // return monthly sums
})

app.listen(port, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  // eslint-disable-next-line no-console
  console.info(`Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
});
