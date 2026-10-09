# FAILSAFE

FAILSAFE is an editorial publication covering AI safety, autonomy, and emerging risks. The frontend is built with React and Vite, with Supabase providing authentication and article storage.

## Features

- A feed with the newest article featured above a responsive grid of recent reports.
- Article detail pages with metadata, publication date, optional image, excerpt, and body.
- Account registration and sign-in with Supabase Auth.
- Article creation for authenticated users.
- Article deletion for the article owner. Supabase Row Level Security (RLS) must enforce ownership in the database.
- Responsive layouts with shared site navigation and footer.

## Technology

- React 19
- Vite 8
- React Router 8
- Supabase JavaScript client
- ESLint

## Getting started

You need Node.js and npm.

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a Supabase project and add the following variables to a local `.env` file in the project root:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

   The required variable names are also listed in `.env.example`. Do not put secret keys in frontend code or commit them to version control. Only use the Supabase publishable/anon key in the client.

3. Start the development server:

   ```sh
   npm run dev
   ```

   Vite prints the local URL in the terminal, usually `http://localhost:5173`.

## Supabase setup

Create a table named `articles` in Supabase. The application expects these columns:

| Column | Purpose |
| --- | --- |
| `id` | Article identifier used for lookups and route URLs |
| `title` | Article headline |
| `excerpt` | Optional summary shown in the feed and article page |
| `content` | Article body |
| `image_url` | Optional URL for the article image |
| `category` | Editorial category |
| `article_type` | Article type |
| `author_id` | ID of the Supabase Auth user who created the article |
| `created_at` | Article creation/publication timestamp |

The database should provide default values for `id` and `created_at`, since the client does not send them when creating an article. The client sets `author_id` to the current authenticated user's ID.

Enable RLS on `articles` and configure policies for the intended access:

- Allow visitors to read articles if the feed is intended to be public.
- Allow authenticated users to insert articles only with their own user ID as `author_id`.
- Allow an article to be deleted only by its owner.

RLS is the security boundary for database operations. Hiding the delete button from non-owners in the UI is not access control. Also check that Supabase Auth settings, such as email confirmation and allowed redirect URLs, match the environment where the app runs.

Article types and categories offered by the form are defined in `src/pages/CreateArticle.jsx`. If the database uses enum types or constraints, ensure their allowed values match the form options.

### Profiles and signup trigger

User profile data is stored separately from Supabase Auth in a `profiles` table. Each profile should be linked one-to-one to its Auth user, typically by using the Auth user ID as the profile row's primary key and as a foreign key to `auth.users.id`.

During registration, the app sends the submitted display name as Auth user metadata (`display_name`). A database trigger on new rows in `auth.users` creates the corresponding profile row and copies the display name from that metadata. Keeping this logic in the database ensures profiles are created for signups independently of the client page completing its request.

The trigger and table definition are managed in Supabase and are not included as SQL migrations in this repository. Keep the database schema and trigger function documented or version-controlled alongside the project when possible. Enable RLS on `profiles` and scope profile access to the matching authenticated user if the application exposes profile reads or updates.

## Routes

| Route | Description | Access |
| --- | --- | --- |
| `/` | Article feed | Public |
| `/article/:id` | Article detail page | Public, unless restricted by RLS |
| `/login` | Sign in | Public |
| `/register` | Create an account | Public |
| `/create` | Create an article | Requires authentication |

## Project structure

```text
src/
  components/   Shared header, footer, and protected route
  context/      Auth provider, context, and useAuth hook
  lib/          Supabase client
  pages/        Feed, article, sign-in, registration, and article creation
  App.jsx       Routes and shared app shell
  index.css     Global and page-specific styles
public/         FAILSAFE logo and site icon
```

## NPM scripts

```sh
npm run dev       # Start the Vite development server
npm run lint      # Run ESLint
npm run build     # Create a production build in dist/
npm run preview   # Preview the production build locally
```

## Build and deployment

Run `npm run build` to create the production files in `dist/`.

The project includes a `vercel.json` rewrite from all paths to `/index.html`. This allows React Router to handle direct visits and page refreshes on client-side routes when deployed to Vercel. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to the Vercel project's environment variables as well.



## AI Usage Log

AI tools were used during development to support learning,
explain technical concepts, and assist with troubleshooting.

### 1. Supabase Authentication
- **Tool:** ChatGPT
- **Date:** 28 September 2026
- **Purpose:** Understanding Supabase authentication, user profiles,
  and how database triggers connect registered users to profile records.
- **Outcome:** Improved understanding of authentication workflows
  and the relationship between Supabase Auth and PostgreSQL.

### 2. SQL and Row Level Security
- **Tool:** ChatGPT
- **Date:** 28 September 2026
- **Purpose:** Understanding SQL queries, database relationships,
  RLS policies, and the use of auth.uid() for access control.
- **Outcome:** Gained a better understanding of how database
  permissions protect user data.

### 3. Database Permissions
- **Tool:** ChatGPT
- **Date:** 5 October 2026
- **Purpose:** Understanding the difference between PostgreSQL
  GRANT permissions and Row Level Security after encountering
  a "permission denied" error.
- **Outcome:** Learned how database privileges and RLS work
  together when accessing Supabase through the API.

### 4. Deployment and Routing
- **Tool:** ChatGPT
- **Date:** 8 October 2026
- **Purpose:** Understanding deployment configuration, environment
  variables, React Router, and Supabase authentication redirects.
- **Outcome:** Improved understanding of deploying a React
  application and configuring backend services for production.