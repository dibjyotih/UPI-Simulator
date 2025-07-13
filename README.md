# 🧾 UPI Payment Simulator

A minimal UPI payment simulation app that generates UPI QR codes using your UPI ID and amount, simulates a 2-minute payment window, and keeps persistent transaction logs with options to download or reset.
Deploy link: https://upi-simulator.vercel.app/

> ⚡ Built with React + Vite. No backend required.

<img width="1914" height="865" alt="Screenshot 2025-07-13 180805" src="https://github.com/user-attachments/assets/ea11d465-503b-45d4-8c6d-ee9869fb1e82" />


---

## 🚀 Features

- 🔐 Enter amount and generate a UPI-compliant QR code
- ⏳ Timer-limited payment (2 minutes countdown)
- ✅ Manual "Mark as Paid" to simulate success
- 📜 Persistent transaction logs via `localStorage`
- 📂 Export logs to Excel (.csv)
- ❌ Delete logs with one click
- 🆕 Cancel or retry payment during countdown
- 🎨 Clean grayscale minimalist UI
- 🧠 Fully offline, no backend needed

---

## 🛠️ Tech Stack

| Tech         | Purpose                         |
|--------------|----------------------------------|
| React.js     | Frontend SPA                    |
| Vite         | Fast dev server + bundler       |
| QRCode       | `react-qr-code` for QR gen      |
| dayjs        | Timestamp formatting            |
| localStorage | Persistent log storage          |
| Blob + JS    | Excel export + file saving      |

---

## 📦 Installation

```bash
git clone https://github.com/YOUR_USERNAME/upi-payment-simulator.git
cd upi-payment-simulator
npm install
npm run dev
