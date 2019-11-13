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
        "title": "New friend!",
        "username": username,
        "text1": "accepted your friend request",
        "text2": "and start new polls with your new friend"
     }
     
     var template_id = "friend_and_poll";
     emailjs.send(service_id, template_id, template_params); 
}

function sendPollInvite(email, username, pollName) {
    var template_params = {
        "email_to": email,
        "title": "Poll Invite!",
        "username": username,
        "text1": "invited you to a new poll: (" + pollName + ")",
        "text2": "to answer this invite"
     }
     
     var template_id = "friend_and_poll";
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