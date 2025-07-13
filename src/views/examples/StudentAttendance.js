import React, { useState } from "react";
// If Chart.js or Recharts is not available, use a placeholder for the donut chart
// For dropdown and date picker, use simple HTML elements for now

const mockSubjects = ["Web Dev", "Data Structures"];
const mockRecords = [
  { date: "2025-07-06", subject: "Web Dev", timeIn: "09:05 AM", status: "Present" },
  { date: "2025-07-03", subject: "Data Structures", timeIn: "09:20 AM", status: "Late" },
  { date: "2025-07-01", subject: "Web Dev", timeIn: "—", status: "Absent" },
  { date: "2025-06-28", subject: "Web Dev", timeIn: "09:00 AM", status: "Present" },
  { date: "2025-06-25", subject: "Data Structures", timeIn: "09:10 AM", status: "Present" },
];
const summary = { present: 40, late: 3, absent: 2, total: 45 };

function AttendanceSummary({ present, late, absent }) {
  // Placeholder donut chart
  const total = present + late + absent;
  const percent = v => (v / total) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
      <svg width="110" height="110" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="#f4f6fa" />
        <circle cx="18" cy="18" r="16" fill="none" stroke="#4caf50" strokeWidth="4" strokeDasharray={`${percent(present)} 100`} strokeDashoffset="0" />
        <circle cx="18" cy="18" r="16" fill="none" stroke="#ffc107" strokeWidth="4" strokeDasharray={`${percent(late)} 100`} strokeDashoffset={`-${percent(present)}`} />
        <circle cx="18" cy="18" r="16" fill="none" stroke="#f44336" strokeWidth="4" strokeDasharray={`${percent(absent)} 100`} strokeDashoffset={`-${percent(present) + percent(late)}`} />
        <text x="18" y="21" textAnchor="middle" fontSize="8" fill="#222" fontWeight="bold">{total}</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Total Attendance: {total} sessions</div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: '#4caf50', borderRadius: '50%', display: 'inline-block' }} /> Present: {present}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: '#ffc107', borderRadius: '50%', display: 'inline-block' }} /> Late: {late}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: '#f44336', borderRadius: '50%', display: 'inline-block' }} /> Absent: {absent}</span>
        </div>
      </div>
    </div>
  );
}

function StatusChip({ status }) {
  const color = status === "Present" ? "#4caf50" : status === "Late" ? "#ffc107" : "#f44336";
  const icon = status === "Present" ? "✅" : status === "Late" ? "⚠️" : "❌";
  return (
    <span style={{ background: color + '22', color, fontWeight: 600, borderRadius: 8, padding: '2px 10px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {icon} {status}
    </span>
  );
}

const StudentAttendance = () => {
  const [subject, setSubject] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  // Filter logic (not implemented)
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span role="img" aria-label="calendar">📅</span> My Attendance
        </div>
        <div style={{ color: '#666', fontSize: 14, marginTop: 2 }}>View your attendance records per subject and session.</div>
      </div>
      {/* Summary */}
      <AttendanceSummary present={summary.present} late={summary.late} absent={summary.absent} />
      {/* Filter Section */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <select value={subject} onChange={e => setSubject(e.target.value)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #bbb', fontSize: 14 }}>
          <option value=''>All Subjects</option>
          {mockSubjects.map(s => <option key={s}>{s}</option>)}
        </select>
        <input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #bbb', fontSize: 14 }} />
        <span style={{ alignSelf: 'center', color: '#888' }}>to</span>
        <input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #bbb', fontSize: 14 }} />
      </div>
      {/* Records Table/List */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001' }}>
          <thead>
            <tr style={{ background: '#f7fafd' }}>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 13, color: '#888', fontWeight: 700 }}>Date</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 13, color: '#888', fontWeight: 700 }}>Subject</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 13, color: '#888', fontWeight: 700 }}>Time In</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 13, color: '#888', fontWeight: 700 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockRecords.map((rec, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 8px', fontSize: 14 }}>{rec.date}</td>
                <td style={{ padding: '10px 8px', fontSize: 14 }}>{rec.subject}</td>
                <td style={{ padding: '10px 8px', fontSize: 14 }}>{rec.timeIn}</td>
                <td style={{ padding: '10px 8px', fontSize: 14 }}><StatusChip status={rec.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile stacked cards */}
      <div style={{ display: 'none', flexDirection: 'column', gap: 12, marginTop: 18 }} className="attendance-mobile-list">
        {mockRecords.map((rec, idx) => (
          <div key={idx} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #0001', padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{rec.subject}</div>
            <div style={{ color: '#888', fontSize: 13 }}>{rec.date}</div>
            <div style={{ color: '#888', fontSize: 13 }}>Time In: {rec.timeIn}</div>
            <div><StatusChip status={rec.status} /></div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 600px) {
          table { display: none; }
          .attendance-mobile-list { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default StudentAttendance; 