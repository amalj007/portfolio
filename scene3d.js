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
    uniform float uFade;
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
    uniform float uFade;
    varying vec4 vColor;
    void main() {
      gl_FragColor = vec4(vColor.rgb, vColor.a * uFade);
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
    fade: gl.getUniformLocation(program, 'uFade'),
  };

  const faceVertices = [];
  const lineVertices = [];

  function color(hex, alpha = 1) {
    const blueMap = {
      '#c5ff76': '#70dfff', '#ebff9e': '#a8efff', '#dfff91': '#a6edff',
      '#b3e880': '#75cbed', '#8ed5b4': '#66cce9', '#d9f9a8': '#a3eaff',
      '#b6df91': '#75b8d1', '#a9da87': '#73bfdc', '#d7ff89': '#9ceaff',
      '#a7df8c': '#7dd4ec', '#b2e68b': '#81d4ef', '#a3dcbc': '#8adff5',
      '#78b992': '#54b7d2', '#9bbf79': '#7cbdd2', '#9cb77f': '#79b8d1',
      '#a1c77b': '#72bfdc', '#acd98b': '#8ddbf0', '#b0ce8a': '#7ac5dc',
      '#c2dbad': '#a2d8e9', '#d3edaa': '#a9e8f5', '#d6efaa': '#9ae5f4',
      '#d9f9a8': '#a3eaff', '#dbf6b4': '#b6edf8', '#dff2c3': '#c1eff8',
    };
    const raw = (blueMap[hex.toLowerCase()] || hex).replace('#', '');
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

  function addTube(start, end, radius, fill, edge = fill, alpha = 0.94, segments = 14) {
    const subtract = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const normalize = (value) => {
      const length = Math.hypot(value[0], value[1], value[2]) || 1;
      return value.map((component) => component / length);
    };
    const axis = normalize(subtract(end, start));
    const guide = Math.abs(axis[1]) > 0.92 ? [1, 0, 0] : [0, 1, 0];
    const u = normalize(cross(axis, guide));
    const v = normalize(cross(axis, u));
    const firstRing = [];
    const secondRing = [];
    const faceColor = color(fill, alpha);
    for (let step = 0; step < segments; step += 1) {
      const angle = (step / segments) * Math.PI * 2;
      const radial = [u[0] * Math.cos(angle) + v[0] * Math.sin(angle), u[1] * Math.cos(angle) + v[1] * Math.sin(angle), u[2] * Math.cos(angle) + v[2] * Math.sin(angle)];
      firstRing.push([start[0] + radial[0] * radius, start[1] + radial[1] * radius, start[2] + radial[2] * radius]);
      secondRing.push([end[0] + radial[0] * radius, end[1] + radial[1] * radius, end[2] + radial[2] * radius]);
    }
    for (let step = 0; step < segments; step += 1) {
      const next = (step + 1) % segments;
      const radial = normalize([u[0] * Math.cos(((step + 0.5) / segments) * Math.PI * 2) + v[0] * Math.sin(((step + 0.5) / segments) * Math.PI * 2), u[1] * Math.cos(((step + 0.5) / segments) * Math.PI * 2) + v[1] * Math.sin(((step + 0.5) / segments) * Math.PI * 2), u[2] * Math.cos(((step + 0.5) / segments) * Math.PI * 2) + v[2] * Math.sin(((step + 0.5) / segments) * Math.PI * 2)]);
      vertex(faceVertices, firstRing[step], radial, faceColor);
      vertex(faceVertices, secondRing[step], radial, faceColor);
      vertex(faceVertices, secondRing[next], radial, faceColor);
      vertex(faceVertices, firstRing[step], radial, faceColor);
      vertex(faceVertices, secondRing[next], radial, faceColor);
      vertex(faceVertices, firstRing[next], radial, faceColor);
      vertex(faceVertices, start, axis.map((component) => -component), faceColor);
      vertex(faceVertices, firstRing[next], axis.map((component) => -component), faceColor);
      vertex(faceVertices, firstRing[step], axis.map((component) => -component), faceColor);
      vertex(faceVertices, end, axis, faceColor);
      vertex(faceVertices, secondRing[step], axis, faceColor);
      vertex(faceVertices, secondRing[next], axis, faceColor);
    }
    addPolyline(firstRing, edge, 0.5, true);
    addPolyline(secondRing, edge, 0.64, true);
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

  function addMarineEngine() {
    addGrid();
    addOrbit(3.12, 0.38, '#55b7de', 0.24);
    addCircle(2.52, [0, 0.16, 0], 'xz', '#7adfff', 0.2, 128);

    // Engine-room structure, mounts, and a heavy inline propulsion block.
    addBox([0, 0.06, -1.04], [5.25, 3.08, 0.12], '#0a1824', '#3f87a8', 0.32);
    addBox([0, -1.22, 0], [4.78, 0.34, 1.72], '#142633', '#78cce8', 0.82);
    addBox([0, -0.88, 0], [4.18, 0.17, 1.38], '#0e1c27', '#3f91b2', 0.58);
    [-1.84, -0.62, 0.62, 1.84].forEach((x) => {
      addBox([x, -1.42, 0], [0.34, 0.27, 1.93], '#1a2b35', '#66b3cf', 0.66);
      addBox([x, -1.1, 0.71], [0.1, 0.22, 0.1], '#263c48', '#83d8ef', 0.58);
    });
    addBox([0, -0.3, -0.12], [3.96, 0.98, 1.12], '#172a36', '#75c5df', 0.76);
    addBox([0, -0.3, 0.47], [3.7, 0.74, 0.09], '#1c3441', '#69bddb', 0.5);

    // Six cylinder heads, liners, injector details, and connecting fuel rail.
    const cylinders = [-1.38, -0.83, -0.28, 0.28, 0.83, 1.38];
    cylinders.forEach((x, index) => {
      addCylinder([x, 0.26, 0.02], 0.22, 0.86, '#23404d', '#9ceaff', 0.95, 18);
      addBox([x, 0.76, 0.02], [0.46, 0.22, 0.52], index % 2 ? '#294654' : '#213e4b', '#a7e7f8', 0.88);
      addBox([x, 0.91, 0.02], [0.34, 0.1, 0.36], '#162c38', '#6fc8e1', 0.75);
      addCylinder([x, 0.52, 0.31], 0.045, 0.3, '#94d9eb', '#d2f5ff', 0.9, 9);
      addBox([x, -0.36, 0.62], [0.22, 0.07, 0.035], '#72d6ef', '#c1f4ff', 0.82);
    });
    addTube([-1.73, 1.14, 0.37], [1.73, 1.14, 0.37], 0.07, '#285a70', '#87dff4', 0.94, 16);
    cylinders.forEach((x) => addTube([x, 0.94, 0.32], [x, 1.14, 0.37], 0.025, '#79cee4', '#b7effa', 0.92, 8));

    // Exhaust manifold and insulated hot-side routing behind the cylinder row.
    addTube([-1.8, 1.03, -0.48], [1.62, 1.03, -0.48], 0.13, '#38515d', '#9ac0cf', 0.94, 18);
    cylinders.forEach((x, index) => {
      addTube([x, 0.86, -0.36], [x, 1.03, -0.48], 0.064, index % 2 ? '#55717d' : '#405d69', '#a6cbd8', 0.9, 10);
    });
    addTube([1.58, 1.03, -0.48], [1.94, 1.03, -0.48], 0.13, '#3e6474', '#8be5f5', 0.96, 16);
    addCylinder([2.08, 1.03, -0.48], 0.27, 0.42, '#294652', '#86d6eb', 0.93, 20);
    addTube([2.24, 1.03, -0.48], [2.24, 0.62, -0.48], 0.1, '#426674', '#99e3f1', 0.92, 14);

    // Flywheel, shaft coupling, lubrication filters, and cooling lines.
    addTube([2.04, -0.55, 0], [2.63, -0.55, 0], 0.28, '#314b57', '#9bc9d7', 0.96, 22);
    addCircle(0.47, [2.3, -0.55, 0], 'yz', '#b7e9f3', 0.77, 64);
    addCircle(0.32, [2.3, -0.55, 0], 'yz', '#70cce2', 0.46, 48);
    [-1.72, -1.34].forEach((x, index) => {
      addCylinder([x, 0.05, 0.73], 0.16, 0.62, '#24404b', '#7bd2e7', 0.96, 16);
      addCylinder([x, 0.38, 0.73], 0.2, 0.1, '#3e6270', '#a1e3f1', 0.92, 16);
      addTube([x, 0.42, 0.73], [x + (index ? -0.24 : 0.24), 0.62, 0.34], 0.035, '#4e9bb2', '#b6eff9', 0.92, 10);
    });
    addTube([-1.92, 0.71, -0.59], [1.82, 0.71, -0.59], 0.055, '#357d97', '#70d9f0', 0.82, 12);
    addPolyline([[-1.96, 0.67, -0.52], [-1.96, 0.3, -0.52], [-1.67, 0.05, -0.52], [-1.67, -0.3, -0.52]], '#83d9ed', 0.78);
    addPolyline([[1.94, 0.72, -0.45], [1.94, 0.25, -0.45], [1.7, 0.06, -0.45]], '#72cde4', 0.7);

    // A shipboard automation / power-management console beside the machinery.
    addBox([-2.45, 0.16, 0.06], [0.8, 1.34, 0.68], '#122a38', '#73d5eb', 0.88);
    addBox([-2.45, 0.35, 0.42], [0.57, 0.45, 0.06], '#06141e', '#b6f0fa', 0.7);
    addPolyline([[-2.68, 0.24, 0.47], [-2.58, 0.24, 0.47], [-2.51, 0.42, 0.47], [-2.42, 0.31, 0.47], [-2.31, 0.4, 0.47], [-2.22, 0.37, 0.47]], '#91eaff', 0.95);
    for (let status = 0; status < 4; status += 1) {
      addBox([-2.65 + status * 0.13, -0.06, 0.42], [0.05, 0.05, 0.035], status === 1 ? '#ffc46b' : '#71dfff', '#d5f8ff', 0.84);
    }

    // Overhead service runs and sparse diagnostic markers establish the engine-room scale.
    addTube([-2.5, 1.47, -0.78], [1.76, 1.47, -0.78], 0.045, '#366c7d', '#78cfe4', 0.76, 10);
    addTube([-2.5, 1.47, -0.78], [-2.5, 0.5, -0.78], 0.045, '#366c7d', '#78cfe4', 0.76, 10);
    addTube([1.76, 1.47, -0.78], [1.76, 1.02, -0.48], 0.045, '#366c7d', '#78cfe4', 0.76, 10);
    addBox([-2.08, 0.94, 0.18], [0.08, 0.08, 0.08], '#7ee7ff', '#d8faff', 0.94);
    addBox([2.57, 0.55, -0.08], [0.07, 0.07, 0.07], '#ffc46b', '#ffdfaa', 0.92);
    addBox([0, 0.02, -0.95], [4.7, 2.88, 0.025], '#091722', '#4e9cba', 0.2);
  }

  function addCylinder(center, radius, height, fill, edge, alpha = 0.94, segments = 16) {
    addTube([center[0], center[1] - height * 0.5, center[2]], [center[0], center[1] + height * 0.5, center[2]], radius, fill, edge, alpha, segments);
  }

  addControlCore();
  const controlGeometry = { faces: faceVertices.slice(), lines: lineVertices.slice() };
  faceVertices.length = 0;
  lineVertices.length = 0;
  addMarineEngine();
  const marineGeometry = { faces: faceVertices.slice(), lines: lineVertices.slice() };

  function createBuffer(vertices) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return buffer;
  }

  const scenes = {
    control: { faceBuffer: createBuffer(controlGeometry.faces), lineBuffer: createBuffer(controlGeometry.lines), faceCount: controlGeometry.faces.length / 10, lineCount: controlGeometry.lines.length / 10 },
    marine: { faceBuffer: createBuffer(marineGeometry.faces), lineBuffer: createBuffer(marineGeometry.lines), faceCount: marineGeometry.faces.length / 10, lineCount: marineGeometry.lines.length / 10 },
  };
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

  const view = lookAt([3.0, 2.8, 7.35], [-0.8, 0.02, 0], [0, 1, 0]);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const marineChapter = document.querySelector('#marine-systems');
  const sceneReadout = {
    title: stage.querySelector('[data-scene-title]'),
    flow: stage.querySelector('[data-scene-flow]'),
    labels: [...stage.querySelectorAll('[data-scene-label]')],
    values: [...stage.querySelectorAll('[data-scene-value]')],
  };
  const sceneCopy = {
    control: {
      title: 'FIG. 01 / CONTROL STUDY', flow: 'FIELD → PLC → HMI',
      labels: ['01 / CONTROL', '02 / VISUAL', '03 / FIELD'],
      values: ['PLC · S7-1500', 'SCADA · WinCC', 'IO · SIMOCODE'],
      bottom: 'ILLUSTRATIVE CONTROL ARCHITECTURE',
    },
    marine: {
      title: 'FIG. 02 / ENGINE ROOM', flow: 'ENGINE → IAS → BRIDGE',
      labels: ['01 / PROPULSION', '02 / POWER', '03 / BRIDGE'],
      values: ['ENGINE CONTROL', 'PMS · GENERATORS', 'NAVIGATION SAFETY'],
      bottom: 'ILLUSTRATIVE MARINE SYSTEM STUDY',
    },
  };
  let projectionView = identity();
  let animationFrame = 0;
  let lastWidth = 0;
  let lastHeight = 0;
  let lastPixelRatio = 0;
  let scrollMix = 0;
  let targetScrollMix = 0;
  let selectedScene = '';
  let sceneMix = 0;
  let targetSceneMix = 0;

  function selectScene(name) {
    if (name === selectedScene) return;
    selectedScene = name;
    targetSceneMix = name === 'marine' ? 1 : 0;
    document.body.dataset.scene = name;
    const copy = sceneCopy[name];
    if (sceneReadout.title) sceneReadout.title.textContent = copy.title;
    if (sceneReadout.flow) sceneReadout.flow.textContent = copy.flow;
    sceneReadout.labels.forEach((element) => { element.textContent = copy.labels[Number(element.dataset.sceneLabel)]; });
    sceneReadout.values.forEach((element) => { element.textContent = copy.values[Number(element.dataset.sceneValue)]; });
    const bottom = stage.querySelector('.scene-readout-bottom span:first-child');
    if (bottom) bottom.textContent = copy.bottom;
    stage.setAttribute('aria-label', name === 'marine' ? 'Interactive 3D illustrative marine engine and automation system study' : 'Interactive 3D illustrative industrial automation control core');
    if (reducedMotion?.matches) draw();
  }

  function updateScrollState() {
    const scrollableHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    targetScrollMix = Math.max(0, Math.min(1, window.scrollY / scrollableHeight));
    if (marineChapter) {
      const bounds = marineChapter.getBoundingClientRect();
      const viewportCenter = window.innerHeight * 0.5;
      selectScene(bounds.top <= viewportCenter && bounds.bottom > viewportCenter ? 'marine' : 'control');
    }
    schedule();
  }

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
    const aspect = width / height;
    const fieldOfView = aspect < 0.55 ? 1.42 : aspect < 0.78 ? 1.16 : aspect < 1.2 ? 0.92 : 0.76;
    const projection = perspective(fieldOfView, aspect, 0.1, 45);
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
    const yaw = (reducedMotion.matches ? 0 : Math.sin(seconds * 0.16) * 0.15) + pointer.x * 0.28 + scrollMix * 0.18;
    const pitch = -0.08 + pointer.y * 0.15 - scrollMix * 0.1;
    const model = multiply(rotationY(yaw), rotationX(pitch));
    gl.uniformMatrix4fv(locations.projectionView, false, projectionView);
    gl.uniformMatrix4fv(locations.model, false, model);

    sceneMix += (targetSceneMix - sceneMix) * 0.055;
    const drawScene = (scene, opacity) => {
      if (opacity <= 0.002) return;
      gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(locations.fade, opacity);
      bindBuffer(scene.faceBuffer);
      gl.drawArrays(gl.TRIANGLES, 0, scene.faceCount);
      bindBuffer(scene.lineBuffer);
      gl.drawArrays(gl.LINES, 0, scene.lineCount);
    };
    drawScene(scenes.control, 1 - sceneMix);
    drawScene(scenes.marine, sceneMix);
  }

  function schedule() {
    if (animationFrame || document.hidden || reducedMotion.matches) return;
    animationFrame = window.requestAnimationFrame((time) => {
      animationFrame = 0;
      draw(time);
      schedule();
    });
  }

  window.addEventListener('pointermove', (event) => {
    if (!supportsFinePointer.matches || event.pointerType === 'touch' || reducedMotion.matches) return;
    pointer.targetX = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth - 0.5) * 2));
    pointer.targetY = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight - 0.5) * 2));
    schedule();
  }, { passive: true });

  window.addEventListener('pointerout', (event) => {
    if (event.relatedTarget) return;
    pointer.targetX = 0;
    pointer.targetY = 0;
    schedule();
  }, { passive: true });

  window.addEventListener('scroll', updateScrollState, { passive: true });

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

  updateScrollState();
  draw();
  schedule();
})();

