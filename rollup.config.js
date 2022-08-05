import dts from "rollup-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"
// Contents of the file /rollup.config.js
const config = [
    {
        input: './lib/index.js',
        output: [
            {
                file: 'index.mjs',
                format: 'es',
                sourcemap: true,
            },
            {
                file: 'index.cjs',
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: 'pylog.system.js',
                format: 'systemjs',
                sourcemap: false,
            },
            {
                file: 'pylog.iife.js',
                format: 'iife',
                name: "pylog",
                sourcemap: false,
                globals: {
                    "moment": "moment",
                    "axios": "axios",
                }
            }
        ],
        plugins: [nodeResolve(), terser()],
        external: ["axios", "moment"]
    },
    {
        input: './declarations/index.d.ts',
        output: {
            file: 'index.d.ts',
            format: 'es'
        },
        plugins: [dts()]
    }
];
export default config;