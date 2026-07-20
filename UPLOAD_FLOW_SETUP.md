# Burn-a-Board Upload Flow Setup

## 1. Architecture

React uploads the optional idea document to Google Apps Script first. Google Apps Script saves the file into Google Drive, makes it shareable, and returns a Drive URL. React then sends only the team data plus `driveLink` to the Make webhook.

## 2. Where each URL or ID goes

- React upload endpoint: paste the deployed Google Apps Script web app URL into `src/Register.jsx` at `GOOGLE_APPS_SCRIPT_URL`.
- Make webhook URL: paste your webhook URL into `src/Register.jsx` at `MAKE_WEBHOOK_URL`.
- Google Drive folder ID: paste the target folder ID into `Code.gs` at `TARGET_FOLDER_ID`.

## 3. Deploy Google Apps Script

1. Create a new Apps Script project.
2. Paste the contents of `Code.gs` into the script editor.
3. Replace `TARGET_FOLDER_ID` with the ID of the Drive folder that should receive uploads.
4. Save the project.
5. Deploy as a web app.
6. Set the deployment to run as you, and allow access to anyone who needs to upload from the React app.
7. Copy the web app URL and paste it into `src/Register.jsx`.

## 4. Required Google Drive permissions

- The account that owns the Apps Script deployment must have write access to the target Drive folder.
- The target folder must be accessible to that account by folder ID.
- Uploaded files are shared using `ANYONE_WITH_LINK`, so the file link can be opened by the registrar and by Make if needed.

## 5. Folder sharing instructions

1. Create a dedicated Drive folder for Burn-a-Board uploads.
2. Share that folder with the Google account that owns the Apps Script project.
3. Copy the folder ID from the folder URL and put it into `TARGET_FOLDER_ID`.
4. Do not paste the folder ID into React. React never talks to Drive directly.

## 6. Make mapping

Map only these fields in Make:

- `teamName`
- `captainName`
- `phone`
- `email`
- `college`
- `teamSize`
- `driveLink`

Do not map any file binary field, because the file never reaches Make.

## 7. React request flow

1. User selects an optional file.
2. React converts the file to Base64.
3. React POSTs the Base64 payload to Google Apps Script.
4. Google Apps Script saves the file to Drive and returns `{ success: true, url: "..." }`.
5. React POSTs only the registration JSON plus `driveLink` to Make.
6. Make writes the row to Google Sheets.

## 8. Submission payload sent to Make

```json
{
  "teamName": "",
  "captainName": "",
  "phone": "",
  "email": "",
  "college": "",
  "teamSize": 1,
  "driveLink": "https://drive.google.com/file/d/.../view?usp=sharing"
}
```

## 9. Upload constraints

- Allowed file types: PDF, DOC, DOCX
- Maximum file size: 5 MB
- File content is sent only to Google Apps Script
- Make receives only the Drive URL

## 10. Validation preserved in React

- Email validation
- Indian phone validation
- Team size validation for 1 to 4
- Honeypot anti-spam field
- Consent checkbox

## 11. Production notes

- Keep the Google Apps Script web app URL stable by using a permanent deployment.
- If you change the Apps Script deployment, update the URL in React immediately.
- If you change the Make webhook, update the URL in React immediately.
- If you move the Drive folder, update the folder ID in `Code.gs` immediately.
