var express = require('express');
var request = require('request');
var apiKey = '';//put your APIKey here

  app = express();

  app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });
      
  app.get('/', (req,res) => res.send('Hello World!'));

  app.get('/current', (req, res) => {
        if(req.query.lat && req.query.lon){
                request(`http://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.lon}&appid=${apiKey}&units=imperial`, function(error, response, body) {
                        console.log("calling current weather api");
                        console.log(error, response, body);
                        if(!error && response.statusCode == 200){
                                res.send(body.main.temp);//return just the temp, it's all we need.
                        } else{
                                res.send('error calling weather api. Please try again');
                        }
                })
        } else {
                res.send('didn\'t receive location information');
        }
  });
  app.get('/forecast', (req, res) => {
        if(req.query.lat && req.query.lon){
                request(`http://api.openweathermap.org/data/2.5/forecast?lat=${req.query.lat}&lon=${req.query.lon}&appid=${apiKey}&units=imperial&cnt=5`, function(error, response, body) {
                        console.log("calling current weather api");
                        console.log(error, response, body);
                        if(!error && response.statusCode == 200){
                                let forecast = [];                  
                                bodyAsJSON = JSON.parse(sampleForecastBody)    
                                for (let i = 1; i <= 5; i++) {
                                        forecast.push({date: timeConverter(bodyAsJSON.list[i].dt), temp: bodyAsJSON.list[i].main.temp});
                                }
                                res.send(forecast);
                        } else{
                                res.send('error calling weather api. Please try again');
                        }
                })
        } else {
                res.send('didn\'t receive location information');
        }
  });

app.listen(3000, () => console.log('weather api now listening on port 3000!'));

function timeConverter(UNIX_timestamp){
        var workingDate = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = workingDate.getFullYear();
        var month = months[workingDate.getMonth()];
        var date = workingDate.getDate();
        var time = date + ' ' + month + ' ' + year ;
        return time;
}
