const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {firebase} = require("./database/Firebase/config.js");
const contentType = require("content-type");
const { writeFile } = require("fs");
const getRawBody = require("raw-body");
var {port} = require("./config/config.js");

const app = express();

port = process.env.PORT || port;

app.use(bodyParser.json());
app.use(cors());

const server = app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});

let io = require("socket.io").listen(server, () =>
  console.log("Express server is running on localhost:" + port),
);

app.get("/", (req, res) => res.send("hello"));

app.post("/login", (req, res) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(req.body.email, req.body.password)
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch(err => {
      console.log(err);
			res.send(err);
    });
});

app.post("/getData", (req, res) => {
  console.log(req.body.ref + req.body.child + req.body.childValue);
  var query = null;

  if (req.body.child)
    {query = firebase
      .database()
      .ref(req.body.ref)
      .orderByChild(req.body.child)
      .equalTo(req.body.childValue);}
  else {query = firebase.database().ref(req.body.ref);}
  query.once("value", snapshot => {
    let tempArray = [];
    // let keyArray = Object.keys(item.val());
    // let allArray = Object.values(item.val());
    // for (let i = 0; i < allArray.length; i++) {
      // tempArray.push({...allArray[i], Key: keyArray[i]});
    // }

		console.log("snapshot.val() = ",snapshot.val());
		snapshot.forEach((item)=>{
			let data = (typeof item.val() === "object") ? item.val() : {Value: item.val()};
			tempArray.push({...data, Key: item.key});
		});

    res.send(tempArray);
  });
});

app.get("/logout", (req, res) => {
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
      res.send("success");
    })
    .catch(function(error) {
      // An error happened.
      res.send("error");
    });
});

app.post("/authChange", (req, res) => {
  console.log("kiem tra dang nhap chua");
  let user = firebase.auth().currentUser;
  if (user) {res.send("success");}
  else {res.send("failed");}
});

app.post("/user", (req, res) => {
  let uidv4 = require("uuid/v4");
  let uid = uidv4();
  let data = {
    uid: uid,
    email: req.body.email,
    emailVerified: false,
    displayName: req.body.fullname,
    password: req.body.password,
    disabled: false,
  };
  auth
    .createUser(data)
    .then(user => {
      res.send("success");
    })
    .catch(err => {
      res.send("error");
    });
});

app.put("/user", (req, res) => {
  firebase
    .auth()
    .sendPasswordResetEmail(req.body.email)
    .then(() => {
      res.send("success");
    })
    .catch(() => {
      res.send("error");
    });
});

app.post("/upload_raw", function (req, res, next) {
  console.log("/upload_raw");
  console.log(`Received headers: ${JSON.stringify(req.headers)}`);
  console.log(contentType.parse(req));

  getRawBody(req, {
    length: req.headers["content-length"],
    limit: "50mb",
    encoding: contentType.parse(req).parameters.charset
  }, function (err, string) {
    if (err) {return next(err);}
		let base64data = Buffer.from(string, "binary").toString("base64");
		console.log(firebase);
		// let storageRef = firebase.app().storage().ref('test');
		// storageRef.putString(base64data, 'base64').then(function(snapshot) {
			// console.log('Uploaded a base64 string!');
		// });
    // const savePath = `tmp/raw/${uuidv4()}`
    // console.log(`Writing to: ${savePath}`)

    // writeFile(savePath, string, 'binary', function (err) {
      // if (err) {
        // console.log('Write error:', err)
        // res.status = 500
      // } else {
        // console.log('Wrote file.')
        // res.status = 202
      // }
      // res.end()
    // })
  });
});

io.on("connection", socket => {
  console.log("user connected");

  socket.on("update", obj => {
    var id = obj.uid ? obj.uid : firebase
    .database()
    .ref()
    .child(obj.ref)
    .push().key;
    if (typeof obj.data  === "object") {
      firebase
      .database()
      .ref(obj.ref + "/" + id)
      .update(obj.data)
      .then(() => {
        console.log(obj.data);
        socket.emit("change" + obj.ref);
        socket.broadcast.emit("change" + obj.ref);
      });
    }
    if (typeof obj.data  === "string") {
      var updates = {};
      updates["/" + obj.ref + "/" + id] = obj.data;
      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          console.log(obj.data);
          socket.emit("change" + obj.ref);
          socket.broadcast.emit("change" + obj.ref);
        });
      }
  });

  socket.on("delete", obj => {
    firebase
      .database()
      .ref(obj.ref + "/" + obj.uid)
      .remove()
      .then(() => {
        socket.emit("change" + obj.ref);
        socket.broadcast.emit("change" + obj.ref);
      });
  });

  socket.on("add", obj => {
    console.log(obj);
    let newPostKey = firebase
      .database()
      .ref()
      .child(obj.ref)
      .push().key;
    firebase
      .database()
      .ref(obj.ref + "/" + newPostKey)
      .set(obj.data)
      .then(() => {
        socket.emit("change" + obj.ref);
        socket.broadcast.emit("change" + obj.ref);
      });
  });

  socket.on("edit", obj => {
    console.log(obj.data);
    firebase
      .database()
      .ref(obj.ref + "/" + obj.uid)
      .update(obj.data)
      .then(() => {
        socket.emit("change" + obj.ref);
        socket.broadcast.emit("change" + obj.ref);
      });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
