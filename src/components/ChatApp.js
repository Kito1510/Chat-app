import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { Send, LogOut } from 'lucide-react';
import AuthForm from './AuthForm';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatApp = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        const q = query(collection(db, 'messages'), orderBy('timestamp'));
        const unsubMessages = onSnapshot(q, (snapshot) => {
          const messageData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMessages(messageData);
        });
        return () => unsubMessages();
      }
    });
    return () => unsubAuth();
  }, []);

  const handleLogin = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleRegister = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSendMessage = async (text) => {
    if (text.trim() && user) {
      await addDoc(collection(db, 'messages'), {
        text,
        userId: user.uid,
        email: user.email,
        timestamp: serverTimestamp()
      });
    }
  };

  if (!user) {
    return (
      <div>
        <AuthForm 
          onSubmit={isLogin ? handleLogin : handleRegister}
          isLogin={isLogin}
        />
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="fixed bottom-4 right-4 text-blue-500 underline"
        >
          {isLogin ? '新規登録へ' : 'ログインへ'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 rounded-t-lg shadow flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">チャットルーム</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.email}</span>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <MessageList messages={messages} currentUser={user} />

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatApp;
