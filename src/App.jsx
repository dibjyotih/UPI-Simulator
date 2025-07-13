import React, { useState } from "react";
import QRCode from "react-qr-code";
import dayjs from "dayjs";
import "./styles.css";

function App() {
  const [amount, setAmount] = useState("");
  const [upiLink, setUpiLink] = useState("");
  const [transactions, setTransactions] = useState([]);

  const handleGenerate = () => {
    const upiId = "test@upi";
    const name = "Test Merchant";
    const txnRef = `TXN${Date.now()}`;
    const url = `upi://pay?pa=${upiId}&pn=${name}&mc=0000&tid=${txnRef}&tr=${txnRef}&tn=TestPayment&am=${amount}&cu=INR`;
    setUpiLink(url);
  };

  const handleMarkPaid = () => {
    const txn = {
      id: transactions.length + 1,
      amount,
      status: "Success",
      time: dayjs().format("HH:mm:ss - DD MMM YYYY"),
      link: upiLink,
    };
    setTransactions([txn, ...transactions]);
    setAmount("");
    setUpiLink("");
  };

  return (
    <div className="app-container">
      <h1>UPI Payment Simulator</h1>
      <input
        type="number"
        placeholder="Enter Amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleGenerate} disabled={!amount}>
        Generate UPI QR
      </button>

      {upiLink && (
        <div className="qr-section">
          <p><strong>UPI Link:</strong> {upiLink}</p>
          <div style={{ background: 'white', padding: '16px' }}>
          <QRCode value={upiLink} size={200} />
        </div>

          <button className="mark-paid-btn" onClick={handleMarkPaid}>
            ✅ Mark as Paid
          </button>
        </div>
      )}

      <hr />

      <h2>🧾 Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No payments yet.</p>
      ) : (
        <ul>
          {transactions.map((txn) => (
            <li key={txn.id}>
              ₹{txn.amount} - {txn.status} @ {txn.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
