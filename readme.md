# City Runner
### A fun web app that provides users with a running path in their area.

## Overview/MVP
###### This web app utilizes Google Maps API to generate running paths based on their current location and desired distance.  Upon form submission the user will see their created path as well as directions pulled from Google Maps

## Technologies
###### HTML
###### Boostrap/CSS
###### Javascript/jQuery
###### Google Maps Javascript API
###### AJAX/JSON
###### Express/Node.js
###### Isotope JS

## Node Module Dependencies
###### bcrypt-nodejs
###### body-parser
###### cookie-parser
###### debug
###### ejs
###### express
###### express-session
###### morgan
###### multer
###### mysql
###### request
###### serve-favicon
###### express-session

## Challenges/Lessons Learned

### Scope Challenge 
###### One of the main challenges was simply javascript's handling of scope. We found that setting almost all variables as undefined globals was often the best practice. 

### AJAX Request Challenge
###### This was one of the first hurdles to get over. In order to protect our API key from being viewed on github, we saved the key to a config file which was then hidden by a .gitignore file. After this, we expected to make a simple AJAX request and pass the key in as a variable, but google maps required one more step before doing. You have to make a jsonpCallback, and call the function which instantiates the map object, a process which is a little more complicated than more simple API's like Yahoo and Weather.com.

### Function Ordering Challenge
###### Another unforeseen problem was having javascript return google maps as undefined.  We discovered this was due to improper ordering/placing of functions. Originally we had our AJAX request inside of our document.ready function, and initMap function, instantiates the new map, outside of document.ready. After some lucky console.loging, we discovered that javascript was trying to run those function before the AJAX request was finished. We solved this by placing the ajax request outside of the document.ready function and placing our init map function which  inside of our geocoder function.
 
### Generating Extra Points Challenge
###### Generating a route whose start and destination are the same, while still having different points also proved challenging. Google Maps is designed to take a user from point A to point B in the most efficient line possible. Our goal was to essentially take the user in a circle, something that Google Maps is not readily designed for. We ended up using triangles to generate extra points based on the user's current location. These extra points are denoted as Waypoints,a parameter Google Maps is prepared to take. A path is then generated that connects the start point,destination point, as well as the waypoints in the middle.

### Waypoints Object Challenge 
###### Once we had our waypoints, we were still not getting the path to run through the waypoints because we were not passing in the waypoints' data correctly. We were passing them in as latitude, longitude objects, as we expected, yet we were still finding errors. We discovered that google maps is expecting a location: object, which has the latitude, longitude object.  So in fact, our waypoints array needed to be an object of objects.  

### Frontend Form Submission to Backend Challenge
###### Throughout this project, we constantly had difficulty knowing how and where to pass data from the frontend to the backend. The data we needed to pass was necessary for us to store it in the database for later use when the user clicks on an old route in the history page. We used a $.post request in our frontend scripts file to solve this issue. When the user clicks on the start or stop button, data is posted to our backend index.js file, which is then inserted into our database.

### Sending data from the Backend to the Frontend Challenge
###### To display our results page, which would need to display the amount of time they ran, and the distance, we needed to find a way send this data from the server, since the server was controlling the stopwatch, and also of course had access to the database.  We accomplished this by building a query string that is dependent on the stop button of our stopwatch. When the user clicks on the stop button, they are taken to a url which has the data we need to save. We then use the server to pull that data out via req.query.

### Selecting from Routes Table by Id Challenge
###### After we saved our routes data, we wanted to display the route data for the run the user just did on the results page. The problem was that it was selecting all of the run data associated with that user, instead of only the current run.  To solve this, we attempted to add onto our query string via the stop button, as we had done to send the time data before. But due to javacript's asynchronous nature, the same button was now trying to save data and request it at the same. The result was that id was undefined.  The final solution came from saving the url via the start button instead, which allowed us to separate the steps of sending data and pulling it back out.  

## Happy Victories

###### We were concerned about ensuring the path would always stay on a viable walking path, but thanks to Google Maps' WALKING parameter, this was an easy victory.  

###### The setPanel method made displaying the directions an easier task than originally expected.  

###### We created an option to generate paths of different sizes based on the users desired distance. We were pleasantly surprised that changing the distance based on our range variable was easy with some simple if/else if statements.  

## Code Snippets

###### AJAX Request Challenge - note the jsonpCallback
```javascript
var ajaxRequest = $.ajax({
    type: 'GET',
    url: mapURL,
    url2: roadURL,
    dataType: 'jsonp',
    jsonpCallback: 'initMap',
    async: false, // this is by default false, so not need to mention
    crossDomain: true // tell the browser to allow cross domain calls.
});
```
###### Generating Extra Points Challenge
```javascript 
function findCoordinates(lat, lng, range) {
    var numOfPoints = 6;
    var degreesPerPoint = -5 / numOfPoints;
    var x2;
    var y2;
    var currentAngle = 45;
    map = map;
    for (let i = 0; i <= numOfPoints; i++) {
        x2 = Math.cos(currentAngle) * range;
        y2 = Math.sin(currentAngle) * range;
        newLat = lat + x2;
        newLng = lng + y2;
        lat_lng = new google.maps.LatLng(newLat, newLng);
        marker = new google.maps.Marker({
            position: lat_lng,
            map: map,
        });
        latArray.push(lat_lng.lat()); ////push lats of points we just looped through and placed on map
        lngArray.push(lat_lng.lng());
        markerArray.push(marker);
        currentAngle += degreesPerPoint;
    }
};
```
###### Waypoints Object Challenge - note the object of objects
```javascript 
var waypoints = [{
            location: {
                lat: latArray[1],
                lng: lngArray[1]
            }
        },
        {
            location: {
                lat: latArray[2],
                lng: lngArray[2]
            }
        },
        {
            location: {
                lat: latArray[3],
                lng: lngArray[3]
            }
        },
        {
            location: {
                lat: latArray[4],
                lng: lngArray[4]
            }
        },
        {
            location: {
                lat: latArray[5],
                lng: lngArray[5]
            }
        },
        {
            location: {
                lat: latArray[6],
                lng: lngArray[6]
            }
        },
```        
###### Frontend Form Submission to Backend Challenge
```javascript
	$('.startButton').click(function(){
		var date = new Date()
		date = date.getTime()
		$.post('http://localhost:3000/start',{date},function(data, status){
			timeId = data.insertId
			console.log(data)
		$('#stopButtonLink').attr('href',$('#stopButtonLink').attr('href')+'&id='+data.insertId)
		})
	})

	$('.stopButton').click(function(){
		if (timeId == 0){
			return
		}
		var date = new Date()
		date = date.getTime()
		$.post('http://localhost:3000/stop',{date:date, timeId:timeId, address:address, distance:distance},function(data,status){
			
		})
	})
```
######
```ejs
    <%
        encodedDistance = encodeURI(distance);
        encodedAddress = encodeURI(address);
        resultsRoute = '/results?distance='+encodedDistance+'&address='+encodedAddress;
    %>
```
###Selecting from Routes Table by Id Challenge
```javascript
$('#stopButtonLink').attr('href',$('#stopButtonLink').attr('href')+'&id='
```

## Updates

### 11.10.17
###### Three routes now display after user submission
###### App now runs on express server and is connected to database.

## TODO List
###### Upon user submission, display three different routes with similar distances.  This will be accomplished  by adjusting the angle of the triangle used to find the points. --> Completed
###### Add in filter mechanism based on crime right to improve user safety. 
###### Add Google Maps Elevation API to add more hills to the user's run, if desired.
###### Add marker animation.
###### Add in carousel feature for multiple maps.
###### Refine distance control based on userLocation