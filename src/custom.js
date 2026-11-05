// Kid-authored machines: parse JSON safely, strip anything script-like from SVG, validate, share via URL.
import { validate } from './engine.js';
export const TEMPLATE = {
  id: 'my-volcano-cake', title: 'Baking Soda Volcano', emoji: '🧁', initial: 'ready',
  parts: [
    { id: 'cup', label: 'Cup', job: 'holds the baking soda', svg: '<path d="M160 260 L175 160 H225 L240 260Z" fill="#94a3b8"/>' },
    { id: 'foam', label: 'Foam', job: 'is made of gas bubbles', svg: '<ellipse cx="200" cy="165" rx="40" ry="14" fill="#f472b6"/>', pose: { opacity: 0, scale: 0.4 } },
  ],
  states: {
    ready: { label: 'Ready', caption: 'Baking soda waits in the cup.', on: { POUR_VINEGAR: 'fizz' } },
    fizz: { label: 'Fizz!', caption: 'Vinegar meets baking soda and makes carbon dioxide gas. Foam everywhere!', on: { WAIT: 'done' }, parts: { foam: { opacity: 1, scale: 1.4, y: -14 } } },
    done: { label: 'All done', caption: 'The gas escapes and the foam settles down.', on: {}, parts: { foam: { opacity: 0.4, y: 40, scale: 1.6 } } },
  },
};
const ALLOWED = /^(g|path|rect|circle|ellipse|line|polyline|polygon|text|tspan)$/i;
export function sanitizeSvg(svg) {
  if (typeof svg !== 'string') return '';
  if (svg.length > 4000) svg = svg.slice(0, 4000);
  let bad = false;
  const out = svg.replace(/<\/?([a-zA-Z][\w-]*)([^>]*)>/g, (tag, name, attrs) => {
    if (!ALLOWED.test(name)) { bad = true; return ''; }
    if (/\son\w+\s*=|javascript:|href|style\s*=/i.test(attrs)) { bad = true; attrs = attrs.replace(/\s(on\w+|href|xlink:href|style)\s*=\s*("[^"]*"|'[^']*'|\S+)/gi, ''); }
    return tag.startsWith('</') ? `</${name}>` : `<${name}${attrs}>`;
  });
  return { svg: out.replace(/javascript:/gi, ''), stripped: bad };
}
export function parseMachine(text) {
  let m; try { m = JSON.parse(text); } catch (e) { return { errors: [`That is not valid JSON yet: ${e.message}`] }; }
  const errors = validate(m); const warnings = [];
  if (!errors.length) for (const p of m.parts) { const s = sanitizeSvg(p.svg); p.svg = s.svg; if (s.stripped) warnings.push(`part ${p.id}: removed unsafe SVG`); }
  return { machine: m, errors, warnings };
}
const b64 = (s) => (typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(s))) : Buffer.from(s, 'utf8').toString('base64'));
const unb64 = (s) => (typeof atob === 'function' ? decodeURIComponent(escape(atob(s))) : Buffer.from(s, 'base64').toString('utf8'));
export const encodeShare = (text) => b64(JSON.stringify(JSON.parse(text))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export const decodeShare = (s) => { try { return JSON.stringify(JSON.parse(unb64(s.replace(/-/g, '+').replace(/_/g, '/'))), null, 2); } catch { return JSON.stringify(TEMPLATE, null, 2); } };
