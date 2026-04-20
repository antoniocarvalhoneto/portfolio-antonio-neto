
// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== NAV TOGGLE MOBILE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    navLinks.classList.contains('open')
        ? (spans[0].style.transform='rotate(45deg) translate(5px,5px)', spans[1].style.opacity='0', spans[2].style.transform='rotate(-45deg) translate(5px,-5px)')
        : (spans[0].style.transform='', spans[1].style.opacity='', spans[2].style.transform='');
});

navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = spans[2].style.transform = '';
        spans[1].style.opacity = '';
    });
});

const botaomusica = document.getElementById('navMusic');
const musica = new Audio("assets/What You Won't Do for Love.mp3");
botaomusica.addEventListener('click', () => {
    if (musica.paused) {
        musica.play();
        botaomusica.textContent = 'Pausar música';
    } else {
        musica.pause();
        botaomusica.textContent = 'Toque um jazz suave🎶';
    }
});

// ===== INTERSECTION OBSERVER: REVEAL =====
const revealAll = () => {
    document.querySelectorAll('.section-title, .section-label, .sobre-text, .sobre-cards, .info-card, .deploy-card, .deploy-coming, .contact-desc, .social-card').forEach(el => {
        el.classList.add('reveal');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

// ===== SKILL BARS =====
const animateSkills = () => {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-item').forEach((item, i) => {
                    setTimeout(() => item.classList.add('animated'), i * 100);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const skillsSection = document.querySelector('#skills');
    if (skillsSection) skillObserver.observe(skillsSection);
};

// ===== GITHUB REPOS =====
const LANG_COLORS = {
    'JavaScript': '#f1e05a',
    'Python': '#3572A5',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'TypeScript': '#2b7489',
    'Java': '#b07219',
    'C#': '#178600',
    'Shell': '#89e051',
    'default': '#8b949e'
};

async function loadGitHubRepos() {
    const grid = document.getElementById('reposGrid');
    const status = document.getElementById('githubStatus');
    const errorEl = document.getElementById('reposError');
    const username = 'antoniocarvalhoneto';

    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=9&type=public`);

        if (!res.ok) throw new Error(`GitHub API: ${res.status}`);

        const repos = await res.json();

        if (!repos.length) throw new Error('Nenhum repositório público encontrado.');

        status.textContent = `${repos.length} repositório(s) encontrado(s)`;

        grid.innerHTML = '';

        repos.filter(r => !r.fork).slice(0, 6).forEach((repo, i) => {
            const langColor = LANG_COLORS[repo.language] || LANG_COLORS.default;
            const card = document.createElement('div');
            card.className = 'repo-card';
            card.style.animationDelay = `${i * 0.1}s`;
            card.innerHTML = `
                <div class="repo-name">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style="vertical-align:middle;margin-right:6px;opacity:0.6"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/></svg>
                    ${repo.name}
                </div>
                <p class="repo-desc">${repo.description || 'Sem descrição disponível.'}</p>
                <div class="repo-meta">
                    ${repo.language ? `
                    <span class="repo-lang">
                        <span class="lang-dot" style="background:${langColor}"></span>
                        ${repo.language}
                    </span>` : ''}
                    <span class="repo-stars">★ ${repo.stargazers_count}</span>
                    ${repo.updated_at ? `<span class="repo-lang" style="margin-left:auto;font-size:0.7rem;opacity:0.6">${timeAgo(repo.updated_at)}</span>` : ''}
                </div>
                <a href="${repo.html_url}" target="_blank" class="repo-link">Ver repositório →</a>
            `;
            grid.appendChild(card);
        });

    } catch (err) {
        console.warn('GitHub API error:', err.message);
        grid.innerHTML = '';
        status.textContent = 'Repositórios indisponíveis';
        errorEl.classList.add('visible');
        errorEl.classList.remove('hidden');
    }
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return 'hoje';
    if (days === 1) return 'ontem';
    if (days < 30) return `${days}d atrás`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}m atrás`;
    return `${Math.floor(months / 12)}a atrás`;
}

// ===== ACTIVE NAV LINK =====
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            link.style.color = (scrollPos >= top && scrollPos < bottom)
                ? 'var(--red)'
                : '';
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== TYPING EFFECT hero subtitle =====
function typeEffect(el, text, speed = 60) {
    el.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
        el.textContent += text[i++];
        if (i >= text.length) clearInterval(timer);
    }, speed);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    revealAll();
    animateSkills();
    loadGitHubRepos();

    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        subtitle.textContent = '';
        setTimeout(() => typeEffect(subtitle, originalText, 45), 800);
    }
});
