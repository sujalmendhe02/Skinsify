import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const MessageList = ({ messages, currentUserId }) => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`flex ${
            message.sender._id === currentUserId ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.sender._id === currentUserId
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-700 text-white'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <p className="text-xs text-gray-300 mt-1">
              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;