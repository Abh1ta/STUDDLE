/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */


import React, { useState, useEffect } from 'react';

const DAY_LABELS_RO = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];

const PieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px', color: '#aaa', fontSize: '0.85rem' }}>
        Niciun fișier încărcat
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.count, 0);
  let cumAngle = -Math.PI / 2; // start at top
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
            <span style={{
              width: '12px', height: '12px', borderRadius: '3px',
              backgroundColor: d.color, flexShrink: 0, display: 'inline-block'
            }} />
            <span style={{ color: '#444', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {d.title}
            </span>
            <span style={{ color: '#888', marginLeft: 'auto', paddingLeft: '8px', fontWeight: 600 }}>
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
            {/* Tooltip on hover */}
            <div
              title={`${d.hours}h`}
              style={{
                width: '100%',
                height: `${Math.max(heightPct, 3)}%`,
                backgroundColor: isToday ? '#8398e7' : '#c5cdf7',
                borderRadius: '6px 6px 0 0',
                transition: 'height 0.4s ease',
                cursor: 'default',
                position: 'relative',
                minHeight: d.minutes > 0 ? '4px' : '2px',
              }}
            >
              {d.minutes > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.68rem',
                  color: '#555',
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                }}>
                  {d.hours}h
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.72rem', color: isToday ? '#8398e7' : '#999', fontWeight: isToday ? 700 : 400 }}>
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
        const res = await fetch('/api/study/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Eroare server');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError('Nu s-au putut încărca statisticile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const cardStyle = {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px 24px',
    flex: 1,
    minWidth: '280px',
    boxShadow: '0 2px 12px rgba(130,140,200,0.10)',
  };

  const subtitleStyle = {
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#8398e7',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  };

  if (loading) {
    return (
      <div className="container-materii-border" style={{ padding: '2rem', color: '#aaa', fontSize: '0.9rem' }}>
        Se încarcă statisticile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-materii-border" style={{ padding: '2rem', color: '#f03a17', fontSize: '0.9rem' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="container-materii-border">
      {/* Summary row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { label: 'Ore studiate săptămâna aceasta', value: `${stats.totalHoursThisWeek}h`, color: '#8398e7' },
          { label: 'Total sesiuni finalizate', value: stats.totalSessions, color: '#5ca0e8' },
          { label: 'Fișiere încărcate', value: stats.filesPerSubject.reduce((s, f) => s + f.count, 0), color: '#9bacff' },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, minWidth: '140px',
            background: `linear-gradient(135deg, ${s.color}22, ${s.color}11)`,
            border: `1.5px solid ${s.color}44`,
            borderRadius: '14px',
            padding: '16px 20px',
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '6px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Bar chart */}
        <div style={cardStyle}>
          <p style={subtitleStyle}>Ore de studiu — ultimele 7 zile</p>
          <BarChart data={stats.studyByDay} />
        </div>

        {/* Pie chart */}
        <div style={cardStyle}>
          <p style={subtitleStyle}>Materiale per materie</p>
          <PieChart data={stats.filesPerSubject} />
        </div>
      </div>
    </div>
  );
};

export default StatisticiSection;
