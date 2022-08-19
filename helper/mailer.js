const nodemailer = require("nodemailer");


module.exports = (to, message) => {
    var transport = nodemailer.createTransport({
        service: "one",
        auth: {
            user: "ayush.gupta@hestabit.in",
            pass: "Ayush123**"
        }
    })

    var mailOptions = {
        from: "ayush.gupta@hestabit.in",
        to: to,
        subject: "School Management System",
        text: message
    }
    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            consolelog("Email Sent" + info.response)
        }
    })
}