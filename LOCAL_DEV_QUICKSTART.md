# Local Development Quickstart

Follow these steps to run the app locally and avoid the `package.json` not found (ENOENT) error:

1) **Clone and enter the repo**
- `git clone https://github.com/mrbrandonmills/Webdesigner.git`
- `cd Webdesigner`

2) **Install dependencies**
- `npm install`

3) **Set environment variables**
- Copy the sample file: `cp .env.example .env.local`
- Add Pinterest values for the approval demo:
  - `NEXT_PUBLIC_PINTEREST_APP_ID=1537033`
  - `PINTEREST_APP_SECRET=<your secret>`
  - `PINTEREST_APPROVAL_REDIRECT_URI=https://brandonmills.com/api/pinterest/approval-callback`
  - (Optional) `PINTEREST_USE_SANDBOX=true`

4) **Run the dev server**
- From the repo root (where `package.json` lives): `npm run dev`
- Open http://localhost:3000 and visit `/pinterest-approval-demo` for the OAuth flow.

If you see `npm ERR! enoent ... /package.json`, confirm you are inside the `Webdesigner` directory before running `npm run dev`.
