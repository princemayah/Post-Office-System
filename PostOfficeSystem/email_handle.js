const nodemailer = require('nodemailer');
const connection = require('./mysql_connection.js'); // Assume you have a module to connect to your DB
require('dotenv').config();

// Configure your SMTP transporter
let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Set this in your .env file
    port: process.env.SMTP_PORT, // Set this in your .env file
    secure: process.env.SMTP_SECURE, // Set this in your .env file
    auth: {
        user: process.env.SMTP_USER, // Set this in your .env file
        pass: process.env.SMTP_PASS // Set this in your .env file
    },
    tls: {
        // Only necessary if you are experiencing issues
        secureProtocol: 'TLSv1_2_method', // Force use of TLSv1.2
    },
});

function sendEmailNotification(notification) {
    let recipients = [];
    if (notification.send_email) {
        recipients.push(notification.send_email); // Add sender email if not null
    }
    if (notification.receive_email) {
        recipients.push(notification.receive_email); // Add receiver email if not null
    }

    let mailOptions = {
        from: process.env.SMTP_USER, // replace with your email
        to: recipients.join(','), // join the recipients array into a string separated by commas
        subject: 'Package Update Notification', // email subject
        text: notification.message, // email body as plain text
        // html: '<b>Your package status has been updated</b>' // or HTML body if needed
    };

    // send email with the transporter
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error('SendMail Error:', error, 'Notification ID:', notification.id);
            // Optionally set status to 'failed' in the email_notifications_queue
        } else {
            console.log('Email sent: ' + info.response + ' to ' + recipients.join(','));
            // Update the notification status to 'sent' in the email_notifications_queue
            connection.query('UPDATE email_notifications_queue SET status = "sent" WHERE id = ?', [notification.id], function(err, res) {
                if (err) {
                    console.error('DB Update Error:', err, 'Notification ID:', notification.id);
                }
            });
        }
    });
}

function processEmailQueue() {
    // Select all pending email notifications
    connection.query('SELECT * FROM email_notifications_queue WHERE status = "pending"', function(err, notifications) {
        if (err) {
            console.error('Database Select Error:', err);
            return;
        }

        // Process each notification
        notifications.forEach(notification => {
            sendEmailNotification(notification);
        });
    });
}

// Run the email processing function at a regular interval
setInterval(processEmailQueue, 60000); // Adjust the interval as needed

module.exports = processEmailQueue