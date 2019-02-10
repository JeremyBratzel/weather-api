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
  
  var sampleCurrentBody = '{"coord":{"lon":-82.95,"lat":42.33},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"base":"stations","main":{"temp":267.84,"pressure":1035,"humidity":58,"temp_min":266.45,"temp_max":269.05},"visibility":16093,"wind":{"speed":3.1,"deg":100},"clouds":{"all":90},"dt":1549812960,"sys":{"type":1,"id":6182,"message":0.004,"country":"CA","sunrise":1549802057,"sunset":1549839500},"id":5946226,"name":"East Windsor","cod":200}';
  
  app.get('/current', (req, res) => {
        if(req.query.lat && req.query.lon){
                request(`http://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.lon}&appid=${apiKey}&units=imperial`, function(error, response, body) {
                        if(!error && response.statusCode == 200){
                                bodyAsJSON = JSON.parse(body)    
                                res.send({date: timeConverter(bodyAsJSON.dt), temp: bodyAsJSON.main.temp, icon: bodyAsJSON.weather[0].icon});
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
                request(`http://api.openweathermap.org/data/2.5/forecast?lat=${req.query.lat}&lon=${req.query.lon}&appid=${apiKey}&units=imperial`, function(error, response, body) {
                        if(!error && response.statusCode == 200){
                                let forecast = [];                  
                                bodyAsJSON = JSON.parse(body)    
                                for (let i = 0; i < bodyAsJSON.cnt; i++) {
                                        forecast.push({date: timeConverter(bodyAsJSON.list[i].dt, true), temp: bodyAsJSON.list[i].main.temp, icon: bodyAsJSON.list[i].weather[0].icon});
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

function timeConverter(UNIX_timestamp, includeHour = false){
        var workingDate = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = workingDate.getFullYear();
        var month = months[workingDate.getMonth()];
        var date = workingDate.getDate();
        var hour = includeHour ? (workingDate.getHours()<10?'0':'') + workingDate.getHours() : '';
        var minute = includeHour ? ':' + (workingDate.getMinutes()<10?'0':'') + workingDate.getMinutes() : '';
        var time = date + ' ' + month + ' ' + year + ' ' + hour + minute;
        return time.trim();
}
