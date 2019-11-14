import React, { Component } from "react";

const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

class SpeechRecognitionService extends Component {
  state = {};

  onResult = (result, isFinal) => {
    this.recognition.onresult = event => {
      if (!event.results) {
        return;
      }
      const lastResult = event.results[event.results.length - 1];
      if (!lastResult.isFinal) {
        callback("...", false);
        return;
      }
      callback(lastResult[0].transcript, true);
    };
  };

  onEnd = () => {
    this.recognition.onend = () => callback();
  };

  start = () => {
    this.recognition.start();
  };

  stop = () => {
    this.recognition.stop();
  };
}

export default SpeechRecognitionService;
