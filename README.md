# Gerador de Senhas Seguras

Aplicação web simples que gera **senhas aleatórias e seguras** com base em critérios escolhidos pelo usuário: tamanho (entre 4 e 12 caracteres), letras maiúsculas e minúsculas, números e símbolos. A geração usa **`crypto.getRandomValues`** (aleatoriedade criptográfica), não `Math.random`.

Inclui **tema claro e escuro** (dois botões), com preferência salva no navegador (`localStorage`). Na **primeira visita**, o tema padrão é **claro**.

---

## Sumário

- [Requisitos](#requisitos)
- [Obter o projeto](#obter-o-projeto)
- [Como executar a aplicação](#como-executar-a-aplicação)
- [Como usar na interface](#como-usar-na-interface)
- [Testes automatizados](#testes-automatizados)
- [Relatórios do Robot Framework](#relatórios-do-robot-framework)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Solução de problemas](#solução-de-problemas)

---

## Requisitos

| Ferramenta | Uso |
|------------|-----|
| **Navegador atualizado** (Chrome, Edge, Firefox) | Rodar a interface |
| **Node.js 18+** ([nodejs.org](https://nodejs.org)) | Scripts `npm test` (opcional mas recomendado) |
| **Python 3.10+** ([python.org](https://www.python.org)) | Apenas se for rodar os testes com **Robot Framework** |

Não é obrigório instalar dependências Node com `npm install`: este projeto **não usa pacotes npm** na aplicação; o `package.json` só define scripts de conveniência.

---

## Obter o projeto

```bash
git clone https://github.com/augustocaio95/gerador-senhas-seguras.git
cd gerador-senhas-seguras
```


---

## Como executar a aplicação

O projeto usa **JavaScript em modo módulo** (`import`/`export`). Em alguns navegadores, abrir `index.html` direto pelo sistema de arquivos (`file://`) pode bloquear módulos ou comportar-se de forma inconsistente. Por isso o recomendado é servir a pasta por um **servidor HTTP local**.

Sempre execute os comandos **na pasta raiz do projeto** (onde está o `index.html`).

### Opção A — VS Code / Cursor: Live Server

1. Instale a extensão **Live Server** (Ritwick Dey).
2. Abra a pasta do projeto no editor.
3. Clique com o botão direito em `index.html` → **Open with Live Server**.
4. O navegador abrirá em algo como `http://127.0.0.1:5500`.

### Opção B — Servidor estático com Node (`npx`)

Não exige instalar pacotes no projeto:

```bash
npx --yes serve .
```

No terminal aparecerá o endereço (ex.: `http://localhost:3000`). Abra esse URL no navegador.

### Opção C — Servidor com Python

```bash
# Windows / Linux / macOS
python -m http.server 8080
```

Depois acesse: `http://localhost:8080`

Se `python` não for reconhecido no Windows, tente `py -m http.server 8080`.

### Opção D — Abrir o arquivo direto

Você pode abrir `index.html` com duplo clique. Se a página carregar mas os botões não funcionarem ou o console mostrar erro de módulo, use uma das opções com servidor (**A**, **B** ou **C**).

---

## Como usar na interface

1. Ajuste o **tamanho** da senha (barra: 4 a 12 caracteres).
2. Marque ou desmarque **maiúsculas**, **minúsculas**, **números** e **símbolos** (pelo menos um tipo deve permanecer marcado).
3. Clique em **Gerar senha**.
4. Use **Copiar** para copiar a senha para a área de transferência.
5. Em **Selecione o tema da página**, escolha **Claro** ou **Escuro**; a escolha é lembrada neste navegador.

---

## Testes automatizados

Todos os comandos abaixo devem ser executados **na raiz do projeto**.

### Testes em Node.js (`node:test`)

```bash
npm test
```

Modo observação (reexecuta ao salvar arquivos):

```bash
npm run test:watch
```

### Testes com Robot Framework

1. Crie e ative um ambiente virtual (recomendado, opcional):

   ```bash
   python -m venv .venv
   ```

   - **Windows (cmd):** `.venv\Scripts\activate`
   - **Windows (PowerShell):** `.venv\Scripts\Activate.ps1`
   - **Linux / macOS:** `source .venv/bin/activate`

2. Instale as dependências de teste:

   ```bash
   pip install -r requirements-test.txt
   ```

3. Rode a suíte:

   ```bash
   npm run test:robot
   ```

Equivalência direta:

```bash
robot --outputdir results tests/robot/password_generator.robot
```

Se o comando `robot` não for encontrado, use:

```bash
python -m robot --outputdir results tests/robot/password_generator.robot
```

---

## Relatórios do Robot Framework

Após `npm run test:robot`, os arquivos são gerados na pasta **`results/`**:

| Arquivo | Conteúdo |
|---------|----------|
| `results/report.html` | Resumo da execução (abra no navegador) |
| `results/log.html` | Log detalhado por passo |
| `results/output.xml` | Resultado em XML (CI / ferramentas) |

A pasta `results/` existe no repositório (com `.gitkeep`); os relatórios gerados são ignorados pelo Git para não poluir commits.

---

## Estrutura do projeto

```text
.
├── index.html              # Interface
├── styles.css              # Estilos (tema claro/escuro)
├── package.json            # Scripts npm (testes)
├── requirements-test.txt    # Robot Framework (Python)
├── results/                 # Relatórios do Robot (gerados)
├── src/
│   ├── password.js         # Lógica de geração e validação
│   └── app.js              # UI, tema, cópia para clipboard
└── tests/
    ├── password.test.js    # Testes Node
    └── robot/
        ├── password_bridge.mjs    # Ponte Node ↔ Robot
        └── password_generator.robot
```

---

## Solução de problemas

| Problema | O que fazer |
|----------|-------------|
| Página em branco ou erros de `import` no console | Use um **servidor local** (Live Server, `npx serve` ou `python -m http.server`), não `file://`. |
| `npm` não encontrado | Instale [Node.js](https://nodejs.org) e reinicie o terminal. |
| `robot` não encontrado | Ative o venv se estiver usando um; rode `python -m robot ...` ou confira `pip show robotframework`. |
| `pip` instala no Python errado | Use `python -m pip install -r requirements-test.txt` com o mesmo `python` que você usa para rodar os testes. |
| Porta já em uso (ex.: 8080) | Troque a porta: `python -m http.server 9090` e abra `http://localhost:9090`. |
| Copiar senha falha | Alguns navegadores exigem **HTTPS** ou contexto seguro para `clipboard`; tente em `localhost` com servidor HTTP. |

---

## Licença
 
MIT
