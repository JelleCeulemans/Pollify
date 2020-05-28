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

namespace PollifyBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendController : ControllerBase
    {
        private readonly PollContext _context;

        public FriendController(PollContext context)
        {
            _context = context;
        }

        //Get a friend with his id
        [HttpGet("{id}")]
        public async Task<ActionResult<Friend>> GetFriend(int id)
        {
            var vriend = await _context.Friends.FindAsync(id);

            if (vriend == null)
            {
                return NotFound();
            }

            return vriend;
        }

        //Get all the friends where you sent an invitation to
        [Authorize]
        [HttpGet]
        [Route("sendedInvitations")]
        public async Task<ActionResult<IEnumerable<User>>> GetSendedInvitations(int userid)
        {
            var invitations = await _context.Friends.Where(s => s.Sender.UserID == userid && s.Accepted == false).Select(r => r.Receiver).ToListAsync();

            if (invitations == null)
            {
                return NotFound();
            }

            return invitations;
        }

        //Get all the friends where you received a friend request from
        [Authorize]
        [HttpGet]
        [Route("receivedInvitations")]
        public async Task<ActionResult<IEnumerable<Friend>>> GetReceivedInvitations(int userid)
        {
            var invitations = await _context.Friends.Where(s => s.Receiver.UserID == userid && s.Accepted == false).Include(s => s.Sender).ToListAsync();

            if (invitations == null)
            {
                return NotFound();
            }
            return invitations;
        }

        //Accept the friend request
        [Authorize]
        [HttpPut]
        public async Task<ActionResult<Friend>> PutMakeFriends(Friend friend)
        {
            _context.Entry(friend).Property("Accepted").IsModified = true;
            await _context.SaveChangesAsync();
            return await _context.Friends.Include(r => r.Receiver).Include(s => s.Sender).FirstOrDefaultAsync(f => f.FriendID == friend.FriendID);
        }

        //Create a new friend
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Friend>> PostFriend(Friend friend)
        {
            var receiver = friend.Receiver;
            if (friend.Receiver.UserID > 0)
                receiver = _context.Users.Single(g => g.UserID == receiver.UserID);
            else
                receiver.Guid = Guid.NewGuid();

            var insertFriend = new Friend
            {
                Sender = _context.Users.Single(g => g.UserID == friend.Sender.UserID),
                Receiver = receiver,
                Accepted = false
            };
            _context.Friends.Add(friend);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFriend", new { id = friend.FriendID }, friend);
        }

        //Delete a friend by userIDs
        [Authorize]
        [HttpDelete]
        [Route("byIds")]
        public async Task<ActionResult<Friend>> DeleteFriendByIds(int senderid, int receiverid)
        {

            var friend = await _context.Friends.FirstOrDefaultAsync(s => s.Sender.UserID == senderid && s.Receiver.UserID == receiverid);
            var friend2 = await _context.Friends.FirstOrDefaultAsync(s => s.Sender.UserID == receiverid && s.Receiver.UserID == senderid);
            if (friend == null)
            {
                friend = friend2;
            }

            _context.Friends.Remove(friend);
            await _context.SaveChangesAsync();

            return friend;
        }

        //Delete a friend by id
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Friend>> DeleteFriend(int id)
        {
            var friend = await _context.Friends.FindAsync(id);
            if (friend == null)
            {
                return NotFound();
            }

            _context.Friends.Remove(friend);
            await _context.SaveChangesAsync();

            return friend;
        }
    }
}
