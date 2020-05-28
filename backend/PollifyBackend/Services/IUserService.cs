using PollifyBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PollifyBackend.Services
{
    public interface IUserService
    {
        //Login with email and password
        User Authenticate(string email, string password);

        //login with Facebook
        User FbAuthenticate(string email);
    }
}
