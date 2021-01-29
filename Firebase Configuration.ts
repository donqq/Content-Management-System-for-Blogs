// Firebase Realtime Database Structure

{
	"users" : {
		"uid" : {  //  UID : 
			"userid" : //  : UID
			"role" : // admin, user
			"userinfo" : {
				"username" : 
				"email" : 
				"displaypicture" :
				"personalname" :
			}
		}
	},
	"reports" : {
		"uid" : { //  UID : 
				"0" : { // REPORT ID
				"uniqueid": 
				"topics" : 
				"article rate" :
				"articleURL" :
				"filesubmitteddate" :
				"paidornot" :
				"plagiarismscore" :
				"topicname" :
				"editor feedback" :
				"userid" :
			}
		}
	}
}

// Firebase Rules

{
  /* Visit https://firebase.google.com/docs/database/security to learn more about security rules. */
  "rules": {
    "users" : {
		".read" : "auth != null && auth.token.email_verified == true && root.child('users/' + auth.uid + '/role').val() === 'admin'" ,
		".write" : "auth != null && auth.token.email_verified == true && root.child('users/' + auth.uid + '/role').val() === 'admin'", 
		"$uid" : {
			".read" : "auth != null && auth.token.email_verified == true && $uid === auth.uid" ,
			".write" : "auth != null && auth.token.email_verified == true && $uid === auth.uid" 
			}
    },
    "reports" : {
		".read" : "auth != null && auth.token.email_verified == true && root.child('users/' + auth.uid + '/role').val() === 'admin'" ,
		".write" : "auth != null && auth.token.email_verified == true && root.child('users/' + auth.uid + '/role').val() === 'admin'", 
		"$uid" : {
				".read" : "auth != null && auth.token.email_verified == true && $uid === auth.uid" ,
				".write" : "auth != null && auth.token.email_verified == true && $uid === auth.uid" 
			}
		}
	}
}
