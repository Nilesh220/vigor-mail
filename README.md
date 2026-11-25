# VigorLaunchpad — Mail Studio (v2.1)

Email campaign, bulk outreach, and automated follow-up studio built specifically for the **VigorLaunchpad** business development and marketing team to pitch brands for:
- 🎓 **College Campaigns & Campus Fests**
- 📍 **Below-The-Line (BTL) & On-ground Activations**
- ✨ **Influencer & Creator Collaborations**
- 🎯 **Brand Activations & Pop-up Experiences**
- 📱 **Digital Performance Marketing**

---

## ⚡ What's New in v2.1

- 📬 **Follow-ups & Reply Detection:**
  - Automated Gmail reply checking (read-only IMAP using the same App Password).
  - Identifies who hasn't replied after 3 days.
  - Sends follow-ups as **replies in the same email thread** so the recipient sees the original pitch context.
  - Automatically stops follow-ups once a contact replies or after 2 follow-ups.
- 📎 **Expanded Attachments (Up to 15 MB):**
  - Attach multiple documents, pitch decks, proposals, and rate cards up to 15 MB total when team storage is enabled.
- 👥 **Team Activity & Upstash Redis Storage:**
  - View cross-team campaign activity, total emails sent, and reply rates across all teammates.
- 🔐 **Optional Team Access Code:**
  - Secure the dashboard with `TEAM_ACCESS_CODE` environment variable on Vercel.

---

## 🚀 Quick Deploy to Vercel (1-Click)

1. Open [Vercel](https://vercel.com) and click **Add New → Project**.
2. Select your repository (`vigor-mail`).
3. Framework Preset: **Other** (Root directory: `./`).
4. Click **Deploy**.

Within 1 minute, your dashboard will be live at `https://vigor-mail-*.vercel.app`.

---

## 🛠️ Recommended Setup (Free)

### 1. Enable Team Storage (Upstash Redis)
*Unlocks 15 MB attachments, cross-team analytics, and reply rates.*
1. In Vercel, go to your project → **Storage** tab.
2. Click **Create Database** → Choose **Upstash** → **Upstash for Redis** (Free plan, nearest region e.g. Mumbai).
3. Connect it to your project.
4. Go to **Deployments** tab → click **⋯** on the latest deployment → **Redeploy**.

### 2. Lock with Team Access Code (Optional)
1. In Vercel, go to **Settings → Environment Variables**.
2. Add `TEAM_ACCESS_CODE` with a password of your choice.
3. Redeploy.

---

## 📁 Project Structure

```
├── index.html        # Main dashboard interface
├── package.json      # Dependencies (nodemailer)
├── vercel.json       # Vercel serverless function timeouts
├── SETUP-GUIDE.md    # Step-by-step non-tech guide for the team
├── README.md         # Documentation
├── api/              # Vercel serverless functions
│   ├── send.js       # Bulk email sender with thread reply support
│   ├── replies.js    # Gmail reply checking endpoint
│   ├── upload.js     # Large attachment handler
│   ├── verify.js     # Gmail credentials validator
│   ├── logs.js       # Campaign logs & team analytics
│   ├── health.js     # System status check
│   ├── _imap.js      # Zero-dependency Gmail IMAP client
│   └── _lib.js       # Shared utilities & HTML email wrapper
└── assets/           # Frontend assets
    ├── app.js        # Dashboard state, follow-ups, and campaign logic
    └── style.css     # Classy navy blue & white responsive UI
```

---

## 🔒 Gmail App Password Setup for Team

Every team member enters their credentials directly in the dashboard's **Settings** tab:
1. Turn on **2-Step Verification** in [Google Account Security](https://myaccount.google.com/security).
2. Generate an **App Password** for `Mail` / `Windows Computer`.
3. Enter Name, Gmail, and the 16-character code in the dashboard.
4. Credentials are stored securely and locally in their own browser.
