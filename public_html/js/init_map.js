var num = 0;
var map; //The Google Map Object
var geocoder; //The Google Geocoder Object
var markers = []; //Array of Markers in the current Map
var requestActive = false; //Is there an Ajax request going on currently
var autocomplete; //The Google Autocomplete object
var newRoute = true; //Should a new route be made if the route button is clicked
var add = false; //Should 
var route = null; //What route should markers be added to.
var subG = {}; //? 
var visit_visible = false;
var pos; //Position of the page
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
        if(markers[i].getMap() == null && ! markers[i].del) {
          markers[i].setMap(map);
        }
      }
    },
    onUncheckAll: function() { //Removes all items that are part of a route.
      for(var i = 0; i < markers.length; i++) {
        if(markers[i].group != null) {
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
            markers[i].setMap(map);
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
    position: 'top',
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
   //listener for New route button.
  $("#new_route_button").click(function() {
    if(newRoute) {
      $("#new_route").prepend("<input id='new_route_text' type='text' placeholder='Route Name'>");
      $("#new_route_button").attr("value","Create");
    }
    else {
      var route = "<option value='"
        + $("#new_route_text").val() + "'>"
        + $("#new_route_text").val() + "</option>";
      $("select").append(route).multipleSelect("refresh");
      var get_sel = $("#route_view").multipleSelect('getSelects');
      get_sel.push($("#new_route_text").val());
      $("#route_view").multipleSelect('setSelects', get_sel);
      $("#new_route_text").remove();
      $("#new_route_button").attr("value","New Route");
    }
    newRoute = !newRoute;
  });
  //Listener for autocomplete to add a marker based on a search
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    var place = autocomplete.getPlace();
    makeMarker({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      position: num++,
      name: place.name,
      address: place.formatted_address,
      ID: -1,    
      sub_group: null,
      group_key: null,
      edited: true
    });
    map.panTo(place.geometry.location);
    map.setZoom(15);
  });
  //Listener for map that adds a marker when the map is double clicked.
  google.maps.event.addListener(map, 'dblclick', function(event) { //TODO ABSTRACT
    makeMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      position: num++,
      name: "Location",
      address: "",
      ID: -1,    
      sub_group: null,
      group_key: null,
      visited: false,
      edited: true
    });
  });
  //ajax call for getting inital places if user is signed in.
  $.ajax({
    url: 'ajax/get_places.php',
    data:{},
    dataType:'json',
    type:"POST",
    success:function(data) {
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
}
function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&v=3.exp$key=AIzaSyA0lAOq5lLPLFlJ6mxDOIvJK_5y1WBE28Y' +
      '&signed_in=false&callback=initialize';
  document.body.appendChild(script);
}
//Save Markers ajax call.
function update() {
  var group = $("#group").text();
  var out = [];
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
        group: group,
        subgroup: marker.group,
        visited: tempVisit,
        del: marker.del
      };
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
            var marker = markers[i];
            if(data[i]["del"] == "yes") {
              markers.splice(i, 1);
            }
            else {
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
    setTimeout( function() {
      $("#save").attr("value", "Save");  
      }, 
      5000);
    requestActive = false;      
  }
}
//adds address from geocoder for the given marker.
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
//Adds content to the infowindow of the given marker.
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
 //Creates a marker from the given data
function makeMarker(data) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(data["lat"], data["lng"]),
    map: null,
    title: data["position"].toString(),
    draggable: false,
    number: data["position"],
    h1: data["name"],
    add: data["address"],
    ID: data["ID"],    
    visited: false,
    group: data["sub_group"],
    del: false,
    edited: data["edited"]
  });
  markers.push(marker);
  if(data["visited"] == 1) {
    marker.visited = true;
  }
  else {
    marker.setMap(map);
  }

  if(data["position"] > num) { //TODO
    num = data["position"];  
  }
  if(marker.add == "") {
      getAdd(marker);
  }
  //InfoWindow setup
  var infoWindow = new google.maps.InfoWindow({});
  google.maps.event.addListener(infoWindow, 'domready', function() {
    $('input[type="button"][value="edit"]').click(function() {
      $(this).siblings("h1").text(
        $(this).siblings("input[type='text']").val());
      marker.h1 = $(this).siblings("input[type='text']").val();
      marker.edited = true;
    });
    $('input[type="button"][value="delete"]').click(function() {
      marker.setMap(null);
      marker.del = true;
      marker.edited = true;
    });
    $('input[type="button"][value="move"]').click(function() {
      marker.setDraggable(true);
    });
    $('input[type="button"][name="visit"]').click(function() {
      marker.edited = true;
      if(marker.visited) {
        $('input[type="button"][name="visit"]').attr("value", "visit");
      }
      else {
        $('input[type="button"][name="visit"]').attr("value", "unvisit");
        if(!visit_visible) {
          marker.setMap(null);
        }        
      }
      marker.visited = ! marker.visited;
    });   
  });
  google.maps.event.addListener(marker, 'click', function(event) {
    content(marker, infoWindow);
    if(!add) {
      infoWindow.open(map, marker);
    }
    else {
      marker.group = route;
    }
  });
  google.maps.event.addListener(marker, 'dragend', function(event) {
    marker.edited = true;
    marker.setDraggable(false);
    getAdd(marker);
    content(marker, infoWindow);
  });      
}
window.onload = loadScript;