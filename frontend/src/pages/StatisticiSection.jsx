/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

const P = { navy: '#344979', blue: '#5d6da5', lav: '#9896bb', lavLight: '#c6c6e8', blush: '#f7e5eb' };

const PieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px', color: P.lav, fontSize: '0.85rem', fontStyle: 'italic' }}>
        Niciun fișier încărcat
      </div>
    );
  }
  const total = data.reduce((s, d) => s + d.count, 0);
  let cumAngle = -Math.PI / 2;
  const cx = 80, cy = 80, r = 70;
  const slices = data.map((d) => {
    const angle = (d.count / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle);
    const y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return { ...d, path, angle };
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2">
            <title>{s.title}: {s.count} fișiere</title>
          </path>
        ))}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: d.color, flexShrink: 0, display: 'inline-block' }} />
            <span style={{ color: P.navy, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
              {d.title}
            </span>
            <span style={{ color: P.lav, marginLeft: 'auto', paddingLeft: '8px', fontWeight: 800 }}>
              {d.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.minutes), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '140px', padding: '0 4px' }}>
      {data.map((d, i) => {
        const heightPct = (d.minutes / maxVal) * 100;
        const isToday = i === data.length - 1;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '6px' }}>
            <div title={`${d.hours}h`} style={{
              width: '100%', height: `${Math.max(heightPct, 3)}%`,
              backgroundColor: isToday ? P.blue : P.lavLight,
              borderRadius: '6px 6px 0 0', transition: 'height 0.4s ease',
              cursor: 'default', position: 'relative',
              minHeight: d.minutes > 0 ? '4px' : '2px',
            }}>
              {d.minutes > 0 && (
                <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.68rem', color: P.navy, whiteSpace: 'nowrap', fontWeight: 700 }}>
                  {d.hours}h
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.72rem', color: isToday ? P.blue : P.lav, fontWeight: isToday ? 800 : 500 }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const StatisticiSection = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/study/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Eroare server');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError('Nu s-au putut încărca statisticile.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const cardStyle = {
    background: 'rgba(255,255,255,0.85)', borderRadius: '18px',
    padding: '20px 24px', flex: 1, minWidth: '260px',
    boxShadow: '0 2px 12px rgba(52,73,121,0.07)',
    border: `1.5px solid ${P.lavLight}55`, backdropFilter: 'blur(8px)',
  };

  const subtitleStyle = {
    fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: P.blue, marginBottom: '14px', margin: '0 0 14px 0',
  };

  if (loading) return (
    <div style={{ padding: '2rem', color: P.lav, fontSize: '0.9rem', fontStyle: 'italic' }}>
      Se încarcă statisticile...
    </div>
  );

  if (error) return (
    <div style={{ padding: '2rem', color: '#e53e3e', fontSize: '0.9rem' }}>
      {error}
    </div>
  );

  return (
    <div>
      {/* Summary row */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '18px', flexWrap: 'wrap' }}>
        {[
          { label: 'Ore studiate săptămâna aceasta', value: `${stats.totalHoursThisWeek}h`, color: P.blue },
          { label: 'Total sesiuni finalizate', value: stats.totalSessions, color: P.navy },
          { label: 'Fișiere încărcate', value: stats.filesPerSubject.reduce((s, f) => s + f.count, 0), color: P.lav },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, minWidth: '140px',
            background: `linear-gradient(135deg, ${s.color}18, ${s.color}0a)`,
            border: `1.5px solid ${s.color}33`, borderRadius: '16px', padding: '16px 20px',
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: P.lav, marginTop: '6px', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <p style={subtitleStyle}>Ore de studiu — ultimele 7 zile</p>
          <BarChart data={stats.studyByDay} />
        </div>
        <div style={cardStyle}>
          <p style={subtitleStyle}>Materiale per materie</p>
          <PieChart data={stats.filesPerSubject} />
        </div>
      </div>
    </div>
  );
};

export default StatisticiSection;
