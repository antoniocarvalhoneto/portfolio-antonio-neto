// ===================================================
//  playlist — adicione seus arquivos mp3 aqui
//  coloque os arquivos na pasta assets/
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

    // adicione mais músicas no formato abaixo:
    // { title: "nome da música", artist: "artista", src: "assets/arquivo.mp3", cover: null },
];

// variáveis globais para controlar o estado do player de música
let currentTrack = 0; // índice da música atual na playlist
let isPlaying = false; // indica se a música está tocando
let isShuffle = false; // modo aleatório ativado
let isRepeat = false; // modo repetir ativado
const audio = new Audio(); // elemento de áudio para reproduzir as músicas
audio.volume = 0.7; // define o volume inicial como 70%

// função para carregar uma música específica da playlist
// index: índice da música na playlist
// autoplay: se true, inicia a reprodução automaticamente
function loadTrack(index, autoplay = false) {
    const track = PLAYLIST[index]; // obtém a música pelo índice
    if (!track) return; // se não houver música, sai da função
    audio.src = track.src; // define a fonte do áudio
    audio.load(); // carrega o áudio
    // atualiza os textos na barra do player
    document.getElementById('playerBarTitle').textContent = track.title;
    document.getElementById('playerBarArtist').textContent = track.artist;
    // atualiza os textos na sidebar
    document.getElementById('sidebarTrackName').textContent = track.title;
    document.getElementById('sidebarTrackArtist').textContent = track.artist;
    // ícones de nota musical para quando não há capa
    const noteIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
    const bigNoteIcon = `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.3"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
    if (track.cover) {
        // se há capa, insere a imagem no player e sidebar
        document.getElementById('playerArt').innerHTML = `<img src="${track.cover}" alt="${track.title}">`;
        const sArtEl = document.getElementById('sidebarArt');
        if (sArtEl) sArtEl.innerHTML = `<img src="${track.cover}" alt="${track.title}">`;
    } else {
        // se não há capa, usa ícones de nota
        document.getElementById('playerArt').innerHTML = noteIcon;
        const sArtEl = document.getElementById('sidebarArt');
        if (sArtEl) sArtEl.innerHTML = bigNoteIcon;
    }
    updatePlaylistUI(); // atualiza a ui da playlist
    if (autoplay) {
        // se autoplay, tenta tocar e atualiza o estado
        audio.play().then(() => { isPlaying = true; updatePlayUI(); }).catch(() => {});
    }
}

// função para alternar entre play e pause
function togglePlay() {
    if (!audio.src && PLAYLIST.length) { loadTrack(0, true); return; } // se não há áudio carregado, carrega a primeira música
    if (isPlaying) { audio.pause(); isPlaying = false; } // se está tocando, pausa
    else { audio.play().catch(() => {}); isPlaying = true; } // se não, toca
    updatePlayUI(); // atualiza a ui
}

// função para avançar para a próxima música
function nextTrack() {
    if (isShuffle) currentTrack = Math.floor(Math.random() * PLAYLIST.length); // se shuffle, escolhe aleatoriamente
    else currentTrack = (currentTrack + 1) % PLAYLIST.length; // senão, próxima na lista
    loadTrack(currentTrack, isPlaying); // carrega e mantém o estado de play
}

// função para voltar para a música anterior ou reiniciar a atual
function prevTrack() {
    if (audio.currentTime > 3) { audio.currentTime = 0; return; } // se passou de 3s, reinicia
    currentTrack = (currentTrack - 1 + PLAYLIST.length) % PLAYLIST.length; // volta uma
    loadTrack(currentTrack, isPlaying);
}

// função para atualizar a ui do botão play/pause
function updatePlayUI() {
    const playPath = `<path d="M8 5v14l11-7z"/>`; // ícone de play
    const pausePath = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`; // ícone de pause
    const icon = isPlaying ? pausePath : playPath; // escolhe o ícone
    document.getElementById('pbarPlayIcon').innerHTML = icon; // atualiza na barra
    document.getElementById('scPlayIcon').innerHTML = icon; // atualiza na sidebar
    const sArt = document.getElementById('sidebarArt');
    const sRing = document.getElementById('sidebarArtRing');
    if (sArt) sArt.classList.toggle('playing', isPlaying); // adiciona classe se tocando
    if (sRing) sRing.classList.toggle('playing', isPlaying);
    document.getElementById('navMusic').classList.toggle('playing', isPlaying);
    if (isPlaying) {
        document.getElementById('navMusic').innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> pausar`;
    } else {
        document.getElementById('navMusic').innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg> player`;
    }
}

// função para formatar o tempo em minutos:segundos
function formatTime(s) {
    if (isNaN(s)) return '0:00'; // se inválido, retorna 0:00
    return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`; // formata
}

// event listener para atualizar o progresso da música
audio.addEventListener('timeupdate', () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0; // calcula porcentagem
    document.getElementById('playerProgressFill').style.width = pct + '%'; // atualiza barra na player
    document.getElementById('sidebarProgressFill').style.width = pct + '%'; // atualiza na sidebar
    document.getElementById('pCurrentTime').textContent = formatTime(audio.currentTime); // tempo atual
    document.getElementById('sCurrentTime').textContent = formatTime(audio.currentTime);
});

// event listener quando os metadados são carregados
audio.addEventListener('loadedmetadata', () => {
    document.getElementById('pDuration').textContent = formatTime(audio.duration); // duração total
    document.getElementById('sDuration').textContent = formatTime(audio.duration);
});

// event listener quando a música termina
audio.addEventListener('ended', () => {
    if (isRepeat) { audio.currentTime = 0; audio.play(); } // se repetir, reinicia
    else nextTrack(); // senão, próxima
});

// event listeners para clicar na barra de progresso
document.getElementById('playerProgress')?.addEventListener('click', (e) => {
    const el = document.getElementById('playerProgress');
    const pct = Math.max(0, Math.min(1, (e.clientX - el.getBoundingClientRect().left) / el.offsetWidth)); // calcula posição
    audio.currentTime = pct * audio.duration; // define tempo
});
document.getElementById('sidebarProgress')?.addEventListener('click', (e) => {
    const el = document.getElementById('sidebarProgress');
    const pct = Math.max(0, Math.min(1, (e.clientX - el.getBoundingClientRect().left) / el.offsetWidth));
    audio.currentTime = pct * audio.duration;
});

// event listeners para controle de volume
document.getElementById('volSlider')?.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100; // define volume
    document.getElementById('sidebarVol').value = e.target.value; // sincroniza sliders
    document.getElementById('sidebarVolPct').textContent = e.target.value + '%'; // mostra porcentagem
});
document.getElementById('sidebarVol')?.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
    document.getElementById('volSlider').value = e.target.value;
    document.getElementById('sidebarVolPct').textContent = e.target.value + '%';
});

// event listeners para botões de controle
document.getElementById('pbarPlay')?.addEventListener('click', togglePlay);
document.getElementById('scPlay')?.addEventListener('click', togglePlay);
document.getElementById('pbarNext')?.addEventListener('click', nextTrack);
document.getElementById('scNext')?.addEventListener('click', nextTrack);
document.getElementById('pbarPrev')?.addEventListener('click', prevTrack);
document.getElementById('scPrev')?.addEventListener('click', prevTrack);

// event listeners para shuffle e repeat
document.getElementById('scShuffle')?.addEventListener('click', () => {
    isShuffle = !isShuffle; // alterna shuffle
    document.getElementById('scShuffle').classList.toggle('active', isShuffle); // atualiza classe
});
document.getElementById('scRepeat')?.addEventListener('click', () => {
    isRepeat = !isRepeat; // alterna repeat
    document.getElementById('scRepeat').classList.toggle('active', isRepeat);
});

// funções para abrir e fechar a sidebar
function openSidebar() {
    document.getElementById('playerSidebar').classList.add('open');
    document.getElementById('playerSidebarOverlay').classList.add('open');
}
function closeSidebar() {
    document.getElementById('playerSidebar').classList.remove('open');
    document.getElementById('playerSidebarOverlay').classList.remove('open');
}

// event listeners para sidebar
document.getElementById('pbarExpand')?.addEventListener('click', openSidebar);
document.getElementById('sidebarClose')?.addEventListener('click', closeSidebar);
document.getElementById('playerSidebarOverlay')?.addEventListener('click', closeSidebar);

// event listener para o botão de música na navbar
document.getElementById('navMusic')?.addEventListener('click', () => {
    const bar = document.getElementById('playerBar');
    if (!bar.classList.contains('visible')) {
        bar.classList.add('visible'); // torna visível
        if (PLAYLIST.length) loadTrack(currentTrack); // carrega música atual
    }
    openSidebar(); // abre sidebar
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

// event listener para adicionar arquivo de música
document.getElementById('addTrackFile')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file); // cria url para o arquivo
    PLAYLIST.push({ title: file.name.replace(/\.[^.]+$/, ''), artist: 'arquivo local', src: url, cover: null }); // adiciona à playlist
    buildPlaylist(); // reconstrói a playlist
    currentTrack = PLAYLIST.length - 1; // define como atual
    loadTrack(currentTrack, true); // carrega e toca
    document.getElementById('playerBar').classList.add('visible');
});

// função para construir a lista de músicas na sidebar
function buildPlaylist() {
    const container = document.getElementById('sidebarPlaylist');
    container.innerHTML = '<p class="playlist-label">playlist</p>'; // título
    if (!PLAYLIST.length) {
        container.innerHTML += '<p style="font-size:0.8rem;color:rgba(240,246,252,0.3);font-family:monospace;padding:8px 0">nenhuma faixa. adicione arquivos mp3 em playlist no script.js</p>';
        return;
    }
    PLAYLIST.forEach((track, i) => {
        const item = document.createElement('div');
        item.className = 'playlist-item' + (i === currentTrack ? ' active' : ''); // classe ativa se atual
        item.dataset.index = i;
        item.innerHTML = `<span class="pl-num">${i + 1}</span><div class="pl-info"><div class="pl-title">${track.title}</div><div class="pl-artist">${track.artist}</div></div>`;
        item.addEventListener('click', () => {
            currentTrack = i;
            loadTrack(i, true); // carrega e toca
            document.getElementById('playerBar').classList.add('visible');
        });
        container.appendChild(item);
    });
}

// função para atualizar a ui da playlist (destacar música atual)
function updatePlaylistUI() {
    document.querySelectorAll('.playlist-item').forEach((el, i) => {
        el.classList.toggle('active', i === currentTrack); // adiciona classe ativa
    });
}

// ===== modal biografia =====
// funções para abrir e fechar o modal de biografia
function openBio() {
    document.getElementById('bioOverlay').classList.add('open');
    document.body.style.overflow = 'hidden'; // impede scroll
}
function closeBio() {
    document.getElementById('bioOverlay').classList.remove('open');
    document.body.style.overflow = ''; // restaura scroll
}
// event listeners para o modal
document.getElementById('openBio')?.addEventListener('click', openBio);
document.getElementById('bioClose')?.addEventListener('click', closeBio);
document.getElementById('bioOverlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('bioOverlay')) closeBio(); // fecha ao clicar no overlay
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'escape') { closeBio(); closeSidebar(); } // fecha com esc
});

// ===== navbar scroll =====
// adiciona classe 'scrolled' à navbar ao rolar
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 60); });

// ===== menu mobile =====
// toggle do menu de navegação
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open'); // abre/fecha menu
    const spans = navToggle.querySelectorAll('span');
    navLinks.classList.contains('open')
        ? (spans[0].style.transform='rotate(45deg) translate(5px,5px)', spans[1].style.opacity='0', spans[2].style.transform='rotate(-45deg) translate(5px,-5px)') // anima para x
        : (spans[0].style.transform='', spans[1].style.opacity='', spans[2].style.transform=''); // restaura
});
// fecha menu ao clicar em link
navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = spans[2].style.transform = '';
        spans[1].style.opacity = '';
    });
});

// ===== animações de reveal =====
// função para revelar elementos ao scroll
const revealAll = () => {
    document.querySelectorAll('.section-title,.section-label,.sobre-text,.sobre-cards,.info-card,.deploy-card,.deploy-coming,.contact-desc,.social-card').forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('visible'), i * 80); observer.unobserve(entry.target); } // anima com delay
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

// ===== animação das skills =====
// anima as barras de habilidades ao scroll
const animateSkills = () => {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-item').forEach((item, i) => { setTimeout(() => item.classList.add('animated'), i * 100); }); // anima cada item
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    const s = document.querySelector('#skills');
    if (s) skillObserver.observe(s);
};

// cores para linguagens de programação no github
const LANG_COLORS = { 'JavaScript':'#f1e05a','Python':'#3572A5','HTML':'#e34c26','CSS':'#563d7c','TypeScript':'#2b7489','Java':'#b07219','C#':'#178600','Shell':'#89e051','default':'#8b949e' };

// função assíncrona para carregar repositórios do github
async function loadGitHubRepos() {
    const grid = document.getElementById('reposGrid');
    const status = document.getElementById('githubStatus');
    const errorEl = document.getElementById('reposError');
    const username = 'antoniocarvalhoneto'; // nome de usuário
    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=9&type=public`); // busca repositórios
        if (!res.ok) throw new Error(`github api: ${res.status}`);
        const repos = await res.json();
        if (!repos.length) throw new Error('nenhum repositório público encontrado.');
        status.textContent = `${repos.length} repositório(s) encontrado(s)`; // atualiza status
        grid.innerHTML = '';
        repos.filter(r => !r.fork).slice(0, 6).forEach((repo, i) => { // filtra e limita a 6
            const langColor = LANG_COLORS[repo.language] || LANG_COLORS.default; // cor da linguagem
            const card = document.createElement('div');
            card.className = 'repo-card';
            card.style.animationDelay = `${i * 0.1}s`; // delay na animação
            card.innerHTML = `
                <div class="repo-name"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style="vertical-align:middle;margin-right:6px;opacity:0.6"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/></svg>${repo.name}</div>
                <p class="repo-desc">${repo.description || 'sem descrição disponível.'}</p>
                <div class="repo-meta">
                    ${repo.language ? `<span class="repo-lang"><span class="lang-dot" style="background:${langColor}"></span>${repo.language}</span>` : ''}
                    <span class="repo-stars">★ ${repo.stargazers_count}</span>
                    ${repo.updated_at ? `<span class="repo-lang" style="margin-left:auto;font-size:0.7rem;opacity:0.6">${timeAgo(repo.updated_at)}</span>` : ''}
                </div>
                <a href="${repo.html_url}" target="_blank" class="repo-link">ver repositório →</a>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.warn('github api error:', err.message); // log de erro
        grid.innerHTML = '';
        status.textContent = 'repositórios indisponíveis';
        errorEl.classList.add('visible');
        errorEl.classList.remove('hidden');
    }
}

// função para calcular tempo relativo (ex: "2d atrás")
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

// função para atualizar o link ativo na navbar baseado na seção visível
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

// função para efeito de digitação
function typeEffect(el, text, speed = 60) {
    el.textContent = '';
    let i = 0;
    const timer = setInterval(() => { el.textContent += text[i++]; if (i >= text.length) clearInterval(timer); }, speed);
}

// event listener quando o dom é carregado
document.addEventListener('DOMContentLoaded', () => {
    revealAll(); // inicia revelações
    animateSkills(); // inicia animações de skills
    loadGitHubRepos(); // carrega repositórios
    buildPlaylist(); // constrói playlist
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        subtitle.textContent = '';
        setTimeout(() => typeEffect(subtitle, originalText, 45), 800); // efeito de digitação no subtítulo
    }
});

