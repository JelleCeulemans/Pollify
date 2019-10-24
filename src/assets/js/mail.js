function sendMail(email, username, existingUser) {
    var template_params = {
        "email_to": email,
        "username": username
     }

    var service_id = "smtp_server";
    var template_id = "invite_pollify";

    if (existingUser) {
        template_id = "friend_request";
    }
    console.log(emailjs.send(service_id, template_id, template_params));
}
