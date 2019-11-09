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

function sendActivition(email, username, guid) {
    var template_params = {
        "email_to": email,
        "username": username,
        "guid": guid
    }

    var template_id = "activate_account";
    emailjs.send(service_id, template_id, template_params);
}

function sendAcceptFriend(email, username) {
    var template_params = {
        "email_to": email,
        "username": username
    }

    var template_id = "accept_friend";
    emailjs.send(service_id, template_id, template_params);
}

function resetPassword(email, username, guid){
    var template_params = {
        "email_to": email,
        "username": username,
        "guid": guid
     }
     
     var template_id = "forgot_password";
     emailjs.send(service_id, template_id, template_params);
}