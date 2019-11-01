var service_id = "smtp_server";

function sendInvite(email, username) {
    var template_params = {
        "email_to": email,
        "username": username
     }

    var template_id = "invite_pollify";
    emailjs.send(service_id, template_id, template_params);
}


function sendFriendRequest(email, username) {
    var template_params = {
        "email_to": email,
        "username": username
     }

    var template_id = "friend_request";
    emailjs.send(service_id, template_id, template_params);
}



