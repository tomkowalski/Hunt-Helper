var map; //The Google Map Object
var geocoder; //The Google Geocoder Object
var markers = []; //Array of Markers in the current Map
var requestActive = false; //Is there an Ajax request going on currently
var autocomplete; //The Google Autocomplete object
var newRoute = true; //Should a new route be made if the route button is clicked
var add = false; //Should a marker be added to route when clicked.
var route = null; //What route should markers be added to.
var subG = []; // "associative array" of subgroup last values
var visit_visible = false;
var pos; //Position of the page
var nnPolyRoute = null; //The drawn route to be shown on the screen
var pPolyRoute = null; //The drawn route to be shown on the screen
var findRoute = false; //Should a marker's route be found when clicked
var routeFound = false;
var showNN = true;
function initialize() {
  pos = new google.maps.LatLng(38.8833, -77.0167); //Default location of the map
  /*if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
    });
  }*/

  //Initalize map options
  var mapOptions = {
    zoom: 7,
    center: pos, //
    mapTypeControl: true,
    disableDoubleClickZoom: true, 
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.LEFT_BOTTOM
    },
  };
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  //Adds buttons for route manipulation as well as routes. 
  $("nav").after('<input id="auto-c" class="controls" type="text" placeholder="Enter a location">'
    + '<div class="form">'
    + '<input id="save" type="button" value="Save Places">'
    + '</div>'
    + '<div id="new_route">'
    + '<input id="new_route_button" type="button" value="New Route">'
    + '</div>'
    + '<div id="show_visited">'
    + '<input id="show_visited_button" type="button" value="Toggle Visited Visibility">'
    + '</div>'
    + '<input id="find_route" type="button" value="Calculate Route">'
    + '</div>');
   $("#save").click(update);
   //Adds a route selection drop down menus and the listeners on them.
   $('#route_view').multipleSelect({
    placeholder: "Select Routes",
    onOpen: function() {
      $("#new_route").hide();
    },
    onClose: function() {
      $("#new_route").show();
    },
    onCheckAll: function() { //adds all unmapped markers who are not to be deleted onto the map
      for(var i = 0; i < markers.length; i++) {
        if(markers[i].getMap() == null 
       && !markers[i].del 
       && !markers[i].visited) {
          markers[i].setMap(map);
        }
      }
    },
    onUncheckAll: function() { //Removes all items that are part of a route.
      for(var i = 0; i < markers.length; i++) {
        if(markers[i].group != null 
        && markers[i].group != "") {
          markers[i].setMap(null);
        }
      }
    },
    onClick: function(view) { //Sets maps of markers whose group visibility has chanegd.
      for(var i = 0; i < markers.length; i++) {
        if(markers[i].group != null 
        && markers[i].group.toString().trim() 
        == view.label.trim()) {
          if(view.checked) {
            if(!markers[i].visited) {
              markers[i].setMap(map);
            }
          }
          else {
            markers[i].setMap(null);
          }
        }
      }
    },
  });
  //Sets up the menu that allows for  routes to have markers added to them.
  $('#route_select').multipleSelect({
    placeholder: "Add To Route",
    single: true,
    position: "top",
    onClick: function(view) { //if a route is cicked updates the values of add and route to the correct values.
      if(view.label.trim() != "No Route") {
        add = true;
        route = view.label.trim();  
      } 
      else {
        add = false;
        route = null;
      }
      //alert(view.label + view.checked);
    }
  });
  $("#route_view").multipleSelect("checkAll"); //all routes are initally visible.
  autocomplete = new google.maps.places.Autocomplete($('#auto-c').get(0)); //sets up autocomplete 
  autocomplete.bindTo('bounds', map);

  //Align all contols to parts of the google map.
  map.controls[google.maps.ControlPosition.TOP_LEFT].push($('#auto-c').get(0));
  map.controls[google.maps.ControlPosition.LEFT_TOP].push($('#show_visited').get(0));
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push($('#save').get(0));
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push($('#find_route').get(0));
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push($('.ms-parent:eq(0)').get(0));
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push($('.ms-parent:eq(1)').get(0));
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push($('#new_route').get(0));
  //Toggles map of visited markers when button is clicked.
  $("#show_visited_button").click(function() {
    var tempmap = null;
    if(!visit_visible) {
      tempmap = map; 
    }
    for(var i = 0; i < markers.length; i++) {
      if(markers[i].visited) {
        markers[i].setMap(tempmap);
      }
    }
    visit_visible = !visit_visible;
  });
   //listener for New route button which adds new route to multiple select menus
  $("#new_route_button").click(function() {
    if(newRoute) {
      $("#new_route").prepend("<input id='new_route_text' type='text' placeholder='Route Name'>");
      $("#new_route_button").attr("value","Create");
    }
    else {
      var route = "<option value='"
        + $("#new_route_text").val() + "'>"
        + $("#new_route_text").val() + "</option>";
      subG[$("#new_route_text").val()] = 0;
      $("select").append(route).multipleSelect("refresh");
      var get_sel = $("#route_view").multipleSelect('getSelects');
      get_sel.push($("#new_route_text").val());
      $("#route_view").multipleSelect('setSelects', get_sel);
      $("#new_route_text").remove();
      $("#new_route_button").attr("value","New Route");  
    }
    newRoute = !newRoute;
  });
  $('#find_route').click(function() {
    if(findRoute) {
      $("#find_route").attr("value","Calculate Route");
      findRoute = false;
    }
    else {
      $("#find_route").attr("value","Click A Point to Find it's Route");
      findRoute = true;

    }
  });
  //Listener for autocomplete to add a marker based on a search
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    var place = autocomplete.getPlace();
    if(typeof place.geometry !== 'undefined') {
      makeMarker({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        position: -1,
        name: place.name,
        address: place.formatted_address,
        ID: -1,    
        sub_group: null,
        group_key: null,
        edited: true
      });
      map.panTo(place.geometry.location);
      map.setZoom(16);
    }
  });
  //Listener for map that adds a marker when the map is double clicked.
  google.maps.event.addListener(map, 'dblclick', function(event) {
    makeMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      position: -1,
      name: "Location",
      address: "",
      ID: -1,    
      sub_group: null,
      group_key: null,
      visited: false,
      edited: true
    });
  });
  //ajax call for getting inital places and location on screen if user is signed in.
  $.ajax({
    url: 'ajax/get_places.php',
    data:{},
    dataType:'json',
    type:"POST",
    success:function(data) {
      //move screen to previous saved location
      if(data.status == "success") {
        map.panTo(new google.maps.LatLng(data.location.lat, data.location.lng));
        map.setZoom(data.location.zoom * 1);
        for(var i = 0; i < data.arr.length; i++){
          makeMarker(data.arr[i]);
        }
      }
      else {
        alert("get places failed");
      }
    },
    error:function(xhr, status, errorThrown){
      alert("error" + status + errorThrown);
    }
  });
  window.setInterval(function(){
    if(routeFound) {
      if(showNN) {
        pPolyRoute.setMap(null);
        nnPolyRoute.setMap(map);
        showNN = !showNN;
      }
      else {
        nnPolyRoute.setMap(null);
        pPolyRoute.setMap(map);
        showNN = !showNN;
      }
    }
  }, 1000);
}
//Adds map script elements to page.
function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&js?v=3.21$key=AIzaSyA0lAOq5lLPLFlJ6mxDOIvJK_5y1WBE28Y' +
      '&signed_in=false&callback=initialize';
  document.body.appendChild(script);
}
//Save Markers ajax call.
function update() {
  var out = []; //data out;
  var markOut = []; //markers whose data is going out.
  //structures data to proper form
  var count = 0;
  for(var i = 0; i < markers.length; i++) {
    var marker = markers[i];
    //changes boolean to int for database.
    var tempVisit = 0;
    if(marker.visited) {
      tempVisit = 1;
    }
    //Adds marker to be updated only if it has been updated.
    if(marker.edited) {
      out[count] = {
        id: marker.ID,
        number: marker.number,
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng(),
        title: marker.h1,
        address: marker.add,
        subgroup: marker.group,
        visited: tempVisit,
        del: marker.del
      };
      markOut[count] = marker;
      count++;
    }
  }
  //If a request isnt already in progress try and do an ajax call.
  if(!requestActive) {
    requestActive = true;
    var status = "Saved";
    var error = "";
    $.ajax({
      url: 'ajax/save_place.php',
      data: {
      array: out,
      lat: map.getCenter().lat(),
      lng: map.getCenter().lng(),
      zoom: map.getZoom(),
      },
      dataType:'json',
      type:"POST",
      success:function(data) {
        for(var i = data.length - 1; i >= 0; i--){
          if(data[i]["status"] == "Error") {
            if(data[i]["error"] == "Please Sign in or Login to save") {
              error = data[i]["error"];
            }
            else {
              alert(data[i]["error"]);
            }
            status = "Error";
          }
          else {
            var marker = markOut[i];
            //takes away marker edited flag.
            marker.edited = false;
            //deleted marker from markers if sucessfully deleted.
            if(data[i]["del"] == "yes") {
              markers.splice(i, 1);
            }
            else {
              //gives new markers their IDs 
              if(marker.ID == -1) {
                marker.ID = data[i].ID;
              }
            } 
          }
        }
        if(data.status == "Error") {
          status = "Error";
          error = data.error;
        }
        if(status == "Error") {
          alert(error);
        }
        //status of button reflects error status of ajax call.
        $("#save").attr("value", status);
      },
      error:function(xhr, status, errorThrown){
        status = "Error";
        for(var i = 0; i < data.length; i++){
          if(data[i]["status"] == "Error") {
            alert(data["error"]);
          }
        }
        $("#save").attr("value", status);
       
        

      }
    });
    //changes status of button back to save.
    setTimeout( function() {
      $("#save").attr("value", "Save");  
      }, 
      5000);
    requestActive = false;      
  }
}
//adds address from geocoder to the given marker based on marker's location.
function getAdd(marker) {
  geocoder.geocode({'location': marker.getPosition()}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        marker.add = results[0].formatted_address;
      } 
      else {
        window.alert('No results found');
      }
    } 
    else {
      marker.add = "";
    }
  });     
}
//Adds HTML content to the given infowindow of the given marker based on marker's properties.
function content(marker, infoWindow) {
  if(marker.visited) {
    infoWindow.setContent("<div class='info_window'><h1>" + marker.h1 + "</h1><p>" + marker.add +               
        "</p> Change name:<input type='text'>\
                          <input type='button' value='edit'><br>\
                          <input type='button' value='delete'>\
                          <input type='button' value='move'>\
                          <input type='button' name='visit' value='unvisit'></div>");
  }
  else {
    infoWindow.setContent("<div class='info_window'><h1>" + marker.h1 + "</h1><p>" + marker.add +               
        "</p> Change name:<input type='text'>\
                          <input type='button' value='edit'><br>\
                          <input type='button' value='delete'>\
                          <input type='button' value='move'>\
                          <input type='button' name='visit' value='visit'></div>");
  }
     
 }
 //Creates a marker from the given data array
function makeMarker(data) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(data["lat"], data["lng"]),
    map: null,
    //title: data["position"].toString(),
    draggable: false,
    number: parseInt(data["position"]),
    h1: data["name"],
    add: data["address"],
    ID: data["ID"],    
    visited: data["visited"] == 1,
    group: data["sub_group"],
    del: false,
    edited: data["edited"]
  });
  markers.push(marker);
  //If marker has a group.
  if(marker.group != "" && marker.group != null) {
    //If subgroup is not already represented in associative array add it.
    if(subG[marker.group] == null) {
      subG[marker.group] = marker.number;
    }
    //If marker's number is greater than number in subG make it the number in subG
    else if(subG[marker.group] < marker.number){
      subG[marker.group] = marker.number;
    }
    //If part of group but number is not updated (support weird errors?)
    if(marker.number == -1) {
      marker.number = subG[marker.group] + 1;
      subG[marker.group] = subG[marker.group] + 1;
    }
  }
  //if not visited put on map.
  if(!marker.visited) {
    marker.setMap(map);
  }
  //if no address use geocoder to find it.
  if(marker.add == "") {
      getAdd(marker);
  }
  //InfoWindow setup
  var infoWindow = new google.maps.InfoWindow({});
  google.maps.event.addListener(infoWindow, 'domready', function() {
    //changes the name of the location
    $('input[type="button"][value="edit"]').click(function() {
      $(this).siblings("h1").text(
        $(this).siblings("input[type='text']").val());
      marker.h1 = $(this).siblings("input[type='text']").val();
      marker.edited = true;
    });
    //deleted this marker from the map and flags it for deletion from the database.
    $('input[type="button"][value="delete"]').click(function() {
      marker.setMap(null);
      marker.del = true;
      marker.edited = true;
    });
    //Sets the marker to be draggable.
    $('input[type="button"][value="move"]').click(function() {
      marker.setDraggable(true);
    });
    //Changes if a location has been visited and toggles visibility of marker.
    $('input[type="button"][name="visit"]').click(function() {
      marker.edited = true;
      if(marker.visited) {
        $('input[type="button"][name="visit"]').attr("value", "visit");
      }
      else {
        $('input[type="button"][name="visit"]').attr("value", "unvisit");
        if(!visit_visible) {
          infoWindow.close();
          marker.setMap(null);
        }        
      }
      marker.visited = ! marker.visited;
    });   
  });
  //handler for clicking Markers
  google.maps.event.addListener(marker, 'click', function(event) {
    content(marker, infoWindow);
    //If findRoute button is clicked find and display the route found from this marker
    //and its associated route. 
    if(findRoute) {
      if(nnPolyRoute != null && pPolyRoute != null) {
        nnPolyRoute.setMap(null);
        pPolyRoute.setMap(null);
      }
      getDistTable(marker, true, 5, 100, function(distTable) {
        pPolyRoute = drawRoute(getNearestNeighbor(marker, distTable), '#FF0000');
        nnPolyRoute = drawRoute(bestProgressiveRoute(marker, distTable, 100), '#0000FF', true);
        routeFound = true;
        findRoute = false;
        $("#find_route").attr("value","Calculate Route");
      });
    }
    //if there is no route being added to open info window.
    else if(!add) {
      infoWindow.open(map, marker);
    }
    //Adds to route and changes point to route visibility.
    else {
      marker.group = route; //route changes based on the route selected in the multiple select menu.
      if(checkVisible(marker)) {
        if(marker.getMap() == null) {
          marker.setMap(map);
        }
      }
      else {
        if(marker.getMap() != null) {
          marker.setMap(null);
        }
      }
      //Changes marker properties to add it to the end of the route.
      marker.number = subG[marker.group] + 1;
      marker.label = marker.number;
      subG[marker.group] = subG[marker.group] + 1; 
      marker.edited = true;
    }
  });
  //Stops marker from being draggable if it has been dragged.
  google.maps.event.addListener(marker, 'dragend', function(event) {
    marker.edited = true;
    marker.setDraggable(false);
    getAdd(marker);
    content(marker, infoWindow);
  });      
}
window.onload = loadScript;
//Checks if the given marker is visible according to the muliple select dropdown menu.
function checkVisible(marker) {
  var routes = $("#route_view").multipleSelect("getSelects", "text");
  for (var i = routes.length - 1; i >= 0; i--) {
    if(marker.group.toString().trim() == routes[i].toString().trim()) {
      return true;
    }
  }
  return false;
}
//Returns the PolyLine represented by the points in arr in the given color.
function drawRoute(arr, color) {
  if(arr.length != 0){1
    arr.push(arr[0]);
  }
  for(var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].marker.getPosition();
  }
  var setRoute = new google.maps.Polyline({
    path: arr,
    geodesic: true,
    strokeColor: color,
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  return setRoute;
}
//Given a Marker returns an object containing an array representing the 
//distance between markers in the given markers route and the 
//nearest neighbor route starting from the starting mark. 
function getNearestNeighbor(startMark, distTable) {
  var curRoute = [];
  var finalRoute = [];
  var startIndex = 0;
  var count = 0;
  for(var i = 0; i < markers.length; i++) {
    if((markers[i].group == startMark.group 
      || ((startMark.group == "" && markers[i].group == null)
      || (startMark.group == null && markers[i].group == "")))
      && !markers[i].visited 
      && !markers[i].del) {
      curRoute.push({
        marker: markers[i],
        visited: false, 
        id: count
      });
      if(markers[i] == startMark) {
        startIndex = count;
      }
      count++;
    }
  }
  var currentIndex = startIndex;
  curRoute[startIndex].visited = true;
  finalRoute.push(curRoute[startIndex]);
  for(var i = 0; i < curRoute.length - 1; i++) {
    var minMark = null;
    var minDist = 0;
    for(var end = 0; end < distTable[currentIndex].length; end++) {
      if((distTable[currentIndex][end] < minDist || minDist == 0) 
      && !curRoute[end].visited) {
        minDist = distTable[currentIndex][end];
        minMark = curRoute[end];
      }
    }
    minMark.visited = true;
    finalRoute.push(minMark);
    currentIndex = minMark.id;
  }
  return finalRoute;
}
//Returns an array of objects with markers that is 
//the Progressive Nearest Neighbor route starting at startMark with 
//integer cycles number of progressive improvement calls. 
//Prints distance in miles to console.log if print is true. 
function bestProgressiveRoute(startMark, distTable, cycles, print) {
  var route = getNearestNeighbor(startMark, distTable);
  if(print){
    console.log("Nearest Neighbor Distance: " + routeDist(route, distTable) + " miles");   
  } 
  for(var i = 0; i < cycles; i++) {
      route = progressiveRoute(route, distTable);
    }
  if(print) {
    console.log("Progressive Nearest Neighbor Distance: " + routeDist(route, distTable) + " miles");
  }
  return route;
}
//Returns an array of objects with markers that finds the 
//largest imporvement to the given array arr by making two 
//markers be next to each other using distTable for distances. 
function progressiveRoute(arr, distTable) {
  var prevDist = routeDist(arr, distTable);
  var prevArr = arr;
  for (var elm1 = arr.length - 1; elm1 >= 0; elm1--) {
    for (var elm2 = arr.length - 1; elm2 >= 0; elm2--) {
      if(elm1 != elm2) {
        var tempArr = createRoute(arr, prevArr[elm1], prevArr[elm2]);
        var tempDist = routeDist(tempArr, distTable);

        if(tempDist < prevDist){
          prevArr = tempArr;
          prevDist = tempDist;
        }
      }
    };
  };
  return prevArr;
}
//Returns the array of objects with markers that is arr but with elm2 directly 
//after elm1. 
function createRoute(arr, elm1, elm2) {
  var outArr = [];
  for(var i = 0; i < arr.length; i++) {
    if(arr[i] == elm1) {
      outArr.push(elm1);
      outArr.push(elm2);
    }
    else if(arr[i] != elm2) {
      outArr.push(arr[i]);
    } 
  }
  return outArr;
} 
// Converts the given degree to radians
function degreesToRadian(degrees) {
        return degrees/180 * Math.PI ;
}
 
 
//Given a latitude and longitude in degrees and radius of a sphere returns the 
//haversine distance between the points on a sphere of radius in miles. 
function haversineDistance(lat1, long1, lat2, long2, radius) {
        var latrd1 = degreesToRadian(lat1);
        var longrd1 = degreesToRadian(long1);
       
        var latrd2 = degreesToRadian(lat2);
        var longrd2 = degreesToRadian(long2);
        
        var dLat = latrd2 - latrd1;
        var dLon = longrd2 - longrd1;
       
         var a = Math.sin(dLat / 2) * Math.sin(dLat /2) 
         + Math.sin(dLon / 2) * Math.sin(dLon /2) 
         * Math.cos(latrd1) * Math.cos(latrd2);
       var c = 2 * Math.asin(Math.sqrt(a));
        return radius * c * .621371192; //COnverts to miles 
}
 
 const radiusOfEarth = 6372.8; // in kilometers
// takes two LatLngs and computes the distance between them in miles. 
function getDist(latlng1, latlng2) {
  return haversineDistance(latlng1.lat(), latlng1.lng(), latlng2.lat(), latlng2.lng(), radiusOfEarth);
}
//Returns the numerical distance in miles of the given route which is ordered by marker in the 
//given arr with distances between markers IDs in the distTable. 
function routeDist(arr, distTable) {
  if(arr.length <= 1 ) {
    return 0;
  }
  var last = arr[0];
  var totalDist = 0;
  for(var i = 1; i < arr.length; i++){
    totalDist += distTable[last.id][arr[i].id];
    last = arr[i];
  }
  totalDist += distTable[last.id][arr[0].id];
  return totalDist;
}
//calls the given callback function with the Distance table which is an array of distances in miles
//between all of the markers in the same route as satrtMark according to their ordering in markers
//using google walking distance if useGoogle for the closest numtoGet markers less than mileCutoff
//to each marker. 
function getDistTable(startMark, useGoogle, numToGet, mileCutoff, callback) {
  var curRoute = [];
  var count = 0;
  for(var i = 0; i < markers.length; i++) {
    if((markers[i].group == startMark.group 
      || ((startMark.group == "" && markers[i].group == null)
      || (startMark.group == null && markers[i].group == "")))
      && !markers[i].visited 
      && !markers[i].del) {
      curRoute.push({
        marker: markers[i],
        id: count
      });
      count++;
    }
  }
  var distTable = [];
  for(var start = 0; start < curRoute.length; start++) {
    distTable[start] = [];
    for(var end = 0; end < curRoute.length; end++) {
      distTable[start][end] = 
      getDist(curRoute[start].marker.getPosition(), 
              curRoute[end].marker.getPosition()); 
    }
  }
  if(useGoogle) {
    getGoogleDistTable(curRoute, distTable, numToGet, mileCutoff, function(val) {
      callback(val);
    });
  }
  else {
    callback(distTable);
  }
} 
//calls the given callback function with the distTable updated with at most numToGet 
//minimum distances for each marker in arr 
//as long as it is below mileCutoff 
function getGoogleDistTable(arr, distTable, numToGet, mileCutoff, callback) {
  var promArr = [];
  for(var i = 0; i < (distTable.length + 1) / 2; i++) {
    var minArr = [];
    var maxMin = 0;
    for(var j = 0; j < (distTable.length + 1) / 2; j++) {
      if(i != j && (minArr.length < numToGet || distTable[i][j] < maxMin) 
        && distTable[i][j] < mileCutoff) {
        noChange = false;
        minArr.push({begin: i, end: j});
        if(minArr.length < numToGet && distTable[i][j] > maxMin) {
          maxMin = distTable[i][j];
        }
        else {
          var max = minArr[0];
          var tempArr = [];
          for(var k = 1; k < minArr.length; k++) {
            if(distTable[minArr[k].begin][minArr[k].end] > max) {
              tempArr.push(max);
              max = minArr[k];
            }
          }
        } 
      }
    }
    for(var j = 0; j < minArr.length; j++) {
      var cur = minArr[j];
      promArr.push(getGoogleDist(arr[cur.begin].marker, arr[cur.end].marker).then(
        function(tempArr) {
          return new Promise( function(resolve, reject) {
            distTable[cur.begin][cur.end] = tempArr[0][1];
            distTable[cur.end][cur.begin] = tempArr[1][0];
            resolve();
          });
        },
        function(tempArr) {
          return new Promise( function(resolve, reject) {
            reject();
          });
        }
      ));
    }    
  }
  Promise.all(promArr).then(
    function() {
      callback(distTable);
    },
    function() {
      alert("Cannot find distances between markers");
    });  
}
//Returns a Promise with the 2D array of distances to an from the given markers according to google walking directions. 
function getGoogleDist(marker1, marker2) {
  return new Promise(function(resolve, reject) {
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
    {
      origins: [marker1.getPosition(), marker2.getPosition()],
      destinations: [marker1.getPosition(), marker2.getPosition()],
      travelMode: google.maps.TravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.IMPERIAL
    }, 
    function(response, status){
      if (status == google.maps.DistanceMatrixStatus.OK) {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        var outArr = [];
        for (var i = 0; i < origins.length; i++) {
          var results = response.rows[i].elements;
          outArr[i] = [];
          for (var j = 0; j < results.length; j++) {
            if(results[j].status == "OK"){
              outArr[i][j] = results[j].distance.value * 0.000621371;
            }
          }
        }
        resolve(outArr);
      }
      else {
        reject("error");
      }
    });
  });
}
//Prints to console information on the distances of the routes produced by
//the nearest neighbor and progressive nearest neighbor algoithms. 
//route is the string name of the route and cycle is the number
//of cycles to use for the progressive nearest neighbor algorithm
//useGoogle is a boolean that is to decide if you use google walking
//distance as a way to measure distances,
//numToGet is how many points closest to a marker, but less tha mileCutoff
// should be updated to the Google walking distance    
function statsForRoute(route, cycles, useGoogle, numToGet, mileCutoff) {
  var curRoute = [];
  for(var i = 0; i < markers.length; i++) {
    if((markers[i].group == route 
      || ((route == "" && markers[i].group == null)
      || (route == null && markers[i].group == "")))
      && !markers[i].visited
      && !markers[i].del) {
      curRoute.push(markers[i]);
    }
  }
  var nnDist = 0;
  var pDist = 0;
  var nnMin = -1; 
  var pMin = -1;
  var minPRoute = null;
  var minNNRoute = null;
  getDistTable(curRoute[0], useGoogle, numToGet, mileCutoff, function(distTable) {
    for(var i = 0; i < curRoute.length; i++) {
      var tempNN = getNearestNeighbor(curRoute[i], distTable);
      var tempP = bestProgressiveRoute(curRoute[i], distTable, cycles, false);
      var tempDNN = routeDist(tempNN, distTable); 
      var tempDP = routeDist(tempP, distTable);
      if(tempDNN < nnMin || nnMin == -1) {
        nnMin = tempDNN;
        minNNRoute = tempNN;
      }
      if(tempDP < pMin || pMin == -1) {
        pMin = tempDP;
        minPRoute = tempP; 
      }
      nnDist += tempDNN;
      pDist += tempDP;
    }
    if(curRoute.length > 1) {
      routeFound = true;
      if(nnPolyRoute != null && pPolyRoute != null) {
        nnPolyRoute.setMap(null);
        pPolyRoute.setMap(null);
      }
      nnPolyRoute = drawRoute(minNNRoute, "#FF0000");
      pPolyRoute = drawRoute(minPRoute, "#0000FF");
      var avNNDist = nnDist / curRoute.length;
      var avPDist = pDist / curRoute.length;
      console.log("Nearest Neighbor:");
      console.log("    Average: " + avNNDist);
      console.log("    Min: " + nnMin);
      console.log("Progressive:");
      console.log("    Average: " + avPDist);
      console.log("    Min: " + pMin);
    }
  });
}