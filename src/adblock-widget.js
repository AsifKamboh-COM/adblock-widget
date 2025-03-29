// adblock-widget.js
(function() {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popIn {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }

        @keyframes progressBar {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
        }

        #adblock-alert {
            background: linear-gradient(135deg, #fffcfc 0%, #fff8f8 100%);
            border: 1px solid rgba(255, 68, 68, 0.15);
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
            font-family: 'Inter', system-ui, sans-serif;
            max-width: 640px;
            width: 90%;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            display: none;
            animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            will-change: transform, opacity;
        }

        #adblock-progress {
            position: absolute;
            top: 0;
            left: 0;
            height: 3px;
            width: 100%;
            background: linear-gradient(90deg, #ff4444 0%, rgba(255, 68, 68, 0.2) 100%);
            transform-origin: left;
        }

        @media (prefers-color-scheme: dark) {
            #adblock-alert {
                background: linear-gradient(135deg, #1A1A1A 0%, #251818 100%);
                border-color: rgba(255, 68, 68, 0.2);
            }
            #adblock-alert h3, #adblock-alert h4 { color: #FF6B6B !important; }
            #adblock-alert p, #adblock-alert li { color: #B0B0B0 !important; }
            #adblock-alert summary { background: rgba(255, 68, 68, 0.1) !important; }
            #adblock-alert details > div {
                background: rgba(255, 68, 68, 0.05) !important;
                border-color: rgba(255, 68, 68, 0.15) !important;
            }
            #adblock-alert button:last-child {
                border-color: #444 !important;
                color: #CCC !important;
            }
            #adblock-alert button:last-child svg path { stroke: #CCC !important; }
        }

        button:hover { opacity: 0.9; transform: translateY(-1px); }
        details > summary:hover { background: rgba(255, 68, 68, 0.08); }
        details[open] > summary svg:last-child { transform: rotate(180deg); }
    `;
    document.head.appendChild(style);

    // Create widget elements
    const widgetHTML = `
    <div id="adblock-alert">
        <div id="adblock-progress"></div>
        <div style="display: flex; gap: 16px; margin-bottom: 20px;">
            <div style="flex-shrink: 0; width: 44px; height: 44px; background: rgba(255, 68, 68, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                          stroke="#FF4444" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
            <div style="flex: 1;">
                <h3 style="margin: 0 0 4px 0; font-size: 1.25rem; font-weight: 600; color: #D32F2F; line-height: 1.4;">AdBlocker Detected</h3>
                <p style="margin: 0; color: #5F5F5F; font-size: 0.9375rem; line-height: 1.5;">
                    We noticed you're using an ad blocker. Our service relies on <strong>non-intrusive ads</strong> to remain free.  
                    Please consider disabling it to support us.
                </p>
            </div>
            <button onclick="dismissAlert()" style="align-self: flex-start; background: transparent; border: none; padding: 4px; margin: -4px -4px 0 0; cursor: pointer; opacity: 0.7; transition: opacity 0.2s;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="#888" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
        <details style="margin-bottom: 20px;">
            <summary style="display: flex; align-items: center; gap: 8px; color: #FF4444; font-size: 0.9375rem; font-weight: 500; cursor: pointer; padding: 8px 12px; border-radius: 6px; background: rgba(255, 68, 68, 0.05); list-style: none; transition: background 0.2s;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                          stroke="#FF4444" stroke-width="1.5"/>
                    <path d="M12 16V12M12 8H12.01" stroke="#FF4444" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>How to disable your ad blocker</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" 
                     style="margin-left: auto; transition: transform 0.2s;">
                    <path d="M6 9L12 15L18 9" stroke="#FF4444" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </summary>
            <div style="margin-top: 12px; padding: 16px; background: rgba(255, 68, 68, 0.03); border-radius: 8px; border: 1px solid rgba(255, 68, 68, 0.1);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                                      stroke="#FF4444" stroke-width="1.5"/>
                                <path d="M8 12H16M12 8V16" stroke="#FF4444" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            <h4 style="margin: 0; font-size: 0.9375rem; font-weight: 600; color: #D32F2F;">uBlock/AdGuard</h4>
                        </div>
                        <ol style="margin: 0; padding-left: 20px; color: #5F5F5F; font-size: 0.875rem; line-height: 1.6;">
                            <li>Click the extension icon</li>
                            <li>Toggle the <strong>power button</strong> off</li>
                            <li>Refresh this page</li>
                        </ol>
                    </div>
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                                      stroke="#FF4444" stroke-width="1.5"/>
                                <path d="M16 8L8 16M8 8L16 16" stroke="#FF4444" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            <h4 style="margin: 0; font-size: 0.9375rem; font-weight: 600; color: #D32F2F;">AdBlock Plus</h4>
                        </div>
                        <ol style="margin: 0; padding-left: 20px; color: #5F5F5F; font-size: 0.875rem; line-height: 1.6;">
                            <li>Click the <strong>ABP icon</strong></li>
                            <li>Select <strong>"Disable on this site"</strong></li>
                            <li>Refresh this page</li>
                        </ol>
                    </div>
                </div>
            </div>
        </details>
        <div style="display: flex; gap: 12px;">
            <button onclick="handleWhitelist()" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #FF4444 0%, #E53935 100%); color: white; border: none; padding: 12px; border-radius: 8px; font-size: 0.9375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(255, 68, 68, 0.2);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" 
                          stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                I've Whitelisted - Refresh
            </button>
            <button onclick="dismissAlert()" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: transparent; color: #5F5F5F; border: 1px solid #E0E0E0; padding: 12px; border-radius: 8px; font-size: 0.9375rem; font-weight: 500; cursor: pointer; transition: all 0.2s;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                          stroke="#5F5F5F" stroke-width="1.5"/>
                    <path d="M15 9L9 15M9 9L15 15" stroke="#5F5F5F" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Dismiss
            </button>
        </div>
    </div>
    <canvas id="confetti-canvas" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; display: none;"></canvas>
    `;
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Detection logic
    document.addEventListener("DOMContentLoaded", function() {
        setTimeout(checkAdBlock, 300);
    });

    async function checkAdBlock() {
        const testURLs = [
            'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
            'https://ads.example.com/analytics.js'
        ];

        const [googleAdsBlocked, fakeAnalyticsBlocked] = await Promise.all([
            testRequest(testURLs[0]),
            testRequest(testURLs[1])
        ]);
        
        const elementHidden = await testBaitElement();

        if ((googleAdsBlocked + fakeAnalyticsBlocked + elementHidden) >= 2) {
            showAlert();
        }
    }

    function testRequest(url) {
        return fetch(url, { 
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store'
        }).then(() => false).catch(() => true);
    }

    function testBaitElement() {
        return new Promise((resolve) => {
            const bait = document.createElement('div');
            bait.className = 'ad-placeholder';
            bait.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;';
            document.body.appendChild(bait);

            setTimeout(() => {
                const isBlocked = bait.offsetHeight === 0 || 
                               window.getComputedStyle(bait).display === 'none';
                document.body.removeChild(bait);
                resolve(isBlocked);
            }, 100);
        });
    }

    function showAlert() {
        const alert = document.getElementById('adblock-alert');
        const progress = document.getElementById('adblock-progress');
        
        // Reset animations
        alert.style.display = 'block';
        alert.style.animation = 'none';
        void alert.offsetHeight; // Trigger reflow
        progress.style.animation = 'none';
        void progress.offsetHeight; // Trigger reflow
        
        // Start animations
        alert.style.animation = 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        progress.style.animation = 'progressBar 10s linear forwards';
        
        // Start dismiss timer
        setTimeout(() => dismissAlert(), 10000);
    }

    window.dismissAlert = function() {
        const alert = document.getElementById('adblock-alert');
        alert.style.animation = 'none';
        alert.style.opacity = '0';
        alert.style.transform = 'translate(-50%, -50%) scale(0.95)';
        setTimeout(() => alert.style.display = 'none', 300);
    };

    window.handleWhitelist = function() {
        triggerConfetti();
        setTimeout(() => location.reload(), 800);
    };

    function triggerConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.style.display = 'block';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = Array.from({ length: 120 }, () => ({
            x: Math.random() * canvas.width,
            y: -Math.random() * canvas.height,
            size: Math.random() * 6 + 4,
            color: `hsl(${Math.random() * 30 + 340}, 90%, 60%)`,
            speed: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            rotation: Math.random() * 0.2 - 0.1
        }));

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                ctx.restore();
                
                p.y += p.speed;
                p.angle += p.rotation;
                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                }
            });
            requestAnimationFrame(animate);
        }
        animate();
        setTimeout(() => canvas.style.display = 'none', 2500);
    }
})();
