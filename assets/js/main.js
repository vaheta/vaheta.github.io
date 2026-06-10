document.addEventListener('DOMContentLoaded', function() {
    // Paper filtering functionality
    const paperFilterButtons = document.querySelectorAll('#papers-section .filter-btn');
    const paperItems = document.querySelectorAll('.paper-item');
    
    paperFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            paperFilterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Show/hide papers based on filter
            paperItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-year') === filterValue) {
                    item.style.display = 'flex';  // Use flex instead of block
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Combined feed filtering functionality
    const feedFilterButtons = document.querySelectorAll('.feed-filters .filter-btn');
    const feedItems = document.querySelectorAll('.feed-item');
    
    feedFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            feedFilterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Show/hide feed items based on filter
            feedItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-type') === filterValue) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Section navigation and filter selection
    const sectionLinks = document.querySelectorAll('.section-link');
    
    sectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Scroll to the section
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Get the filter value
                const filterValue = this.getAttribute('data-filter');
                
                // If there's a filter value, activate the corresponding filter button
                if (filterValue) {
                    // For papers section
                    if (targetId === '#papers-section' && filterValue === 'paper') {
                        const allPapersBtn = document.querySelector('#papers-section .filter-btn[data-filter="all"]');
                        if (allPapersBtn) {
                            allPapersBtn.click();
                        }
                    }
                    
                    // For the feed section, activate the corresponding filter
                    const feedFilterBtn = document.querySelector('.feed-filters .filter-btn[data-filter="' + filterValue + '"]');
                    if (feedFilterBtn) {
                        feedFilterBtn.click();
                    }
                }
            }
        });
    });
    
    // Smooth scrolling for other anchor links
    document.querySelectorAll('a[href^="#"]:not(.section-link)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Feed items fade in as they enter the viewport
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll('.feed-item').forEach(item => {
            item.classList.add('reveal');
            revealObserver.observe(item);
        });
    }

    // Profile photo as an interactive point cloud
    const frame = document.querySelector('.profile-frame');
    const canvas = document.getElementById('profile-pointcloud');
    const profileImg = frame ? frame.querySelector('.profile-image') : null;

    if (frame && canvas && profileImg && !prefersReducedMotion) {
        // Center-crop an image to a square and sample it on a GRID x GRID grid
        const sampleSquare = (image, grid) => {
            const off = document.createElement('canvas');
            off.width = grid;
            off.height = grid;
            const octx = off.getContext('2d', { willReadFrequently: true });
            const side = Math.min(image.naturalWidth, image.naturalHeight);
            octx.drawImage(
                image,
                (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side,
                0, 0, grid, grid
            );
            return octx.getImageData(0, 0, grid, grid).data;
        };

        // Matplotlib Spectral anchors — Depth Anything-style colormapped depth (red = near, purple = far)
        const SPECTRAL = [
            [158, 1, 66], [213, 62, 79], [244, 109, 67], [253, 174, 97],
            [254, 224, 139], [255, 255, 191], [230, 245, 152], [171, 221, 164],
            [102, 194, 165], [50, 136, 189], [94, 79, 162]
        ];

        const buildSpectralLut = () => {
            const steps = 64;
            const lut = [];
            for (let k = 0; k < steps; k++) {
                const t = k / (steps - 1) * (SPECTRAL.length - 1);
                const lo = SPECTRAL[Math.floor(t)];
                const hi = SPECTRAL[Math.min(Math.floor(t) + 1, SPECTRAL.length - 1)];
                const f = t - Math.floor(t);
                lut.push([
                    lo[0] + (hi[0] - lo[0]) * f,
                    lo[1] + (hi[1] - lo[1]) * f,
                    lo[2] + (hi[2] - lo[2]) * f,
                    1 - k / (steps - 1)
                ]);
            }
            return lut;
        };

        // Returns depth in [0, 1], 1 = near. Accepts grayscale (white = near) or Spectral-colormapped maps.
        const depthFromPixel = (lut, r, g, b) => {
            if (Math.abs(r - g) < 12 && Math.abs(g - b) < 12) {
                return r / 255;
            }
            let best = 0;
            let bestDist = Infinity;
            for (let k = 0; k < lut.length; k++) {
                const dr = r - lut[k][0], dg = g - lut[k][1], db = b - lut[k][2];
                const dist = dr * dr + dg * dg + db * db;
                if (dist < bestDist) {
                    bestDist = dist;
                    best = k;
                }
            }
            return lut[best][3];
        };

        const initPointCloud = depthImg => {
            const GRID = 120;
            const BG_Z = -0.2; // flat plane the white studio background sits on
            let data, depthData = null;
            try {
                data = sampleSquare(profileImg, GRID);
                if (depthImg) {
                    depthData = sampleSquare(depthImg, GRID);
                }
            } catch (e) {
                return; // canvas tainted (e.g. file:// preview) — keep the static photo
            }

            const lut = depthData ? buildSpectralLut() : null;
            const points = [];
            for (let gy = 0; gy < GRID; gy++) {
                for (let gx = 0; gx < GRID; gx++) {
                    const i = (gy * GRID + gx) * 4;
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
                    const sat = Math.max(r, g, b) - Math.min(r, g, b);
                    let z;
                    if (depthData) {
                        const d = depthFromPixel(lut, depthData[i], depthData[i + 1], depthData[i + 2]);
                        // White photo pixels that the depth map also calls far = studio backdrop, flattened
                        const isBackground = lum > 0.88 && sat < 40 && d < 0.5;
                        z = isBackground ? BG_Z : (d - 0.5) * 0.55;
                    } else {
                        z = (0.5 - lum) * 0.45;
                    }
                    points.push({
                        x: (gx + 0.5) / GRID - 0.5,
                        y: (gy + 0.5) / GRID - 0.5,
                        z: z,
                        color: 'rgb(' + r + ',' + g + ',' + b + ')',
                        sx: (Math.random() - 0.5) * 2.4,
                        sy: (Math.random() - 0.5) * 2.4,
                        sz: (Math.random() - 0.5) * 2.4,
                        delay: Math.random() * 0.5
                    });
                }
            }

            const ctx = canvas.getContext('2d');
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            let yaw = 0, pitch = 0, yawTarget = 0, pitchTarget = 0;
            let lastPointerMove = -Infinity;
            let startTime = null;
            const ASSEMBLE = 1.1; // seconds per point, after its delay

            const resize = () => {
                const rect = frame.getBoundingClientRect();
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
            };
            resize();
            window.addEventListener('resize', resize);

            const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

            window.addEventListener('pointermove', e => {
                if (e.pointerType === 'touch') return; // touch is for scrolling, not aiming
                const rect = frame.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const nx = clamp((e.clientX - cx) / 450, -1, 1);
                const ny = clamp((e.clientY - cy) / 450, -1, 1);
                yawTarget = -nx * 0.38;
                pitchTarget = -ny * 0.22;
                lastPointerMove = performance.now();
            }, { passive: true });

            // On mobile, tilting the device drives the parallax instead of the mouse.
            // iOS needs a permission gesture for orientation events, so it stays on the idle sway.
            let baseBeta = null, baseGamma = null;
            window.addEventListener('deviceorientation', e => {
                if (e.beta === null || e.gamma === null) return;
                if (baseBeta === null) {
                    baseBeta = e.beta;
                    baseGamma = e.gamma;
                    return;
                }
                yawTarget = clamp((e.gamma - baseGamma) / 25, -1, 1) * 0.32;
                pitchTarget = clamp((e.beta - baseBeta) / 25, -1, 1) * 0.18;
                lastPointerMove = performance.now();
            }, { passive: true });

            const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

            const render = now => {
                if (startTime === null) {
                    startTime = now;
                    frame.classList.add('pc-on');
                }
                const t = (now - startTime) / 1000;

                if (now - lastPointerMove > 4000) {
                    yawTarget = Math.sin(t * 0.45) * 0.18;
                    pitchTarget = Math.sin(t * 0.3) * 0.05;
                }
                yaw += (yawTarget - yaw) * 0.08;
                pitch += (pitchTarget - pitch) * 0.08;

                const w = canvas.width, h = canvas.height;
                ctx.clearRect(0, 0, w, h);

                const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
                const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
                const focal = 2.4;
                const scale = Math.min(w, h) * 0.92;
                const dotSize = Math.max(1.1 * dpr, scale / GRID * 0.95);

                for (let i = 0; i < points.length; i++) {
                    const p = points[i];
                    const prog = easeOutCubic(Math.min(Math.max((t - p.delay) / ASSEMBLE, 0), 1));
                    if (prog <= 0) continue;
                    const x = p.sx + (p.x - p.sx) * prog;
                    const y = p.sy + (p.y - p.sy) * prog;
                    const z = p.sz + (p.z - p.sz) * prog;

                    const rx = x * cosY - z * sinY;
                    let rz = x * sinY + z * cosY;
                    const ry = y * cosP - rz * sinP;
                    rz = y * sinP + rz * cosP;

                    const persp = focal / (focal - rz);
                    if (persp <= 0) continue;
                    const px = w / 2 + rx * persp * scale;
                    const py = h / 2 + ry * persp * scale;
                    const s = dotSize * persp * (0.4 + 0.6 * prog);

                    ctx.globalAlpha = prog;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(px - s / 2, py - s / 2, s, s);
                }
                ctx.globalAlpha = 1;
                requestAnimationFrame(render);
            };
            requestAnimationFrame(render);
        };

        const boot = () => {
            const depthSrc = profileImg.dataset.depth;
            if (!depthSrc) {
                initPointCloud(null);
                return;
            }
            const depthImg = new Image();
            depthImg.onload = () => initPointCloud(depthImg);
            depthImg.onerror = () => initPointCloud(null);
            depthImg.src = depthSrc;
        };

        if (profileImg.complete && profileImg.naturalWidth) {
            boot();
        } else {
            profileImg.addEventListener('load', boot);
        }
    }
});