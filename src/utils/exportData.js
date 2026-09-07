/**
 * Scoutceler Data Export Utilities
 * Supports: JSON export, CSV spreadsheet export, and clean Printable/PDF CV generation
 */

// Download any object as formatted JSON
export const downloadJson = (filename, data) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.json') ? filename : `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Download string content as CSV
export const downloadCsv = (filename, csvContent) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Convert single player profile to structured CSV
export const exportPlayerToCsv = (profile) => {
  if (!profile) return;
  const safe = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
  
  const headers = [
    'Full Name', 'Nickname', 'Gender', 'Nationality', 'Location', 'Age', 
    'Height (cm)', 'Weight (kg)', 'Primary Position', 'Secondary Position', 
    'Preferred Foot', 'Current Club', 'Previous Clubs', 'Academy', 'Jersey Number',
    'Market Value', 'Verification Tier', 'Scout Rating', 'Scout Confidence',
    'Speed', 'Acceleration', 'Agility', 'Strength', 'Stamina',
    'Finishing', 'Dribbling', 'Passing', 'Ball Control',
    'Vision', 'Composure', 'Leadership',
    'Bio', 'Achievements', 'Profile Link'
  ];

  const values = [
    safe(profile.fullName),
    safe(profile.nickname),
    safe(profile.gender),
    safe(profile.nationality),
    safe(`${profile.city || ''}, ${profile.state || ''}`),
    safe(profile.age),
    safe(profile.height),
    safe(profile.weight),
    safe(profile.primaryPosition),
    safe(profile.secondaryPosition),
    safe(profile.preferredFoot),
    safe(profile.currentClub),
    safe(profile.previousClubs),
    safe(profile.academy),
    safe(profile.jerseyNumber),
    safe(profile.marketValue),
    safe(profile.verification),
    safe(profile.rating),
    safe(profile.scoutConfidence),
    safe(profile.speed),
    safe(profile.acceleration),
    safe(profile.agility),
    safe(profile.strength),
    safe(profile.stamina),
    safe(profile.finishing),
    safe(profile.dribbling),
    safe(profile.passing),
    safe(profile.ballControl),
    safe(profile.vision),
    safe(profile.composure),
    safe(profile.leadership),
    safe(profile.bio),
    safe(profile.achievements),
    safe(profile.uid ? `${window.location.origin}/#/player/${profile.uid}` : '')
  ];

  const csv = headers.join(',') + '\n' + values.join(',');
  const filename = `${(profile.fullName || 'player').replace(/\s+/g, '_')}_football_cv.csv`;
  downloadCsv(filename, csv);
};

// Convert multiple talent profiles to CSV (for scouts / search / admin)
export const exportTalentListToCsv = (profiles, filename = 'scoutceler_talent_roster.csv') => {
  if (!profiles || !profiles.length) return;
  const safe = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

  const headers = [
    'Name', 'Age', 'Gender', 'Nationality', 'Position', 'Club', 
    'Verification', 'Rating', 'Market Value', 'Preferred Foot', 'Height (cm)', 'Profile URL'
  ];

  const rows = profiles.map(p => [
    safe(p.fullName),
    safe(p.age),
    safe(p.gender),
    safe(p.nationality),
    safe(p.primaryPosition),
    safe(p.currentClub),
    safe(p.verification),
    safe(p.rating),
    safe(p.marketValue),
    safe(p.preferredFoot),
    safe(p.height),
    safe(p.uid ? `${window.location.origin}/#/player/${p.uid}` : '')
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  downloadCsv(filename, csv);
};

// Generate and trigger clean Printable Football CV (Save as PDF)
export const printPlayerCv = (profile) => {
  if (!profile) return;

  const printWindow = window.open('', '_blank', 'width=900,height=1100');
  if (!printWindow) {
    alert('Please allow popups to download or print your Football CV.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${profile.fullName || 'Player'} - Scoutceler Football CV</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        body { background: #ffffff; color: #0f172a; padding: 40px; font-size: 14px; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #00d16c; padding-bottom: 24px; margin-bottom: 28px; }
        .logo-box { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; }
        .logo-box span { color: #00d16c; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: #e6fcf1; color: #00a854; border: 1px solid #00d16c; }
        .badge.elite { background: #fff7ed; color: #ea580c; border-color: #f97316; }
        .top-grid { display: grid; grid-template-columns: 160px 1fr; gap: 28px; margin-bottom: 30px; }
        .avatar { width: 160px; height: 160px; border-radius: 12px; object-fit: cover; border: 2px solid #e2e8f0; }
        .avatar-placeholder { width: 160px; height: 160px; border-radius: 12px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #64748b; font-weight: 600; }
        .title-name { font-size: 32px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
        .title-nickname { font-size: 16px; color: #64748b; font-style: italic; margin-bottom: 12px; }
        .quick-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; }
        .meta-tag { background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; }
        .section-title { font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin: 24px 0 14px; }
        .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .info-item { background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #f1f5f9; }
        .info-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 2px; }
        .info-val { font-size: 14px; font-weight: 600; color: #0f172a; }
        .bio-box { background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #00d16c; font-size: 14px; color: #334155; line-height: 1.6; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .stat-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #e2e8f0; }
        .stat-name { color: #475569; font-weight: 500; text-transform: capitalize; }
        .stat-score { font-weight: 700; color: #00a854; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }
        @media print {
          body { padding: 20px; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-box">SCOUT<span>CELER</span></div>
        <div>
          ${profile.verification && profile.verification !== 'none' 
            ? `<span class="badge ${profile.verification.toLowerCase()}">${profile.verification} Verified</span>`
            : '<span class="badge">Official Profile</span>'
          }
        </div>
      </div>

      <div class="top-grid">
        ${profile.profilePic 
          ? `<img src="${profile.profilePic}" class="avatar" alt="Player Photo" />`
          : `<div class="avatar-placeholder">No Photo</div>`
        }
        <div>
          <h1 class="title-name">${profile.fullName || 'Player Name'}</h1>
          ${profile.nickname ? `<div class="title-nickname">"${profile.nickname}"</div>` : ''}
          
          <div class="quick-meta">
            <span class="meta-tag">Position: ${profile.primaryPosition || 'Forward'}</span>
            <span class="meta-tag">Club: ${profile.currentClub || 'Free Agent'}</span>
            <span class="meta-tag">Market Value: €${profile.marketValue || 'N/A'}</span>
            <span class="meta-tag">Age: ${profile.age || 'N/A'}</span>
          </div>

          ${profile.bio ? `<div class="bio-box">${profile.bio}</div>` : ''}
        </div>
      </div>

      <div class="section-title">Physical & Tactical Specifications</div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">Nationality</div><div class="info-val">${profile.nationality || 'N/A'}</div></div>
        <div class="info-item"><div class="info-label">Gender</div><div class="info-val">${profile.gender || 'Male'}</div></div>
        <div class="info-item"><div class="info-label">Height / Weight</div><div class="info-val">${profile.height || '—'} cm / ${profile.weight || '—'} kg</div></div>
        <div class="info-item"><div class="info-label">Preferred Foot</div><div class="info-val">${profile.preferredFoot || 'Right'}</div></div>
        <div class="info-item"><div class="info-label">Secondary Position</div><div class="info-val">${profile.secondaryPosition || 'None'}</div></div>
        <div class="info-item"><div class="info-label">Academy / Development</div><div class="info-val">${profile.academy || 'N/A'}</div></div>
        <div class="info-item"><div class="info-label">Previous Clubs</div><div class="info-val">${profile.previousClubs || 'N/A'}</div></div>
        <div class="info-item"><div class="info-label">Jersey Number</div><div class="info-val">#${profile.jerseyNumber || '—'}</div></div>
        <div class="info-item"><div class="info-label">Overall Scout Rating</div><div class="info-val">${profile.rating || 75} / 100</div></div>
      </div>

      <div class="section-title">Scout Attribute Ratings</div>
      <div class="stats-grid">
        <div>
          <div class="stat-row"><span class="stat-name">Speed / Pace</span><span class="stat-score">${profile.speed || 70}</span></div>
          <div class="stat-row"><span class="stat-name">Acceleration</span><span class="stat-score">${profile.acceleration || 70}</span></div>
          <div class="stat-row"><span class="stat-name">Agility & Balance</span><span class="stat-score">${profile.agility || 70}</span></div>
          <div class="stat-row"><span class="stat-name">Finishing</span><span class="stat-score">${profile.finishing || 70}</span></div>
          <div class="stat-row"><span class="stat-name">Dribbling & Technique</span><span class="stat-score">${profile.dribbling || 70}</span></div>
        </div>
        <div>
          <div class="stat-row"><span class="stat-name">Passing Accuracy</span><span class="stat-score">${profile.passing || 70}</span></div>
          <div class="stat-row"><span class="stat-name">Ball Control</span><span class="stat-score">${profile.ballControl || 70}</span></div>
          <div class="stat-row"><span class="stat-name">Vision & Creativity</span><span class="stat-score">${profile.vision || 70}</span></div>
          <div class="stat-row"><span class="stat-name">Composure</span><span class="stat-score">${profile.composure || 70}</span></div>
          <div class="stat-row"><span class="stat-name">Strength & Physicality</span><span class="stat-score">${profile.strength || 70}</span></div>
        </div>
      </div>

      ${profile.achievements ? `
        <div class="section-title">Career Honours & Achievements</div>
        <div style="background: #f8fafc; padding: 14px; border-radius: 8px; color: #334155; font-size: 13px;">
          ${profile.achievements}
        </div>
      ` : ''}

      <div class="footer">
        <div>Generated by Scoutceler • Football's Fastest Talent Discovery Platform</div>
        <div>Verified CV: ${window.location.origin}/#/player/${profile.uid || ''}</div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
