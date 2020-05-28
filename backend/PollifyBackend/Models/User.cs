using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PollifyBackend.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Username { get; set; }
        public bool Activated { get; set; }
        public Guid Guid { get; set; }
        
        [NotMapped]
        public string Token { get; set; }

        public ICollection<PollUser> PollUsers { get; set; }
        public ICollection<Vote> Votes { get; set; }
    }
}
