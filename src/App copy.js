import React, { Component } from "react";
import { Button, Input, List, Typography } from "antd";
import "antd/dist/antd.css";
import "./App.css";

const recognition = new window.webkitSpeechRecognition();

recognition.continous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

class App extends Component {
  state = {
    todos: [],
    todoId: 0,
    text: "",
    listening: false
  };

  toggleListen = () => {
    let newTodos = this.state.todos;

    if (this.state.text !== "") {
      newTodos = this.addTodo(this.state.text);
    }

    this.setState({
      todos: newTodos,
      todoId: this.state.todoId + 1,
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

  handleClick = () => {
    if (this.state.text !== "") {
      const todos = this.addTodo(this.state.text);
      this.setState({ text: "", todoId: this.state.todoId + 1, todos });
    }
  };

  handleInputChange = event => {
    this.setState({ text: event.target.value });
  };

  addTodo = text => {
    const todos = this.state.todos;
    const todo = { id: this.state.todoId + 1, text: text, completed: false };
    const newTodos = [...todos, todo];

    return newTodos;
  };

  render() {
    let circleBtnType = "";

    if (this.state.listening) {
      circleBtnType = "danger";
    }

    return (
      <div className="app">
        <Input
          placeholder="Say something"
          className="input"
          value={this.state.text}
          onChange={this.handleInputChange}
        />
        <Button type="primary" onClick={this.handleClick} className="btn">
          Add
        </Button>
        <Button
          type={circleBtnType}
          shape="circle"
          icon="phone"
          onClick={this.toggleListen}
        />
        <List
          dataSource={this.state.todos}
          renderItem={todo => (
            <List.Item>
              <Typography.Text mark>[ITEM]</Typography.Text> {todo.text}
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default App;
