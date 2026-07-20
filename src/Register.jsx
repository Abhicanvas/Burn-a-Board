import { useState } from 'react';

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbznf1_a2hMVx2WOnmH04NtJSv07V0xeo1sAFCeoe9TMt5D29bL0EptIKr4N4HtBPyB0/exec';
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/xn5onpwtrr2o0k5q1q191afgx75aoa7x';
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const initialForm = {
  teamName: '',
  captainName: '',
  phone: '',
  email: '',
  college: '',
  teamSize: '',
  idea: '',
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [consent, setConsent] = useState(false);
  const [ideaFile, setIdeaFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submittedTeamName, setSubmittedTeamName] = useState('');

  const isBusy = status === 'uploading' || status === 'sending';

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));

    if (submitError) {
      setSubmitError('');
    }
  };

  const updateIdeaFile = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setIdeaFile(null);
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setIdeaFile(null);
      setSubmitError('Upload a PDF, DOC, or DOCX file.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setIdeaFile(null);
      setSubmitError('Idea document must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    setSubmitError('');

    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',')[1] : '';
      setIdeaFile({ name: file.name, type: file.type, data: base64 });
    };

    reader.onerror = () => {
      setIdeaFile(null);
      setSubmitError('Unable to read the selected file. Please try again.');
      event.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next = {};

    ['teamName', 'captainName', 'phone', 'email', 'college', 'teamSize'].forEach((field) => {
      if (!String(form[field]).trim()) {
        next[field] = 'Required';
      }
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email';
    }

    if (form.phone) {
      const normalizedPhone = form.phone.replace(/[\s()-]/g, '');
      if (!/^((\+91|91))?[6-9]\d{9}$/.test(normalizedPhone)) {
        next.phone = 'Enter a valid Indian phone number';
      }
    }

    if (form.teamSize) {
      const teamSizeNumber = Number(form.teamSize);
      if (!Number.isInteger(teamSizeNumber) || teamSizeNumber < 1 || teamSizeNumber > 4) {
        next.teamSize = 'Choose 1–4';
      }
    }

    if (!consent) {
      next.consent = 'Consent is required';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const readJsonResponse = async (response) => {
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch {
      throw new Error('The server returned an invalid JSON response.');
    }
  };

  const uploadFileToGoogleAppsScript = async () => {
    if (!ideaFile) {
      return '';
    }

    setStatus('uploading');

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-store',
      credentials: 'omit',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        fileName: ideaFile.name,
        mimeType: ideaFile.type,
        base64File: ideaFile.data,
      }),
    });

    const payload = await readJsonResponse(response);

    if (!response.ok || !payload?.success || !payload?.url) {
      throw new Error(payload?.error || 'File upload failed.');
    }

    return payload.url;
  };

  const sendToMakeWebhook = async (driveLink) => {
    setStatus('sending');

    const payload = {
      teamName: form.teamName.trim(),
      captainName: form.captainName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      college: form.college.trim(),
      teamSize: Number(form.teamSize),
      driveLink,
    };

    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Make webhook rejected the registration payload.');
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setConsent(false);
    setIdeaFile(null);
    setErrors({});
    setSubmitError('');
    setStatus('success');
    setFileInputKey((current) => current + 1);
  };

  const submit = async (event) => {
    event.preventDefault();

    if (form.idea.trim()) {
      return;
    }

    if (!validate()) {
      return;
    }

    setSubmitError('');
    setSubmittedTeamName(form.teamName.trim());

    try {
      const driveLink = await uploadFileToGoogleAppsScript();
      await sendToMakeWebhook(driveLink);
      resetForm();
    } catch (error) {
      setStatus('error');
      setSubmitError(error?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <header className="register-nav">
        <a href="/" className="register-brand"><span>✳</span> Burn-a-Board</a>
        <span className="register-code">[ REGISTRATION / 2026 ]</span>
        <a href="/" className="back-link">← Back to site</a>
      </header>

      <main className="register-main">
        <div className="register-intro">
          <p className="form-eyebrow">IEEE FISAT × IDEA LAB</p>
          <h1>REGISTER<br /><span>TO BUILD</span></h1>
          <p>Secure your team’s place in a 24-hour hardware build for rural India.</p>
          <div className="register-specs">
            <span>08–09 AUG 2026</span>
            <span>IDEA LAB, FISAT</span>
            <span>₹50,000 PRIZE POOL</span>
          </div>
        </div>

        {status === 'success' ? (
          <Success teamName={submittedTeamName} />
        ) : (
          <form className="register-form" onSubmit={submit} noValidate>
            <div className="form-rule"><span>[ TEAM REGISTRATION ]</span></div>

            <div className="form-grid">
              <Field
                name="teamName"
                label="Team Name"
                value={form.teamName}
                onChange={update}
                error={errors.teamName}
              />

              <Field
                name="captainName"
                label="Captain Name"
                value={form.captainName}
                onChange={update}
                error={errors.captainName}
              />

              <Field
                name="phone"
                label="Captain Phone Number"
                type="tel"
                value={form.phone}
                onChange={update}
                error={errors.phone}
              />

              <Field
                name="email"
                label="Captain Email"
                type="email"
                value={form.email}
                onChange={update}
                error={errors.email}
              />

              <Field
                name="college"
                label="College / Institution"
                value={form.college}
                onChange={update}
                error={errors.college}
              />

              <Field
                name="teamSize"
                label="Number of Team Members"
                type="number"
                min="1"
                max="4"
                value={form.teamSize}
                onChange={update}
                error={errors.teamSize}
              />

              <label className="form-field file-field">
                <span>
                  Idea Discussion Document
                  <em>[ OPTIONAL · PDF / DOC / DOCX · MAX 5 MB ]</em>
                </span>
                <input
                  key={fileInputKey}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={updateIdeaFile}
                  disabled={isBusy}
                />
                {ideaFile && <small className="file-name">Attached: {ideaFile.name}</small>}
              </label>
            </div>

            <input
              className="honeypot"
              name="idea"
              value={form.idea}
              onChange={update}
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
            />

            <label className="consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                disabled={isBusy}
              />
              <span>
                I confirm the details above are correct and I consent to being contacted for
                Burn-a-Board updates.
              </span>
            </label>
            {errors.consent && <p className="field-error consent-error">{errors.consent}</p>}

            {status === 'error' && (
              <div className="submit-error">
                {submitError || 'Something went wrong — please try again.'}
              </div>
            )}

            {isBusy && (
              <p className="form-footnote">
                {status === 'uploading'
                  ? 'Uploading your idea document to Google Drive...'
                  : 'Sending registration details to Make...'}
              </p>
            )}

            <button type="submit" className="submit-button" disabled={isBusy}>
              {status === 'uploading'
                ? 'Uploading file...'
                : status === 'sending'
                  ? 'Sending registration...'
                  : 'Submit registration'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

function Field({ name, label, type = 'text', value, onChange, error, optional, min, max }) {
  return (
    <label className={`form-field ${error ? 'has-error' : ''}`}>
      <span>
        {label} {optional && <em>[ OPTIONAL ]</em>}
      </span>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows="3"
          placeholder="Separate names with commas"
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
        />
      )}
      {error && <small>{error}</small>}
    </label>
  );
}

function Success({ teamName }) {
  return (
    <section className="success-panel">
      <span className="success-mark">✓</span>
      <p className="form-eyebrow">REGISTRATION RECEIVED</p>
      <h2>See you at<br /><span>Burn-a-Board.</span></h2>
      <p>
        Your team <strong>{teamName}</strong> is in the build queue. We’ll share the next steps and
        event updates with your captain.
      </p>
      <a className="back-link success-link" href="/">Return to home →</a>
    </section>
  );
}