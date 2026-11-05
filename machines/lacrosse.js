export default {
  id: 'lacrosse', title: 'Lacrosse: Fast Break', emoji: '🥍', topic: 'Sports',
  blurb: 'How a save turns into a 4-on-3 fast break: clear, outlet, dodge, and finish.',
  initial: 'save',
  parts: [
    { id: 'field', label: 'Field', svg: '<rect x="30" y="40" width="340" height="220" fill="#14532d"/><rect x="30" y="40" width="340" height="220" fill="none" stroke="#86efac" stroke-width="3"/><circle cx="200" cy="150" r="24" fill="none" stroke="#86efac" stroke-width="2"/><path d="M200 40 V270" stroke="#86efac" stroke-width="2"/><path d="M130 40 V270 M270 40 V270" stroke="#86efac" stroke-width="1.5" stroke-dasharray="6 4" opacity=".7"/><circle cx="70" cy="150" r="28" fill="none" stroke="#5eead4" stroke-width="2" opacity=".85"/><circle cx="330" cy="150" r="28" fill="none" stroke="#5eead4" stroke-width="2" opacity=".85"/><rect x="30" y="120" width="18" height="60" fill="#e2e8f0"/><rect x="352" y="120" width="18" height="60" fill="#e2e8f0"/><text x="200" y="36" text-anchor="middle" fill="#86efac" font-size="11" font-weight="700">restraining</text>' },
    { id: 'goalie', label: 'Goalie', job: 'makes the save and starts the clear', svg: '<circle cx="60" cy="150" r="12" fill="#0f766e" stroke="#5eead4" stroke-width="2"/><text x="60" y="154" text-anchor="middle" fill="#ccfbf1" font-size="11" font-weight="700">G</text><rect x="72" y="140" width="14" height="6" fill="#5eead4"/>', explode: [-20, 0] },
    { id: 'lblG', label: 'Goalie label',
      svg: '<text x="80" y="160" text-anchor="middle" fill="#86efac" font-size="11" font-weight="700">G</text>' },
    { id: 'lblA', label: 'Attack label',
      svg: '<text x="300" y="120" text-anchor="middle" fill="#fde68a" font-size="11" font-weight="700">A</text>' },
    { id: 'outlet', label: 'Outlet defender', job: 'catches the clear and pushes the break', svg: '<circle cx="120" cy="180" r="10" fill="#0d9488" stroke="#fef08a" stroke-width="1.5"/><text x="120" y="184" text-anchor="middle" fill="#fef08a" font-size="11" font-weight="700">6</text>', explode: [-10, 25] },
    { id: 'attack1', label: 'Attacker', job: 'fills a lane and finishes the break', svg: '<circle cx="240" cy="120" r="10" fill="#0f766e" stroke="#fef08a" stroke-width="1.5"/><text x="240" y="124" text-anchor="middle" fill="#fef08a" font-size="11" font-weight="700">1</text>', explode: [20, -25] },
    { id: 'attack2', label: 'Far-side attacker', job: 'stretches the defense to the far pipe', svg: '<circle cx="260" cy="200" r="10" fill="#0f766e" stroke="#fef08a" stroke-width="1.5"/><text x="260" y="204" text-anchor="middle" fill="#fef08a" font-size="11" font-weight="700">2</text>', explode: [30, 25] },
    { id: 'defense', label: 'Trailing defense', job: 'scrambles back in a 3-person rotate', svg: '<g fill="#b45309"><circle cx="200" cy="150" r="8"/><circle cx="230" cy="170" r="8"/><circle cx="210" cy="130" r="8"/></g>' },
        { id: 'lblCrease', label: 'Crease label',
      svg: '<text x="340" y="150" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="700">crease</text>' },
{