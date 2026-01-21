(() => {
  const canvas = document.getElementById('game');
  const overlayMsg = document.getElementById('message');
  const scoreEl = document.getElementById('score');
  const ctx = canvas.getContext('2d');

  let width = 800; let height = 400; let scale = 1;
  const devicePixelRatio = window.devicePixelRatio || 1;

  function resize() {
    const vw = Math.max(window.innerWidth, 320);
    const vh = Math.max(window.innerHeight, 240);
    // keep 2:1 ratio (width:height)
    width = vw;
    height = vh;
    scale = devicePixelRatio;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(scale,0,0,scale,0,0);
  }
  resize();
  window.addEventListener('resize', resize);

  // player
  const player = { x: 80, y: 0, w: 28, h: 28, vy: 0, onGround: false };
  const gravity = 1400; // px/s^2
  const jumpVel = -520;

  let groundY = height - 80;
  function recalcGround(){ groundY = height - 80; }
  recalcGround();

  let obstacles = [];
  let spawnTimer = 0;
  let speed = 360; // px/s
  // level system (seconds thresholds)
  const levelThresholds = [0, 10, 25, 45, 70, 100]; // pass level 1 at 10s, 2 at 25s, etc.
  let currentLevel = 0;
  let elapsed = 0;
  // noise phase for smoother spike gaps
  let noisePhase = Math.random() * 1000;

  let last = performance.now();
  let running = false;
  let gameOver = false;
  let score = 0;

  function reset(){
    player.y = groundY - player.h;
    player.vy = 0;
    obstacles = [];
    spawnTimer = 0.8;
    speed = 360;
    running = false;
    gameOver = false;
    score = 0;
    overlayMsg.textContent = 'Click or press Space to start';
    scoreEl.textContent = '0';
    overlayMsg.style.display = 'block';
    currentLevel = 0;
    elapsed = 0;
  }

  function start(){
    running = true;
    overlayMsg.style.display = 'none';
    last = performance.now();
  }

  function spawnSpike(){
    // smoother size and vertical jitter
    const t = performance.now() / 1000;
    const size = 36 + Math.abs(Math.sin(t * 1.3 + noisePhase)) * 48; // 36..84
    const spike = { x: width + 40, w: size, h: size, type: 'triangle' };
    spike.y = groundY - spike.h;
    obstacles.push(spike);
  }

  function rectsCollide(a,b){
    return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
  }

  function update(dt){
    if(!running) return;
    elapsed += dt;
    // physics
    player.vy += gravity * dt;
    player.y += player.vy * dt;
    if(player.y + player.h >= groundY){ player.y = groundY - player.h; player.vy = 0; player.onGround = true; }
    else player.onGround = false;

    // spawn: use smooth noise to vary gap instead of pure random
    spawnTimer -= dt;
    if(spawnTimer <= 0){
      spawnSpike();
      // base gap reduces with level/speed, but with smooth variation
      const baseGap = Math.max(0.5, 0.9 - (currentLevel * 0.08));
      const jitter = (Math.sin(elapsed * 1.4 + noisePhase) + 1) * 0.25; // 0..0.5
      spawnTimer = baseGap + jitter + Math.random() * 0.18 * (1 - Math.min(1, currentLevel*0.12));
    }

    // move obstacles
    for(let i=obstacles.length-1;i>=0;i--){
      const o = obstacles[i];
      o.x -= speed * dt;
      if(o.x + o.w < -50) obstacles.splice(i,1);
      // collision bounding box
      if(rectsCollide({x:player.x,y:player.y,w:player.w,h:player.h}, {x:o.x,y:o.y,w:o.w,h:o.h})){
        running = false; gameOver = true; overlayMsg.style.display = 'block'; overlayMsg.textContent = 'Game Over — click or press Space to restart';
      }
    }

    // score and difficulty ramp
    score += dt * 10;
    scoreEl.textContent = Math.floor(score).toString();
    speed += dt * 8; // slight speed increase

    // level progression (check thresholds)
    for(let lvl = levelThresholds.length - 1; lvl >= 0; lvl--){
      if(elapsed >= levelThresholds[lvl] && lvl > currentLevel){
        currentLevel = lvl;
        // notify parent that a level was passed (levels are 1-based; ignore level 0)
        if(window.parent){
          try{ window.parent.postMessage({ type: 'game:levelPassed', level: currentLevel }, '*'); }catch(e){}
        }
      }
    }
  }

  function draw(){
    // clear
    ctx.fillStyle = '#111'; ctx.fillRect(0,0,width,height);
    // ground
    ctx.fillStyle = '#222'; ctx.fillRect(0,groundY, width, height-groundY);
    // player
    ctx.fillStyle = '#4ade80'; ctx.fillRect(player.x, player.y, player.w, player.h);
    // draw spikes
    ctx.fillStyle = '#ef4444';
    for(const o of obstacles){
      // triangle spike
      ctx.beginPath();
      ctx.moveTo(o.x, o.y + o.h);
      ctx.lineTo(o.x + o.w/2, o.y);
      ctx.lineTo(o.x + o.w, o.y + o.h);
      ctx.closePath();
      ctx.fill();
    }
    // simple shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(player.x+2, groundY-6, player.w, 6);
  }

  function loop(now){
    const dt = Math.min(0.05, (now - last)/1000);
    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  // input
  // control flow: request play authorization from parent before starting a new run
  let awaitingPlayApproval = false;
  function jump(){
    if(gameOver){ reset(); // after reset, require approval again
      // ask parent to allow play (deduct tokens)
      if(window.parent && !awaitingPlayApproval){ window.parent.postMessage({ type: 'game:requestPlay' }, '*'); awaitingPlayApproval = true; overlayMsg.textContent = 'Requesting play...'; }
      return; }
    if(!running){
      // ask parent to allow play (deduct tokens)
      if(window.parent && !awaitingPlayApproval){ window.parent.postMessage({ type: 'game:requestPlay' }, '*'); awaitingPlayApproval = true; overlayMsg.textContent = 'Requesting play...'; }
      return;
    }
    if(player.onGround){ player.vy = jumpVel; player.onGround = false; }
  }

  // listen for parent approval messages
  window.addEventListener('message', (e)=>{
    const msg = e.data || {};
    if(msg && msg.type === 'game:playAllowed'){
      awaitingPlayApproval = false; start();
    }
    if(msg && msg.type === 'game:insufficientTokens'){
      awaitingPlayApproval = false; overlayMsg.style.display = 'block'; overlayMsg.textContent = 'Insufficient tokens — please buy more';
    }
  });

  window.addEventListener('keydown', (e)=>{ if(e.code==='Space'){ e.preventDefault(); jump(); } });
  window.addEventListener('mousedown', (e)=>{ jump(); });
  window.addEventListener('touchstart', (e)=>{ e.preventDefault(); jump(); }, {passive:false});

  // initialize
  reset();
  requestAnimationFrame(loop);

  // expose for debug
  window.__IMP = { reset, start };
})();
