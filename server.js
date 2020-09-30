const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const Nexmo = require('nexmo')
const socketio = require('socket.io')

//Init Nexmo
const nexmo = new Nexmo({
    apiKey: '7991237d',
    apiSecret: '5K5EZRJYj25xNK1f'
  }, { debug: true });

//Init app
const app = express()

//Template Engine setup
app.set('view engine','html')
app.engine('html',ejs.renderFile)

//public folder setup
app.use(express.static(__dirname+ '/public'))

//Body Parser Middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//Index Route
app.get('/',(req,res)=>{
    res.render('index')
})

//Catch form submit
app.post('/',(req,res)=>{
    res.send(req.body);
    console.log(req.body);

   const number = req.body.number;
   const text = req.body.text; 

   nexmo.message.sendSms(
       '917021226336', number, text, {type: 'unicode'},
       (err,responseData)=>{
           if(err){
            console.log(err)
           }else{
               console.dir(responseData)
               //Get data from response
               const data = {
                   id: responseData.messages[0]['message-id'],
                   number: responseData.messages[0]['to']
               }
               //Emit to the client
               io.emit('smsStatus', data)
           }
       }
   );

})

//define port
const port = 3000

//start server
const server = app.listen(port, ()=>console.log(`server started on port ${port}`))

//Connect to socket.io
const io = socketio(server);
io.on('connection',(socket)=>{
    console.log('connected')
    io.on('disconnect', () => {
        console.log('Disconnected');
      })
})