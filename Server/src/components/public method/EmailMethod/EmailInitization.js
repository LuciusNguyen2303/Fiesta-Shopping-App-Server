const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth: {
      user: process.env.emailHost,
      pass: process.env.passwordEmailHost
    }
  });

const emailTemplatePath = path.join(__dirname, 'EmailVerifiation.html');
const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');


const sendEmail = async (email,verificationCode) =>{
    if(!verificationCode){
        console.log("Verification Code is not a number");
        return
        
    }
    if(!email){
        console.log("Email is empty");
        return
    }
    if(!new RegExp("^[\\w\\.-]+@[a-zA-Z\\d\\.-]+\\.[a-zA-Z]{2,6}$").test(email)){
        console.log("Email is invalid");
        return
    }
  
        const newEmailTemplate = emailTemplate.replace("{{code}}",verificationCode)
        let mailOptions = {
            from:  process.env.emailHost,
            to: email,
            subject: 'Verification Code',
            html: newEmailTemplate, 
          };
          try {
            const resultEmail=  await transporter.sendMail(mailOptions);

            return resultEmail
            } catch (error) {
            console.log("ERROR SENDING THE EMAIL "+email+": ",error);
            return null
          }
     
          
   
    
}
module.exports={sendEmail}