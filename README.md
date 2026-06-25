# 📝 TaskManager

Aplicação web full-stack para gerenciamento de tarefas pessoais, com autenticação, banco de dados e sincronização em tempo real entre dispositivos.

🔗 **Demo:** https://task-manager-ssg3.vercel.app

![Preview](./preview.png)

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Cadastro e login com email/senha
- Sessão persistente entre acessos
- Cada usuária vê apenas seus próprios dados (Row Level Security)

### ✅ Gestão de tarefas
- Criar, editar e excluir tarefas
- Título e descrição (opcional)
- Marcar como concluída com checkbox animado
- **Datas de início e prazo final** com seletor de calendário em pt-BR
- **Níveis de prioridade**: Alta, Média, Baixa
- **Categorias coloridas**: 5 padrão (Casa, Trabalho, Pessoal, Consulta, Estudos) + criação ilimitada de categorias customizadas
- Lembretes visuais automáticos: "Hoje", "Amanhã", "Atrasada 3 dias"

### 🔍 Organização
- Busca em tempo real por título ou descrição
- Filtros por status (Todas, Pendentes, Concluídas)
- Filtros por categoria
- Ordenação automática por prioridade + prazo

### 🎨 Interface
- **Dark / Light mode** com persistência da preferência
- Design moderno com paleta azul pastel
- Totalmente responsivo (mobile-first)
- Micro-animações suaves
- Acessibilidade (ARIA labels, navegação por teclado)

### 💾 Backup
- Exportar todas as tarefas em JSON
- Importar backup pra restaurar o histórico

---

## 🛠 Stack

| Camada | Tecnologia |
|---|---|
| **Frontend** | React 18 + Vite |
| **Estilização** | Tailwind CSS |
| **Roteamento** | React Router 7 |
| **Backend / DB** | Supabase (PostgreSQL + Auth) |
| **UI / Icons** | lucide-react |
| **Date Picker** | react-day-picker + date-fns |
| **Deploy** | Vercel (CI/CD automático) |

---

## 🏗 Arquitetura

```
src/
├── componentes/      # componentes reutilizáveis (UI puro)
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
├── pages/            # páginas/rotas
│   ├── AuthPage.jsx
│   └── TaskPages.jsx
├── hooks/            # lógica de estado isolada
│   ├── useAuth.js
│   ├── useTasks.js
│   ├── useCategories.js
│   └── useTheme.js
├── lib/              # configuração de bibliotecas externas
│   ├── supabase.js
│   └── mappers.js
└── utils/            # helpers puros
    ├── dueDate.js
    └── backup.js
```

### Decisões técnicas
- **Custom hooks** isolam toda lógica de estado e API, deixando componentes focados em UI
- **Row Level Security no Supabase** garante isolamento de dados sem código extra no client
- **Optimistic UI** em toggle e delete pra responsividade instantânea
- **CSS via Tailwind utility classes + @layer components** pra evitar duplicação
- **Migração automática de schema** no hook (compatibilidade com dados antigos)

---

## 💻 Rodando localmente

### Pré-requisitos
- Node.js 18+
- Conta gratuita no [Supabase](https://supabase.com)

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/shandriasarah/task-manager.git
cd task-manager

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase
```

### Configurando o Supabase

1. Crie um projeto em https://supabase.com
2. Vá em **SQL Editor** e rode o script de `database/schema.sql` (ou veja seção abaixo)
3. Em **Settings → API**, copie a `Project URL` e a `publishable key`
4. Cole no seu arquivo `.env`:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

### Rodando

```bash
npm run dev
```

Acesse http://localhost:5173.

---

## 🗄️ Schema do banco

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

-- Policies (uma usuária só acessa seus próprios dados)
create policy "Users can manage their own tasks"
  on tasks for all using (auth.uid() = user_id);

create policy "Users can manage their own categories"
  on categories for all using (auth.uid() = user_id);
```

---

## 📚 O que aprendi com este projeto

- Estruturar uma aplicação React em camadas (UI, hooks, libs, utils)
- Implementar autenticação completa com Supabase Auth
- Modelar banco PostgreSQL com Row Level Security para multi-tenant
- Custom hooks para encapsular lógica de estado e side effects
- Dark mode com Tailwind via `darkMode: "class"` e CSS variables
- Deploy contínuo com variáveis de ambiente na Vercel
- Migração de localStorage para banco mantendo compatibilidade
- Tratamento de erros + estados de loading em operações assíncronas

---

## 📝 Licença

MIT

---

Desenvolvido por **Sarah Shandria**
[LinkedIn](https://linkedin.com/in/shandriasarah) • [GitHub](https://github.com/shandriasarah)
