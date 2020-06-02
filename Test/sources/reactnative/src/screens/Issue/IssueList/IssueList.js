import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  List,
  ListItem,
  Text,
  Thumbnail,
  Left,
  Right,
  Body
} from "native-base";
import styles from "./styles";
import HeaderMenu from "components/HeaderMenu";
import Axios from 'axios';
import { serverURL } from 'server/config/config';

const pratik = require("assets/contacts/pratik.png");
const sanket = require("assets/contacts/sanket.png");
const megha = require("assets/contacts/megha.png");
const atul = require("assets/contacts/atul.png");
const saurabh = require("assets/contacts/saurabh.png");
const varun = require("assets/contacts/varun.png");
const datas = [
  {
    img: pratik,
    text: "Kumar Pratik",
    note: "Its time to build a difference . .",
    time: "3:43 pm"
  },
  {
    img: sanket,
    text: "Kumar Sanket",
    note: "One needs courage to be happy and smiling all time . . ",
    time: "1:12 pm"
  },
  {
    img: megha,
    text: "Megha",
    note: "Live a life style that matchs your vision",
    time: "10:03 am"
  },
  {
    img: atul,
    text: "Atul Ranjan",
    note: "Failure is temporary, giving up makes it permanent",
    time: "5:47 am"
  },
  {
    img: saurabh,
    text: "Saurabh Sahu",
    note: "The biggest risk is a missed opportunity !!",
    time: "11:11 pm"
  },
  {
    img: varun,
    text: "Varun Sahu",
    note: "Wish I had a Time machine . .",
    time: "8:54 pm"
  }
];

class NHListAvatar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};
	}
	componentDidMount = ()=>{
		Axios.post(serverURL + '/getData',{ref:"ProjectRole", child: "UserId", childValue: "Zn8bxkkUFyZ89utVZ3UlLwxMRCI3"})
		.then(res => {
			// Axios.post(serverURL + '/getData',{ref:"Project", child: "UserId", childValue: "Zn8bxkkUFyZ89utVZ3UlLwxMRCI3"})
			// .then(res => {
				// console.log(res.data);
				// this.setState({Types: res.data});
			// })
			// .catch(err => console.log(err));
		})
		.catch(err => console.log(err));
	}
  render() {
    return (
			<List
				dataArray={datas}
				renderRow={data =>
					<ListItem avatar>
						<Left>
							<Thumbnail small source={data.img} />
						</Left>
						<Body>
							<Text>
								{data.text}
							</Text>
							<Text numberOfLines={1} note>
								{data.note}
							</Text>
						</Body>
						<Right>
							<Text note>
								{data.time}
							</Text>
						</Right>
					</ListItem>}
			/>
    );
  }
}

export default NHListAvatar;
