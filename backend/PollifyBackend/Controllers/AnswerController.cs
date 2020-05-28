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
    public class AnswerController : ControllerBase
    {
        private readonly PollContext _context;

        public AnswerController(PollContext context)
        {
            _context = context;
        }

        //Get an answer with his id
        [HttpGet("{id}")]
        public async Task<ActionResult<Answer>> GetAnswer(int id)
        {
            var antwoord = await _context.Answers.FindAsync(id);

            if (antwoord == null)
            {
                return NotFound();
            }

            return antwoord;
        }

        //Get a list of answer that are connected to a specific poll and user
        [Authorize]
        [HttpGet]
        [Route("specific")]
        public async Task<ActionResult<IEnumerable<Answer>>> GetAnswersSpecific(int userid, int pollid)
        {
            var votes = await _context.Votes.Where(g => g.User.UserID == userid).Where(a => a.Answer.Poll.PollID == pollid).Include(a => a.Answer).ToListAsync();
            List<Answer> answers = new List<Answer>();
            foreach(Vote vote in votes)
            {   
                answers.Add(vote.Answer);
            }
            return answers;    
        }

        //Create a new answer
        [HttpPost]
        public async Task<ActionResult<Answer>> PostAntwoord(Answer answer)
        {
            answer.Poll = _context.Polls.Single(p => p.PollID == answer.Poll.PollID);
            _context.Answers.Add(answer);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetAnswer", new { id = answer.AnswerID }, answer);
        }

        //Delete an answer
        [HttpDelete("{id}")]
        public async Task<ActionResult<Answer>> DeleteAnswer(int id)
        {
            var answer = await _context.Answers.Include(v => v.Votes).FirstOrDefaultAsync(a => a.AnswerID == id);
            if (answer == null)
            {
                return NotFound();
            }

            _context.Votes.RemoveRange(answer.Votes);
            _context.Answers.Remove(answer);
            await _context.SaveChangesAsync();

            return answer;
        }
    }
}
