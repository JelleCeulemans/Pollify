using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PollifyBackend.Models;

namespace PollifyBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PollUserController : ControllerBase
    {
        private readonly PollContext _context;

        public PollUserController(PollContext context)
        {
            _context = context;
        }

        //Get pollUser by PollUserID
        [HttpGet("{id}")]
        public async Task<ActionResult<PollUser>> GetPollUser(int id)
        {
            var pollGebruiker = await _context.PollUsers.FindAsync(id);

            if (pollGebruiker == null)
            {
                return NotFound();
            }

            return pollGebruiker;
        }

        //Get all the pollInvites
        [Authorize]
        [HttpGet]
        [Route("pollInvites")]
        public async Task<ActionResult<IEnumerable<PollUser>>> GetPollInvites(int userid)
        {
            var pollUsers = await _context.PollUsers.Where(g => g.User.UserID == userid && g.Accepted == false).Include(p => p.Poll).ToListAsync();

            if (pollUsers == null)
            {
                return NotFound();
            }

            return pollUsers;
        }

        //Accept the poll invite
        [Authorize]
        [HttpPut]
        public async Task<IActionResult> PutPollUser(PollUser pollUser)
        {
            pollUser.Accepted = true;
            _context.Entry(pollUser).Property("Accepted").IsModified = true;
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetPollUser", new { id = pollUser.PollUserID }, pollUser);
        }

        //Creat a new link between a poll and a user
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<PollUser>> PostPollUser(PollUser pollUser)
        {
            var getPollUser = await _context.PollUsers.Include(u => u.User).Include(p => p.Poll).FirstOrDefaultAsync(p => p.User.UserID == pollUser.User.UserID && p.Poll.PollID == pollUser.Poll.PollID);

            if (getPollUser == null)
            {
                var insertPollUser = new PollUser
                {
                    Poll = _context.Polls.Single(p => p.PollID == pollUser.Poll.PollID),
                    User = _context.Users.Single(g => g.UserID == pollUser.User.UserID),
                    Accepted = pollUser.Accepted
                };
                _context.PollUsers.Add(insertPollUser);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetPollUser", new { id = insertPollUser.PollUserID }, insertPollUser);
            }

            return getPollUser;
        }

        //Delete the connection between a poll and a user by pollID and userID
        [Authorize]
        [HttpDelete]
        public async Task<ActionResult<PollUser>> DeletePollUser(int pollid, int userid)
        {
            var pollUserRemove = await _context.PollUsers.FirstOrDefaultAsync(p => p.User.UserID == userid && p.Poll.PollID == pollid);
            if (pollUserRemove == null)
            {
                return NotFound();
            }

            _context.PollUsers.Remove(pollUserRemove);
            await _context.SaveChangesAsync();

            return pollUserRemove;
        }

        //Delete the connection between a poll and a user by i-his ud
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<PollUser>> DeletePollUser(int id)
        {
            var pollUser = await _context.PollUsers.FindAsync(id);
            if (pollUser == null)
            {
                return NotFound();
            }

            _context.PollUsers.Remove(pollUser);
            await _context.SaveChangesAsync();

            return pollUser;
        }
    }
}
