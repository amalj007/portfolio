(() => {
  const stage = document.querySelector('.hero-stage');
  const canvas = stage?.querySelector('.scene3d-canvas');
  const hero = document.querySelector('.hero');
  const fallback = stage?.querySelector('.scene-fallback');
  if (!stage || !canvas || !hero) return;

  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    depth: true,
  });

  if (!gl) {
    fallback?.classList.add('is-visible');
    canvas.hidden = true;
    return;
  }

  const vertexSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec4 aColor;
    uniform mat4 uProjectionView;
    uniform mat4 uModel;
    varying vec4 vColor;
    void main() {
      vec3 normal = normalize(mat3(uModel) * aNormal);
      vec3 light = normalize(vec3(-0.42, 0.76, 0.62));
      float diffuse = max(dot(normal, light), 0.0);
      float illumination = 0.46 + diffuse * 0.58;
      vColor = vec4(aColor.rgb * illumination, aColor.a);
      gl_Position = uProjectionView * uModel * vec4(aPosition, 1.0);
    }
  `;

  const fragmentSource = `
    precision mediump float;
    varying vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const reason = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(reason || 'Could not compile the 3D scene shader.');
    }
    return shader;
  }

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Could not link the 3D scene.');
    }
  } catch (error) {
    console.warn('The interactive control-system visual is unavailable.', error);
    fallback?.classList.add('is-visible');
    canvas.hidden = true;
    return;
  }

  const locations = {
    position: gl.getAttribLocation(program, 'aPosition'),
    normal: gl.getAttribLocation(program, 'aNormal'),
    color: gl.getAttribLocation(program, 'aColor'),
    projectionView: gl.getUniformLocation(program, 'uProjectionView'),
    model: gl.getUniformLocation(program, 'uModel'),
  };

  const faceVertices = [];
  const lineVertices = [];

  function color(hex, alpha = 1) {
    const raw = hex.replace('#', '');
    return [
      Number.parseInt(raw.slice(0, 2), 16) / 255,
      Number.parseInt(raw.slice(2, 4), 16) / 255,
      Number.parseInt(raw.slice(4, 6), 16) / 255,
      alpha,
    ];
  }

  function vertex(target, position, normal, tint) {
    target.push(
      position[0], position[1], position[2],
      normal[0], normal[1], normal[2],
      tint[0], tint[1], tint[2], tint[3]
    );
  }

  function addLine(a, b, tint, alpha = 1) {
    const rgba = color(tint, alpha);
    vertex(lineVertices, a, [0, 0, 1], rgba);
    vertex(lineVertices, b, [0, 0, 1], rgba);
  }

  function addPolyline(points, tint, alpha = 1, close = false) {
    for (let index = 0; index < points.length - 1; index += 1) {
      addLine(points[index], points[index + 1], tint, alpha);
    }
    if (close && points.length > 2) addLine(points[points.length - 1], points[0], tint, alpha);
  }

  function addBox(center, size, fill = '#121914', edge = '#c5ff76', edgeAlpha = 0.68) {
    const [cx, cy, cz] = center;
    const [sx, sy, sz] = size.map((dimension) => dimension * 0.5);
    const corners = [
      [cx - sx, cy - sy, cz - sz], [cx + sx, cy - sy, cz - sz],
      [cx + sx, cy + sy, cz - sz], [cx - sx, cy + sy, cz - sz],
      [cx - sx, cy - sy, cz + sz], [cx + sx, cy - sy, cz + sz],
      [cx + sx, cy + sy, cz + sz], [cx - sx, cy + sy, cz + sz],
    ];
    const surfaces = [
      { normal: [0, 0, 1], indices: [4, 5, 6, 7] },
      { normal: [0, 0, -1], indices: [1, 0, 3, 2] },
      { normal: [1, 0, 0], indices: [5, 1, 2, 6] },
      { normal: [-1, 0, 0], indices: [0, 4, 7, 3] },
      { normal: [0, 1, 0], indices: [7, 6, 2, 3] },
      { normal: [0, -1, 0], indices: [0, 1, 5, 4] },
    ];
    const faceColor = color(fill);
    surfaces.forEach(({ normal, indices }) => {
      const [a, b, c, d] = indices.map((index) => corners[index]);
      [a, b, c, a, c, d].forEach((point) => vertex(faceVertices, point, normal, faceColor));
    });
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    edges.forEach(([a, b]) => addLine(corners[a], corners[b], edge, edgeAlpha));
  }

  function addCircle(radius, center, plane, tint, alpha = 0.4, segments = 120) {
    const points = [];
    for (let step = 0; step < segments; step += 1) {
      const angle = (step / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (plane === 'xz') points.push([center[0] + x, center[1], center[2] + y]);
      else if (plane === 'yz') points.push([center[0], center[1] + x, center[2] + y]);
      else points.push([center[0] + x, center[1] + y, center[2]]);
    }
    addPolyline(points, tint, alpha, true);
  }

  function addOrbit(radius, lean, tint, alpha) {
    const points = [];
    const count = 160;
    for (let step = 0; step < count; step += 1) {
      const angle = (step / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      points.push([x, y * Math.cos(lean), y * Math.sin(lean)]);
    }
    addPolyline(points, tint, alpha, true);
  }

  function addGrid() {
    for (let index = -8; index <= 8; index += 1) {
      const position = index * 0.62;
      const weight = index % 4 === 0 ? 0.17 : 0.075;
      addLine([-5.5, -1.53, position], [5.5, -1.53, position], '#b6df91', weight);
      addLine([position, -1.53, -5.5], [position, -1.53, 5.5], '#b6df91', weight);
    }
    addLine([-5.2, -1.525, 0], [5.2, -1.525, 0], '#c5ff76', 0.34);
    addLine([0, -1.52, -5.2], [0, -1.52, 5.2], '#c5ff76', 0.24);
  }

  function addControlCore() {
    const edge = '#c5ff76';
    const white = '#dff2c3';

    // A suspended installation: orbital paths, layered rack, and signal routes.
    addOrbit(2.52, 0.56, '#b3e880', 0.38);
    addOrbit(2.86, -0.68, '#8ed5b4', 0.23);
    addCircle(2.36, [0, 0.08, 0], 'xz', '#d9f9a8', 0.22, 144);
    addCircle(2.13, [0, 0.1, 0], 'xy', '#c5ff76', 0.14, 96);
    addGrid();

    // Back plane and cabinet body.
    addBox([0, 0.02, -0.48], [3.32, 2.02, 0.1], '#0d1310', '#c5ff76', 0.38);
    addBox([0, 0.02, -0.02], [2.94, 1.74, 0.78], '#111914', '#dbf6b4', 0.57);
    addBox([0, -0.96, 0.05], [3.48, 0.22, 1.02], '#111712', '#c5ff76', 0.78);
    addBox([0, -1.13, -0.06], [2.82, 0.12, 0.74], '#0d100e', '#a1c77b', 0.48);
    addBox([0, 0.98, -0.03], [3.15, 0.13, 0.84], '#182119', '#c5ff76', 0.62);

    // Three raised controller and I/O modules on the front face.
    const modules = [-0.91, 0, 0.91];
    modules.forEach((x, index) => {
      const tint = index === 1 ? '#213025' : '#19231b';
      addBox([x, 0.06, 0.44], [0.76, 1.38, 0.12], tint, edge, 0.82);
      addBox([x, 0.57, 0.515], [0.57, 0.18, 0.025], '#0a0d0a', '#9cb77f', 0.4);
      addBox([x, -0.55, 0.515], [0.58, 0.12, 0.025], '#0a0d0a', '#90a679', 0.3);
      for (let slot = 0; slot < 4; slot += 1) {
        const lightColor = (slot + index) % 3 === 0 ? '#dfff91' : '#78b992';
        addBox([x - 0.2 + slot * 0.13, 0.25, 0.54], [0.045, 0.045, 0.026], lightColor, lightColor, 0.94);
      }
      for (let port = 0; port < 3; port += 1) {
        addBox([x - 0.15 + port * 0.15, -0.37, 0.535], [0.065, 0.06, 0.025], '#101711', '#acd98b', 0.5);
      }
    });

    // SCADA glass display with a moving, illustrative signal trace.
    addBox([0, 0.1, 0.525], [0.69, 0.52, 0.055], '#0b100c', '#d3edaa', 0.68);
    for (let row = 0; row < 4; row += 1) {
      const y = -0.02 + row * 0.075;
      addLine([-0.28, y, 0.56], [0.28, y, 0.56], '#9bbf79', 0.23);
    }
    const trace = [
      [-0.27, 0.12, 0.565], [-0.18, 0.12, 0.565], [-0.12, 0.24, 0.565],
      [-0.02, 0.19, 0.565], [0.06, 0.31, 0.565], [0.16, 0.29, 0.565], [0.27, 0.43, 0.565],
    ];
    addPolyline(trace, '#d7ff89', 0.93);

    // Repeated rack vents, signal busses, ports, and a low mounting frame.
    for (let vent = 0; vent < 8; vent += 1) {
      const x = -1.26 + vent * 0.36;
      addLine([x, 0.87, 0.42], [x + 0.16, 0.87, 0.42], '#b0ce8a', 0.48);
    }
    addPolyline([
      [-1.85, 0.8, 0.52], [-1.74, 0.8, 0.52], [-1.74, -0.8, 0.52],
      [1.74, -0.8, 0.52], [1.74, 0.8, 0.52], [1.85, 0.8, 0.52],
    ], '#a7df8c', 0.36);

    // Floating field and visualization nodes orbit the controller.
    const satellites = [
      { center: [-2.17, 0.58, 0.05], size: [0.48, 0.52, 0.48] },
      { center: [2.16, -0.05, 0.06], size: [0.48, 0.64, 0.48] },
      { center: [0.14, 1.57, -0.08], size: [0.64, 0.37, 0.42] },
    ];
    satellites.forEach(({ center, size }, index) => {
      addBox(center, size, '#121a14', index === 1 ? '#9cdbb3' : edge, 0.79);
      const [x, y, z] = center;
      addBox([x, y, z + size[2] * 0.53], [size[0] * 0.43, size[1] * 0.2, 0.028], '#0a0d0b', '#c2dbad', 0.58);
      addLine([x - size[0] * 0.3, y - size[1] * 0.19, z + size[2] * 0.53], [x + size[0] * 0.3, y - size[1] * 0.19, z + size[2] * 0.53], '#dfff91', 0.8);
    });

    addPolyline([[-2.17, 0.28, 0.28], [-2.0, 0.28, 0.48], [-1.68, 0.28, 0.54]], '#d6efaa', 0.63);
    addPolyline([[1.68, -0.22, 0.54], [1.95, -0.22, 0.47], [2.16, -0.22, 0.30]], '#a3dcbc', 0.6);
    addPolyline([[0.14, 1.39, 0.14], [0.14, 1.18, 0.28], [0.14, 1.02, 0.48]], '#b2e68b', 0.58);

    // Sparse signal particles and a fine outer wire cage give the scene depth.
    [
      [-2.74, 1.14, 0.17], [-2.48, -0.83, -0.34], [2.73, 0.92, -0.2],
      [2.61, -0.82, 0.48], [0.88, 2.02, 0.06], [-0.92, 1.8, -0.37],
    ].forEach((point, index) => {
      addBox(point, [0.055, 0.055, 0.055], index % 2 ? '#92d8bd' : '#dfff91', '#dfff91', 0.92);
    });
    addBox([0, 0.04, -0.91], [3.72, 2.38, 0.025], '#080c09', '#a9da87', 0.23);
  }

  addControlCore();

  function createBuffer(vertices) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return buffer;
  }

  const faceBuffer = createBuffer(faceVertices);
  const lineBuffer = createBuffer(lineVertices);
  const vertexStride = 10 * Float32Array.BYTES_PER_ELEMENT;

  function bindBuffer(buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(locations.position);
    gl.vertexAttribPointer(locations.position, 3, gl.FLOAT, false, vertexStride, 0);
    gl.enableVertexAttribArray(locations.normal);
    gl.vertexAttribPointer(locations.normal, 3, gl.FLOAT, false, vertexStride, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(locations.color);
    gl.vertexAttribPointer(locations.color, 4, gl.FLOAT, false, vertexStride, 6 * Float32Array.BYTES_PER_ELEMENT);
  }

  function identity() {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  function multiply(a, b) {
    const result = new Float32Array(16);
    for (let column = 0; column < 4; column += 1) {
      for (let row = 0; row < 4; row += 1) {
        result[column * 4 + row] =
          a[row] * b[column * 4] +
          a[4 + row] * b[column * 4 + 1] +
          a[8 + row] * b[column * 4 + 2] +
          a[12 + row] * b[column * 4 + 3];
      }
    }
    return result;
  }

  function rotationX(angle) {
    const matrix = identity();
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    matrix[5] = cosine;
    matrix[6] = sine;
    matrix[9] = -sine;
    matrix[10] = cosine;
    return matrix;
  }

  function rotationY(angle) {
    const matrix = identity();
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    matrix[0] = cosine;
    matrix[2] = -sine;
    matrix[8] = sine;
    matrix[10] = cosine;
    return matrix;
  }

  function perspective(fov, aspect, near, far) {
    const scale = 1 / Math.tan(fov / 2);
    const range = 1 / (near - far);
    return new Float32Array([
      scale / aspect, 0, 0, 0,
      0, scale, 0, 0,
      0, 0, (near + far) * range, -1,
      0, 0, near * far * 2 * range, 0,
    ]);
  }

  function lookAt(eye, target, up) {
    const normalize = (vector) => {
      const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
      return vector.map((value) => value / length);
    };
    const subtract = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const z = normalize(subtract(eye, target));
    const x = normalize(cross(up, z));
    const y = cross(z, x);
    return new Float32Array([
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -dot(x, eye), -dot(y, eye), -dot(z, eye), 1,
    ]);
  }

  const view = lookAt([3.8, 2.8, 7.35], [0, 0.02, 0], [0, 1, 0]);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let projectionView = identity();
  let active = true;
  let animationFrame = 0;
  let lastWidth = 0;
  let lastHeight = 0;
  let lastPixelRatio = 0;
  let scrollMix = 0;
  let targetScrollMix = 0;

  function resize() {
    const bounds = stage.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(bounds.width * pixelRatio));
    const height = Math.max(1, Math.round(bounds.height * pixelRatio));
    if (width === lastWidth && height === lastHeight && pixelRatio === lastPixelRatio) return;
    lastWidth = width;
    lastHeight = height;
    lastPixelRatio = pixelRatio;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    const projection = perspective(0.76, width / height, 0.1, 45);
    projectionView = multiply(projection, view);
  }

  function draw(time = 0) {
    resize();
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(program);

    pointer.x += (pointer.targetX - pointer.x) * 0.045;
    pointer.y += (pointer.targetY - pointer.y) * 0.045;
    scrollMix += (targetScrollMix - scrollMix) * 0.035;

    const seconds = time * 0.001;
    const yaw = (reducedMotion.matches ? 0 : Math.sin(seconds * 0.16) * 0.15) + pointer.x * 0.28 + scrollMix * 0.14;
    const pitch = -0.08 + pointer.y * 0.15 - scrollMix * 0.1;
    const model = multiply(rotationY(yaw), rotationX(pitch));
    gl.uniformMatrix4fv(locations.projectionView, false, projectionView);
    gl.uniformMatrix4fv(locations.model, false, model);

    bindBuffer(faceBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, faceVertices.length / 10);
    bindBuffer(lineBuffer);
    gl.drawArrays(gl.LINES, 0, lineVertices.length / 10);
  }

  function schedule() {
    if (animationFrame || !active || document.hidden || reducedMotion.matches) return;
    animationFrame = window.requestAnimationFrame((time) => {
      animationFrame = 0;
      draw(time);
      schedule();
    });
  }

  stage.addEventListener('pointermove', (event) => {
    if (!supportsFinePointer.matches || event.pointerType === 'touch' || reducedMotion.matches) return;
    const bounds = stage.getBoundingClientRect();
    pointer.targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
    pointer.targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
    schedule();
  }, { passive: true });

  stage.addEventListener('pointerleave', () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
    schedule();
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const bounds = hero.getBoundingClientRect();
    targetScrollMix = Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height)));
    schedule();
  }, { passive: true });

  window.addEventListener('resize', schedule, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    } else {
      draw();
      schedule();
    }
  });

  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches) {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      draw();
    } else {
      schedule();
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) schedule();
      else if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    }, { threshold: 0.02 });
    observer.observe(stage);
  }

  draw();
  schedule();
})();

