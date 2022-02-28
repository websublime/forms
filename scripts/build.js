/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

const { build } = require('esbuild');
const { dependencies = {} } = require('../package.json');
const { join, resolve } = require('path');

const external = Object.entries(dependencies).map(([key]) => key);
const root = process.cwd();

async function buildPackage(format, outfile) {
	return build({
		entryPoints: [resolve(join(root, 'src/index.ts'))],
	  bundle: true,
	  minify: true,
	  format,
	  sourcemap: true,
	  target: ['chrome60', 'firefox60', 'safari11', 'edge18'],
	  outfile,
		external: [...external, 'esbuild']
	});
}

async function buildBundle() {
	await buildPackage('iife', 'dist/schema.umd.js');
	await buildPackage('esm', 'dist/schema.es.js');
}

buildBundle();
