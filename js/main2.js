// Shuffle function
function shuffleAlphabet() {
    var ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y"];
    var array = ALPHABET;
    var currIndex = array.length, tempVal, randIndex;

    // while there are still elements to shuffle
    while (0 !== currIndex) {
        // pick a remaining element
        randIndex = Math.floor(Math.random() * currIndex);
        currIndex -= 1;

        // swap it with current element
        tempVal = array[currIndex];
        array[currIndex] = array[randIndex];
        array[randIndex] = tempVal;
    }

    return array;
}

$(function() {
    // constants
    var ALPHABET = shuffleAlphabet();
    var TIMER_TIME = 5;
    var CURR_QUESTION_ID = 0;
    var CURR_QUESTION_LETTER = 'A';
    var TEAM_VOID = 3;
    var TEAM_BLUE = 1;
    var TEAM_RED = 2;

    // add every alphabet to an html element
    var lettersHTML = "";
    for (var i = ALPHABET.length - 1; i >= 0; i--) {
        lettersHTML += '<div class="col-xs-2 auts-number letter-' + ALPHABET[i]
                    + '">' + '<a data-toggle="modal" data-id="' + ALPHABET[i]
                    + '"><span>' + ALPHABET[i] + '</span></a></div>';
    };

    $('#main > div.row').html(lettersHTML);

    // container is the DOM element
    var container = $(".auts-number a span");
    container.shuffleLetters({
        "step": 20
    });

    // a letter is clicked
    $(document).on("click", ".auts-number a", function() {
        CURR_QUESTION_LETTER = $(this).data("id");
        $("#auts-question-label").text("Letter " + CURR_QUESTION_LETTER);
        $("#auts-questionnaire").modal("show");

        // reset timer when questionnaire is opened
        $("#auts-timer-label").text("Start timer");

        $.ajax({
            type: 'GET',
            url: '/question.php',
            data: {
                letter: $(this).data("id")
            },
            dataType: 'json'
        })
          .done(function (data) {
            // put question in modal body
            $("#auts-question").text(data[0]['question']);

            // update current question id
            CURR_QUESTION_ID = data[0]['id'];
          })
          .fail(function (data) {
            console.log('Show question for letter ' + CURR_QUESTION_LETTER + ' failed!');
          });
    });

    // timer start is clicked
    $(document).on("click", "#auts-timer-btn", function () {
        // update timer label
        $("#auts-timer-label").text(TIMER_TIME);
        var counter = 0;
        var interval = setInterval(function() {
            counter++;
            // update timer label
            $("#auts-timer-label").text((TIMER_TIME  - counter));

            // display 'counter' wherever you want to display it
            if (counter == TIMER_TIME) {
                $("#auts-timer-label").text("Time is up!");
                clearInterval(interval);
            }
        }, 1000);
    });

    // show answer is clicked
    $(document).on("click", "#auts-show-ans", function() {
        $.ajax({
            type: 'GET',
            url: '/answer.php',
            data: {
                id: CURR_QUESTION_ID,
                update: "false"
            },
            dataType: 'json'
        })
          .done(function (data) {
            // put question in modal body
            $("#auts-question").text(data[0]['question']);
            $("#auts-question").append(' - <em>' + data[0]['answer'] + '</em>');
          })
          .fail(function (data) {
            console.log('Show answer for letter ' + CURR_QUESTION_LETTER + ' failed!');
          });
    });

    // show question is clicked
    $(document).on("click", "#auts-show-q", function() {
        $("#auts-question").removeClass('hidden');
        $("#auts-hide-q").removeClass('hidden');
        $("#auts-show-q").addClass('hidden');
    });

    // show question is clicked
    $(document).on("click", "#auts-hide-q", function() {
        $("#auts-question").addClass('hidden');
        $("#auts-hide-q").addClass('hidden');
        $("#auts-show-q").removeClass('hidden');
    });

    // team void clicked
    $(document).on("click", ".btn-void", function() {
        console.log('Letter ' + CURR_QUESTION_LETTER + ' goes to Team Void');

        // add team color
        $(".letter-" + CURR_QUESTION_LETTER).removeClass('blue');
        $(".letter-" + CURR_QUESTION_LETTER).removeClass('red');
        $(".letter-" + CURR_QUESTION_LETTER).addClass('void');
    });

    // team blue clicked
    $(document).on("click", ".btn-blue", function() {
        console.log('Letter ' + CURR_QUESTION_LETTER + ' goes to Team Blue');

        // add team color
        $(".letter-" + CURR_QUESTION_LETTER).removeClass('void');
        $(".letter-" + CURR_QUESTION_LETTER).removeClass('red');
        $(".letter-" + CURR_QUESTION_LETTER).addClass('blue');
    });

    // team red clicked
    $(document).on("click", ".btn-red", function() {
        console.log('Letter ' + CURR_QUESTION_LETTER + ' goes to Team Red');

        // add team color
        $(".letter-" + CURR_QUESTION_LETTER).removeClass('void');
        $(".letter-" + CURR_QUESTION_LETTER).removeClass('blue');
        $(".letter-" + CURR_QUESTION_LETTER).addClass('red');
    });
});
