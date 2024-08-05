require('dotenv').config();

const form = document.querySelector('form')

function sendEmail() {
Email.send({
    Host : "smtp.elasticemail.com",
    Username : "Yodyainc@gmail.com",
    Password : "0700B3EA6D793CA0FAD1B808ADF09ED97AD8d",
    To : 'Yodyainc@gmail.com',
    From : "Yodyainc@gmail.com",
    Subject : "This is the subject",
    Body : "And this is the body"
}).then(
  message => alert(message)
);
}

form.addEventListener ("submit", (e) => {
e.preventDefault();

sendEmail(); 
});