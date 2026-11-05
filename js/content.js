window.DW = window.DW || {};
var DW = window.DW;

DW.profile = {
  name: 'RDweeb',
  tagline: 'Music / Websites / Video / Images / Games',
  status: 'COMMISSIONS OPEN',
  discord: 'rdweeb',
  credit: 'Made by RDweeb (https://rdweeb.xyz/)'
};

DW.pricing = {
  currency: '$',
  robuxPerUsd: 100,
  payment: 'Ko-fi',
  robuxNote: '',
  tiers: {
    standard: { name: 'STANDARD', tag: 'QUEUED',      perAsset: 1, freeRevisions: 3, extraRevision: 1, plus: true, credit: true,  queue: 'Goes in the queue. Done in order.' },
    premium:  { name: 'PREMIUM',  tag: 'PRIORITIZED', perAsset: 3, freeRevisions: 3, extraRevision: 1, plus: true, credit: false, queue: 'Skips the queue. Done first.' }
  }
};

DW.services = [
  { id: 'music',   name: 'MUSIC & SOUND PRODUCTION', icon: 'audio',    open: true,  blurb: 'Music, audio tags and sound production.' },
  { id: 'website', name: 'WEBSITE CREATION',         icon: 'projects', open: true,  blurb: 'Website creation.' },
  { id: 'video',   name: 'VIDEO EDITING',            icon: 'clips',    open: true,  blurb: 'Video editing.' },
  { id: 'image',   name: 'IMAGE EDITING',            icon: 'gallery',  open: true,  blurb: 'Image editing.' },
  { id: 'game',    name: 'GAME DEVELOPMENT',         icon: 'games',    open: true,  blurb: 'Game development.' },
  { id: 'art',     name: 'ART COMMISSIONS',          icon: 'art',      open: false, blurb: 'Coming soon.' }
];

DW.works = {
  count: { music: 6, videos: 4, images: 6 },
  info: {},
  websites: [
    { title: 'DWEEB RECORDS', url: 'https://rdweeb.xyz/' }
  ],
  games: []
};

DW.faq = [
  { q: 'What is the difference between Standard and Premium?',
    a: 'Standard is queued and done in order. Premium is prioritized and done first. Premium does not require credit.' },
  { q: 'How do revisions work?',
    a: 'Revisions are free up to the limit on the Packages tab. Each extra revision costs extra.' },
  { q: 'Do I have to credit you?',
    a: 'Standard: yes. Premium: no. The credit line is on the Credits page.' },
  { q: 'How do I pay?',
    a: 'Only through Ko-fi. Robux are also accepted at $1 = 100 Robux.' },
  { q: 'Can I commission art?',
    a: 'Not yet. Art commissions are coming soon.' }
];

DW.termsExtra = [];

DW.channels = [
  { id: 'kofi',       name: 'KO-FI',      note: 'Payments and commission DMs', handle: '' },
  { id: 'discord',    name: 'DISCORD',    note: 'Chat and commission DMs',     handle: DW.profile.discord, copy: true },
  { id: 'youtube',    name: 'YOUTUBE',    note: 'Videos and edits' },
  { id: 'youtube2',   name: 'YOUTUBE 2',  note: 'Second channel' },
  { id: 'tiktok',     name: 'TIKTOK',     note: 'Short clips' },
  { id: 'tiktok2',    name: 'TIKTOK 2',   note: 'Second account' },
  { id: 'soundcloud', name: 'SOUNDCLOUD', note: 'Music' },
  { id: 'roblox',     name: 'ROBLOX',     note: 'Games and Robux' },
  { id: 'github',     name: 'GITHUB',     note: 'Source code' },
  { id: 'twitter',    name: 'X / TWITTER', note: 'Updates' },
  { id: 'instagram',  name: 'INSTAGRAM',  note: 'Pictures' },
  { id: 'contact',    name: 'CONTACT PAGE', note: 'The old contact site' }
];

DW.credits = {
  items: [
    { kind: 'inspiration', part: 'The whole menu look (cross media bar)', from: 'The PSP / PS3 XMB',
      by: 'Sony Interactive Entertainment', url: '',
      license: 'Design inspiration only. No Sony code or assets are used on this site.' },
    { kind: 'service', part: 'Visitor counter (the eyes at the top)', from: 'GoatCounter',
      by: 'Martin Tournoij', url: 'https://www.goatcounter.com/',
      license: 'Counts visits only. No cookies.' },
    { kind: 'music', part: 'The background music playlist', from: 'Every song in the player',
      by: 'Their artists', url: '',
      license: 'Shown with credit as a playlist of music I like. Not mine, not for download.' }
  ],
  trademark: 'PlayStation, PSP, PS1, PS2, PS3 and XMB are trademarks of Sony Interactive Entertainment. This site is a fan-made tribute to that era and is not affiliated with or endorsed by Sony.'
};

DW.license = {
  name: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
  link: 'https://creativecommons.org/licenses/by/4.0/',
  summary: 'All of my original work on this site (the icons, the design, the code and the other things I made) belongs to me and is free to use as long as you credit me.',
  credit: 'Made by RDweeb (https://rdweeb.xyz/), licensed under CC BY 4.0',
  not: [
    'The names and branding: DWEEB RECORDS, DWEEB//OS and RDweeb are mine. Do not use them as your own.',
    'The music in the player belongs to the artists who made it.',
    'Anything listed under Third-party on this page keeps its own licence.'
  ],
  commission: 'Commissioned work: Standard packages require credit to RDweeb. Premium packages do not.'
};

DW.arg = {
  whisper: 'SIGNAL 7F-04: summaries leave out what matters. the missing file is kept here: PASTE_DRIVE_LINK_HERE',
  show: true
};
