using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using PollifyBackend.Properties;
using SendGrid;
using SendGrid.Helpers.Mail;


namespace PollifyBackend.Services
{
    public static class EmailSender
    { 
        private static EmailAddress fromEmail = new EmailAddress("pollify@jelleceulemans.be", "Pollify");

        //This will send an email to notify that he is invited to a new poll.
        public static async Task PollInvite(string email, string username, string pollName)
        {
            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            var client = new SendGridClient(apiKey);
            var from = fromEmail;
            var to = new EmailAddress(email);
            var templateId = "d-d67ec5ee83dd470baa0c854dd9765952";
            string data = @"{ 'email': '" + email + "', 'username': '" + username + "', 'pollName': '"+ pollName +"'}";
            Object json = JsonConvert.DeserializeObject<Object>(data);
            var msg = MailHelper.CreateSingleTemplateEmail(from, to, templateId, json);
            var response = await client.SendEmailAsync(msg);
            Debug.WriteLine("################################");
            Debug.WriteLine("################################");
            Debug.WriteLine(apiKey);
            Debug.WriteLine(email);
            Debug.WriteLine(response.StatusCode);
            Debug.WriteLine(response.Body.ReadAsStringAsync().Result);
            Debug.WriteLine(response.Headers.ToString());
            Debug.WriteLine("################################");
            Debug.WriteLine("################################");
        }

        //This will send an email to notify that the user has a new friend on pollify.
        public static async Task NewFriend(string email, string username)
        {
            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            var client = new SendGridClient(apiKey);
            var from = fromEmail;
            var to = new EmailAddress(email);
            var templateId = "d-f3b0a49ae3904556abff7e73ca2e8fec";
            string data = @"{'username': '" + username + "'}";
            Object json = JsonConvert.DeserializeObject<Object>(data);
            var msg = MailHelper.CreateSingleTemplateEmail(from, to, templateId, json);
            var response = await client.SendEmailAsync(msg);
        }


        //This will send an email with a link to reset his password.
        public static async Task ForgotPassword(string email, string username, string guid)
        {
            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            var client = new SendGridClient(apiKey);
            var from = fromEmail;
            var to = new EmailAddress(email);
            var templateId = "d-31eefdd1d29a472aa0b8ac6cbd3c3ad5";
            string data = @"{ 'username': '" + username + "', 'guid': '" + guid + "'}";
            Object json = JsonConvert.DeserializeObject<Object>(data);
            var msg = MailHelper.CreateSingleTemplateEmail(from, to, templateId, json);
            var response = await client.SendEmailAsync(msg);
        }

        //This will send an email with a link to activate his account.
        public static async Task ActivationLink(string email, string username, string guid)
        {
            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            var client = new SendGridClient(apiKey);
            var from = fromEmail;
            var to = new EmailAddress(email);
            var templateId = "d-20817cd9e4f8414e92b3d3401f615df4";
            string data = @"{ 'username': '"+ username +"', 'guid': '"+ guid +"'}";
            Object json = JsonConvert.DeserializeObject<Object>(data);
            var msg = MailHelper.CreateSingleTemplateEmail(from, to, templateId, json);
            var response = await client.SendEmailAsync(msg);
        }

        //This will send an email to notify the user that he has a new friend request.
        public static async Task FriedRequest(string email, string username)
        {
            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            var client = new SendGridClient(apiKey);
            var from = fromEmail;
            var to = new EmailAddress(email);
            var templateId = "d-4556857c0d1e46f6a234fbc227b1d69c";
            string data = @"{ 'username': '" + username + "'}";
            Object json = JsonConvert.DeserializeObject<Object>(data);
            var msg = MailHelper.CreateSingleTemplateEmail(from, to, templateId, json);
            var response = await client.SendEmailAsync(msg);
        }

        //This will send an email to a person who has no account of Pollify
        public static async Task Invite(string email, string username)
        {
            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            var client = new SendGridClient(apiKey);
            var from = fromEmail;
            var to = new EmailAddress(email);
            var templateId = "d-464ce5ead1a342e6908e8fd4e078df46";
            string data = @"{ 'username': '" + username + "'}";
            Object json = JsonConvert.DeserializeObject<Object>(data);
            var msg = MailHelper.CreateSingleTemplateEmail(from, to, templateId, json);
            var response = await client.SendEmailAsync(msg);
        }

        //Add this to a method for debugging
        /*Debug.WriteLine("################################");
        Debug.WriteLine("################################");
        Debug.WriteLine(apiKey);
        Debug.WriteLine(email);
        Debug.WriteLine(response.StatusCode);
        Debug.WriteLine(response.Body.ReadAsStringAsync().Result);
        Debug.WriteLine(response.Headers.ToString());
        Debug.WriteLine("################################");
        Debug.WriteLine("################################");*/
    }
}
