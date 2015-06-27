/**
 * Created by GYX on 15/6/27.
 */
var Mail = require("../mail.js");
/**
 *
 *  请不要上我的邮箱。。
 */
var mail = new Mail({
    smtphost:"smtp.buaa.edu.cn",
    smtpport:465,
    imaphost:"mail.buaa.edu.cn",
    imapport:993,
    user:"gyxln@buaa.edu.cn",
    pass:"69568440"
});

mail.startSMTPConnection();
var mailOptions = {
    from: 'gyxln@buaa.edu.cn', // sender address
    to: '450024927@qq.com', // list of receivers
    subject: 'Hello ', // Subject line
    text: 'Hello world ', // plaintext body
    html: '<b>Hello world </b>' // html body
};
var callback =function(error, info){
    if(error){
        console.log(error);
    }else{

        console.log('Message sent: ' +info.message);
    }};

mail.sendMail(mailOptions,callback);

mail.createMailListener(["UNSEEN"],
    function(mail){
        console.log(mail);
    }
);