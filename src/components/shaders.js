export const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`

export const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D iChannel0;
    uniform sampler2D iChannel1;
    uniform vec2 iResolution;
    uniform bool VERT;

    // Convert RGB to a single float
    float fromRgb(vec3 v) {
        return ((v.z * 256.0 + v.y) * 256.0 + v.x) * 255.0;
    }

    // Main drawing function
    vec4 draw(vec2 uv) {
        vec2 dirVec = VERT ? vec2(0.0, 1.0) : vec2(1.0, 0.0);
        float wid = VERT ? iResolution.y : iResolution.x;
        float pos = VERT ? floor(uv.y * iResolution.y) : floor(uv.x * iResolution.x);

        for (int i = 0; i < int(wid); i++) {
            vec2 p = uv + dirVec * float(i) / wid;
            if (p.x < 1.0 && p.y < 1.0) {
                float v = fromRgb(texture2D(iChannel0, p).xyz);
                if (abs(v - pos) < 0.5) {
                    return texture2D(iChannel1, p);
                }
            }

            p = uv - dirVec * float(i) / wid;
            if (0.0 < p.x && 0.0 < p.y) {
                float v = fromRgb(texture2D(iChannel0, p).xyz);
                if (abs(v - pos) < 0.5) {
                    return texture2D(iChannel1, p);
                }
            }
        }

        return vec4(1.0, 0.0, 1.0, 1.0); // Fallback color if no displacement found
    }

    void main() {
        vec2 uv = vUv;
        gl_FragColor = draw(uv);
    }
`