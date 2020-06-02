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
import IssueList from "screens/Issue/IssueList/IssueList";
import CustomCollapse from "components/CustomCollapse";

import { connect } from "react-redux";

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

const dataArray = [
  {
    title: "First Element",
		content: <IssueList />,
    text:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur sunt itaque adipisci quisquam pariatur qui, reiciendis architecto quod sint incidunt labore nisi totam illum numquam non magnam praesentium, maxime quaerat!"
  },
  {
    title: "Second Element",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur sunt itaque adipisci quisquam pariatur qui, reiciendis architecto quod sint incidunt labore nisi totam illum numquam non magnam praesentium, maxime quaerat!"
  },
  {
    title: "Third Element",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur sunt itaque adipisci quisquam pariatur qui, reiciendis architecto quod sint incidunt labore nisi totam illum numquam non magnam praesentium, maxime quaerat!"
  }
];
class IssueManagement extends Component {
  render() {
		console.log(this.props.redux);
    return (
			<Container>
				<HeaderMenu {...this.props} title={"Issue"}/>
        <Content padder >
          <CustomCollapse dataArray={dataArray}/>
        </Content>
      </Container>
    );
  }
}

export default connect((state)=>({redux: state}))(IssueManagement);
