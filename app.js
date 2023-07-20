const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const speakeasy = require('speakeasy');

const app = express();
const port = 3000;

const password = 'mypassword';

// configurare middleware pentru sesiune
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));

// configurare middleware pentru analiza datelor din formular
app.use(bodyParser.urlencoded({ extended: false }));

// ruta pentru afisarea formularului de autentificare
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// ruta pentru procesarea formularului de autentificare
app.post('/login', (req, res) => {
  const email = req.body.email;
  const enteredPassword = req.body.password;

  // verificare parola
  if (enteredPassword !== password) {
    res.send('Invalid password. Please try again.');
    return;
  }

  let arr = [];
        while (arr.length < 6) {
          const number = Math.floor(Math.random() * 10);
          if (arr[arr.length - 1] != number  && arr[arr.length - 1] + 1 != number) {
            arr.push(number);
          } 
        }
    
  const concatenated = arr.join('');
  const code = parseInt(concatenated);
  console.log(code);   

  // salvez codul in sesiune
  req.session.code = code;

  console.log('Verification code:', code);

  // redirectionare catre pagina de verificare
  res.redirect('/verify');
});

// ruta pentru afisarea formularului de verificare
app.get('/verify', (req, res) => {
  res.sendFile(__dirname + '/verify.html');
});

// ruta pentru procesarea formularului de verificare
app.post('/verify', (req, res) => {
  const enteredCode = req.body.code;
  const savedCode = req.session.code;

  if (enteredCode === savedCode.toString()) {
    console.log('Verification code is valid. User is authenticated.');
    res.send('You have been successfully authenticated.');
  } else {
    console.log('Verification code is invalid. User authentication failed.');
    res.send('Invalid verification code. Please try again.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
