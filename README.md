# VigorLaunchpad — Mail Studio

Email campaign and bulk outreach dashboard built for **VigorLaunchpad** marketing team to pitch brands for:
- 🎓 College Campaigns & Fests
- 📍 Below-The-Line (BTL) & On-ground Activations
- ✨ Influencer & Creator Tie-ups
- 🎯 Brand Activations & Pop-ups
- 📱 Digital Marketing Campaigns

---

## 🚀 Quick Deploy to Vercel

1. Import this repository in [Vercel](https://vercel.com).
2. Framework Preset: **Other** (Root directory: `./`).
3. Click **Deploy**.

The serverless functions in `/api` will automatically handle sending emails via Gmail SMTP.

---

## 📁 Project Structure

```
├── index.html        # Main dashboard interface
├── package.json      # Dependencies (nodemailer)
├── vercel.json       # Vercel serverless functions configuration
├── SETUP-GUIDE.md    # Detailed team setup & anti-spam guide
├── api/              # Vercel serverless backend
│   ├── send.js       # Bulk email sender with throttling & personalization
│   ├── verify.js     # Gmail credentials tester
│   ├── logs.js       # Campaign logs retrieval
│   ├── health.js     # API health endpoint
│   └── _lib.js       # Shared utilities & HTML email wrapper
└── assets/           # Frontend assets
    ├── app.js        # Dashboard state & campaign logic
    └── style.css     # Classy navy blue & white responsive UI
```

---

## 🔒 Gmail Setup for Team Members

Each team member connects their own Gmail in the dashboard **Settings**:
1. Enable **2-Step Verification** on Google Account.
2. Generate an **App Password** (Select App: *Mail*).
3. Enter name, Gmail, and the 16-character App Password in the dashboard.
