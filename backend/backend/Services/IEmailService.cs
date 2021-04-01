using System.Threading.Tasks;

namespace backend.Services
{
    public interface IEmailService
    {
        void SendVerificationEmail(string receiverName, string receiverEmail, string verificationLink);
    }
}