// Printable worksheet: steps to put in order + part-matching + the quiz, with an answer key.
import { mainPath } from './engine.js'; import { makeQuiz, shuffle, rng } from './quiz.js';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function worksheet(m, seed = 1) {
  const r = rng(seed), path = mainPath(m), steps = shuffle(path, r);
  // Cap part-matching rows to alphabet length (F10) — prefer parts that have jobs.
  const jobs = m.parts.filter((p) => p.job).slice(0, LETTERS.length);
  const shuffledJobs = shuffle(jobs, r), quiz = makeQuiz(m, seed, 4);
  const letters = LETTERS;
  const html = `<article class="sheet"><h1>${m.emoji} ${esc(m.title)}: How it works</h1><p>Name: ____________________ Date: __________</p>
<h2>1. Put the steps in order (write 1, 2, 3…)</h2><ul class="order">${steps.map((s) => `<li>____ ${esc(m.states[s].label)}</li>`).join('')}</ul>
<h2>2. Match each part to its job</h2><table><tr><th>Part</th><th>Letter</th><th>Job</th></tr>${jobs.map((p, i) => `<tr><td>${esc(p.label)}</td><td>____</td><td>${letters[i]}. ${esc(shuffledJobs[i].job)}</td></tr>`).join('')}</table>
<h2>3. Quick quiz</h2><ol>${quiz.map((q) => `<li>${esc(q.prompt)}<br>${q.choices.map((c, j) => `○ ${letters[j]}. ${esc(c)}`).join('&nbsp;&nbsp; ')}</li>`).join('')}</ol>
<details class="key"><summary>Answer key</summary><p>Order: ${path.map((s) => esc(m.states[s].label)).join(' → ')}</p><p>Match: ${jobs.map((p) => `${esc(p.label)} = ${letters[shuffledJobs.indexOf(p)]}`).join(', ')}</p><p>Quiz: ${quiz.map((q, i) => `${i + 1}${letters[q.answer]}`).join(' ')}</p></details></article>`;
  return { html, answer: { order: path, match: jobs.map((p) => letters[shuffledJobs.indexOf(p)]), quiz: quiz.map((q) => q.answer) } };
}
