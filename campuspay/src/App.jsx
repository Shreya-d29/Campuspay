import React, { useState } from 'react';
import {
  Wallet, Send, Users, TrendingUp, Ticket, Plus, ArrowRight,
  LayoutDashboard, History, Settings, Bell, MessageSquare, Bot,
  ShieldCheck, Zap, PiggyBank, Search, Filter, X, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import algosdk from 'algosdk';
import { notifyDiscord, performSmartContractCall, formatAddress } from './utils/algorand';
import AIChat from './components/AIChat';
import DashboardCharts from './components/DashboardCharts';
import Auth from './components/Auth';

// Mock Data for Demo
const MOCK_TRANSACTIONS = [
  { id: 1, type: 'payment', amount: '50.00', to: 'shreya.algo', date: '2024-02-09', category: 'Food', status: 'Completed' },
  { id: 2, type: 'split', amount: '20.00', from: 'Roommates', date: '2024-02-08', category: 'Rent', status: 'Pending' },
  { id: 3, type: 'ticket', amount: '10.00', event: 'Tech Fest 2026', date: '2024-02-07', category: 'Ent.', status: 'Completed' },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [balance, setBalance] = useState(1240.50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTxId, setLastTxId] = useState('');

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    if (userData.walletLogin) {
      connectWallet();
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.classList.toggle('light-theme', newTheme === 'light');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsWalletConnected(false);
    setWalletAddress('');
    setActiveTab('dashboard');
    document.body.classList.remove('light-theme');
    setTheme('dark');
  };

  const connectWallet = async () => {
    setIsWalletConnected(true);
    const mockAddr = 'ALGO_CAMPUS_7X9Z';
    setWalletAddress(mockAddr);
    setActiveTab('dashboard');
    await notifyDiscord(`👤 **User Logged In**: Wallet \`${formatAddress(mockAddr)}\` connected to CampusPay.`);
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <Auth key="auth-screen" onLogin={handleLogin} />
        ) : (
          <div className="portal-layout" key="portal-main">
            <nav className="glass-nav">
              <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap className="accent-cyan" size={32} />
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Campus<span className="gradient-text">Pay</span></h1>
              </div>

              <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button
                  onClick={toggleTheme}
                  className="glass-card"
                  style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="search-bar glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Search size={16} className="text-secondary" />
                  <input type="text" placeholder="Search transactions..." style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <Bell size={20} className="text-secondary" style={{ cursor: 'pointer' }} />
                  <div className="profile-pill glass-card" style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-purple)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {user?.name?.charAt(0) || 'S'}
                    </div>
                    <span style={{ fontSize: '0.85rem' }}>{user?.name || 'Student'}</span>
                  </div>
                </div>
              </div>
            </nav>

            <div className="main-grid" style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

              <main className="content-area" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <AnimatePresence mode="wait">
                  {activeTab === 'dashboard' && <Dashboard key="dash" setActiveTab={setActiveTab} balance={balance} />}
                  {activeTab === 'payments' && (
                    <PaymentModule
                      key="pay"
                      walletAddress={walletAddress}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                      lastTxId={lastTxId}
                      setLastTxId={setLastTxId}
                    />
                  )}
                  {activeTab === 'splits' && <SplitModule key="split" walletAddress={walletAddress} />}
                  {activeTab === 'fundraising' && <FundraisingModule key="fund" walletAddress={walletAddress} />}
                  {activeTab === 'tickets' && <TicketingModule key="tix" walletAddress={walletAddress} />}
                </AnimatePresence>
              </main>
            </div>
          </div>
        )}
      </AnimatePresence>

      <AIChat isOpen={showAIChat} onClose={() => setShowAIChat(false)} />

      {isWalletConnected && !showAIChat && (
        <motion.div
          className="ai-assistant floating glass-card"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAIChat(true)}
          style={{
            position: 'fixed', bottom: '24px', right: '24px',
            width: '64px', height: '64px', borderRadius: '32px',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer', zIndex: 1000, border: '1px solid var(--accent-cyan)',
            background: 'var(--bg-card)',
            color: 'var(--accent-cyan)',
            boxShadow: '0 8px 32px rgba(0, 255, 213, 0.3)'
          }}
        >
          <Bot size={28} />
        </motion.div>
      )}
    </div>
  );
}

const Sidebar = ({ activeTab, setActiveTab, handleLogout }) => (
  <aside className="sidebar" style={{ width: '280px', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ padding: '0 20px 20px', fontSize: '0.75rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>MAIN MENU</div>
    {[
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { id: 'payments', label: 'Payments', icon: <Send size={20} /> },
      { id: 'splits', label: 'Expense Split', icon: <Users size={20} /> },
      { id: 'fundraising', label: 'Fundraising', icon: <TrendingUp size={20} /> },
      { id: 'tickets', label: 'Event Tickets', icon: <Ticket size={20} /> },
    ].map(item => (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px',
          borderRadius: '12px', border: 'none', cursor: 'pointer',
          background: activeTab === item.id ? 'rgba(0, 255, 213, 0.08)' : 'transparent',
          color: activeTab === item.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          textAlign: 'left', fontWeight: activeTab === item.id ? '600' : '400',
          border: activeTab === item.id ? '1px solid rgba(0, 255, 213, 0.2)' : '1px solid transparent'
        }}
        className="sidebar-item"
      >
        {item.icon}
        {item.label}
      </button>
    ))}

    <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
      <button
        onClick={handleLogout}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px',
          borderRadius: '12px', border: 'none', cursor: 'pointer',
          background: 'transparent', color: 'rgba(255, 77, 77, 0.7)',
          transition: 'all 0.2s'
        }}
      >
        <Zap size={20} style={{ opacity: 0.5 }} />
        Logout
      </button>
    </div>
  </aside>
);

const LandingPage = ({ onStart }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    style={{ textAlign: 'center', padding: '80px 5%', maxWidth: '1200px', margin: '0 auto' }}
  >
    <div className="hero-content">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '30px', marginBottom: '24px', fontSize: '0.9rem', color: 'var(--accent-cyan)', border: '1px solid rgba(0, 255, 213, 0.3)' }}
      >
        ✨ 1st Place Winner - Algorand Campus Hackathon
      </motion.div>
      <h2 style={{ fontSize: '4.5rem', marginBottom: '24px', lineHeight: '1.1', fontWeight: '800' }}>
        Finance for Students, <br /><span className="gradient-text">By Students.</span>
      </h2>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 48px', lineHeight: '1.6' }}>
        The first fully decentralized social finance platform for campus ecosystems. Split bills with roommates, raise money for clubs, and buy event tickets—all on-chain.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button className="btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem' }} onClick={onStart}>
          Connect Pera Wallet <ArrowRight size={20} />
        </button>
        <button className="btn-outline" style={{ padding: '18px 40px', fontSize: '1.1rem' }}>
          View Documentation
        </button>
      </div>
    </div>

    <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '120px' }}>
      {[
        { icon: <Send className="accent-cyan" />, title: "Fee-less Payments", desc: "Send ALGO or Campus Tokens instantly for <$0.001." },
        { icon: <Users className="accent-purple" />, title: "Smart Splitting", desc: "Group payments secured by Algorand smart contracts." },
        { icon: <PiggyBank className="accent-cyan" />, title: "Transparent Funding", desc: "No more missing cash. Every donation is on the ledger." },
        { icon: <ShieldCheck className="accent-purple" />, title: "NFT Entry", desc: "Burn-on-use NFT tickets to prevent festival fraud." }
      ].map((f, i) => (
        <div key={i} className="glass-card" style={{ padding: '40px', textAlign: 'left', transition: 'all 0.3s', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.03)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.icon}</div>
          <h3 style={{ marginBottom: '16px', fontSize: '1.4rem' }}>{f.title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.5' }}>{f.desc}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

const Dashboard = ({ setActiveTab, balance }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <header style={{ marginBottom: '40px' }}>
      <h2 className="section-title">Dashboard Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Balance</p>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }} className="gradient-text">{balance.toLocaleString()} ALGO</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '8px' }}>+12.5% from last month</p>
          <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.1 }}>
            <PiggyBank size={100} />
          </div>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Pending Splits</p>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>3</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', marginTop: '8px' }}>Total: 145.00 ALGO</p>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Active Campaigns</p>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>1</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '8px' }}>85% to goal</p>
        </div>
      </div>
    </header>

    <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><History size={20} className="accent-cyan" /> Recent Activity</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.85rem', cursor: 'pointer' }}>View All</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '12px 0' }}>Transaction</th>
              <th>Category</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TRANSACTIONS.map(tx => (
              <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.95rem' }}>
                <td style={{ padding: '16px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px' }}>
                      {tx.type === 'payment' ? <Send size={16} /> : tx.type === 'split' ? <Users size={16} /> : <Ticket size={16} />}
                    </div>
                    <div>
                      <p style={{ fontWeight: '500' }}>{tx.type === 'payment' ? tx.to : tx.type === 'split' ? tx.from : tx.event}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tx.date}</p>
                    </div>
                  </div>
                </td>
                <td><span style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)' }}>{tx.category}</span></td>
                <td><span style={{ color: tx.status === 'Completed' ? 'var(--success)' : 'orange', fontSize: '0.85rem' }}>● {tx.status}</span></td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{tx.type === 'payment' ? '-' : '+'}{tx.amount} ALGO</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={20} className="accent-purple" /> AI Security Scan</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(0, 255, 213, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0, 255, 213, 0.1)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>No suspicious contracts detected in your last 5 transactions. Your wallet is secure.</p>
          </div>
          <div style={{ background: 'rgba(157, 0, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(157, 0, 255, 0.1)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-purple)' }}>Tip: You have 2 pending splits from "Roommates". Remind them?</p>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', marginTop: '12px', width: '100%' }}>Send Auto-Reminders</button>
          </div>
        </div>
      </div>
    </div>
    <DashboardCharts />
  </motion.div>
);

// Placeholder Modules
const PaymentModule = ({ walletAddress, isProcessing, setIsProcessing, lastTxId, setLastTxId }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const suggestedRecipients = [
    { name: 'Alice (Club Lead)', address: 'ALICE...X7Y2' },
    { name: 'Bob (Roommate)', address: 'BOB...9Z1Q' },
    { name: 'Charlie (Tutor)', address: 'CHARLIE...K4M8' }
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <h2 className="section-title">Peer-to-Peer Payments</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px' }}>Send ALGO</h3>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Receiver Wallet Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="ALGO..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '14px 14px 14px 44px', borderRadius: '12px', color: '#fff', outline: 'none' }}
              />
              <Wallet size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {suggestedRecipients.map(s => (
                <button
                  key={s.address}
                  onClick={() => setRecipient(s.address)}
                  className="glass-card"
                  style={{ padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Amount to Send</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '20px', borderRadius: '12px', color: '#fff', fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', outline: 'none' }}
              />
              <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>ALGO</span>
            </div>
          </div>

          {lastTxId && (
            <div className="glass-card" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(0, 255, 213, 0.05)', border: '1px solid var(--accent-cyan)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>✅ Transaction Confirmed!</p>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>ID: {lastTxId.slice(0, 12)}...</p>
              </div>
              <a href={`https://lora.algokit.io/localnet/transaction/${lastTxId}`} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>View</a>
            </div>
          )}

          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '18px', opacity: isProcessing ? 0.7 : 1 }}
            disabled={isProcessing || !recipient || !amount}
            onClick={async () => {
              setIsProcessing(true);
              setLastTxId(''); // Reset last tx before starting
              try {
                const result = await performSmartContractCall(walletAddress, 'CAMPUS_PAY_APP_ID', 'pay_and_log', [parseFloat(amount)]);
                setLastTxId(result.txId);
                setRecipient('');
                setAmount('');
              } catch (error) {
                console.error(error);
              } finally {
                setIsProcessing(false);
              }
            }}
          >
            {isProcessing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.1)', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                Signing with Algorand...
              </div>
            ) : (
              <>Send ALGO Now</>
            )}
          </button>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={20} className="accent-purple" /> Recent P2P Transfers
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: 'p1', to: 'ALICE...X7Y2', amount: '15.00', date: 'Just now', icon: '🍲' },
              { id: 'p2', to: 'CHARLIE...K4M8', amount: '5.50', date: '2 hours ago', icon: '☕' },
              { id: 'p3', to: 'zARA...P2W1', amount: '22.00', date: 'Yesterday', icon: '📚' }
            ].map(tx => (
              <div key={tx.id} className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '1.5rem' }}>{tx.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>To {tx.to}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tx.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>-{tx.amount} ALGO</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Success</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SplitModule = ({ walletAddress }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [friends, setFriends] = useState([]);
  const [newFriend, setNewFriend] = useState('');

  const handleAddFriend = () => {
    if (newFriend && !friends.includes(newFriend)) {
      setFriends([...friends, newFriend]);
      setNewFriend('');
    }
  };

  const deploySplitContract = async () => {
    if (!title || !amount || friends.length === 0) {
      alert('Please fill in all fields and add at least one friend.');
      return;
    }
    setIsProcessing(true);
    try {
      const result = await performSmartContractCall(walletAddress, 'SPLIT_FACTORY_ID', 'create_split', [title, amount, friends]);
      alert(`Split Contract Deployed!\nTX ID: ${result.txId}`);
      // Reset form
      setTitle('');
      setAmount('');
      setFriends([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <h2 className="section-title">Expense Splitting</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px' }}>Create New Split</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Expense Title</label>
              <input
                type="text"
                placeholder="e.g. Cinema Tickets"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category (AI)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: '#fff', outline: 'none' }}
              >
                <option>Entertainment</option>
                <option>Food</option>
                <option>Bills</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Amount (ALGO)</label>
            <input
              type="number"
              placeholder="40.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: '#fff', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Add Friends' Addresses</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Wallet address..."
                value={newFriend}
                onChange={(e) => setNewFriend(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
              <button className="btn-outline" style={{ padding: '0 16px' }} onClick={handleAddFriend}><Plus size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {friends.map((f, i) => (
                <div key={i} className="glass-card" style={{ padding: '4px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '20px', background: 'rgba(0, 255, 213, 0.1)', color: 'var(--accent-cyan)' }}>
                  {formatAddress(f)}
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => setFriends(friends.filter(addr => addr !== f))} />
                </div>
              ))}
            </div>
          </div>
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', opacity: isProcessing ? 0.7 : 1 }}
            onClick={deploySplitContract}
            disabled={isProcessing}
          >
            {isProcessing ? 'Deploying Contract...' : 'Deploy Split Smart Contract'}
          </button>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Active Splitting</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: '500' }}>Room Rent</span>
                <span className="accent-cyan">2/4 Paid</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '50%', height: '100%', background: 'var(--accent-cyan)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FundraisingModule = ({ walletAddress }) => {
  const [campaigns, setCampaigns] = useState([
    { id: 1, title: "Campus Tech Fest 2026", target: 15000, raised: 12450, donors: 142, status: 'Active' },
    { id: 2, title: "IEEE Student Chapter", target: 5000, raised: 1200, donors: 38, status: 'Active' },
    { id: 3, title: "Relief Fund: Shelter", target: 8000, raised: 8000, donors: 215, status: 'Completed' },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ title: '', target: '' });

  const handleDonate = async (campaignId, amount) => {
    setIsProcessing(true);
    try {
      const result = await performSmartContractCall(walletAddress, `CAMPAIGN_${campaignId}`, 'donate', [amount]);
      setCampaigns(campaigns.map(c =>
        c.id === campaignId ? { ...c, raised: c.raised + amount, donors: c.donors + 1 } : c
      ));
      alert(`Donation Successful!\nTX ID: ${result.txId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    const id = campaigns.length + 1;
    setCampaigns([...campaigns, {
      id,
      title: newCampaign.title,
      target: parseInt(newCampaign.target),
      raised: 0,
      donors: 0,
      status: 'Active'
    }]);
    setShowModal(false);
    setNewCampaign({ title: '', target: '' });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h2 className="section-title">Fundraising</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={18} /> Start Campaign</button>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content glass-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3>Launch New Campaign</h3>
                <X style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleCreateCampaign}>
                <div className="form-group">
                  <label>Campaign Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Annual Music Fest"
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Target Amount (ALGO)</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={newCampaign.target}
                    onChange={(e) => setNewCampaign({ ...newCampaign, target: e.target.value })}
                    required
                  />
                </div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Deploy Smart Contract
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {campaigns.map((c) => {
          const progress = Math.min(100, Math.floor((c.raised / c.target) * 100));
          return (
            <div key={c.id} className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.3rem' }}>{c.title}</h3>
                {progress === 100 && <ShieldCheck size={20} className="success" />}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <p>{c.donors} students contributed</p>
                <p>Goal: {c.target} ALGO</p>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Raised: {c.raised} ALGO</span>
                  <span className="accent-cyan">{progress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                    style={{ height: '100%', background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-purple))' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1, fontSize: '0.85rem', padding: '10px' }}
                  onClick={() => handleDonate(c.id, 10)}
                  disabled={isProcessing || progress === 100}
                >
                  {isProcessing ? 'Processing' : 'Donate 10 ALGO'}
                </button>
                <button className="btn-outline" style={{ border: '1px solid var(--glass-border)', color: '#fff', fontSize: '0.85rem' }}>Details</button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const TicketingModule = ({ walletAddress }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [tickets, setTickets] = useState([
    { id: 1, title: "Zumba Campus Night", date: "Feb 20", price: "Free", priceVal: 0, color: "var(--accent-cyan)", sold: false },
    { id: 2, title: "Hackathon Finals", date: "Feb 24", price: "2 ALGO", priceVal: 2, color: "var(--accent-purple)", sold: false },
    { id: 3, title: "Farewell Party 2026", date: "Mar 05", price: "25 ALGO", priceVal: 25, color: "#ff0088", sold: false },
  ]);

  const handleBuyTicket = async (ticketId, price) => {
    setIsProcessing(true);
    try {
      const result = await performSmartContractCall(walletAddress, `TICKET_APP_${ticketId}`, 'buy_ticket', [price]);
      setTickets(tickets.map(t =>
        t.id === ticketId ? { ...t, sold: true } : t
      ));
      alert(`Ticket Purchased Successfully!\nYour NFT ticket has been minted.\nTX ID: ${result.txId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredTickets = activeTab === 'upcoming'
    ? tickets.filter(t => !t.sold)
    : tickets.filter(t => t.sold);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h2 className="section-title">Event Tickets</h2>
        <div className="glass-card" style={{ padding: '4px', display: 'flex', gap: '4px' }}>
          <button
            style={{
              padding: '8px 16px', borderRadius: '6px', border: 'none',
              background: activeTab === 'upcoming' ? 'rgba(0, 255, 213, 0.1)' : 'transparent',
              color: activeTab === 'upcoming' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.85rem'
            }}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            style={{
              padding: '8px 16px', borderRadius: '6px', border: 'none',
              background: activeTab === 'mine' ? 'rgba(0, 255, 213, 0.1)' : 'transparent',
              color: activeTab === 'mine' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.85rem'
            }}
            onClick={() => setActiveTab('mine')}
          >
            My Tickets
          </button>
        </div>
      </div>
      <div className="dashboard-grid">
        {filteredTickets.map((t) => (
          <div key={t.id} className="glass-card ticket-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', opacity: t.sold && activeTab === 'upcoming' ? 0.7 : 1 }}>
            <div style={{ height: '120px', background: `linear-gradient(135deg, ${t.color}, #000)`, padding: '24px', position: 'relative' }}>
              <Ticket size={48} style={{ opacity: 0.2, position: 'absolute', right: '10px', bottom: '10px' }} />
              <div style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', display: 'inline-block', marginBottom: '10px' }}>NFT TICKET</div>
              <h3 style={{ fontSize: '1.4rem' }}>{t.title}</h3>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Zap size={14} /> <span>Algorand Standard Asset (ASA)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Price</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{t.price}</p>
                </div>
                {!t.sold && (
                  <button
                    className="btn-primary"
                    style={{ padding: '10px 20px' }}
                    onClick={() => handleBuyTicket(t.id, t.priceVal)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Secure Ticket'}
                  </button>
                )}
                {t.sold && activeTab === 'mine' && (
                  <div style={{ color: 'var(--success)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={18} /> Owned
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredTickets.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>
            <History size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>No tickets found in this category.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default App;
