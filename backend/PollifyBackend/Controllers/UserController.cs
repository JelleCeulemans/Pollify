using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PollifyBackend.Models;
using PollifyBackend.Services;
using SG.Algoritma;

namespace PollifyBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly PollContext _context;
        private IUserService _userService;

        public UserController(PollContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        //Authenticate with email and password
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]User userParam)
        {
            var user = _userService.Authenticate(userParam.Email, userParam.Password);
            if (user == null)
                return BadRequest(new { message = "email or password is incorrect" });

            return Ok(user);
        }

        //Authenticate a user that logged in with Facebook
        [HttpPost("fbauth")]
        public IActionResult FbAuthenticate([FromBody]User userParam)
        {
            var user = _userService.FbAuthenticate(userParam.Email);
            if (user == null)
                return BadRequest(new { message = "email is incorrect" });

            return Ok(user);
        }

        //Get all the poll participants
        [Authorize]
        [HttpGet]
        [Route("participants")]
        public async Task<ActionResult<IEnumerable<User>>> GetPollParticipants(int pollid)
        {
            return await _context.PollUsers.Where(p => p.Poll.PollID == pollid && p.Accepted == true).Select(g => g.User).ToListAsync();
        }

        //get all the friends that are not participating the poll
        [Authorize]
        [HttpGet]
        [Route("noparticipants")]
        public async Task<IEnumerable<User>> GetPollNoParticipants(int userid, int pollid)
        {
            var friendsWithme = await _context.Friends.Where(f => f.Receiver.UserID == userid || f.Sender.UserID == userid && f.Accepted == true).Include(r => r.Receiver).Include(s => s.Sender).ToListAsync();
            
            var participants = await _context.PollUsers.Where(p => p.Poll.PollID == pollid && p.Accepted == true).Select(g => g.User).ToListAsync();
            List<User> noparticipant = new List<User>();
            foreach(Friend friend in friendsWithme)
            {
                var addFriend = friend.Sender;
                if (friend.Sender.UserID == userid)
                    addFriend = friend.Receiver;

                if (!participants.Contains(addFriend))
                    noparticipant.Add(addFriend);
            }

            return noparticipant.AsEnumerable();
        }

        //Get all friends from a specific user
        [Authorize]
        [HttpGet]
        [Route("byId")]
        public async Task<IEnumerable<User>> GetFriendsById(int userid)
        {
            List<User> gebruikers = new List<User>();
            var friends = await _context.Friends.
                Where(s => s.Sender.UserID == userid || s.Receiver.UserID == userid).
                Where(a => a.Accepted == true).
                Include(g => g.Sender).
                Include(g => g.Receiver).ToListAsync();

            if (friends != null)
            {
                foreach (Friend friend in friends)
                {
                    var addFriend = friend.Sender;
                    if (friend.Sender.UserID == userid)
                    {
                        addFriend = friend.Receiver;
                    }
                    gebruikers.Add(addFriend);
                }
            }

            return gebruikers.AsEnumerable();
        }

        //get the amount of verified users
        [HttpGet]
        [Route("countUsers")]
        public async Task<ActionResult<int>> GetCountUsers()
        {
            return await _context.Users.CountAsync(a => a.Activated == true);
        }

        //Get a user by Guid
        [HttpGet]
        [Route("whereGuid")]
        public async Task<ActionResult<User>> GetUserWhereGuid(Guid guid)
        {
            return await _context.Users.FirstOrDefaultAsync(g => g.Guid == guid);
        }

        //Get a user by his id
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var gebruiker = await _context.Users.FindAsync(id);

            if (gebruiker == null)
            {
                return NotFound();
            }

            return gebruiker;
        }

        //Get a user by email
        [HttpGet]
        [Route("byEmail")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            var user = await _context.Users.Where(g => g.Email == email).FirstOrDefaultAsync();

            if (user == null)
            {
                return NoContent();
            }

            return user;
        }

        //Update a user that was invited but had no account
        [HttpPut]
        [Route("updateUser")]
        public async Task<IActionResult> PutUpdateUser(User user)
        {
            user.Password = Cipher.Encrypt(user.Password, Cipher.secretKey);
            _context.Entry(user).Property("Password").IsModified = true;
            _context.Entry(user).Property("Username").IsModified = true;
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetUser", new { id = user.UserID }, user);
        }

        //Update password via the reset password section
        [HttpPut]
        [Route("updatePassword")]
        public async Task<IActionResult> PutUpdatePassword(User user)
        {
            user.Password = Cipher.Encrypt(user.Password, Cipher.secretKey);
            _context.Entry(user).Property("Password").IsModified = true;
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetUser", new { id = user.UserID }, user);
        }

        //Activate an account
        [HttpPut]
        [Route("activate")]
        public async Task<IActionResult> ActivateUser(User user)
        {
            _context.Entry(user).Property("Activated").IsModified = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        //Create a new user
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            user.Guid = Guid.NewGuid();
            user.Password = Cipher.Encrypt(user.Password, Cipher.secretKey);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            EmailSender.ActivationLink(user.Email, user.Username, user.Guid.ToString()).Wait();
            return CreatedAtAction("GetUser", new { id = user.UserID }, user);
        }
    }
}
