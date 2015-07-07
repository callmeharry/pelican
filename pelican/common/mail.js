/**
 * Created by GYX on 15/6/27.
 */

var nodeMailer = require('nodemailer');
var Imap = require("imap");
var MailParser = require("mailparser").MailParser;


var imapconn =null;


function mail(option) {
    this.smtp = option.smtp || "";
    this.smtpPort = option.smtpPort || "";
    this.imap = option.imap || "";
    this.imapPort = option.imapPort || "";
    this.mailAddress = option.mailAddress || "";
    this.password = option.password || "";


    this.transporter=null;


    this._mailbox=null;
    this._cb=null;
    this._onerror=null;
}
    mail.prototype.setMailOption = function(otherOption){
        this.smtp = otherOption.smtp || "";
        this.smtpPort = otherOption.smtpPort || "";
        this.imap = otherOption.imap || "";
        this.imapPort = otherOption.imapPort || "";
        this.mailAddress = otherOption.mailAddress || "";
        this.password = otherOption.password || "";
    };

    //当然你也可以直接通过变量获取
    mail.prototype.getMailOption = function(){
        return {smtp:this.smtp,smtpPort:this.smtpPort,
            imap:this.imap,imapPort:this.imapPort,
            mailAddress:this.mailAddress,password:this.password};
    };



    /**
     * var mailOptions = {
        from: 'Fred Foo  <foo@blurdybloop.com>', // sender address
        to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
        subject: 'Hello ', // Subject line
        text: 'Hello world ', // plaintext body
        html: '<b>Hello world </b>' // html body
    };
     callback =function(error, info){
    if(error){
        console.log(error);
    }else{

        console.log('Message sent: ' +info.message);
    }};
     */
    //发送邮件
    mail.prototype.sendMail=function(mailOptions,callback){
        if(!this.smtp||!this.smtpPort||!this.mailAddress||!this.password){
            return {success:0,error:"Error,mail option is not enough"};
        }
        this.transporter = nodeMailer.createTransport("SMTP",{
            host:this.smtp,
            port:this.smtpPort,
            secureConnection:true,
            auth: {
                user: this.mailAddress,
                pass: this.password
            }
        });
        this.transporter.sendMail(mailOptions,callback);
    };

    //停止SMTP连接
    mail.prototype.stopSMTPConnection = function(){
        if(this.transporter==null)
            return {success:0,error:"please start smtp again"};
        this.transporter.close();
    };







    /** searchFilter:
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
    */


    /**
     *  北航邮箱的文件夹
     *  { INBOX: { attribs: [], delimiter: '/', children: null, parent: null },
      Drafts:
       { attribs: [ '\\Drafts' ],
         delimiter: '/',
         children: null,
         parent: null,
         special_use_attrib: '\\Drafts' },
      'Sent Items':
       { attribs: [ '\\Sent' ],
         delimiter: '/',
         children: null,
         parent: null,
         special_use_attrib: '\\Sent' },
      Trash:
       { attribs: [ '\\Trash' ],
         delimiter: '/',
         children: null,
         parent: null,
         special_use_attrib: '\\Trash' },
      'Junk E-mail':
       { attribs: [ '\\Junk' ],
         delimiter: '/',
         children: null,
         parent: null,
         special_use_attrib: '\\Junk' },
      'Virus Items': { attribs: [], delimiter: '/', children: null, parent: null } }
        */
     mail.prototype.openBox=function(mailbox,searchFilter,cb,onerror) {
         this._cb =cb;
         this._mailbox = mailbox;
         this._onerror = onerror;
         var self= this;
         if(!imapconn){
            if(!this.imap||!this.imapPort||!this.mailAddress||!this.password){
                return {success:0,error:"Error,mail option is not enough"};
            }
            imapconn= new Imap({
                user:this.mailAddress,
                password:this.password,
                host:this.imap,
                port:this.imapPort,
                tls: true,
                tlsOptions: { rejectUnauthorized: false },
                attachments:false
            });
            imapconn.once('error', this._onerror);
            imapconn.once('ready',function(){
                self._openbox(searchFilter);

            });
            imapconn.connect();
         }
         else
         {
             self._openbox(searchFilter);
         }
     };

    mail.prototype.getFullMail=function(mailbox,messageId,cb,onerror) {
        this._cb =cb;
        this._mailbox = mailbox;
        this._onerror = onerror;
        var self= this;
        if(!imapconn){
            if(!this.imap||!this.imapPort||!this.mailAddress||!this.password){
                return {success:0,error:"Error,mail option is not enough"};
            }
            imapconn= new Imap({
                user:this.mailAddress,
                password:this.password,
                host:this.imap,
                port:this.imapPort,
                tls: true,
                tlsOptions: { rejectUnauthorized: false },
                attachments:false
            });
            imapconn.once('error', this._onerror);
            imapconn.once('ready',function(){
                self._getFullMail(messageId);

            });
            imapconn.connect();
        }
        else
        {
            self._getFullMail(messageId);
        }
    };

     mail.prototype.killImap= function(){
        imapconn.end();
        imapconn=undefined;
     };


    mail.prototype._openbox =function(searchFilter){
        var self = this;
        imapconn.openBox(this._mailbox, false,
            function(err, box){
                if (err) throw err;
                imapconn.search(searchFilter, function(err, results) {
                    if (err) throw err;
                    if(results.length>0) {
                        var f = imapconn.fetch(results, {bodies: 'HEADER'});
                        f.on('message', function (msg) {
                            var mailparser = new MailParser();
                            msg.on('body', function (stream, info) {
                                stream.pipe(mailparser);
                                mailparser.on("end", function (mail) {
                                    mail.messageId = mail.headers["message-id"];
                                    delete mail.headers;
                                    self._cb(mail);
                                })
                            });
                        });
                        f.once('error', function (err) {
                            console.log('Fetch error: ' + err);
                        });
                    }
                });
            });
    };

    mail.prototype._getFullMail=function(messageId){
        var self = this;
        imapconn.openBox(this._mailbox, false,
            function(err, box){
                if (err) throw err;
                imapconn.search([["header","message-id",messageId]], function(err, results) {
                    if (err) throw err;
                    if(results.length>0){
                        var f = imapconn.fetch(results, { bodies: '' });
                        f.on('message', function(msg) {
                            var mailparser = new MailParser();
                            msg.on('body', function(stream, info) {
                                stream.pipe( mailparser );
                                mailparser.on("end",function( mail ){
                                    mail.messageId=mail.headers["message-id"];
                                    delete mail.headers;
                                    self._cb(mail);
                                    console.log(mail);
                                })
                            });
                        });
                        f.once('error', function(err) {
                            console.log('Fetch error: ' + err);
                        });
                    }
                });
            });
    };




    mail.prototype.imapTest =function(cb){

        if(!this.imap||!this.imapPort||!this.mailAddress||!this.password){
            return {success:0,error:"Error,mail option is not enough"};
        }

        conn= new Imap({
            user:this.mailAddress,
            password:this.password,
            host:this.imap,
            port:this.imapPort,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
            connTimeout:1000
        });


        conn.once("error",function(){
            cb(103,"无法连接到imap服务器");
        });


        conn.once('ready',function(){
            cb(0,'success');
        });

        conn.connect();

    };


    mail.prototype.getAll=function(cb){
        this.openBox("INBOX",["ALL"],cb);
    };


    mail.prototype.getSince =function(time,cb){
        this.openBox("INBOX",[["SINCE",time]],cb);
    };

    mail.prototype.getUnseen=function(cb){
        this.open("INBOX",["UNSEEN"],cb);
    };


module.exports = mail;





