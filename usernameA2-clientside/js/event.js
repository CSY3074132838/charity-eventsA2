// public/js/event.js
(async function () {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const container = document.getElementById('event');
  const err = document.getElementById('detail-error');

  if (!id) {
    err.hidden = false; err.textContent = 'Missing event ID in URL.';
    return;
  }

  try {
    const res = await API.getEvent(id);
    if (!res.success) throw new Error(res.message || 'Unknown error');
    const ev = res.data;
    container.innerHTML = `
      <article class="event-detail">
        <img class="hero" src="${ev.hero_image_url || ''}" alt="" />
        <h1>${ev.title}</h1>
        <p class="badge">${ev.category_name}</p>
        <p class="muted">${ev.city} · ${ev.venue} · ${formatDateTime(ev.start_time)} — ${formatDateTime(ev.end_time)}</p>

        <section class="grid-2">
          <div>
            <h3>About this event</h3>
            <p>${ev.full_desc || ev.short_desc || ''}</p>
          </div>
          <div>
            <h3>Tickets</h3>
            ${ev.tickets && ev.tickets.length ? `
              <ul class="tickets">
                ${ev.tickets.map(t => `<li>${t.name}: ${money(t.price, t.currency)}</li>`).join('')}
              </ul>` : `<p class="muted">No tickets configured.</p>`
            }
            <h3>Goal vs. Progress</h3>
            <div class="progress">${renderProgress(ev.raised_amount, ev.goal_amount)}</div>
            <button class="btn" id="register-btn">Register</button>
          </div>
        </section>

        <section>
          <h3>Organiser</h3>
          <p><strong>${ev.org_name}</strong></p>
          <p class="muted">${ev.mission || ''}</p>
          <p class="muted">${ev.website ? `<a href="${ev.website}" target="_blank" rel="noopener">Website</a>` : ''}</p>
          <p class="muted">${ev.email || ''} ${ev.phone ? ' | ' + ev.phone : ''}</p>
        </section>
      </article>
    `;

    document.getElementById('register-btn').addEventListener('click', () => {
      alert('This feature is currently under construction.');
    });
  } catch (e) {
    err.hidden = false; err.textContent = `Failed to load event: ${e.message}`;
  }
})();

function renderProgress(raised, goal) {
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  return `
    <div class="progress-bar">
      <div class="progress-fill" style="width:${pct}%"></div>
    </div>
    <small>${money(raised)} raised of ${money(goal)} (${pct}%)</small>
  `;
}
