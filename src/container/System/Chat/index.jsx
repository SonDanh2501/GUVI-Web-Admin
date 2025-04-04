import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./styles.scss";
import axiosClient from "../../../axios";
import { getRoomApi } from "../../../api/auth";

const BaseUrl = process.env.REACT_APP_BASE_URL;
const TestUrl = process.env.REACT_APP_TEST_URL;

const Chat = () => {
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState("");
  const [id, setId] = useState();
  const host = `http://localhost:5001`;

  const socketRef = useRef();
  const messagesEnd = useRef();

  useEffect(() => {
    // socketRef.current = socketIOClient.connect(host);
    var socket = io(TestUrl);
    socket.on("msgToClient", (socket) => {
      // console.log("jjjj", socket.id);
    });

    // socketRef.current.on("getId", (data) => {
    //   setId(data);
    // });

    // socketRef.current.on("sendDataServer", (dataGot) => {
    //   setMess((oldMsgs) => [...oldMsgs, dataGot.data]);
    //   scrollToBottom();
    // });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    getRoomApi()
      .then((res) => {})
      .catch((err) => {});
  }, []);

  const sendMessage = () => {
    if (message !== null) {
      const msg = {
        content: message,
        id: id,
      };
      socketRef.current.emit("sendDataClient", msg);
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  const renderMess = mess.map((m, index) => (
    <div
      key={index}
      className={`${m.id === id ? "your-message" : "other-people"} chat-item`}
    >
      {m.content}
    </div>
  ));

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      sendMessage();
    }
  };

  return (
    <div class="box-chat">
      <div class="box-chat_message">
        {renderMess}
        <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
      </div>

      <div class="send-box">
        <textarea
          value={message}
          onKeyDown={onEnterPress}
          onChange={handleChange}
          placeholder="Nhập tin nhắn ..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
