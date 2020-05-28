using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PollifyBackend.Models
{
    public class DBInitializer
    {
        public static void Initialize(PollContext context)
        {
           /* var user = new User();
            user.Email = "r0698046@student.thomasmore.be";
            user.Activated = false;
            user.Guid = Guid.NewGuid();*/

            context.Database.EnsureCreated();
            return;

            /*if (context.Polls.Any())
            {
                return;
            }

            context.Polls.AddRange(
                new Poll { Name = "Welke movie" });
            context.SaveChanges();

            context.Answers.AddRange(
                new Answer { 
                    Name = "John Wick 3", 
                    Poll = context.Polls.Single(s => s.Name == "Welke movie") },
                new Answer { 
                    Name = "Hobbs and Shawn", 
                    Poll = context.Polls.Single(s => s.Name == "Welke movie")},
                new Answer { 
                    Name = "Breaking bad the movie", 
                    Poll = context.Polls.Single(s => s.Name == "Welke movie") },
                new Answer { 
                    Name = "The expendables 3", 
                    Poll = context.Polls.Single(s => s.Name == "Welke movie") });
            context.SaveChanges();

            context.Users.AddRange(
                new User 
                { 
                    Email = "jelle.ceulemans@hotmail.com", 
                    Password = "wachtwoord", 
                    Username = "JelleC",
                    Activated = true,
                    Guid = Guid.NewGuid()
                },
                new User
                { 
                    Email = "admin@admin.com", 
                    Password = "admin", 
                    Username = "Admin",
                    Activated = true,
                    Guid = Guid.NewGuid()
                },
                new User
                {
                    Email = "test@test.com",
                    Password = "test",
                    Username = "Test",
                    Activated = false,
                    Guid = Guid.NewGuid()
                },
                new User
                {
                    Email = "info@jelleceulemans.be",
                    Password = "azertyuiop",
                    Username = "JelleCeulemans",
                    Activated = true,
                    Guid = Guid.NewGuid()
                });
            context.SaveChanges();

            context.PollUsers.AddRange(
                new PollUser
                {
                    Poll = context.Polls.Single(s => s.Name == "Welke movie"),
                    User = context.Users.Single(s => s.Username == "JelleCeulemans")
                },
                new PollUser
                {
                    Poll = context.Polls.Single(s => s.Name == "Welke movie"),
                    User = context.Users.Single(s => s.Username == "Admin")
                });
            context.SaveChanges();

            context.Votes.AddRange(
                new Vote
                {
                    Answer = context.Answers.Single(s => s.Name == "Breaking bad the movie"),
                    User = context.Users.Single(s => s.Username == "JelleCeulemans")
                },
                new Vote
                {
                    Answer = context.Answers.Single(s => s.Name == "John Wick 3"),
                    User = context.Users.Single(s => s.Username == "JelleCeulemans")
                },
                new Vote
                {
                    Answer = context.Answers.Single(s => s.Name == "Breaking bad the movie"),
                    User = context.Users.Single(s => s.Username == "Admin")
                });
            context.SaveChanges();

            context.Friends.AddRange(
                   new Friend
                   {
                       Sender = context.Users.Single(g => g.Username == "JelleCeulemans"),
                       Receiver = context.Users.Single(g => g.Username == "Admin"),
                       Accepted = true
                   },
                   new Friend
                   {
                       Sender = context.Users.Single(g => g.Username == "JelleC"),
                       Receiver = context.Users.Single(g => g.Username == "JelleCeulemans"),
                       Accepted = false
                   },
                   new Friend
                   {
                       Sender = context.Users.Single(g => g.Username == "JelleCeulemans"), 
                       Receiver = user,
                       Accepted = false
                   });

            context.SaveChanges();*/

        }
    }
}
