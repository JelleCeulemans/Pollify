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
    public class VoteController : ControllerBase
    {
        private readonly PollContext _context;

        public VoteController(PollContext context)
        {
            _context = context;
        }

        //Get the vote from answer with a userid
        [Authorize]
        [HttpGet]
        [Route("fromUser")]
        public async Task<ActionResult<Vote>> GetVote(int answerid, int userid)
        {
            var stem = await _context.Votes.Where(a => a.Answer.AnswerID == answerid).Where(g => g.User.UserID == userid).FirstAsync();

            if (stem == null)
            {
                return NotFound();
            }

            return stem;
        }

        //Create a new vote
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Vote>> PostVote(Vote vote)
        {
            var voteInsert = new Vote
            {
                Answer = _context.Answers.Single(a => a.AnswerID == vote.Answer.AnswerID),
                User = _context.Users.Single(u => u.UserID == vote.User.UserID)
            };
            _context.Votes.Add(voteInsert);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVote", new { id = voteInsert.VoteID }, voteInsert);
        }

        //Remove a vote
        [Authorize]
        [HttpDelete]
        public async Task<ActionResult<Vote>> DeleteVote(int answerid, int userid)
        {
            var stem = await _context.Votes.Where(a => a.Answer.AnswerID == answerid).Where(g => g.User.UserID == userid).FirstAsync();
            if (stem == null)
            {
                return NotFound();
            }

            _context.Votes.Remove(stem);
            await _context.SaveChangesAsync();

            return stem;
        }
    }
}
