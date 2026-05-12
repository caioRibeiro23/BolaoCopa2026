# 🎯 ROADMAP COMPLETO - Bolão Copa 2026

> **Data**: 11 de Maio de 2026  
> **Versão**: MVP Completo (3-4 semanas)

---

## 📊 ANÁLISE ATUAL

### ✅ O QUE JÁ EXISTE

```
INFRAESTRUTURA
├── Next.js 16.2.6 com App Router ✅
├── Supabase configurado (lib/supabase/*) ✅
├── TypeScript ✅
├── Tailwind CSS ✅
└── Lucide Icons + Phosphor Icons ✅

PÁGINAS
├── / (Home) - Listagem de partidas ✅
├── /login - Layout de login ✅ (sem funcionalidade)
├── /instruments ✅
├── /stats ✅
└── /register ❌ (não existe)

COMPONENTES
├── CardAbertas ✅
├── CardAoVivo ✅
├── CardEncerradas ✅
├── HeroSection ✅
├── Championship/History Tables ✅
└── Flag Components ✅

DADOS ATUAIS
├── Partidas HARDCODED na home ⚠️
├── Sem banco de dados real ⚠️
├── Sem autenticação funcional ⚠️
└── Sem sistema de apostas ⚠️
```

---

## 🔴 PROBLEMAS CRÍTICOS

### 1. **Autenticação Não Funciona**
```tsx
// ❌ HOJE - Sem funcionalidade
<input type="email" placeholder="seuemail@exemplo.com" />
<button>Entrar no bolão</button>

// ✅ PRECISA SER - Conectado ao Supabase
<input value={email} onChange={e => setEmail(e.target.value)} />
<button onClick={handleLogin}>Entrar no bolão</button>
```

**Faltando**:
- Estado React (email, senha)
- Função `handleLogin()` com Supabase
- Tratamento de erro
- Redirecionamento após sucesso
- Loading state

### 2. **Dados de Partidas Não Vêm do BD**
```tsx
// ❌ HOJE - Hardcoded
<CardAbertas paisCasa="Brasil" paisVisitante="Argentina" />

// ✅ PRECISA SER - Dinâmico
matches.map(match => <CardAbertas match={match} />)
```

**Faltando**:
- Tabela `matches` no Supabase
- Server Action para buscar partidas
- Componentes ajustados para dados dinâmicos

### 3. **Sem Sistema de Apostas**
```tsx
// ❌ NÃO EXISTE
- Nenhuma forma de fazer aposta
- Sem cálculo de pontos
- Sem histórico de apostas

// ✅ PRECISA TER
- Formulário de aposta com validação
- Salvamento no BD
- Sistema de pontos automático
- Visualização de histórico
```

---

## 📋 PASSO A PASSO DETALHADO

### FASE 1️⃣: PREPARAÇÃO E SUPABASE (1-2 dias)

#### 1.1 - Criar Credenciais no Supabase

**O que fazer**:
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Escolha um nome: `bolao_copa_2026`
4. Escolha região: `South America - São Paulo` (ou próxima)
5. Copie as credenciais:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
   ```

6. Crie o arquivo `.env.local` na raiz do projeto:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
   ```

7. Teste a conexão com:
   ```bash
   npm run dev
   ```
   Se não der erro, ✅ está pronto!

---

#### 1.2 - Criar Tabelas no Supabase

**No painel do Supabase**, execute este SQL:

```sql
-- 1️⃣ TABELA DE PERFIS DE USUÁRIOS
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2️⃣ TABELA DE PARTIDAS
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_home TEXT NOT NULL,
  team_away TEXT NOT NULL,
  date_time TIMESTAMP NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'live', 'finished')),
  goals_home INT,
  goals_away INT,
  phase TEXT NOT NULL, -- 'groups', 'round_16', 'quarterfinals', 'semifinals', 'final'
  group_letter TEXT, -- A-H para fase de grupos
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3️⃣ TABELA DE APOSTAS
CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  prediction_home INT NOT NULL,
  prediction_away INT NOT NULL,
  points_earned INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, match_id) -- Um usuário só faz uma aposta por partida
);

-- 4️⃣ TABELA DE ESTATÍSTICAS DO USUÁRIO
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_bets INT DEFAULT 0,
  correct_predictions INT DEFAULT 0,
  total_points INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5️⃣ ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_date ON matches(date_time);
CREATE INDEX idx_bets_user ON bets(user_id);
CREATE INDEX idx_bets_match ON bets(match_id);
```

**Copie e cole no SQL Editor do Supabase** → "Run"

---

#### 1.3 - Configurar Row Level Security (RLS)

No painel do Supabase, para cada tabela:

```sql
-- Para user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
ON user_profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Para matches (todos podem ler)
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read matches"
ON matches FOR SELECT USING (true);

-- Para bets (usuários veem suas apostas, e podem ler apostas de outros)
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all bets"
ON bets FOR SELECT USING (true);

CREATE POLICY "Users can create and update own bets"
ON bets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bets"
ON bets FOR UPDATE USING (auth.uid() = user_id);

-- Para user_stats
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stats"
ON user_stats FOR SELECT USING (true);
```

---

### FASE 2️⃣: AUTENTICAÇÃO - LOGIN (2-3 dias)

#### 2.1 - Implementar Página de Login Funcional

**Arquivo**: `src/app/login/page.tsx`

```tsx
'use client'

import { LockKeyhole, MailIcon, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const supabase = createClient()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                setError(error.message)
                return
            }

            // Sucesso! Redirecionar para home
            router.push("/")
        } catch (err) {
            setError("Erro ao fazer login. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center bg-[url('/background/fundoLogin.png')] bg-cover bg-center h-screen font-inter gap-5 ">
            <div className="w-11/12 md:w-7/12 bp-1024:w-6/12 lg:w-4/12 bg-azulEscuro/82 border border-[#FFFFFF]/10 rounded-2xl flex flex-col items-start px-9 py-10 gap-6">
                <div className="flex flex-col items-start gap-1 w-full">
                    <h1 className="font-bebas-neue text-lg bp-1024:text-2xl">Entrar na sua conta</h1>
                    <p className="text-white/45 text-xs bp-1024:text-sm">Bem vindo! Faça login para continuar</p>
                </div>

                <form onSubmit={handleLogin} className="w-full flex flex-col items-start gap-3.5">
                    {/* Campo Email */}
                    <div className="w-full flex flex-col gap-1 items-start">
                        <h3 className="text-sm bp-1024:text-base">E-mail</h3>
                        <div className="relative w-full">
                            <MailIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                            <input
                                type="email"
                                placeholder="seuemail@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-[10px] py-2 bp-1024:py-4 pl-12 pr-3 bg-transparent border border-[#FFFFFF]/12 text-white placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]/20 focus:border-[#FFFFFF]/20"
                            />
                        </div>
                    </div>

                    {/* Campo Senha */}
                    <div className="w-full flex flex-col gap-1 items-start">
                        <div className="w-full flex justify-between items-center">
                            <h3 className="text-sm bp-1024:text-base">Senha</h3>
                            <Link href="/forgot-password" className="text-xs bp-1024:text-xs text-verdeNeon font-medium cursor-pointer hover:underline">
                                Esqueci minha senha
                            </Link>
                        </div>
                        <div className="relative w-full">
                            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-[10px] py-2 bp-1024:py-4 pl-12 pr-12 bg-transparent border border-[#FFFFFF]/12 text-white placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]/20 focus:border-[#FFFFFF]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="pointer-events-auto cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-white transition-colors duration-200"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="w-full bg-red-500/20 border border-red-500 rounded px-3 py-2">
                            <p className="text-red-200 text-xs">{error}</p>
                        </div>
                    )}

                    {/* Botão Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-linear-to-r from-verdeNeon to-[#22C55E] text-black font-bold py-2 bp-1024:py-4 px-6 rounded-[10px] cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-verdeNeon/10 hover:scale-101 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={20} className="animate-spin" />}
                        {loading ? "Entrando..." : "Entrar no bolão"}
                    </button>
                </form>

                {/* Link Cadastro */}
                <p className="w-full text-xs bp-1024:text-sm text-white/40 text-center">
                    Ainda não tem uma conta? <Link href="/register" className="text-verdeNeon font-medium hover:underline">Cadastre-se grátis!</Link>
                </p>
            </div>
        </div>
    )
}
```

**Checklist**:
- [x] Estado com email, senha, loading, error
- [x] Função handleLogin com Supabase
- [x] Tratamento de erro com mensagem
- [x] Loading state no botão
- [x] Redirecionamento para "/" após sucesso
- [x] Link para cadastro

---

### FASE 3️⃣: AUTENTICAÇÃO - CADASTRO (2-3 dias)

#### 3.1 - Criar Página de Registro

**Arquivo**: `src/app/register/page.tsx`

```tsx
'use client'

import { LockKeyhole, MailIcon, Eye, EyeOff, Loader2, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const supabase = createClient()

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        // Validações
        if (!fullName.trim()) {
            setError("Nome completo é obrigatório")
            return
        }
        if (password.length < 6) {
            setError("Senha deve ter pelo menos 6 caracteres")
            return
        }
        if (password !== confirmPassword) {
            setError("As senhas não coincidem")
            return
        }

        setLoading(true)

        try {
            // 1. Criar usuário no Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            })

            if (authError) {
                setError(authError.message)
                return
            }

            // 2. Criar perfil do usuário
            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('user_profiles')
                    .insert({
                        id: authData.user.id,
                        full_name: fullName,
                        username: email.split('@')[0] // Username baseado no email
                    })

                if (profileError) {
                    setError("Erro ao criar perfil: " + profileError.message)
                    return
                }

                // 3. Criar estatísticas iniciais
                await supabase
                    .from('user_stats')
                    .insert({
                        user_id: authData.user.id,
                        total_bets: 0,
                        correct_predictions: 0,
                        total_points: 0
                    })
            }

            // Sucesso! Redirecionar para login
            router.push("/login?registered=true")
        } catch (err) {
            setError("Erro ao cadastrar. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center bg-[url('/background/fundoLogin.png')] bg-cover bg-center min-h-screen font-inter gap-5 py-10">
            <div className="w-11/12 md:w-7/12 bp-1024:w-6/12 lg:w-4/12 bg-azulEscuro/82 border border-[#FFFFFF]/10 rounded-2xl flex flex-col items-start px-9 py-10 gap-6">
                <div className="flex flex-col items-start gap-1 w-full">
                    <h1 className="font-bebas-neue text-lg bp-1024:text-2xl">Criar sua conta</h1>
                    <p className="text-white/45 text-xs bp-1024:text-sm">Junte-se ao bolão da Copa 2026!</p>
                </div>

                <form onSubmit={handleRegister} className="w-full flex flex-col items-start gap-3.5">
                    {/* Campo Nome */}
                    <div className="w-full flex flex-col gap-1 items-start">
                        <h3 className="text-sm bp-1024:text-base">Nome Completo</h3>
                        <div className="relative w-full">
                            <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                            <input
                                type="text"
                                placeholder="Seu nome completo"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full rounded-[10px] py-2 bp-1024:py-4 pl-12 pr-3 bg-transparent border border-[#FFFFFF]/12 text-white placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]/20 focus:border-[#FFFFFF]/20"
                            />
                        </div>
                    </div>

                    {/* Campo Email */}
                    <div className="w-full flex flex-col gap-1 items-start">
                        <h3 className="text-sm bp-1024:text-base">E-mail</h3>
                        <div className="relative w-full">
                            <MailIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                            <input
                                type="email"
                                placeholder="seuemail@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-[10px] py-2 bp-1024:py-4 pl-12 pr-3 bg-transparent border border-[#FFFFFF]/12 text-white placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]/20 focus:border-[#FFFFFF]/20"
                            />
                        </div>
                    </div>

                    {/* Campo Senha */}
                    <div className="w-full flex flex-col gap-1 items-start">
                        <h3 className="text-sm bp-1024:text-base">Senha</h3>
                        <div className="relative w-full">
                            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-[10px] py-2 bp-1024:py-4 pl-12 pr-12 bg-transparent border border-[#FFFFFF]/12 text-white placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]/20 focus:border-[#FFFFFF]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="pointer-events-auto cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-white transition-colors duration-200"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Campo Confirmar Senha */}
                    <div className="w-full flex flex-col gap-1 items-start">
                        <h3 className="text-sm bp-1024:text-base">Confirmar Senha</h3>
                        <div className="relative w-full">
                            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirme sua senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full rounded-[10px] py-2 bp-1024:py-4 pl-12 pr-12 bg-transparent border border-[#FFFFFF]/12 text-white placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]/20 focus:border-[#FFFFFF]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="pointer-events-auto cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-white transition-colors duration-200"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="w-full bg-red-500/20 border border-red-500 rounded px-3 py-2">
                            <p className="text-red-200 text-xs">{error}</p>
                        </div>
                    )}

                    {/* Botão Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-linear-to-r from-verdeNeon to-[#22C55E] text-black font-bold py-2 bp-1024:py-4 px-6 rounded-[10px] cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-verdeNeon/10 hover:scale-101 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={20} className="animate-spin" />}
                        {loading ? "Criando conta..." : "Criar minha conta"}
                    </button>
                </form>

                {/* Link Login */}
                <p className="w-full text-xs bp-1024:text-sm text-white/40 text-center">
                    Já tem uma conta? <Link href="/login" className="text-verdeNeon font-medium hover:underline">Faça login!</Link>
                </p>
            </div>
        </div>
    )
}
```

**Checklist**:
- [x] Todos os campos (nome, email, senha x2)
- [x] Validações (tamanho senha, senhas iguais)
- [x] Criar usuário no Auth
- [x] Criar perfil em user_profiles
- [x] Criar estatísticas iniciais
- [x] Tratamento de erro
- [x] Loading state
- [x] Redirecionamento para /login

---

### FASE 4️⃣: PROTEÇÃO DE ROTAS (1 dia)

#### 4.1 - Criar Middleware

**Arquivo**: `src/middleware.ts`

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

#### 4.2 - Atualizar Arquivo de Server Supabase

**Arquivo**: `lib/supabase/server.ts` (adicionar função de middleware)

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet, _headers) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  )
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, _headers) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if needed
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirecionar usuários não autenticados para /login
  if (!user && request.nextUrl.pathname.startsWith('/')) {
    if (request.nextUrl.pathname !== '/login' && request.nextUrl.pathname !== '/register') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Redirecionar usuários autenticados que tentam acessar /login
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

**Checklist**:
- [x] Criar arquivo middleware.ts
- [x] Proteger rotas - não autenticados vão para /login
- [x] Redirecionar autenticados de /login para /

---

### FASE 5️⃣: COMPONENTE HEADER COM LOGOUT (1 dia)

#### 5.1 - Criar Header Component

**Arquivo**: `src/components/Header/Header.tsx`

```tsx
'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ChevronDown, LogOut, User } from "lucide-react"

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()

    // Carrega dados do usuário ao montar
    async function loadUser() {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', authUser.id)
                .single()
            setUser(profile)
        }
    }

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <header className="bg-azulEscuro border-b border-[#FFFFFF]/10 px-8 py-4 flex justify-between items-center">
            <Link href="/" className="font-bebas-neue text-2xl text-verdeNeon">
                ⚽ BOLAÇO 2026
            </Link>

            <div className="relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition"
                >
                    <User size={20} className="text-verdeNeon" />
                    <span className="text-sm">{user?.full_name || "Usuário"}</span>
                    <ChevronDown size={16} className={`transition ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-azulEscuro border border-[#FFFFFF]/10 rounded-lg overflow-hidden z-50">
                        <Link href="/profile" className="block px-4 py-2 hover:bg-white/10 text-sm">
                            Meu Perfil
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-400 text-sm flex items-center gap-2"
                        >
                            <LogOut size={16} />
                            Sair
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}
```

#### 5.2 - Adicionar Header ao Layout

**Arquivo**: `src/app/layout.tsx` (ajustar)

```tsx
// Adicionar condicional para mostrar Header apenas para usuários autenticados
import Header from "@/components/Header/Header"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${bebas.variable} ${inter.variable} ${roboto.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
```

---

### FASE 6️⃣: DINÂMICO - PARTIDAS DO BANCO (2-3 dias)

#### 6.1 - Criar Server Actions para Partidas

**Arquivo**: `src/app/actions/matches.ts`

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'

export async function getMatches() {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('date_time', { ascending: true })

    if (error) {
        console.error('Erro ao buscar partidas:', error)
        return []
    }

    return data
}

export async function getMatchesByStatus(status: 'scheduled' | 'live' | 'finished') {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('status', status)
        .order('date_time', { ascending: true })

    if (error) {
        console.error('Erro ao buscar partidas:', error)
        return []
    }

    return data
}

export async function getMatchById(id: string) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Erro ao buscar partida:', error)
        return null
    }

    return data
}
```

#### 6.2 - Popular Dados de Partidas

Na console do Supabase, execute:

```sql
-- Inserir todas as 64 partidas da Copa 2026
-- Fase de Grupos (48 partidas) - 21 de junho a 13 de julho

-- Grupo A
INSERT INTO matches (team_home, team_away, date_time, status, phase, group_letter) VALUES
('Uruguai', 'Tailândia', '2026-06-21 14:00', 'scheduled', 'groups', 'A'),
('Paraguai', 'Marrocos', '2026-06-21 17:00', 'scheduled', 'groups', 'A'),
('Uruguai', 'Paraguai', '2026-06-25 17:00', 'scheduled', 'groups', 'A'),
('Tailândia', 'Marrocos', '2026-06-25 20:00', 'scheduled', 'groups', 'A'),
('Tailândia', 'Uruguai', '2026-06-29 16:00', 'scheduled', 'groups', 'A'),
('Marrocos', 'Paraguai', '2026-06-29 16:00', 'scheduled', 'groups', 'A');

-- Grupo B (6 partidas)
-- Grupo C (6 partidas)
-- Grupo D (6 partidas)
-- Grupo E (6 partidas)
-- Grupo F (6 partidas)
-- Grupo G (6 partidas)
-- Grupo H (6 partidas)

-- ... (adicione as outras 58 partidas)
```

#### 6.3 - Atualizar Página Home com Dados Dinâmicos

**Arquivo**: `src/app/page.tsx`

```tsx
import HeroSection from "../components/HeroSection/herosection"
import CardAbertas from "../components/cards/cardAbertas"
import CardAoVivo from "../components/cards/cardAoVivo"
import CardEncerradas from "../components/cards/cardEncerradas"
import TitlePage from "../components/ui/titlepage"
import { getMatchesByStatus } from "./actions/matches"

export default async function Home() {
  const matchesOpen = await getMatchesByStatus('scheduled')
  const matchesLive = await getMatchesByStatus('live')
  const matchesFinished = await getMatchesByStatus('finished')

  return (
    <div>
      <HeroSection />

      <div className="w-full px-8 py-14 md:px-14 md:py-17 flex flex-col gap-8 bg-azulEscuro">
        <TitlePage title="Partidas de Hoje"/>

        {/* Partidas Abertas */}
        {matchesOpen.length > 0 && (
          <div className="w-full flex flex-col gap-3">
            <div className="w-full px-[2px] gap-2 flex flex-row items-center">
              <div className="w-2 h-2 aspect-square rounded-4xl bg-verdeNeon shadow-[0_0_8px_#39FF14]"></div>
              <span className="text-verdeNeon text-xs font-inter tracking-[1.5px] font-bold">ABERTAS ({matchesOpen.length})</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-verdeNeon/40 to-verdeNeon/0"></div>
            </div>

            {matchesOpen.map((match: any) => (
              <CardAbertas
                key={match.id}
                matchId={match.id}
                paisCasa={match.team_home}
                paisVisitante={match.team_away}
                hora={new Date(match.date_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                grupo={match.group_letter}
              />
            ))}
          </div>
        )}

        {/* Partidas Ao Vivo */}
        {matchesLive.length > 0 && (
          <div className="w-full flex flex-col gap-3">
            <div className="w-full px-[2px] gap-2 flex flex-row items-center">
              <div className="w-2 h-2 aspect-square rounded-4xl bg-[#FF4455] shadow-[0_0_8px_#FF4455]"></div>
              <span className="text-[#FF4455] text-xs font-inter tracking-[1.5px] font-bold">AO VIVO ({matchesLive.length})</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#FF4455]/40 to-[#FF4455]/0"></div>
            </div>

            {matchesLive.map((match: any) => (
              <CardAoVivo
                key={match.id}
                matchId={match.id}
                paisCasa={match.team_home}
                paisVisitante={match.team_away}
                grupo={match.group_letter}
                tempo={0} // Será obtido de API externa se quiser
                placarCasa={match.goals_home || 0}
                placarVisitante={match.goals_away || 0}
              />
            ))}
          </div>
        )}

        {/* Partidas Encerradas */}
        {matchesFinished.length > 0 && (
          <div className="w-full flex flex-col gap-3">
            <div className="w-full px-[2px] gap-2 flex flex-row items-center">
              <div className="w-2 h-2 aspect-square rounded-4xl bg-cinzaSuave"></div>
              <span className="text-cinzaSuave text-xs font-inter tracking-[1.5px] font-bold">ENCERRADAS ({matchesFinished.length})</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-cinzaSuave/40 to-cinzaSuave/0"></div>
            </div>

            {matchesFinished.map((match: any) => (
              <CardEncerradas
                key={match.id}
                matchId={match.id}
                paisCasa={match.team_home}
                paisVisitante={match.team_away}
                grupo={match.group_letter}
                tempo={90}
                placarCasa={match.goals_home || 0}
                placarVisitante={match.goals_away || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

---

### FASE 7️⃣: SISTEMA DE APOSTAS (3-4 dias)

#### 7.1 - Criar Component de Aposta Modal

**Arquivo**: `src/components/BetModal/BetModal.tsx`

```tsx
'use client'

import { Loader2, X } from "lucide-react"
import { useState } from "react"
import { createBet } from "@/app/actions/bets"

interface BetModalProps {
    isOpen: boolean
    onClose: () => void
    matchId: string
    teamHome: string
    teamAway: string
}

export default function BetModal({ isOpen, onClose, matchId, teamHome, teamAway }: BetModalProps) {
    const [goalsHome, setGoalsHome] = useState(0)
    const [goalsAway, setGoalsAway] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleCreateBet() {
        setError("")
        setLoading(true)

        try {
            const result = await createBet({
                matchId,
                prediction_home: goalsHome,
                prediction_away: goalsAway
            })

            if (result.error) {
                setError(result.error)
                return
            }

            // Sucesso!
            setGoalsHome(0)
            setGoalsAway(0)
            onClose()
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-azulEscuro border border-[#FFFFFF]/10 rounded-2xl p-6 w-11/12 max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bebas-neue">Fazer Aposta</h2>
                    <button onClick={onClose} className="text-white/50 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between bg-white/10 rounded-lg p-4">
                        <span className="text-sm">{teamHome}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setGoalsHome(Math.max(0, goalsHome - 1))}
                                className="bg-white/10 hover:bg-white/20 rounded px-2 py-1"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                min="0"
                                max="20"
                                value={goalsHome}
                                onChange={(e) => setGoalsHome(Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                                className="w-12 bg-white/5 text-center rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-verdeNeon"
                            />
                            <button
                                onClick={() => setGoalsHome(Math.min(20, goalsHome + 1))}
                                className="bg-white/10 hover:bg-white/20 rounded px-2 py-1"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="text-center text-white/50">×</div>

                    <div className="flex items-center justify-between bg-white/10 rounded-lg p-4">
                        <span className="text-sm">{teamAway}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setGoalsAway(Math.max(0, goalsAway - 1))}
                                className="bg-white/10 hover:bg-white/20 rounded px-2 py-1"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                min="0"
                                max="20"
                                value={goalsAway}
                                onChange={(e) => setGoalsAway(Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                                className="w-12 bg-white/5 text-center rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-verdeNeon"
                            />
                            <button
                                onClick={() => setGoalsAway(Math.min(20, goalsAway + 1))}
                                className="bg-white/10 hover:bg-white/20 rounded px-2 py-1"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {error && <div className="bg-red-500/20 border border-red-500 rounded p-3 text-red-200 text-sm">{error}</div>}

                    <button
                        onClick={handleCreateBet}
                        disabled={loading}
                        className="w-full bg-verdeNeon text-black font-bold py-2 rounded-lg hover:bg-[#22C55E] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={20} className="animate-spin" />}
                        Confirmar Aposta
                    </button>
                </div>
            </div>
        </div>
    )
}
```

#### 7.2 - Criar Server Actions para Apostas

**Arquivo**: `src/app/actions/bets.ts`

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBet({
    matchId,
    prediction_home,
    prediction_away
}: {
    matchId: string
    prediction_home: number
    prediction_away: number
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Usuário não autenticado' }
    }

    // Verificar se a partida já começou
    const { data: match } = await supabase
        .from('matches')
        .select('status')
        .eq('id', matchId)
        .single()

    if (match?.status !== 'scheduled') {
        return { error: 'Não é possível apostar em partidas que já começaram' }
    }

    // Tentar criar ou atualizar a aposta
    const { error } = await supabase
        .from('bets')
        .upsert({
            user_id: user.id,
            match_id: matchId,
            prediction_home,
            prediction_away,
            updated_at: new Date().toISOString()
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}

export async function getUserBets() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('bets')
        .select('*, matches(*)')
        .eq('user_id', user.id)

    if (error) {
        return []
    }

    return data
}

export async function getBetsByMatch(matchId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('bets')
        .select('*, user_profiles(*)')
        .eq('match_id', matchId)

    if (error) {
        return []
    }

    return data
}
```

#### 7.3 - Atualizar CardAbertas para Ter Botão de Aposta

**Arquivo**: `src/components/cards/cardAbertas.tsx` (adicionar BetModal)

```tsx
'use client'

import { useState } from "react"
import BetModal from "@/components/BetModal/BetModal"

interface CardAbertasProps {
    matchId: string
    paisCasa: string
    paisVisitante: string
    hora: string
    grupo: string
}

export default function CardAbertas({
    matchId,
    paisCasa,
    paisVisitante,
    hora,
    grupo
}: CardAbertasProps) {
    const [betModalOpen, setBetModalOpen] = useState(false)

    return (
        <>
            <div className="bg-white/5 border border-verdeNeon/20 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition">
                <div className="flex justify-between items-center">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-verdeNeon font-bold">GRUPO {grupo}</span>
                            <span className="text-xs text-white/50">{hora}</span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-bold">{paisCasa}</span>
                            <span className="text-xs text-white/50">vs</span>
                            <span className="font-bold">{paisVisitante}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setBetModalOpen(true)}
                        className="bg-verdeNeon text-black px-4 py-2 rounded font-bold hover:bg-[#22C55E] transition whitespace-nowrap ml-4"
                    >
                        Apostar
                    </button>
                </div>
            </div>

            <BetModal
                isOpen={betModalOpen}
                onClose={() => setBetModalOpen(false)}
                matchId={matchId}
                teamHome={paisCasa}
                teamAway={paisVisitante}
            />
        </>
    )
}
```

---

### FASE 8️⃣: SISTEMA DE PONTOS (2-3 dias)

#### 8.1 - Criar Função de Cálculo de Pontos

**Arquivo**: `src/lib/points.ts`

```typescript
export function calculatePoints(
    prediction_home: number,
    prediction_away: number,
    goals_home: number,
    goals_away: number
): number {
    // Acertou o placar exato = 10 pontos
    if (prediction_home === goals_home && prediction_away === goals_away) {
        return 10
    }

    // Acertou apenas o resultado
    const predictedResult = Math.sign(prediction_home - prediction_away)
    const actualResult = Math.sign(goals_home - goals_away)

    if (predictedResult === actualResult) {
        return 5
    }

    // Errou
    return 0
}
```

#### 8.2 - Criar Trigger no Supabase (SQL)

Na console do Supabase:

```sql
-- Função para atualizar pontos quando partida termina
CREATE OR REPLACE FUNCTION update_points_on_match_finish()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'finished' AND OLD.status != 'finished' THEN
    UPDATE bets
    SET points_earned = CASE
      WHEN NEW.goals_home = prediction_home AND NEW.goals_away = prediction_away THEN 10
      WHEN SIGN(NEW.goals_home - NEW.goals_away) = SIGN(prediction_home - prediction_away) THEN 5
      ELSE 0
    END
    WHERE match_id = NEW.id;

    -- Atualizar estatísticas do usuário
    UPDATE user_stats
    SET total_points = (
      SELECT COALESCE(SUM(points_earned), 0)
      FROM bets
      WHERE bets.user_id = user_stats.user_id
    ),
    correct_predictions = (
      SELECT COUNT(*)
      FROM bets
      WHERE bets.user_id = user_stats.user_id AND points_earned > 0
    ),
    updated_at = NOW()
    WHERE user_id IN (
      SELECT DISTINCT user_id FROM bets WHERE match_id = NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_points
AFTER UPDATE ON matches
FOR EACH ROW
EXECUTE FUNCTION update_points_on_match_finish();
```

---

### FASE 9️⃣: PÁGINA DE RANKING (2 dias)

#### 9.1 - Criar Página de Leaderboard

**Arquivo**: `src/app/leaderboard/page.tsx`

```tsx
import { createClient } from "@/lib/supabase/server"
import { Medal } from "lucide-react"

export default async function LeaderboardPage() {
    const supabase = await createClient()

    const { data: stats } = await supabase
        .from('user_stats')
        .select('*, user_profiles(*)')
        .order('total_points', { ascending: false })
        .limit(100)

    return (
        <div className="px-8 py-14 md:px-14 bg-azulEscuro min-h-screen">
            <h1 className="font-bebas-neue text-3xl mb-8">🏆 Ranking</h1>

            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-white/10 border-b border-white/10">
                    <div className="col-span-1">#</div>
                    <div className="col-span-4">Jogador</div>
                    <div className="col-span-2 text-center">Apostas</div>
                    <div className="col-span-2 text-center">Acertos</div>
                    <div className="col-span-3 text-center">Pontos</div>
                </div>

                {stats?.map((stat: any, index: number) => (
                    <div key={stat.user_id} className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition">
                        <div className="col-span-1 flex items-center">
                            {index < 3 && <Medal size={20} className={index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-orange-600'} />}
                            <span>{index + 1}</span>
                        </div>
                        <div className="col-span-4">{stat.user_profiles?.full_name}</div>
                        <div className="col-span-2 text-center">{stat.total_bets}</div>
                        <div className="col-span-2 text-center text-verdeNeon font-bold">{stat.correct_predictions}</div>
                        <div className="col-span-3 text-center font-bold text-2xl">{stat.total_points}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
```

---

## ⏱️ ESTIMATIVA DE TEMPO

| Fase | Duração | Prioridade |
|------|---------|-----------|
| 1 - Preparação Supabase | **1-2 dias** | 🔴 CRÍTICA |
| 2 - Login | **2-3 dias** | 🔴 CRÍTICA |
| 3 - Cadastro | **2-3 dias** | 🔴 CRÍTICA |
| 4 - Proteção Rotas | **1 dia** | 🔴 CRÍTICA |
| 5 - Header/Logout | **1 dia** | 🟠 ALTA |
| 6 - Partidas Dinâmicas | **2-3 dias** | 🟠 ALTA |
| 7 - Sistema Apostas | **3-4 dias** | 🟠 ALTA |
| 8 - Sistema Pontos | **2-3 dias** | 🟠 ALTA |
| 9 - Ranking | **2 dias** | 🟡 MÉDIA |

**⏰ TOTAL: 16-24 dias**

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. ✅ Criar conta no Supabase
2. ✅ Copiar credenciais
3. ✅ Criar `.env.local`
4. ✅ Executar SQL para criar tabelas
5. ✅ Implementar login funcional
6. ✅ Implementar cadastro

---

## 📚 RECURSOS

- **Supabase Docs**: https://supabase.com/docs
- **Next.js 16 Docs**: https://nextjs.org/docs
- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **PostgreSQL**: https://www.postgresql.org/docs/

---

**Versão**: 1.0  
**Última atualização**: 11 de Maio de 2026
