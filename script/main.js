/**
 * PORTFÓLIO PESSOAL E ACADÊMICO - JOÃO (IFSP - ADS)
 * Scripts em Vanilla JS ES6+ Puro
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollReveal();
  initNavigation();
  initDownloadHandler();
});

/**
 * --------------------------------------------------------------------------
 * Módulo 1: Alternador de Tema (Dark/Light Mode) com localStorage
 * --------------------------------------------------------------------------
 */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn?.querySelector('i');

  // Recupera o tema salvo ou usa 'dark' por padrão
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeIcon(true);
  } else {
    updateThemeIcon(false);
  }

  themeToggleBtn?.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    
    // Salva preferência no localStorage
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
  });

  function updateThemeIcon(isLight) {
    if (!themeIcon) return;
    if (isLight) {
      themeIcon.className = 'fas fa-sun';
      themeToggleBtn.setAttribute('aria-label', 'Alternar para Modo Escuro');
    } else {
      themeIcon.className = 'fas fa-moon';
      themeToggleBtn.setAttribute('aria-label', 'Alternar para Modo Claro');
    }
  }
}

/**
 * --------------------------------------------------------------------------
 * Módulo 2: Scroll Reveal com IntersectionObserver Nativo
 * --------------------------------------------------------------------------
 */
function initScrollReveal() {
  // Verifica se o navegador suporta IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    // Fallback: revela todos os elementos se o navegador for muito antigo
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('reveal-active'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        obs.unobserve(entry.target); // Para de observar após a animação de aparição
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/**
 * --------------------------------------------------------------------------
 * Módulo 3: Navegação Suave, Menu Mobile Hambúrguer & Active Link Tracker
 * --------------------------------------------------------------------------
 */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Alterna visibilidade do menu em telas mobile
  mobileMenuBtn?.addEventListener('click', () => {
    const isActive = navLinksContainer.classList.toggle('active');
    mobileMenuBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    const menuIcon = mobileMenuBtn.querySelector('i');
    if (menuIcon) {
      menuIcon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
    }
  });

  // Fecha o menu mobile ao clicar em qualquer link de navegação
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('active')) {
        navLinksContainer.classList.remove('active');
        const menuIcon = mobileMenuBtn?.querySelector('i');
        if (menuIcon) {
          menuIcon.className = 'fas fa-bars';
        }
      }
    });
  });

  // Destaca o link da navegação ativo conforme a rolagem da página
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');

      if (scrollPosition > sectionTop && scrollPosition <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * Módulo 4: Download Forçado e Instantâneo de PDF (Blob URL)
 * --------------------------------------------------------------------------
 */
function initDownloadHandler() {
  const downloadLinks = document.querySelectorAll('a[download]');

  downloadLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const fileUrl = link.getAttribute('href');
      const filename = link.getAttribute('download') || 'curriculo-joao-osorio.pdf';

      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('Não foi possível carregar o arquivo');
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.download = filename;
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);

        setTimeout(() => URL.revokeObjectURL(blobUrl), 200);
      } catch (err) {
        // Fallback: se o fetch falhar, dispara o comportamento nativo
        const tempLink = document.createElement('a');
        tempLink.href = fileUrl;
        tempLink.download = filename;
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
      }
    });
  });
}

