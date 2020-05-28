using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PollifyBackend.Helpers;
using PollifyBackend.Models;
using SG.Algoritma;

namespace PollifyBackend.Services
{
    public class UserService: IUserService
    {
        private readonly AppSettings _appSettings;
        private readonly PollContext _pollContext;

        public UserService(IOptions<AppSettings> appSettings, PollContext pollContext)
        {
            _appSettings = appSettings.Value;
            _pollContext = pollContext;
        }
            
        //Login with email and password to retrieve a token
        public User Authenticate(string email, string password)
        {
            var user = _pollContext.Users.SingleOrDefault(x => x.Email == email);
            if (user == null || !user.Activated || Cipher.Decrypt(user.Password, Cipher.secretKey) != password)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]{
                    new Claim("UserID", user.UserID.ToString()),
                    new Claim("Email", user.Email),
                    new Claim("Username", user.Username)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            user.Password = null;

            return user;
        }

        //Login Facebook to retrieve a token
        public User FbAuthenticate(string email)
        {
            var user = _pollContext.Users.SingleOrDefault(x => x.Email == email);
            if (user == null || !user.Activated)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]{
                    new Claim("UserID", user.UserID.ToString()),
                    new Claim("Email", user.Email),
                    new Claim("Username", user.Username)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            user.Password = null;

            return user;
        }
    }
}
