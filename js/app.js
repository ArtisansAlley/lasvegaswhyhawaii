// Your web app's Firebase configuration

var firebaseConfig = {
  apiKey: "AIzaSyBTiYkMokwIgrVnAvlxGQu_CXwjGYnpnDk",
  authDomain: "whyhawaii-68725.firebaseapp.com",
  databaseURL: "https://whyhawaii-68725.firebaseio.com",
  projectId: "whyhawaii-68725",
  storageBucket: "whyhawaii-68725.appspot.com",
  messagingSenderId: "670512143133",
  appId: "1:670512143133:web:bf6367b50bb78e5339dff4",
  measurementId: "G-375N5SJGMY"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var firestore = firebase.firestore();
var storage = firebase.storage();
// console.log("Here on App.js with " + sessionStorage.getItem("why_username") );

var editID = "";
var delID = "";
var delName = "";
