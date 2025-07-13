import React, { useState } from "react";

const mockClasses = [
  { code: "B7P3R9", name: "Web Dev" },
  { code: "A1C2D3", name: "Data Structures" },
];
const mockExcuses = [
  { date: "2025-07-03", class: "Web Dev", reason: "Medical Certificate", status: "Pending" },
  { date: "2025-07-01", class: "Data Structures", reason: "Typhoon", status: "Approved" },
];

function StatusBadge({ status }) {
  const color = status === "Approved" ? "#4caf50" : status === "Pending" ? "#ffc107" : "#f44336";
  const icon = status === "Approved" ? "✅" : status === "Pending" ? "🟡" : "❌";
  return (
    <span style={{ background: color + '22', color, fontWeight: 600, borderRadius: 8, padding: '2px 10px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {icon} {status}
    </span>
  );
}

const StudentExcuseLetter = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [absentDate, setAbsentDate] = useState('');
  const [reason, setReason] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [excuses, setExcuses] = useState(mockExcuses);

  const today = new Date().toISOString().split('T')[0];

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(f.type)) {
      setFileError("Only JPG, PNG, or PDF allowed.");
      setFile(null);
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setFileError("File must be less than 2MB.");
      setFile(null);
      return;
    }
    setFileError("");
    setFile(f);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedClass || !absentDate || !reason.trim() || !file) {
      setAlert({ type: 'error', msg: 'All fields are required.' });
      return;
    }
    setUploading(true);
    setAlert(null);
    setTimeout(() => {
      setUploading(false);
      setAlert({ type: 'success', msg: 'Excuse letter submitted successfully!' });
      setExcuses([
        { date: absentDate, class: mockClasses.find(c => c.code === selectedClass)?.name, reason, status: 'Pending' },
        ...excuses,
      ]);
      setSelectedClass('');
      setAbsentDate('');
      setReason('');
      setFile(null);
    }, 1500);
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span role="img" aria-label="note">📝</span> Submit Excuse Letter
        </div>
        <div style={{ color: '#666', fontSize: 14, marginTop: 2 }}>If you were absent, you may upload a valid excuse here for teacher review.</div>
      </div>
      {/* Landscape Flex Layout */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }} className="excuse-landscape-flex">
        {/* Excuse Letter Form */}
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 20, marginBottom: 32, flex: 1, minWidth: 320, maxWidth: 480 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: 600, fontSize: 14 }}>Class</label><br />
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #bbb', fontSize: 14 }}>
              <option value=''>Select class</option>
              {mockClasses.map(cls => <option key={cls.code} value={cls.code}>{cls.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: 600, fontSize: 14 }}>Absent Date</label><br />
            <input type="date" value={absentDate} max={today} onChange={e => setAbsentDate(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #bbb', fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: 600, fontSize: 14 }}>Reason</label><br />
            <textarea value={reason} onChange={e => setReason(e.target.value.slice(0, 300))} required maxLength={300} rows={3} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #bbb', fontSize: 14, resize: 'vertical' }} placeholder="State your reason (max 300 characters)" />
            <div style={{ textAlign: 'right', fontSize: 12, color: '#888' }}>{reason.length}/300</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: 600, fontSize: 14 }}>Supporting Photo</label><br />
            <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={handleFileChange} required style={{ fontSize: 14 }} />
            {fileError && <div style={{ color: '#c62828', fontSize: 13, marginTop: 4 }}>{fileError}</div>}
            {file && !fileError && <div style={{ color: '#388e3c', fontSize: 13, marginTop: 4 }}>{file.name}</div>}
          </div>
          <button type="submit" disabled={uploading} style={{ width: '100%', background: uploading ? '#bbb' : '#1976d2', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 8, padding: '10px 0', cursor: uploading ? 'not-allowed' : 'pointer', marginTop: 8 }}>
            {uploading ? 'Submitting...' : 'Submit Excuse Letter'}
          </button>
        </form>
        {/* Submitted Excuses */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 18, flex: 1, minWidth: 320, maxWidth: 480 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Submitted Excuses</div>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
              <thead>
                <tr style={{ background: '#f7fafd' }}>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 13, color: '#888', fontWeight: 700 }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 13, color: '#888', fontWeight: 700 }}>Class</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 13, color: '#888', fontWeight: 700 }}>Reason</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 13, color: '#888', fontWeight: 700 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {excuses.map((ex, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 8px', fontSize: 14 }}>{ex.date}</td>
                    <td style={{ padding: '8px 8px', fontSize: 14 }}>{ex.class}</td>
                    <td style={{ padding: '8px 8px', fontSize: 14, maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.reason}</td>
                    <td style={{ padding: '8px 8px', fontSize: 14 }}><StatusBadge status={ex.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .excuse-landscape-flex { flex-direction: column !important; gap: 18px !important; }
          form, .excuse-mobile-list, .excuse-landscape-flex > div { max-width: 100% !important; }
        }
        @media (max-width: 600px) {
          table { font-size: 12px; }
          form, .excuse-mobile-list { padding: 8px !important; }
        }
      `}</style>
    </div>
  );
};

export default StudentExcuseLetter; 