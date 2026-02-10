---
description: How to run the CampusPay project (Frontend and Smart Contracts)
---

# How to Run CampusPay

Follow these steps to get the project up and running on your local machine.

## 1. Prerequisites
- **Node.js**: Ensure you have Node.js installed.
- **Python 3.12+**: Already installed and configured in `.ptenv`.
- **Docker Desktop**: Currently being installed. This is required for the LocalNet.

## 2. Running the Frontend
The frontend is a React/Vite application.

1.  Open a new terminal.
2.  Navigate to the `campuspay` directory:
    ```powershell
    cd "e:\copy of d drive\Hackspirit\campuspay"
    ```
3.  Install dependencies (if not already done):
    ```powershell
    npm install
    ```
4.  Start the development server:
// turbo
    ```powershell
    npm run dev
    ```
5.  Open your browser to the URL shown in the terminal (usually `http://localhost:5173`).

## 3. Running the Smart Contracts (LocalNet)
Once Docker is installed and running:

1.  Open a new terminal.
2.  Navigate to the project root:
    ```powershell
    cd "e:\copy of d drive\Hackspirit"
    ```
3.  Start the Algorand LocalNet:
// turbo
    ```powershell
    algokit localnet start
    ```
4.  Deploy the contracts (instructions will be provided once LocalNet is up).

## 4. Current State (Simulation Mode)
While Docker is installing, the project is running in **Simulation Mode**. 
- Transactions will be logged to Discord.
- UI will show "Processing" states for 2 seconds to mimic blockchain confirmation.
- The Discord ID `shreyadeshmukh_11454` is integrated into all alerts.
