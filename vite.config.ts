import { execSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

// ez-tree's npm build inlines its 20 bark and leaf images (~4 MB of base64, most of the page's script) and starts
// loading them all when its module loads; the demo takes only its geometry (its own textures are in public/textures).
// So the package's source is bundled instead (it ships in the package), its textures module swapped for one that
// loads nothing (the materials ez-tree builds get no maps; nothing draws them).
const EZ_TREE = 'node_modules/@dgreenheck/ez-tree/src/lib/';
function ezTreeWithoutTextures(): Plugin {
  return {
      name: 'ez-tree-without-textures',
      enforce: 'pre',
      load(id) {
        if (id.split('?')[0].replace(/\\/g, '/').endsWith(`${EZ_TREE}textures.js`)) return 'export const getBarkTexture = () => null;\nexport const getLeafTexture = () => null;\n';
      },
  };
}

// The build's version, for what a page reports about itself (the PGMaps adapter's capture reply): the package's
// version and this checkout's commit, `-dirty` with uncommitted changes to tracked files, read when the server starts or
// the build runs.
const git = (args: string): string => {
  try {
    return execSync(`git ${args}`, { cwd: fileURLToPath(new URL('.', import.meta.url)), stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
};
const commit = git('rev-parse --short HEAD');
const build = commit ? `+${commit}${git('status --porcelain --untracked-files=no') ? '-dirty' : ''}` : '';
// A PGMaps scene release (.github/workflows/pgmaps-release.yml) sets PGMAPS_SCENE_VERSION from its tag
// (pgmaps-scene-v1.0.0 -> 1.0.0): the page then reports `pgmaps-scene 1.0.0+<commit>`, which PGMaps prints on each figure.
const release = process.env.PGMAPS_SCENE_VERSION?.trim();
const version = release
  ? `pgmaps-scene ${release}${build}`
  : `${(JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string }).version}${build}`;

const path = (p: string): string => fileURLToPath(new URL(p, import.meta.url));

// `vite build --mode pgmaps` (npm run build:pgmaps) builds the PGMaps scene page alone, for a release: examples/ is the
// root, so the page lands at the top (dist-pgmaps/pgmaps-scene.html), and of public/ it takes only the bark and leaf
// images it draws (textures/, next to the page; the full site keeps them one level up, ../textures/).
function pgmapsTextures(): Plugin {
  return {
    name: 'pgmaps-textures',
    generateBundle() {
      for (const name of readdirSync(path('./public/textures'))) {
        if (/\.(png|jpe?g)$/i.test(name)) this.emitFile({ type: 'asset', fileName: `textures/${name}`, source: readFileSync(path(`./public/textures/${name}`)) });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const pgmapsOnly = mode === 'pgmaps';
  // the demo, and the library's example (examples/gltf.html: a glTF scene through src/nanite-lib/ alone); or the PGMaps
  // scene page alone
  const input: Record<string, string> = pgmapsOnly
    ? { pgmaps: path('./examples/pgmaps-scene.html') }
    : { main: path('./index.html'), gltf: path('./examples/gltf.html'), pgmaps: path('./examples/pgmaps-scene.html') };
  return {
    define: { __NANITE_VERSION__: JSON.stringify(version), __PGMAPS_TEXTURES__: JSON.stringify(pgmapsOnly ? './textures/' : '../textures/') },
    base: './', // relative asset paths so dist/ works under the GitHub Pages subpath
    ...(pgmapsOnly ? { root: path('./examples'), publicDir: false as const, cacheDir: path('./node_modules/.vite') } : {}),
    plugins: [ezTreeWithoutTextures(), ...(pgmapsOnly ? [pgmapsTextures()] : [])],
    resolve: {
      alias: [
        { find: /^@dgreenheck\/ez-tree$/, replacement: pgmapsOnly ? path(`./${EZ_TREE}index.js`) : `/${EZ_TREE}index.js` },
        // (ez-tree imports 'three', in the DAG worker where it grows the trees: three's core from source, so only the
        // classes it uses are bundled; the build, with the WebGL renderer, made a ~1 MB worker)
        { find: /^three$/, replacement: 'three/src/Three.Core.js' },
      ],
    },
    // (the dev server would pre-bundle ez-tree from its npm build, past the alias and the plugin)
    optimizeDeps: { exclude: ['@dgreenheck/ez-tree'] },
    worker: { format: 'es', plugins: () => [ezTreeWithoutTextures()] }, // (ez-tree grows in the DAG worker)
    build: {
      target: 'es2022',
      ...(pgmapsOnly ? { outDir: path('./dist-pgmaps'), emptyOutDir: true } : {}),
      rolldownOptions: { input },
    },
    // (the harness's scratch and output: browser profiles left by hung runs are ~100k files, and watching them held
    // up the dev server's first requests for minutes)
    server: { watch: { ignored: ['**/tools/tmp/**', '**/tools/out/**'] } },
  };
});
