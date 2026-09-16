import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes:true });
  const lists = await Promise.all(entries.filter(x=>!['.git','.sites-runtime','node_modules'].includes(x.name)).map(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)]));
  return lists.flat();
}
const files = await walk('.');
const required = ['AGENTS.md','README.md','segunda-mente/AXIS/AXIS.md','segunda-mente/AXIS/Produto/Visao.md','segunda-mente/AXIS/Documentacao/Arquitetura.md','segunda-mente/AXIS/Documentacao/Regras-visuais.md','segunda-mente/AXIS/Documentacao/Mapa-do-projeto.md','segunda-mente/AXIS/Documentacao/Decisoes.md','segunda-mente/AXIS/Planejamento/Estado-atual.md','segunda-mente/AXIS/Planejamento/Proxima-tarefa.md','segunda-mente/AXIS/Diario/2026-09-16.md'];
const errors=[];
for(const file of required) { try { await access(file); } catch { errors.push(`Ausente: ${file}`); } }
for(const file of files.filter(f=>f.endsWith('.md'))) {
  const content = await readFile(file,'utf8');
  for(const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target=match[1].split('#')[0];
    if(!target || /^(https?:|mailto:)/.test(target)) continue;
    try { await access(path.resolve(path.dirname(file),target)); } catch { errors.push(`Link quebrado: ${file} → ${target}`); }
  }
}
const html=await readFile('dist/index.html','utf8');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const target=match[1]; if(/^(https?:|data:)/.test(target)) continue;
  try { await access(path.resolve('dist',target)); } catch { errors.push(`Asset ausente: ${target}`); }
}
if(errors.length) { console.error(errors.join('\n')); process.exitCode=1; }
else console.log(`Documentação e assets válidos: ${required.length} arquivos obrigatórios; links locais sem erros.`);
