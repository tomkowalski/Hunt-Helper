var num = 0;
var map;
var geocoder;
var markers = [];
function initialize() {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(42.3601, -71.0589)
  };
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  google.maps.event.addListener(map, 'click', function(event) {
    var marker = new google.maps.Marker({
      position: event.latLng,
      map: map,
      title: num.toString(),
      draggable: false,
      number: num,
      h1: "location",
      add: "",
      id: -1,    
      visited: false,
      group: null
    });
    markers.push(marker);
    num++;
    getAdd(marker);
    var infoWindow = new google.maps.InfoWindow({});
    google.maps.event.addListener(infoWindow, 'domready', function() {
      $('input[type="button"][value="edit"]').click(function() {
        $(this).siblings("h1").text(
          $(this).siblings("input[type='text']").val());
        marker.h1 = $(this).siblings("input[type='text']").val();
      });
      $('input[type="button"][value="delete"]').click(function() {
        marker.setMap(null);
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
  alert(group);
  for(var i = 0; i < markers.length; i++) {
    var marker = markers[i];
    $.ajax({
      url: 'ajax/save_place.php',
      data:{
        id: marker.id,
        number: marker.number,
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng(),
        title: marker.h1,
        address: marker.add,
        group: group,
        subgroup: marker.group,
        visited: marker.visited
      },
      dataType:'json',
      type:"POST",
      success:function(data) {
        $("#save").attr("value", data);
      },
      error:function(xhr, status, errorThrown){
        $("#save").attr("value","Error");
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
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });     
}
function content(marker, infoWindow) {
  infoWindow.setContent("<h1>" + marker.h1 + "</h1><p>" + marker.add +               
        "</p> Change name:<input type='text'><input type='button' value='edit'> <input type='button' value='delete'> <input type='button' value='move'>");
      
}

window.onload = loadScript;