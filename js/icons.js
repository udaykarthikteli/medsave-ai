/* MedSave AI — inline SVG icon library (no external icon fonts needed) */

const MS_ICONS = {
  logo: `<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="url(#g1)"/>
    <defs><linearGradient id="g1" x1="0" y1="0" x2="48" y2="48"><stop stop-color="#eccf74"/><stop offset="1" stop-color="#a6821a"/></linearGradient></defs>
    <path d="M24 12v24M12 24h24" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <circle cx="24" cy="24" r="7" fill="#fff" fill-opacity=".18"/></svg>`,

  stethoscope: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M6 3H4.5M14 3h1.5"/><path d="M18 9v3a6 6 0 0 1-12 0V9"/><circle cx="19" cy="16" r="2.3"/></svg>`,

  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-10-9.6C.4 6.8 2.6 3.6 6 3.4c2-.1 3.7 1 4.9 2.6C12.3 4.4 14 3.3 16 3.4c3.4.2 5.6 3.4 4 7-2.5 5-10 9.6-10 9.6z"/></svg>`,

  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.6-3 8.4-7 9-4-.6-7-4.4-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>`,

  dna: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3c0 6 10 6 10 12"/><path d="M17 21c0-6-10-6-10-12"/><path d="M8 7h8M7.5 12h9M8 17h8"/></svg>`,

  cross: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/></svg>`,

  pill: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="9" width="17" height="8" rx="4" transform="rotate(-30 12 13)"/><path d="M9.5 8.7l4.9 8.5"/></svg>`,

  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 1 1-3.5-6.6L21 4l-1 3.6A7.96 7.96 0 0 1 21 12z"/><path d="M8 11h8M8 14h5"/></svg>`,

  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>`,

  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,

  droplet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s7 7.6 7 12a7 7 0 0 1-14 0c0-4.4 7-12 7-12z"/></svg>`,

  apple: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8c2-3 6-2.6 6.5.5.6 3.8-2 9.5-5 9.5-1 0-1.5-.5-2.5-.5s-1.5.5-2.5.5c-3 0-5.7-6-5-9.7C3.9 5 8 4.7 10 7.3"/><path d="M12 8c-.3-2 .8-3.6 2.5-4.3"/></svg>`,

  run: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="15.5" cy="5" r="1.6" fill="currentColor" stroke="none"/><path d="M7 20l3-4 2-2-1-4-4 1M12 14l3 2 2 4M9 10l4-1 3 3"/></svg>`,

  brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8A3.5 3.5 0 0 0 8 18a3 3 0 0 0 5-2V6a3 3 0 0 0-3-2z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8A3.5 3.5 0 0 1 16 18"/></svg>`,

  syringe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3l3 3-2 2-3-3zM17 5l-9.5 9.5M4 20l2.6-.8a2 2 0 0 0 1-.55l7.7-7.7-3-3-7.7 7.7a2 2 0 0 0-.55 1L4 20z"/><path d="M13 6l3 3"/></svg>`,

  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>`,

  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5z"/><path d="M20 18H6.5A2.5 2.5 0 0 0 4 20.5"/></svg>`,

  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>`,

  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`,

  spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg>`,

  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>`,

  bot: `<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="8" width="16" height="12" rx="4" fill="#fff" fill-opacity=".95" stroke="#a6821a" stroke-width="1.3"/>
    <circle cx="9.5" cy="14" r="1.4" fill="#a6821a" class="eye"/><circle cx="14.5" cy="14" r="1.4" fill="#a6821a" class="eye"/>
    <rect class="mouth" x="9.5" y="17" width="5" height="1.4" rx=".7" fill="#c9a227"/>
    <path d="M12 8V5" stroke="#a6821a" stroke-width="1.3" stroke-linecap="round"/><circle cx="12" cy="4" r="1.3" fill="#c9a227"/>
    <rect x="1.5" y="12" width="2" height="4" rx="1" fill="#c9a227"/><rect x="20.5" y="12" width="2" height="4" rx="1" fill="#c9a227"/></svg>`,

  bot2: `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#fff8e7" stroke="#eccf74" stroke-width="1.5"/>
    <rect x="10" y="13" width="20" height="15" rx="6" fill="#fff" stroke="#c9a227" stroke-width="1.4"/>
    <circle cx="16" cy="20" r="1.8" fill="#a6821a"/><circle cx="24" cy="20" r="1.8" fill="#a6821a"/>
    <rect x="15" y="24" width="10" height="1.8" rx=".9" fill="#c9a227"/>
    <path d="M20 13V9" stroke="#a6821a" stroke-width="1.4" stroke-linecap="round"/><circle cx="20" cy="8" r="1.6" fill="#c9a227"/></svg>`,

  germ1: `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="12" fill="#f7e3a8" fill-opacity=".85" stroke="#dcb64a" stroke-width="1.2"/>
    <circle cx="16" cy="17" r="1.6" fill="#7c6013"/><circle cx="24" cy="17" r="1.6" fill="#7c6013"/>
    <path d="M16 25c1.3 1.4 6.7 1.4 8 0" stroke="#7c6013" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <g stroke="#dcb64a" stroke-width="1.4" stroke-linecap="round"><path d="M20 6v3M31 12l-2.5 1.7M31 28l-2.5-1.7M20 34v-3M9 28l2.5-1.7M9 12l2.5 1.7"/></g></svg>`,

  germ2: `<svg viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="11" ry="13" fill="#f0dca0" fill-opacity=".85" stroke="#c9a227" stroke-width="1.2"/>
    <circle cx="16" cy="17" r="1.5" fill="#7c6013"/><circle cx="24" cy="17" r="1.5" fill="#7c6013"/>
    <path d="M15 24q5 4 10 0" stroke="#7c6013" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <g stroke="#c9a227" stroke-width="1.3" stroke-linecap="round"><path d="M12 8l-2-2M28 8l2-2M10 20H6M34 20h-4M12 32l-2 2M28 32l2 2"/></g></svg>`,

  bluetooth: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 8.5 17 16l-6 5V3l6 5L6.5 15.5"/></svg>`,

  mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5M8.5 21.5h7"/></svg>`,

  micOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5.5A3 3 0 0 1 15 6.5v5c0 .4-.05.8-.14 1.2M15 13.5A3 3 0 0 1 9 12v-1"/><path d="M5 11a7 7 0 0 0 10.6 6M18.7 15.3A7 7 0 0 0 19 11"/><path d="M12 18v3.5M8.5 21.5h7M3 3l18 18"/></svg>`,

  volume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M16.5 9a4.5 4.5 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/></svg>`,

  volumeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M15.5 10.5l4 4M19.5 10.5l-4 4"/></svg>`,

  activity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 13h4l2.4-7 4 14 2.2-9.5L16.5 13H22"/></svg>`,

  gauge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15a8 8 0 1 1 16 0"/><path d="M12 15l4.5-5.5M4 15h1.4M18.6 15H20"/></svg>`,

  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 14.5 14.5 9.5"/><path d="M11 6.5 13 4.6a3.6 3.6 0 0 1 5.1 5.1L16.2 11.6M13 17.5l-2 1.9a3.6 3.6 0 0 1-5.1-5.1l1.9-1.9"/></svg>`,

  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 20h20L12 3z"/><path d="M12 9.5v4.2M12 17h.01"/></svg>`,

  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>`,

  waves: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c1.5-2.5 3-2.5 4.5 0s3 2.5 4.5 0 3-2.5 4.5 0 3 2.5 4.5 0"/><path d="M2 17c1.5-2.5 3-2.5 4.5 0s3 2.5 4.5 0 3-2.5 4.5 0 3 2.5 4.5 0"/></svg>`,

  expand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6"/></svg>`,
};

function msIcon(name){ return MS_ICONS[name] || ''; }
