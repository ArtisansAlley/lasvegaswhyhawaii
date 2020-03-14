
  const db = firestore.collection('reservations');
  const eventDB = firestore.collection('events');
  dc = document;
  dc.getElementById("tdLoading").style.display = "none";
  const tableBody = dc.querySelector("#tableBody");
  var eventSetter = dc.querySelector("#r_event");

  var rname = "";
  var remail = "";
  var rcity = "";
  var rzipcode = "";
  var rphone = "";
  var rmessage = "";
  var rhow = "";
  var revent = "";
  var rstate = "";
  var rdateReserved = "";

  function truncateString(str, num) {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...';
  }
  function resetDelID(){
    delID = "";
    delName = "";
  }

  function setDelID(id){
    console.log("Set delID "+id);
    delID = id;
    db.doc(id).get().then(function(doc) {
      if (doc.exists) {
        console.log("set delname: "+ doc.data().name);
        dc.getElementById("delName").innerHTML = doc.data().name;
      } else {
        console.log("No such docc!");
      }
    }).catch(function(error) {
      console.log("Error getting dc:", error);
    });
  }


  function renderEventOptions(doc){
    console.log("Here on render Admin Options: "+doc.data().title+" | "+doc.data().date);
    let option = dc.createElement('option');
    option.textContent = doc.data().title+" | "+doc.data().date;
    dc.querySelector("#r_event").appendChild(option);
  }

  function setEventOptions(){
    eventDB.get().then((snapshots) => {
      snapshots.docs.forEach(doc=> {
        renderEventOptions(doc);
      })
    });

  }

  function renderTable(doc){
    let tr = dc.createElement('tr');

    let r_name = dc.createElement('td');
    let r_phone = dc.createElement('td');
    let r_email = dc.createElement('td');
  // let r_city = dc.createElement('td');
  // let r_zipcode = dc.createElement('td');
  // let r_state = dc.createElement('td');
  let r_address = dc.createElement('td');
  let r_how = dc.createElement('td');
  let r_message = dc.createElement('td');

  let r_event = dc.createElement('td');
  let r_dateReserved = dc.createElement('td');

  let action = dc.createElement('td');
  let delButton = dc.createElement('button');
  let trashIcon = dc.createElement('i')
  let editButton = dc.createElement('button');
  let editIcon = dc.createElement('i')
  let showMessageButton = dc.createElement('button');
  let showMessageIcon = dc.createElement('i');
  let spanMessage = dc.createElement('span');

  spanMessage.setAttribute('class', "textControl");

  trashIcon.setAttribute('class', "fa fa-trash");
  editIcon.setAttribute('class', "fa fa-edit");
  showMessageIcon.setAttribute('class', "fa fa-edit");

  tr.setAttribute('data-id', doc.id);
  delButton.setAttribute('class', " btn btn-xs btn-danger form-control delButton funcButton");
  delButton.setAttribute('id', doc.id);
  delButton.setAttribute('onClick', "setDelID(this.id)");
  delButton.setAttribute('data-toggle', "modal");
  delButton.setAttribute('data-target', "#modalDelete");

  editButton.setAttribute('class', " btn btn-xs btn-warning form-control funcButton");
  editButton.setAttribute('id', doc.id);
  editButton.setAttribute('onClick', "editEventForm(this.id)");
  editButton.setAttribute('data-toggle', "modal");
  editButton.setAttribute('data-target', "#modalEdit");

  showMessageButton.setAttribute('id', doc.id);
  showMessageButton.setAttribute('class', " btn btn-xs btn-success form-control btnControl textControl");
  showMessageButton.setAttribute('onClick', "showMessage(this.id)");
  showMessageButton.setAttribute('data-toggle', "modal");
  showMessageButton.setAttribute('data-target', "#modalMessage");

  r_event.setAttribute('title', doc.data().event);
  r_dateReserved.setAttribute('title', doc.data().dateReserved);

  spanMessage.textContent = truncateString(doc.data().message, 5);
  r_name.textContent = doc.data().name;
  r_phone.textContent = doc.data().phone;
  r_email.textContent = doc.data().email;
  // r_city.textContent = doc.data().city;
  // r_zipcode.textContent = doc.data().zipcode;
  // r_state.textContent = doc.data().state;
  r_address.textContent =doc.data().zipcode+", "+doc.data().city+", "+doc.data().state;
  r_how.textContent = doc.data().how;
  r_event.textContent = truncateString(doc.data().event, 8);
  var dateOnly = doc.data().dateReserved.split(" ");
  r_dateReserved.textContent = dateOnly[0];


  showMessageButton.appendChild(spanMessage);  
  // showMessageButton.appendChild(showMessageIcon);
  r_message.appendChild(showMessageButton);
  
  delButton.appendChild(trashIcon);
  action.appendChild(delButton);
  editButton.appendChild(editIcon);
  action.appendChild(editButton);

  tr.appendChild(r_name);
  tr.appendChild(r_phone);
  tr.appendChild(r_email);
  // tr.appendChild(r_city);
  // tr.appendChild(r_state);
  // tr.appendChild(r_zipcode);
  tr.appendChild(r_address);
  tr.appendChild(r_how);
  tr.appendChild(r_event);
  tr.appendChild(r_message);
  tr.appendChild(r_dateReserved);
  tr.appendChild(action);

  tableBody.appendChild(tr);
}



getRealtimeUpdates = function(){
  var table = $('#reservation_table').DataTable();
  table.destroy();
  table.clear();
  dc.getElementById("tableBody").innerHTML = " ";
  dc.getElementById("tdLoading").style.display = "block";
  dc.getElementById("reservation_table").style.display = "none";

  db.get().then((snapshots) => {
    snapshots.docs.forEach(doc=> {
      renderTable(doc);
        // console.log(doc.data());
      });
    table = $('#reservation_table').DataTable();
    dc.getElementById("tdLoading").style.display = "none";
    dc.getElementById("reservation_table").style.display = "block";
  });
}

function delRow(){
  db.doc(delID).delete().then(function() {
    resetDelID();
    console.log("document successfully deleted!");
    // $(dc).ready(function () {
    //   $('.reservation_table').DataTable().clear();
    // } );
    getRealtimeUpdates();
  }).catch(function(error) {
    console.error("Error removing dc: ", error);
  });
}

function showMessage(doc_id){
  // console.log("Here on show Message");
  dc.getElementById("nameForMessage").innerHTML = "Loading Data...";
  dc.getElementById("messagePlaceHolder").innerHTML = "Loading Data...";
  db.doc(doc_id).get().then(function(doc) {
    if (doc.exists) {
      dc.getElementById("nameForMessage").innerHTML = doc.data().name + "'s Message";
      dc.getElementById("messagePlaceHolder").innerHTML = doc.data().message;
      console.log("dc data:", doc.data().name);
      console.log("dc data:", doc.data().message);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such dc!");
      }
    }).catch(function(error) {
      console.log("Error getting dc:", error);
    });
  }


  function resetEditForm(){
    dc.getElementById("r_name").value = "";
    dc.getElementById("r_phone").value = "";
    dc.getElementById("r_email").value = "";
    dc.getElementById("r_city").value = "";
    dc.getElementById("r_zipcode").value = "";
    dc.getElementById("r_how").value = "";
    dc.getElementById("r_message").value = "";
    dc.getElementById("r_state").value = "";
    dc.getElementById("r_event").value = "";

  }
  function editEventForm(doc_id){
    editID = doc_id;
    db.doc(doc_id).get().then(function(doc) {
      if (doc.exists) {
        // dc.getElementById("nameForMessage").innerHTML = doc.data().name + "'s Message";
        dc.getElementById("messagePlaceHolder").innerHTML = doc.data().message;
        console.log("dc data:", doc.data().name);

        // Set data on forms
        dc.getElementById("r_name").value = doc.data().name;
        dc.getElementById("r_phone").value = doc.data().phone;
        dc.getElementById("r_email").value = doc.data().email;
        dc.getElementById("r_city").value = doc.data().city;
        dc.getElementById("r_zipcode").value = doc.data().zipcode;
        dc.getElementById("r_how").value = doc.data().how;
        dc.getElementById("r_message").value = doc.data().message;
        dc.getElementById("r_state").value = doc.data().state;
        dc.getElementById("r_event").value = doc.data().event;
        rdateReserved = doc.data().dateReserved;

      } else {
        // doc.data() will be undefined in this case
        console.log("No such doc!");
      }
    }).catch(function(error) {
      console.log("Error getting doc:", error);
    });   
  }

  function alterEvent(){
    rname = HtmlSanitizer.SanitizeHtml(dc.getElementById("r_name").value);
    remail = HtmlSanitizer.SanitizeHtml(dc.getElementById("r_email").value);
    rcity = HtmlSanitizer.SanitizeHtml(dc.getElementById("r_city").value);
    rzipcode = HtmlSanitizer.SanitizeHtml(dc.getElementById("r_zipcode").value);
    rphone = HtmlSanitizer.SanitizeHtml(dc.getElementById("r_phone").value);
    rmessage = HtmlSanitizer.SanitizeHtml(dc.getElementById("r_message").value);
    rhow = HtmlSanitizer.SanitizeHtml(dc.getElementById("r_how").value);
    revent = HtmlSanitizer.SanitizeHtml(dc.getElementById("r_event").value);
    rstate = HtmlSanitizer.SanitizeHtml(dc.getElementById("r_state").value);

    const docRef = firestore.doc("reservations/"+editID);
    console.log("I am going to edit " + rname + "'s data to Firestore on "+ "reservations/"+editID);
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
      dateReserved: rdateReserved

    }).then(function(){
      alert("Reservation Updated");
      getRealtimeUpdates();
      // resetEditForm();

    }).catch(function(error){
      console.log("Got an error: ", error);
    });

  }


  setEventOptions()
  getRealtimeUpdates();
