// ===================================================
//  PLAYLIST — adicione seus arquivos MP3 aqui
//  Coloque os arquivos na pasta assets/
// ===================================================
const PLAYLIST = [
    {
        title: "What You Won't Do for Love",
        artist: "Bobby Caldwell",
        src: "assets/What You Won't Do for Love.mp3",
        cover: "https://i.scdn.co/image/ab67616d0000b2730f98789111606f77a27d6f67"
    },
    {
        title: "Medo De Quase Nada",
        artist: "LEALL",
        src: "assets/YouTube_LEALL-Medo-De-Quase-Nada_Media_0pZLelWVl5g_009_128k.mp3",
        cover: "https://musicainstantanea.com.br/wp-content/uploads/2023/12/LEALL-%E2%80%93-Eu-Ainda-Tenho-Coracao.jpeg",
    },
    {
        title: "Like a Tattoo",
        artist: "Sade",
        src: "assets/Ytmp3.gg_YouTube_Sade-Like-a-Tattoo-Audio_Media_BQUi7mD_PkM_009_128k.mp3",
        cover: "https://i.scdn.co/image/ab67616d0000b2735e25e034e25258b356774c79"
    },
    {
        title: "Papel de Parede",
        artist: "Pedro Qualy, WIU",
        src: "assets/Ytmp3.gg_YouTube_Pedro-Qualy-_-WIU-Papel-de-Parede-Prod-R_Media_UMb-EiePHvU_009_128k.mp3", 
        cover: "https://i.scdn.co/image/ab67616d0000b2736a6368a6a14db3d6a99b4bd8",
    },
    {
        title: "Kiss of Life",
        artist: "Sade",
        src: "assets/Kiss of Life - Sade (128k).mp3",
        cover: "https://i.scdn.co/image/ab67616d0000b2735e25e034e25258b356774c79",
    }

    // Adicione mais músicas no formato abaixo:
    // { title: "Nome da Música", artist: "Artista", src: "assets/arquivo.mp3", cover: null },
];

let currentTrack = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
const audio = new Audio();
audio.volume = 0.7;

function loadTrack(index, autoplay = false) {
    const track = PLAYLIST[index];
    if (!track) return;
    audio.src = track.src;
    audio.load();
    document.getElementById('playerBarTitle').textContent = track.title;
    document.getElementById('playerBarArtist').textContent = track.artist;
    document.getElementById('sidebarTrackName').textContent = track.title;
    document.getElementById('sidebarTrackArtist').textContent = track.artist;
    const noteIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
    const bigNoteIcon = `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.3"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
    if (track.cover) {
        document.getElementById('playerArt').innerHTML = `<img src="${track.cover}" alt="${track.title}">`;
        // sidebar art: inserir img mas preservar o pseudo-element ::after (centro do disco)
        const sArtEl = document.getElementById('sidebarArt');
        if (sArtEl) sArtEl.innerHTML = `<img src="${track.cover}" alt="${track.title}">`;
    } else {
        document.getElementById('playerArt').innerHTML = noteIcon;
        const sArtEl = document.getElementById('sidebarArt');
        if (sArtEl) sArtEl.innerHTML = bigNoteIcon;
    }
    updatePlaylistUI();
    if (autoplay) {
        audio.play().then(() => { isPlaying = true; updatePlayUI(); }).catch(() => {});
    }
}

function togglePlay() {
    if (!audio.src && PLAYLIST.length) { loadTrack(0, true); return; }
    if (isPlaying) { audio.pause(); isPlaying = false; }
    else { audio.play().catch(() => {}); isPlaying = true; }
    updatePlayUI();
}

function nextTrack() {
    if (isShuffle) currentTrack = Math.floor(Math.random() * PLAYLIST.length);
    else currentTrack = (currentTrack + 1) % PLAYLIST.length;
    loadTrack(currentTrack, isPlaying);
}

function prevTrack() {
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    currentTrack = (currentTrack - 1 + PLAYLIST.length) % PLAYLIST.length;
    loadTrack(currentTrack, isPlaying);
}

function updatePlayUI() {
    const playPath = `<path d="M8 5v14l11-7z"/>`;
    const pausePath = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
    const icon = isPlaying ? pausePath : playPath;
    document.getElementById('pbarPlayIcon').innerHTML = icon;
    document.getElementById('scPlayIcon').innerHTML = icon;
    const sArt = document.getElementById('sidebarArt');
    const sRing = document.getElementById('sidebarArtRing');
    if (sArt) sArt.classList.toggle('playing', isPlaying);
    if (sRing) sRing.classList.toggle('playing', isPlaying);
    document.getElementById('navMusic').classList.toggle('playing', isPlaying);
    if (isPlaying) {
        document.getElementById('navMusic').innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> Pausar`;
    } else {
        document.getElementById('navMusic').innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg> Player`;
    }
}

function formatTime(s) {
    if (isNaN(s)) return '0:00';
    return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;
}

audio.addEventListener('timeupdate', () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    document.getElementById('playerProgressFill').style.width = pct + '%';
    document.getElementById('sidebarProgressFill').style.width = pct + '%';
    document.getElementById('pCurrentTime').textContent = formatTime(audio.currentTime);
    document.getElementById('sCurrentTime').textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
    document.getElementById('pDuration').textContent = formatTime(audio.duration);
    document.getElementById('sDuration').textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
    if (isRepeat) { audio.currentTime = 0; audio.play(); }
    else nextTrack();
});

document.getElementById('playerProgress')?.addEventListener('click', (e) => {
    const el = document.getElementById('playerProgress');
    const pct = Math.max(0, Math.min(1, (e.clientX - el.getBoundingClientRect().left) / el.offsetWidth));
    audio.currentTime = pct * audio.duration;
});
document.getElementById('sidebarProgress')?.addEventListener('click', (e) => {
    const el = document.getElementById('sidebarProgress');
    const pct = Math.max(0, Math.min(1, (e.clientX - el.getBoundingClientRect().left) / el.offsetWidth));
    audio.currentTime = pct * audio.duration;
});

document.getElementById('volSlider')?.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
    document.getElementById('sidebarVol').value = e.target.value;
    document.getElementById('sidebarVolPct').textContent = e.target.value + '%';
});
document.getElementById('sidebarVol')?.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
    document.getElementById('volSlider').value = e.target.value;
    document.getElementById('sidebarVolPct').textContent = e.target.value + '%';
});

document.getElementById('pbarPlay')?.addEventListener('click', togglePlay);
document.getElementById('scPlay')?.addEventListener('click', togglePlay);
document.getElementById('pbarNext')?.addEventListener('click', nextTrack);
document.getElementById('scNext')?.addEventListener('click', nextTrack);
document.getElementById('pbarPrev')?.addEventListener('click', prevTrack);
document.getElementById('scPrev')?.addEventListener('click', prevTrack);

document.getElementById('scShuffle')?.addEventListener('click', () => {
    isShuffle = !isShuffle;
    document.getElementById('scShuffle').classList.toggle('active', isShuffle);
});
document.getElementById('scRepeat')?.addEventListener('click', () => {
    isRepeat = !isRepeat;
    document.getElementById('scRepeat').classList.toggle('active', isRepeat);
});

function openSidebar() {
    document.getElementById('playerSidebar').classList.add('open');
    document.getElementById('playerSidebarOverlay').classList.add('open');
}
function closeSidebar() {
    document.getElementById('playerSidebar').classList.remove('open');
    document.getElementById('playerSidebarOverlay').classList.remove('open');
}

document.getElementById('pbarExpand')?.addEventListener('click', openSidebar);
document.getElementById('sidebarClose')?.addEventListener('click', closeSidebar);
document.getElementById('playerSidebarOverlay')?.addEventListener('click', closeSidebar);

document.getElementById('navMusic')?.addEventListener('click', () => {
    const bar = document.getElementById('playerBar');
    if (!bar.classList.contains('visible')) {
        bar.classList.add('visible');
        if (PLAYLIST.length) loadTrack(currentTrack);
    }
    openSidebar();
    if (!isPlaying && PLAYLIST.length) {
        audio.play().catch(() => {});
        isPlaying = true;
        updatePlayUI();
    } else if (isPlaying) {
        audio.pause();
        isPlaying = false;
        updatePlayUI();
    }
});

document.getElementById('addTrackFile')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    PLAYLIST.push({ title: file.name.replace(/\.[^.]+$/, ''), artist: 'Arquivo local', src: url, cover: null });
    buildPlaylist();
    currentTrack = PLAYLIST.length - 1;
    loadTrack(currentTrack, true);
    document.getElementById('playerBar').classList.add('visible');
});

function buildPlaylist() {
    const container = document.getElementById('sidebarPlaylist');
    container.innerHTML = '<p class="playlist-label">Playlist</p>';
    if (!PLAYLIST.length) {
        container.innerHTML += '<p style="font-size:0.8rem;color:rgba(240,246,252,0.3);font-family:monospace;padding:8px 0">Nenhuma faixa. Adicione arquivos MP3 em PLAYLIST no script.js</p>';
        return;
    }
    PLAYLIST.forEach((track, i) => {
        const item = document.createElement('div');
        item.className = 'playlist-item' + (i === currentTrack ? ' active' : '');
        item.dataset.index = i;
        item.innerHTML = `<span class="pl-num">${i + 1}</span><div class="pl-info"><div class="pl-title">${track.title}</div><div class="pl-artist">${track.artist}</div></div>`;
        item.addEventListener('click', () => {
            currentTrack = i;
            loadTrack(i, true);
            document.getElementById('playerBar').classList.add('visible');
        });
        container.appendChild(item);
    });
}

function updatePlaylistUI() {
    document.querySelectorAll('.playlist-item').forEach((el, i) => {
        el.classList.toggle('active', i === currentTrack);
    });
}

// ===== MODAL BIOGRAFIA =====
function openBio() {
    document.getElementById('bioOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeBio() {
    document.getElementById('bioOverlay').classList.remove('open');
    document.body.style.overflow = '';
}
document.getElementById('openBio')?.addEventListener('click', openBio);
document.getElementById('bioClose')?.addEventListener('click', closeBio);
document.getElementById('bioOverlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('bioOverlay')) closeBio();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeBio(); closeSidebar(); }
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 60); });

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

const revealAll = () => {
    document.querySelectorAll('.section-title,.section-label,.sobre-text,.sobre-cards,.info-card,.deploy-card,.deploy-coming,.contact-desc,.social-card').forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('visible'), i * 80); observer.unobserve(entry.target); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

const animateSkills = () => {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-item').forEach((item, i) => { setTimeout(() => item.classList.add('animated'), i * 100); });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    const s = document.querySelector('#skills');
    if (s) skillObserver.observe(s);
};

const LANG_COLORS = { 'JavaScript':'#f1e05a','Python':'#3572A5','HTML':'#e34c26','CSS':'#563d7c','TypeScript':'#2b7489','Java':'#b07219','C#':'#178600','Shell':'#89e051','default':'#8b949e' };

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
                <div class="repo-name"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style="vertical-align:middle;margin-right:6px;opacity:0.6"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/></svg>${repo.name}</div>
                <p class="repo-desc">${repo.description || 'Sem descrição disponível.'}</p>
                <div class="repo-meta">
                    ${repo.language ? `<span class="repo-lang"><span class="lang-dot" style="background:${langColor}"></span>${repo.language}</span>` : ''}
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

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) link.style.color = (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) ? 'var(--red)' : '';
    });
}
window.addEventListener('scroll', updateActiveNav);

function typeEffect(el, text, speed = 60) {
    el.textContent = '';
    let i = 0;
    const timer = setInterval(() => { el.textContent += text[i++]; if (i >= text.length) clearInterval(timer); }, speed);
}

document.addEventListener('DOMContentLoaded', () => {
    revealAll();
    animateSkills();
    loadGitHubRepos();
    buildPlaylist();
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        subtitle.textContent = '';
        setTimeout(() => typeEffect(subtitle, originalText, 45), 800);
    }
});
