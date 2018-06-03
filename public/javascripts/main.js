/**
 * Created by streetcoder on 6/2/18.
 */
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