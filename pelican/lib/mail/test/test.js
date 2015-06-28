/**
 * Created by GYX on 15/6/27.
 */
var Mail = require("../mail.js");

/**
 * 设置基本信息
 * @type {mail|exports|module.exports}
 */
var mailControl = new Mail({
    smtphost:"smtp.buaa.edu.cn",
    smtpport:465,
    imaphost:"mail.buaa.edu.cn",
    imapport:993,
    user:"gyxln@buaa.edu.cn",
    pass:"69568440"


});

/**
 * 发邮件的准备
 */
mailControl.startSMTPConnection();
var mailOptions = {
    from: 'gyxln@buaa.edu.cn', // sender address
    to: '450024927@qq.com', // list of receivers
    subject: 'Hello ', // Subject line
    text: 'Hello world ', // plaintext body
    html: '<b>Hello world </b>' // html body
};
/**
 * 发送完毕的回调
 * @param error
 * @param info
 */
var callback =function(error, info){
    if(error){
        console.log(error);
    }else{

        console.log('Message sent: ' +info.message);
    }};

/**
 * 发送邮件
 */
mailControl.sendMail(mailOptions,callback);




var index =0;
/**
 * 接收邮件
 */
mailControl.createMailListener("Sent Items",["ALL"],
    function(mail) {
        console.log(index++ + " : ");
        if(mail.attachments){
            /**
             * 把所有附件的content字段都删掉了，我害怕这个数据很大
             */
            for (var i = 0; i < mail.attachments.length; i++) {
                delete mail.attachments[i].content;
            }
        }

            console.log(mail);
    }
);


Mail.test();

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


/**
 * mail format
 * 7 :
 { html: '<div style="font:14px/1.5 \'Lucida Grande\', \'微软雅黑\';color:#333;">12211114 郭耀星<br><div><div style="font: 14px/1.5 \'Lucida Grande\';"><br></div></div></div>',
   headers:
    { 'x-guid': '05B08423-F3D7-26BF-825B-DC98B54B8915',
      from: '"gyxln"<gyxln@buaa.edu.cn>',
      to: '"buaasoft_os1221"<buaasoft_os1221@163.com>',
      subject: '第六次操作系统上机',
      'mime-version': '1.0',
      'content-type': 'multipart/mixed; boundary="----=_NextPart_5586BB33_7EBEB700_006C3D23"',
      'content-transfer-encoding': '8Bit',
      date: 'Sun, 21 Jun 2015 21:25:07 +0800',
      'message-id': '<tencent_9BBBD28ABB62AD4C9B04A5EC@qq.com>',
      'x-qq-mime': 'TCMime 1.0 by Tencent',
      'x-mailer': 'Foxmail_for_Mac 1.0.0' },
   subject: '第六次操作系统上机',
   messageId: 'tencent_9BBBD28ABB62AD4C9B04A5EC@qq.com',
   priority: 'normal',
   from: [ { address: 'gyxln@buaa.edu.cn', name: 'gyxln' } ],
   to: [ { address: 'buaasoft_os1221@163.com', name: 'buaasoft_os1221' } ],
   date: Sun Jun 21 2015 21:25:07 GMT+0800 (CST),
   attachments:
    [ { contentType: 'application/msword',
        charset: 'utf-8',
        fileName: '12211114_郭耀星_操作系统第六次实验报告.doc',
        contentDisposition: 'attachment',
        transferEncoding: 'base64',
        generatedFileName: '12211114_郭耀星_操作系统第六次实验报告.doc',
        contentId: 'e1cc3b8059ef3fdc37571294938dc3df@mailparser',
        checksum: 'fb6e0e01973299bd4ab0ff530bfa3c46',
        length: 1062400,
        content: <Buffer d0 cf 11 e0 a1 b1 1a e1 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 3e 00 03 00 fe ff 09 00 06 00 00 00 00 00 00 00 00 00 00 00 11 00 00 00 14 08 ... > } ] }

 */
