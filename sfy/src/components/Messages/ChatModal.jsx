import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { fetchMessages, sendMessage, markMessagesAsRead } from '../../lib/messages';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const ChatModal = ({ isOpen, onClose, receiverId, itemId, itemName }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    let mounted = true;
    let pollInterval;

    const loadMessages = async () => {
      if (!isOpen || !receiverId || !itemId) return;

      try {
        setLoading(true);
        const fetchedMessages = await fetchMessages(receiverId, itemId);
        if (mounted) {
          setMessages(fetchedMessages);
          await markMessagesAsRead(receiverId);
          scrollToBottom();
        }
      } catch (error) {
        if (mounted) {
          toast.error('Failed to load messages');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadMessages();

    // Poll for new messages every 5 seconds
    if (isOpen) {
      pollInterval = setInterval(loadMessages, 5000);
    }

    return () => {
      mounted = false;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [isOpen, receiverId, itemId]);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    try {
      const newMessage = await sendMessage(receiverId, itemId, content);
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-lg h-[600px] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{itemName}</h3>
            <p className="text-sm text-gray-400">Chat about this item</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Loading messages...</p>
            </div>
          ) : (
            <>
              <MessageList messages={messages} currentUserId={user?.id} />
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={loading || !user}
        />
      </div>
    </div>
  );
};

export default ChatModal;