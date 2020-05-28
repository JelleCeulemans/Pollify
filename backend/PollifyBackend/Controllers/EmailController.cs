using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PollifyBackend.Models;
using PollifyBackend.Services;

namespace PollifyBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : Controller
    {
        //This will send an email to notify that he is invited to a new poll.
        [HttpPost]
        [Route("pollInvite")]
        public IActionResult SendPollInvite([FromBody]User user)
        {
            EmailSender.PollInvite(user.Email, user.Username, user.Password).Wait();
            return Ok(user);
        }

        //This will send an email with a link to reset his password.
        [HttpPost]
        [Route("forgotPassword")]
        public IActionResult SendForgotPassword([FromBody]User user)
        {
            EmailSender.ForgotPassword(user.Email, user.Username, user.Guid.ToString()).Wait();
            return Ok(user);
        }

        //This will send an email with a link to activate his account.
        [HttpPost]
        [Route("activationLink")]
        public IActionResult SendActivationLink([FromBody]User user)
        {
            EmailSender.ActivationLink(user.Email, user.Username, user.Guid.ToString()).Wait();
            return Ok(user);
        }

        //This will send an email to notify the user that he has a new friend request.
        [HttpPost]
        [Route("friendRequest")]
        public IActionResult SendFriendRequest([FromBody]User user)
        {
            EmailSender.FriedRequest(user.Email, user.Username).Wait();
            return Ok(user);
        }

        //This will send an email to a person who has no account of Pollify
        [HttpPost]
        [Route("invite")]
        public IActionResult SendInvite([FromBody]User user)
        {
            EmailSender.Invite(user.Email, user.Username).Wait();
            return Ok(user);
        }

        //Send a mail that the user has a new friend
        [HttpPost]
        [Route("newFriend")]
        public IActionResult SendNewFriend([FromBody]User user)
        {
            EmailSender.NewFriend(user.Email, user.Username).Wait();
            return Ok(user);
        }
    }
}