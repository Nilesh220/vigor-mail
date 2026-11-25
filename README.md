# VigorLaunchpad — Mail Studio (v2.2)

Email campaign, bulk outreach, and automated follow-up studio built specifically for the **VigorLaunchpad** business development and marketing team to pitch brands for:
- 🎓 **College Campaigns & Campus Fests**
- 📍 **Below-The-Line (BTL) & On-ground Activations**
- ✨ **Influencer & Creator Collaborations**
- 🎯 **Brand Activations & Pop-up Experiences**
- 📱 **Digital Performance Marketing**

---

## ⚡ What's New in v2.2

- 🎯 **Accurate Reply Detection:**
  - Strict timestamp matching: only incoming emails received *after* the specific pitch was sent are counted as replies.
  - Automatically excludes your own sender email addresses.
  - Click on any campaign's replied counter (e.g. **"1 of 3"**) to inspect contact statuses and manually adjust with **"Mark as replied"** or **"Not a reply"**.
- ✉️ **Clear Follow-Up Selection ("What gets sent"):**
  - Follow-up 1: 3 days after original pitch ("Gentle nudge").
  - Follow-up 2: 3 days after follow-up 1 ("Last check-in").
  - Pick alternative templates from dropdowns or save your own custom template.
- 🧵 **Same Email Threading:**
  - Follow-ups sent as in-thread replies (`Re: ...` with proper email headers), so the contact sees your original pitch directly underneath.
- 📎 **15 MB Attachments & Team Storage:**
  - Up to 15 MB multi-file attachments (pitch decks, media kits, proposals) when Upstash Redis is connected.

---

## 🚀 Quick Deploy to Vercel (Automatic)

Whenever you push to GitHub (`main`), Vercel automatically deploys the updated dashboard within 1 minute.

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
│   ├── replies.js    # Gmail reply checking endpoint (v2.2 timestamp-aware)
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
