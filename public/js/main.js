const numberInput = document.getElementById('number');
const textInput = document.getElementById('msg');
const response = document.querySelector('.response');
const button = document.getElementById('button');

button.addEventListener("click", send, false)

const socket = io();
socket.on('smsStatus', function(data){
    response.innerHTML = '<h5>Textmessage send to ' + data.number +'</h5>';
})


function send() {
    const number = numberInput.value.replace(/\D/g, "");
    const text = textInput.value;

    fetch('/',{
        method: "post",
        headers:{
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ number: number, text: text})
    }).then(function(res){
        console.log(res);
    }).catch(function(err){
        console.log(err)
    })
}

