const TARGET_FOLDER_ID = "PASTE_YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
};

/**
 * Health check endpoint for the deployed web app.
 */
function doGet() {
  return jsonResponse({
    success: true,
    message: "Burn-a-Board upload service is running.",
  });
}

/**
 * Receives a Base64-encoded file from React, saves it to Drive, makes it shareable,
 * and returns the public Drive link as JSON.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Missing request body.");
    }

    const payload = JSON.parse(e.postData.contents);
    const result = saveFileToDrive(payload);

    return jsonResponse({
      success: true,
      url: result.url,
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: error.message || "Unable to process the upload.",
    });
  }
}

/**
 * Validates the incoming payload and writes the file into the configured Drive folder.
 */
function saveFileToDrive(payload) {
  const fileName = String(payload.fileName || "").trim();
  const mimeType = String(payload.mimeType || "").trim();
  const base64File = String(payload.base64File || "").trim();

  if (!fileName) {
    throw new Error("fileName is required.");
  }

  if (!mimeType || !ALLOWED_MIME_TYPES[mimeType]) {
    throw new Error("Only PDF, DOC, and DOCX files are allowed.");
  }

  if (!base64File) {
    throw new Error("base64File is required.");
  }

  const bytes = Utilities.base64Decode(base64File);
  if (bytes.length > MAX_FILE_SIZE_BYTES) {
    throw new Error("File size must be 5 MB or smaller.");
  }

  const folder = DriveApp.getFolderById(TARGET_FOLDER_ID);
  const blob = Utilities.newBlob(bytes, mimeType, sanitizeFileName(fileName));
  const file = folder.createFile(blob);

  // Make the uploaded file accessible via a shareable link.
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return {
    fileId: file.getId(),
    url: `https://drive.google.com/file/d/${file.getId()}/view?usp=sharing`,
  };
}

/**
 * Returns a small JSON response that the React app can parse directly.
 */
function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * Removes path separators and other unsafe characters from the filename.
 */
function sanitizeFileName(fileName) {
  return fileName.replace(/[\\/]/g, "-").replace(/\s+/g, " ").trim();
}
