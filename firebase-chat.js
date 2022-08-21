(function () {
  // TODO: replace this with your own firebase config object after creating app in your firebase console
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDsZ7lwQ9M8z9cHKDErxbkqEBpxMXgnKCk",
    authDomain: "chatboy-5def2.firebaseapp.com",
    databaseURL: "https://chatboy-5def2-default-rtdb.firebaseio.com",
    projectId: "chatboy-5def2",
    storageBucket: "chatboy-5def2.appspot.com",
    messagingSenderId: "378094025565",
    appId: "1:378094025565:web:d9bff0ed0f2e69925b86b4",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // handle on firebase db
  const db = firebase.database();

  // get elements
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const login = document.getElementById("login");
  const signup = document.getElementById("signup");
  const logout = document.getElementById("logout");
  const message = document.getElementById("message");
  const write = document.getElementById("write");
  const read = document.getElementById("read");
  const status = document.getElementById("status");
  const userNameDisplay = document.getElementById("name-display"); // element that can show the current user's email
  const chat = document.getElementById("chat-box");
  let currentUserEmail = ""; // variable to store the current user's email

  // write
  write.addEventListener("click", (e) => {
    const messages = db.ref("messages");

    // simple id - ok for example, do not use in production
    const id = new Date().getTime();

    // TODO: Add the value of currentUserEmail when writing to the database under the field name of "sender"
    messages
      .child(id)
      .set({ message: message.value })
      .then(function () {
        console.log("Wrote to DB!");
      });
  });

  // read
  read.addEventListener("click", (e) => {
    handleRead();
  });

  // TODO: use this provided messagesRef to listen for updates and update the chat div on any update, not just when the 'Update Chat' button is clicked
  const messagesRef = db.ref("messages");

  function handleRead() {
    status.innerHTML = "";
    chat.innerHTML = "";
    const messages = db.ref("messages");

    messages.once("value").then(function (dataSnapshot) {
      var data = dataSnapshot.val();
      if (data) {
        var keys = Object.keys(data);

        keys.forEach(function (key) {
          console.log(data[key]);
          chat.innerHTML +=
            (data[key]["sender"] || "") +
            "   :   " +
            data[key].message +
            "<br><br>";
        });
      }
    });
  }

  // TODO: in this function you should set the userNameDisplay.innerHTML to the passed in userEmail as well as updating the currentUserEmail variable to that same value
  function updateCurrentUser(userEmail) {}

  // login
  login.addEventListener("click", (e) => {
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(
      email.value,
      password.value
    );
    promise.then((resp) => {
      console.log("User Login Response: ", resp);
      logout.style.display = "inline";
      login.style.display = "none";
      signup.style.display = "none";
      write.style.display = "inline";
      updateCurrentUser(resp.user.email);
    });
    promise.catch((e) => console.log(e.message));
  });

  // signup
  signup.addEventListener("click", (e) => {
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(
      email.value,
      password.value
    );
    promise.then((resp) => {
      console.log("User Signup + Login Response: ", resp);
      logout.style.display = "inline";
      login.style.display = "none";
      signup.style.display = "none";
      write.style.display = "inline";
      updateCurrentUser(resp.user.email);
    });
    promise.catch((e) => console.log(e.message));
  });

  // logout
  logout.addEventListener("click", (e) => {
    firebase
      .auth()
      .signOut()
      .then((resp) => {
        console.log("Logout Response: ", resp);
        logout.style.display = "none";
        login.style.display = "inline";
        signup.style.display = "inline";
        write.style.display = "none";
        updateCurrentUser("");
      })
      .catch((e) => console.warn(e.message));
  });
})();
