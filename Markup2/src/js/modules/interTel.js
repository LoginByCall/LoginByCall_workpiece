var interTel = (function($) {
    'use strict';

    var $telInput = $("#phone"),
        $errorMsg = $("#error-msg"),
        $validMsg = $("#valid-msg"),
        pluginName = "intlTelInput";

    function reset() {
        $telInput.removeClass("error");
        $errorMsg.addClass("hide");
        $validMsg.addClass("hide");
    };

    function validateInput() {
        if ($.trim($telInput.val())) {
            if ($telInput.intlTelInput("isValidNumber")) {
                $validMsg.removeClass("hide");
            } else {
                $telInput.addClass("error");
                $errorMsg.removeClass("hide");
            }
        }
    }

    function events() {
        // on keyup / change flag: reset
        $telInput.on("keyup change", reset);

        // on blur: validate
        $telInput.blur(function() {
            reset();
            validateInput();
        });
    }

    function init() {
        // initialise plugin
        $telInput.intlTelInput({
            geoIpLookup: function(callback) {
                $.get('http://ipinfo.io', function() {}, "jsonp").always(function(resp) {
                    var countryCode = (resp && resp.country) ? resp.country : "";
                    callback(countryCode);
                });
            },
            utilsScript: "../../bower/intl-tel-input/build/js/utils.js"
        });

        events();
    }

    return {
        init: init
    }


}(jQuery));

export default interTel;
