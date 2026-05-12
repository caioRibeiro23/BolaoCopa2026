-- ============================================
-- SCRIPT SQL COMPLETO - BOLÃO COPA 2026
-- ============================================
-- Execute este script inteiro no SQL Editor do Supabase
-- Copie tudo, cole no painel do Supabase e clique "Run"

-- ============================================
-- 1️⃣ CRIAR TABELA: user_profiles
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comentário
COMMENT ON TABLE user_profiles IS 'Perfis dos usuários do bolão';
COMMENT ON COLUMN user_profiles.id IS 'ID do usuário (referencia auth.users)';
COMMENT ON COLUMN user_profiles.username IS 'Nome de usuário único';
COMMENT ON COLUMN user_profiles.full_name IS 'Nome completo do usuário';
COMMENT ON COLUMN user_profiles.avatar_url IS 'URL da foto de perfil';

-- ============================================
-- 2️⃣ CRIAR TABELA: matches
-- ============================================
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_home TEXT NOT NULL,
  team_away TEXT NOT NULL,
  date_time TIMESTAMP NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'live', 'finished')),
  goals_home INT DEFAULT NULL,
  goals_away INT DEFAULT NULL,
  phase TEXT NOT NULL,
  group_letter TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE matches IS 'Partidas da Copa 2026';
COMMENT ON COLUMN matches.id IS 'ID único da partida';
COMMENT ON COLUMN matches.team_home IS 'Seleção da casa';
COMMENT ON COLUMN matches.team_away IS 'Seleção visitante';
COMMENT ON COLUMN matches.date_time IS 'Data e hora da partida';
COMMENT ON COLUMN matches.status IS 'Estado da partida: scheduled, live, finished';
COMMENT ON COLUMN matches.goals_home IS 'Gols da seleção da casa (NULL se não começou)';
COMMENT ON COLUMN matches.goals_away IS 'Gols da seleção visitante (NULL se não começou)';
COMMENT ON COLUMN matches.phase IS 'Fase: groups, round_16, quarterfinals, semifinals, final';
COMMENT ON COLUMN matches.group_letter IS 'Letra do grupo (A-H) ou NULL se eliminatória';

-- ============================================
-- 3️⃣ CRIAR TABELA: bets
-- ============================================
CREATE TABLE IF NOT EXISTS bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  prediction_home INT NOT NULL CHECK (prediction_home >= 0 AND prediction_home <= 20),
  prediction_away INT NOT NULL CHECK (prediction_away >= 0 AND prediction_away <= 20),
  points_earned INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, match_id)
);

COMMENT ON TABLE bets IS 'Apostas dos usuários nas partidas';
COMMENT ON COLUMN bets.user_id IS 'ID do usuário que fez a aposta';
COMMENT ON COLUMN bets.match_id IS 'ID da partida';
COMMENT ON COLUMN bets.prediction_home IS 'Gols previstos para casa';
COMMENT ON COLUMN bets.prediction_away IS 'Gols previstos para visitante';
COMMENT ON COLUMN bets.points_earned IS 'Pontos conquistados (0-10)';

-- ============================================
-- 4️⃣ CRIAR TABELA: user_stats
-- ============================================
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_bets INT DEFAULT 0,
  correct_predictions INT DEFAULT 0,
  total_points INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE user_stats IS 'Estatísticas gerais do usuário';
COMMENT ON COLUMN user_stats.user_id IS 'ID do usuário';
COMMENT ON COLUMN user_stats.total_bets IS 'Total de apostas realizadas';
COMMENT ON COLUMN user_stats.correct_predictions IS 'Apostas que acertaram (pontos > 0)';
COMMENT ON COLUMN user_stats.total_points IS 'Total de pontos conquistados';

-- ============================================
-- 5️⃣ CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date_time);
CREATE INDEX IF NOT EXISTS idx_matches_phase ON matches(phase);
CREATE INDEX IF NOT EXISTS idx_bets_user ON bets(user_id);
CREATE INDEX IF NOT EXISTS idx_bets_match ON bets(match_id);
CREATE INDEX IF NOT EXISTS idx_bets_user_match ON bets(user_id, match_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_total_points ON user_stats(total_points DESC);

-- ============================================
-- 6️⃣ HABILITAR ROW LEVEL SECURITY
-- ============================================

-- user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
ON user_profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authenticated users can insert profile"
ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- matches
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read matches"
ON matches FOR SELECT USING (true);

-- bets
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all bets"
ON bets FOR SELECT USING (true);

CREATE POLICY "Users can create own bets"
ON bets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bets"
ON bets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bets"
ON bets FOR DELETE USING (auth.uid() = user_id);

-- user_stats
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read user stats"
ON user_stats FOR SELECT USING (true);

-- ============================================
-- 7️⃣ CRIAR TRIGGER: ATUALIZAR PONTOS
-- ============================================

-- Função para calcular pontos
CREATE OR REPLACE FUNCTION calculate_points(
  prediction_home INT,
  prediction_away INT,
  goals_home INT,
  goals_away INT
)
RETURNS INT AS $$
BEGIN
  -- Acertou o placar exato = 10 pontos
  IF prediction_home = goals_home AND prediction_away = goals_away THEN
    RETURN 10;
  END IF;

  -- Acertou apenas o resultado
  IF SIGN(prediction_home - prediction_away) = SIGN(goals_home - goals_away) THEN
    RETURN 5;
  END IF;

  -- Errou
  RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar pontos quando partida termina
CREATE OR REPLACE FUNCTION update_points_on_match_finish()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'finished' AND OLD.status != 'finished' AND NEW.goals_home IS NOT NULL AND NEW.goals_away IS NOT NULL THEN
    -- Atualizar pontos em cada aposta
    UPDATE bets
    SET 
      points_earned = calculate_points(prediction_home, prediction_away, NEW.goals_home, NEW.goals_away),
      updated_at = NOW()
    WHERE match_id = NEW.id;

    -- Atualizar estatísticas dos usuários
    UPDATE user_stats
    SET 
      total_points = (
        SELECT COALESCE(SUM(points_earned), 0)
        FROM bets
        WHERE bets.user_id = user_stats.user_id
      ),
      correct_predictions = (
        SELECT COUNT(*)
        FROM bets
        WHERE bets.user_id = user_stats.user_id AND points_earned > 0
      ),
      total_bets = (
        SELECT COUNT(*)
        FROM bets
        WHERE bets.user_id = user_stats.user_id
      ),
      updated_at = NOW()
    WHERE user_id IN (
      SELECT DISTINCT user_id FROM bets WHERE match_id = NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trigger_update_points ON matches;
CREATE TRIGGER trigger_update_points
AFTER UPDATE ON matches
FOR EACH ROW
EXECUTE FUNCTION update_points_on_match_finish();

-- ============================================
-- 8️⃣ POPULAR DADOS - PARTIDAS DA COPA 2026
-- ============================================

-- GRUPO A (6 partidas)
INSERT INTO matches (team_home, team_away, date_time, status, phase, group_letter) VALUES
('Uruguai', 'Tailândia', '2026-06-21 14:00:00', 'scheduled', 'groups', 'A'),
('Paraguai', 'Marrocos', '2026-06-21 17:00:00', 'scheduled', 'groups', 'A'),
('Uruguai', 'Paraguai', '2026-06-25 17:00:00', 'scheduled', 'groups', 'A'),
('Tailândia', 'Marrocos', '2026-06-25 20:00:00', 'scheduled', 'groups', 'A'),
('Tailândia', 'Uruguai', '2026-06-29 16:00:00', 'scheduled', 'groups', 'A'),
('Marrocos', 'Paraguai', '2026-06-29 16:00:00', 'scheduled', 'groups', 'A')
ON CONFLICT DO NOTHING;

-- GRUPO B (6 partidas)
INSERT INTO matches (team_home, team_away, date_time, status, phase, group_letter) VALUES
('França', 'Holanda', '2026-06-21 11:00:00', 'scheduled', 'groups', 'B'),
('Senegal', 'Dinamarca', '2026-06-21 20:00:00', 'scheduled', 'groups', 'B'),
('França', 'Senegal', '2026-06-25 14:00:00', 'scheduled', 'groups', 'B'),
('Holanda', 'Dinamarca', '2026-06-25 23:00:00', 'scheduled', 'groups', 'B'),
('Dinamarca', 'França', '2026-06-29 20:00:00', 'scheduled', 'groups', 'B'),
('Holanda', 'Senegal', '2026-06-29 20:00:00', 'scheduled', 'groups', 'B')
ON CONFLICT DO NOTHING;

-- GRUPO C (6 partidas)
INSERT INTO matches (team_home, team_away, date_time, status, phase, group_letter) VALUES
('Argentina', 'Polônia', '2026-06-22 14:00:00', 'scheduled', 'groups', 'C'),
('México', 'Arábia Saudita', '2026-06-22 17:00:00', 'scheduled', 'groups', 'C'),
('Argentina', 'México', '2026-06-26 17:00:00', 'scheduled', 'groups', 'C'),
('Polônia', 'Arábia Saudita', '2026-06-26 20:00:00', 'scheduled', 'groups', 'C'),
('Arábia Saudita', 'Argentina', '2026-06-30 20:00:00', 'scheduled', 'groups', 'C'),
('México', 'Polônia', '2026-06-30 20:00:00', 'scheduled', 'groups', 'C')
ON CONFLICT DO NOTHING;

-- GRUPO D (6 partidas)
INSERT INTO matches (team_home, team_away, date_time, status, phase, group_letter) VALUES
('Japão', 'Alemanha', '2026-06-22 11:00:00', 'scheduled', 'groups', 'D'),
('Espanha', 'Costa Rica', '2026-06-22 20:00:00', 'scheduled', 'groups', 'D'),
('Japão', 'Espanha', '2026-06-26 14:00:00', 'scheduled', 'groups', 'D'),
('Alemanha', 'Costa Rica', '2026-06-26 23:00:00', 'scheduled', 'groups', 'D'),
('Costa Rica', 'Japão', '2026-06-30 16:00:00', 'scheduled', 'groups', 'D'),
('Espanha', 'Alemanha', '2026-06-30 16:00:00', 'scheduled', 'groups', 'D')
ON CONFLICT DO NOTHING;

-- GRUPO E (6 partidas)
INSERT INTO matches (team_home, team_away, date_time, status, phase, group_letter) VALUES
('Brasil', 'Sérvia', '2026-06-23 17:00:00', 'scheduled', 'groups', 'E'),
('Suíça', 'Camarões', '2026-06-23 14:00:00', 'scheduled', 'groups', 'E'),
('Brasil', 'Suíça', '2026-06-27 17:00:00', 'scheduled', 'groups', 'E'),
('Sérvia', 'Camarões', '2026-06-27 20:00:00', 'scheduled', 'groups', 'E'),
('Camarões', 'Brasil', '2026-07-01 20:00:00', 'scheduled', 'groups', 'E'),
('Suíça', 'Sérvia', '2026-07-01 20:00:00', 'scheduled', 'groups', 'E')
ON CONFLICT DO NOTHING;

-- GRUPO F (6 partidas)
INSERT INTO matches (team_home, team_away, date_time, status, phase, group_letter) VALUES
('Bélgica', 'Canadá', '2026-06-23 11:00:00', 'scheduled', 'groups', 'F'),
('Marrocos', 'Croácia', '2026-06-23 20:00:00', 'scheduled', 'groups', 'F'),
('Bélgica', 'Marrocos', '2026-06-27 14:00:00', 'scheduled', 'groups', 'F'),
('Canadá', 'Croácia', '2026-06-27 23:00:00', 'scheduled', 'groups', 'F'),
('Croácia', 'Bélgica', '2026-07-01 16:00:00', 'scheduled', 'groups', 'F'),
('Canadá', 'Marrocos', '2026-07-01 16:00:00', 'scheduled', 'groups', 'F')
ON CONFLICT DO NOTHING;

-- GRUPO G (6 partidas)
INSERT INTO matches (team_home, team_away, date_time, status, phase, group_letter) VALUES
('Portugal', 'Gana', '2026-06-24 14:00:00', 'scheduled', 'groups', 'G'),
('Uruguai', 'Coreia do Sul', '2026-06-24 17:00:00', 'scheduled', 'groups', 'G'),
('Portugal', 'Uruguai', '2026-06-28 17:00:00', 'scheduled', 'groups', 'G'),
('Gana', 'Coreia do Sul', '2026-06-28 20:00:00', 'scheduled', 'groups', 'G'),
('Coreia do Sul', 'Portugal', '2026-07-02 20:00:00', 'scheduled', 'groups', 'G'),
('Gana', 'Uruguai', '2026-07-02 20:00:00', 'scheduled', 'groups', 'G')
ON CONFLICT DO NOTHING;

-- GRUPO H (6 partidas)
INSERT INTO matches (team_home, team_away, date_time, status, phase, group_letter) VALUES
('Suécia', 'Noruega', '2026-06-24 11:00:00', 'scheduled', 'groups', 'H'),
('Itália', 'Bolívia', '2026-06-24 20:00:00', 'scheduled', 'groups', 'H'),
('Suécia', 'Itália', '2026-06-28 14:00:00', 'scheduled', 'groups', 'H'),
('Noruega', 'Bolívia', '2026-06-28 23:00:00', 'scheduled', 'groups', 'H'),
('Bolívia', 'Suécia', '2026-07-02 16:00:00', 'scheduled', 'groups', 'H'),
('Itália', 'Noruega', '2026-07-02 16:00:00', 'scheduled', 'groups', 'H')
ON CONFLICT DO NOTHING;

-- ============================================
-- 9️⃣ CRIAR FUNÇÃO PARA GERAR USUÁRIO DE TESTE
-- ============================================

-- Função auxiliar para inserir perfil quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email)
  );

  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ✅ FIM DO SCRIPT
-- ============================================
-- Tudo pronto! A aplicação está configurada.
-- 
-- Próximos passos:
-- 1. Configure .env.local com as credenciais
-- 2. Implemente as páginas de login/cadastro
-- 3. Teste o fluxo de autenticação
