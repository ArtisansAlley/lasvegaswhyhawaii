const dc = document;
const db = firestore.collection("events");

const tableBody = dc.querySelector("#tableBody");

var editID = "";

function resetEditForm() {
  dc.getElementById("e_title").value = "";
  dc.getElementById("e_location").value = "";
  dc.getElementById("e_desc").value = "";
  dc.getElementById("e_date").value = "";
}

function setDelID(id) {
  console.log("Set delID " + id);
  delID = id;
  db.doc(id)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        console.log("set delname: " + doc.data().title);
        dc.getElementById("delName").innerHTML = doc.data().title;
      } else {
        console.log("No such docc!");
      }
    })
    .catch(function(error) {
      console.log("Error getting dc:", error);
    });
}

function resetDelID() {
  delID = "";
  delName = "";
}

function renderTable(doc) {
  console.log("Here on render table");

  //initialize Elements
  let tr = dc.createElement("tr");
  let event_title = dc.createElement("td");
  let event_date = dc.createElement("td");
  let event_desc = dc.createElement("td");
  let event_location = dc.createElement("td");
  let action = dc.createElement("td");

  //Initialize Icons
  let trashIcon = dc.createElement("i");
  let editIcon = dc.createElement("i");
  trashIcon.setAttribute("class", "fa fa-trash");
  editIcon.setAttribute("class", "fa fa-edit");

  //Config Buttons
  let delButton = dc.createElement("button");
  let editButton = dc.createElement("button");
  let showMessageButton = dc.createElement("button");
  delButton.setAttribute(
    "class",
    " btn btn-xs btn-danger form-control delButton ml-2 funcButton"
  );
  delButton.setAttribute("id", doc.id);
  delButton.setAttribute("onClick", "setDelID(this.id)");
  delButton.setAttribute("data-toggle", "modal");
  delButton.setAttribute("data-target", "#modalDelete");
  editButton.setAttribute(
    "class",
    " btn btn-xs btn-warning form-control funcButton ml-2"
  );
  editButton.setAttribute("id", doc.id);
  editButton.setAttribute("onClick", "editEventForm(this.id)");
  editButton.setAttribute("data-toggle", "modal");
  editButton.setAttribute("data-target", "#modalEditEvent");
  delButton.appendChild(trashIcon);
  editButton.appendChild(editIcon);
  action.appendChild(delButton);
  action.appendChild(editButton);

  //Insert Text Data From database
  event_title.textContent = doc.data().title;
  event_date.textContent = doc.data().date;
  event_desc.textContent = doc.data().description;
  event_location.textContent = doc.data().location;

  //Build tr
  tr.appendChild(event_title);
  tr.appendChild(event_location);
  tr.appendChild(event_desc);
  tr.appendChild(event_date);
  tr.appendChild(action);

  //insert tr to datatable
  tableBody.appendChild(tr);
}

function addEvent() {
  const aetitle = HtmlSanitizer.SanitizeHtml(ae_title.value);
  const aelocation = HtmlSanitizer.SanitizeHtml(ae_title.value);
  const aedesc = HtmlSanitizer.SanitizeHtml(ae_title.value);
  const aedate = HtmlSanitizer.SanitizeHtml(ae_title.value);

  if (aetitle == "") {
    alert("Title is Required");
    return;
  }
  if (aelocation == "") {
    alert("Please Enter Location");
    return;
  }
  if (aedesc == "") {
    alert("Please add a description");
    return;
  }
  if (aedate == "") {
    alert("Please add a date");
    return;
  }

  const docRef = firestore.doc("events/" + aetitle);
  console.log(
    "I am going to save " +
      aetitle +
      "'s data to Firestore on " +
      "events/" +
      aetitle
  );
  docRef
    .set({
      title: aetitle,
      location: aelocation,
      date: aedate,
      description: aedesc
    })
    .then(function() {
      alert("Reservation Saved");
      dc.getElementById("ae_title").value = "";
      dc.getElementById("ae_location").value = "";
      dc.getElementById("ae_date").value = "";
      dc.getElementById("ae_desc").value = "";
      getRealtimeUpdates();
    })
    .catch(function(error) {
      console.log("Got an error: ", error);
    });
}

function editEventForm(doc_id) {
  editID = doc_id;
  db.doc(doc_id)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        // Set data on forms
        dc.getElementById("e_title").value = doc.data().title;
        dc.getElementById("e_location").value = doc.data().location;
        dc.getElementById("e_desc").value = doc.data().description;
        dc.getElementById("e_date").value = doc.data().date;
        rdateReserved = doc.data().dateReserved;
      } else {
        console.log("No such doc!");
      }
    })
    .catch(function(error) {
      console.log("Error getting doc:", error);
    });
}

function alterEvent() {
  const etitle = HtmlSanitizer.SanitizeHtml(e_title.value);
  const elocation = HtmlSanitizer.SanitizeHtml(e_location.value);
  const edesc = HtmlSanitizer.SanitizeHtml(e_desc.value);
  const edate = HtmlSanitizer.SanitizeHtml(e_date.value);

  if (etitle == "") {
    alert("Title is Required");
    return;
  }
  if (elocation == "") {
    alert("Please Enter Location");
    return;
  }
  if (edesc == "") {
    alert("Please add a description");
    return;
  }
  if (edate == "") {
    alert("Please add a date");
    return;
  }

  console.log(editID);

  const docRef = firestore.doc("events/" + editID);
  console.log("I am going to alter " + etitle + "'s data in Firestore");
  docRef
    .set({
      title: etitle,
      location: elocation,
      date: edate,
      description: edesc
    })
    .then(function() {
      alert("Reservation Saved");
      dc.getElementById("e_title").value = "";
      dc.getElementById("e_location").value = "";
      dc.getElementById("e_date").value = "";
      dc.getElementById("e_desc").value = "";
    })
    .catch(function(error) {
      console.log("Got an error: ", error);
    });
}

function delRow() {
  db.doc(delID)
    .delete()
    .then(function() {
      resetDelID();
      console.log("document successfully deleted!");
      // $(dc).ready(function () {
      //   $('.reservation_table').DataTable().clear();
      // } );
      getRealtimeUpdates();
    })
    .catch(function(error) {
      console.error("Error removing dc: ", error);
    });
}

getRealtimeUpdates = function() {
  var table = $("#events_table").DataTable();
  table.destroy();
  table.clear();
  dc.getElementById("tableBody").innerHTML = " ";
  dc.getElementById("tdLoading").style.display = "block";
  dc.getElementById("events_table").style.display = "none";

  db.get().then(snapshots => {
    snapshots.docs.forEach(doc => {
      renderTable(doc);
      // console.log(doc.data());
    });
    table = $("#events_table").DataTable();
    dc.getElementById("tdLoading").style.display = "none";

    dc.getElementById("events_table").style.display = "block";
  });
};

getRealtimeUpdates();
