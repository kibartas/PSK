using System.Threading.Tasks;

namespace backend.Services.EmailService
{
    public interface IEmailService
    {
        void SendVerificationEmail(string receiverName, string receiverEmail, string verificationLink);
    }
}