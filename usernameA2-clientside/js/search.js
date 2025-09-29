(async function init() {
  const catSel = document.getElementById('category');
  const err = document.getElementById('search-error');

  try {
    const cats = await API.getCategories();
    if (cats.success && cats.data.length) {
      cats.data.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.slug;
        opt.textContent = c.name;
        catSel.appendChild(opt);
      });
    }
  } catch (e) {
    err.hidden = false;
    err.textContent = `⚠️ Failed to load categories: ${e.message}`;
  }
})();

document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  // ✅ 只保留有值的字段，避免 undefined 出现在 URL
  const params = {};
  if (form.date.value) params.date = form.date.value;
  if (form.location.value.trim()) params.location = form.location.value.trim();
  if (form.category.value) params.category = form.category.value;

  const err = document.getElementById('search-error');
  const results = document.getElementById('results');
  const submitBtn = form.querySelector('button[type="submit"]');

  err.hidden = true;
  err.textContent = '';
  results.innerHTML = '<p class="muted">⏳ Searching…</p>';
  submitBtn.disabled = true;

  try {
    const res = await API.searchEvents(params);
    if (!res.success) throw new Error(res.message || 'Unknown error');

    if (!res.data.length) {
      results.innerHTML = `<p class="muted">⚠️ No matching events. Try different filters.</p>`;
    } else {
      results.innerHTML = res.data.map(ev => `
        <article class="card">
          <img src="${ev.hero_image_url || ''}" alt="Event image" />
          <div class="card-body">
            <h3>${ev.title}</h3>
            <p class="badge">${ev.category_name}</p>
            <p class="muted">${ev.city} · ${ev.venue}</p>
            <p><strong>${formatDateTime(ev.start_time)}</strong></p>
            ${renderProgress(ev.raised_amount, ev.goal_amount)}
            <a class="btn" href="/event.html?id=${ev.id}">View details</a>
          </div>
        </article>
      `).join('');
    }
  } catch (e2) {
    results.innerHTML = '';
    err.hidden = false;
    err.textContent = `❌ Search failed: ${e2.message}`;
  } finally {
    submitBtn.disabled = false;
  }
});

document.getElementById('clear-btn').addEventListener('click', () => {
  const form = document.getElementById('search-form');
  form.reset();
  document.getElementById('results').innerHTML =
    '<p class="muted">🔎 Please enter filters and click Search to find events.</p>';
  const err = document.getElementById('search-error');
  err.hidden = true;
  err.textContent = '';
});

// ✅ 渲染进度条
function renderProgress(raised, goal) {
  if (!goal || goal <= 0) return '';
  const pct = Math.min(100, Math.round((raised / goal) * 100));
  return `
    <div class="progress-bar">
      <div class="progress-fill" style="width:${pct}%"></div>
    </div>
    <small>${money(raised)} raised of ${money(goal)} (${pct}%)</small>
  `;
}
