/**
 * Created by GYX on 15/6/27.
 */

var nodeMailer = require('nodemailer');
var mailListener = require("mail-listener2");

function mail(option) {
    this.smtphost = option.smtphost || "";
    this.smtpport = option.smtpport || "";
    this.imaphost = option.imaphost || "";
    this.imapport = option.imapport || "";
    this.user = option.user || "";
    this.pass = option.pass || "";

    this.listener=null;
    this.transporter=null;
}
    mail.prototype.setMailOption = function(otherOption){
        this.smtphost=otherOption.smtphost||"";
        this.smtpport=otherOption.smtpport||"";
        this.imaphost=otherOption.imaphost||"";
        this.imapport=otherOption.imapport||"";
        this.user=otherOption.user||"";
        this.pass=otherOption.pass||"";
    };

    //当然你也可以直接通过变量获取
    mail.prototype.getMailOption = function(){
        return {smtphost:this.smtphost,smtpport:this.smtpport,
            imaphost:this.imaphost,imapport:this.imapport,
            user:this.user,pass:this.pass};
    };

    mail.prototype.startSMTPConnection = function(){
        if(!this.smtphost||!this.smtpport||!this.user||!this.pass){
            return {success:0,error:"Error,mail option is not enough"};
        }
        this.transporter = nodeMailer.createTransport("SMTP",{
            host:this.smtphost,
            port:this.smtpport,
            secureConnection:true,
            auth: {
                user: this.user,
                pass: this.pass
            }
        });
        return {success:1};
    };

    /**
     * var mailOptions = {
        from: 'Fred Foo ✔ <foo@blurdybloop.com>', // sender address
        to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ✔', // plaintext body
        html: '<b>Hello world ✔</b>' // html body
    };
     callback =function(error, info){
    if(error){
        console.log(error);
    }else{

        console.log('Message sent: ' +info.message);
    }};
     */
    mail.prototype.sendMail=function(mailOptions,callback){
        if(this.transporter==null)
            return {success:0,error:"please start smtp again"};
        this.transporter.sendMail(mailOptions,callback);



        
    };

    this.stopSMTPConnection = function(){
        if(this.transporter==null)
            return {success:0,error:"please start smtp again"};
        this.transporter.close();
    };

    /**
     *
     * searchFilter:
     *       case 'ALL':
             case 'ANSWERED':
             case 'DELETED':
             case 'DRAFT':
             case 'FLAGGED':
             case 'NEW':
             case 'SEEN':
             case 'RECENT':
             case 'OLD':
             case 'UNANSWERED':
             case 'UNDELETED':
             case 'UNDRAFT':
             case 'UNFLAGGED':
             case 'UNSEEN':
     *
     *  onmail is a function like
     *  function(mail){
            console.log(mail);
        }
     *
     *  when you don't want to listen any more
     *  you should call listener.stop();
     */
    mail.prototype.createMailListener = function(mailbox,searchFilter,onmail,onattachment){
        if(!this.imaphost||!this.imaphost||!this.user||!this.pass){
            return {success:0,error:"Error,mail option is not enough"};
        }
        this.listener = new mailListener({
            username: this.user,
            password: this.pass,
            host: this.imaphost,
            port: this.imapport,
            tls: true,
            searchFilter:searchFilter,           //All unseen seen
            tlsOptions: { rejectUnauthorized: false },
            mailbox: mailbox,
            markSeen: true,
            fetchUnreadOnStart: true,
            attachments: false
           // attachmentOptions: { directory: "attachment/" }
        });
        this.listener.start();


        this.listener.on("server:connected", function(){
            console.log("imapConnected");
        });

        this.listener.on("server:disconnected", function(){
            console.log("imapDisconnected");
        });

        this.listener.on("error", function(err){
            console.log(err);
        });
        this.listener.on("mail",onmail);

        //listener.on("attachment", onattachment);
        return this.listener;

    };





module.exports = mail;





