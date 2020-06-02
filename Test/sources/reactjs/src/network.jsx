import React, { Component } from 'react';
import NotificationError from "../src/components/Notification/NotificationError.jsx";
import NotificationSuccess from "../src/components/Notification/NotificationSuccess.jsx";
import { notification } from 'antd';

export default function (ComposedComponent) {
  class NetworkDetector extends Component {
    state = {
      isDisconnected: false,
      brerror:null,
      br:null
    }

    componentDidMount() {
        this.error("Mất kết nối!")
        // this.success("Có kết nối trở lại!")
      this.handleConnectionChange();
      window.addEventListener('online', this.handleConnectionChange);
      window.addEventListener('offline', this.handleConnectionChange);
    }

    componentWillUnmount() {
      window.removeEventListener('online', this.handleConnectionChange);
      window.removeEventListener('offline', this.handleConnectionChange);
    }


    handleConnectionChange = () => {
      const condition = navigator.onLine ? 'online' : 'offline';
      if (condition === 'online') {
        const webPing = setInterval(
          () => {
            fetch('//google.com', {
              mode: 'no-cors',
              })
            .then(() => {
              this.setState({ isDisconnected: false }, () => {
                return clearInterval(webPing)
              });
            }).catch(() => this.setState({ isDisconnected: true }))
          }, 2000);
        return;
      }

      return this.setState({ isDisconnected: true });
    }
    success = (mess) => {
        this.setState({ br : <NotificationSuccess closeNoti={() =>  this.setState({ brsuccess: null })} message ={mess} /> }) 
    }
    error = (mess) => {
        this.setState({ 
            brerror : <NotificationError closeNoti={() =>  this.setState({ brerror: null })} message={mess} duration={0}/>  
        })      
    }

    render() {
      const { isDisconnected } = this.state;
      console.log('network',isDisconnected)
      return (
        <div>
          { isDisconnected ? (<div>
              
              {this.state.brerror}
            </div>):<div>{notification.destroy()}</div>
          }
          <ComposedComponent {...this.props} />
        </div>
      );
    }
  }

  return NetworkDetector;
}