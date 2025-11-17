/*global WildRydes _config*/
var WildRydes = window.WildRydes || {};
WildRydes.map = WildRydes.Map();

(function rideScopeWrapper($) {
    function requestUnicorn(pickupLocation) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/ride',
            headers: {}, // No auth header needed
            data: JSON.stringify({
                PickupLocation: pickupLocation
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occurred when requesting your unicorn:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {
        var unicorn;
        var pronoun;
        console.log('Response received from API: ', result);
        unicorn = result.Unicorn;
        pronoun = unicorn.Gender === 'Male' ? 'his' : 'her';
        displayUpdate(unicorn.Name + ', your ' + unicorn.Color + ' unicorn, is on ' + pronoun + ' way.');
        animateArrival(function animateCallback() {
            displayUpdate('Set your pickup location.');
            WildRydes.map.unsetLocation();
            $('#request').prop('disabled', 'disabled');
            $('#request').text('Set Pickup');
        });
    }

    // Register click handler immediately
    $(function onDocReady() {
        $('#request').click(handleRequestClick);
        $('#request').prop('disabled', false); // Enable button
        WildRydes.authToken = Promise.resolve("fake-token");
    });

    function handleRequestClick(event) {
        var pickupLocation = WildRydes.map.selectedPoint;
        event.preventDefault();
        requestUnicorn(pickupLocation);
    }

    function animateArrival(callback) {
        var dest = WildRydes.map.selectedPoint;
        var origin = {};
        if (dest.latitude > WildRydes.map.center.latitude) {
            origin.latitude = dest.latitude - 0.01;
        } else {
            origin.latitude = dest.latitude + 0.01;
        }
        if (dest.longitude > WildRydes.map.center.longitude) {
            origin.longitude = dest.longitude - 0.01;
        } else {
            origin.longitude = dest.longitude + 0.01;
        }
        WildRydes.map.animate(origin, dest, callback);
    }

    function displayUpdate(text) {
        $('#updates').text(text);
    }
}(jQuery));