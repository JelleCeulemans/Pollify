using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PollifyBackend.Models
{
    public class Friend
    {
        public int FriendID { get; set; }
        public User Sender { get; set; }
        public User Receiver { get; set; }
        public bool Accepted { get; set; }
    }
}
 