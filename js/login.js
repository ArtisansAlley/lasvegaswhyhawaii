const dc = document;
dc.getElementById("loader").style.display = "none";



const db = firestore.collection('logins');

var w_username = "";
var w_password = "";

if(sessionStorage.getItem("why_username") != null){
	console.log( sessionStorage.getItem("why_username") + " is already logged in!");
}else{
	console.log("Not Logged in!");
}


function checkUser(doc,username,password){
	// alert("Here on checkUser! " + w_username);
	if(doc.data().username == w_username){
		return true;		
	}else{
		// alert("Invalid Username!" + w_username);
		return false;	
	}
}

function checkUserCredentials(){
	dc.getElementById("loader").style.display = "block";
	// $.growl({ title: "Growl", message: "The kitten is awake!" });
	w_username = HtmlSanitizer.SanitizeHtml(dc.getElementById("uname").value);
	w_password = window.btoa(HtmlSanitizer.SanitizeHtml(dc.getElementById("pword").value));
	// sessionStorage.setItem("why_username", w_username);
	if(w_username !== "" && w_password !== ""){		
		db.get().then((snapshots) => {
			snapshots.docs.forEach(doc=> {				
				if(checkUser(doc,w_username,w_password)){
					if(doc.data().password == w_password){		
						localStorage.setItem("why_username", w_username);
						window.location.href = "./reservations.html";	
					}else{
						$.growl.warning({ title: "Wrong password", message: "Please insert the right password" });
						dc.getElementById("loader").style.display = "none";
					}					
				}else{
					dc.getElementById("loader").style.display = "none";
					$.growl.warning({ title: "Invalid Username", message: "Please insert a valid username" });
					// alert("Ivalid Username");
				}
			});
		}).catch(function(error){
			dc.getElementById("loader").style.display = "none";
			$.growl.error({ title: "Field Required", message: "Error Logging in."});
			// console.log("Error logging in:", error);
		});
	}else{
		dc.getElementById("loader").style.display = "none";
		$.growl.warning({ title: "Field Required", message: "Please enter complete login crendentials"});
		// alert("PLease Enter Both Login Crendentials!");
	}

}

window.addEventListener('keypress', function (e) {
	if (e.keyCode == 13) {
		checkUserCredentials();
	}
}, false);


