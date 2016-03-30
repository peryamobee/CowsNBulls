function Server(){
    var http = new Http('//ply-bulls-and-cows.herokuapp.com');
    var token ='';

    return {
        startGame: function (){
            return http.get('game').then(function (data) {
                token = data.token;
                return data;
            });
        },
        guess:function(guess){
            // check for 4 uniq digit
            guess = Array.from(new Set(guess.split(''))).join('');
            if(guess.length != 4) return Promise.reject('Must be 4 uniq digits');
            if(guess.match(/\D/)) return Promise.reject('No digit included');

            return http.post('game',token,{
                guess:guess
            })
        }
    }
}

function Game(){
    var guessNumber = 0;
    var server = Server();

    moveTo_stageSplash();

    h.component('screen','welcome',function (behavior) {

        behavior('start-btn', function () {
            console.log('into welcome scree');
            server.startGame().then(function () {
                console.log('start game');
                moveTo_stageGame();
            });
        });


    });
    
    h.component('screen','board',function (behavior, input) {
        $('.attempts-number').innerText = 0;

        behavior('send-guess-btn',function () {
            var inputUserGuess = input('user-geuss');
            var guessValue = inputUserGuess.value;
            inputUserGuess.focus();
            server.guess( guessValue ).then(function (data) {
                $('.massage').innerText = '';
                guessNumber++;
                $('.attempts-number').innerText = guessNumber;
                inputUserGuess.value = '';
                setTimeout(function () {
                    inputUserGuess.focus();
                },2000);


                var tr = document.createElement('tr');
                tr.className = 'new';
                tr.innerHTML = `
                    <td>${guessNumber}</td>
                    <td>${data.bulls}</td>
                    <td>${data.cows || 0}</td>
                    <td>${guessValue}</td>`
                ;
                $('#historyBody').insertBefore(tr, $('#historyBody tr:first-child'));
                setTimeout(function () {
                    tr.classList.remove('new');
                });

                if(data.bulls == 4){
                    moveTo_stageEndGame();
                }
            }).catch(function (msg) {
                $('.massage').innerText = msg;

            });
        })
    });

    h.component('screen','end-game',function (behavior, input) {
        behavior('start-btn', function () {
            server.startGame().then(function () {
                console.log('start game');
                moveTo_stageGame();
            });
        });

    });

    function moveTo_stageSplash(){
        document.body.classList.add('stage-0');
        document.body.classList.remove('stage-1');
        document.body.classList.remove('stage-2');
    }

    function moveTo_stageGame(){
        document.body.classList.remove('stage-0');
        document.body.classList.add('stage-1');
        document.body.classList.remove('stage-2');
    }

    function moveTo_stageEndGame(){
        $('.total-attempts-number').innerText = guessNumber;
        localStorage.guess = localStorage.guess || guessNumber;
        if( localStorage.guess > guessNumber ){
            localStorage.guess = guessNumber;
        }

        $('.best-attempts-number').innerText = localStorage.guess;
        $('.previous-attempts-number').innerText = localStorage.previousGuess || 'no previous';
        localStorage.previousGuess = guessNumber;

        document.body.classList.remove('stage-0');
        document.body.classList.remove('stage-1');
        document.body.classList.add('stage-2');

    }
}
window.addEventListener('load',function ()  {
  Game();
});
