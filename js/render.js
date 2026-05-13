// ─────────────────────────────────────────────
// render.js — HTML string builders; no DOM reads/writes
// ─────────────────────────────────────────────

import { AREAS, LEVEL_META, IMPACT_META, THRESHOLDS } from './data.js';
import { classifyLevel, barColor } from './scoring.js';

// ── Form ────────────────────────────────────────────────────────────────────

function renderOption(o, questionName) {
  return `<label>
    <input type="radio" name="${questionName}" value="${o.value}">
    <span>${o.text}</span>
  </label>`;
}

function renderQuestion(q) {
  return `
    <div class="question" data-area="${q.area}">
      <div class="question-label-row">
        <span class="question-label">${q.label}</span>
        <div class="tooltip-wrap">
          <button type="button" class="tooltip-btn" tabindex="0">?</button>
          <div class="tooltip-box">${q.tooltip}</div>
        </div>
      </div>
      <div class="question-context">${q.context}</div>
      <div class="options">
        ${q.options.map(o => renderOption(o, q.name)).join('')}
      </div>
    </div>`;
}

function renderSection(area, questions) {
  const sectionQuestions = questions.filter(q => q.area === area.id);
  return `
    <div class="section">
      <div class="section-header">
        <span class="icon">${area.icon}</span>
        <h2>${area.label}</h2>
      </div>
      <div class="section-body">
        ${sectionQuestions.map(renderQuestion).join('')}
      </div>
    </div>`;
}

/**
 * Renders the complete form interior (sections + notes + submit button).
 * @param {import('./data.js').Question[]} questions
 * @returns {string}
 */
export function renderFormContent(questions) {
  const sections = AREAS.map(area => renderSection(area, questions)).join('');
  return `
    ${sections}
    <div class="notes-section">
      <label for="notes">💬 Dodatkowe uwagi</label>
      <textarea id="notes" placeholder="Opisz największe źródła niepewności lub dodatkowy kontekst projektu…"></textarea>
    </div>
    <button type="button" class="btn-calculate" id="btnCalculate">▶ Oblicz ocenę nieprzewidywalności</button>`;
}

// ── Result ──────────────────────────────────────────────────────────────────

function renderAreaBars(areaAvg) {
  const rows = AREAS
    .filter(a => areaAvg[a.id] !== null)
    .map(a => {
      const avg = areaAvg[a.id];
      const pct = ((avg - 1) / 4 * 100).toFixed(1);
      return `
        <div class="bar-row">
          <div class="bar-label">${a.icon} ${a.label}</div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${pct}%; background:${barColor(avg)};"></div>
          </div>
          <div class="bar-val">${avg.toFixed(1)}</div>
        </div>`;
    })
    .join('');

  return `<div class="area-bars"><h3>Oceny obszarów</h3>${rows}</div>`;
}

function renderRiskTable(risks) {
  if (risks.length === 0) {
    return `<div class="no-risks">✅ Brak zidentyfikowanych obszarów wysokiego ryzyka. Utrzymaj dotychczasowe praktyki.</div>`;
  }

  const rows = risks
    .map(r => {
      const meta = IMPACT_META[r.impact];
      return `
        <tr>
          <td><strong>${r.title}</strong></td>
          <td><span class="impact-badge ${meta.cssClass}">${meta.label}</span></td>
          <td>${r.mitigation}</td>
        </tr>`;
    })
    .join('');

  return `
    <div class="risk-table-scroll">
      <table>
        <thead>
          <tr>
            <th style="width:30%">Ryzyko</th>
            <th style="width:18%">Wpływ</th>
            <th>Co zrobić</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function buildResultJSON({ areaAvg, overallAvg, unanswered, activeRisks, notes }) {
  return {
    score:         parseFloat(overallAvg.toFixed(2)),
    level:         LEVEL_META[classifyLevel(overallAvg)].label,
    levelClass:    LEVEL_META[classifyLevel(overallAvg)].cssClass,
    unanswered,
    areas:         areaAvg,
    weakAreas:     Object.keys(areaAvg).filter(k => areaAvg[k] !== null && areaAvg[k] < THRESHOLDS.WEAK_AREA),
    criticalAreas: Object.keys(areaAvg).filter(k => areaAvg[k] !== null && areaAvg[k] < THRESHOLDS.CRITICAL_AREA),
    risks:         activeRisks.map(({ title, impact, mitigation }) => ({ title, impact, mitigation })),
    notes:         notes || null,
    date:          new Date().toISOString().split('T')[0],
  };
}

/**
 * Renders the full result section HTML.
 * @param {{ areaAvg, overallAvg, unanswered, activeRisks, notes }} params
 * @returns {string}
 */
export function renderResult({ areaAvg, overallAvg, unanswered, activeRisks, notes }) {
  const level = classifyLevel(overallAvg);
  const meta  = LEVEL_META[level];

  const warnHtml = unanswered > 0
    ? `<div class="unanswered-warn">⚠️ Pominięto <strong>${unanswered}</strong> pytanie(a) – wynik jest szacunkowy.</div>`
    : '';

  const notesHtml = notes
    ? `<div class="notes-context"><strong>💬 Dodatkowy kontekst:</strong><br>${notes.replace(/\n/g, '<br>')}</div>`
    : '';

  const json = buildResultJSON({ areaAvg, overallAvg, unanswered, activeRisks, notes });

  return `
    ${warnHtml}
    <div class="result-header ${meta.cssClass}">
      <div class="badge">${meta.badge}</div>
      <div class="label-text">
        <h2>${meta.label}</h2>
        <p>${meta.desc}</p>
      </div>
      <div class="score-box">
        <div class="score-num">${overallAvg.toFixed(2)}</div>
        <div class="score-label">/ 5.00 śr. ocena</div>
      </div>
    </div>
    ${renderAreaBars(areaAvg)}
    <div class="risk-table-wrap">
      <h3>⚠️ Zidentyfikowane ryzyka i rekomendacje</h3>
      ${renderRiskTable(activeRisks)}
    </div>
    <div class="json-section">
      <button class="btn-copy" id="btnCopy">📋 Kopiuj JSON</button>
      <pre class="json-output" id="jsonOutput">${JSON.stringify(json, null, 2)}</pre>
    </div>
    ${notesHtml}`;
}
