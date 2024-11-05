import React from 'react';

const MessageList = ({ messages, currentUser }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.userId === currentUser.uid ? 'justify-end' : 'justify-start'}`}
        >
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">
              {message.email}
            </span>
            <div
              className={`max-w-sm p-3 rounded-lg ${
                message.userId === currentUser.uid
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
