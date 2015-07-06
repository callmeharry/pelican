/**
 * Created by GYX on 15/6/27.
 */

var nodeMailer = require('nodemailer');
var Imap = require("imap");
var MailParser = require("mailparser").MailParser;





function mail(option) {
    this.smtp = option.smtp || "";
    this.smtpPort = option.smtpPort || "";
    this.imap = option.imap || "";
    this.imapPort = option.imapPort || "";
    this.mailAddress = option.mailAddress || "";
    this.password = option.password || "";


    this.transporter=undefined;
    this.imapconn=undefined;



    this._searchFilter=undefined;
    this._mailbox=undefined;
    this._cb=undefined;
    this._onerror=undefined;
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
        if(this.transporter==null)
            return {success:0,error:"please start smtp again"};
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
         this._searchFilter=searchFilter;
         this._cb =cb;
         this._mailbox = mailbox;
         this._onerror = onerror;
         this.getImap();

     };


     mail.prototype.getImap = function(){
        var self= this;

        if(!this.imapconn){

            if(!this.imap||!this.imapPort||!this.mailAddress||!this.password){
                return {success:0,error:"Error,mail option is not enough"};
            }

            this.imapconn= new Imap({
                user:this.mailAddress,
                password:this.password,
                host:this.imap,
                port:this.imapPort,
                tls: true,
                tlsOptions: { rejectUnauthorized: false }
            });



            this.imapconn.once('error', this._onerror);

            this.imapconn.once('ready',function(){
                console.log('ready');
                self.imapconn.openBox(self._mailbox,false,self.parse);
            });

            this.imapconn.connect();


        }
        else{
            self.imapconn.openBox(self._mailbox,false,self.parse);
        }
     };

     mail.prototype.killImap= function(){
        this.imapconn.end();
        this.imapconn=undefined;
     };




    mail.prototype.parse=function(err, box){
        var self =this;
        console.log("open");
        var imap = self.imapconn;
        if (err) throw err;
        imap.search(self._searchFilter, function(err, results) {
            if (err) throw err;
            var f = imap.fetch(results, { bodies: '' });
            f.on('message', function(msg) {
                var mailparser = new MailParser();
                msg.on('body', function(stream, info) {
                    stream.pipe( mailparser );
                    mailparser.on("end",function( mail ){
                        //fs.writeFile('msg-' + seqno + '-body.html', mail.html, function (err) {
                        delete mail.headers;
                        delete mail.messageId;
			            /*
                        if(mail.attachments){
                            for(var i=0;i<mail.attachments.length;i++){
                                delete mail.attachments[i].content;
                            }
                        }
			            */
                        self._cb(mail);
                    })
                });
            });
            f.once('error', function(err) {
                console.log('Fetch error: ' + err);
            });
        });
     }


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





