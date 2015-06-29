/**
 * Created by GYX on 15/6/27.
 */

var nodeMailer = require('nodemailer');
var Imap = require("imap");
var MailParser = require("mailparser").MailParser;



var _searchFilter;
var _mailbox;
var _cb;
var _imap;


function mail(option) {
    this.smtphost = option.smtphost || "";
    this.smtpport = option.smtpport || "";
    this.imaphost = option.imaphost || "";
    this.imapport = option.imapport || "";
    this.user = option.user || "";
    this.pass = option.pass || "";

    this.transporter=undefined;
    this.imapconn=undefined;
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
     mail.prototype.openBox=function(mailbox,searchFilter,cb) {
        _searchFilter=searchFilter;
        _cb =cb;
        _mailbox = mailbox;
        this.getImap();
     };


     mail.prototype.getImap = function(){
        //改这里
        var self = this;

        if(!this.imapconn){

            if(!this.imaphost||!this.imaphost||!this.user||!this.pass){
                return {success:0,error:"Error,mail option is not enough"};
            }

            this.imapconn= new Imap({
                user:this.user,
                password:this.pass,
                host:this.imaphost,
                port:this.imapport,
                tls: true,
                tlsOptions: { rejectUnauthorized: false }
            });



            this.imapconn.once('error', function(err) {
                console.log(err);
            });

            this.imapconn.once('ready',function(){
                console.log('ready');
                this.openBox(_mailbox,false,parse);
            });

            this.imapconn.connect();
            _imap=this.imapconn;

        }
        else{
            this.imapconn.openBox(_mailbox,false,parse);
        }
     };

     mail.prototype.killImap= function(){
        this.imapconn.end();
        this.imapconn=undefined;
        _imap=undefined;
     };




     function parse(err, box){
        var self =mail;
        console.log("open");
        var imap = _imap;
        if (err) throw err;
        imap.search(_searchFilter, function(err, results) {
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

                        if(mail.attachments){
                            for(var i=0;i<mail.attachments.length;i++){
                                delete mail.attachments[i].content;
                            }
                        }
                        _cb(mail);
                    })
                });
            });
            f.once('error', function(err) {
                console.log('Fetch error: ' + err);
            });
        });
     }



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





