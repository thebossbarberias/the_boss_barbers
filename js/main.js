document.addEventListener('DOMContentLoaded', () => {
    
    /* =======================================================
       1. MENÚ HAMBURGUESA (Común en ambas páginas)
       ======================================================= */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* =======================================================
       2. ANIMACIONES DE SCROLL (Común)
       ======================================================= */
    const revealTargets = document.querySelectorAll('.feature-card, .barber-card, .fresha-box, .contact-grid, .section-title, .section-subtitle, .accordion-item');
    if (revealTargets.length > 0) {
        revealTargets.forEach(el => el.classList.add('reveal'));

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('is-visible');
                    revealObserver.unobserve(el);
                    setTimeout(() => el.classList.remove('reveal'), 750);
                }
            });
        }, { threshold: 0.15 });

        revealTargets.forEach(el => revealObserver.observe(el));
    }

    /* =======================================================
       3. LÓGICA DE BARBEROS Y MODAL (Solo en Inicio)
       ======================================================= */
    const barberCards = document.querySelectorAll('.barber-card');
    if (barberCards.length > 0) {
        const modal = document.getElementById('modalGaleria');
        const cerrarModal = document.getElementById('cerrarModal');
        const modalImg = document.getElementById('modalImg');
        const modalThumbs = document.getElementById('modalThumbs');
        const modalName = document.getElementById('modalName');
        const modalRole = document.getElementById('modalRole');
        const modalBio = document.getElementById('modalBio');
        const modalBtn = document.getElementById('modalBtn');
        const prevModal = document.getElementById('prevModal');
        const nextModal = document.getElementById('nextModal');

        const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23121214'/%3E%3Ctext x='50%25' y='47%25' fill='%23C9A24B' font-family='sans-serif' font-size='20' text-anchor='middle'%3E%E2%9C%82%EF%B8%8F%3C/text%3E%3Ctext x='50%25' y='58%25' fill='%23A1A1A6' font-family='sans-serif' font-size='14' text-anchor='middle'%3EFoto pr%C3%B3ximamente%3C/text%3E%3C/svg%3E";

        let currentBarber = 0;
        let currentPhoto = 0;
        const barbersData = [];

        barberCards.forEach((card, index) => {
            const mainImg = card.querySelector('.barber-img').src;
            const name = card.querySelector('.barber-name').textContent;
            const role = card.querySelector('.barber-role').textContent;
            
            const bioElement = card.querySelector('.barber-bio');
            const bio = bioElement ? bioElement.textContent : 'Perfil del barbero en construcción.';
            
            const btnHref = card.querySelector('.btn').href;

            let extraPhotos = [];
            try {
                extraPhotos = JSON.parse(card.dataset.gallery || '[]');
            } catch (e) {
                extraPhotos = [];
            }

            const gallery = [mainImg, ...extraPhotos];
            barbersData.push({ gallery, name, role, bio, btnHref });

            const abrirPerfil = () => {
                currentBarber = index;
                currentPhoto = 0;
                abrirModal();
            };

            card.addEventListener('click', abrirPerfil);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    abrirPerfil();
                }
            });
        });

        function abrirModal() {
            actualizarModal();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function cerrarLaModal() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }

        function actualizarModal() {
            const data = barbersData[currentBarber];
            modalImg.src = data.gallery[currentPhoto];
            modalName.textContent = data.name;
            modalRole.textContent = data.role;
            modalBio.textContent = data.bio;
            modalBtn.href = data.btnHref;
            renderMiniaturas(data.gallery);
        }

        function renderMiniaturas(gallery) {
            modalThumbs.innerHTML = '';
            gallery.forEach((src, i) => {
                const thumb = document.createElement('img');
                thumb.src = src;
                thumb.alt = 'Miniatura del corte ' + (i + 1);
                thumb.className = 'modal-thumb' + (i === currentPhoto ? ' active' : '');
                thumb.addEventListener('click', () => {
                    currentPhoto = i;
                    actualizarModal();
                });
                thumb.addEventListener('error', () => { thumb.src = PLACEHOLDER_IMG; });
                modalThumbs.appendChild(thumb);
            });
        }

        modalImg.addEventListener('error', () => { modalImg.src = PLACEHOLDER_IMG; });

        nextModal.addEventListener('click', () => {
            const total = barbersData[currentBarber].gallery.length;
            currentPhoto = (currentPhoto + 1) % total;
            actualizarModal();
        });

        prevModal.addEventListener('click', () => {
            const total = barbersData[currentBarber].gallery.length;
            currentPhoto = (currentPhoto - 1 + total) % total;
            actualizarModal();
        });

        cerrarModal.addEventListener('click', cerrarLaModal);

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarLaModal();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (modal.style.display !== 'flex') return;
            if (e.key === 'Escape') cerrarLaModal();
            if (e.key === 'ArrowRight') nextModal.click();
            if (e.key === 'ArrowLeft') prevModal.click();
        });
    }

    /* =======================================================
       4. LÓGICA DE SERVICIOS Y FILTROS (Solo en Servicios)
       ======================================================= */
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    if (accordionHeaders.length > 0) {
        const accordionItems = document.querySelectorAll('.accordion-item');
        
        // Abre el primer acordeón por defecto
        accordionHeaders[0].parentElement.classList.add('active');

        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                item.classList.toggle('active');
            });
        });

        const filterBtns = document.querySelectorAll('.filter-btn');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.getAttribute('data-filter');

                accordionItems.forEach(item => {
                    if (category === 'todos' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                        if (category !== 'todos') {
                            item.classList.add('active');
                        }
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('active');
                    }
                });
            });
        });

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                const searchString = e.target.value.toLowerCase().trim();
                
                if(searchString === "") {
                    document.querySelector('.filter-btn[data-filter="todos"]').click();
                    accordionItems.forEach(item => item.classList.remove('active'));
                    if(accordionItems.length > 0) accordionItems[0].classList.add('active');
                    document.querySelectorAll('.price-item').forEach(item => item.style.display = 'block');
                    return;
                }

                filterBtns.forEach(b => b.classList.remove('active'));
                document.querySelector('.filter-btn[data-filter="todos"]').classList.add('active');

                accordionItems.forEach(accordion => {
                    const priceItems = accordion.querySelectorAll('.price-item');
                    let matchesInAccordion = 0;

                    priceItems.forEach(item => {
                        const name = item.querySelector('.price-name').textContent.toLowerCase();
                        const desc = item.querySelector('.price-desc').textContent.toLowerCase();

                        if (name.includes(searchString) || desc.includes(searchString)) {
                            item.style.display = 'block';
                            matchesInAccordion++;
                        } else {
                            item.style.display = 'none';
                        }
                    });

                    if (matchesInAccordion > 0) {
                        accordion.style.display = 'block';
                        accordion.classList.add('active');
                    } else {
                        accordion.style.display = 'none';
                        accordion.classList.remove('active');
                    }
                });
            });
        }
    }
});