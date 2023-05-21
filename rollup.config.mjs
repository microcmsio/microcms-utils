import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import pkg from "./package.json" assert { type: "json" };

export default [
  // commonjs
  {
    input: "./src/index.ts",
    output: [
      {
        file: `./dist/cjs/index.js`,
        sourcemap: "inline",
        format: "cjs",
      },
    ],
    plugins: [
      terser(),
      json(),
      typescript({
        rootDir: "src",
        declaration: true,
        declarationDir: "dist/cjs",
        outDir: "dist/cjs",
      }),
    ],
  },
  // esm
  {
    input: "./src/index.ts",
    output: [
      {
        file: `./dist/esm/index.js`,
        sourcemap: "inline",
        format: "esm",
      },
    ],
    plugins: [
      terser(),
      json(),
      typescript({
        rootDir: "src",
        declaration: true,
        declarationDir: "dist/esm",
        outDir: "dist/esm",
      }),
    ],
  },
  // umd
  {
    input: "./src/index.ts",
    output: [
      {
        file: `./dist/umd/index.js`,
        format: "umd",
        name: "microcms",
      },
    ],
    plugins: [
      terser(),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      json(),
      typescript({
        rootDir: "src",
        declaration: false,
      }),
    ],
  },
];
