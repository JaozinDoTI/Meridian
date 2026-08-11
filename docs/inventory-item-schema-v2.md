# Item JSON — schema v2

O schema v2 amplia o item visual sem alterar as regras espaciais. Arquivos v1 continuam aceitos.

```json
{
  "tipo": "grimorio-item",
  "schemaVersion": 2,
  "item": {
    "nome": "Casaco Blindado Mk-II",
    "tipo": "armadura",
    "raridade": "raro",
    "descricao": "Casaco reforçado com placas internas de aço negro.",
    "peso": 7.5,
    "quantidade": 1,
    "tamanho": { "largura": 2, "altura": 3 },
    "imagem": "assets/items/casaco-blindado.webp",
    "atributoPrincipal": { "rotulo": "Defesa", "valor": "+3" },
    "propriedades": ["Blindado", "Resistente ao corte"],
    "equipavelEm": "armadura"
  }
}
```

## Campos visuais opcionais

- `quantidade`: inteiro entre 1 e 999; padrão `1`.
- `imagem`: caminho relativo/local ou imagem `data:` PNG, JPEG, WebP ou GIF. URLs remotas não são aceitas.
- `atributoPrincipal`: objeto com `rotulo` e `valor` textuais.
- `propriedades`: até oito textos, cada um com no máximo 90 caracteres.
- `equipavelEm`: identificador textual do slot (`armadura`, `maoPrincipal` ou `maoSecundaria`). Armas sem slot explícito podem ser equipadas em qualquer uma das mãos; a interface solicita a escolha ao jogador.

Os campos obrigatórios e as validações espaciais permanecem iguais ao schema v1: `nome`, `tipo`, `raridade`, `peso` e `tamanho`.
