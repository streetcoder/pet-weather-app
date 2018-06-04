/**
 * Created by streetcoder on 6/2/18.
 */


// init autocomplete and get lat and lng
function initAutocomplete() {
    var input = document.getElementById('location');
    var searchBox = new google.maps.places.SearchBox(input);

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if(places.length == 0){
            return;
        }
        places.forEach(function(place){
            if(!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            $("#latitude").val(place.geometry.location.lat());
            $("#longitude").val(place.geometry.location.lng());

        });
    });
}

// make lat and lng field readonly
$(".readonly").keydown(function(e){
    e.preventDefault();
});

// get address
function get_address_by_lat_lng() {
    var input = document.getElementById('latlng').value;
    var latlngStr = input.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': latlng}, function(results, status) {

        if (status === 'OK') {
            if (results[0]) {
                $(".petaddress").text(results[0].formatted_address);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}

// display pet in interactive Google map
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom:2,
        //center: new google.maps.LatLng(28.535516,77.391026),
        center: new google.maps.LatLng(46.0730555556, -100.546666667),
        mapTypeId: 'terrain'
    });

    var infowindow = new google.maps.InfoWindow();

    $.get( "http://localhost:8080/api/pets", function( data ) {
        for(var i = 0; i < data.length; i++ ){

            var latLng = new google.maps.LatLng(data[i].latitude,data[i].longitude);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: data[i].latitude
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    var pet_html = "<ul class='pet_on_marker'><li>Name: " + data[i].name + "</li>" +
                        "<li>Type: " + data[i].type + "</li>" +
                        "<li>Breed: " + data[i].breed + "</li>" +
                        "<li>Latitude: " + data[i].latitude + "</li>" +
                        "<li>Longitude: " + data[i].longitude + "</li>" +
                        "</ul>";
                    infowindow.setContent(pet_html);
                    infowindow.open(map, marker);
                }
            })(marker, i));

        }
    });
}
