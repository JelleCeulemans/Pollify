using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PollifyBackend.Models
{
    public class Answer
    {
        public int AnswerID { get; set; }
        public string Name { get; set; }

        public Poll Poll { get; set; }
        public ICollection<Vote> Votes { get; set; }
    }
}
