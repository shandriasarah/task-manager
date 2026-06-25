# TaskManager

Aplicação web full-stack para gerenciamento de tarefas pessoais. Oferece autenticação, sincronização de dados entre dispositivos e interface responsiva com suporte a tema claro e escuro.

**Demonstração:** https://task-manager-ssg3.vercel.app

![Preview](./preview.png)

---

## Funcionalidades

**Autenticação**
- Cadastro e login com email e senha
- Sessão persistente entre acessos
- Isolamento de dados por usuária através de Row Level Security no PostgreSQL

**Gestão de tarefas**
- Criação, edição, exclusão e marcação de tarefas
- Datas de início e prazo final com seletor de calendário em português
- Níveis de prioridade (alta, média, baixa)
- Categorias coloridas: cinco padrão (Casa, Trabalho, Pessoal, Consulta, Estudos) e criação ilimitada de categorias personalizadas
- Indicadores automáticos de prazo: "Hoje", "Amanhã", "Atrasada 3 dias"

**Organização**
- Busca em tempo real por título e descrição
- Filtros por status (todas, pendentes, concluídas) e por categoria
- Ordenação automática por prioridade e prazo

**Interface**
- Tema claro e escuro com preferência persistida
- Paleta azul pastel desenhada para reduzir fadiga visual
- Layout responsivo mobile-first
- Microinterações em hover e mudança de estado
- Acessibilidade com labels ARIA e navegação por teclado

**Portabilidade de dados**
- Exportação de tarefas e categorias para JSON
- Importação a partir de arquivo de backup

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18, Vite |
| Estilização | Tailwind CSS |
| Roteamento | React Router 7 |
| Backend | Supabase (PostgreSQL, Auth) |
| Ícones | lucide-react |
| Date picker | react-day-picker, date-fns |
| Hospedagem | Vercel (CI/CD via GitHub) |

---

## Arquitetura

```
src/
├── componentes/      Componentes de interface reutilizáveis
│   ├── AddTask.jsx
│   ├── Tasks.jsx
│   ├── TaskForm.jsx
│   ├── EditTaskModal.jsx
│   ├── CategoryManagerModal.jsx
│   ├── DatePicker.jsx
│   ├── Toolbar.jsx
│   ├── SearchBar.jsx
│   ├── ThemeToggle.jsx
│   └── AuthGate.jsx
├── pages/            Componentes de rota
│   ├── AuthPage.jsx
│   └── TaskPages.jsx
├── hooks/            Hooks customizados (estado e efeitos)
│   ├── useAuth.js
│   ├── useTasks.js
│   ├── useCategories.js
│   └── useTheme.js
├── lib/              Configuração de bibliotecas externas
│   ├── supabase.js
│   └── mappers.js
└── utils/            Funções utilitárias puras
    ├── dueDate.js
    └── backup.js
```

### Decisões técnicas

- **Hooks customizados** encapsulam estado e efeitos colaterais, mantendo os componentes focados em apresentação.
- **Row Level Security** na camada de banco garante isolamento de dados entre usuárias sem depender de validação no cliente.
- **Atualizações otimistas de UI** em operações de toggle e exclusão para resposta instantânea, com rollback em caso de falha.
- **Migração inline de schema** dentro dos hooks de dados preserva compatibilidade com payloads antigos do localStorage.
- **Classes utilitárias do Tailwind** combinadas com componentes compartilhados em `@layer components` para evitar duplicação.

---

## Como executar

### Pré-requisitos

- Node.js 18 ou superior
- Projeto gratuito no [Supabase](https://supabase.com)

### Instalação

```bash
git clone https://github.com/shandriasarah/task-manager.git
cd task-manager
npm install
cp .env.example .env
```

Edite o arquivo `.env` com as credenciais do seu projeto Supabase.

### Configuração do Supabase

1. Crie um novo projeto no painel do Supabase.
2. Acesse o SQL Editor e execute o schema disponível na seção abaixo.
3. Em **Settings → API**, copie a `Project URL` e a `publishable key`.
4. Adicione ao arquivo `.env`:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

### Execução

```bash
npm run dev
```

A aplicação fica disponível em http://localhost:5173.

---

## Schema do banco

```sql
create table categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text not null default 'accent',
  is_default boolean not null default false,
  created_at timestamptz default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  start_date date,
  end_date date,
  priority text default 'medium',
  category_id uuid references categories(id) on delete set null,
  is_completed boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table tasks enable row level security;
alter table categories enable row level security;

create policy "Users can manage their own tasks"
  on tasks for all using (auth.uid() = user_id);

create policy "Users can manage their own categories"
  on categories for all using (auth.uid() = user_id);
```

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o bundle de produção |
| `npm run preview` | Visualiza o build de produção localmente |
| `npm run lint` | Executa o ESLint sobre os arquivos do projeto |

---

## Licença

MIT

---

Desenvolvido por **Sarah Shandria**
[LinkedIn](https://linkedin.com/in/shandriasarah) · [GitHub](https://github.com/shandriasarah)
