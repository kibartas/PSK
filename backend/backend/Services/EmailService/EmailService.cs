using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace backend.Services.EmailService
{
    public class EmailService : IEmailService
    {
        private readonly string _weDontByteEmail;
        private readonly string _weDontBytePassword;

        public EmailService(IConfiguration configuration)
        {
            _weDontByteEmail = configuration.GetValue<string>("EmailConfiguration:EmailAddress");
            _weDontBytePassword = configuration.GetValue<string>("EmailConfiguration:EmailPassword");
        }

        public void SendVerificationEmail(string receiverName, string receiverEmail, string verificationLink)
        {
            var mailMessage = new MimeMessage();
            mailMessage.From.Add(new MailboxAddress("WeDontByte Team", _weDontByteEmail));
            mailMessage.To.Add(new MailboxAddress(receiverName, receiverEmail));
            mailMessage.Subject = "Account verification";
            mailMessage.Body = new TextPart("html")
            {
                Text = $"<a href=\"{verificationLink}\">Click here to verify your account!</a>"
            };

            using (var smtpClient = new SmtpClient())
            {
                smtpClient.Connect("smtp.gmail.com", 465, true);
                smtpClient.Authenticate(_weDontByteEmail, _weDontBytePassword);
                smtpClient.Send(mailMessage);
                smtpClient.Disconnect(true);
            }
        }

        public void SendForgotPasswordEmail(string receiverName, string receiverEmail, string resetPasswordLink)
        {
            var mailMessage = new MimeMessage();
            mailMessage.From.Add(new MailboxAddress("WeDontByte Team", _weDontByteEmail));
            mailMessage.To.Add(new MailboxAddress(receiverName, receiverEmail));
            mailMessage.Subject = "Reset password";
            mailMessage.Body = new TextPart("html")
            {
                Text = $"<a href=\"{resetPasswordLink}\">Click here to reset your password!</a>"
            };

            using (var smtpClient = new SmtpClient())
            {
                smtpClient.Connect("smtp.gmail.com", 465, true);
                smtpClient.Authenticate(_weDontByteEmail, _weDontBytePassword);
                smtpClient.Send(mailMessage);
                smtpClient.Disconnect(true);
            }
        }
    }
}