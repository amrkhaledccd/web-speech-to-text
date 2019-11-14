import React, { Component } from "react";
import { Form, Row, Col, Input, Button, Icon, List, Typography, DatePicker } from "antd";
import "antd/dist/antd.css";
import "./App.css";

const recognition = new window.webkitSpeechRecognition();

recognition.continous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

const background = "https://i.pinimg.com/originals/49/2d/3d/492d3db4b0fad70c5b1033e55e3d9577.jpg";

class App extends Component {
  state = {
    text: "",
    listening: false
  };

  toggleListen = () => {

    // if (this.state.text !== "") {
    //   newTodos = this.addTodo(this.state.text);
    // }

    this.setState({
      listening: !this.state.listening,
      text: ""
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.listening !== this.state.listening) {
      this.handleListen();
    }
  };

  handleListen = () => {
    console.log("listening?", this.state.listening);

    if (this.state.listening) {
      recognition.start();
      recognition.onend = () => {
        console.log("...continue listening...");
        recognition.start();
      };
    } else {
      recognition.stop();
      recognition.onend = () => {
        console.log("Stopped listening per click");
      };
    }

    recognition.onstart = () => {
      console.log("Listening!");
    };

    let finalTranscript = "";
    recognition.onresult = event => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interimTranscript += transcript;
      }

      console.log("final: " + finalTranscript);
      this.setState({ text: finalTranscript });
    };

    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error);
    };
  };

  render() {
    let circleBtnType = "";

    if (this.state.listening) {
      circleBtnType = "danger";
    }

    return (
        <div className="container" style={{backgroundImage: `url(${background})`}}>
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <Row gutter={24}>
            <Col span={7} > 
              <Input
                  size="large"
                  className="input"
                  placeholder="From: City, Station Or Airport"
                  prefix={<Icon type="global" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
            </Col>
            <Col span={7}> 
             <Input
                  className="input"
                  size="large"
                  placeholder="To: City, Station Or Airport"
                  prefix={<Icon type="global" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
            </Col>
            <Col span={4}> 
                  <DatePicker className="input" size="large" />
            </Col>
            <Col span={4}> 
                <Button className="btn" type="danger" size="large">Search</Button>
            </Col>
            <Col span={2}> 
              <Button
                className="circle-btn"
                type={circleBtnType}
                shape="circle"
                icon="audio"
                onClick={this.toggleListen}
              />
            </Col>
          </Row>

        </Form>
        </div>
        
      );
  }
}

export default App;
