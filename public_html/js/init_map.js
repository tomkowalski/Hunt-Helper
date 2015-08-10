var num = 0;
var map;
var geocoder;
var markers = [];
function initialize() {
  var pos = new google.maps.LatLng(42.3601, -71.0589);
  /*if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
    });
  }*/

    
  var mapOptions = {
    zoom: 10,
    center: pos
  };
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  google.maps.event.addListener(map, 'click', function(event) {
    makeMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      position: num++,
      name: "Location",
      address: "",
      ID: -1,    
      group_key: null
    });
  });
  var group = $("#group").text();
  $.ajax({
      url: 'ajax/get_places.php',
      data:{
        group: group,
      },
      dataType:'json',
      type:"POST",
      success:function(data) {
        if(data[0] == "success") {
          for(var i = 1; i < data.length; i++){
            makeMarker(data[i]);
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
      '&signed_in=true&callback=initialize';
  document.body.appendChild(script);
  $("#save").click(update);
}
function update() {
  var group = $("#group").text();
  for(var i = 0; i < markers.length; i++) {
    var marker = markers[i];
    $.ajax({
      url: 'ajax/save_place.php',
      data:{
        id: marker.ID,
        number: marker.number,
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng(),
        title: marker.h1,
        address: marker.add,
        group: group,
        subgroup: marker.group,
        visited: marker.visited,
        del: marker.del
      },
      dataType:'json',
      type:"POST",
      success:function(data) {
        $("#save").attr("value", data["status"]);
        if(data["status"] == "Error") {
          alert(data["error"]);
        }
        else {
          marker.ID = data["ID"];
        }
      },
      error:function(xhr, status, errorThrown){
        $("#save").attr("value","Error");
        if(data["status"] == "Error") {
          alert(data["error"]);
        }
      }
    });
  }
}
function getAdd(marker) {
  geocoder.geocode({'location': marker.getPosition()}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        marker.add = results[0].formatted_address;
      } else {
        window.alert('No results found');
      }
    } 
    else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });     
}
function content(marker, infoWindow) {
  infoWindow.setContent("<h1>" + marker.h1 + "</h1><p>" + marker.add +               
        "</p> Change name:<input type='text'>\
                          <input type='button' value='edit'>\
                          <input type='button' value='delete'>\
                          <input type='button' value='move'>\
                          <input type='button' value='visit'>");
     
 }
function makeMarker(data) {
  var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data["lat"], data["lng"]),
      map: map,
      title: data["position"].toString(),
      draggable: false,
      number: data["position"],
      h1: data["name"],
      add: data["address"],
      ID: data["ID"],    
      visited: false,
      group: data["sub_group"],
      del: false
    });
    markers.push(marker);
    if(data["position"] > num) {
      num = data["position"];  
    }
    if(marker.add == "") {
        getAdd(marker);
    }
    var infoWindow = new google.maps.InfoWindow({});
    google.maps.event.addListener(infoWindow, 'domready', function() {
      $('input[type="button"][value="edit"]').click(function() {
        $(this).siblings("h1").text(
          $(this).siblings("input[type='text']").val());
        marker.h1 = $(this).siblings("input[type='text']").val();
      });
      $('input[type="button"][value="delete"]').click(function() {
        marker.setMap(null);
        marker.del = true;
      });
      $('input[type="button"][value="move"]').click(function() {
        marker.setDraggable(true);
      });
      $('input[type="button"][value="visit"]').click(function() {
        $('input[type="button"][value="visit"]').attr("value", "unvisit");
        marker.visited = ! marker.visited;
      });
      
    });
    google.maps.event.addListener(marker, 'click', function(event) {
      content(marker, infoWindow);
      infoWindow.open(map, marker);
    });
    google.maps.event.addListener(marker, 'dragend', function(event) {
      marker.setDraggable(false);
      getAdd(marker);
      content(marker, infoWindow);
      });      
}
window.onload = loadScript;