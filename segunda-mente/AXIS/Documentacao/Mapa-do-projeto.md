# Mapa

| Caminho | Função |
| --- | --- |
| AGENTS.md | Protocolo atualizado para AXIS |
| README.md | Produto e execução local |
| package.json / package-lock.json | Comandos e Three.js fixado |
| .openai/hosting.json | Mesma identidade Sites, saída dist |
| dist/index.html | Conteúdo, import map, dialogs e metadata |
| dist/styles.css | Temas, hero, navegação e responsividade |
| dist/experience.css | Projetos, manifesto e dialogs |
| dist/app.js | Tema, menu, formas e progresso |
| dist/scene.js | Escultura WebGL, luz e interação |
| dist/experience.js | Motion de scroll e projetos |
| dist/vendor/ | Three.js local, ambiente e licença |
| dist/assets/loop-art.png | Arte original gerada para LOOP |
| scripts/prepare-vendor.mjs | Copia vendor após npm ci |
| scripts/serve.mjs | Servidor de arquivos |
| scripts/verificar-documentacao.mjs | Sintaxe via npm check, documentos, links e assets |
| segunda-mente/AXIS/ | Fonte de verdade atual |
| segunda-mente/Cafe/ | Histórico da direção anterior |

[Índice](../AXIS.md)

## Laboratório

- dist/ideas.css: mascote e mural responsivos.
- dist/ideas.js: dicas, geração, persistência e desfazer.
- dist/idea-engine.mjs: 18 ideias curadas e normalização.
- dist/assets/ixi.png: mascote original transparente.
- test/idea-engine.test.mjs: categorias, repetição e dados inválidos.

## Colisão e plano

index.html: modos, seletores e launch-dialog. ideas.js: composição, plano/exportação e tilt. ideas.css: órbitas, seletores e dialog responsivo.

## Refinamento visual

Dist/ideas.css inclui bloco final de refinamento de hierarquia, superfícies, controles de toque e responsividade; também ajusta tokens do tema claro. Nenhum arquivo de lógica foi alterado.

## Versionamento e manipulação 3D

- .gitignore: exclui dependências, ambiente, metadados locais de hospedagem e zips.
- .github/workflows/check.yml: instalação, check e testes em push/pull request, sem deploy.
- test/scene.test.mjs: interação com raycast real e DOM/renderer simulados.
- dist/scene.js: arraste, teclado, controles de giro e reinício.
- dist/index.html / dist/styles.css: instruções, foco e controles responsivos do hero.
- README.md: uso do 3D e fluxo de atualizações pelo GitHub.
