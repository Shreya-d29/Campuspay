# 🎓 CampusPay – Decentralized Campus Finance Platform

**A blockchain-based financial ecosystem for students built on Algorand**

CampusPay is a decentralized Web3 platform designed for university campuses, enabling transparent payments, smart expense splitting, verified fundraising, and NFT-based event ticketing.  
Built on the **Algorand blockchain**, CampusPay removes intermediaries, reduces fees, and enforces trust through **smart contracts instead of institutions**.

---

## 📌 Table of Contents

- Overview  
- Why CampusPay  
- Key Features  
- System Architecture  
- Technology Stack  
- Prerequisites  
- Quick Start  
- Project Folder Structure
- Environment Configuration  
- Smart Contract Overview  
- User Journeys  
- Security Model  
- Hackathon Demo Plan  
- Project Differentiators  
- Roadmap  
- License  

---

## 🌟 Overview

Campus financial interactions today rely on centralized apps, manual settlements, and opaque systems.  
CampusPay reimagines this experience using **Algorand’s fast, low-cost blockchain**, delivering a **trustless yet user-friendly campus finance layer**.

**Core Idea:**  
> If students can scan a QR code and pay instantly, why shouldn’t that transaction be **transparent, verifiable, and fee-free**?

---

## 🤔 Why CampusPay?

### ❌ Problems in Campus Ecosystems
- Hidden transaction fees  
- Manual expense settlement  
- Fake or duplicate event tickets  
- Untrusted fundraising campaigns  
- No visibility into spending behavior  

### ✅ CampusPay Solutions
- On-chain payments with near-zero fees  
- Smart contracts for automatic settlements  
- NFT-based ticket verification  
- Escrow-based fundraising  
- AI-powered expense insights  

---

## ✨ Key Features

### 👛 Peer-to-Peer Payments
- Instant ALGO transfers between students  
- Wallet-to-wallet (non-custodial)  
- Cryptographic address validation  

### 🤝 Smart Expense Splitting
- Create groups and split expenses fairly  
- Smart contract enforces equal contributions  
- Auto-settlement when all members pay  
- QR-based sharing for frictionless UX  

### 🎯 Club & Event Fundraising
- Goal-locked escrow smart contracts  
- Transparent contribution tracking  
- Automatic refunds if goals are unmet  

### 🎫 NFT-Based Event Ticketing
- Tickets minted as **Algorand Standard Assets (ASA)**  
- One wallet = one ticket (fraud prevention)  
- On-chain ownership verification at entry  

### 🤖 AI-Powered Insights (Value Addition)
- Expense categorization (Food, Travel, Rent)  
- Monthly spending summaries  
- Smart reminders for pending group payments  

---

## 🏗️ System Architecture

┌─────────────────────────────────────────────────────────────┐
│                  Frontend (React + Vite)                    │
│  Dashboard | Payments | Split | Fundraise | Tickets         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼────────┐     ┌───────▼────────┐
        │ Wallet Connect │     │ AI Assistant   │
        │ (Pera Wallet)  │     │ (Insights)     │
        └───────┬────────┘     └────────────────┘
                │
        ┌───────▼────────────────────────────────┐
        │         Algorand Blockchain Layer       │
        │  Payments | Expense | Escrow | Tickets  │
        │  Smart Contracts (PyTeal / AlgoKit)     │
        └────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼────────┐     ┌───────▼────────┐
        │ Algorand Index │     │ Backend API    │
        │ (Tx History)   │     │ (Node.js)      │
        └────────────────┘     └────────────────┘

---

## 🛠️ Technology Stack

### Frontend
- React 18 + Vite  
- TailwindCSS / Glassmorphism UI  
- Pera Wallet SDK  
- QR Codes  
- Recharts (Analytics)

### Blockchain
- Algorand TestNet → MainNet  
- Algorand JavaScript SDK  
- Algorand Standard Assets (ASA)  
- Smart Contracts: PyTeal (AlgoKit)

### Backend & AI
- Node.js + Express  
- MongoDB (metadata & profiles)  
- Algorand Indexer  
- OpenAI (expense categorization & insights)

---

## 📦 Prerequisites
- Node.js v18+  
- Python 3.10+  
- AlgoKit installed  
- Pera Wallet (TestNet funded)  
- Docker (recommended)  

---

## 🚀 Quick Start

```bash
git clone https://github.com/Shreya-d29/Campuspay.git
cd campuspay

algokit project bootstrap all
algokit project run build

cd projects/frontend
npm install
npm run dev

## 📁 Project Folder Structure

```text
CampusPay-main/
│
├── .agent/
│   └── workflows/
│       └── run-project.md
│
├── algo_workspace/
│   └── smart_contracts/
│       └── contract.py
│
├── campuspay/                 # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── README.md
│
├── puyap_project/             # PyTeal / Puya entry
│   └── main.py
│
├── smart_contracts/
│   └── campuspay/
│       ├── CampusPay.approval.teal
│       ├── CampusPay.clear.teal
│       ├── CampusPay.arc56.json
│       ├── CampusPay.approval.puya.map
│       ├── CampusPay.clear.puya.map
│       ├── contract.py        # PyTeal smart contract logic
│       └── deploy.py          # Deployment script
│
├── compile_out_u8.txt
├── compile_out.txt
├── deploy_err.txt
├── deploy_err2.txt
│
├── .gitignore
└── README.md


---

## 🧩 Folder Description

- **campuspay/**  
  Frontend Web3 application built using **React + Vite**, integrated with **Pera Wallet**.

- **smart_contracts/campuspay/**  
  Core Algorand smart contracts written in **PyTeal**, including compiled TEAL files and ARC-56 ABI.

- **deploy.py**  
  Handles smart contract deployment to Algorand TestNet/MainNet.

- **algo_workspace/**  
  AlgoKit workspace used during development and testing.

- **puyap_project/**  
  Puya-compatible project entry for smart contract compilation.

- **compile_out / deploy_err logs**  
  Compilation and deployment logs for debugging.

---

## 📌 Notes
- Frontend and smart contracts are **cleanly separated**
- Supports **AlgoKit + PyTeal workflow**
- Ready for **hackathon demos and production extension**

## ⚙️ Environment Configuration (Frontend)

Create the following file:

**`projects/frontend/.env`**

```env
VITE_ALGOD_SERVER=https://testnet-api.algonode.cloud
VITE_ALGOD_PORT=
VITE_ALGOD_TOKEN=
VITE_ALGOD_NETWORK=testnet

VITE_INDEXER_SERVER=https://testnet-idx.algonode.cloud
VITE_INDEXER_PORT=
VITE_INDEXER_TOKEN=

VITE_PINATA_JWT=YOUR_PINATA_JWT
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs

## ⛓️ Smart Contract Overview

### 1️⃣ Expense Split Contract
- Stores group members and total amount  
- Calculates per-person share  
- Releases funds only after all members pay  

### 2️⃣ Fundraising Escrow Contract
- Locks funds until goal is reached  
- Allows withdrawal only to campaign owner  
- Auto-refunds contributors if deadline passes  

### 3️⃣ Event Ticket ASA
- Non-divisible NFTs (decimals = 0)  
- Wallet-based ownership verification  
- Prevents duplicate or fake tickets  

---

## 🧭 User Journeys

### Split a Group Expense
1. Create expense group  
2. Deploy smart contract  
3. Share QR with members  
4. Auto-settlement on completion  

### Fundraise for Campus Event
1. Launch campaign with goal & deadline  
2. Students contribute transparently  
3. Smart contract releases or refunds funds  

### Buy & Verify Event Ticket
1. Purchase NFT ticket  
2. Ticket stored in wallet  
3. On-chain verification at entry  

---

## 🔐 Security Model
- Non-custodial wallets (users own keys)  
- Open-source smart contracts  
- Immutable on-chain records  
- No admin control over user funds  
- Optional multi-sig for large campaigns