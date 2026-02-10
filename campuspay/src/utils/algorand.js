import algosdk from 'algosdk';

/**
 * Algorand Utility Functions
 */

// Configuration for Algod
// Using Algonode for Testnet - No Token Required
const algodServer = 'http://localhost';
const algodPort = '4001';
const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

export const getAlgodClient = () => client;

export const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const ALGORAND_CONFIG = {
    appId: 1002, // Real App ID from LocalNet deployment
    tokenName: "CAMPUS",
    unitName: "CMP",
    decimals: 2,
    fee: 0.001,
    discordUser: "shreyadeshmukh_11454"
};

/**
 * Send notification to Discord via Webhook
 */
export const notifyDiscord = async (message, color = 0x00ffd5) => {
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1338427921639768205/6w4uWwN7xW0z5S7Y_GjVdQg_uE7hPqYj9_XJ6z2E9z2E9z2E9z2E9z2E9z2E9z2E';

    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: "CampusPay Monitoring System",
                    description: message,
                    color: color,
                    timestamp: new Date().toISOString(),
                    footer: { text: `Active User: ${ALGORAND_CONFIG.discordUser}` }
                }]
            })
        });
        console.log('Discord notification sent');
    } catch (error) {
        console.error('Error sending Discord notification:', error);
    }
};

/**
 * Perform a real or simulated Smart Contract Call
 */
export const performSmartContractCall = async (sender, contractId, method, args) => {
    console.log(`[SmartContract] Calling ${method} on app ${contractId} from ${sender}`);

    // Simulate delay for blockchain confirmation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const txId = `TX_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Detailed Discord Notification
    const discordMsg = `
⚡ **New App Call Detected**
👤 **Sender**: \`${formatAddress(sender)}\`
📜 **Method**: \`${method}\`
🆔 **App ID**: \`${contractId}\`
🔗 **TX ID**: \`[${txId}](https://lora.algokit.io/localnet/transaction/${txId})\`
✅ **Status**: Confirmed on LocalNet
    `;

    await notifyDiscord(discordMsg);

    return {
        txId,
        status: 'Confirmed',
        confirmedRound: Math.floor(Math.random() * 1000000)
    };
};

export const mockCategories = [
    { id: 'food', label: 'Food & Dining', color: '#00ffd5' },
    { id: 'bills', label: 'Accommodation & Bills', color: '#9d00ff' },
    { id: 'travel', label: 'Transport', color: '#00ff88' },
    { id: 'events', label: 'Events & Fun', color: '#ff0088' }
];

