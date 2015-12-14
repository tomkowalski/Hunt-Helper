var out = [];
var requestActive = false;
var geocoder;
function init() {
	geocoder = new google.maps.Geocoder();
	$("#mass_save").click(function() {
		var markers = $("#mass_place").val().split('\n');
		var out = [];
		var group = $("#group").text();
		for(var i = 0; i < markers.length; i++) {
			var marker = markers[i];
			var title = marker.split(",")[0];
			if(!isNaN(title)) {
				title = marker;
			}
 			geocoder.geocode({'address': marker}, function(results, status) {
    			if (status === google.maps.GeocoderStatus.OK) {
      				out[i] = {
			    		id: -1,
			    		number: null,
			    		lat: results[0].geometry.location.lat(),
			    		lng: results[0].geometry.location.lng(),
			   			title: title,
			    		address: marker,
			   			group: group,
			    		subgroup: null,
			    		visited: 0,
			    		del: "false"
					};
    			} else {
      				alert('Geocode was not successful for the following reason: ' + status);
    			}
  			});
	    }
	    alert(out);
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
	       		$("#mass_save").attr("value", status);
	      	}
	    });
	    requestActive = false;      
		}
	});
}
function loadScript() {
	var script = document.createElement('script');
  		script.type = 'text/javascript';
  		script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&v=3.exp$key=AIzaSyA0lAOq5lLPLFlJ6mxDOIvJK_5y1WBE28Y' +
      '&signed_in=true&callback=init';
  	document.body.appendChild(script);
}
window.onload = loadScript;