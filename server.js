/* CG Agency — server.js
   Express Backend: Auth, Projects, Messages, Chat,
   Invoices, Contact Form, Analytics, Settings */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const users = [{
  id: 1,
  email: 'mdsaidulislamratin967@gmail.com',
  password: 'demo123',
  name: 'MD Saidul Islam Ratin',
  company: 'CG Agency',
  role: 'client'
}];

const projects = [{
  id: 1,
  title: 'Brand Identity Redesign',
  status: 'active',
  progress: 75,
  due: 'Jun 15, 2026',
  team: ['JD', 'JS']
}, {
  id: 2,
  title: 'E-commerce Website',
  status: 'active',
  progress: 45,
  due: 'Jul 1, 2026',
  team: ['EC', 'JS']
}, {
  id: 3,
  title: 'Marketing Campaign',
  status: 'review',
  progress: 90,
  due: 'Jun 30, 2026',
  team: ['JD']
}, {
  id: 4,
  title: 'Mobile App Design',
  status: 'active',
  progress: 20,
  due: 'Aug 10, 2026',
  team: ['JS']
}];

const invoices = [{
  id: '#INV-2026-08',
  project: 'Brand Identity',
  amount: '$4,500',
  date: 'May 15',
  status: 'paid'
}, {
  id: '#INV-2026-07',
  project: 'E-commerce Site',
  amount: '$8,000',
  date: 'Apr 30',
  status: 'paid'
}, {
  id: '#INV-2026-09',
  project: 'Marketing Campaign',
  amount: '$6,000',
  date: 'Jun 1',
  status: 'pending'
}, {
  id: '#INV-2026-10',
  project: 'Mobile App Design',
  amount: '$6,000',
  date: 'Jun 15',
  status: 'upcoming'
}];

const chatHistory = {};
const botReplies = {
  services: "We offer Brand Strategy, UI/UX Design, Web Development, Digital Marketing, SEO, and Motion Design. Which interests you most? 🎨",
  pricing: "Projects start from $1,500. Pricing depends on scope — want a custom quote? Share your project details! 💬",
  project: "Exciting! Fill out our contact form or email mdsaidulislamratin967@gmail.com. We'll respond within 4 hours! ⚡",
  contact: "Reach us at mdsaidulislamratin967@gmail.com or call +880 1407-948498. Based in Bangladesh, working globally! 🌍",
  portfolio: "Check our Portfolio section for selected projects — branding, web apps, campaigns, and more! ✨",
  team: "Our team: Jane Doe (Creative Director), John Smith (Lead Designer), Emily Clark (Strategy Director) and more talented creatives! 👥",
  default: "Thanks for your message! For detailed inquiries email mdsaidulislamratin967@gmail.com. We'd love to work with you! 🚀"
};

function getBotReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('service') || m.includes('what do')) return botReplies.services;
  if (m.includes('price') || m.includes('cost') || m.includes('much') || m.includes('budget')) return botReplies.pricing;
  if (m.includes('start') || m.includes('project') || m.includes('hire')) return botReplies.project;
  if (m.includes('contact') || m.includes('email') || m.includes('phone')) return botReplies.contact;
  if (m.includes('portfolio') || m.includes('work')) return botReplies.portfolio;
  if (m.includes('team') || m.includes('who')) return botReplies.team;
  return botReplies.default;
}

/* AUTH */
app.post('/api/auth/login', (req, res) => {
  const {
    email,
    password
  } = req.body;
  if (!email || !password) return res.status(400).json({
    success: false,
    message: 'Email and password required.'
  });
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Use mdsaidulislamratin967@gmail.com / demo123'
  });
  const {
    password: _,
    ...safeUser
  } = user;
  res.json({
    success: true,
    user: safeUser,
    token: 'demo-token-' + user.id,
    message: 'Login successful!'
  });
});

app.post('/api/auth/register', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    company
  } = req.body;
  if (!firstName || !email || !password) return res.status(400).json({
    success: false,
    message: 'Required fields missing.'
  });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({
    success: false,
    message: 'Invalid email address.'
  });
  if (password.length < 8) return res.status(400).json({
    success: false,
    message: 'Password must be at least 8 characters.'
  });
  if (users.find(u => u.email === email)) return res.status(409).json({
    success: false,
    message: 'Email already registered.'
  });
  const newUser = {
    id: users.length + 1,
    email,
    password,
    name: `${firstName} ${lastName}`,
    company: company || '',
    role: 'client'
  };
  users.push(newUser);
  const {
    password: _,
    ...safeUser
  } = newUser;
  res.status(201).json({
    success: true,
    user: safeUser,
    token: 'demo-token-' + newUser.id,
    message: 'Account created successfully!'
  });
});

app.post('/api/auth/logout', (req, res) => res.json({
  success: true,
  message: 'Logged out.'
}));

/* PROJECTS */
app.get('/api/projects', (req, res) => res.json({
  success: true,
  data: projects
}));
app.post('/api/projects', (req, res) => {
  const {
    title,
    status,
    progress,
    due
  } = req.body;
  if (!title) return res.status(400).json({
    success: false,
    message: 'Project title required.'
  });
  const project = {
    id: projects.length + 1,
    title,
    status: status || 'active',
    progress: progress || 0,
    due: due || 'TBD',
    team: []
  };
  projects.push(project);
  res.status(201).json({
    success: true,
    data: project
  });
});

/* CHAT */
app.post('/api/chat', (req, res) => {
  const {
    message,
    sessionId
  } = req.body;
  if (!message) return res.status(400).json({
    success: false,
    message: 'Message required.'
  });
  const sid = sessionId || 'default';
  if (!chatHistory[sid]) chatHistory[sid] = [];
  chatHistory[sid].push({
    role: 'user',
    text: message,
    time: new Date().toISOString()
  });
  const reply = getBotReply(message);
  chatHistory[sid].push({
    role: 'bot',
    text: reply,
    time: new Date().toISOString()
  });
  if (chatHistory[sid].length > 50) chatHistory[sid] = chatHistory[sid].slice(-50);
  setTimeout(() => {
    res.json({
      success: true,
      reply,
      history: chatHistory[sid]
    });
  }, 600 + Math.random() * 500);
});

/* INVOICES */
app.get('/api/invoices', (req, res) => res.json({
  success: true,
  data: invoices
}));
app.post('/api/invoices/:id/pay', (req, res) => {
  const inv = invoices.find(i => i.id === req.params.id);
  if (!inv) return res.status(404).json({
    success: false,
    message: 'Invoice not found.'
  });
  inv.status = 'paid';
  res.json({
    success: true,
    data: inv,
    message: 'Payment processed!'
  });
});

/* CONTACT */
app.post('/api/contact', (req, res) => {
  const {
    name,
    email,
    subject,
    budget,
    message
  } = req.body;
  if (!name || !email || !message) return res.status(400).json({
    success: false,
    message: 'Name, email, and message are required.'
  });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({
    success: false,
    message: 'Invalid email address.'
  });
  console.log('Contact form:', {
    name,
    email,
    subject,
    budget,
    message
  });
  res.json({
    success: true,
    message: `Thanks ${name}! We'll reply within 4 hours.`
  });
});

/* ANALYTICS */
app.get('/api/analytics', (req, res) => {
  res.json({
    success: true,
    data: {
      traffic: [30, 45, 35, 60, 50, 75, 65, 80, 72, 90, 85, 95],
      conversion: 4.7,
      reach: '128K',
      seo: 92
    }
  });
});

/* SETTINGS */
app.put('/api/settings/profile', (req, res) => {
  const {
    name,
    email,
    company
  } = req.body;
  res.json({
    success: true,
    message: 'Profile updated successfully!',
    data: {
      name,
      email,
      company
    }
  });
});

/* FALLBACK */
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`✅ CG Agency server running at http://localhost:${PORT}`));
