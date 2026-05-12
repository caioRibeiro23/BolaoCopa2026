# 🎬 GUIA PASSO A PASSO - Como Começar

## 📖 Índice Rápido
1. **Preparação Supabase** (15 min)
2. **Configurar Credenciais** (5 min)
3. **Executar SQL** (10 min)
4. **Testar Conexão** (5 min)
5. **Implementar Login** (2-3 horas)
6. **Implementar Cadastro** (2-3 horas)

---

## ✅ PASSO 1: CRIAR CONTA SUPABASE (5 min)

### 1.1 Acesse Supabase
```
URL: https://supabase.com
```

### 1.2 Clique em "Sign Up"
- Email
- Senha
- Verificar email

### 1.3 Criar Projeto
```
Name: bolao_copa_2026
Region: South America (São Paulo) ou su-east-1
```

Aguarde criação (~2 minutos)

---

## 🔑 PASSO 2: COPIAR CREDENCIAIS (5 min)

### 2.1 Abra Seu Projeto

No painel do Supabase, clique em:
```
Settings → API
```

### 2.2 Copie Essas Duas Informações

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = eyJ0eXAiOiJKV1QiLCJhbGci...
```

### 2.3 Crie Arquivo `.env.local`

Na raiz do projeto (`c:\Users\Vinicius\Documents\Bolaco\BolaoCopa2026\`), crie um arquivo chamado `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGci...
```

⚠️ **IMPORTANTE**: Substitua pelos seus valores reais!

---

## 🗄️ PASSO 3: EXECUTAR SQL (10 min)

### 3.1 Abra SQL Editor

No Supabase:
```
Settings → SQL Editor
```

Ou clique em:
```
SQL (lado esquerdo) → New Query
```

### 3.2 Copie TODO O SQL

Abra o arquivo: `SETUP_SUPABASE.sql` (que foi criado)

Copie TUDO (Ctrl+A, Ctrl+C)

### 3.3 Cole no Editor

```
[Clique na caixa de SQL]
Ctrl+A (seleciona tudo)
Ctrl+V (cola o SQL)
```

### 3.4 Execute

Clique no botão verde "Run" ou aperte Ctrl+Enter

**Aguarde** (~30 segundos)

Você verá:
```
✅ Query executed successfully
```

### 3.5 Verifique as Tabelas

Clique em "Table Editor" (lado esquerdo)

Você deve ver:
```
✅ user_profiles
✅ matches (com 48 partidas)
✅ bets
✅ user_stats
```

---

## 🧪 PASSO 4: TESTAR CONEXÃO (5 min)

### 4.1 Terminal

Na pasta do projeto, execute:

```bash
npm run dev
```

### 4.2 Acesse em Browser

```
http://localhost:3000
```

### 4.3 Verifique

Se vir a página sem erros, ✅ Supabase está conectado!

Se vir erro:
```
❌ "Cannot find env variables"
```

Verifique:
1. `.env.local` existe?
2. Valores estão corretos?
3. Não tem espaços extras?
4. Reinicie `npm run dev`

---

## 🔐 PASSO 5: IMPLEMENTAR LOGIN (2-3 horas)

### 5.1 Abra Arquivo de Login

```
src/app/login/page.tsx
```

### 5.2 Copie o Código Novo

No arquivo `ROADMAP.md`, seção "FASE 2 - LOGIN", copie o código completo.

### 5.3 Cole no Arquivo

Selecione todo o conteúdo do arquivo e substitua pelo novo código.

### 5.4 Teste

```bash
npm run dev
```

Acesse: `http://localhost:3000/login`

**Teste manual**:
1. Digite um email
2. Digite uma senha
3. Clique em "Entrar no bolão"

**Resultado esperado**:
```
❌ Erro: "Invalid login credentials" (normal, usuário não existe ainda)
```

Se vir esse erro, ✅ Login está funcionando!

---

## 📝 PASSO 6: IMPLEMENTAR CADASTRO (2-3 horas)

### 6.1 Crie Novo Arquivo

```
src/app/register/page.tsx
```

### 6.2 Copie Código

No `ROADMAP.md`, seção "FASE 3 - CADASTRO", copie o código.

### 6.3 Cole no Novo Arquivo

Selecione tudo, cole o código.

### 6.4 Teste

Acesse: `http://localhost:3000/register`

**Teste manual**:
1. Preencha nome completo
2. Email válido
3. Senha (6+ caracteres)
4. Confirme senha igual
5. Clique "Criar minha conta"

**Resultado esperado**:
```
✅ Redirecionado para /login
✅ Mensagem: "Ainda não tem uma conta?"
```

### 6.5 Teste Login com Nova Conta

1. Acesse `/login`
2. Use o email do cadastro
3. Use a senha do cadastro
4. Clique "Entrar no bolão"

**Resultado esperado**:
```
✅ Redirecionado para /
✅ Página home carregada
```

---

## 🚀 PASSO 7: PRÓXIMAS FASES (Opcional)

Após login e cadastro funcionando:

### Fase 4: Proteção de Rotas
```
Arquivo: src/middleware.ts
Tempo: ~1 dia
```

### Fase 5: Header com Logout
```
Arquivo: src/components/Header/Header.tsx
Tempo: ~1 dia
```

### Fase 6: Dados Dinâmicos
```
Arquivo: src/app/actions/matches.ts
Tempo: ~2 dias
```

### Fase 7: Sistema de Apostas
```
Arquivo: src/components/BetModal/BetModal.tsx
Tempo: ~3 dias
```

---

## 🐛 TROUBLESHOOTING

### Problema: "Cannot GET /login"

**Solução**:
```bash
npm run dev
```

Aguarde compilação completa (~30 segundos)

### Problema: "Invalid database URL"

**Solução**:
1. Verifique `.env.local`
2. Valores corretos?
3. Sem espaços extras?
4. Salve o arquivo
5. Reinicie `npm run dev`

### Problema: "Email already exists"

**Solução**:
Use um email diferente ou delete o usuário no Supabase:
```
Auth → Users → Clique no usuário → Delete user
```

### Problema: Botão não funciona

**Solução**:
1. Abra DevTools (F12)
2. Vá para "Console"
3. Veja se tem erros
4. Se sim, copie o erro e Google it!

### Problema: Página em branco

**Solução**:
1. Abra DevTools (F12)
2. Clique em "Console"
3. Procure por erros vermelhos
4. Se houver, leia a mensagem

---

## 📚 ARQUIVOS IMPORTANTE

```
✅ ROADMAP.md - Guia completo (26+ KB)
✅ RESUMO_EXECUTIVO.md - Resumo visual
✅ SETUP_SUPABASE.sql - SQL pronto para executar
✅ .env.local - Suas credenciais (não versionar!)
```

---

## ✨ CHECKLIST FINAL

- [ ] Conta Supabase criada
- [ ] `.env.local` configurado
- [ ] SQL executado
- [ ] Tabelas criadas (verificar em Table Editor)
- [ ] Projeto roda sem erros (`npm run dev`)
- [ ] Login implementado
- [ ] Cadastro implementado
- [ ] Teste login com novo usuário
- [ ] Teste logout
- [ ] Pronto para próximas fases!

---

## 📞 SE TIVER DÚVIDAS

1. **Consulte ROADMAP.md** - Tem código completo para cada etapa
2. **Consulte RESUMO_EXECUTIVO.md** - Overview gráfico
3. **Docs Supabase**: https://supabase.com/docs
4. **Docs Next.js**: https://nextjs.org/docs

---

## 🎯 META: COMPLETAR EM

```
Hoje (AGORA):
├─ Supabase criado ✅
├─ .env.local pronto ✅
├─ SQL executado ✅
└─ Teste conexão ✅

Amanhã:
├─ Login funcional 🔄
├─ Cadastro funcional 🔄
└─ Teste e-to-e ✅

Próximas 2 semanas:
├─ Proteção rotas
├─ Dados dinâmicos
├─ Sistema apostas
├─ Sistema pontos
└─ Ranking
```

---

**Boa sorte! 🚀**

*Este guia foi criado em: 11 de Maio de 2026*
