﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PollifyBackend.Models
{
    public class Poll
    {
        public int PollID { get; set; }
        public string Name { get; set; }

        public ICollection<PollUser> PollUsers { get; set; }
        public ICollection<Answer> Answers { get; set; }
    }
}