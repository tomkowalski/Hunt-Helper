var num = 0;
var map;
var geocoder;
var markers = [];
var requestActive = false;
var autocomplete;
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
    center: pos,
    mapTypeControl: true,
    disableDoubleClickZoom: true, 
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
  };
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  $("nav").after('<input id="auto-c" class="controls" type="text" placeholder="Enter a location">'
    + '<div class="form">'
    + '<input id="save" type="button" value="Save Places">'
    + '</div>'
    + '<input id="new_route" type="button" value="New Route">');
   $("#save").click(update);
   $('#route_select').multipleSelect({
    placeholder: "Select Routes",
    onOpen: function() {
      $("#new_route").hide();
    },
    onClose: function() {
      $("#new_route").show();
    },
    onCheckAll: function() {
      for(var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    },
    onUncheckAll: function() {
      for(var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
    },
    onClick: function(view) {
      //alert(view.label + view.checked);
      for(var i = 0; i < markers.length; i++) {
        if(markers[i].group != null 
        && markers[i].group.trim() 
        == view.label.trim()) {
          if(view.checked) {
            markers[i].setMap(map);
          }
          else {
            markers[i].setMap(null);
          }
        }
      }
    }
  });
  $("select").multipleSelect("checkAll");
  autocomplete = new google.maps.places.Autocomplete($('#auto-c').get(0));
  autocomplete.bindTo('bounds', map);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push($('#auto-c').get(0));
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push($('#save').get(0));
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push($('.ms-parent').get(0));
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push($('#new_route').get(0));

google.maps.event.addListener(autocomplete, 'place_changed', function() {
    var place = autocomplete.getPlace();
    makeMarker({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      position: num++,
      name: place.name,
      address: place.formatted_address,
      ID: -1,    
      sub_group: 0,
      group_key: null
    });
    map.panTo(place.geometry.location);
    map.setZoom(15);
  });

  google.maps.event.addListener(map, 'dblclick', function(event) {
    makeMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      position: num++,
      name: "Location",
      address: "",
      ID: -1,    
      sub_group: 0,
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
      '&signed_in=false&callback=initialize';
  document.body.appendChild(script);
}
function update() {

  var group = $("#group").text();
  var out = [];
  for(var i = 0; i < markers.length; i++) {
    var marker = markers[i];
    out[i] = {
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
    };
  }
  if(!requestActive) {
    requestActive = true;
    var status = "Saved";
    var error = "";
    $.ajax({
      url: 'ajax/save_place.php',
      data: {
      array: out
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
    requestActive = false;      
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
                          <input type='button' value='edit'><br>\
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