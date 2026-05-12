# 🎨 DIAGRAMAS E FLUXOS VISUAIS

## 📊 ARQUITETURA GERAL

```
┌─────────────────────────────────────────────────────────────┐
│                    BOLÃO COPA 2026                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             FRONTEND (Next.js 16)                    │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                      │   │
│  │  Pages:                Components:                  │   │
│  │  ├─ /login             ├─ CardAbertas             │   │
│  │  ├─ /register          ├─ CardAoVivo              │   │
│  │  ├─ /                  ├─ CardEncerradas          │   │
│  │  ├─ /leaderboard       ├─ Header (logout)         │   │
│  │  └─ /my-bets           ├─ BetModal               │   │
│  │                        └─ StatsTable              │   │
│  │                                                      │   │
│  │  Tailwind CSS + Lucide Icons                       │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                            ▲                                  │
│                            │                                  │
│                   Server Actions + Fetch                     │
│                            │                                  │
│                            ▼                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         BACKEND (Supabase + PostgreSQL)             │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                      │   │
│  │  🔐 AUTENTICAÇÃO                                    │   │
│  │  ├─ auth.users (Supabase Auth)                     │   │
│  │  └─ Sessions (Cookies)                              │   │
│  │                                                      │   │
│  │  💾 BANCO DE DADOS                                  │   │
│  │  ├─ user_profiles                                   │   │
│  │  ├─ user_stats                                      │   │
│  │  ├─ matches                                         │   │
│  │  └─ bets                                            │   │
│  │                                                      │   │
│  │  ⚙️  TRIGGERS & FUNCTIONS                            │   │
│  │  ├─ calculate_points()                              │   │
│  │  └─ update_points_on_match_finish()                │   │
│  │                                                      │   │
│  │  🔒 ROW LEVEL SECURITY                              │   │
│  │  └─ Políticas de privacidade                       │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 FLUXO DE AUTENTICAÇÃO

```
┌─────────────────────────────────────────────────────────┐
│          FLUXO DE LOGIN E CADASTRO                      │
└─────────────────────────────────────────────────────────┘

NOVO USUÁRIO:
  │
  ├─→ Acessa /register
  │      │
  │      ├─→ Preenche: nome, email, senha
  │      │
  │      ├─→ Clica "Criar minha conta"
  │      │
  │      ├─→ Supabase.auth.signUp()
  │      │      │
  │      │      ├─→ Cria usuário em auth.users
  │      │      │
  │      │      └─→ Trigger on_auth_user_created
  │      │             │
  │      │             ├─→ Cria user_profiles
  │      │             │
  │      │             └─→ Cria user_stats
  │      │
  │      ├─→ ✅ Sucesso!
  │      │
  │      └─→ Redireciona para /login
  │
  └─→ Agora pode fazer login

USUÁRIO EXISTENTE:
  │
  ├─→ Acessa /login
  │      │
  │      ├─→ Preenche: email, senha
  │      │
  │      ├─→ Clica "Entrar no bolão"
  │      │
  │      ├─→ Supabase.auth.signInWithPassword()
  │      │      │
  │      │      ├─→ Valida credenciais
  │      │      │
  │      │      ├─→ ✅ OK: Cria sessão com cookie
  │      │      │
  │      │      └─→ ❌ Erro: "Invalid credentials"
  │      │
  │      ├─→ Redireciona para /
  │      │
  │      └─→ ✅ Logado!

LOGOUT:
  │
  ├─→ Header → Clica em "Sair"
  │      │
  │      ├─→ Supabase.auth.signOut()
  │      │      │
  │      │      └─→ Limpa sessão/cookie
  │      │
  │      └─→ Redireciona para /login
```

---

## 🎲 FLUXO DE APOSTA

```
┌─────────────────────────────────────────────────────────┐
│         CICLO COMPLETO: APOSTA → RESULTADO             │
└─────────────────────────────────────────────────────────┘

STATUS: "SCHEDULED" (Partida Agendada)
  │
  ├─→ Home mostra card com "Apostar"
  │
  ├─→ Usuário clica "Apostar"
  │      │
  │      ├─→ Abre BetModal
  │      │
  │      ├─→ Preenche: gols casa, gols visitante
  │      │
  │      ├─→ Clica "Confirmar Aposta"
  │      │      │
  │      │      ├─→ Valida entrada
  │      │      │
  │      │      ├─→ Verifica se partida ainda em "scheduled"
  │      │      │
  │      │      └─→ Insere em bets table
  │      │
  │      └─→ ✅ Aposta criada!
  │
  ├─→ Status da partida muda para "LIVE"
  │
  ├─→ Home agora mostra:
  │      └─→ Sua aposta: Brasil 2 x 1 Argentina
  │      └─→ Placar atual: Brasil 1 x 0 Argentina
  │
  ├─→ Status da partida muda para "FINISHED"
  │      │
  │      ├─→ Admin atualiza: goals_home=1, goals_away=0
  │      │
  │      ├─→ Trigger update_points_on_match_finish() DISPARA
  │      │      │
  │      │      ├─→ Calcula pontos para cada aposta:
  │      │      │      │
  │      │      │      ├─→ Acertou placar exato (1x0)? 
  │      │      │      │      └─→ ❌ Não, apostou 2x1
  │      │      │      │
  │      │      │      └─→ Acertou resultado (Brasil vence)?
  │      │      │             └─→ ✅ Sim! +5 pontos
  │      │      │
  │      │      └─→ Atualiza user_stats:
  │      │             ├─→ total_bets += 1
  │      │             ├─→ correct_predictions += 1
  │      │             └─→ total_points += 5
  │      │
  │      └─→ Aposta finalizada!
  │
  ├─→ Home mostra:
  │      └─→ Você apostou: Brasil 2 x 1 Argentina
  │      └─→ Placar final: Brasil 1 x 0 Argentina
  │      └─→ ✅ Resultado correto! +5 pontos
  │
  └─→ Leaderboard atualizado com novo score
```

---

## 💾 ESTRUTURA DO BANCO DE DADOS

```
┌─────────────────────────────────────────────────────────┐
│        SCHEMA DO SUPABASE POSTGRESQL                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────┐
│      auth.users             │
│  (Supabase padrão)          │
├─────────────────────────────┤
│ id (UUID)           [PK]    │
│ email (TEXT)                │
│ encrypted_password          │
│ email_confirmed_at          │
│ created_at                  │
│ updated_at                  │
└────────────┬────────────────┘
             │
             │ REFERENCES
             │
             ▼
┌─────────────────────────────┐
│    user_profiles            │
├─────────────────────────────┤
│ id (UUID)           [PK]    │
│ username (TEXT)     [UNIQUE]│
│ full_name (TEXT)            │
│ avatar_url (TEXT)           │
│ created_at                  │
│ updated_at                  │
└────────────┬────────────────┘
             │
             │ HAS MANY
             │
             ▼
     ┌───────────────────┐
     │   user_stats      │
     ├───────────────────┤
     │ user_id (UUID) PK │
     │ total_bets        │
     │ correct_pred.     │
     │ total_points      │
     │ updated_at        │
     └───────────────────┘

┌─────────────────────────────┐
│       matches               │
├─────────────────────────────┤
│ id (UUID)           [PK]    │
│ team_home (TEXT)            │
│ team_away (TEXT)            │
│ date_time (TIMESTAMP)       │
│ status (TEXT)               │
│   ├─ 'scheduled'            │
│   ├─ 'live'                 │
│   └─ 'finished'             │
│ goals_home (INT)            │
│ goals_away (INT)            │
│ phase (TEXT)                │
│ group_letter (TEXT)         │
│ created_at                  │
│ updated_at                  │
└────────────┬────────────────┘
             │
             │ HAS MANY
             │
             ▼
┌─────────────────────────────┐
│         bets                │
├─────────────────────────────┤
│ id (UUID)           [PK]    │
│ user_id (UUID)      [FK]    │◄─┐
│ match_id (UUID)     [FK]    │◄─┼─→ matches
│ prediction_home     ├─→ user_profiles
│ prediction_away             │
│ points_earned (INT)         │
│ created_at                  │
│ updated_at                  │
│ UNIQUE(user_id, match_id)   │
└─────────────────────────────┘
```

---

## 📈 FLUXO DE DADOS - REAL-TIME

```
┌─────────────────────────────────────────────────────────┐
│     COMO OS DADOS FLUEM NA APLICAÇÃO                    │
└─────────────────────────────────────────────────────────┘

1️⃣ USUÁRIO ACESSA HOME:
   ┌────────────────────────┐
   │ Browser                │
   │ GET /                  │
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ Next.js Server         │
   │ page.tsx               │
   └────────┬───────────────┘
            │
            ├─→ getMatchesByStatus('scheduled')
            │        │
            │        ▼
            │   ┌─────────────┐
            │   │ Supabase    │
            │   │ SELECT ...  │
            │   │ WHERE status│
            │   └─────────────┘
            │        │
            ├─→ Retorna matches
            │
            ▼
   ┌────────────────────────┐
   │ CardAbertas x N        │
   │ Renderiza cards        │
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ HTML + CSS             │
   │ Envia ao Browser       │
   └────────────────────────┘

2️⃣ USUÁRIO CLICA "APOSTAR":
   ┌────────────────────────┐
   │ Client Component       │
   │ BetModal abre          │
   └────────────────────────┘

3️⃣ USUÁRIO PREENCHE E CONFIRMA:
   ┌────────────────────────┐
   │ Client Component       │
   │ onClick handler        │
   └────────┬───────────────┘
            │
            ├─→ createBet(matchId, home, away)
            │   (Server Action)
            │        │
            │        ▼
            │   ┌─────────────────────┐
            │   │ Server Component    │
            │   │ Valida dados        │
            │   │ Verifica auth       │
            │   │ INSERT bets         │
            │   └──────┬──────────────┘
            │          │
            │          ▼
            │   ┌─────────────────────┐
            │   │ Supabase            │
            │   │ INSERT ...          │
            │   │ INTO bets           │
            │   └──────┬──────────────┘
            │          │
            │          ▼
            │   ┌─────────────────────┐
            │   │ ✅ Aposta salva     │
            │   │ revalidatePath('/')  │
            │   └─────────────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ BetModal fecha         │
   │ Home atualiza          │
   └────────────────────────┘

4️⃣ PARTIDA TERMINA (Admin):
   ┌────────────────────────────────┐
   │ Admin atualiza match:           │
   │ goals_home = 1                  │
   │ goals_away = 0                  │
   │ status = 'finished'             │
   └────────────┬────────────────────┘
                │
                ▼
   ┌────────────────────────────────┐
   │ Trigger SQL dispara:            │
   │ update_points_on_match_finish() │
   └────────────┬────────────────────┘
                │
                ├─→ FOR EACH bet in bets WHERE match_id:
                │        │
                │        ├─→ calculate_points()
                │        │
                │        └─→ UPDATE bets SET points_earned = ?
                │
                ├─→ FOR EACH user WITH updated bets:
                │        │
                │        └─→ UPDATE user_stats SET total_points = ?
                │
                └─→ ✅ Todos os scores atualizados!

5️⃣ USUÁRIO ACESSA LEADERBOARD:
   ┌────────────────────────┐
   │ GET /leaderboard       │
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ SELECT * FROM          │
   │ user_stats             │
   │ ORDER BY total_points  │
   │ DESC LIMIT 100         │
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ Tabela ranking com     │
   │ todos os usuários      │
   │ ordenados por pontos   │
   └────────────────────────┘
```

---

## 🔒 SECURITY & ROW LEVEL SECURITY

```
┌─────────────────────────────────────────────────────────┐
│         ROW LEVEL SECURITY POLICIES                     │
└─────────────────────────────────────────────────────────┘

user_profiles:
  ├─ SELECT: Qualquer um pode ler ✅
  │   └─ user_profiles.SELECT: WHERE true
  │
  └─ UPDATE: Só o próprio usuário ✅
      └─ user_profiles.UPDATE: WHERE auth.uid() = id

matches:
  └─ SELECT: Qualquer um pode ler ✅
      └─ matches.SELECT: WHERE true

bets:
  ├─ SELECT: Qualquer um pode ler (público) ✅
  │   └─ bets.SELECT: WHERE true
  │
  ├─ INSERT: Só usuário logado ✅
  │   └─ bets.INSERT: WITH CHECK (auth.uid() = user_id)
  │
  ├─ UPDATE: Só o próprio usuário ✅
  │   └─ bets.UPDATE: WHERE auth.uid() = user_id
  │
  └─ DELETE: Só o próprio usuário ✅
      └─ bets.DELETE: WHERE auth.uid() = user_id

user_stats:
  └─ SELECT: Qualquer um pode ler (ranking público) ✅
      └─ user_stats.SELECT: WHERE true

RESULTADO:
  ✅ Usuários só podem modificar seus próprios dados
  ✅ Dados de outros usuários são visíveis mas não modificáveis
  ✅ Não há riscos de segurança
```

---

## 📅 TIMELINE DE DESENVOLVIMENTO

```
┌─────────────────────────────────────────────────────────┐
│         CRONOGRAMA DE 16-24 DIAS                        │
└─────────────────────────────────────────────────────────┘

SEMANA 1
┌─────────┐
│ Dia 1-2 │ Supabase Setup + SQL
│         │ ├─ Criar conta ✅
│         │ ├─ Credenciais ✅
│         │ ├─ Execute SQL
│         │ ├─ Criar tabelas
│         │ └─ Testar conexão
└─────────┘

┌─────────┐
│ Dia 3-4 │ Implementar Login
│         │ ├─ Adicionar estado React
│         │ ├─ Integrar Supabase Auth
│         │ ├─ Tratamento de erro
│         │ ├─ Loading state
│         │ └─ Redirect pós-login
└─────────┘

┌─────────┐
│ Dia 5-6 │ Implementar Cadastro
│         │ ├─ Criar página /register
│         │ ├─ Validações
│         │ ├─ signUp() Supabase
│         │ ├─ Criar user_profiles
│         │ └─ Testar flow completo
└─────────┘

┌─────────┐
│ Dia 7   │ Proteção de Rotas + Header
│         │ ├─ Middleware
│         │ ├─ Logout button
│         │ ├─ Header dropdown
│         │ └─ Testar logout
└─────────┘

SEMANA 2
┌─────────┐
│ Dia 8-9 │ Dados Dinâmicos
│         │ ├─ Server Actions matches
│         │ ├─ Buscar do BD
│         │ ├─ Atualizar componentes
│         │ └─ Revalidation
└─────────┘

┌──────────┐
│ Dia 10-12│ Sistema de Apostas
│          │ ├─ BetModal component
│          │ ├─ Server Actions bets
│          │ ├─ Validações
│          │ └─ Testar aposta e2e
└──────────┘

┌──────────┐
│ Dia 13-14│ Sistema de Pontos
│          │ ├─ Função cálculo
│          │ ├─ Trigger SQL
│          │ ├─ Atualizar stats
│          │ └─ Testar pontuação
└──────────┘

┌──────────┐
│ Dia 15-16│ Ranking + Polimento
│          │ ├─ Página leaderboard
│          │ ├─ Testes gerais
│          │ ├─ Melhorias UX
│          │ └─ Deploy
└──────────┘

BÔNUS (Optional):
- Email notifications
- Real-time updates
- Mobile app
- Admin dashboard
```

---

## 🧪 MATRIZ DE TESTES

```
┌──────────────────────────────────────────────────────────┐
│              TESTES E VALIDAÇÃO                          │
└──────────────────────────────────────────────────────────┘

🟢 AUTENTICAÇÃO
├─ Login com credenciais válidas         ✅ Deve logar
├─ Login com credenciais inválidas       ✅ Deve erro
├─ Cadastro com email existente          ✅ Deve erro
├─ Cadastro com senha fraca              ✅ Deve erro
├─ Logout deve limpar sessão             ✅ Deve sair
└─ Proteção de rotas                     ✅ Deve redir. /login

🟢 APOSTA
├─ Criar aposta em scheduled             ✅ Deve salvar
├─ Tentar aposta em live                 ✅ Deve erro
├─ Tentar aposta em finished             ✅ Deve erro
├─ Atualizar aposta em scheduled         ✅ Deve atualizar
├─ Validar gols 0-20                     ✅ Deve validar
└─ Uma aposta por partida (UNIQUE)       ✅ Deve erro

🟢 PONTUAÇÃO
├─ Placar correto = 10 pts               ✅ Deve +10
├─ Resultado correto = 5 pts             ✅ Deve +5
├─ Errado = 0 pts                        ✅ Deve +0
├─ Atualizar stats quando termina        ✅ Deve atualizar
└─ Leaderboard mostrar ordenado          ✅ Deve ordem

🟢 BANCO DE DADOS
├─ RLS policies funcionam                ✅ Deve proteger
├─ Usuário vê só seus dados              ✅ Deve restringir
├─ Admin pode atualizar match            ✅ Deve permitir
├─ Dados públicos visíveis               ✅ Deve mostrar
└─ Índices funcionam (performance)       ✅ Deve ser rápido

🟢 INTERFACE
├─ Forms validam em tempo real           ✅ Deve validar
├─ Loading states mostram                ✅ Deve mostrar
├─ Erros em modal/toast                  ✅ Deve mostrar
├─ Responsivo mobile/desktop             ✅ Deve adaptar
└─ Cores/UI consistentes                 ✅ Deve ser bonito
```

---

*Documentação completa gerada em: 11 de Maio de 2026*
