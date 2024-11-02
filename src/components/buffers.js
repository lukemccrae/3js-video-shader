export const bufferA = `
    uniform float u_time;
    void main() {
        vec2 uv = gl_FragCoord.xy / vec2(512.0, 512.0); // Adjust resolution as needed
        vec3 color = vec3(0.5 + 0.5 * sin(u_time + uv.xyx * 3.0));
        gl_FragColor = vec4(color, 1.0);
    }
`