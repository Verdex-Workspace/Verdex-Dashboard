-- ============================================================
-- Seed initial des outils (idempotent). Reprend les données de démonstration.
-- Modifiez/complétez librement ensuite : la base fait foi.
-- ============================================================

insert into public.tools (id, name, env, status, version, stack, icon, open_prs, open_issues, client_id)
values
  ('novaweb', 'novaweb-api', 'prod', 'ok', '1.4.0', 'Node · Fastify', '▤', 4, 7, 'novaweb'),
  ('atelier', 'atelier-front', 'prod', 'ok', '2.1.3', 'Next.js', '◳', 2, 3, 'atelier'),
  ('billing', 'billing-service', 'staging', 'warn', '0.9.2', 'NestJS', '◰', 5, 9, 'me'),
  ('dashboard', 'verdex-dashboard', 'dev', 'ok', '0.1.0', 'Vue · Vite', '◎', 1, 2, 'me'),
  ('scraper', 'data-scraper', 'prod', 'err', '1.0.7', 'Python', '≣', 0, 5, 'grandouest'),
  ('auth', 'auth-gateway', 'prod', 'ok', '3.2.0', 'Go', '⛨', 3, 1, 'me')
on conflict (id) do nothing;

insert into public.tool_details
  (tool_id, port, description, metrics, dependencies, links, commits, pull_requests, issues, deployments)
values
  ('novaweb', 4012,
   $d$API principale de NovaWeb : exposition REST, agrégation des données et orchestration des intégrations tierces.$d$,
   $j$[{"key":"Uptime 30j","value":"99.6%","kind":"ok"},{"key":"P95 latence","value":"180ms","kind":"ok"},{"key":"Erreurs 24h","value":"0.2%","kind":"ok"}]$j$::jsonb,
   $j$[{"name":"fastify ^4","upToDate":true},{"name":"pg ^8","upToDate":true},{"name":"zod ^3","upToDate":true},{"name":"pino ^9","upToDate":true}]$j$::jsonb,
   $j$[{"label":"↗ Repo GitHub","url":"#"},{"label":"↗ Vercel","url":"#"},{"label":"↗ Supabase","url":"#"},{"label":"↗ Grafana dashboard","url":"#"}]$j$::jsonb,
   $j$[{"hash":"a1f9c2","message":"feat: cache redis sur /reports","age":"2 h"},{"hash":"7d3e10","message":"fix: timeout pg pool","age":"5 h"},{"hash":"4b8a91","message":"chore: bump deps","age":"1 j"},{"hash":"9c2f55","message":"refactor: split routes","age":"2 j"}]$j$::jsonb,
   $j$[{"id":"214","title":"Cache des rapports","status":"ok","detail":"mergeable · 2 review"},{"id":"212","title":"Migration pg 16","status":"warn","detail":"conflits"},{"id":"209","title":"Rate-limit API","status":"ok","detail":"en review"}]$j$::jsonb,
   $j$[{"id":"i1","kind":"err","title":"Fuite mémoire worker","meta":"bug · P1"},{"id":"i2","kind":"warn","title":"Export CSV lent","meta":"perf · P2"},{"id":"i3","kind":"info","title":"Ajouter webhook Stripe","meta":"feat"}]$j$::jsonb,
   $j$[{"env":"prod","version":"1.4.0","when":"Vercel · il y a 2 h","status":"ok"},{"env":"staging","version":"1.4.1-rc","when":"il y a 20 min","status":"warn"},{"env":"prod","version":"1.3.9","when":"hier","status":"ok"}]$j$::jsonb),

  ('atelier', 3000,
   $d$Front-office d'Atelier Mauve : vitrine et espace client, rendu Next.js sur Vercel.$d$,
   $j$[{"key":"LCP","value":"1.2s","kind":"warn"},{"key":"INP","value":"180ms","kind":"ok"},{"key":"Erreurs 24h","value":"0.0%","kind":"ok"}]$j$::jsonb,
   $j$[{"name":"next ^15","upToDate":true},{"name":"react ^19","upToDate":true},{"name":"tailwindcss ^4","upToDate":true}]$j$::jsonb,
   $j$[{"label":"↗ Repo GitHub","url":"#"},{"label":"↗ Vercel","url":"#"}]$j$::jsonb,
   $j$[{"hash":"c3a7e1","message":"feat: page tarifs","age":"3 h"},{"hash":"b91d04","message":"fix: CLS hero mobile","age":"1 j"}]$j$::jsonb,
   $j$[{"id":"88","title":"Refonte header","status":"ok","detail":"en review"},{"id":"85","title":"i18n FR/EN","status":"ok","detail":"mergeable"}]$j$::jsonb,
   $j$[{"id":"i1","kind":"warn","title":"Optimiser images hero","meta":"perf · P2"},{"id":"i2","kind":"info","title":"Mode sombre","meta":"feat"}]$j$::jsonb,
   $j$[{"env":"prod","version":"2.1.3","when":"Vercel · hier","status":"ok"},{"env":"staging","version":"2.2.0-rc","when":"il y a 1 h","status":"ok"}]$j$::jsonb),

  ('billing', 4020,
   $d$Service de facturation (NestJS) : abonnements, relances et webhooks Stripe. En cours de stabilisation.$d$,
   $j$[{"key":"Uptime 30j","value":"98.1%","kind":"warn"},{"key":"P95 latence","value":"640ms","kind":"warn"},{"key":"Erreurs 24h","value":"1.1%","kind":"warn"}]$j$::jsonb,
   $j$[{"name":"@nestjs/core ^11","upToDate":true},{"name":"stripe ^17","upToDate":false},{"name":"typeorm ^0.3","upToDate":true}]$j$::jsonb,
   $j$[{"label":"↗ Repo GitHub","url":"#"},{"label":"↗ Stripe dashboard","url":"#"}]$j$::jsonb,
   $j$[{"hash":"e22b71","message":"fix: retry webhooks Stripe","age":"1 h"},{"hash":"a07f3c","message":"feat: relances J+7","age":"6 h"}]$j$::jsonb,
   $j$[{"id":"52","title":"Migration TypeORM 0.3","status":"warn","detail":"conflits"},{"id":"50","title":"Idempotence webhooks","status":"ok","detail":"en review"}]$j$::jsonb,
   $j$[{"id":"i1","kind":"err","title":"Double facturation rare","meta":"bug · P1"},{"id":"i2","kind":"warn","title":"Lenteur export comptable","meta":"perf · P2"}]$j$::jsonb,
   $j$[{"env":"staging","version":"0.9.2","when":"il y a 30 min","status":"warn"},{"env":"staging","version":"0.9.1","when":"hier","status":"ok"}]$j$::jsonb),

  ('dashboard', 5173,
   $d$Le Verdex Dashboard lui-même : cockpit admin/DevOps/cybersécurité (Vue 3 + Vite + TypeScript).$d$,
   $j$[{"key":"Couverture","value":"91%","kind":"ok"},{"key":"Bundle","value":"40 Ko","kind":"ok"},{"key":"Build","value":"0.2s","kind":"ok"}]$j$::jsonb,
   $j$[{"name":"vue ^3.5","upToDate":true},{"name":"vue-router ^5","upToDate":true},{"name":"pinia ^3","upToDate":true},{"name":"tailwindcss ^4","upToDate":true}]$j$::jsonb,
   $j$[{"label":"↗ Repo GitHub","url":"https://github.com/Verdex-Workspace/Verdex-Dashboard"},{"label":"↗ Documentation","url":"#"}]$j$::jsonb,
   $j$[{"hash":"219da4","message":"feat: menu utilisateur","age":"1 h"},{"hash":"c91ed3","message":"feat: auth Supabase","age":"2 h"}]$j$::jsonb,
   $j$[{"id":"16","title":"Brancher Projets & Outils","status":"ok","detail":"en cours"}]$j$::jsonb,
   $j$[{"id":"i1","kind":"info","title":"Connecteur Loki","meta":"feat · P3"}]$j$::jsonb,
   $j$[{"env":"prod","version":"0.1.0","when":"Vercel","status":"ok"}]$j$::jsonb),

  ('scraper', 8000,
   $d$Collecteur de données (Python) : extractions planifiées et normalisation. Incident en cours.$d$,
   $j$[{"key":"Uptime 30j","value":"94.2%","kind":"err"},{"key":"Jobs KO 24h","value":"6","kind":"err"},{"key":"Débit","value":"1.2k/s","kind":"warn"}]$j$::jsonb,
   $j$[{"name":"httpx ^0.27","upToDate":true},{"name":"beautifulsoup4 ^4","upToDate":true},{"name":"celery ^5","upToDate":false}]$j$::jsonb,
   $j$[{"label":"↗ Repo GitHub","url":"#"}]$j$::jsonb,
   $j$[{"hash":"f01a2b","message":"fix: gestion 429 upstream","age":"4 h"},{"hash":"d9c813","message":"chore: rotate proxies","age":"2 j"}]$j$::jsonb,
   $j$[]$j$::jsonb,
   $j$[{"id":"i1","kind":"err","title":"Worker bloqué sur source X","meta":"bug · P1"},{"id":"i2","kind":"warn","title":"Backoff insuffisant","meta":"bug · P2"}]$j$::jsonb,
   $j$[{"env":"prod","version":"1.0.7","when":"il y a 3 j","status":"err"}]$j$::jsonb),

  ('auth', 4443,
   $d$Passerelle d'authentification (Go) : SSO, émission de tokens et rate-limiting.$d$,
   $j$[{"key":"Uptime 30j","value":"99.9%","kind":"ok"},{"key":"P95 latence","value":"24ms","kind":"ok"},{"key":"Erreurs 24h","value":"0.0%","kind":"ok"}]$j$::jsonb,
   $j$[{"name":"go 1.23","upToDate":true},{"name":"chi ^5","upToDate":true},{"name":"jwx ^2","upToDate":true}]$j$::jsonb,
   $j$[{"label":"↗ Repo GitHub","url":"#"},{"label":"↗ Grafana dashboard","url":"#"}]$j$::jsonb,
   $j$[{"hash":"5ab9d0","message":"feat: SSO Proton","age":"1 j"},{"hash":"3c71f8","message":"perf: cache JWKS","age":"3 j"}]$j$::jsonb,
   $j$[{"id":"120","title":"Rotation des clés","status":"ok","detail":"mergeable"},{"id":"118","title":"Audit log","status":"ok","detail":"en review"}]$j$::jsonb,
   $j$[{"id":"i1","kind":"info","title":"Support WebAuthn","meta":"feat · P3"}]$j$::jsonb,
   $j$[{"env":"prod","version":"3.2.0","when":"il y a 1 j","status":"ok"},{"env":"prod","version":"3.1.4","when":"la semaine dernière","status":"ok"}]$j$::jsonb)
on conflict (tool_id) do nothing;
