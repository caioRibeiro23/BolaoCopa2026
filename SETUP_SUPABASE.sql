-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.bets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  match_id uuid NOT NULL,
  prediction_home integer NOT NULL CHECK (prediction_home >= 0 AND prediction_home <= 20),
  prediction_away integer NOT NULL CHECK (prediction_away >= 0 AND prediction_away <= 20),
  points_earned integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT bets_pkey PRIMARY KEY (id),
  CONSTRAINT bets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id),
  CONSTRAINT bets_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id)
);
CREATE TABLE public.championship_members (
  championship_id uuid NOT NULL,
  user_id uuid NOT NULL,
  joined_at timestamp without time zone DEFAULT now(),
  CONSTRAINT championship_members_pkey PRIMARY KEY (championship_id, user_id),
  CONSTRAINT fk_championship FOREIGN KEY (championship_id) REFERENCES public.championships(id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.championships (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT championships_pkey PRIMARY KEY (id)
);
CREATE TABLE public.matches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_home text NOT NULL,
  team_away text NOT NULL,
  date_time timestamp without time zone NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['scheduled'::text, 'live'::text, 'finished'::text])),
  goals_home integer,
  goals_away integer,
  phase text NOT NULL,
  group_letter text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  minute_play integer DEFAULT 0,
  status_exibicao text,
  CONSTRAINT matches_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL,
  username text NOT NULL UNIQUE,
  full_name text NOT NULL,
  avatar_url text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_stats (
  user_id uuid NOT NULL,
  total_bets integer DEFAULT 0,
  total_points integer DEFAULT 0,
  updated_at timestamp without time zone DEFAULT now(),
  exact_scores integer DEFAULT 0,
  correct_results integer DEFAULT 0,
  CONSTRAINT user_stats_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);