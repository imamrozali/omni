import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

async function runBuild() {
  console.log('Building minified standalone production server artifact...');

  // 1. Ensure clean dist directory
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  // 2. Read package.json to externalize dependencies
  const pkgPath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const externalDeps = Object.keys(pkg.dependencies || {});

  // 3. Bundle & minify TypeScript source with esbuild
  await build({
    entryPoints: [path.join(rootDir, 'src/index.ts')],
    bundle: true,
    minify: true,
    sourcemap: false,
    platform: 'node',
    target: 'node24',
    format: 'esm',
    outfile: path.join(distDir, 'index.js'),
    external: externalDeps,
    banner: {
      js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
    },
  });

  // 4. Create standalone production package.json in dist/
  const prodPkg = {
    name: pkg.name,
    version: pkg.version,
    private: pkg.private,
    type: pkg.type,
    main: 'index.js',
    scripts: {
      start: 'node index.js',
    },
    dependencies: pkg.dependencies,
    engines: {
      node: '>=24 <25',
    },
  };
  fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(prodPkg, null, 2));

  // 5. Copy drizzle migration directory if present
  const drizzleSrc = path.join(rootDir, 'drizzle');
  if (fs.existsSync(drizzleSrc)) {
    fs.cpSync(drizzleSrc, path.join(distDir, 'drizzle'), { recursive: true });
  }

  // 6. Copy .env.example
  const envExampleSrc = path.join(rootDir, '.env.example');
  if (fs.existsSync(envExampleSrc)) {
    fs.copyFileSync(envExampleSrc, path.join(distDir, '.env.example'));
  }

  // 7. Generate README in dist/
  const readmeContent = `# Omni Server Standalone Production Artifact

This folder contains the minified standalone production build of the Omni Server.

## How to Run

1. Copy your production configuration to \`.env\`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Install production dependencies:
   \`\`\`bash
   npm ci --omit=dev
   \`\`\`

3. Start the server:
   \`\`\`bash
   npm start
   \`\`\`
`;
  fs.writeFileSync(path.join(distDir, 'README.md'), readmeContent);

  console.log('Standalone production server build complete in server/dist/');
}

runBuild().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
