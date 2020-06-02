import React from "react";
import Setup from "./src/boot/setup";
import openSocket from "socket.io-client";
import { serverURL } from "./server/config/config";
export default class App extends React.Component {
  constructor(props) {
		super(props);
        this.state = {
            socket: [],
        };
    }
    componentDidMount(){
        this.initSocket();
    }

    initSocket = () =>{
        const socket = openSocket(serverURL);
        socket.on("connect", ()=>{
            console.log("Connected");
        });
        this.setState({socket});
    }
  render() {
    return <Setup />;
  }
}
