using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PollifyBackend.Models
{
    public class Vote
    {
        public int VoteID { get; set; }
        public Answer Answer { get; set; }
        public User User { get; set; }
    }
}