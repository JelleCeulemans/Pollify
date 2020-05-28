using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PollifyBackend.Models
{
    public class PollUser
    {
        public int PollUserID { get; set; }

        public Poll Poll { get; set; }
        public User User { get; set; }

        public bool Accepted { get; set; }
    }
}
