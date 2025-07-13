import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import "./styles.css";

function App() {
  const [amount, setAmount] = useState("");
  const [upiLink, setUpiLink] = useState("");
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("upi-transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [timer, setTimer] = useState(0);
  const [expired, setExpired] = useState(false);
  const [showLog, setShowLog] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("upi-transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0 && upiLink) {
      setExpired(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [timer]);

  const handleGenerate = () => {
    if (amount > 10000) {
      alert("Amount should be less than ₹10,000");
      return;
    }

    const upiId = "dibjyotihota@ybl";
    const name = "Dibjyoti Hota";
    const txnRef = `TXN${Date.now()}`;
    const url = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      name
    )}&mc=0000&tid=${txnRef}&tr=${txnRef}&tn=PaymentToDibjyoti&am=${amount}&cu=INR`;

    setUpiLink(url);
    setExpired(false);
    setTimer(120);
  };

  const handleMarkPaid = () => {
    if (expired) {
      alert("Payment expired. Please generate a new QR.");
      return;
    }

    const txn = {
      id: Date.now(),
      amount,
      status: "Success",
      time: dayjs().format("HH:mm:ss - DD MMM YYYY"),
      link: upiLink,
    };

    setTransactions([txn, ...transactions]);
    setAmount("");
    setUpiLink("");
    setTimer(0);
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };
  const handleDownloadLog = () => {
    if (transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    XLSX.writeFile(workbook, "upi-transactions.xlsx");
  };
  const handleClearLog = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all transactions?"
    );
    if (confirmClear) {
      setTransactions([]);
      localStorage.removeItem("upi-transactions");
    }
  };

  return (
    <div className="layout">
      <div className="main-content">
        <h1>UPI Payment Simulator</h1>

        {!upiLink && (
          <>
            <input
              type="number"
              placeholder="Enter Amount (₹)"
              value={amount}
              min="0"
              onChange={(e) => {
                const val = e.target.value;
                if (val >= 0) setAmount(val);
              }}
              className="amount-input"
            />
            <button
              onClick={handleGenerate}
              disabled={!amount || amount > 10000}
            >
              Generate UPI QR
            </button>
            {amount > 10000 && (
              <p style={{ color: "red" }}>
                Amount must be less or equal to ₹10,000
              </p>
            )}
          </>
        )}

        {/* QR Section shown only if not expired */}
        {upiLink && !expired && (
          <div className="qr-section">
            <p>
              <strong>UPI Link:</strong>{" "}
              <a href={upiLink} target="_blank" rel="noopener noreferrer">
                {upiLink}
              </a>
            </p>
            
            <div
              style={{
                background: "white",
                padding: "16px",
                display: "inline-block",
                marginTop: "1rem",
              }}
            >
              <QRCode value={upiLink} size={200} />
            </div>
            <p>⏳ Time left: {formatTime(timer)}</p>

            <button className="mark-paid-btn" onClick={handleMarkPaid}>
              ✅ Mark as Paid
            </button>

            <button
              style={{ marginTop: "10px", backgroundColor: "#ff4d4f" }}
              onClick={() => {
                setAmount("");
                setUpiLink("");
                setTimer(0);
                setExpired(false);
              }}
            >
              🆕 New Payment
            </button>
          </div>
        )}

        {/* Payment expired view */}
        {upiLink && expired && (
          <div className="qr-section">
            <p style={{ color: "red" }}>❌ Payment Expired</p>
            <button onClick={handleGenerate}>🔁 Try Again</button>
            <button
              onClick={() => {
                setAmount("");
                setUpiLink("");
                setExpired(false);
                setTimer(0);
              }}
              style={{ marginLeft: "10px" }}
            >
              ✨ New Payment
            </button>
          </div>
        )}
      </div>

      {/* Sliding Log Panel */}
      <div className={`side-panel ${showLog ? "expanded" : "collapsed"}`}>
        <div className="floating-toggle" onClick={() => setShowLog(!showLog)}>
          <span className="arrow">{showLog ? "<" : ">"}</span>
        </div>

        {showLog && (
          <div className="log-content">
            <h2>🧾 Payment Logs</h2>

            {transactions.length === 0 ? (
              <p>No payments yet.</p>
            ) : (
              <>
                <ul>
                  {transactions.map((txn) => (
                    <li key={txn.id}>
                      ₹{txn.amount} • {txn.status}
                      <br />
                      <small>{txn.time}</small>
                    </li>
                  ))}
                </ul>

                {/* New Buttons */}
                <div className="log-buttons">
                  <button onClick={handleDownloadLog}>📥 Download Log</button>
                  <button
                    onClick={handleClearLog}
                    style={{ marginLeft: "10px" }}
                  >
                    🗑️ Clear Log
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
