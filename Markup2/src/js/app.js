(function($) {

    var $telInput = $("#phone"),
        $errorMsg = $("#error-msg"),
        $validMsg = $("#valid-msg"),
        $stepContainerFirst = $('#step-1'),
        $stepContainerSecond = $('#step-2');

    $telInput.intlTelInput({
        initialCountry: "auto",
        geoIpLookup: function(callback) {
            $.get('http://ipinfo.io', function() {}, "jsonp").always(function(resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
            });
        },
        utilsScript: "../../bower/intl-tel-input/build/js/utils.js"
    });

    $telInput.on("keyup change", iputTelReset);

    $(document).on("input", "#phone", function() {
        this.value = this.value.replace(/[a-z]+$/i, '');
    });

    // on blur: validate
    $telInput.blur(function() {
        iputTelReset();
        validateInput();
    });

    function iputTelReset() {
        $telInput.removeClass("error");
        $errorMsg.addClass("hide");
        $validMsg.addClass("hide");
    }

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

    $('.last-digits').mask('00-00', { placeholder: '__-__' });

    $('#getRecall').submit(function(e) {

        if ($('#phone').val() === "" || !$telInput.intlTelInput("isValidNumber")) {
            $telInput.addClass("error");
            $errorMsg.removeClass("hide");
            return false;
        } else {
            e.preventDefault(); // Prevent Default Submission 
            $.ajax({
                type: "POST",
                url: 'submit.php',
                success: function() {
                    $stepContainerFirst.hide();
                    $('#yourNumber').html($telInput.intlTelInput("getNumber"));
                    $stepContainerSecond.show();
                    $('.last-digits').focus();
                    $('#time').startTimer({
                        onComplete: function(element) {
                            element.parent().fadeOut();
                            setTimeout(function() {
                                $('.btn-recall').fadeIn();
                            }, 700);
                        }
                    });
                }
            });


        }
    });

    $('.btn-recall').on('click', function() {
        $(this).fadeOut();
        $('#time').parent().empty();
        setTimeout(function() {
            $('.block-recall .content').append('Повторить через <span class="timer" id="time" data-seconds-left=60></span> секунд');
            $('#time').startTimer({
                onComplete: function(element) {
                    element.parent().fadeOut();
                    setTimeout(function() {
                        $('.btn-recall').fadeIn();
                    }, 700);
                }
            });
            $('.block-recall .content').fadeIn();
        }, 700);
    });

}(jQuery));

// function countdown(elementName, minutes, seconds) {
//     var element, endTime, hours, mins, msLeft, time;

//     function twoDigits(n) {
//         return (n <= 9 ? "0" + n : n);
//     }

//     function updateTimer() {
//         msLeft = endTime - (+new Date);
//         if (msLeft < 1000) {
//             element.parentNode.innerHTML = '<a href="#" class="btn-recall">Повторить звонок</a>';
//             elementName = document.querySelector('.btn-recall');
//         } else {
//             time = new Date(msLeft);
//             hours = time.getUTCHours();
//             mins = time.getUTCMinutes();
//             element.innerHTML = (hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds());
//             setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
//         }
//     }

//     element = document.getElementById(elementName);
//     endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
//     updateTimer();
// }
