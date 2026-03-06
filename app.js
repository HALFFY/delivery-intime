/* ══════════════════════════════════════════════
   Delivery In-time — Application Logic
   ══════════════════════════════════════════════ */

/* ─── API Configuration ───────────────────────── */
const API_BASE = 'https://vuqyspp9ek.execute-api.us-east-1.amazonaws.com/prod';

async function loadOrders()    { return fetch(`${API_BASE}/orders`).then(r=>r.json()); }
async function loadFleet()     { return fetch(`${API_BASE}/fleet`).then(r=>r.json()); }
async function loadDrivers()   { return fetch(`${API_BASE}/drivers`).then(r=>r.json()); }
async function loadDispatches(){ return fetch(`${API_BASE}/dispatch`).then(r=>r.json()); }

/* ─── NAVIGATION ─────────────────────────────── */
function navigateTo(page) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  const navItem = document.querySelector(`[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');

  document.querySelectorAll('.page-view').forEach(v => {
    v.classList.remove('active');
    v.style.display = 'none';
  });

  const view = document.getElementById(`page-${page}`);
  if (view) {
    view.classList.add('active');
    view.style.display = 'flex';
    initPage(page);
  }
}

function initPage(page) {
  if (page === 'dashboard') initDashboard();
  if (page === 'orders')    initOrders();
  if (page === 'fleet')     initFleet();
  if (page === 'drivers')   initDrivers();
  if (page === 'billing')   initBillingChart();
  if (page === 'reports')   initReports();
  if (page === 'dispatch')  initDispatch();
}

/* ─── HELPERS ─────────────────────────────────── */
function statusPill(s) {
  return `<span class="status-pill ${s}">${s.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>`;
}

function fuelBar(pct) {
  const col = pct > 50 ? 'var(--success)' : pct > 25 ? 'var(--warning)' : 'var(--danger)';
  return `<div style="display:flex;align-items:center;gap:8px;">
    <div class="progress-bar" style="width:80px;">
      <div class="progress-fill" style="width:${pct}%;background:${col}"></div>
    </div>
    <span style="font-size:11px;color:var(--text3)">${pct}%</span>
  </div>`;
}

/* ─── DASHBOARD ──────────────────────────────── */
async function initDashboard() {
  const dispatches = await loadDispatches();
  const list = document.getElementById('dashDispatchList');
  if (!list) return;
  list.innerHTML = dispatches.map((d, i) => `
    <div class="dispatch-item" style="animation-delay:${i * 0.05}s" onclick="openModal('loadDetailModal')">
      <div class="dispatch-info">
        <div class="dispatch-id">${d.id}</div>
        <div class="dispatch-route">${d.route}</div>
        <div class="dispatch-driver">Driver: ${d.driver}</div>
      </div>
      ${statusPill(d.status)}
    </div>`).join('');
  initCharts();
}

/* ─── ORDERS ─────────────────────────────────── */
async function initOrders() {
  const orders = await loadOrders();
  renderOrders(orders);
}

function renderOrders(data) {
  const tbody = document.getElementById('ordersBody');
  if (!tbody) return;
  tbody.innerHTML = data.map(o => `
    <tr style="cursor:pointer;">
      <td class="bold">${o.id}</td>
      <td>${o.route}</td>
      <td>${o.driver}</td>
      <td>${o.vehicle}</td>
      <td>${statusPill(o.status)}</td>
      <td style="color:var(--text3)">${o.eta}</td>
      <td style="color:var(--accent);font-weight:600">${o.value}</td>
      <td style="display:flex;gap:6px;">
        <button class="btn btn-secondary" style="font-size:11px;padding:4px 10px;"
          onclick="openUpdateModal('${o.id}', '${o.status}')">Update</button>
        <button class="btn" style="font-size:11px;padding:4px 10px;background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.3);"
          onclick="deleteOrder('${o.id}')">Delete</button>
      </td>
    </tr>`).join('');
}

async function filterTable(status) {
  const orders = await loadOrders();
  if (status === 'all') { renderOrders(orders); return; }
  renderOrders(orders.filter(o => o.status === status));
}

/* ─── UPDATE ORDER STATUS ────────────────────── */
function openUpdateModal(id, currentStatus) {
  document.getElementById('updateOrderId').value = id;
  document.getElementById('updateOrderStatus').value = currentStatus;
  document.getElementById('updateModalLabel').textContent = `Update Status — ${id}`;
  openModal('updateOrderModal');
}

async function submitUpdateOrder() {
  const id     = document.getElementById('updateOrderId').value;
  const status = document.getElementById('updateOrderStatus').value;

  try {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (res.ok) {
      closeModal('updateOrderModal');
      showToast(`Order ${id} status updated to "${status}"!`);
      await initOrders();
    } else {
      alert('Error: ' + (data.error || 'Something went wrong'));
    }
  } catch (err) {
    alert('Failed to update order: ' + err.message);
  }
}

/* ─── DELETE ORDER ───────────────────────────── */
async function deleteOrder(id) {
  if (!confirm(`Are you sure you want to delete order ${id}? This cannot be undone.`)) return;

  try {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (res.ok) {
      showToast(`Order ${id} deleted successfully!`);
      await initOrders();
    } else {
      alert('Error: ' + (data.error || 'Something went wrong'));
    }
  } catch (err) {
    alert('Failed to delete order: ' + err.message);
  }
}

/* ─── FLEET ──────────────────────────────────── */
async function initFleet() {
  const fleet = await loadFleet();
  const tbody = document.getElementById('fleetBody');
  if (!tbody) return;
  tbody.innerHTML = fleet.map(v => `
    <tr onclick="openModal('loadDetailModal')" style="cursor:pointer;">
      <td class="bold">${v.id}</td>
      <td>${v.type}</td>
      <td>${v.driver}</td>
      <td>${statusPill(v.status)}</td>
      <td style="color:var(--text3)">${v.location}</td>
      <td style="color:var(--text2)">${v.mileage} mi</td>
      <td style="color:var(--text3)">${v.service || '-'}</td>
      <td>${fuelBar(v.fuel)}</td>
    </tr>`).join('');
}

/* ─── DRIVERS ────────────────────────────────── */
async function initDrivers() {
  const drivers = await loadDrivers();
  const grid = document.getElementById('driversGrid');
  if (!grid) return;
  const colors = ['#3b82f6','#8b5cf6','#00d4aa','#10b981','#ef4444','#f59e0b','#f59e0b','#3b82f6','#8b5cf6'];
  grid.innerHTML = drivers.map((d, i) => `
    <div class="driver-card" onclick="openModal('addDriverModal')">
      <div class="avatar" style="background:${colors[i]}20;color:${colors[i]};border:2px solid ${colors[i]}40;">${d.initials}</div>
      <div class="driver-info">
        <div class="driver-name">${d.name}</div>
        <div class="driver-meta">${d.id} · ${d.route}</div>
        <div class="driver-stats">
          <div class="driver-stat">Rating <span>${d.rating}★</span></div>
          <div class="driver-stat">Loads <span>${d.loads}</span></div>
        </div>
      </div>
      ${statusPill(d.status)}
    </div>`).join('');
}

/* ─── DISPATCH ───────────────────────────────── */
async function initDispatch() {
  const dispatches = await loadDispatches();
  const list = document.getElementById('activeDispatchList');
  if (!list) return;
  const active = dispatches.filter(d => ['in-transit', 'loading', 'assigned'].includes(d.status));
  list.innerHTML = active.map((d, i) => `
    <div class="dispatch-item" style="animation-delay:${i * 0.05}s" onclick="openModal('loadDetailModal')">
      <div class="dispatch-info">
        <div class="dispatch-id">${d.id}</div>
        <div class="dispatch-route">${d.route}</div>
        <div class="dispatch-driver">Driver: ${d.driver}</div>
      </div>
      ${statusPill(d.status)}
    </div>`).join('');
}

/* ─── CHARTS ─────────────────────────────────── */
let chartsInitialized = {};

function initCharts() {
  if (chartsInitialized.perf) return;
  chartsInitialized.perf = true;

  const defaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#8b949e', font: { family: 'DM Sans', size: 11 }, boxWidth: 12 } } },
    scales: {
      x: { ticks: { color: '#4a5568', font: { size: 11 } }, grid: { color: 'rgba(33,41,58,0.6)' } },
      y: { ticks: { color: '#4a5568', font: { size: 11 } }, grid: { color: 'rgba(33,41,58,0.6)' } }
    }
  };

  new Chart(document.getElementById('perfChart'), {
    type: 'bar',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [
        { label: 'On Time',  data: [38,42,35,47,40,28,22], backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 4 },
        { label: 'Delayed',  data: [4,2,6,3,5,2,1],        backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 4 },
        { label: 'Critical', data: [1,0,2,0,1,0,0],        backgroundColor: 'rgba(239,68,68,0.7)',  borderRadius: 4 }
      ]
    },
    options: defaults
  });

  new Chart(document.getElementById('revenueChart'), {
    type: 'line',
    data: {
      labels: ['Feb 1','Feb 5','Feb 10','Feb 15','Feb 20','Feb 22'],
      datasets: [{
        label: 'Revenue ($K)', data: [180,340,510,720,980,1200],
        borderColor: '#00d4aa', backgroundColor: 'rgba(0,212,170,0.08)',
        fill: true, tension: 0.4, pointBackgroundColor: '#00d4aa', pointRadius: 4
      }]
    },
    options: defaults
  });
}

function initBillingChart() {
  if (chartsInitialized.billing) return;
  chartsInitialized.billing = true;

  const defaults = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#8b949e', font: { family: 'DM Sans', size: 11 }, boxWidth: 12 } } },
    scales: {
      x: { ticks: { color: '#4a5568', font: { size: 11 } }, grid: { color: 'rgba(33,41,58,0.6)' } },
      y: { ticks: { color: '#4a5568', font: { size: 11 } }, grid: { color: 'rgba(33,41,58,0.6)' } }
    }
  };

  new Chart(document.getElementById('billingChart'), {
    type: 'bar',
    data: {
      labels: ['Nov','Dec','Jan','Feb'],
      datasets: [
        { label: 'Revenue',     data: [980000,1050000,1130000,1200000], backgroundColor: 'rgba(0,212,170,0.7)',  borderRadius: 4 },
        { label: 'Outstanding', data: [120000,95000,200000,184000],     backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 4 }
      ]
    },
    options: defaults
  });
}

function initReports() {
  if (chartsInitialized.reports) return;
  chartsInitialized.reports = true;

  const defaults = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#4a5568', font: { size: 10 } }, grid: { color: 'rgba(33,41,58,0.6)' } },
      y: { ticks: { color: '#4a5568', font: { size: 10 } }, grid: { color: 'rgba(33,41,58,0.6)' } }
    }
  };

  new Chart(document.getElementById('utilChart'), {
    type: 'line',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{ data: [71,78,80,75,82,65,57], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)', fill: true, tension: 0.4, pointRadius: 3 }]
    },
    options: { ...defaults, scales: { ...defaults.scales, y: { ...defaults.scales.y, min: 50, max: 100, ticks: { ...defaults.scales.y.ticks, callback: v => v + '%' } } } }
  });

  new Chart(document.getElementById('ontimeChart'), {
    type: 'line',
    data: {
      labels: ['W1','W2','W3','W4'],
      datasets: [{ data: [91.2,92.8,93.5,94.2], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#10b981' }]
    },
    options: { ...defaults, scales: { ...defaults.scales, y: { ...defaults.scales.y, min: 85, max: 100, ticks: { ...defaults.scales.y.ticks, callback: v => v + '%' } } } }
  });
}

/* ─── MAP MARKERS ────────────────────────────── */
function initMapMarkers() {
  document.querySelectorAll('.truck-marker').forEach(m => {
    m.addEventListener('mouseenter', e => {
      const tt = document.getElementById('mapTooltip');
      if (!tt) return;
      const id     = m.dataset.id     || '';
      const route  = m.dataset.route  || '';
      const status = m.dataset.status || '';
      const color  = m.dataset.color  || 'var(--accent)';
      tt.innerHTML = `
        <div class="map-tt-id">${id}</div>
        <div class="map-tt-row"><span class="map-tt-dot" style="background:${color}"></span>${route}</div>
        <div class="map-tt-row" style="margin-top:3px">${statusPill(status.toLowerCase().replace(' ', '-'))}</div>`;
      const rect = m.closest('svg').getBoundingClientRect();
      tt.style.left = (e.clientX - rect.left + 12) + 'px';
      tt.style.top  = (e.clientY - rect.top  - 10) + 'px';
      tt.classList.add('show');
    });
    m.addEventListener('mouseleave', () => {
      const tt = document.getElementById('mapTooltip');
      if (tt) tt.classList.remove('show');
    });
    m.addEventListener('click', () => openModal('loadDetailModal'));
  });
}

/* ─── NOTIFICATION PANEL ─────────────────────── */
function openNotifPanel() {
  document.getElementById('notifOverlay').classList.add('open');
  document.getElementById('notifPanel').classList.add('open');
}
function closeNotifPanel() {
  document.getElementById('notifOverlay').classList.remove('open');
  document.getElementById('notifPanel').classList.remove('open');
}
function markAllRead() {
  document.querySelectorAll('.notif-item.unread').forEach(i => i.classList.remove('unread'));
  updateNotifDot();
}
function updateNotifDot() {
  const unread = document.querySelectorAll('.notif-item.unread').length;
  document.getElementById('notifDot').style.display = unread > 0 ? 'block' : 'none';
}

/* ─── MODALS ─────────────────────────────────── */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

/* ─── AI CHAT ─────────────────────────────────── */
const aiResponses = [
  'Analyzing fleet data… I recommend re-routing IL-5629 via US-90 to avoid the I-10 closure near Baton Rouge. This saves approximately 45 minutes.',
  'Based on current load data, 2 unassigned loads (LD-001851 and LD-001858) can be consolidated. This would reduce fuel costs by $340.',
  'Driver Carlos Mendez (DRV-007) is approaching the 70-hour HOS weekly limit with only 2.5 hours remaining. I suggest assigning a relief driver for the Nashville→Memphis route.',
  'Fleet utilization is at 76%. I have identified 12 available trucks near high-demand zones. Would you like me to suggest optimal assignments?',
  'Revenue for MTD is $1.2M, which is 1.15% above last month. On-time delivery rate has improved to 94.2%, up from 92.1% last week.',
  "Optimization complete! I have recalculated 7 active routes and found potential fuel savings of $1,240 across today's dispatch.",
  'Checking driver availability… 16 drivers are currently off-duty and available for dispatch. Shall I suggest assignments based on proximity to unloaded cargo?',
];
let aiIdx = 0;

function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  const area = document.getElementById('chatArea');
  area.innerHTML += `<div class="chat-msg user"><div class="chat-bubble">${msg}</div><div class="chat-time">Now</div></div>`;
  input.value = '';
  area.scrollTop = area.scrollHeight;

  const typing = document.createElement('div');
  typing.className = 'chat-msg bot';
  typing.innerHTML = `<div class="chat-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  area.appendChild(typing);
  area.scrollTop = area.scrollHeight;

  setTimeout(() => {
    typing.remove();
    const resp = aiResponses[aiIdx % aiResponses.length]; aiIdx++;
    area.innerHTML += `<div class="chat-msg bot"><div class="chat-sender">Delivery In-time AI</div><div class="chat-bubble">${resp}</div><div class="chat-time">Now</div></div>`;
    area.scrollTop = area.scrollHeight;
  }, 1200);
}

function sendQuickMsg(el) {
  document.getElementById('chatInput').value = el.textContent;
  sendChat();
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
}

/* ─── CREATE ORDER ───────────────────────────── */
async function createOrder() {
  const origin      = document.getElementById('newOrigin').value.trim();
  const destination = document.getElementById('newDestination').value.trim();
  const driver      = document.getElementById('newDriver').value;
  const vehicle     = document.getElementById('newVehicle').value;
  const value       = document.getElementById('newValue').value;
  const deadline    = document.getElementById('newDeadline').value;

  if (!origin || !destination) {
    alert('Please enter Origin and Destination city!');
    return;
  }

  const id    = 'LD-' + Date.now();
  const route = `${origin} to ${destination}`;
  const eta   = deadline ? new Date(deadline).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : 'TBD';

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        route,
        driver:  driver  === '-- Select Driver --'  ? '—' : driver,
        vehicle: vehicle === '-- Select Vehicle --' ? '—' : vehicle,
        status:  driver  === '-- Select Driver --'  ? 'unassigned' : 'assigned',
        eta,
        value: value ? `$${parseFloat(value).toLocaleString()}` : '$0'
      })
    });

    const data = await res.json();

    if (res.ok) {
      closeModal('newLoadModal');
      showToast('Load created successfully!');
      document.getElementById('newOrigin').value      = '';
      document.getElementById('newDestination').value = '';
      document.getElementById('newValue').value        = '';
      document.getElementById('newDeadline').value     = '';
      await initOrders();
      navigateTo('orders');
    } else {
      alert('Error: ' + (data.error || 'Something went wrong'));
    }
  } catch (err) {
    alert('Failed to create order: ' + err.message);
  }
}

/* ─── TOAST ──────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = '✓  ' + msg;
  t.style.display = 'flex';
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => t.style.display = 'none', 300);
  }, 2800);
}

/* ─── LIVE CLOCK ──────────────────────────────── */
function updateClock() {
  const now = new Date();
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const sub = document.getElementById('dashboardDate');
  if (sub) sub.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()} ${now.getFullYear()} · Real-time delivery intelligence`;
}

/* ─── LIVE KPI SIMULATION ──────────────────────── */
function tickKPIs() {
  const el = document.getElementById('kpi-loads');
  if (el && Math.random() > 0.7) {
    const v = parseInt(el.textContent);
    el.textContent = v + (Math.random() > 0.5 ? 1 : -1);
  }
}

/* ══════════════════════════════════════════════
   BOOTSTRAP
   ══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('.page-view').forEach(v => {
    v.style.display = v.classList.contains('active') ? 'flex' : 'none';
  });

  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
  });

  const notifBtn = document.getElementById('notifBtn');
  if (notifBtn) notifBtn.addEventListener('click', openNotifPanel);

  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });

  const aiChipBtn = document.getElementById('aiChipBtn');
  if (aiChipBtn) aiChipBtn.addEventListener('click', () => navigateTo('ai'));

  const gs = document.getElementById('globalSearch');
  if (gs) {
    gs.addEventListener('input', async function () {
      const q = this.value.toLowerCase();
      if (!q) return;
      const orders = await loadOrders();
      const filtered = orders.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.route.toLowerCase().includes(q) ||
        o.driver.toLowerCase().includes(q)
      );
      if (filtered.length) {
        navigateTo('orders');
        setTimeout(() => renderOrders(filtered), 100);
      }
    });
  }

  initMapMarkers();
  updateClock();
  setInterval(tickKPIs, 4000);
  initDashboard();
});
