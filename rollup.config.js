import dts from "rollup-plugin-dts";
// Contents of the file /rollup.config.js
const config = [
    {
        input: './lib/index.js',
        output: [
            {
                file: 'index.js',
                format: 'es',
                sourcemap: true,
            },
            {
                file: 'index.cjs',
                format: 'cjs',
                sourcemap: true,
            }
        ],
        external: ['axios', 'moment'],
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