import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { Send, ArrowLeft, MoreVertical, Circle, Users } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

function Chat() {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState();
  const user = useSelector((store) => store.user);
  const userId = user._id;
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = createSocketConnection();
    try {
      if (!userId) return;
      socket.emit("joinChat", {
        firstName: user.firstName,
        userId,
        targetUserId,
      });

      socket.on("messageReceived", ({ firstName, lastName, text }) => {
        setMessages((messages) => [...messages, { firstName, lastName, text }]);
      });
    } catch (err) {
      console.log(err);
    }

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const fetchReceiverData = async () => {
    const receiver = await axios.get(BASE_URL + "/user/" + targetUserId, {
      withCredentials: true,
    });
    setReceiver(receiver.data);
  };

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    const chatMessages = chat?.data.messages.map((msg) => {
      return {
        firstName: msg?.senderId.firstName,
        lastName: msg?.senderId.lastName,
        text: msg?.text,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
    fetchReceiverData();
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Chat Header */}
        <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/connections"
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center">
                    <img
                      src={receiver?.photoUrl}
                      alt={receiver?.firstName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-white font-semibold text-lg">
                    {receiver?.firstName + " " + receiver?.lastName}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Start the conversation!
              </h3>
              <p className="text-gray-400">
                Send a message to connect with other developers
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const isCurrentUser = user.firstName === message.firstName;
                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isCurrentUser && (
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">
                          {receiver?.firstName[0]}
                        </span>
                      </div>
                    )}

                    <div
                      className={`max-w-xs lg:max-w-md ${
                        isCurrentUser ? "order-1" : "order-2"
                      }`}
                    >
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          isCurrentUser
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                            : "bg-white/10 backdrop-blur-lg border border-white/20 text-white"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.text}
                        </p>
                      </div>
                    </div>

                    {isCurrentUser && (
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 order-2">
                        <span className="text-white font-medium text-sm">
                          {user?.firstName[0]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white/5 backdrop-blur-lg border-t border-white/10 p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows="1"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-lg transition-all ${
                newMessage.trim()
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                  : "bg-white/10 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
