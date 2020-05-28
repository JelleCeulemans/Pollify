using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PollifyBackend.Models;
using PollifyBackend.Services;

namespace PollifyBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PollController : ControllerBase
    {
        private readonly PollContext _context;

        public PollController(PollContext context)
        {
            _context = context;
        }

        //Get the total amount of polls
        [HttpGet]
        [Route("countPolls")]
        public async Task<ActionResult<int>> GetCountPolls()
        {
            return await _context.Polls.CountAsync();
        }

        //Get a poll by id
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Poll>> GetPoll(int id)
        {
            var poll = await _context.Polls.Include(a => a.Answers).ThenInclude(s => s.Votes).ThenInclude(u => u.User).FirstOrDefaultAsync(p => p.PollID == id);

            if (poll == null)
                return NotFound();

            return poll;
        }

        //Get all the polls from a specific user
        [Authorize]
        [HttpGet]
        [Route("perUser")]
        public async Task<ActionResult<IEnumerable<Poll>>> GetPollsPerUser(int userid)
        {
            var polls = await _context.PollUsers.Include(p => p.Poll.Answers).ThenInclude(s => s.Votes).Where(g => g.User.UserID == userid && g.Accepted == true).Select(p => p.Poll).ToListAsync();

            if (polls == null)
            {
                return NotFound();
            }

            return polls;
        }

        //Create a new poll
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Poll>> PostPoll(Poll poll)
        {
            _context.Polls.Add(poll);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetPoll", new { id = poll.PollID }, poll);
        }

        //delete a poll by PollID
        [HttpDelete("{id}")]
        public async Task<ActionResult<Poll>> DeletePoll(int id)
        {
            var poll = await _context.Polls.Include(p => p.PollUsers).Include(a => a.Answers).ThenInclude(v => v.Votes).FirstOrDefaultAsync(p => p.PollID == id);
            if (poll == null)
            {
                return NotFound();
            }

            _context.Answers.RemoveRange(poll.Answers);
            _context.PollUsers.RemoveRange(poll.PollUsers);
            _context.Polls.Remove(poll);
            await _context.SaveChangesAsync();

            return poll;
        }
    }
}
