//INIT
const dbBlogs = firestore.collection("blogs");
dc = document;
var file = "";
var file_extension = "";
const wall_content = dc.querySelector("#wall-content");
var link = "";

function checkIfVideo(fileName) {
  extention = fileName.split(".");
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
function setLink(fileName, doc_id) {
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
        dc.getElementById(doc_id).src = url;
      })
      .catch(function(error) {});
  } else {
    console.log("No graphic found");
  }
}

function renderwall_content(doc) {
  var graphic = doc.data().graphic;
  var file_is_video = checkIfVideo(graphic);
  let div_row = dc.createElement("div");
  let div_card = dc.createElement("div");
  let div_cardbody = dc.createElement("div");
  let h5_cardtitle = dc.createElement("h5");
  let h6_cardsubtitle = dc.createElement("h6");
  let div_videoWrapper = dc.createElement("div");
  let iframe = dc.createElement("iframe");
  let image = dc.createElement("img");
  let source = dc.createElement("source");
  let p_cardText = dc.createElement("p");
  let br = dc.createElement("br");

  p_cardText.setAttribute("class", "mt-2");

  div_row.setAttribute("class", "row mt-2");
  div_card.setAttribute("class", "card col-sm-12");

  h5_cardtitle.setAttribute("class", "card-title");
  h5_cardtitle.textContent = doc.data().title;
  div_cardbody.appendChild(h5_cardtitle);

  h6_cardsubtitle.setAttribute("class", "card-subtitle mb-1 text-muted");
  var dateString = doc.data().dateUploaded;
  var dateParts = dateString.split("/");
  var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
  h6_cardsubtitle.textContent = dateObject.toDateString();
  div_cardbody.appendChild(h6_cardsubtitle);

  p_cardText.textContent = doc.data().caption;
  div_cardbody.appendChild(p_cardText);

  if (file_is_video) {
    iframe.setAttribute("id", doc.id);
    iframe.setAttribute(
      "class",
      "frame embed-responsive embed-responsive-16by9 "
    );
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute(
      "allow",
      "accelerometer; encrypted-media; gyroscope; picture-in-picture"
    );
    setLink(doc.data().graphic, doc.id);
    div_videoWrapper.setAttribute("class", "videoWrapper");
    div_videoWrapper.appendChild(iframe);
    div_cardbody.appendChild(div_videoWrapper);
    div_cardbody.appendChild(br);
  } else {
    image.setAttribute("id", doc.id);
    image.setAttribute("alt", "");
    image.setAttribute("class", "image-content pb-2");
    setLink(doc.data().graphic, doc.id);
    div_cardbody.appendChild(image);
  }

  div_card.appendChild(div_cardbody);
  div_row.appendChild(div_card);
  wall_content.appendChild(div_row);
}
getRealtimeUpdates = function() {
  dc.getElementById("wall-content").style.display = "none";
  dbBlogs
    .orderBy("timeMili", "desc")
    .get()
    .then(snapshots => {
      snapshots.docs.forEach(doc => {
        renderwall_content(doc);
      });
      dc.getElementById("wall-content").style.display = "block";
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
