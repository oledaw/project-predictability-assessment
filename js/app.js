// ─────────────────────────────────────────────
// app.js — DOM wiring; imports everything else
// ─────────────────────────────────────────────

import { QUESTIONS }                      from './data.js';
import { computeScores, buildActiveRisks } from './scoring.js';
import { renderFormContent, renderResult } from './render.js';

// ── Form setup ──────────────────────────────────────────────────────────────

function buildForm() {
  const form = document.getElementById('form');
  form.innerHTML = renderFormContent(QUESTIONS);

  // Highlight selected radio option
  form.addEventListener('change', e => {
    if (e.target.type !== 'radio') return;
    const group = e.target.closest('.options');
    group.querySelectorAll('label').forEach(l => { l.className = ''; });
    e.target.closest('label').classList.add(`selected-${e.target.value}`);
  });

  document.getElementById('btnCalculate').addEventListener('click', handleCalculate);
}

// ── Calculate ───────────────────────────────────────────────────────────────

function readAnswers() {
  const answers = {};
  for (const q of QUESTIONS) {
    const checked = document.querySelector(`input[name="${q.name}"]:checked`);
    if (checked) answers[q.name] = parseInt(checked.value, 10);
  }
  return answers;
}

function handleCalculate() {
  const answers = readAnswers();

  if (Object.keys(answers).length === 0) {
    alert('Uzupełnij co najmniej jedno pytanie.');
    return;
  }

  const { areaAvg, overallAvg, unanswered } = computeScores(answers);
  const activeRisks = buildActiveRisks(areaAvg, overallAvg);
  const notes = document.getElementById('notes').value.trim();

  const resultEl = document.getElementById('result');
  resultEl.style.display = 'block';
  resultEl.innerHTML = renderResult({ areaAvg, overallAvg, unanswered, activeRisks, notes });
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('btnCopy').addEventListener('click', handleCopyJSON);
}

function handleCopyJSON() {
  const text = document.getElementById('jsonOutput')?.innerText ?? '';
  navigator.clipboard.writeText(text).then(() => alert('JSON skopiowany do schowka'));
}

// ── Tooltips ─────────────────────────────────────────────────────────────────
// Use a single delegated listener on the form container.
// Guard with `instanceof Element` before calling `.closest()` — the capture
// phase can fire on non-Element nodes (document, window) which don't have it.

function adjustTooltip(wrap) {
  const box = wrap.querySelector('.tooltip-box');
  if (!box) return;

  // Reset to default position
  box.style.left      = '26px';
  box.style.right     = 'auto';
  box.style.transform = 'translateY(-50%)';

  const { right } = box.getBoundingClientRect();
  if (right > window.innerWidth - 8) {
    box.style.left      = 'auto';
    box.style.right     = '0';
    box.style.transform = 'translateY(-50%)';
  }
}

function initTooltips() {
  const container = document.getElementById('form');

  // mouseover bubbles (unlike mouseenter), so one listener handles all tooltips
  container.addEventListener('mouseover', e => {
    if (!(e.target instanceof Element)) return;
    const wrap = e.target.closest('.tooltip-wrap');
    if (wrap) adjustTooltip(wrap);
  });

  container.addEventListener('focusin', e => {
    if (!(e.target instanceof Element)) return;
    const wrap = e.target.closest('.tooltip-wrap');
    if (wrap) adjustTooltip(wrap);
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  buildForm();
  initTooltips();
});
