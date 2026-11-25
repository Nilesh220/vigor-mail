# VigorLaunchpad Mail Studio: setup guide

No coding or commands needed. Everything below is done by clicking in your browser.
It takes about 15 minutes the first time.

---

## 1. Put the files on GitHub

Vercel picks up your files from GitHub and keeps the site updated automatically.

**If you already deployed the old version from a GitHub repository:**

1. Open that repository on github.com.
2. Delete the old files: open each one, click the **⋯** menu and choose **Delete file**, then **Commit changes**. (Or ask whoever set it up to clear it.)
3. Click **Add file → Upload files**.
4. Unzip the folder you downloaded, open it, select **everything inside** (`index.html`, `assets`, `api`, `package.json`, `vercel.json`, this guide) and drag it into the upload box.
5. Click **Commit changes**. Vercel redeploys on its own within a minute, so skip to step 3.

**If this is your first time:**

1. Sign in at [github.com](https://github.com) (it’s free) and click **New** to create a repository. Name it `mail-studio` and set it to **Private**.
2. On the empty repository page, click **uploading an existing file**.
3. Drag in **everything inside** the unzipped folder, as described above.
4. Click **Commit changes**.

> `index.html` must sit at the top level of the repository, not inside another folder.

## 2. Publish it on Vercel

1. Sign in at [vercel.com](https://vercel.com) with your GitHub account.
2. Click **Add New → Project**, find `mail-studio` and click **Import**.
3. Leave every setting as it is and click **Deploy**.
4. When it finishes, you get a link like `mail-studio-xyz.vercel.app`. That’s your dashboard.

## 3. Each teammate connects their Gmail (2 minutes each)

Share the link with the team. Each person:

1. Opens the link and goes to **Settings**.
2. Follows the on-screen steps to create a **Gmail App Password**.
3. Enters their name, Gmail address and App Password, then clicks **Test connection**.
4. Adds a signature: name, role and phone number.

Passwords are saved only in that person’s own browser.

## 4. Turn on team storage (recommended, free)

This one switch unlocks three things:

- **Team activity** shows every teammate in one place (without it, each person only sees their own browser).
- **Attachments up to 15 MB** in total, with as many files as you like (without it, the limit is 3 MB).
- **Reply rates** for everyone on the dashboard.

1. In Vercel, open your project and click the **Storage** tab.
2. Click **Create Database** (or **Browse Marketplace**), choose **Upstash**, then **Upstash for Redis**.
3. Pick the **Free** plan and the region closest to you (Mumbai if it’s listed), then click **Create**.
4. When asked, connect it to your `mail-studio` project. Vercel adds the settings automatically.
5. Go to the **Deployments** tab, click **⋯** on the top deployment and choose **Redeploy**.

In the dashboard, **Settings → Team tracking** should now say **On**.

> Choose **Upstash** specifically. Other database options in the list won’t work with this dashboard.

## 5. Lock it with a team access code (optional, recommended)

Anyone with the link can open the dashboard. To require a code:

1. In Vercel, go to your project, then **Settings → Environment Variables**.
2. Add a variable with the name `TEAM_ACCESS_CODE` and a code of your choice as the value, then click **Save**.
3. Redeploy, as in step 4.5.

Each teammate enters the code once, and their browser remembers it.

---

## Good habits that keep emails out of spam

- **Start slow on new Gmail accounts.** Send 20–30 a day for the first week, then increase.
- **Use the Normal or Gentle pace** (in Settings). The dashboard spaces emails out randomly so they look hand-sent.
- **Keep the “Inbox readiness” panel green** before you send.
- **Send yourself a test first** with the **Send test to me** button.
- **Keep attachments light.** You can attach several files, up to 15 MB in total, but cold emails with big attachments are more likely to land in spam. For decks over about 5 MB, a Google Drive link is often the safer choice.
- **Respect opt-outs.** Add anyone who asks not to be contacted to **Settings → Do-not-contact list**.
- **On a company domain** (e.g. `@vigorlaunchpad.com` through Google Workspace), ask whoever manages it to switch on **DKIM** in the Google Admin console. It’s the single biggest boost to inbox placement.

## Follow-ups

Nothing is ever sent automatically. A person always clicks **Follow up**, checks the message and sends it.

1. Open **Follow-ups** in the menu. It lists your campaigns from the last 60 days.
2. Click **Check for replies**. The dashboard looks in your Gmail (read-only, using the same App Password). A contact only counts as *replied* if a message from them arrived **after** your pitch went to them, so emails from before the campaign don't count.
3. Click the **Replied** number (e.g. “1 of 3”) to see exactly who replied. If something is wrong, click **Mark as replied** or **Not a reply**.
4. **What gets sent** shows the message for follow-up 1 and follow-up 2. Pick a different one from the dropdown, or write your own: click Follow up, edit the text, then click **Save as template**, and it appears in the dropdown.
5. When a campaign shows **Due now** (3 days after the last email), click **Follow up**. Only people who haven't replied are loaded. Edit if you like, then send.
6. Each follow-up goes out as a **reply in the same email thread**: the subject becomes “Re: …”, and in the contact's Gmail it sits under your original pitch. Campaigns sent before 25 Nov 2026 (before thread support) get their follow-up as a new email instead.
7. After **two follow-ups**, the campaign is marked done.

The yellow number next to **Follow-ups** in the menu shows how many campaigns are due.

## Limits to know

| | |
|---|---|
| Free Gmail | about 500 emails per person per day |
| Google Workspace | about 2,000 emails per person per day |
| Attachments | any number of files: 15 MB total with team storage, 3 MB without |
| While sending | keep the browser tab open (you can pause or stop at any time) |
| Team history | the latest 25,000 emails are kept; the dashboard shows the latest 8,000 |

## Something not working?

- **“Gmail did not accept the login”**: make sure 2-Step Verification is on, and paste the 16-letter App Password, not your normal password.
- **App passwords option is missing**: on company Google accounts, your admin has to allow it.
- **Team activity only shows my emails**: team tracking isn’t on yet (step 4), or the site wasn’t redeployed after connecting it.
- **Attachments say “over 3 MB”**: team storage isn’t on yet (step 4).
- **“Couldn’t check replies”**: usually a wrong App Password, or Gmail was busy. Try again in a minute.
- **“Daily sending limit reached”**: Gmail’s cap for the day. It resets in about 24 hours.
