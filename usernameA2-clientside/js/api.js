// 后端 API 地址
const API_BASE = "http://localhost:3001/api";

const API = {
  async getHomeEvents() {
    const r = await fetch(`${API_BASE}/events`);
    return r.json();
  },
  async getCategories() {
    const r = await fetch(`${API_BASE}/categories`);
    return r.json();
  },
  async searchEvents(params) {
    const usp = new URLSearchParams(params);
    const r = await fetch(`${API_BASE}/events/search?${usp.toString()}`);
    return r.json();
  },
  async getEvent(id) {
    const r = await fetch(`${API_BASE}/events/${id}`);
    return r.json();
  }
};

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function money(n, c = 'USD') {
  const val = Number(n || 0);
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: c }).format(val);
}

// 登录状态显示
function renderUserInfo() {
  const el = document.getElementById('user-info');
  if (!el) return;

  const u = localStorage.getItem('user');
  if (u) {
    el.innerHTML = `👤 ${u} <a href="#" id="logout">(Logout)</a>`;
    const logout = document.getElementById('logout');
    if (logout) {
      logout.addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('user');
        location.reload();
      });
    }
  } else {
    el.innerHTML = `<a href="./login.html">Login</a> | <a href="./register.html">Register</a>`;
  }
}

// 确保页面加载完再渲染
document.addEventListener('DOMContentLoaded', renderUserInfo);
