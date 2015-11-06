var map;
var markers = [];
var cur;
var requestActive = false;
const curPin = {
                url:"assets/curPin.png"
                };
const otherPin = {
                  url:"assets/otherPin.png"
                  };
window.onload = function () {
  var mapOptions = {
    zoom: 7,
    center: new google.maps.LatLng(38.8833, -77.0167),
    mapTypeControl: true,
    disableDoubleClickZoom: true, 
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);
  $('#route_select').multipleSelect({
    placeholder: "Select Route",
    single: true,
    position: 'bottom',
    onClick: function(view) { //if a route is cicked updates Map to the first place in that route.
      for (var i = markers.length - 1; i >= 0; i--) {
        markers[i].setMap(null);
      }
      markers = [];
      getRoute(view.label.trim(), false);
      setTimeout( function() {
          if(cur != null) {
            $("#place-name").html("<h1>" + cur.h1 + "</h1>");
            $("#place-add").html("<h2>" + cur.add + "</h2>");
            cur.setIcon(curPin);
            map.panTo(cur.getPosition());
            map.setZoom(16);  
          }
        }, 
        500);
    }
  });
  $("#next").click(function() {
    var marker = getMarker(true);
    setTimeout( function() {
        if(marker != null) {
          $("#place-name").html("<h1>" + marker.h1 + "</h1>");
          $("#place-add").html("<h2>" + marker.add + "</h2>");
          map.panTo(marker.getPosition());
          map.setZoom(16); 
          cur.setIcon(otherPin);
          cur = marker; 
          cur.setIcon(curPin);
        }
      }, 
      500);
  });

  $("#prev").click(function() {
    var marker = getMarker(false);
    setTimeout( function() {
        if(marker != null) {
          $("#place-name").html("<h1>" + marker.h1 + "</h1>");
          $("#place-add").html("<h2>" + marker.add + "</h2>");
          map.panTo(marker.getPosition());
          map.setZoom(16); 
          cur.setIcon(otherPin);
          cur = marker; 
          cur.setIcon(curPin);
        }
      }, 
      500);
  });
  $("#visited").click(function() {
    if(!(cur == null)) {
      cur.visited = true;
      cur.edited = true;
      cur.setMap(null);
      update();
      var marker = getMarker(true);
      setTimeout( function() {
          if(marker != null) {
            $("#place-name").html("<h1>" + marker.h1 + "</h1>");
            $("#place-add").html("<h2>" + marker.add + "</h2>");
            map.panTo(marker.getPosition());
            map.setZoom(16);
            cur.setIcon(otherPin);
            cur = marker;
            cur.setIcon(curPin);
          }
        }, 
        500);
    }
  });

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push($('.ms-parent:eq(0)').get(0));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push($('#visited').get(0));
  map.controls[google.maps.ControlPosition.RIGHT_CENTER].push($('#next').get(0));
  map.controls[google.maps.ControlPosition.LEFT_CENTER].push($('#prev').get(0));
  getRoute(null, true);
};
//Adds content to the infowindow of the given marker.
function content(marker, infoWindow) {
  if(marker.visited) {
    infoWindow.setContent("<div class='info_window'><h1>" + marker.h1 + "</h1><p>" + marker.add +               
        "<input type='button' name='visit' value='unvisit'></div>");
  }
  else {
    infoWindow.setContent("<div class='info_window'><h1>" + marker.h1 + "</h1><p>" + marker.add);              
        //"<input type='button' name='visit' value='visit'></div>");
  }
     
 }
 //Creates a marker from the given data
function makeMarker(data) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(data["lat"], data["lng"]),
    map: null,
    title: data["position"].toString(),
    draggable: false,
    number: parseInt(data["position"]),
    h1: data["name"],
    add: data["address"],
    ID: data["ID"],    
    visited: false,
    group: data["sub_group"],
    del: false,
    icon: otherPin,
    edited: data["edited"]
  });
  markers.push(marker);
  if(data["visited"] == 1) {
    marker.visited = true;
  }
  else {
    marker.setMap(map);
  }
  if(marker.add == "") {
      getAdd(marker);
  }
  //InfoWindow setup
  var infoWindow = new google.maps.InfoWindow({});
  google.maps.event.addListener(infoWindow, 'domready', function() {
    $('input[type="button"][name="visit"]').click(function() {
      marker.edited = true;
      if(marker.visited) {
        //$('input[type="button"][name="visit"]').attr("value", "visit");
      }
      else {
        //$('input[type="button"][name="visit"]').attr("value", "unvisit");
          marker.setMap(null);  
      }
      marker.visited = ! marker.visited;
    });   
  });
  google.maps.event.addListener(marker, 'click', function(event) {
    content(marker, infoWindow);
    infoWindow.open(map, marker);
  });  
  return marker;  
}
 //ajax call for getting markers in route.
function getRoute(route, firstTime) {
  $.ajax({
    url: 'ajax/get_places.php',
    data:{route: route},
    dataType:'json',
    type:"POST",
    success:function(data) {
      if(data.status == "success") {
        if(firstTime){
          map.panTo(new google.maps.LatLng(data.location.lat, data.location.lng));
          map.setZoom(data.location.zoom * 1);
        }
        else {         
          var minMark = null;
          var minNum = -1;
          for(var i = 0; i < data.arr.length; i++){
            var marker = makeMarker(data.arr[i]);
            if(!marker.visited 
              && (parseInt(marker.number) < minNum || minNum == -1)) {
              minMark = marker;
              minNum = parseInt(marker.number); 
            }
          }
          cur = minMark;
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
  return cur;
}
function getMax() {
  var max = 0;
  for (var i = markers.length - 1; i >= 0; i--) {
    if(parseInt(markers[i].number) > max) {
      max = parseInt(markers[i].number);
    }
  }
  return max;
}
function getMin() {
  var min = 0;
  var found = false;
  for (var i = markers.length - 1; i >= 0; i--) {
    if(parseInt(markers[i].number) < min 
      || !found) {
      min = parseInt(markers[i].number);
      found = true;
    }
  }
  return min;
}
//
function getMarker(next) {
  if(cur != null) {
    var nexti  = cur.number;
    if(cur.number == getMin() && !next) {
      nexti = getMax();
    }
    else if (cur.number == getMax() && next) {
      nexti = getMin();
    }  
    else if(next) {
      nexti = cur.number + 1;
    }
    else {
      nexti = cur.number - 1;
    }
    var index = -1;
    var mark = null;
    for (var i = markers.length - 1; i >= 0; i--) {
      var marker = markers[i];
      var num = parseInt(marker.number);
      if(!marker.visited) {
        if(next) {
          if(num >= nexti 
            && (num < index
              || index == -1 )) {
            mark = marker;
            index = num;
          }
        }
        else {
          if(num <= nexti  
            && (num > index
              || index == -1)) {
            mark = marker;
            index = num;
          }
        }
      }
    }
  }
  return mark;
} 

function update() {
  var out = [];
  //structures data to proper form
  out[0] = {
    id: cur.ID,
    number: cur.number.toString(),
    lat: cur.getPosition().lat(),
    lng: cur.getPosition().lng(),
    title: cur.h1,
    address: cur.add,
    subgroup: cur.group,
    visited: true,
    del: cur.del
  };
  //If a request isnt already in progress try and do an ajax call.
  if(!requestActive) {
    requestActive = true;
    var status = "Saved";
    var error = "";
    $.ajax({
      url: '../ajax/save_place.php',
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
        $("#visited").attr("value", status);
      },
      error:function(xhr, status, errorThrown){
        status = "Error";
        for(var i = 0; i < data.length; i++){
          if(data[i]["status"] == "Error") {
            alert(data["error"]);
          }
        }
        $("#visited").attr("value", status);
      }
    });
    setTimeout( function() {
      $("#visited").attr("value", "Visit");  
      }, 
      5000);
    requestActive = false;      
  }
}