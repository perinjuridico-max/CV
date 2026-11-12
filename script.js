// Ano no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Tema claro/escuro (padrão: claro; lembra a escolha)
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const icon = toggle.querySelector('i');
function setTheme(t) {
  root.dataset.theme = t;
  icon.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  try { localStorage.setItem('theme', t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved || 'light');
toggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

// Link ativo no menu conforme a rolagem
const links = [...document.querySelectorAll('.menu a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
function onScroll() {
  const pos = scrollY + 140;
  links.forEach((a, i) => {
    const s = sections[i];
    a.classList.toggle('active', s.offsetTop <= pos && s.offsetTop + s.offsetHeight > pos);
  });
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Formulário: monta a mensagem e envia pelo WhatsApp
const lead = document.getElementById('leadForm');
if (lead) lead.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(lead);
  const msg = 'Solicitação de análise técnica\n' +
    'Nome/Razão social: ' + f.get('nome') + '\n' +
    'WhatsApp: ' + f.get('fone') + '\n' +
    'Perfil: ' + f.get('perfil') + '\n' +
    'Tipo de operação: ' + f.get('tipo') + '\n' +
    'Resumo: ' + (f.get('resumo') || '-');
  window.open('https://wa.me/5541991081681?text=' + encodeURIComponent(msg), '_blank', 'noopener');
});

// Revelar ao rolar + contadores (conteúdo permanece visível sem JS)
root.classList.add('js');
const targets = document.querySelectorAll('.card, .job, .project, .panel, .prose, .duo, .audience__col, .step, .photo--sm, .contacts > *, .kpi');
targets.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    const counter = e.target.querySelector('.count');
    if (counter) {
      const to = +counter.dataset.to, t0 = performance.now(), dur = 1400;
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        counter.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }
    io.unobserve(e.target);
  });
}, { threshold: .15 });
targets.forEach(el => io.observe(el));
