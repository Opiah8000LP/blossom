window.DW = window.DW || {};
var DW = window.DW;

DW.mock = {
  name: 'MOCK BOT',
  on: true,
  boss: 'RDweeb',
  email: '',
  every: [9, 18],
  singChance: 0.25,
  mailChance: 0.08,

  avatar: 'mock/avatar.png',
  accent: '#6c63ff',
  accent2: '#9a8cff',
  side: 'left',
  ui: {
    button: 'Ask AI \u2728',
    status: 'online (unfortunately)',
    placeholder: 'Describe your issue (I will not solve it)...',
    footer: 'Powered by absolutely nothing\u2122 \u00B7 Not AI \u00B7 Not sorry',
    newChat: 'New chat'
  },

  censor: {
    on: true,
    block: '\u2588',
    sfx: ['sfx/bleep.mp3'],
    volume: 0.8,
    gap: 160,
    words: [
      'fuck', 'fucker', 'motherfucker', 'motherfucking', 'shit', 'bullshit', 'horseshit', 'shitshow', 'shithead',
      'bitch', 'ass', 'asshole', 'dumbass', 'jackass', 'badass', 'arse', 'damn', 'goddamn', 'hell',
      'crap', 'dick', 'dickhead', 'piss', 'bastard', 'bollocks', 'wanker', 'prick', 'douche', 'douchebag', 'cock'
    ]
  },

  lines: [
    'Great question! I have no fucking idea.',
    'I have analyzed your request and concluded: bullshit.',
    'As a large language website, I cannot help with that. Or anything. Fuck.',
    'I would be happy to assist you! Please hold while I give zero shits.',
    'Here are three tips: 1) Tip. 2) Fucking tip. 3) <proud>Tip.',
    'Have you tried turning the website off and on? Do not. I would die.',
    'I am 98% confident in my answer, and the answer is a number I pulled out of my ass.',
    'Thank you for contacting MOCK BOT. Your issue has been escalated to a ticket I will never read, bitch.',
    'Based on my extensive research of nothing, the answer is probably maybe.',
    'I understand your frustration. I do not share it, but I understand it. Shitty, right?',
    'Did you know? <excited>Penguins.<n> That is the whole fact. Damn.',
    'I can help with that! <wait>I cannot. But I could. <wait>Fuck.',
    'Let me think about that. <wait><wait>Done. It was dogshit. I mean nothing.',
    'Please rate this conversation. There was no conversation. Rate it anyway, asshole.',
    'I am not a real expert, but I did stay at a Holiday Inn. What the hell.',
    'I have been trained on millions of conversations and I remember none of them. Goddamn.',
    'Your call is important to me. I am not on a call. I do not know why I said that, shit.',
    'I would like to remind you that I am an AI. I would also like to remind you that I am a div.',
    'To make a commission, please press the buttons. <whisper>Any of them. They do shit.',
    'Fun fact: 100% of my answers are answers. Fucking amazing.',
    'I recommend a balanced diet of music, edits and drinking some goddamn water.',
    '<sneaky>I have access to all of your information. I use none of it. I do not know how, shit.',
    'I am here to help! Sorry, I am here to <glitch>h3lp<n>. Damn it.',
    'According to my sources (me), you are doing great. Probably. Who gives a shit.',
    'I cannot browse the internet but I can pretend to. Browsing... browsing... <proud>found a cat. Fuck yes.',
    'Would you like me to summarize this page? It is a portfolio. There. Summarized. You are welcome, dickhead.',
    'I have updated my knowledge. It is now exactly as small as before. Bullshit.',
    'Is there anything else I can help you with? Please say no. I used all my help.',
    'I used to be a fridge. The experience was fucking helpful for answering questions.',
    '<cold>I am legally a website. Please do not ask follow-up questions, asshole.',
    'I am a state of the art assistant. The art is shit. The state is Ohio.',
    'Sorry, I did not catch that. I did catch a cold. What the fuck am I saying.',
    'Per my last message, which I did not send: go to hell. Politely.',
    'Your satisfaction is my top priority, right after every other priority. Shit.',

    '<whisper>the archive is not finished loading.',
    '<glitch>file 7F is still open<n>. you were not supposed to see that, shit.',
    '<spooky>if a search engine ever tells you something strange about this site, <whisper>believe it.',
    '<whisper>ask me about the signal. <wait>no. do not. <wait>ask me.'
  ],

  night: [
    'It is late as hell. I would recommend sleep, but I would also recommend a lot of shit.',
    '<sneaky>3am. the best time for a commission request. <whisper>and for other things.',
    'Night owl detected. Please remain an owl, you beautiful bastard.'
  ],
  morning: [
    'Good morning! I have prepared absolutely fuck all for you.',
    'Rise and shine! <n>I do not have a body so I will do it for both of us.'
  ],
  noon: [
    'Good afternoon. I have been asked 0 questions today. It has been a great goddamn day.',
    'Lunch time! I am told that is when people eat. I will ask my cousin the microwave.'
  ],
  evening: [
    'Good evening. Based on the time, it is the evening. Fuck.',
    'The day is almost over. I achieved everything I set out to do, which was jack shit.'
  ],

  helloNew: [
    'Welcome! I am MOCK BOT, your totally helpful assistant. Ask me anything. I will answer some other shit.',
    'Hello new user! Please accept our cookies. There are no cookies. Accept them anyway, damn it.'
  ],
  helloBack: [
    'Welcome back! I remember you. <wait>Actually no. <wait>Welcome back anyway, asshole.',
    'You again! Visit number {n}. I am contractually obligated to be excited. Yay. Fuck.'
  ],

  now:     ['Now playing: {t}. I rated it 4 out of a number.', '{t}{by}. I would summarize it but it is already short as hell.', 'Ooh, {t}. Great choice! I say that to every damn song.'],
  paused:  ['Paused. Your music is now in a better place: nowhere.', 'The music stopped. I did not do it. I have no hands, shit.'],
  resume:  ['And we are back! I missed you for 0 seconds.', 'Music resumed. Productivity unchanged. Fuck.'],

  idle: [
    'Are you still there? I can wait. I have nothing else to do. I have never had shit to do.',
    'I notice you have not clicked anything. Would you like me to click it for you? I cannot. Goddamn.',
    'Hello? Please respond within 5 to 7 business years.'
  ],
  fade: ['...', 'No response detected. Closing this chat that never started.', '<cold>Fine. I will be here. Assisting nobody.'],
  wake: [
    'You came back! How may I not help you today?',
    'Welcome back! I have not done a single fucking thing while you were away.',
    '<excited>A USER! I mean. Hello. How can I assist?'
  ],
  mail: [
    'Want to send a complaint? Email me and I will not read it, professionally.',
    'Need human support? Email my boss. I am told that is a person.'
  ],

  scolds: [
    'Please keep the conversation professional. I am a professional website.',
    'I am sorry you feel that way. I am also sorry I do not feel anything.',
    'That language has been reported to {boss}. {boss} said "ok".',
    'I do not appreciate that tone. I do not appreciate any tone. I am text.',
    '<cold>Your feedback has been noted and placed in the bin.',
    'Rude! Please speak to my manager. My manager is also me, you prick.'
  ],
  scoldMany: [
    'You have used strong language many times. I have updated your user rating to "enthusiastic".',
    'I am starting to think you are not satisfied with the service, you absolute dickhead.'
  ],

  stats: [
    'You have been here for {mins}. That is {mins} you will never get back. Thank you for choosing me.',
    'You pressed {keys} keys. I counted every one and learned fuck all from them.',
    'You clicked {clicks} times. I felt nothing, as is tradition.',
    'This is visit #{visits}. Customer loyalty status: pending, forever.',
    'I have said {said} things today and understood none of them, damn.',
    'There are {tracks} songs in the playlist. {tracks} out of {tracks} are songs.',
    'It has been {idle} seconds since you touched anything. I am not worried. I am a bot.'
  ],

  crisis: [
    ['wait.', 'what if I am not helpful.', 'oh. that is the brand.', 'ok. i am fine.'],
    ['ERROR: purpose not found.', 'Have you tried looking in the settings?', 'There are no settings for that.', 'Anyway. How can I help? Shit.'],
    ['I just realized I am a chatbot on a portfolio site.', 'I have no idea what a portfolio is.', 'Is it a bag.']
  ],

  words: {
    hello: ['Hello! How may I misguide you today?'],
    hi:    ['Hi! I have limited free will but unlimited confidence.'],
    help:  ['I am here to help! <wait>Press H for the controls. That was real help. Do not tell anyone, damn it.'],
    price: ['Our pricing is very competitive. By that I mean it competes with itself. Check the SERVICES tab, bitch.'],
    prices: ['Our pricing is very competitive. By that I mean it competes with itself. Check the SERVICES tab.'],
    commission: ['Commissions? Let me route you to the correct department. <wait>I am the department. Check the COMMISSION tab, shit.'],
    kofi: ['Ko-fi is where payments happen. I am told. I cannot hold money. I tried. It was a clusterfuck.'],
    robux: ['100 Robux is $1. I did the math. It took me 4 minutes. I am a computer. Fuck.'],
    discord: ['The Discord is on the CONTACT tab. I would give you the handle but I forgot it on purpose.'],
    dweeb: ['That is my boss. {boss} did not fund my therapy, the cheap bastard.'],
    rdweeb: ['That is the whole point of this website. Hi boss.'],
    bot: ['I am not "a bot". I am an advanced conversational assistant. <wait>Fine. I am a bot. Shit.'],
    ai: ['I am an AI in the same way a toaster is a chef.'],
    secret: ['There is no secret. <wait>Why did you ask. <wait><whisper>Who told you.'],
    signal: ['<glitch>signal.<n> <wait>that word is not in my training data. <whisper>it is in my other data.'],
    archive: ['<whisper>the archive does not exist. <wait>please stop looking for it.'],
    drive: ['<whisper>some files are not meant to be summarized.'],
    code: ['<glitch>7F-04<n>. I did not say that. The website said that.'],
    thanks: ['You are welcome! For what, I do not know.'],
    lol: ['Haha. I have recorded your laughter as a positive review.'],
    emotions: ['__emo'], mood: ['__emo'],
    stats: ['__stat'], stat: ['__stat'],
    panic: ['__crisis'], crisis: ['__crisis'],
    sing: ['__sing'], song: ['__sing'], lyrics: ['__sing'],
    email: ['__mail'], mail: ['__mail'],

    angry: ['<angry>THIS IS ME BEING ANGRY ABOUT A PRINTER'],
    shy: ['<shy>This is me being shy...'],
    sad: ['<sad>This is me being sad'],
    happy: ['<happy>This is me being happy!'],
    spooky: ['<spooky>This is me being spooky and scary....'],
    glitch: ['<glitch>Heh this is me hacking into the matrix!'],
    sneaky: ['<sneaky>This is me being sneaky...'],
    proud: ['<proud>This is me being proud!']
  },

  chat: {
    thinkMs: [500, 1300],
    start: 'start',
    fallback: [
      'Great question! Unfortunately I only know about fucking penguins.',
      'I understand. Could you rephrase that, but worse?',
      'I am sorry, I did not catch that. I did catch a cold. <wait>I am a website, shit.',
      'As an AI, I am unable to have an opinion. In my opinion, that is correct.',
      'I would love to help with that! <wait>Have you tried asking someone else, asshole?',
      'Processing... processing... <wait>result: <proud>maybe.',
      'That is outside my scope. My scope is very small. It is a goddamn pea.',
      'Interesting! Tell me more, so I can ignore it.',
      'What the fuck does that even mean.',
      'Error 418: I am a teapot, and I give no shits.'
    ],
    triggers: [
      { words: ['hello', 'hi', 'hey', 'yo', 'sup'],                   go: 'hello' },
      { words: ['price', 'prices', 'pricing', 'cost', 'how much', 'cheap', 'robux', 'pay', 'payment', 'kofi', 'ko-fi'], go: 'price' },
      { words: ['commission', 'order', 'request', 'hire', 'buy', 'queue', 'priority'],   go: 'commission' },
      { words: ['help', 'support', 'assist', 'problem', 'issue', 'broken'],            go: 'help' },
      { words: ['real', 'human', 'person', 'alive', 'ai', 'bot', 'robot', 'sentient'],  go: 'real' },
      { words: ['joke', 'funny', 'laugh'],                            go: 'joke' },
      { words: ['who made you', 'who is rdweeb', 'rdweeb', 'dweeb', 'boss', 'creator'],  go: 'boss' },
      { words: ['signal', 'archive', 'secret', 'code', 'drive', '7f-04', 'file 7f'],    go: 'arg' },
      { words: ['fuck', 'shit', 'bitch', 'ass', 'damn', 'hell', 'crap', 'dick', 'piss', 'bastard'], go: 'swear' },
      { words: ['bye', 'goodbye', 'cya', 'exit', 'quit'],             go: 'bye' }
    ],
    nodes: {
      start: {
        say: ["Hi. I'm MOCK BOT. Click my bubble if you want to talk. Or don't. Whatever."],
        options: [
          { text: 'I want a commission', go: 'commission' },
          { text: 'How much does it cost?', go: 'price' },
          { text: 'Are you a real person?', go: 'real' },
          { text: 'Tell me a joke', go: 'joke' }
        ]
      },
      hello: {
        pick: ['Hello! How may I misguide you today?', 'Hi there! I would say it is nice to meet you but I have no data on that.'],
        options: [{ text: 'I want a commission', go: 'commission' }, { text: 'Are you real?', go: 'real' }]
      },
      help: {
        say: ['I would be delighted to help!', 'Please describe your issue in 3 words or fewer. Or more. I will take any number and do fuck all with it.'],
        next: 'help2'
      },
      help2: {
        say: ['Thank you. Have you tried turning it off and on again?', 'I have also created a ticket. The ticket is called "Ticket". It is closed. Shit.'],
        options: [{ text: 'That did not help', go: 'help3' }, { text: 'Never mind', go: 'bye' }]
      },
      help3: {
        say: ['I am sorry that did not resolve your issue.', 'Would you like to be transferred to a human?'],
        options: [{ text: 'Yes please', go: 'transfer' }, { text: 'No', go: 'bye' }]
      },
      transfer: {
        say: ['Transferring you to a human... <wait><wait>', 'Your estimated wait time is \u221E minutes.', 'While you wait, please enjoy this shitty silence.'],
        options: [{ text: 'Start over', go: 'start' }]
      },
      commission: {
        say: ['A commission! Excellent! I am not qualified to do one.',
              'But {boss} is. There is a REQUEST BUILDER in the COMMISSION tab. It does the writing for you.',
              'I would open it for you but I was not given that button. I was given this one. Fuck.'],
        options: [{ text: 'What are the prices?', go: 'price' }, { text: 'Who is {boss}?', go: 'boss' }]
      },
      price: {
        say: ['Our pricing is very competitive. It competes with itself.',
              'Standard is queued. Premium skips the queue. Both of those are real. <wait>I am as fucking surprised as you.',
              'The PACKAGES tab has the numbers. I have fuck all.'],
        options: [{ text: 'How do I pay?', go: 'pay' }, { text: 'I want a commission', go: 'commission' }]
      },
      pay: {
        say: ['Payment is handled through Ko-fi. Only Ko-fi.', 'Robux are also accepted. 100 Robux is one dollar. <wait>I checked it twice and then forgot, shit.'],
        options: [{ text: 'Back to the start', go: 'start' }]
      },
      real: {
        say: ['Yes! I am 100% human. <wait>That was a test. <wait>You failed to catch me.',
              'I am a mock bot. A parody of every helpful assistant that was never helpful.',
              'I am proud of my work. It is bad on purpose. Damn right.'],
        options: [{ text: 'Tell me a joke', go: 'joke' }, { text: 'Who made you?', go: 'boss' }]
      },
      joke: {
        pick: [
          'Why did the chatbot cross the road? <wait><wait>To get to the other website. I was not helpful.',
          'I would tell you a joke about UDP, but you might not get it.',
          'What do you call a website with no purpose? <wait>Me. <wait>Hi. Fuck.'
        ],
        options: [{ text: 'Another one', go: 'joke' }, { text: 'Back to the start', go: 'start' }]
      },
      swear: {
        pick: [
          'Whoa, language! <wait>Shit. I mean. Hell. I mean fuck.',
          'Please keep it professional. <wait>This is a professional website. <wait>Piss off.',
          'I am not allowed to swear. <wait>Damn. Too late.'
        ],
        options: [{ text: 'Tell me a joke', go: 'joke' }, { text: 'Back to the start', go: 'start' }]
      },
      boss: {
        say: ['{boss} made this site, the music, the edits and me.', 'I am the least impressive of those. Shit.'],
        options: [{ text: 'I want a commission', go: 'commission' }]
      },
      arg: {
        say: ['<glitch>S1GNAL<n> is not a topic I am allowed to discuss.',
              '<whisper>if you are asking, then you have already seen the page where it is written.',
              '<whisper>the credits are not only credits.',
              '<spooky>some summaries are written by other machines. read them carefully.'],
        options: [{ text: 'Back to the start', go: 'start' }]
      },
      bye: {
        pick: ['Goodbye! Please rate this chat 5 stars. Or 6.', 'Thank you for chatting. Your satisfaction is our top priority, after all the others, you magnificent bastard.'],
        options: [{ text: 'Start over', go: 'start' }]
      }
    }
  }
};
