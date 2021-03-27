namespace backend.JwtAuthentication
{
    public interface IJwtAuthentication
    {
        string Authenticate(string email, string password);
    }
}
