//INIT
const dbBlogs = firestore.collection("blogs");
dc = document;
dc.getElementById("tdLoading").style.display = "none";
var uploader = dc.getElementById("uploader");
var fileButton = dc.getElementById("fileButton");
var file = "";
var file_extension = "";
var fileName = "";
var documentName = Date.now();
const tableBody = dc.querySelector("#tableBody");

var editID = "";
var delID = "";

function setDelID(id) {
  console.log("Set delID " + id);
  delID = id;
  dbBlogs
    .doc(id)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        console.log("set delname: " + doc.data().title);
        dc.getElementById("delName").innerHTML = doc.data().title;
        fileName = doc.data().graphic;
      } else {
        console.log("No such docc!");
      }
    })
    .catch(function(error) {
      console.log("Error getting dc:", error);
    });
}

function delRow() {
  dbBlogs
    .doc(delID)
    .delete()
    .then(function() {
      deleteFile(fileName);
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

function resetDelID() {
  delID = "";
  delName = "";
}

function hideVideo() {
  dc.getElementById("imgContent").style.display = "none";
  dc.getElementById("upload_content").style.display = "none";
  dc.getElementById("videoSample").style.display = "none";
  dc.getElementById("imgContent2").style.display = "none";
  dc.getElementById("upload_content2").style.display = "none";
  dc.getElementById("videoSample2").style.display = "none";

  dc.getElementById("videoSample").src = "";
  dc.getElementById("videoSample2").src = "";
  dc.getElementById("imgContent2").src = "";
  dc.getElementById("imgContent").src = "";
}

function checkIfVideo(fileName) {
  extention = fileName.split(".");
  console.log(extention[extention.length - 1].toLowerCase());
  if (
    extention[extention.length - 1].toLowerCase() == "avi" ||
    extention[extention.length - 1].toLowerCase() == "flv" ||
    extention[extention.length - 1].toLowerCase() == "wmv" ||
    extention[extention.length - 1].toLowerCase() == "mov" ||
    extention[extention.length - 1].toLowerCase() == "mp4"
  ) {
    return true;
  } else {
    return false;
  }
}
function checkIfImage(fileName) {
  extention = fileName.split(".");
  console.log("extension is: " + extention[extention.length - 1]);
  if (
    extention[extention.length - 1].toLowerCase() == "jpeg" ||
    extention[extention.length - 1].toLowerCase() == "gif" ||
    extention[extention.length - 1].toLowerCase() == "png" ||
    extention[extention.length - 1].toLowerCase() == "jpg"
  ) {
    return true;
  } else {
    return false;
  }
}
function showVideo(fileName) {
  console.log("set to" + fileName);
  if (fileName !== "") {
    var pathReference = storage.ref("videos/" + fileName);
    pathReference
      .getDownloadURL()
      .then(function(url) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function(event) {
          var blob = xhr.response;
        };
        xhr.open("GET", url);
        if (checkIfVideo(fileName)) {
          dc.getElementById("imgContent").style.display = "none";
          dc.getElementById("upload_content").style.display = "none";
          dc.getElementById("videoSample").src = url;
          dc.getElementById("videoSample").style.display = "block";
        } else if (checkIfImage(fileName)) {
          dc.getElementById("videoSample").style.display = "none";
          dc.getElementById("upload_content").src = url;
          dc.getElementById("imgContent").style.display = "block";
          dc.getElementById("upload_content").style.display = "block";
        } else {
          $.growl({
            title: "File is not supported for preview",
            message:
              "File extension supported are: jpeg/jpg, png, gif, mov, mp4 and avi."
          });
        }
        console.log(url);
      })
      .catch(function(error) {});
  } else {
    hideVideo();
  }
}
function showVideo2(fileName) {
  console.log("set to" + fileName);
  if (fileName !== "") {
    var pathReference = storage.ref("videos/" + fileName);
    pathReference
      .getDownloadURL()
      .then(function(url) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function(event) {
          var blob = xhr.response;
        };
        xhr.open("GET", url);
        console.log(url);
        if (checkIfVideo(fileName)) {
          dc.getElementById("imgContent2").style.display = "none";
          dc.getElementById("upload_content2").style.display = "none";
          dc.getElementById("videoSample2").style.display = "block";
          dc.getElementById("videoSample2").src = url;
        } else if (checkIfImage(fileName)) {
          dc.getElementById("videoSample2").style.display = "none";
          dc.getElementById("imgContent2").style.display = "block";
          dc.getElementById("upload_content2").style.display = "block";
          dc.getElementById("upload_content2").src = url;
        } else {
          $.growl({
            title: "File is not supported for preview",
            message:
              "File extension supported are: jpeg/jpg, png, gif, mov, mp4 and avi."
          });
        }
        console.log(url);
      })
      .catch(function(error) {});
  } else {
    hideVideo();
  }
}

//Event Listener For Upload
fileButton.addEventListener("change", function(e) {
  dc.getElementById("uploader").style.display = "block";
  dc.getElementById("uploader").style.width = "100%";
  documentName = Date.now();
  //GET FILE
  file = e.target.files[0];
  fileName = file.name.split(".");
  file_extension = fileName[fileName.length - 1];
  fileName = documentName + "." + file_extension;
  var storageRef = storage.ref("videos/" + fileName);
  //UPLOAD FILE
  var task = storageRef.put(file);
  task.on(
    "state_changed",
    function progress(snapshot) {
      // console.log(snapshot);
      var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploader.value = percentage;
      uploader.style.content = percentage;
    },
    function error(err) {
      console.log(err);
    },
    function complete() {
      dc.getElementById("uploader").style.display = "none";
      dc.getElementById("fileButton").style.display = "none";
      showVideo(fileName);
      dc.getElementById("uploadConfirmation").style.display = "block";
    }
  );
});

function uploadBlog() {
  var b_title = dc.querySelector("#b_title");
  var b_caption = dc.querySelector("#b_caption");
  // documentName = Date.now();
  const docRef = firestore.doc("blogs/" + documentName);
  var d = new Date();
  var date = d.getDate();
  var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  var year = d.getFullYear();
  var dateStr = date + "/" + month + "/" + year;
  docRef
    .set({
      title: HtmlSanitizer.SanitizeHtml(b_title.value),
      caption: HtmlSanitizer.SanitizeHtml(b_caption.value),
      graphic: fileName,
      dateUploaded: dateStr,
      timeMili: documentName
    })
    .then(function() {
      $.growl({
        title: "Blog Uploaded",
        message: "Please wait moment as we prepare your blog."
      });
      $(".modal").modal("hide");
      dc.getElementById("uploadConfirmation").style.display = "none";
      dc.getElementById("upload_form").reset();
      fileName = "";
      dc.getElementById("fileButton").style.display = "block";
      getRealtimeUpdates();
    })
    .catch(function(error) {
      console.log("Got an error: ", error);
    });
}

function deleteFile(fileName) {
  var pathReference = storage.ref("videos/" + fileName);
  // Delete the file
  pathReference
    .delete()
    .then(function() {
      // File deleted successfully
    })
    .catch(function(error) {
      // Uh-oh, an error occurred!
    });
}

function renderTable(doc) {
  let tr = dc.createElement("tr");

  let blog_title = dc.createElement("td");
  let blog_date = dc.createElement("td");
  let blog_content = dc.createElement("td");
  let blog_caption = dc.createElement("td");
  let action = dc.createElement("td");

  //Initialize Icons
  let trashIcon = dc.createElement("i");
  let editIcon = dc.createElement("i");
  let showIcon = dc.createElement("i");
  trashIcon.setAttribute("class", "fa fa-trash");
  editIcon.setAttribute("class", "fa fa-edit");
  showIcon.setAttribute("class", "fa fa-eye");

  //Config Buttons
  let delButton = dc.createElement("button");
  let editButton = dc.createElement("button");
  let showButton = dc.createElement("button");

  delButton.setAttribute(
    "class",
    " btn btn-xs btn-danger form-control delButton ml-2 funcButton"
  );
  delButton.setAttribute("id", doc.id);
  delButton.setAttribute("onClick", "setDelID(this.id)");
  delButton.setAttribute("data-toggle", "modal");
  delButton.setAttribute("data-target", "#modalDelete");
  delButton.appendChild(trashIcon);

  editButton.setAttribute(
    "class",
    " btn btn-xs btn-warning form-control funcButton ml-2"
  );
  editButton.setAttribute("id", doc.id);
  editButton.setAttribute("onClick", "editEventForm(this.id)");
  editButton.setAttribute("data-toggle", "modal");
  editButton.setAttribute("data-target", "#modalEditEvent");
  editButton.appendChild(editIcon);

  showButton.setAttribute(
    "class",
    " btn btn-xs btn-success form-control funcButton ml-2"
  );
  showButton.setAttribute("id", doc.id);
  showButton.setAttribute(
    "onClick",
    "showVideo2('" + doc.data().graphic + "')"
  );
  showButton.setAttribute("data-toggle", "modal");
  showButton.setAttribute("data-target", "#showContent");
  showButton.appendChild(showIcon);

  action.appendChild(delButton);
  action.appendChild(editButton);

  //Insert Text Data From database
  blog_title.textContent = doc.data().title;
  blog_caption.textContent = doc.data().caption;
  var date_created = doc.data().dateUploaded;
  blog_date.textContent = date_created;
  blog_content.appendChild(showButton);

  //Build tr
  tr.appendChild(blog_title);
  tr.appendChild(blog_caption);
  tr.appendChild(blog_date);
  tr.appendChild(blog_content);
  tr.appendChild(action);

  //insert tr to datatable
  tableBody.appendChild(tr);
}

getRealtimeUpdates = function() {
  var table = $("#blogs_table").DataTable();
  table.destroy();
  table.clear();
  dc.getElementById("tableBody").innerHTML = " ";
  dc.getElementById("tdLoading").style.display = "block";
  dc.getElementById("blogs_table").style.display = "none";

  dbBlogs
    .orderBy("timeMili", "desc")
    .get()
    .then(snapshots => {
      snapshots.docs.forEach(doc => {
        renderTable(doc);
        // console.log(doc.data());
      });
      table = $("#blogs_table").DataTable({
        order: [[2, "desc"]]
      });
      dc.getElementById("tdLoading").style.display = "none";

      dc.getElementById("blogs_table").style.display = "block";
    });
};

$("#uploadModal").on("hide.bs.modal", function() {
  hideVideo();
});
$("#showContent").on("hide.bs.modal", function() {
  hideVideo();
});

$("#uploadModal").on("show.bs.modal", function() {
  showVideo(fileName);
});

getRealtimeUpdates();
