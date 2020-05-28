using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PollifyBackend.Models
{
    public class PollContext : DbContext
    {
        public PollContext(DbContextOptions<PollContext> options) : base(options)
        {

        }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Poll> Polls { get; set; }
        public DbSet<PollUser> PollUsers { get; set; }
        public DbSet<Vote> Votes { get; set; }
        public DbSet<Friend> Friends { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Answer>().ToTable("Answer");
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<Poll>().ToTable("Poll");
            modelBuilder.Entity<PollUser>().ToTable("PollUser");
            modelBuilder.Entity<Vote>().ToTable("Vote");
            modelBuilder.Entity<Friend>().ToTable("Friend");
        }
    }
}
