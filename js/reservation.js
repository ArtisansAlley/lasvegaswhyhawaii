
  const dc = document;
  const saveReservation = dc.querySelector("#saveReservation");

  const eventDB = firestore.collection('events');

  // Inputs
  const r_name = dc.querySelector("#r_name");
  const r_phone = dc.querySelector("#r_phone");
  const r_email = dc.querySelector("#r_email");
  const r_city = dc.querySelector("#r_city");
  const r_zipcode = dc.querySelector("#r_zipcode");
  const r_how = dc.querySelector("#r_how");
  const r_message = dc.querySelector("#r_message");
  const r_state = dc.querySelector("#r_state");
  const r_event = dc.querySelector("#r_event");

  function renderEventOptions(doc){
    // console.log("Here on render Options: "+doc.data().eventTitle+" | "+doc.data().eventDate);
    let option = dc.createElement('option');
    option.textContent = doc.data().title+" | "+doc.data().date;
    r_event.appendChild(option);
  }

  function setEventOptions(){
    eventDB.get().then((snapshots) => {
      snapshots.docs.forEach(doc=> {
        renderEventOptions(doc);
      })
    });

  }



  function reserveEvent(){
    const rname = HtmlSanitizer.SanitizeHtml(r_name.value);
    const remail = HtmlSanitizer.SanitizeHtml(r_email.value);
    const rcity = HtmlSanitizer.SanitizeHtml(r_city.value);
    const rzipcode = HtmlSanitizer.SanitizeHtml(r_zipcode.value);
    const rphone = HtmlSanitizer.SanitizeHtml(r_phone.value);
    const rmessage = HtmlSanitizer.SanitizeHtml(r_message.value);
    const rhow = HtmlSanitizer.SanitizeHtml(r_how.value);
    const revent = HtmlSanitizer.SanitizeHtml(r_event.value);
    const rstate = HtmlSanitizer.SanitizeHtml(r_state.value);

    if(rname == ""){
      alert("Name is Required");
      return;
    }
    if(revent == "" || revent == "Select your option *"){
      alert("Please choose an event");
      return;
    }
    if(rphone == ""){
      alert("Phone is Required");
      return;
    }
    if(remail == ""){
      alert("Email is Required");
      return;
    }
    if(rcity == ""){ 
      alert("City is Required");
      return;
    }
    if(rstate == ""){
      alert("State is Required");
      return;
    }
    if(rzipcode == ""){
      alert("Zipcode is Required");
      return;
    }

    var today = new Date();
    var date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+" "+time;
    console.log(dateTime);

    const docRef = firestore.doc("reservations/"+Date.now()+"_"+remail);
    console.log("I am going to save " + remail + "'s data to Firestore on "+ "samples/"+remail+"_"+rname);
    docRef.set({
      name: rname,
      email: remail,
      city: rcity,
      zipcode: rzipcode,
      message: rmessage,
      phone: rphone,
      event: revent,
      state: rstate,
      how: rhow,
      dateReserved: dateTime

    }).then(function(){
      alert("Reservation Saved");
      dc.getElementById("r_name").value="";
      dc.getElementById("r_email").value="";
      dc.getElementById("r_city").value="";
      dc.getElementById("r_zipcode").value="";
      dc.getElementById("r_phone").value="";
      dc.getElementById("r_message").value="";
      dc.getElementById("r_how").value="";
      dc.getElementById("r_event").value="";
      dc.getElementById("r_state").value="";

    }).catch(function(error){
      console.log("Got an error: ", error);
    });
  }

  saveReservation.addEventListener("click", function(){
    reserveEvent();

  });

  setEventOptions();