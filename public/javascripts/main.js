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