import { useState } from 'react';

const WEBHOOK_URL = 'https://hook.eu1.make.com/xn5onpwtrr2o0k5q1q191afgx75aoa7x';
const initialForm = { teamName: '', captainName: '', phone: '', email: '', college: '', teamSize: '', idea: '' };

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [ideaFile, setIdeaFile] = useState(null);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateIdeaFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return setIdeaFile(null);
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { setSubmitError('Upload a PDF, DOC, or DOCX file.'); event.target.value = ''; return; }
    if (file.size > 8 * 1024 * 1024) { setSubmitError('Idea document must be 8 MB or smaller.'); event.target.value = ''; return; }
    setSubmitError('');
    const reader = new FileReader();
    reader.onload = () => setIdeaFile({ name: file.name, type: file.type, data: String(reader.result).split(',')[1] });
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next = {};
    ['teamName', 'captainName', 'phone', 'email', 'college', 'teamSize'].forEach((field) => { if (!String(form[field]).trim()) next[field] = 'Required'; });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (form.phone && !/^((\+91|91)[ -]?)?[6-9]\d{9}$/.test(form.phone.replace(/[()]/g, ''))) next.phone = 'Enter a valid 10-digit phone';
    if (form.teamSize && (!Number.isInteger(Number(form.teamSize)) || Number(form.teamSize) < 1 || Number(form.teamSize) > 4)) next.teamSize = 'Choose 1–4';
    if (!consent) next.consent = 'Consent is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate() || form.idea) return;
    setStatus('submitting'); setSubmitError('');
    try {
      await fetch(WEBHOOK_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ ...form, idea: undefined, ideaFileName: ideaFile?.name || '', ideaFileType: ideaFile?.type || '', ideaFileData: ideaFile?.data || '' }) });
      setStatus('success');
    } catch (error) { setSubmitError(error.message || 'Something went wrong.'); setStatus('error'); }
  };

  return <div className="register-page"><header className="register-nav"><a href="/" className="register-brand"><span>✳</span> Burn-a-Board</a><span className="register-code">[ REGISTRATION / 2026 ]</span><a href="/" className="back-link">← Back to site</a></header><main className="register-main"><div className="register-intro"><p className="form-eyebrow">IEEE FISAT × IDEA LAB</p><h1>REGISTER<br /><span>TO BUILD</span></h1><p>Secure your team’s place in a 24-hour hardware build for rural India.</p><div className="register-specs"><span>08–09 AUG 2026</span><span>IDEA LAB, FISAT</span><span>₹50,000 PRIZE POOL</span></div></div>{status === 'success' ? <Success teamName={form.teamName} /> : <form className="register-form" onSubmit={submit} noValidate><div className="form-rule"><span>[ TEAM REGISTRATION ]</span></div><div className="form-grid"><Field name="teamName" label="Team Name" value={form.teamName} onChange={update} error={errors.teamName} /><Field name="captainName" label="Captain Name" value={form.captainName} onChange={update} error={errors.captainName} /><Field name="phone" label="Captain Phone Number" type="tel" value={form.phone} onChange={update} error={errors.phone} /><Field name="email" label="Captain Email" type="email" value={form.email} onChange={update} error={errors.email} /><Field name="college" label="College / Institution" value={form.college} onChange={update} error={errors.college} /><Field name="teamSize" label="Number of Team Members" type="number" min="1" max="4" value={form.teamSize} onChange={update} error={errors.teamSize} /><label className="form-field file-field"><span>Idea Discussion Document <em>[ OPTIONAL · PDF / DOC / DOCX · MAX 8 MB ]</em></span><input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={updateIdeaFile} />{ideaFile && <small className="file-name">Attached: {ideaFile.name}</small>}</label></div><input className="honeypot" name="idea" value={form.idea} onChange={update} tabIndex="-1" autoComplete="off" aria-hidden="true" /><label className="consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I confirm that the details submitted are accurate and agree to participate in Burn-a-Board.</span></label>{errors.consent && <p className="field-error consent-error">{errors.consent}</p>}{status === 'error' && <div className="submit-error">{submitError || 'Something went wrong — please try again.'}<button type="button" onClick={() => setStatus('idle')}>Retry</button></div>}<button className="submit-button" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Submitting…' : 'Submit Registration →'}</button><p className="form-footnote">Your idea document is included with the registration submission.</p></form>}</main></div>;
}

function Field({ name, label, type = 'text', value, onChange, error, optional, min, max }) { return <label className={`form-field ${error ? 'has-error' : ''}`}><span>{label} {optional && <em>[ OPTIONAL ]</em>}</span>{type === 'textarea' ? <textarea name={name} value={value} onChange={onChange} rows="3" placeholder="Separate names with commas" /> : <input name={name} type={type} value={value} onChange={onChange} min={min} max={max} />}{error && <small>{error}</small>}</label>; }
function Success({ teamName }) { return <section className="success-panel"><span className="success-mark">✓</span><p className="form-eyebrow">REGISTRATION RECEIVED</p><h2>See you at<br /><span>Burn-a-Board.</span></h2><p>Your team <strong>{teamName}</strong> is in the build queue. We’ll share the next steps and event updates with your captain.</p><a className="back-link success-link" href="/">Return to home →</a></section>; }
