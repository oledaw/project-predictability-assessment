// ─────────────────────────────────────────────
// scoring.js — pure functions; no DOM, no side effects
// ─────────────────────────────────────────────

import { AREAS, QUESTIONS, AREA_IMPACT_MAP, RISK_CONTENT, GLOBAL_RISK, THRESHOLDS } from './data.js';

/**
 * Computes per-area averages and overall average from a name→value answers map.
 * @param {Record<string, number>} answers
 * @returns {{ areaAvg: Record<string, number|null>, overallAvg: number, unanswered: number }}
 */
export function computeScores(answers) {
  const areaScores = Object.fromEntries(AREAS.map(a => [a.id, []]));
  let unanswered = 0;

  for (const q of QUESTIONS) {
    const val = answers[q.name];
    if (val != null) areaScores[q.area].push(val);
    else unanswered++;
  }

  const areaAvg = {};
  for (const [id, vals] of Object.entries(areaScores)) {
    areaAvg[id] = vals.length
      ? vals.reduce((sum, v) => sum + v, 0) / vals.length
      : null;
  }

  const answeredAvgs = Object.values(areaAvg).filter(v => v !== null);
  const overallAvg = answeredAvgs.length
    ? answeredAvgs.reduce((sum, v) => sum + v, 0) / answeredAvgs.length
    : 0;

  return { areaAvg, overallAvg, unanswered };
}

/**
 * Maps an overall average score to a level key.
 * @param {number} avg
 * @returns {'low'|'medium'|'high'|'vhigh'}
 */
export function classifyLevel(avg) {
  if (avg >= THRESHOLDS.SCORE_LOW)    return 'low';
  if (avg >= THRESHOLDS.SCORE_MEDIUM) return 'medium';
  if (avg >= THRESHOLDS.SCORE_HIGH)   return 'high';
  return 'vhigh';
}

/**
 * Resolves whether a weak area has "critical" or "weak" impact.
 * @param {string} areaId
 * @param {boolean} isCritical
 * @returns {string}
 */
function getAreaImpact(areaId, isCritical) {
  const map = AREA_IMPACT_MAP[areaId];
  return map ? (isCritical ? map.critical : map.weak) : 'delay';
}

/**
 * Builds the list of active risks based on area averages and overall score.
 * @param {Record<string, number|null>} areaAvg
 * @param {number} overallAvg
 * @returns {Array<{ title: string, impact: string, mitigation: string }>}
 */
export function buildActiveRisks(areaAvg, overallAvg) {
  const criticalAreaIds = Object.keys(areaAvg)
    .filter(id => areaAvg[id] !== null && areaAvg[id] < THRESHOLDS.CRITICAL_AREA);

  const risks = Object.keys(areaAvg)
    .filter(id => areaAvg[id] !== null && areaAvg[id] < THRESHOLDS.WEAK_AREA)
    .map(id => ({
      ...RISK_CONTENT[id],
      impact: getAreaImpact(id, criticalAreaIds.includes(id)),
    }));

  if (overallAvg < THRESHOLDS.GLOBAL_RISK) {
    risks.push(GLOBAL_RISK);
  }

  return risks;
}

/**
 * Returns a bar fill color for a given area average.
 * @param {number} avg
 * @returns {string} CSS color
 */
export function barColor(avg) {
  if (avg >= THRESHOLDS.SCORE_LOW)    return '#28a745';
  if (avg >= THRESHOLDS.SCORE_MEDIUM) return '#2980b9';
  if (avg >= THRESHOLDS.SCORE_HIGH)   return '#e67e22';
  return '#e74c3c';
}
