# Radar Vinhera / VinhoBR

Aplicativo Bun/TypeScript com duas abas independentes e base única de importadoras.

## Arquivos
- `index.ts`: servidor e API de importação compatível com a versão atual.
- `public/index.html`: interface com abas Vinhera e VinhoBR.
- `package.json`: comando de inicialização.

## Rodar
```bash
bun install
bun run start
```

## Railway
**Não substitua o serviço atual antes de validar.** Crie um serviço de teste a partir deste repositório. O serviço atual usa um volume persistente em `/data`, com os arquivos `catalog.json`, `costs.json`, `offers.json` e `updated.txt`. O novo aplicativo é compatível com esses arquivos, mas um serviço de teste não deve apontar para o volume de produção.

O Railway deve usar o comando `bun run start`, com `PORT` definido automaticamente. Em desenvolvimento local, configure `DATA_DIR` para um diretório gravável.

## Regras
- Vinhera usa somente `catalog.json`.
- VinhoBR usa somente `costs.json`.
- Ambas consultam `offers.json`.
- Nenhum custo é copiado automaticamente de VinhoBR para Vinhera.
- Custo final VinhoBR já inclui impostos.
- Card = custo × 1,6 + R$20; Pix = Card × 0,9.
- Safras até 2017 só podem ser consideradas iguais quando as safras são idênticas.
- Correspondência de nome é apenas sugestão e exige revisão.

## Observações
Importações são em CSV. A identificação de campos varia conforme os cabeçalhos. Não há autenticação nesta versão de teste: não publique dados comerciais sensíveis em uma instância pública sem adicionar controle de acesso.
