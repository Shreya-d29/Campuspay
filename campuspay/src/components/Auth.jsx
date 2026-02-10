import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, GraduationCap, ArrowRight, Wallet, Zap, Fingerprint } from 'lucide-react';

const Auth = ({ onLogin }) => {
    const [method, setMethod] = useState('student'); // 'student' or 'wallet'
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsAuthenticating(true);

        // Simulate auth lag
        await new Promise(resolve => setTimeout(resolve, 2000));

        onLogin({
            id: studentId || 'STU_2026_99',
            name: 'Shreya Deshmukh',
            role: 'Student Representative'
        });
        setIsAuthenticating(false);
    };

    return (
        <div className="auth-overlay">
            <div className="auth-background">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-container glass-card"
            >
                <div className="auth-header">
                    <div className="logo-section">
                        <Zap className="accent-cyan" size={40} />
                        <h2>Campus<span>Pay</span></h2>
                    </div>
                    <p className="text-secondary">Official Student Financial Portal</p>
                </div>

                <div className="auth-tabs">
                    <button
                        className={method === 'student' ? 'active' : ''}
                        onClick={() => setMethod('student')}
                    >
                        <GraduationCap size={18} /> Student ID
                    </button>
                    <button
                        className={method === 'wallet' ? 'active' : ''}
                        onClick={() => setMethod('wallet')}
                    >
                        <Wallet size={18} /> Web3 Wallet
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {method === 'student' ? (
                        <motion.form
                            key="student-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleLogin}
                            className="auth-form"
                        >
                            <div className="form-group">
                                <label>University ID Number</label>
                                <div className="input-wrapper">
                                    <Fingerprint size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g. 202688421"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Portal Password</label>
                                <div className="input-wrapper">
                                    <Lock size={18} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button className="btn-primary auth-submit" disabled={isAuthenticating}>
                                {isAuthenticating ? (
                                    <span className="flex-center">Verifying credentials...</span>
                                ) : (
                                    <>Enter Portal <ArrowRight size={18} /></>
                                )}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="wallet-info"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="wallet-auth-view"
                        >
                            <div className="wallet-card">
                                <Shield className="accent-cyan" size={48} />
                                <h3>Decentralized Identity</h3>
                                <p className="text-secondary">Link your Algorand wallet to access secure governance and peer splitting features.</p>
                            </div>
                            <button className="btn-outline auth-submit" onClick={() => onLogin({ walletLogin: true })}>
                                <Wallet size={18} /> Connect Pera Wallet
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="auth-footer">
                    <p>By entering, you agree to the <a href="#">Terms of Governance</a></p>
                    <div className="security-badge">
                        <Lock size={12} /> Encrypted by Algorand Blockchain
                    </div>
                </div>
            </motion.div>

            <style>{`
        .auth-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050505;
          z-index: 9999;
          overflow: hidden;
        }

        .auth-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .blob {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: float 20s infinite alternate;
        }

        .blob-1 { background: var(--accent-cyan); top: -10%; left: -10%; }
        .blob-2 { background: var(--accent-purple); bottom: -10%; right: -10%; animation-delay: -5s; }

        @keyframes float {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(50px, 50px) scale(1.1); }
        }

        .auth-container {
          width: 100%;
          max-width: 440px;
          padding: 40px;
          position: relative;
          z-index: 10;
          background: rgba(15, 15, 15, 0.8) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .logo-section h2 {
          font-size: 2rem;
          font-weight: 800;
          margin: 0;
        }

        .logo-section span { color: var(--accent-cyan); }

        .auth-tabs {
          display: flex;
          background: rgba(255, 255, 255, 0.03);
          padding: 4px;
          border-radius: 12px;
          margin-bottom: 32px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .auth-tabs button {
          flex: 1;
          padding: 12px;
          border: none;
          background: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .auth-tabs button.active {
          background: rgba(255, 255, 255, 0.05);
          color: var(--accent-cyan);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper svg {
          position: absolute;
          left: 14px;
          color: rgba(255, 255, 255, 0.3);
        }

        .input-wrapper input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 14px 14px 14px 44px;
          border-radius: 10px;
          color: #fff;
          outline: none;
          transition: all 0.3s;
        }

        .input-wrapper input:focus {
          border-color: var(--accent-cyan);
          background: rgba(0, 255, 213, 0.02);
        }

        .auth-submit {
          width: 100%;
          justify-content: center;
          padding: 16px;
          margin-top: 10px;
        }

        .wallet-auth-view {
          text-align: center;
        }

        .wallet-card {
          padding: 30px 20px;
          margin-bottom: 24px;
        }

        .wallet-card h3 { margin: 16px 0 8px; }

        .auth-footer {
          margin-top: 40px;
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .auth-footer a { color: var(--accent-cyan); text-decoration: none; }

        .security-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 16px;
          padding: 6px 12px;
          background: rgba(0, 255, 213, 0.05);
          border-radius: 20px;
          color: var(--accent-cyan);
        }

        .flex-center { display: flex; align-items: center; gap: 10px; }
      `}</style>
        </div>
    );
};

export default Auth;
