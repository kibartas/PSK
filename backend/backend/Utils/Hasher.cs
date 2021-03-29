using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace backend.Utils
{
    public class Hasher
    {
        // Returns `byte[] salt` and hashed password `string hashed` 
        // Usage:
        // - If you're registering a new user, input just the password
        // - If you're logging in an existing user input their plaintext password (from the request)
        //  + the salt taken from their database table
        public static (byte[], string) HashPassword(string password, byte[] salt = null)
        {
            if (salt == null)
            {
                salt = new byte[128 / 8];

                var rng = RandomNumberGenerator.Create();
                rng.GetBytes(salt);
            }
            
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA512,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return (salt, hashed);
        }
    }
}