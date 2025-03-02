// components/Chat.js
import { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, ListGroup } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const Chat = ({ tripId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}/chat/`);
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up polling for new messages
    const intervalId = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(intervalId);
  }, [tripId]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      const response = await api.post(`/api/trips/${tripId}/chat/`, {
        message: newMessage
      });
      
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  return (
    <Card className="shadow-sm h-100">
      <Card.Header>
        <h5 className="mb-0">Group Chat</h5>
      </Card.Header>
      
      <div className="chat-messages p-3" style={{ height: '400px', overflowY: 'auto' }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p>No messages yet. Be the first to say hello!</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {messages.map((msg) => (
              <ListGroup.Item
                key={msg.id}
                className={`border-0 ${msg.user.id === user.id ? 'text-end' : ''}`}
              >
                <div
                  className={`d-inline-block p-2 rounded ${
                    msg.user.id === user.id
                      ? 'bg-primary text-white'
                      : 'bg-light'
                  }`}
                  style={{ maxWidth: '80%' }}
                >
                  {msg.message}
                </div>
                <div className="mt-1 small text-muted">
                  {msg.user.name || msg.user.username} • {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </ListGroup.Item>
            ))}
            <div ref={messagesEndRef} />
          </ListGroup>
        )}
      </div>
      
      <Card.Footer className="p-2">
        <Form onSubmit={handleSubmit}>
          <div className="d-flex">
            <Form.Control
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="me-2"
            />
            <Button type="submit" variant="primary">
              Send
            </Button>
          </div>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default Chat;