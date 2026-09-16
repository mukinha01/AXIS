# Arquitetura

HTML, CSS e JavaScript sem dependências. `dist/` é o site final, sem compilação. Node.js é usado apenas para servir os arquivos no desenvolvimento e validar documentação.

O catálogo é um objeto no JavaScript. A seleção vive na memória e começa no cappuccino. Não há persistência nem solicitações a backend. Imagens são locais; fontes são obtidas do Google Fonts com alternativas de sistema.

O efeito é 2.5D: fotografias recortadas recebem transformações em perspectiva. Não são modelos tridimensionais e não há rotação completa da bebida.

Sites utiliza `.openai/hosting.json` com `static.directory: dist` para publicação privada. Nunca versionar credenciais.

[Índice](../Cafe.md) · [Decisões](Decisoes.md)
