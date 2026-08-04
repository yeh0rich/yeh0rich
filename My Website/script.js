// ============================================
// RETRO MACINTOSH 3D — FULL SCRIPT v3
// yeh0rich virtual machine
// ============================================

let soundEnabled = true;

// Theme State
let currentTheme = localStorage.getItem('mac_theme') || 'classic';
// Theme apply is now at bottom in DOMContentLoaded

function setTheme(themeName) {
    document.body.classList.remove('theme-classic', 'theme-amber', 'theme-matrix', 'theme-blue', 'theme-party');
    if (themeName !== 'classic') {
        document.body.classList.add(`theme-${themeName}`);
    }
    currentTheme = themeName;
    localStorage.setItem('mac_theme', themeName);
    manageConfetti(themeName);
}

// Confetti Particle Engine
let confettiInterval;
function manageConfetti(theme) {
    if (confettiInterval) clearInterval(confettiInterval);
    document.querySelectorAll('.confetti-piece').forEach(el => el.remove());

    if (theme === 'party') {
        confettiInterval = setInterval(() => {
            if (document.hidden) return;
            const conf = document.createElement('div');
            conf.className = 'confetti-piece';
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.background = ['#ff0', '#0f0', '#00f', '#f0f', '#0ff'][Math.floor(Math.random()*5)];
            conf.style.width = (Math.random() * 6 + 4) + 'px';
            conf.style.height = (Math.random() * 8 + 6) + 'px';
            const duration = (Math.random() * 3 + 3); 
            conf.style.animationDuration = duration + 's';
            document.body.appendChild(conf);

            setTimeout(() => { if(conf.parentNode) conf.remove(); }, duration * 1000);
        }, 400);
    }
}
let machineState = 'booting'; // 'booting' | 'on' | 'off' | 'hello'

// ============================================
// BOOT SEQUENCE
// ============================================

function runBootSequence() {
    const bootScreen = document.getElementById('boot-screen');
    const progressContainer = document.getElementById('boot-progress-container');
    const progressBar = document.getElementById('boot-progress-bar');
    const bootText = document.getElementById('boot-text');
    const activeContent = document.getElementById('mac-active-content');

    activeContent.style.display = 'none';

    setTimeout(() => {
        progressContainer.classList.add('show');
        bootText.classList.add('show');

        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 18 + 5;
            if (progress >= 100) {
                progress = 100;
                progressBar.style.width = '100%';
                clearInterval(progressInterval);

                setTimeout(() => {
                    bootText.textContent = 'welcome to yehor avramenko machine';
                    setTimeout(() => {
                        // Attempt chime but don't let it hang the boot if it fails
                        try { playMacStartupChime(); } catch(e) {}
                        
                        bootScreen.classList.add('fade-out');
                        
                        // Explicitly clear any other layers that might be blocking
                        const helloScreen = document.getElementById('hello-screen');
                        if (helloScreen) helloScreen.classList.remove('active');

                        setTimeout(() => {
                            bootScreen.classList.add('hidden');
                            activeContent.style.display = 'flex';
                            machineState = 'on';
                            // Launch the intro text
                            if (typeof startTypeOutAnimation === 'function') {
                                startTypeOutAnimation();
                            }
                        }, 500);
                    }, 500);
                }, 300);
            } else {
                progressBar.style.width = `${progress}%`;
            }
        }, 120);
    }, 600);
}

// ============================================
// SHUTDOWN
// ============================================

function shutdownMachine() {
    if (machineState !== 'on') return;
    machineState = 'off';

    const activeContent = document.getElementById('mac-active-content');
    const shutdownScreen = document.getElementById('shutdown-screen');
    const shutdownHello = document.getElementById('shutdown-hello');
    const crtOverlay = document.getElementById('crt-overlay');

    activeContent.classList.add('shutting-down');
    playWindowSound('close');

    setTimeout(() => {
        activeContent.style.display = 'none';
        activeContent.classList.remove('shutting-down');
        shutdownScreen.classList.add('active');

        // Show hello SVG, then fade it out
        shutdownHello.classList.remove('fade-out');
        shutdownHello.style.opacity = '1';
        setTimeout(() => {
            shutdownHello.classList.add('fade-out');
        }, 500);

        crtOverlay.style.display = 'none';
    }, 450);
}

// ============================================
// POWER ON (same boot screen as restart)
// ============================================

function powerOnMachine() {
    if (machineState !== 'off') return;
    machineState = 'booting';

    const shutdownScreen = document.getElementById('shutdown-screen');
    const bootScreen = document.getElementById('boot-screen');
    const progressBar = document.getElementById('boot-progress-bar');
    const bootText = document.getElementById('boot-text');
    const progressContainer = document.getElementById('boot-progress-container');
    const crtOverlay = document.getElementById('crt-overlay');

    shutdownScreen.classList.remove('active');

    // Reset boot screen
    bootScreen.classList.remove('fade-out', 'hidden');
    progressBar.style.width = '0%';
    bootText.textContent = 'starting up...';
    progressContainer.classList.remove('show');
    bootText.classList.remove('show');

    crtOverlay.style.display = '';
    clearTextFields();

    playMacStartupChime();

    setTimeout(() => runBootSequence(), 300);
}

function clearTextFields() {
    document.getElementById('intro-text').innerHTML = '';
    document.getElementById('nickname-text').innerHTML = '';
    document.getElementById('role-text').innerHTML = '';
    document.getElementById('developer-text').innerHTML = '';
}

// ============================================
// RESTART
// ============================================

function restartMachine() {
    if (machineState !== 'on') return;
    machineState = 'booting';

    const activeContent = document.getElementById('mac-active-content');
    const bootScreen = document.getElementById('boot-screen');
    const progressBar = document.getElementById('boot-progress-bar');
    const bootText = document.getElementById('boot-text');
    const progressContainer = document.getElementById('boot-progress-container');

    activeContent.classList.add('shutting-down');
    playWindowSound('close');

    setTimeout(() => {
        activeContent.style.display = 'none';
        activeContent.classList.remove('shutting-down');

        bootScreen.classList.remove('fade-out', 'hidden');
        progressBar.style.width = '0%';
        bootText.textContent = 'restarting...';
        progressContainer.classList.remove('show');
        bootText.classList.remove('show');

        clearTextFields();
        setTimeout(() => runBootSequence(), 300);
    }, 450);
}

// ============================================
// SOUND EFFECTS
// ============================================

function playMacStartupChime() {
    if (!soundEnabled) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [261.63, 329.63, 392.00].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
            osc.start(ctx.currentTime + i * 0.02);
            osc.stop(ctx.currentTime + 1.2);
        });
    } catch (e) {}
}

function playWindowSound(action) {
    if (!soundEnabled) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'square';
        if (action === 'open') {
            osc.frequency.setValueAtTime(660, ctx.currentTime);
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.04);
        } else {
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.setValueAtTime(660, ctx.currentTime + 0.04);
        }
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
}

function playButtonSound() {
    if (!soundEnabled) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.03);
    } catch (e) {}
}

// ============================================
// 3D ROTATION — drag on scene-wrapper ONLY
// ============================================

function init3DRotation() {
    const sceneWrapper = document.getElementById('scene-wrapper');
    const container = document.getElementById('mac-3d-container');
    const rotator = document.getElementById('mac-3d-rotator');

    if (!sceneWrapper || !rotator) return;

    const isMobile = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
    if (isMobile) return;

    let isDragging = false;
    let startX, startY;
    let currentRotX = 2, currentRotY = 0;
    let targetRotX = 2, targetRotY = 0;

    // Only start drag from the scene-wrapper background (outside the Mac)
    sceneWrapper.addEventListener('mousedown', (e) => {
        if (isFullscreen) return; // Freeze when zoomed in
        
        // If user clicked on the Mac itself, a popup, dropdown, social link, or any interactive element — skip
        if (e.target.closest('.mac-3d-container') ||
            e.target.closest('.links-popup') ||
            e.target.closest('.minimized-widget') ||
            e.target.closest('.mac-dropdown') ||
            e.target.closest('.desk-area')) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        rotator.style.transition = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        targetRotY = currentRotY + deltaX * 0.5;
        targetRotX = currentRotX - deltaY * 0.3;
        targetRotX = Math.max(-30, Math.min(30, targetRotX));

        rotator.style.transform = `rotateX(${targetRotX}deg) rotateY(${targetRotY}deg)`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        currentRotX = targetRotX;
        currentRotY = targetRotY;
        rotator.style.transition = 'transform 0.05s linear';
    });

    // Subtle idle tracking when facing front
    document.addEventListener('mousemove', (e) => {
        if (isDragging || isFullscreen) return; // Freeze when zoomed in
        const normalizedRotY = ((currentRotY % 360) + 360) % 360;
        if (normalizedRotY > 45 && normalizedRotY < 315) return;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = (e.clientX - centerX) / centerX;
        const deltaY = (e.clientY - centerY) / centerY;

        const subtleRotY = currentRotY + deltaX * 2;
        const subtleRotX = currentRotX - deltaY * 1.5;

        rotator.style.transform = `rotateX(${subtleRotX}deg) rotateY(${subtleRotY}deg)`;
    });
}

// ============================================
// SOUND TOGGLE
// ============================================

function initSoundToggle() {
    const btn = document.getElementById('sound-toggle-btn');
    soundEnabled = (localStorage.getItem('sound') || 'enabled') === 'enabled';
    updateSoundIcon();

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSoundState();
    });
}

function toggleSoundState() {
    if (machineState !== 'on') return;
    soundEnabled = !soundEnabled;
    localStorage.setItem('sound', soundEnabled ? 'enabled' : 'disabled');
    updateSoundIcon();
    if (soundEnabled) playWindowSound('open');
}

function updateSoundIcon() {
    document.querySelectorAll('.sound-on-icon').forEach(on => {
        on.style.opacity = soundEnabled ? '1' : '0';
    });
    document.querySelectorAll('.sound-off-icon').forEach(off => {
        off.style.opacity = soundEnabled ? '0' : '1';
    });
}

// ============================================
// CASING LOGO = POWER ON/OFF BUTTON
// ============================================

function initCasingPowerButton() {
    const casingBtn = document.getElementById('casing-power-btn');
    const shutdownScreen = document.getElementById('shutdown-screen');

    casingBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playButtonSound();

        if (machineState === 'on') {
            shutdownMachine();
        } else if (machineState === 'off') {
            powerOnMachine();
        }
    });

    // Click shutdown screen to power on
    shutdownScreen.addEventListener('click', (e) => {
        e.stopPropagation();
        if (machineState === 'off') {
            playButtonSound();
            powerOnMachine();
        }
    });
}

// ============================================
// MENU BAR
// ============================================

function initMenuBar() {
    const menuLogo = document.getElementById('menu-logo-btn');
    const menuFile = document.getElementById('menu-file');
    const menuEdit = document.getElementById('menu-edit');
    const menuView = document.getElementById('menu-view');
    const menuSpecial = document.getElementById('menu-special');

    let activeDropdown = null;

    function createDropdown(parentEl, items) {
        closeAllDropdowns();
        const dropdown = document.createElement('div');
        dropdown.className = 'mac-dropdown show';
        const parentRect = parentEl.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${parentRect.bottom}px`;
        dropdown.style.left = `${parentRect.left}px`;

        items.forEach(item => {
            if (item === '---') {
                const d = document.createElement('div');
                d.className = 'mac-dropdown-divider';
                dropdown.appendChild(d);
            } else {
                const mi = document.createElement('div');
                mi.className = `mac-dropdown-item${item.disabled ? ' disabled' : ''}`;
                mi.textContent = item.label;
                
                if (item.submenu) {
                    mi.classList.add('has-submenu');
                    const arrow = document.createElement('span');
                    arrow.textContent = ' ▶';
                    arrow.className = 'submenu-arrow';
                    mi.appendChild(arrow);
                    
                    const subContainer = document.createElement('div');
                    subContainer.className = 'mac-dropdown submenu';
                    
                    item.submenu.forEach(subItem => {
                        const sub = document.createElement('div');
                        sub.className = `mac-dropdown-item ${subItem.value === currentTheme ? 'active-theme' : ''}`;
                        sub.textContent = subItem.label;
                        sub.addEventListener('click', (e) => {
                            e.stopPropagation();
                            playButtonSound();
                            setTheme(subItem.value);
                            closeAllDropdowns();
                        });
                        subContainer.appendChild(sub);
                    });
                    mi.appendChild(subContainer);
                } else if (item.action && !item.disabled) {
                    mi.addEventListener('click', () => {
                        playButtonSound();
                        item.action();
                        closeAllDropdowns();
                    });
                }
                dropdown.appendChild(mi);
            }
        });

        document.body.appendChild(dropdown);
        activeDropdown = dropdown;
        parentEl.classList.add('active');

        setTimeout(() => {
            document.addEventListener('click', closeAllDropdowns, { once: true });
        }, 10);
    }

    function closeAllDropdowns() {
        if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; }
        [menuLogo, menuFile, menuEdit, menuView, menuSpecial].forEach(el => {
            if (el) { el.classList.remove('active'); }
        });
    }

    // Logo menu — contains About, Restart, Shut Down
    menuLogo.addEventListener('click', (e) => {
        e.stopPropagation();
        if (machineState !== 'on') return;
        playButtonSound();
        createDropdown(menuLogo, [
            { label: 'about this machine', action: () => handleAppClick('about') },
            '---',
            { label: 'restart', action: () => restartMachine() },
            { label: 'shut down', action: () => shutdownMachine() },
        ]);
    });

    // File menu — shortcuts to sections
    menuFile.addEventListener('click', (e) => {
        e.stopPropagation();
        if (machineState !== 'on') return;
        playButtonSound();
        createDropdown(menuFile, [
            { label: 'about me', action: () => handleAppClick('about') },
            { label: 'my links', action: () => handleAppClick('links') },
            { label: 'my work', action: () => handleAppClick('work') },
            '---',
            { label: 'faq', action: () => handleAppClick('faq') },
            { label: 'contact', action: () => handleAppClick('contact') },
        ]);
    });

    menuEdit.addEventListener('click', (e) => {
        e.stopPropagation();
        if (machineState !== 'on') return;
        playButtonSound();
        createDropdown(menuEdit, [
            { label: 'undo', disabled: true },
            '---',
            { label: 'cut', disabled: true },
            { label: 'copy', disabled: true },
            { label: 'paste', disabled: true },
        ]);
    });

    menuView.addEventListener('click', (e) => {
        e.stopPropagation();
        if (machineState !== 'on') return;
        playButtonSound();
        createDropdown(menuView, [
            { label: 'by icon', disabled: true },
            { label: 'by name', disabled: true },
            '---',
            { label: 'clean up', disabled: true },
        ]);
    });

    menuSpecial.addEventListener('click', (e) => {
        e.stopPropagation();
        if (machineState !== 'on') return;
        playButtonSound();
        createDropdown(menuSpecial, [
            { label: 'empty trash', action: () => handleAppClick('trash') },
            '---',
            { 
                label: 'custom themes', 
                submenu: [
                    { label: 'classic green', value: 'classic' },
                    { label: 'amber monochrome', value: 'amber' },
                    { label: 'matrix core', value: 'matrix' },
                    { label: 'ice blue', value: 'blue' },
                    { label: 'partyyyyyy!', value: 'party' }
                ]
            },
            { label: 'degauss screen', action: () => triggerDegauss() },
            { label: 'do a barrel roll', action: () => doBarrelRoll() }
        ]);
    });
}

// ============================================
// TOOLTIP
// ============================================

function showTooltip(message, targetElement) {
    const existing = document.querySelector('.tooltip');
    if (existing) existing.remove();

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;

    const rect = targetElement.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.top = `${rect.top - 35}px`;
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.zIndex = '10000';

    document.body.appendChild(tooltip);

    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.style.animation = 'tooltipFadeOut 0.2s ease';
            setTimeout(() => { if (tooltip.parentNode) tooltip.remove(); }, 200);
        }
    }, 2000);
}

// ============================================
// FLY-INTO-SCREEN ANIMATION SYSTEM
// ============================================

let fullscreenOverlay = null;
let isFullscreen = false;
let pendingSection = null;

function flyIntoScreen(sectionId) {
    if (isFullscreen || machineState !== 'on') return;
    isFullscreen = true;
    pendingSection = sectionId;

    playWindowSound('open');

    const wrapper = document.getElementById('scene-wrapper');
    const rotator = document.getElementById('mac-3d-rotator');
    const screen = document.querySelector('.macintosh-screen');

    // 1. Instantly reset rotation so the screen is perfectly flat
    rotator.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    rotator.style.transform = 'rotateX(0deg) rotateY(0deg)';

    setTimeout(() => {
        // Compute exact transformOrigin to center the Mac screen in the viewport for the 3D cinematic zoom
        if (screen && wrapper) {
            const screenRect = screen.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
            const originX = ((screenRect.left + screenRect.width / 2) - wrapperRect.left) / wrapperRect.width * 100;
            const originY = ((screenRect.top + screenRect.height / 2) - wrapperRect.top) / wrapperRect.height * 100;
            wrapper.style.transformOrigin = `${originX}% ${originY}%`;
        }

        // Start chassis cinematic zoom toward camera
        document.body.classList.add('flying-in');

        // Show the giant 2D Icon overlay
        const overlay = createDesktop2DOverlay();
        document.body.appendChild(overlay);
        
        // Sync overlay origin with the chassis
        if (screen && wrapper) {
            const screenRect = screen.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
            const originX = ((screenRect.left + screenRect.width / 2) - wrapperRect.left) / wrapperRect.width * 100;
            const originY = ((screenRect.top + screenRect.height / 2) - wrapperRect.top) / wrapperRect.height * 100;
            overlay.style.transformOrigin = `${originX}% ${originY}%`;
        }
        
        // Trigger overlay fade-in simultaneously with the camera zoom!
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
        });

        // Wait 600ms for CSS transition
        setTimeout(() => {
            document.body.classList.add('fullscreen-active');
            if (sectionId) handleAppClick(sectionId);
        }, 600);

    }, 450); // wait for rotator to level out
}

function createDesktop2DOverlay() {
    let overlay = document.getElementById('desktop-2d-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'desktop-2d-overlay';
    overlay.className = 'desktop-2d-overlay';
    
    overlay.innerHTML = `
        <div class="mac-menu-bar overlay-topbar">
            <div class="menu-left">
                <div class="menu-item menu-logo-btn" id="menu-logo-btn-overlay">
                    <img src="images/pixellogo.svg" alt="Logo" class="menu-logo-img">
                </div>
                <div class="menu-item" id="menu-file-overlay">file</div>
                <div class="menu-item" id="menu-edit-overlay">edit</div>
                <div class="menu-item" id="menu-view-overlay">view</div>
                <div class="menu-item" id="menu-special-overlay">special</div>
            </div>
            <div class="menu-right" style="display:flex; align-items: stretch;">
                <div class="menu-item" id="overlay-close-btn" style="display:flex; align-items:center; gap: 8px;">
                    back to desk <i class="fas fa-times"></i>
                </div>
                <div class="menu-item menu-sound" id="sound-toggle-btn-overlay" style="display:flex; align-items:center;">
                    <i class="fas fa-volume-up sound-on-icon"></i>
                    <i class="fas fa-volume-mute sound-off-icon"></i>
                </div>
            </div>
        </div>
        
        <div class="desktop-icons">
            <div class="desktop-icon" data-section="about">
                <div class="icon-image"><i class="fas fa-info-circle"></i></div>
                <span class="icon-label">about</span>
            </div>
            <div class="desktop-icon" data-section="links">
                <div class="icon-image"><i class="fas fa-link"></i></div>
                <span class="icon-label">links</span>
            </div>
            <div class="desktop-icon" data-section="work">
                <div class="icon-image"><i class="fas fa-folder"></i></div>
                <span class="icon-label">work</span>
            </div>
            <div class="desktop-icon" data-section="faq">
                <div class="icon-image"><i class="fas fa-question-circle"></i></div>
                <span class="icon-label">faq</span>
            </div>
            <div class="desktop-icon" data-section="contact">
                <div class="icon-image"><i class="fas fa-envelope"></i></div>
                <span class="icon-label">contact</span>
            </div>
        </div>
    `;

    overlay.querySelector('#overlay-close-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        flyOutOfScreen();
    });

    const overlaySound = overlay.querySelector('#sound-toggle-btn-overlay');
    if (overlaySound) {
        overlaySound.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSoundState();
        });
    }

    overlay.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            playButtonSound();
            handleAppClick(icon.getAttribute('data-section'));
        });
    });

    // Permanent Interaction Hint
    const interactionHint = document.createElement('div');
    interactionHint.className = 'desktop-interaction-hint';
    interactionHint.innerHTML = '<i class="fas fa-window-maximize"></i> minimize, fullscreen, and drag windows';
    overlay.appendChild(interactionHint);

    // Setup duplicate dropdowns
    function createTempDropdown(parentEl, items) {
        const existing = document.querySelector('.mac-dropdown');
        if (existing) existing.remove();
        
        const dropdown = document.createElement('div');
        dropdown.className = 'mac-dropdown show';
        const parentRect = parentEl.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${parentRect.bottom}px`;
        dropdown.style.left = `${parentRect.left}px`;
        dropdown.style.zIndex = '10001';

        items.forEach(item => {
            if (item === '---') {
                const d = document.createElement('div');
                d.className = 'mac-dropdown-divider';
                dropdown.appendChild(d);
            } else {
                const mi = document.createElement('div');
                mi.className = `mac-dropdown-item${item.disabled ? ' disabled' : ''}`;
                mi.textContent = item.label;
                
                if (item.submenu) {
                    mi.classList.add('has-submenu');
                    const arrow = document.createElement('span');
                    arrow.textContent = ' ▶';
                    arrow.className = 'submenu-arrow';
                    mi.appendChild(arrow);
                    
                    const subContainer = document.createElement('div');
                    subContainer.className = 'mac-dropdown submenu';
                    
                    item.submenu.forEach(subItem => {
                        const sub = document.createElement('div');
                        sub.className = `mac-dropdown-item ${subItem.value === currentTheme ? 'active-theme' : ''}`;
                        sub.textContent = subItem.label;
                        sub.addEventListener('click', (e) => {
                            e.stopPropagation();
                            playButtonSound();
                            setTheme(subItem.value);
                            dropdown.remove();
                            parentEl.classList.remove('active');
                        });
                        subContainer.appendChild(sub);
                    });
                    mi.appendChild(subContainer);
                } else if (item.action && !item.disabled) {
                    mi.addEventListener('click', () => {
                        playButtonSound();
                        item.action();
                        dropdown.remove();
                        parentEl.classList.remove('active');
                    });
                }
                dropdown.appendChild(mi);
            }
        });

        document.body.appendChild(dropdown);
        parentEl.classList.add('active');

        setTimeout(() => {
            document.addEventListener('click', () => {
                dropdown.remove();
                parentEl.classList.remove('active');
            }, { once: true });
        }, 10);
    }

    const logo = overlay.querySelector('#menu-logo-btn-overlay');
    const file = overlay.querySelector('#menu-file-overlay');
    const edit = overlay.querySelector('#menu-edit-overlay');
    const view = overlay.querySelector('#menu-view-overlay');
    const special = overlay.querySelector('#menu-special-overlay');

    if (logo) logo.addEventListener('click', (e) => { e.stopPropagation(); playButtonSound(); createTempDropdown(logo, [{label: 'about this machine', action: () => handleAppClick('about')}, '---', {label: 'restart', action: () => restartMachine()}, {label: 'shut down', action: () => shutdownMachine()}]); });
    if (file) file.addEventListener('click', (e) => { e.stopPropagation(); playButtonSound(); createTempDropdown(file, [{label: 'about me', action: () => handleAppClick('about')}, {label: 'my links', action: () => handleAppClick('links')}, {label: 'my work', action: () => handleAppClick('work')}, '---', {label: 'faq', action: () => handleAppClick('faq')}, {label: 'contact', action: () => handleAppClick('contact')}]); });
    if (edit) edit.addEventListener('click', (e) => { e.stopPropagation(); playButtonSound(); createTempDropdown(edit, [{label:'undo', disabled:true},'---',{label:'cut', disabled:true},{label:'copy', disabled:true},{label:'paste', disabled:true}]); });
    if (view) view.addEventListener('click', (e) => { e.stopPropagation(); playButtonSound(); createTempDropdown(view, [{label:'as icons', disabled:true},{label:'as list', disabled:true}]); });
    if (special) {
        special.addEventListener('click', (e) => {
            e.stopPropagation();
            playButtonSound();
            createTempDropdown(special, [
                { label: 'empty trash', action: () => handleAppClick('trash') },
                '---',
                { 
                    label: 'custom themes', 
                    submenu: [
                        { label: 'classic green', value: 'classic' },
                        { label: 'amber monochrome', value: 'amber' },
                        { label: 'matrix core', value: 'matrix' },
                        { label: 'ice blue', value: 'blue' },
                        { label: 'partyyyyyy!', value: 'party' }
                    ]
                },
                { label: 'degauss screen', action: () => triggerDegauss() },
                { label: 'do a barrel roll', action: () => doBarrelRoll() }
            ]);
        });
    }

    return overlay;
}

// ============================================
// EASTER EGGS LOGIC
// ============================================

function openThemesPopup() {
    createPopup('themes-popup', 'Monitors & Sound', `
        <div class="themes-container" style="padding:10px;">
            <h3 style="font-family: var(--font-retro); text-decoration: underline; margin-bottom:15px; font-size:16px;">Select Display Tone</h3>
            <div style="display:flex; flex-direction:column; gap:12px; font-family: var(--font-retro); font-size:14px; margin-left: 5px;">
                <label style="cursor:pointer;"><input type="radio" name="theme_select" value="classic" ${currentTheme==='classic'?'checked':''}> Classic Green</label>
                <label style="cursor:pointer;"><input type="radio" name="theme_select" value="amber" ${currentTheme==='amber'?'checked':''}> Amber Monochrome</label>
                <label style="cursor:pointer;"><input type="radio" name="theme_select" value="matrix" ${currentTheme==='matrix'?'checked':''}> Matrix Core</label>
                <label style="cursor:pointer;"><input type="radio" name="theme_select" value="blue" ${currentTheme==='blue'?'checked':''}> Ice Blue</label>
                <label style="cursor:pointer;"><input type="radio" name="theme_select" value="party" ${currentTheme==='party'?'checked':''}> Partyyyyyy!</label>
            </div>
            <div style="margin-top:20px; display:flex; justify-content:flex-end;">
                <button id="apply-theme-btn" style="padding: 6px 14px; font-family: var(--font-retro); cursor:pointer; background:#fff; border:2px solid #000; font-weight:bold; font-size:14px; height: 28px; letter-spacing: 1px;">Apply</button>
            </div>
        </div>
    `, document.body);

    setTimeout(() => {
        const btn = document.getElementById('apply-theme-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                playButtonSound();
                const selected = document.querySelector('input[name="theme_select"]:checked').value;
                setTheme(selected);
                const popup = document.getElementById('popup-monitors-&-sound');
                if (popup) popup.querySelector('.close-button').click();
            });
        }
    }, 100);
}

function triggerDegauss() {
    if (machineState !== 'on') return;
    if (soundEnabled) playWindowSound('open');
    document.body.classList.add('degauss-active');
    setTimeout(() => {
        document.body.classList.remove('degauss-active');
    }, 800);
}

function doBarrelRoll() {
    const rotator = document.querySelector('.mac-3d-rotator');
    if (!rotator || rotator.classList.contains('doing-barrel-roll')) return;
    if (soundEnabled) playWindowSound('open');
    rotator.classList.add('doing-barrel-roll');
    setTimeout(() => {
        rotator.classList.remove('doing-barrel-roll');
    }, 1500);
}

function emptyTrashEasterEgg() {
    let delay = 0;
    if (isFullscreen) {
        flyOutOfScreen();
        delay = 600;
    }
    
    setTimeout(() => {
        if (soundEnabled) playWindowSound('open');
        const bin = document.getElementById('retro-trash-bin');
        if (!bin) return;

        bin.classList.add('show');

        setTimeout(() => {
            bin.classList.add('lid-open');
        }, 600);

        setTimeout(() => {
            const rotator = document.querySelector('.mac-3d-rotator');
            if (rotator) rotator.classList.add('sucked-into-trash');
        }, 900);

        setTimeout(() => {
            bin.classList.remove('lid-open');
            if (soundEnabled) {
                playWindowSound('open');
                setTimeout(() => playWindowSound('open'), 150);
            }
            
            setTimeout(() => {
                bin.classList.remove('show');
            }, 600);
            
            setTimeout(() => {
                const rotator = document.querySelector('.mac-3d-rotator');
                if (!rotator) return;
                
                rotator.style.transition = 'none';
                rotator.classList.remove('sucked-into-trash');
                rotator.style.transform = 'translateY(-200vh) rotateX(2deg) rotateY(0deg)';
                
                rotator.offsetHeight; 

                rotator.style.transition = 'transform 1s cubic-bezier(0.34, 1.56, 0.2, 1.2)';
                rotator.style.transform = 'translateY(0) rotateX(2deg) rotateY(0deg)';
                
                if (soundEnabled) {
                    setTimeout(() => playWindowSound('close'), 900); // Thud impact
                }

                // Clean up inline styles so the user can interact instantly
                setTimeout(() => {
                    rotator.style.transition = '';
                    rotator.style.transform = '';
                }, 1200);

            }, 1000);

        }, 1800);
    }, delay);
}

function flyOutOfScreen() {
    if (!isFullscreen) return;

    playWindowSound('close');
    
    // Clean workspace
    document.querySelectorAll('.links-popup').forEach(p => p.remove());
    document.querySelectorAll('.minimized-widget').forEach(w => w.remove());

    const overlay = document.getElementById('desktop-2d-overlay');
    if (overlay) {
        // Force sync with chassis transition
        overlay.classList.remove('visible');
    }

    // Smoothly shrink back by removing flying-in
    // We keep fullscreen-active slightly longer or remove it with flying-in
    document.body.classList.remove('flying-in');
    document.body.classList.remove('fullscreen-active');
    
    setTimeout(() => {
        if (overlay) overlay.remove();
        isFullscreen = false;
        pendingSection = null;
        
        // Reset origin once transition is fully done to avoid jumps
        const wrapper = document.querySelector('.scene-wrapper');
        if (wrapper) wrapper.style.transformOrigin = '50% 50%';
    }, 650); // Match 0.6s transition + buffer
}

function openFsPopup(sectionId) {
    playButtonSound();
    switch (sectionId) {
        case 'about': openAboutPopup(); break;
        case 'links': openLinksPopup(); break;
        case 'work': openWorkPopup(); break;
        case 'faq': openFaqPopup(); break;
        case 'contact': openContactPopup(); break;
    }
}

// ============================================
// POPUP SYSTEM
// ============================================

function createMacOSPopup(title, content) {
    const popupId = 'popup-' + title.replace(/\s+/g, '-').toLowerCase();
    const existing = document.getElementById(popupId);

    if (existing) {
        // Find highest z-index across all popups
        const popups = document.querySelectorAll('.links-popup');
        let highestZ = 100;
        popups.forEach(p => {
            const z = parseInt(p.style.zIndex) || 100;
            if (z > highestZ) highestZ = z;
        });
        existing.style.zIndex = highestZ + 1;

        // If it was minimized to widget, restore it
        if (existing.restoreFunction) {
            existing.restoreFunction();
        } else if (existing.style.display === 'none') {
            existing.style.display = 'block';
            playWindowSound('open');
        } else {
            // Already open and up top, just play sound
            playWindowSound('open');
        }
        return existing;
    }

    const popup = document.createElement('div');
    popup.className = 'links-popup';
    popup.id = popupId;
    popup.innerHTML = `
        <div class="links-popup-header">
            <div class="close-button"></div>
            <div class="yellow-button"></div>
            <div class="green-button"></div>
            <span>${title}</span>
        </div>
        <div class="links-popup-content">${content}</div>
    `;

    const defaultWidth = 400;
    const isMobile = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
    let x, y;

    if (isMobile) {
        const w = window.innerWidth - 24;
        let h = Math.min(window.innerHeight - 50, 480);
        if (title === 'frequently asked questions' || title === 'about' || title === 'contact') {
            h = Math.min(window.innerHeight - 50, 650);
        }
        x = (window.innerWidth - w) / 2;
        y = (window.innerHeight - h) / 2;
        popup.style.width = `${w}px`;
        popup.style.height = `${h}px`;
    } else {
        x = (window.innerWidth - defaultWidth) / 2;
        y = (window.innerHeight - 300) / 2 - 60;
    }

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    // Always place new windows on top
    const popups = document.querySelectorAll('.links-popup');
    let highestZ = 100;
    popups.forEach(p => {
        const z = parseInt(p.style.zIndex) || 100;
        if (z > highestZ) highestZ = z;
    });
    popup.style.zIndex = highestZ + 1;

    document.body.appendChild(popup);
    playWindowSound('open');

    // Close (×) = leftmost button
    popup.querySelector('.close-button').addEventListener('click', () => {
        closePopup(popup, x, y);
    });

    // Yellow = minimize
    popup.querySelector('.yellow-button').addEventListener('click', () => {
        if (popup.restoreFunction) return;
        const rect = popup.getBoundingClientRect();
        createMinimizedWidget(title, popup, rect);
        popup.style.display = 'none';
        playWindowSound('close');
    });

    // Green = fullscreen
    popup.querySelector('.green-button').addEventListener('click', () => {
        if (popup.restoreFunction) {
            popup.restoreFunction();
            return;
        }
        if (!popup.classList.contains('fullscreen')) {
            popup.classList.add('fullscreen');
        } else {
            popup.classList.remove('fullscreen');
            popup.style.width = '';
            popup.style.height = '';
            popup.style.left = `${x}px`;
            popup.style.top = `${y}px`;
        }
        playWindowSound('open');
    });

    // Dragging
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    const header = popup.querySelector('.links-popup-header');
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.close-button') || e.target.closest('.yellow-button') ||
            e.target.closest('.green-button')) return;
        isDragging = true;
        const rect = popup.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        popup.style.left = `${Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - popup.offsetWidth))}px`;
        popup.style.top = `${Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - popup.offsetHeight))}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Focus window when clicking anywhere on it
    popup.addEventListener('mousedown', () => {
        const popupsList = document.querySelectorAll('.links-popup');
        let hz = 100;
        popupsList.forEach(p => { const z = parseInt(p.style.zIndex) || 100; if (z > hz) hz = z; });
        popup.style.zIndex = hz + 1;
    });

    return popup;
}

function closePopup(popup, x, y) {
    if (popup.restoreFunction) {
        popup.restoreFunction(); 
    }
    popup.remove();
    playWindowSound('close');

    // Auto-zoom out perfectly if no other windows are active
    if (isFullscreen) {
        const remainingPopups = document.querySelectorAll('.links-popup').length;
        const remainingWidgets = document.querySelectorAll('.minimized-widget').length;
        if (remainingPopups === 0 && remainingWidgets === 0) {
            flyOutOfScreen();
        }
    }
}

// ============================================
// MINIMIZED WIDGETS
// ============================================

function createMinimizedWidget(title, originalPopup) {
    const widget = document.createElement('div');
    widget.className = 'minimized-widget';

    let icon = 'fas fa-window-maximize';
    if (title === 'links') icon = 'fas fa-link';
    else if (title === 'about') icon = 'fas fa-info-circle';
    else if (title === 'work') icon = 'fas fa-folder';
    else if (title === 'frequently asked questions') icon = 'fas fa-question-circle';
    else if (title === 'contact') icon = 'fas fa-envelope';

    widget.innerHTML = `<div class="widget-icon"><i class="${icon}"></i></div>`;

    const wh = 42, margin = 6, rightM = 16, startTop = 60;
    const existing = document.querySelectorAll('.minimized-widget');
    let y = startTop;

    for (let i = 0; i <= existing.length; i++) {
        const slotY = startTop + i * (wh + margin);
        let taken = false;
        existing.forEach(ew => {
            if (Math.abs(parseInt(ew.style.top) - slotY) < 5) taken = true;
        });
        if (!taken) { y = slotY; break; }
    }

    widget.style.right = `${rightM}px`;
    widget.style.top = `${y}px`;

    document.body.appendChild(widget);

    const restoreWindow = () => {
        originalPopup.style.display = 'block';
        originalPopup.restoreFunction = null;
        widget.remove();
        repositionWidgets();
        playWindowSound('open');
    };

    widget.addEventListener('click', restoreWindow);
    originalPopup.restoreFunction = restoreWindow;
}

function repositionWidgets() {
    const widgets = document.querySelectorAll('.minimized-widget');
    const wh = 42, margin = 6, rightM = 16, startTop = 60;
    const sorted = Array.from(widgets).sort((a, b) => (parseInt(a.style.top) || 0) - (parseInt(b.style.top) || 0));
    sorted.forEach((w, i) => {
        w.style.top = `${startTop + i * (wh + margin)}px`;
        w.style.right = `${rightM}px`;
    });
}

// ============================================
// POPUP OPENER FUNCTIONS (used from both Mac desktop and fullscreen)
// ============================================

function openAboutPopup() {
    const popup = createMacOSPopup('about', `
        <div class="about-content">
            <div class="mobile-scroll-disclaimer">scroll to see more content</div>
            <div class="about-header">
                <div class="profile-section">
                    <div class="profile-avatar">
                        <img src="images/yehorlogo.png" alt="Yehor Avramenko" onerror="this.style.display='none'">
                    </div>
                    <div class="profile-info">
                        <h2 class="profile-name">yehor avramenko</h2>
                        <p class="profile-title">web designer and developer</p>
                    </div>
                </div>
            </div>
            <div class="about-body">
                <p class="about-intro"><span class="greeting-highlight">hey, i'm yehor</span>, a passionate web designer and developer. i love creating beautiful, functional websites and bringing ideas to life through design and code.</p>
                <div class="scrollable-sections">
                    <div class="section"><h3>my expertise:</h3><ul class="skills-list">
                        <li><span class="expertise-marker"></span>creating responsive web designs</li>
                        <li><span class="expertise-marker"></span>building interactive user interfaces</li>
                        <li><span class="expertise-marker"></span>developing modern web applications</li>
                        <li><span class="expertise-marker"></span>optimizing for performance and accessibility</li>
                        <li><span class="expertise-marker"></span>coding telegram and discord bots</li>
                    </ul></div>
                    <div class="section"><h3>interests:</h3><ul class="skills-list">
                        <li><span class="expertise-marker"></span>web design and ui/ux</li>
                        <li><span class="expertise-marker"></span>programming and automation</li>
                        <li><span class="expertise-marker"></span>creative coding</li>
                        <li><span class="expertise-marker"></span>technology and innovation</li>
                    </ul></div>
                    <div class="section"><h3>achievements:</h3><ul class="skills-list">
                        <li><span class="expertise-marker"></span>completed multiple web projects</li>
                        <li><span class="expertise-marker"></span>developed custom telegram and discord bots</li>
                        <li><span class="expertise-marker"></span>created responsive designs</li>
                        <li><span class="expertise-marker"></span>optimized website performance</li>
                    </ul></div>
                    <div class="section"><h3>education:</h3><ul class="skills-list">
                        <li><span class="expertise-marker"></span>bachelor's at kharkiv national university of economics</li>
                        <li><span class="expertise-marker"></span>self-taught web development</li>
                        <li><span class="expertise-marker"></span>online courses and tutorials</li>
                        <li><span class="expertise-marker"></span>hands-on project experience</li>
                    </ul></div>
                    <div class="section"><h3>language proficiency:</h3><ul class="skills-list">
                        <li><span class="expertise-marker"></span>html, css, javascript</li>
                        <li><span class="expertise-marker"></span>python, node.js</li>
                        <li><span class="expertise-marker"></span>figma, procreate</li>
                        <li><span class="expertise-marker"></span>spoken: english, ukrainian, russian, a bit of german</li>
                    </ul></div>
                </div>
            </div>
        </div>
    `);
}

function openLinksPopup() {
    const popup = createMacOSPopup('links', `
        <div class="links-grid">
            <div class="link-item" data-url="https://www.linkedin.com/in/yeh0rich/"><div class="link-icon linkedin"><i class="fab fa-linkedin"></i></div><div class="link-label">linkedin</div></div>
            <div class="link-item" data-url="https://www.behance.net/yeh0rich"><div class="link-icon behance"><i class="fab fa-behance"></i></div><div class="link-label">behance</div></div>
            <div class="link-item" data-url="https://www.instagram.com/yeh0rich/"><div class="link-icon instagram"><img src="images/instagram.svg" alt="Instagram" style="width:1.1rem;height:1.1rem;"></div><div class="link-label">instagram</div></div>
            <div class="link-item" data-url="https://x.com/yeh0rich"><div class="link-icon twitter"><i class="fab fa-twitter"></i></div><div class="link-label">twitter</div></div>
            <div class="link-item" data-url="https://www.youtube.com/@realyeh0rich"><div class="link-icon youtube"><i class="fab fa-youtube"></i></div><div class="link-label">youtube</div></div>
            <div class="link-item" data-url="https://discord.gg/QTVwduMx8S"><div class="link-icon discord"><i class="fab fa-discord"></i></div><div class="link-label">discord</div></div>
            <div class="link-item" data-url="https://bsky.app/profile/kachiga.bsky.social"><div class="link-icon bluesky"><img src="images/bluesky.svg" alt="Bluesky" style="width:1.1rem;height:1.1rem;"></div><div class="link-label">bluesky</div></div>
            <div class="link-item" data-url="https://t.me/yeh0rich"><div class="link-icon telegram"><i class="fas fa-paper-plane"></i></div><div class="link-label">telegram</div></div>
            <div class="link-item" data-url="https://github.com/yeh0rich"><div class="link-icon github"><i class="fab fa-github"></i></div><div class="link-label">github</div></div>
        </div>
        <div class="links-instruction">clicking any link opens a new tab!</div>
    `);

    popup.querySelectorAll('.link-item').forEach(item => {
        item.addEventListener('click', () => {
            const url = item.dataset.url;
            if (url) { playButtonSound(); window.open(url, '_blank'); }
        });
    });
}

function openWorkPopup() {
    const popup = createMacOSPopup('work', `
        <div class="work-content">
            <div class="mobile-scroll-disclaimer">scroll to see more content</div>
            <div class="scrollable-sections">
                <div class="section"><h3>development:</h3><div class="skills-grid">
                    <div class="skill-item">html</div><div class="skill-item">css</div>
                    <div class="skill-item">javascript</div><div class="skill-item">python</div>
                    <div class="skill-item">node.js</div>
                </div></div>
                <div class="section"><h3>tools:</h3><div class="skills-grid">
                    <div class="skill-item">figma</div><div class="skill-item">canva</div>
                    <div class="skill-item">antigravity</div><div class="skill-item">cursor</div>
                    <div class="skill-item">pixelmator</div><div class="skill-item">procreate</div>
                    <div class="skill-item">vs code</div>
                </div></div>
                <div class="section"><h3>completed projects:</h3><ul class="skills-list">
                    <li><span class="expertise-marker"></span>my own website</li>
                    <li><span class="expertise-marker"></span>website for kharkiv dentist</li>
                    <li><a href="https://kharkivdentist.com" target="_blank" style="color: blue; text-decoration: none;">kharkivdentist.com</a></li>
                    <li><span class="expertise-marker"></span>more projects to come...</li>
                </ul></div>
            </div>
        </div>
    `);

    const isMobile = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
    if (!isMobile) {
        popup.style.width = '520px';
        popup.style.minWidth = '520px';
        popup.style.left = `${(window.innerWidth - 520) / 2}px`;
    }
}

function openFaqPopup() {
    const popup = createMacOSPopup('frequently asked questions', `
        <div class="faq-content"><div class="faq-list">
            <div class="faq-item"><div class="faq-question"><span>what software do you use?</span><i class="fas fa-chevron-down"></i></div><div class="faq-answer"><p>i use figma for design, procreate for digital art, and visual studio code for development.</p></div></div>
            <div class="faq-item"><div class="faq-question"><span>are you open to work?</span><i class="fas fa-chevron-down"></i></div><div class="faq-answer"><p>always open to new opportunities!</p></div></div>
            <div class="faq-item"><div class="faq-question"><span>what is your setup?</span><i class="fas fa-chevron-down"></i></div><div class="faq-answer"><p>macbook pro for development and design work, ipad pro with apple pencil for digital art.</p></div></div>
            <div class="faq-item"><div class="faq-question"><span>are the sound effects custom?</span><i class="fas fa-chevron-down"></i></div><div class="faq-answer"><p>yes! all sound effects are generated using javascript's web audio api in real-time.</p></div></div>
            <div class="faq-item"><div class="faq-question"><span>can i repost your work?</span><i class="fas fa-chevron-down"></i></div><div class="faq-answer"><p>with proper credit and permission, of course. always tag me and link back to my work.</p></div></div>
        </div></div>
    `);

    popup.querySelectorAll('.faq-item').forEach(item => {
        const q = item.querySelector('.faq-question');
        const a = item.querySelector('.faq-answer');
        const c = item.querySelector('.fas');
        q.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            popup.querySelectorAll('.faq-item').forEach(oi => {
                if (oi.classList.contains('open')) {
                    oi.classList.remove('open');
                    oi.querySelector('.faq-answer').style.maxHeight = '0';
                    oi.querySelector('.fas').style.transform = 'rotate(0deg)';
                }
            });
            if (!isOpen) {
                item.classList.add('open');
                a.style.maxHeight = a.scrollHeight + 'px';
                c.style.transform = 'rotate(180deg)';
                playWindowSound('open');
            } else {
                playWindowSound('close');
            }
        });
    });
}

function openContactPopup() {
    const popup = createMacOSPopup('contact', `
        <div class="contact-content">
            <div class="mobile-scroll-disclaimer">scroll to see more content</div>
            <div class="contact-header">
                <h2>contact me</h2>
                <p>for business inquiries, collaboration opportunities, or project discussions, please reach out via email. i respond within <span class="highlight-text">24 hours.</span></p>
            </div>
            <div class="contact-illustration"><img src="images/yehorlogo.png" alt="Yehor" class="contact-logo"></div>
            <div class="contact-info">
                <p>email me at: <a href="mailto:jeronymostyle@gmail.com" class="contact-email">jeronymostyle@gmail.com</a></p>
                <p>or press the button below to open your mail app.</p>
                <button class="contact-button">send me an email</button>
            </div>
        </div>
    `);

    popup.querySelector('.contact-button').addEventListener('click', () => {
        playButtonSound();
        window.open('mailto:jeronymostyle@gmail.com');
    });
}

// ============================================
// APP LAUNCH HANDLER
// ============================================

function handleAppClick(section) {
    if (machineState !== 'on') return;
    
    if (section === 'trash') {
        emptyTrashEasterEgg();
        return;
    }

    if (!isFullscreen) {
        flyIntoScreen(section);
    } else {
        switch (section) {
            case 'about': openAboutPopup(); break;
            case 'links': openLinksPopup(); break;
            case 'work': openWorkPopup(); break;
            case 'faq': openFaqPopup(); break;
            case 'contact': openContactPopup(); break;
        }
    }
}

// ============================================
// MAC DESKTOP ICON HANDLERS (trigger fly-in)
// ============================================

function initDesktopIcons() {
    const iconMap = {
        'about-icon': 'about',
        'links-btn': 'links',
        'work-btn': 'work',
        'faq-btn': 'faq',
        'contact-btn': 'contact'
    };

    Object.entries(iconMap).forEach(([id, section]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                if (machineState !== 'on') return;
                playButtonSound();
                handleAppClick(section);
            });
        }
    });
}

// ============================================
// EXIT BAR HANDLER
// ============================================

function initExitBar() {
    const exitBtn = document.getElementById('exit-fullscreen-btn');
    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            flyOutOfScreen();
        });
    }
}

// ============================================
// TYPE-OUT ANIMATION
// ============================================

function startTypeOutAnimation() {
    const introText = document.getElementById('intro-text');
    const nicknameText = document.getElementById('nickname-text');
    const roleText = document.getElementById('role-text');
    const developerText = document.getElementById('developer-text');

    const introMessage = "hey there, i'm";
    const roleMessage = "web designer and developer";
    const mobileRoleMessage = "web designer and";
    const developerMessage = "developer";

    let introIndex = 0, roleIndex = 0, developerIndex = 0;

    function typeIntro() {
        if (introIndex < introMessage.length) {
            if (introIndex > 0) introText.innerHTML = introText.innerHTML.replace('<span class="cursor"></span>', '');
            introText.innerHTML += introMessage.charAt(introIndex) + '<span class="cursor"></span>';
            introIndex++;
            setTimeout(typeIntro, 70);
        } else {
            introText.innerHTML = introText.innerHTML.replace('<span class="cursor"></span>', '');
            setTimeout(typeNickname, 300);
        }
    }

    function typeNickname() {
        nicknameText.innerHTML = '<span class="name-highlight">yehor avramenko</span>';
        setTimeout(typeRole, 300);
    }

    function typeRole() {
        const isMobile = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
        const msg = isMobile ? mobileRoleMessage : roleMessage;

        if (roleIndex < msg.length) {
            if (roleIndex > 0) roleText.innerHTML = roleText.innerHTML.replace('<span class="cursor"></span>', '');
            roleText.innerHTML += msg.charAt(roleIndex) + '<span class="cursor"></span>';
            roleIndex++;
            setTimeout(typeRole, 70);
        } else {
            roleText.innerHTML = roleText.innerHTML.replace('<span class="cursor"></span>', '');
            if (isMobile) setTimeout(typeDeveloper, 300);
        }
    }

    function typeDeveloper() {
        if (developerIndex < developerMessage.length) {
            if (developerIndex > 0) developerText.innerHTML = developerText.innerHTML.replace('<span class="cursor"></span>', '');
            developerText.innerHTML += developerMessage.charAt(developerIndex) + '<span class="cursor"></span>';
            developerIndex++;
            setTimeout(typeDeveloper, 70);
        } else {
            developerText.innerHTML = developerText.innerHTML.replace('<span class="cursor"></span>', '');
        }
    }

    setTimeout(typeIntro, 200);
}

// ============================================
// MOBILE
// ============================================

function showMobileNotification() {
    const n = document.getElementById('mobile-notification');
    const isMobile = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
    if (n && isMobile) setTimeout(() => n.classList.add('show'), 1000);
    else if (n) n.style.display = 'none';
}

function closeMobileNotification() {
    const n = document.getElementById('mobile-notification');
    if (n) { n.classList.remove('show'); setTimeout(() => n.style.display = 'none', 300); }
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initial theme set
    try { setTheme(currentTheme); } catch(e) { console.error("Theme init failed", e); }

    // Start boot sequence immediately
    runBootSequence();

    setTimeout(() => {
        try {
            initSoundToggle();
            initCasingPowerButton();
            initMenuBar();
            init3DRotation();
            initDesktopIcons();
            initExitBar();
            showMobileNotification();

            document.querySelectorAll('.social-icons a').forEach(link => {
                link.addEventListener('click', () => {
                    try { playButtonSound(); } catch(e) {}
                });
            });
        } catch(e) {
            console.error("Initialization error", e);
        }
    }, 2500);
});
