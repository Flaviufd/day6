const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');

// Configurați transportul Maildrop
const transporter = nodemailer.createTransport({
    host: 'smtp.maildrop.cc',
    port: 587,
    secure: false,
    auth: {
      user: 'twofactorauth',
      //pass: 'your-maildrop-password',
    },
  });

// Generați o cheie secretă pentru autentificarea în doi pași
const secret = speakeasy.generateSecret({ length: 20 });

// Trimiteți codul de verificare pe email
function sendVerificationCode(email) {
  const verificationCode = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
  });

  // Definiți opțiunile e-mailului
    const mailOptions = {
      from: 'twofactorauth@maildrop.cc',
      to: 'twofactorauth@maildrop.cc',
      subject: 'Test Maildrop Email',
      text: 'This is a test email sent using Maildrop',
  };
  

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification code:', error);
    } else {
      console.log('Verification code sent successfully:', info.response);
    }
  });
}

// Verificați codul de verificare introdus de utilizator
function verifyCode(code) {
  const verificationResult = speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: code,
    window: 1,
  });

  return verificationResult;
}

// Exemplu de utilizare
const userEmail = 'twofactorauth@maildrop.cc';

// Trimiteți codul de verificare pe email
sendVerificationCode(userEmail);

// Verificați codul de verificare introdus de utilizator
const userCode = '123456'; // Cod introdus de utilizator
const isCodeValid = verifyCode(userCode);

if (isCodeValid) {
  console.log('Verification code is valid. User is authenticated.');
} else {
  console.log('Verification code is invalid. User authentication failed.');
}
