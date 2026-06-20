// js/dot-grid.js
//
// For every <canvas class="dot-grid"> on the page, this draws a grid of dots
// that brighten/shift when the cursor gets close. One canvas per section,
// each section gets its OWN independent grid + animation loop.

// Grab every canvas with this class — one per section, as you placed them in HTML
const canvases = document.querySelectorAll('.dot-grid');

canvases.forEach((canvas) => {
  const ctx = canvas.getContext('2d'); // the "pen" we use to draw on this canvas
  let dots = [];
  let mouse = { x: -9999, y: -9999 }; // start off-screen so nothing reacts before the user moves their mouse

  // ---------- 1. SIZE THE CANVAS TO ITS PARENT SECTION ----------
  function resizeCanvas() {
    const parent = canvas.parentElement; // the <section> this canvas lives inside
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    createDots(); // re-create the grid whenever size changes (e.g. window resize)
  }

  // ---------- 2. BUILD THE GRID OF DOT POSITIONS ----------
  function createDots() {
    dots = [];
    const spacing = 32; // pixels between dots — smaller = denser grid, more expensive to animate
    const cols = Math.floor(canvas.width / spacing);
    const rows = Math.floor(canvas.height / spacing);

    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        dots.push({
          x: i * spacing,
          y: j * spacing,
          baseRadius: 1.5, // resting dot size
        });
      }
    }
  }

  // ---------- 3. READ THE CURRENT THEME COLORS ----------
  // We read CSS variables at draw-time, not once, so dark/light sections each
  // get their correct dot color automatically — no separate JS logic needed per theme.
  function getThemeColors() {
    const styles = getComputedStyle(canvas.parentElement);
    return {
      dot: styles.getPropertyValue('--color-dot').trim(),
      dotActive: styles.getPropertyValue('--color-dot-active').trim(),
    };
  }

  // ---------- 4. DRAW ONE FRAME ----------
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // wipe last frame before drawing the new one
    const colors = getThemeColors();
    const reactionRadius = 120; // how far from the cursor a dot starts reacting

    dots.forEach((dot) => {
      const dx = dot.x - mouse.x;
      const dy = dot.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy); // straight-line distance from cursor to this dot

      let radius = dot.baseRadius;
      let color = colors.dot;

      if (distance < reactionRadius) {
        // closer to cursor = bigger dot + shifts toward accent color
        const proximity = 1 - distance / reactionRadius; // 0 (far) to 1 (right on cursor)
        radius = dot.baseRadius + proximity * 3;
        color = colors.dotActive;
      }

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
  }

  // ---------- 5. ANIMATION LOOP ----------
  // requestAnimationFrame asks the browser "call this again right before the next
  // repaint" — smoother and more efficient than setInterval for animation.
  function animate() {
    draw();
    requestAnimationFrame(animate);
  }

  // ---------- 6. EVENT LISTENERS ----------
  // mousemove on the SECTION (not the whole window) so each grid only reacts
  // to the cursor while it's actually within that section
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect(); // canvas position relative to viewport
    mouse.x = e.clientX - rect.left; // convert cursor position to canvas-local coordinates
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = -9999; // push off-screen so dots relax back to resting size
    mouse.y = -9999;
  });

  window.addEventListener('resize', resizeCanvas);

  // ---------- INITIALIZE ----------
  resizeCanvas();
  animate();
});