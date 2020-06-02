import {serverURL} from "server/config/config";
import axios from "axios";

export function fetchAuthors() {
  const authors = [
    {authorId: "bkenobi", name: "Obi-Wan Kenobi"},
    {authorId: "lskywalker", name: "Luke Skywalker"},
  ];

  return Promise.resolve(authors);
}

export function signIn(data) {
	console.log(data);
  axios.post(serverURL + "/login", data)
    .then(res => {
      console.log(res);
      return res.data;
    })
    .catch(err => {
			console.log(err);
      return err;
    });
}

export function getData(data, cd) {
  console.log("aaaa");
  axios.post(serverURL + "/getData", data).then(res => {
    cd(res.data)
    // return ;
  })
  .catch(err => {
    cd(err);
    // console.log(err);
    // return err;
  });
}

export function updateData(data) {
  axios.post(serverURL + "/updateData", data)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
}
