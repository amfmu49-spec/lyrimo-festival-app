import { useState, useEffect, useRef } from 'react';
import { Play, ChevronRight, Disc, MessageSquare, Image as ImageIcon, Camera } from 'lucide-react';
import './App.css';

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // 掲示板のステート（バックエンドから取得）
  const [messages, setMessages] = useState([]);
  
  // バックエンドからのデータ取得
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    // 5秒ごとにポーリングして最新を取得
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);



  useEffect(() => {
    const eventDate = new Date('2026-10-24T00:00:00+09:00');
    const timer = setInterval(() => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 制限: 約2MB
      if (file.size > 2 * 1024 * 1024) {
        alert("画像サイズは2MB以下にしてください。");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newName.trim() || (!newMessage.trim() && !fileInputRef.current?.files[0])) return;
    
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("text", newMessage);
    
    const date = new Date();
    const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    formData.append("date", dateStr);

    if (fileInputRef.current && fileInputRef.current.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        fetchMessages(); // 投稿後に最新を再取得
        setNewName("");
        setNewMessage("");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("投稿に失敗しました。サーバーとの通信を確認してください。");
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo glitch-effect" data-text="A.M.F Presents" style={{fontSize: "20px"}}>A.M.F Presents</div>
        <nav className="nav-links">
          <a href="#about" className="nav-link">About</a>
          <a href="#board" className="nav-link">Message Board</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-shapes">
          <div className="shape-1"></div>
          <div className="shape-2"></div>
        </div>
        
        <div className="event-date" style={{marginBottom: "10px"}}>2026.10.24(土)</div>
        <div style={{fontSize: "24px", fontWeight: "bold", color: "var(--tk-text)", marginBottom: "10px"}}>A.M.F Presents</div>
        <h1 className="hero-title glitch-effect" data-text="リリモフェス" style={{fontSize: "4rem", marginBottom: "0"}}>リリモフェス</h1>
        <h2 className="hero-subtitle" style={{fontSize: "2rem", color: "var(--tk-cyan)", marginTop: "10px", marginBottom: "40px"}}>-Lyrimo Festival-</h2>

        <div className="countdown">
          <div className="cd-box">
            <div className="cd-value">{timeLeft.days}</div>
            <div className="cd-label">Days</div>
          </div>
          <div className="cd-box">
            <div className="cd-value">{timeLeft.hours.toString().padStart(2, '0')}</div>
            <div className="cd-label">Hours</div>
          </div>
          <div className="cd-box">
            <div className="cd-value">{timeLeft.minutes.toString().padStart(2, '0')}</div>
            <div className="cd-label">Minutes</div>
          </div>
          <div className="cd-box">
            <div className="cd-value">{timeLeft.seconds.toString().padStart(2, '0')}</div>
            <div className="cd-label">Seconds</div>
          </div>
        </div>

        <div className="hero-cta">
          <a href="#about" className="btn-secondary">
            イベント詳細を見る <ChevronRight className="inline-block ml-1" size={20} />
          </a>
        </div>
      </section>

      {/* About & Instructions Section */}
      <section id="about" className="section">
        <h2 className="section-title"><ImageIcon className="inline-block mr-4 text-cyan-500" size={40}/> ABOUT Lyrimo</h2>
        <div className="details-grid">
          <img src="/media_1790860433463.jpg" alt="Lyrimo Festival Poster" className="poster-img" />
          
          <h3 style={{fontSize: '2rem', marginTop: '40px', marginBottom: '20px', color: 'var(--tk-pink)'}}>Lyrimoの使い方</h3>
          <div className="instructions-grid">
            <img src="/media_1790860433401.png" alt="使い方: iPhone編" className="instruction-img" />
            <img src="/media_1790860433512.jpg" alt="使い方: Android編" className="instruction-img" />
            <img src="/media_1790860433250.jpg" alt="使い方: TikTok編(動画で作成する場合)" className="instruction-img" />
          </div>
        </div>
      </section>

      {/* Message Board Section */}
      <section id="board" className="section">
        <h2 className="section-title"><MessageSquare className="inline-block mr-4 text-cyan-500" size={40}/> MESSAGE BOARD</h2>
        <div className="board-container">
          <div className="board-form-container">
            <form onSubmit={handleSendMessage} className="board-form">
              <input 
                type="text" 
                placeholder="ニックネーム" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                className="board-input"
                maxLength={20}
                required
              />
              <textarea 
                placeholder="イベントへの期待や応援メッセージを書き込もう！" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                className="board-textarea"
                rows={3}
                maxLength={200}
              />
              
              <div className="board-image-upload">
                <label className="image-upload-label">
                  <Camera size={20} /> 画像を添付する
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    style={{display: 'none'}}
                  />
                </label>
                {imagePreview && (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <button type="button" onClick={removeImage} className="image-remove-btn">✖</button>
                  </div>
                )}
              </div>

              <button type="submit" className="board-submit-btn">投稿する</button>
            </form>
          </div>
          
          <div className="board-messages">
            {messages.length === 0 ? (
              <p style={{textAlign: 'center', color: 'var(--tk-text-muted)'}}>まだメッセージはありません。一番乗りで投稿しよう！</p>
            ) : (
              messages.map((msg, idx) => (
                <div className="message-item" key={idx}>
                  <div className="message-header">
                    <span className="message-name">{msg.name}</span>
                    <span className="message-date">{msg.date}</span>
                  </div>
                  {msg.text && <div className="message-body">{msg.text}</div>}
                  {msg.image && (
                    <div className="message-image-container">
                      <img src={msg.image} alt="添付画像" className="message-image" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="social-links">
          <a href="#" className="social-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
          </a>
          <a href="#" className="social-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" className="social-icon">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.31-1.9 1.53-4.32 2.1-6.72 1.63-2.42-.48-4.48-1.93-5.63-4.04-1.13-2.1-1.28-4.6-.47-6.85.83-2.28 2.62-4.14 4.88-4.94 1.48-.52 3.1-.64 4.63-.35.01 1.34.02 2.68.02 4.02-.92-.25-1.91-.25-2.82.02-.91.27-1.68.85-2.19 1.63-.5.78-.65 1.75-.43 2.65.22.9.83 1.65 1.62 2.06.8.4 1.75.46 2.63.18.89-.27 1.61-.92 2.02-1.74.37-.73.53-1.57.54-2.4.03-4.8.02-9.61.02-14.41h1.16z" />
             </svg>
          </a>
        </div>
        <div className="copyright">
          © 2026 リリモフェス. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
