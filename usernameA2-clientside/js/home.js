// public/js/home.js
(async function () {
  const wrap = document.getElementById('events');
  const err = document.getElementById('home-error');
  try {
    const res = await API.getHomeEvents();
    if (!res.success) throw new Error(res.message || 'Unknown error');
    if (!res.data.length) {
      wrap.innerHTML = `<p class="muted">No upcoming events right now. Please check back soon.</p>`;
      return;
    }
    wrap.innerHTML = res.data.map(ev => `
      <article class="card">
        <img src="${ev.hero_image_url || ''}" alt="" />
        <div class="card-body">
          <h3>${ev.title}</h3>
          <p class="badge">${ev.category_name}</p>
          <p class="muted">${ev.city} · ${ev.venue}</p>
          <p><strong>${formatDateTime(ev.start_time)}</strong> – ${formatDateTime(ev.end_time)}</p>
          <div class="progress">
            ${renderProgress(ev.raised_amount, ev.goal_amount)}
          </div>
          <a class="btn" href="/event.html?id=${ev.id}">View details</a>
        </div>
      </article>
    `).join('');
  } catch (e) {
    err.hidden = false;
    err.textContent = `Failed to load events: ${e.message}`;
  }
})();

function renderProgress(raised, goal) {
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  return `
    <div class="progress-bar">
      <div class="progress-fill" style="width:${pct}%"></div>
    </div>
    <small>${money(raised)} raised of ${money(goal)}</small>
  `;
}
