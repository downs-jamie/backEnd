
$(document).ready(function(){


    var timer = new Timer();
    $('.startButton').click(function () {
        timer.start();
        console.log("start")
    });
    $('.pauseButton').click(function () {
        timer.pause();
    });
    $('.stopButton').click(function () {
        timer.stop();
    });
    $('.resetButton').click(function () {
        timer.reset();
    });
    timer.addEventListener('secondsUpdated', function (e) {
        $('.values').html(timer.getTimeValues().toString());
    });
    timer.addEventListener('started', function (e) {
        $('.values').html(timer.getTimeValues().toString());
    });
    timer.addEventListener('reset', function (e) {
        $('.values').html(timer.getTimeValues().toString());
    });
})




//MAKING A COUNT UP TIMER TO TIME THE USER ONN HOW LONG IT TAKES THEM TO FINISH
    //STARTS ONCE THEY CHOOSE THEIR DIFFICULTY
// console.log('test')
// $(document).ready(function(){


//     var test;
//     $("#start-timer").click(function(){
//         console.log('start')
//         var totalSeconds = 0;

//         test = setInterval(function(){
//             ++totalSeconds;
//             var seconds = totalSeconds
//             $("#timer").html(seconds)
//         }, 1000);

//     });
//     //STOPS ONCE THEY CLICK ON STOP TIMER
//     $("#stop-timer").click(function(event){
//         clearInterval(test);
//         console.log("click")
//     });
// })