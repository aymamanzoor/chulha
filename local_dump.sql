--
-- PostgreSQL database dump
--

\restrict Wy0PEeE4www1tJ8hg7o8GUGHLYVyQlI7GyxBRuSeBxj7RSPzOpnYBLLYh5WtZ9E

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.saved_items DROP CONSTRAINT IF EXISTS "saved_items_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.reports DROP CONSTRAINT IF EXISTS "reports_reporterId_fkey";
ALTER TABLE IF EXISTS ONLY public.recipes DROP CONSTRAINT IF EXISTS "recipes_cuisineId_fkey";
ALTER TABLE IF EXISTS ONLY public.recipes DROP CONSTRAINT IF EXISTS "recipes_creatorId_fkey";
ALTER TABLE IF EXISTS ONLY public.posts DROP CONSTRAINT IF EXISTS "posts_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS "notifications_senderId_fkey";
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS "notifications_recipientId_fkey";
ALTER TABLE IF EXISTS ONLY public.likes DROP CONSTRAINT IF EXISTS "likes_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.follows DROP CONSTRAINT IF EXISTS "follows_followingId_fkey";
ALTER TABLE IF EXISTS ONLY public.follows DROP CONSTRAINT IF EXISTS "follows_followerId_fkey";
ALTER TABLE IF EXISTS ONLY public.comments DROP CONSTRAINT IF EXISTS "comments_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.comments DROP CONSTRAINT IF EXISTS "comments_recipeId_fkey";
ALTER TABLE IF EXISTS ONLY public.comments DROP CONSTRAINT IF EXISTS "comments_postId_fkey";
ALTER TABLE IF EXISTS ONLY public.comments DROP CONSTRAINT IF EXISTS "comments_parentId_fkey";
DROP INDEX IF EXISTS public.saved_items_user_id_target_type_target_id;
DROP INDEX IF EXISTS public.likes_user_id_target_type_target_id;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.settings DROP CONSTRAINT IF EXISTS settings_pkey;
ALTER TABLE IF EXISTS ONLY public.saved_items DROP CONSTRAINT IF EXISTS saved_items_pkey;
ALTER TABLE IF EXISTS ONLY public.reports DROP CONSTRAINT IF EXISTS reports_pkey;
ALTER TABLE IF EXISTS ONLY public.recipes DROP CONSTRAINT IF EXISTS recipes_slug_key;
ALTER TABLE IF EXISTS ONLY public.recipes DROP CONSTRAINT IF EXISTS recipes_pkey;
ALTER TABLE IF EXISTS ONLY public.posts DROP CONSTRAINT IF EXISTS posts_pkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_pkey;
ALTER TABLE IF EXISTS ONLY public.likes DROP CONSTRAINT IF EXISTS likes_pkey;
ALTER TABLE IF EXISTS ONLY public.follows DROP CONSTRAINT IF EXISTS follows_pkey;
ALTER TABLE IF EXISTS ONLY public.cuisines DROP CONSTRAINT IF EXISTS cuisines_slug_key;
ALTER TABLE IF EXISTS ONLY public.cuisines DROP CONSTRAINT IF EXISTS cuisines_pkey;
ALTER TABLE IF EXISTS ONLY public.cuisines DROP CONSTRAINT IF EXISTS cuisines_name_key;
ALTER TABLE IF EXISTS ONLY public.comments DROP CONSTRAINT IF EXISTS comments_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.settings;
DROP TABLE IF EXISTS public.saved_items;
DROP TABLE IF EXISTS public.reports;
DROP TABLE IF EXISTS public.recipes;
DROP TABLE IF EXISTS public.posts;
DROP TABLE IF EXISTS public.notifications;
DROP TABLE IF EXISTS public.likes;
DROP TABLE IF EXISTS public.follows;
DROP TABLE IF EXISTS public.cuisines;
DROP TABLE IF EXISTS public.comments;
DROP TYPE IF EXISTS public.enum_users_status;
DROP TYPE IF EXISTS public.enum_users_role;
DROP TYPE IF EXISTS public."enum_saved_items_targetType";
DROP TYPE IF EXISTS public.enum_reports_type;
DROP TYPE IF EXISTS public.enum_reports_status;
DROP TYPE IF EXISTS public.enum_recipes_status;
DROP TYPE IF EXISTS public.enum_recipes_difficulty;
DROP TYPE IF EXISTS public.enum_posts_kind;
DROP TYPE IF EXISTS public.enum_notifications_type;
DROP TYPE IF EXISTS public."enum_likes_targetType";
--
-- Name: enum_likes_targetType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_likes_targetType" AS ENUM (
    'post',
    'recipe',
    'comment'
);


--
-- Name: enum_notifications_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_notifications_type AS ENUM (
    'like',
    'follow',
    'comment',
    'save'
);


--
-- Name: enum_posts_kind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_posts_kind AS ENUM (
    'Food Post',
    'Recipe',
    'Cooking Tip'
);


--
-- Name: enum_recipes_difficulty; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_recipes_difficulty AS ENUM (
    'Easy',
    'Medium',
    'Hard'
);


--
-- Name: enum_recipes_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_recipes_status AS ENUM (
    'Approved',
    'Pending',
    'Rejected'
);


--
-- Name: enum_reports_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_reports_status AS ENUM (
    'Open',
    'Reviewing',
    'Resolved',
    'Dismissed'
);


--
-- Name: enum_reports_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_reports_type AS ENUM (
    'Post',
    'Comment',
    'User'
);


--
-- Name: enum_saved_items_targetType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_saved_items_targetType" AS ENUM (
    'post',
    'recipe'
);


--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_role AS ENUM (
    'Admin',
    'Moderator',
    'Member'
);


--
-- Name: enum_users_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_status AS ENUM (
    'Active',
    'Suspended',
    'Pending'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "postId" uuid,
    "recipeId" uuid,
    "parentId" uuid,
    text text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: cuisines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cuisines (
    id uuid NOT NULL,
    name character varying(50) NOT NULL,
    slug character varying(50) NOT NULL,
    flag character varying(10) DEFAULT '🥘'::character varying NOT NULL,
    image character varying(500),
    description text DEFAULT ''::text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: follows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.follows (
    "followerId" uuid NOT NULL,
    "followingId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.likes (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "targetType" public."enum_likes_targetType" NOT NULL,
    "targetId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    "recipientId" uuid NOT NULL,
    "senderId" uuid NOT NULL,
    action character varying(255) NOT NULL,
    type public.enum_notifications_type NOT NULL,
    "isRead" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    kind public.enum_posts_kind DEFAULT 'Food Post'::public.enum_posts_kind,
    text text NOT NULL,
    image character varying(500),
    "recipeSlug" character varying(150),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: recipes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipes (
    id uuid NOT NULL,
    slug character varying(150) NOT NULL,
    title character varying(200) NOT NULL,
    image character varying(500),
    "creatorId" uuid NOT NULL,
    "cuisineId" uuid,
    "cuisineName" character varying(50) DEFAULT 'General'::character varying NOT NULL,
    flag character varying(10) DEFAULT '🥘'::character varying,
    minutes integer DEFAULT 30 NOT NULL,
    difficulty public.enum_recipes_difficulty DEFAULT 'Easy'::public.enum_recipes_difficulty,
    category character varying(50) DEFAULT 'Dinner'::character varying,
    beginner boolean DEFAULT false,
    rating double precision DEFAULT '4.8'::double precision,
    description text DEFAULT ''::text,
    ingredients json DEFAULT '[]'::json,
    steps json DEFAULT '[]'::json,
    tip text DEFAULT ''::text,
    status public.enum_recipes_status DEFAULT 'Approved'::public.enum_recipes_status,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reports (
    id uuid NOT NULL,
    target character varying(255) NOT NULL,
    type public.enum_reports_type NOT NULL,
    reason character varying(100) NOT NULL,
    "reporterId" uuid NOT NULL,
    status public.enum_reports_status DEFAULT 'Open'::public.enum_reports_status,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: saved_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saved_items (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "targetType" public."enum_saved_items_targetType" NOT NULL,
    "targetId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    key character varying(100) NOT NULL,
    value json NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    bio text DEFAULT ''::text,
    emoji character varying(10) DEFAULT '👩‍🍳'::character varying,
    avatar character varying(500),
    role public.enum_users_role DEFAULT 'Member'::public.enum_users_role,
    status public.enum_users_status DEFAULT 'Active'::public.enum_users_status,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments (id, "userId", "postId", "recipeId", "parentId", text, "createdAt", "updatedAt") FROM stdin;
59216264-1a07-44bc-a837-c2a9f93c740f	9f37959a-8760-483f-a6a9-3b88231a8da7	\N	addd5ead-96db-4287-9042-58cf1fa02c2e	\N	This looks incredible! How long did you rest the dough?	2026-08-20 12:47:50.276+05	2026-08-20 12:47:50.276+05
6d3d1cfa-ad7c-4e69-bcbd-9d90d9832ce7	c564df88-693e-408b-aef3-229c710ed759	\N	addd5ead-96db-4287-9042-58cf1fa02c2e	59216264-1a07-44bc-a837-c2a9f93c740f	About an hour on the counter — it made a big difference 🙌	2026-08-20 12:47:50.284+05	2026-08-20 12:47:50.284+05
3fcd2e27-34b6-4390-9ba7-b1b9b43ce525	58aac3f0-78aa-4012-aebf-21bb1769fe7a	\N	addd5ead-96db-4287-9042-58cf1fa02c2e	\N	Made this last night and my family finished the whole tray 😂	2026-08-20 12:47:50.289+05	2026-08-20 12:47:50.289+05
1f9f9a0d-1df3-4bb8-99f7-32bea4b0337b	9890bb55-77b8-456d-aeb6-d94bb2a7d68f	88e01913-5f33-4900-8479-f6fccbba64f7	\N	\N	Saving this for the weekend. Thank you for the beginner tip!	2026-08-20 12:47:50.292+05	2026-08-20 12:47:50.292+05
c0f6a9c7-be23-47d3-88ea-5ccc1e1476c5	05d44694-0359-440a-a705-adfb8dfe8209	\N	915b9a49-1ef6-4372-b569-0a90f1c5c500	\N	I really like this recipe..	2026-08-22 18:31:23.397+05	2026-08-22 18:31:23.397+05
a03d2695-6dc7-45cd-9061-fbfcb4264f0c	c564df88-693e-408b-aef3-229c710ed759	1119bb76-3517-4e6e-bb01-ad170f383d89	\N	\N	Looks Yummy	2026-08-24 09:40:31.313+05	2026-08-24 09:40:31.313+05
\.


--
-- Data for Name: cuisines; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cuisines (id, name, slug, flag, image, description, "createdAt", "updatedAt") FROM stdin;
00f5b7a5-37af-4ef6-85d7-3538c1865382	Pakistani	pakistani	🇵🇰	/assets/pakistani_karahi.jpg		2026-08-20 12:47:50.234+05	2026-08-20 14:04:06.631+05
8c2b3738-7ff0-4a35-9a9a-244ba1582964	Indian	indian	🇮🇳	/assets/indian_mango_lassi.jpg		2026-08-20 12:47:50.234+05	2026-08-20 14:04:06.649+05
f75c7b16-6846-46f8-b245-0da3fd14b538	Italian	italian	🇮🇹	/assets/italian_pasta.jpg		2026-08-20 12:47:50.234+05	2026-08-20 14:04:06.651+05
05251d1e-b8d3-4676-ba86-fe9ccf6a163c	Chinese	chinese	🇨🇳	/assets/chinese_dumplings.jpg		2026-08-20 12:47:50.234+05	2026-08-20 14:04:06.653+05
09abc63d-61a9-4e79-baa9-4e05f9a64f6a	Japanese	japanese	🇯🇵	/assets/japanese_sushi.jpg		2026-08-20 12:47:50.234+05	2026-08-20 14:04:06.655+05
17bfd604-67d6-43fa-9e9e-b3bdb26489ae	Korean	korean	🇰🇷	/assets/korean_bibimbap.jpg		2026-08-20 12:47:50.234+05	2026-08-20 14:04:06.657+05
aa9d77e1-16d7-4282-a667-cf19ce25dccf	Mexican	mexican	🇲🇽	/assets/mexican_tacos.jpg		2026-08-20 12:47:50.234+05	2026-08-20 14:04:06.659+05
2e60f6ae-16d6-4e94-a9a2-b0f73c6cc6b3	Thai	thai	🇹🇭	/assets/thai_pad_thai.jpg		2026-08-20 12:47:50.234+05	2026-08-20 14:04:06.662+05
1bb21d7c-6c5c-4980-9072-4d3d0b7bc318	Turkish	turkish	🇹🇷	/assets/turkish_breakfast.jpg		2026-08-20 12:47:50.234+05	2026-08-20 14:04:06.664+05
e439632c-07ce-49be-aff5-e28260b00b96	Mediterranean	mediterranean	🫒	/assets/mediterranean_falafel.jpg		2026-08-20 12:47:50.234+05	2026-08-20 14:04:06.667+05
\.


--
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.follows ("followerId", "followingId", "createdAt", "updatedAt") FROM stdin;
c564df88-693e-408b-aef3-229c710ed759	9f37959a-8760-483f-a6a9-3b88231a8da7	2026-08-20 12:47:50.295+05	2026-08-20 12:47:50.295+05
9f37959a-8760-483f-a6a9-3b88231a8da7	c564df88-693e-408b-aef3-229c710ed759	2026-08-20 12:47:50.295+05	2026-08-20 12:47:50.295+05
9890bb55-77b8-456d-aeb6-d94bb2a7d68f	c564df88-693e-408b-aef3-229c710ed759	2026-08-20 12:47:50.295+05	2026-08-20 12:47:50.295+05
8da1991b-4942-4a5c-a9ef-301b74bf5bb8	c564df88-693e-408b-aef3-229c710ed759	2026-08-20 12:47:50.295+05	2026-08-20 12:47:50.295+05
58aac3f0-78aa-4012-aebf-21bb1769fe7a	c564df88-693e-408b-aef3-229c710ed759	2026-08-20 12:47:50.295+05	2026-08-20 12:47:50.295+05
c564df88-693e-408b-aef3-229c710ed759	05d44694-0359-440a-a705-adfb8dfe8209	2026-08-20 20:28:40.008+05	2026-08-20 20:28:40.008+05
05d44694-0359-440a-a705-adfb8dfe8209	c564df88-693e-408b-aef3-229c710ed759	2026-08-20 20:42:54.616+05	2026-08-20 20:42:54.616+05
05d44694-0359-440a-a705-adfb8dfe8209	9f37959a-8760-483f-a6a9-3b88231a8da7	2026-08-20 20:43:03.698+05	2026-08-20 20:43:03.698+05
05d44694-0359-440a-a705-adfb8dfe8209	9890bb55-77b8-456d-aeb6-d94bb2a7d68f	2026-08-20 20:43:05.307+05	2026-08-20 20:43:05.307+05
\.


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.likes (id, "userId", "targetType", "targetId", "createdAt", "updatedAt") FROM stdin;
89ff9f2b-d18b-43d4-8e66-b3389bb41373	c564df88-693e-408b-aef3-229c710ed759	recipe	1da4ed9d-bd37-4136-9dc9-8c0f45d92645	2026-08-20 12:47:50.302+05	2026-08-20 12:47:50.302+05
064281eb-8df3-4ecc-91b8-93ad0016ce1c	9f37959a-8760-483f-a6a9-3b88231a8da7	recipe	addd5ead-96db-4287-9042-58cf1fa02c2e	2026-08-20 12:47:50.302+05	2026-08-20 12:47:50.302+05
e9aa4651-07cc-47cb-b2bc-4473aa2faeaa	9890bb55-77b8-456d-aeb6-d94bb2a7d68f	post	88e01913-5f33-4900-8479-f6fccbba64f7	2026-08-20 12:47:50.302+05	2026-08-20 12:47:50.302+05
43f6fc47-2249-42fa-911e-893a2d3baffb	05d44694-0359-440a-a705-adfb8dfe8209	recipe	915b9a49-1ef6-4372-b569-0a90f1c5c500	2026-08-22 18:31:33.882+05	2026-08-22 18:31:33.882+05
9250cc0c-9110-4042-a0d4-22e22e21890d	05d44694-0359-440a-a705-adfb8dfe8209	recipe	45199de2-c275-477a-9e9c-9af60ade1b6c	2026-08-22 18:32:08.634+05	2026-08-22 18:32:08.634+05
45965322-8375-4499-8877-db0b40644bea	05d44694-0359-440a-a705-adfb8dfe8209	recipe	7efd6250-9d34-418d-ab7b-0168d275b0ae	2026-08-22 18:32:33.583+05	2026-08-22 18:32:33.583+05
3fb1796b-da99-4a6e-8c1e-4ddae8133ae7	05d44694-0359-440a-a705-adfb8dfe8209	recipe	158555a6-9537-44b4-980f-596a1e18d64f	2026-08-22 18:32:34.944+05	2026-08-22 18:32:34.944+05
7685a938-9c6f-4cdb-9f6a-a5a854244949	05d44694-0359-440a-a705-adfb8dfe8209	recipe	483bd8f7-4630-46da-a4bb-233a4602a498	2026-08-22 18:32:36.726+05	2026-08-22 18:32:36.726+05
4d724a7f-7dad-44d1-81ef-eb26d613aacd	05d44694-0359-440a-a705-adfb8dfe8209	recipe	761f8423-e7ce-435a-9c5d-a9d11e8bb603	2026-08-22 18:32:37.907+05	2026-08-22 18:32:37.907+05
5fffc2f6-3c57-4a34-b171-83eb03f139c8	05d44694-0359-440a-a705-adfb8dfe8209	recipe	d5fb81ab-1f63-4676-a9d0-86f625e9fa1d	2026-08-22 18:32:40.913+05	2026-08-22 18:32:40.913+05
96a00a2d-7e2b-489e-875a-59a839943298	05d44694-0359-440a-a705-adfb8dfe8209	recipe	9d8661e9-ff8a-4f5e-8ff0-1782ab4c4493	2026-08-22 18:32:42.666+05	2026-08-22 18:32:42.666+05
7658beaa-eef6-4a67-aa81-e9ef9000767e	05d44694-0359-440a-a705-adfb8dfe8209	recipe	8345caa5-86d0-498c-a39f-80187ac4c2f7	2026-08-22 18:32:44.126+05	2026-08-22 18:32:44.126+05
d7129528-e8a0-4a36-838a-e3d9a74bfed5	05d44694-0359-440a-a705-adfb8dfe8209	recipe	39f49071-8b01-455c-b0a8-5a8a9aa82c5c	2026-08-22 18:32:45.878+05	2026-08-22 18:32:45.878+05
b11a85b6-6b84-4be3-808e-0ae8f799cabc	05d44694-0359-440a-a705-adfb8dfe8209	recipe	eff99398-d40d-40a1-91f1-915000a3a365	2026-08-22 18:32:48.09+05	2026-08-22 18:32:48.09+05
f5287fab-66d0-4579-a2ac-fac1b31c6a8e	05d44694-0359-440a-a705-adfb8dfe8209	recipe	cf5b18b7-dbb1-4a8d-8d7f-4c801cc2c897	2026-08-22 18:32:49.569+05	2026-08-22 18:32:49.569+05
8eb6eb5f-2def-4f11-823a-8d6ed6391f9f	05d44694-0359-440a-a705-adfb8dfe8209	recipe	8002a81b-65cc-4cd8-845f-159dcd02cbb3	2026-08-22 18:32:51.295+05	2026-08-22 18:32:51.295+05
71304ea5-130b-493c-92dc-f00928a36761	05d44694-0359-440a-a705-adfb8dfe8209	recipe	addd5ead-96db-4287-9042-58cf1fa02c2e	2026-08-22 18:32:53.641+05	2026-08-22 18:32:53.641+05
cf3afca2-2e92-4d39-bbf0-4a613c3bc1e9	05d44694-0359-440a-a705-adfb8dfe8209	recipe	1da4ed9d-bd37-4136-9dc9-8c0f45d92645	2026-08-22 18:32:55.05+05	2026-08-22 18:32:55.05+05
5a2d3f2b-04ba-4931-866c-f1c08fc29f0a	05d44694-0359-440a-a705-adfb8dfe8209	recipe	6ac5732b-082d-4519-97ff-aa34e0b833e1	2026-08-22 18:32:57.667+05	2026-08-22 18:32:57.667+05
045a51a0-1eea-4fa6-8195-67a7e757ff0b	05d44694-0359-440a-a705-adfb8dfe8209	recipe	84a6d295-d6b5-4502-b638-5bc2e6f7d4de	2026-08-22 18:32:58.908+05	2026-08-22 18:32:58.908+05
738bf5f1-3791-4d67-ba3d-e4898ed4f9b3	05d44694-0359-440a-a705-adfb8dfe8209	post	1cc74031-067c-46c7-a2ea-0a10723175e7	2026-08-24 09:45:48.454+05	2026-08-24 09:45:48.454+05
4cfc6f8d-0268-43ec-a93c-f971d11f2165	c564df88-693e-408b-aef3-229c710ed759	post	1119bb76-3517-4e6e-bb01-ad170f383d89	2026-08-24 11:06:34.358+05	2026-08-24 11:06:34.358+05
a95bed0c-448a-476b-8bc7-d459afa9c7fb	c564df88-693e-408b-aef3-229c710ed759	post	88e01913-5f33-4900-8479-f6fccbba64f7	2026-08-24 11:06:36.223+05	2026-08-24 11:06:36.223+05
fee8ab4f-59ac-4315-ae8f-0add1e4ba27d	c564df88-693e-408b-aef3-229c710ed759	recipe	915b9a49-1ef6-4372-b569-0a90f1c5c500	2026-08-25 11:32:56.746+05	2026-08-25 11:32:56.746+05
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, "recipientId", "senderId", action, type, "isRead", "createdAt", "updatedAt") FROM stdin;
3f0d496b-a6bf-4d25-8f16-8d8ac2163a3e	c564df88-693e-408b-aef3-229c710ed759	9f37959a-8760-483f-a6a9-3b88231a8da7	liked your pizza post	like	t	2026-08-20 12:47:50.315+05	2026-08-20 20:17:12.881+05
f35e1164-b4fc-48c6-9715-8a088a92c52c	c564df88-693e-408b-aef3-229c710ed759	9f37959a-8760-483f-a6a9-3b88231a8da7	started following you	follow	t	2026-08-20 12:47:50.315+05	2026-08-20 20:17:12.881+05
e5ec9144-9c67-403a-8c49-4253d6970840	c564df88-693e-408b-aef3-229c710ed759	58aac3f0-78aa-4012-aebf-21bb1769fe7a	commented: "This looks so good!"	comment	t	2026-08-20 12:47:50.315+05	2026-08-20 20:17:12.881+05
a48c6aaf-9bc9-48e2-906e-2eb1e0252788	c564df88-693e-408b-aef3-229c710ed759	9890bb55-77b8-456d-aeb6-d94bb2a7d68f	saved your Egg Fried Rice recipe	save	t	2026-08-20 12:47:50.315+05	2026-08-20 20:17:12.881+05
8a285085-08fc-44bf-a007-829cb1876e82	05d44694-0359-440a-a705-adfb8dfe8209	c564df88-693e-408b-aef3-229c710ed759	started following you	follow	f	2026-08-20 20:28:40.016+05	2026-08-20 20:28:40.016+05
b492491f-04de-4584-8a1a-4a1f01cd96bf	c564df88-693e-408b-aef3-229c710ed759	05d44694-0359-440a-a705-adfb8dfe8209	started following you	follow	f	2026-08-20 20:42:54.629+05	2026-08-20 20:42:54.629+05
e4574866-db24-4045-8e9b-0e4e208ffc70	9f37959a-8760-483f-a6a9-3b88231a8da7	05d44694-0359-440a-a705-adfb8dfe8209	started following you	follow	f	2026-08-20 20:43:03.7+05	2026-08-20 20:43:03.7+05
7227f1a3-5579-4d6f-a2da-a8469b545ab9	9890bb55-77b8-456d-aeb6-d94bb2a7d68f	05d44694-0359-440a-a705-adfb8dfe8209	started following you	follow	f	2026-08-20 20:43:05.31+05	2026-08-20 20:43:05.31+05
ca6a3912-2310-446d-85e6-e3879f0b895c	c564df88-693e-408b-aef3-229c710ed759	05d44694-0359-440a-a705-adfb8dfe8209	commented on your recipe "Steamed Shrimp Dumplings"	comment	f	2026-08-22 18:31:23.44+05	2026-08-22 18:31:23.44+05
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.posts (id, "userId", kind, text, image, "recipeSlug", "createdAt", "updatedAt") FROM stdin;
88e01913-5f33-4900-8479-f6fccbba64f7	c564df88-693e-408b-aef3-229c710ed759	Food Post	Made my first homemade pizza today 🍕 The crust actually worked!	/assets/recipe-pizza.jpg	\N	2026-08-20 12:47:50.266+05	2026-08-20 12:47:50.266+05
72c20eb1-3487-42fa-b8b4-e1e1cc0af354	9f37959a-8760-483f-a6a9-3b88231a8da7	Recipe	New recipe up: Simple Biryani for Beginners. Only one pot, promise 🍚	/assets/recipe-biryani.jpg	simple-biryani-for-beginners	2026-08-20 12:47:50.266+05	2026-08-20 12:47:50.266+05
1d976177-d35e-4b9d-a530-b4f92071ba6e	8da1991b-4942-4a5c-a9ef-301b74bf5bb8	Cooking Tip	Tip of the day: salt your pasta water like the sea. It's the only chance the pasta itself gets seasoned.	\N	\N	2026-08-20 12:47:50.266+05	2026-08-20 12:47:50.266+05
043ee126-a1e7-4f7a-9216-8c468e2df03d	9890bb55-77b8-456d-aeb6-d94bb2a7d68f	Food Post	Sunday sushi practice. Rolling is getting easier 🍣	/assets/recipe-sushi.jpg	\N	2026-08-20 12:47:50.266+05	2026-08-20 12:47:50.266+05
da9d6cc7-2486-4ebe-bafc-4c07a41917f9	58aac3f0-78aa-4012-aebf-21bb1769fe7a	Food Post	Pancake stack for a slow morning 🥞	/assets/recipe-pancakes.jpg	\N	2026-08-20 12:47:50.266+05	2026-08-20 12:47:50.266+05
1119bb76-3517-4e6e-bb01-ad170f383d89	c564df88-693e-408b-aef3-229c710ed759	Food Post	Made Thal 	/uploads/dish-1787236448529-703942086.jpg	\N	2026-08-20 19:34:08.561+05	2026-08-20 19:34:08.561+05
1cc74031-067c-46c7-a2ea-0a10723175e7	05d44694-0359-440a-a705-adfb8dfe8209	Food Post	Made Indian daal 	/uploads/dish-1787546744470-506202971.jpg	\N	2026-08-24 09:45:44.52+05	2026-08-24 09:45:44.52+05
\.


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipes (id, slug, title, image, "creatorId", "cuisineId", "cuisineName", flag, minutes, difficulty, category, beginner, rating, description, ingredients, steps, tip, status, "createdAt", "updatedAt") FROM stdin;
addd5ead-96db-4287-9042-58cf1fa02c2e	chicken-biryani	Chicken Biryani	/assets/recipe-biryani.jpg	c564df88-693e-408b-aef3-229c710ed759	00f5b7a5-37af-4ef6-85d7-3538c1865382	Pakistani	🇵🇰	60	Medium	Dinner	f	4.8	The weekend classic: fragrant layered rice, tender chicken and crisp fried onions.	["2 cups basmati rice, rinsed","500 g chicken, cut into pieces","2 onions, thinly sliced","1 cup plain yogurt","2 tomatoes, chopped","2 tbsp biryani masala","1/2 cup cooking oil","Fresh coriander and mint","Salt to taste"]	["Soak the rinsed rice in water for 30 minutes, then drain.","Fry the sliced onions in oil until golden brown, then set half aside for garnish.","Add chicken, yogurt, tomatoes and masala. Cook until the oil separates.","Boil the rice in salted water until 70% done and drain.","Layer the rice over the chicken, scatter herbs and fried onions.","Cover and steam on low heat for 15 minutes, then fluff gently and serve."]	Keep the heat medium while cooking the onions to avoid burning them.	Approved	2026-08-20 12:47:50.245+05	2026-08-20 12:47:50.245+05
1da4ed9d-bd37-4136-9dc9-8c0f45d92645	homemade-margherita-pizza	Homemade Margherita Pizza	/assets/recipe-pizza.jpg	8da1991b-4942-4a5c-a9ef-301b74bf5bb8	f75c7b16-6846-46f8-b245-0da3fd14b538	Italian	🇮🇹	45	Easy	Dinner	t	4.9	Fresh dough, rich tomato sauce, melted mozzarella, and fragrant basil.	["300 g pizza dough","1/2 cup tomato passata","150 g mozzarella, torn","Fresh basil leaves","1 tbsp olive oil","Salt and oregano"]	["Heat the oven as high as it goes and place a tray inside.","Stretch the dough by hand into a round base on baking paper.","Spread the passata thinly, leaving a border for the crust.","Add mozzarella, a drizzle of oil and a pinch of salt.","Bake 8-10 minutes until the crust is blistered.","Finish with fresh basil and serve immediately."]	Do not overload the base — too many toppings make the middle soggy.	Approved	2026-08-20 12:47:50.245+05	2026-08-20 12:47:50.245+05
8002a81b-65cc-4cd8-845f-159dcd02cbb3	creamy-garlic-pasta	Creamy Garlic Pasta	/assets/recipe-pasta.jpg	8da1991b-4942-4a5c-a9ef-301b74bf5bb8	f75c7b16-6846-46f8-b245-0da3fd14b538	Italian	🇮🇹	20	Easy	Lunch	t	4.7	A velvety, restaurant-style garlic cream sauce tossed with pasta in 20 minutes.	["200 g spaghetti","3 cloves garlic, sliced","3 tbsp butter","1/2 cup cream","Parmesan, grated","Parsley, chopped"]	["Boil the pasta in well-salted water until just tender.","Melt butter in a pan and soften the garlic gently — do not brown it.","Pour in the cream and a splash of pasta water.","Toss the drained pasta in the sauce.","Add parmesan off the heat and stir until glossy.","Top with parsley and black pepper."]	Save a cup of pasta water — it is the easiest way to loosen a thick sauce.	Approved	2026-08-20 12:47:50.245+05	2026-08-20 12:47:50.245+05
cf5b18b7-dbb1-4a8d-8d7f-4c801cc2c897	fluffy-pancakes	Fluffy Breakfast Pancakes	/assets/recipe-pancakes.jpg	58aac3f0-78aa-4012-aebf-21bb1769fe7a	\N	American	🥞	20	Easy	Breakfast	t	4.9	Tall, golden, and cloud-soft pancakes made from everyday pantry ingredients.	["1 1/2 cups flour","2 tbsp sugar","1 tbsp baking powder","1 1/4 cups milk","1 egg","2 tbsp melted butter"]	["Whisk the dry ingredients in a bowl.","Beat the milk, egg and butter together separately.","Fold the wet into the dry — lumps are fine.","Rest the batter for 5 minutes.","Cook on a medium pan until bubbles appear, then flip.","Serve warm with syrup and fruit."]	Do not over-mix the batter, or the pancakes turn rubbery instead of fluffy.	Approved	2026-08-20 12:47:50.245+05	2026-08-20 12:47:50.245+05
eff99398-d40d-40a1-91f1-915000a3a365	egg-fried-rice	10-Minute Egg Fried Rice	/assets/recipe-friedrice.jpg	9890bb55-77b8-456d-aeb6-d94bb2a7d68f	05251d1e-b8d3-4676-ba86-fe9ccf6a163c	Chinese	🇨🇳	15	Easy	Lunch	t	4.8	Quick, savory stir-fried rice loaded with scrambled eggs and colorful veggies.	["3 cups cold cooked rice","2 eggs, beaten","1/2 cup mixed vegetables","2 spring onions, sliced","2 tbsp soy sauce","1 tbsp oil"]	["Heat the oil in a wide pan until shimmering.","Scramble the eggs quickly and move them to one side.","Add the vegetables and stir-fry for a minute.","Add the cold rice and break up any clumps.","Season with soy sauce and toss everything together.","Finish with spring onions."]	Use day-old rice from the fridge — fresh rice steams instead of frying.	Approved	2026-08-20 12:47:50.245+05	2026-08-20 12:47:50.245+05
39f49071-8b01-455c-b0a8-5a8a9aa82c5c	sushi-rolls-at-home	Simple Sushi Rolls	/assets/recipe-sushi.jpg	9890bb55-77b8-456d-aeb6-d94bb2a7d68f	09abc63d-61a9-4e79-baa9-4e05f9a64f6a	Japanese	🇯🇵	50	Hard	Dinner	f	4.6	Master the art of rolling fresh sushi at home with seasoned rice and crisp nori.	["2 cups sushi rice","Nori seaweed sheets","Cucumber & avocado strips","Fresh salmon/tuna","Soy sauce & wasabi"]	["Cook and season sushi rice with vinegar.","Lay nori on rolling mat.","Spread rice evenly.","Add filling and roll tightly.","Slice into pieces."]	Keep your hands wet with vinegar water to prevent rice from sticking.	Approved	2026-08-20 12:47:50.245+05	2026-08-20 12:47:50.245+05
8345caa5-86d0-498c-a39f-80187ac4c2f7	street-style-tacos	Street-Style Tacos	/assets/recipe-tacos.jpg	9f37959a-8760-483f-a6a9-3b88231a8da7	aa9d77e1-16d7-4282-a667-cf19ce25dccf	Mexican	🇲🇽	35	Medium	Dinner	f	4.8	Juicy marinated meat in warm corn tortillas topped with chopped onion and fresh cilantro.	["Corn tortillas","500g beef or chicken","Lime wedges","Cilantro & diced onion","Salsa roja"]	["Marinate and sear the meat on high heat.","Warm tortillas on a griddle.","Fill with meat and garnish."]	Char the tortillas lightly for extra smoky flavor.	Approved	2026-08-20 12:47:50.245+05	2026-08-20 12:47:50.245+05
9d8661e9-ff8a-4f5e-8ff0-1782ab4c4493	italian-spaghetti-carbonara	Classic Spaghetti Carbonara	/assets/italian_pasta.jpg	c564df88-693e-408b-aef3-229c710ed759	f75c7b16-6846-46f8-b245-0da3fd14b538	Italian	🇮🇹	25	Medium	Dinner	f	4.8	A classic Roman pasta dish made with eggs, hard cheese, cured pork, and black pepper.	["Spaghetti","Guanciale or Pancetta","Parmesan Cheese","Eggs","Black Pepper"]	["Boil pasta.","Fry pancetta until crispy.","Whisk eggs and cheese.","Toss pasta with pancetta.","Off heat, mix in egg mixture quickly.","Garnish with pepper and cheese."]	Never add the egg mixture while the pan is on the heat, or you'll get scrambled eggs!	Approved	2026-08-20 14:00:43.413+05	2026-08-20 14:00:43.413+05
915b9a49-1ef6-4372-b569-0a90f1c5c500	chinese-dim-sum-dumplings	Steamed Shrimp Dumplings	/assets/chinese_dumplings.jpg	c564df88-693e-408b-aef3-229c710ed759	05251d1e-b8d3-4676-ba86-fe9ccf6a163c	Chinese	🇨🇳	45	Hard	Lunch	f	4.9	Delicate and juicy Chinese steamed dumplings (Har Gow) served in a bamboo steamer.	["Dumpling Wrappers","Minced Shrimp","Ginger","Scallions","Soy Sauce","Sesame Oil"]	["Mix shrimp with ginger, scallions, soy sauce, and sesame oil.","Place a spoonful of filling on each wrapper.","Fold and pleat the edges to seal.","Steam in a bamboo steamer for 8-10 minutes.","Serve hot with chili oil soy sauce."]	Line the steamer with cabbage leaves to prevent sticking.	Approved	2026-08-20 14:00:43.447+05	2026-08-20 14:00:43.447+05
d5fb81ab-1f63-4676-a9d0-86f625e9fa1d	japanese-sushi-platter	Premium Sushi Platter	/assets/japanese_sushi.jpg	c564df88-693e-408b-aef3-229c710ed759	09abc63d-61a9-4e79-baa9-4e05f9a64f6a	Japanese	🇯🇵	60	Hard	Dinner	f	5	An elegant assortment of fresh Nigiri, Maki rolls, and Sashimi beautifully presented on a slate board.	["Sushi Rice","Sashimi-grade Salmon","Sashimi-grade Tuna","Nori Sheets","Wasabi","Pickled Ginger"]	["Prepare and season sushi rice.","Slice fish into thin pieces.","Shape rice blocks for Nigiri and top with fish.","Roll rice, fish, and vegetables in Nori for Maki.","Arrange beautifully on a platter with ginger and wasabi."]	Wet your hands before handling sushi rice to prevent sticking.	Approved	2026-08-20 14:00:43.454+05	2026-08-20 14:00:43.454+05
7efd6250-9d34-418d-ab7b-0168d275b0ae	korean-dolsot-bibimbap	Dolsot Bibimbap	/assets/korean_bibimbap.jpg	c564df88-693e-408b-aef3-229c710ed759	17bfd604-67d6-43fa-9e9e-b3bdb26489ae	Korean	🇰🇷	40	Medium	Lunch	t	4.7	A comforting Korean rice bowl topped with sautéed vegetables, beef, a fried egg, and gochujang sauce.	["Cooked Rice","Bulgogi Beef","Spinach","Carrots","Bean Sprouts","Egg","Gochujang"]	["Sauté all vegetables separately.","Cook the marinated beef.","Heat a stone bowl and brush with sesame oil.","Add rice to the bowl and let it crisp up.","Arrange toppings, add fried egg, and serve with gochujang."]	Let the rice sit in the hot stone bowl for a few minutes for a crispy bottom!	Approved	2026-08-20 14:00:43.458+05	2026-08-20 14:00:43.458+05
761f8423-e7ce-435a-9c5d-a9d11e8bb603	thai-shrimp-pad-thai	Shrimp Pad Thai	/assets/thai_pad_thai.jpg	c564df88-693e-408b-aef3-229c710ed759	2e60f6ae-16d6-4e94-a9a2-b0f73c6cc6b3	Thai	🇹🇭	30	Medium	Lunch	t	4.8	A classic Thai stir-fried noodle dish with shrimp, peanuts, bean sprouts, and a tangy tamarind sauce.	["Rice Noodles","Shrimp","Tamarind Paste","Fish Sauce","Peanuts","Bean Sprouts","Lime"]	["Soak rice noodles until pliable.","Mix tamarind, fish sauce, and sugar for the sauce.","Stir-fry shrimp and set aside.","Scramble an egg in the pan, add noodles and sauce.","Toss everything together and garnish with peanuts and lime."]	Make sure all ingredients are prepped before you start cooking as the stir-frying is very fast!	Approved	2026-08-20 14:00:43.468+05	2026-08-20 14:00:43.468+05
483bd8f7-4630-46da-a4bb-233a4602a498	mediterranean-mezze-platter	Falafel & Hummus Mezze	/assets/mediterranean_falafel.jpg	c564df88-693e-408b-aef3-229c710ed759	e439632c-07ce-49be-aff5-e28260b00b96	Mediterranean	🫒	50	Medium	Snacks	t	4.9	A fresh and vibrant Mediterranean sharing platter featuring crispy falafel, creamy hummus, and warm pita bread.	["Chickpeas","Tahini","Garlic","Parsley","Lemon","Olive Oil","Pita Bread"]	["Blend chickpeas, tahini, lemon, and garlic for hummus.","Process soaked chickpeas with herbs for falafel.","Form falafel into balls and deep fry until crispy.","Prepare a quick cucumber tomato salad.","Serve all together with warm pita bread."]	Always use dried chickpeas soaked overnight for authentic falafel texture!	Approved	2026-08-20 14:00:43.473+05	2026-08-20 14:00:43.473+05
158555a6-9537-44b4-980f-596a1e18d64f	turkish-kahvalti-breakfast	Traditional Turkish Kahvalti	/assets/turkish_breakfast.jpg	c564df88-693e-408b-aef3-229c710ed759	1bb21d7c-6c5c-4980-9072-4d3d0b7bc318	Turkish	🇹🇷	45	Medium	Breakfast	f	4.9	A lavish traditional Turkish breakfast spread featuring Menemen, olives, feta cheese, and fresh bread.	["4 Eggs","2 Tomatoes","1 Green Pepper","Feta Cheese","Olives","Turkish Tea"]	["Dice tomatoes and peppers.","Sauté peppers until soft.","Add tomatoes and cook until they break down.","Scramble eggs gently into the mixture.","Serve hot with a large breakfast spread."]	Brew the Turkish tea in a double teapot for authentic flavor!	Approved	2026-08-20 14:01:44.823+05	2026-08-20 14:01:44.823+05
84a6d295-d6b5-4502-b638-5bc2e6f7d4de	pakistani-chicken-karahi	Authentic Chicken Karahi	/assets/pakistani_karahi.jpg	c564df88-693e-408b-aef3-229c710ed759	00f5b7a5-37af-4ef6-85d7-3538c1865382	Pakistani	🇵🇰	40	Easy	Dinner	t	4.8	A sizzling, spicy Pakistani Chicken Karahi cooked in a traditional iron wok with fresh ginger and green chilies.	["1 kg Chicken","5 Tomatoes","Ginger Juliennes","Green Chilies","Karahi Masala","Oil"]	["Fry chicken in oil until golden.","Add halved tomatoes and cover until skin peels off.","Mash tomatoes into a rich gravy.","Add spices and cook on high heat.","Garnish generously with ginger and chilies."]	Serve immediately from the wok with hot, fresh naan.	Approved	2026-08-20 14:01:44.885+05	2026-08-20 14:01:44.885+05
6ac5732b-082d-4519-97ff-aa34e0b833e1	mexican-street-tacos	Carne Asada Street Tacos	/assets/mexican_tacos.jpg	c564df88-693e-408b-aef3-229c710ed759	aa9d77e1-16d7-4282-a667-cf19ce25dccf	Mexican	🇲🇽	30	Easy	Lunch	t	4.7	Authentic Mexican street tacos with grilled carne asada, chopped onions, and cilantro on corn tortillas.	["500g Skirt Steak","Corn Tortillas","White Onion","Fresh Cilantro","Limes","Salsa Verde"]	["Marinate steak in citrus and spices.","Grill on high heat until charred.","Chop steak into small cubes.","Warm tortillas on a skillet.","Assemble with meat, onions, cilantro, and a squeeze of lime."]	Double up the corn tortillas so they don't break!	Approved	2026-08-20 14:01:44.889+05	2026-08-20 14:01:44.889+05
45199de2-c275-477a-9e9c-9af60ade1b6c	indian-mango-lassi	Refreshing Mango Lassi	/assets/indian_mango_lassi.jpg	c564df88-693e-408b-aef3-229c710ed759	8c2b3738-7ff0-4a35-9a9a-244ba1582964	Indian	🇮🇳	10	Easy	Drinks	t	4.9	A sweet, creamy, and refreshing Indian yogurt-based drink made with fresh sweet mangoes and a hint of cardamom.	["1 cup Mango Pulp","1 cup Plain Yogurt","2 tbsp Sugar","Cardamom Powder","Pistachios"]	["Combine mango pulp, yogurt, and sugar in a blender.","Blend until smooth and frothy.","Add a pinch of cardamom.","Pour into a tall glass.","Garnish with chopped pistachios and saffron."]	Serve chilled with ice cubes during hot summer days.	Approved	2026-08-20 14:01:44.893+05	2026-08-20 14:01:44.893+05
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reports (id, target, type, reason, "reporterId", status, "createdAt", "updatedAt") FROM stdin;
14b6a253-c01f-47b3-9b0d-c2d26450ebd0	Post · "Buy followers cheap"	Post	Spam	c564df88-693e-408b-aef3-229c710ed759	Resolved	2026-08-20 12:47:50.32+05	2026-08-23 10:48:02.764+05
a7ab27ef-fcf3-4bcc-b9fb-7ed5a9ba6d23	User · @fakechef	User	Impersonation	9f37959a-8760-483f-a6a9-3b88231a8da7	Dismissed	2026-08-20 12:47:50.32+05	2026-08-23 10:48:14.653+05
\.


--
-- Data for Name: saved_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.saved_items (id, "userId", "targetType", "targetId", "createdAt", "updatedAt") FROM stdin;
977310be-c61f-43da-80a7-0b4088cad54f	c564df88-693e-408b-aef3-229c710ed759	recipe	1da4ed9d-bd37-4136-9dc9-8c0f45d92645	2026-08-20 12:47:50.31+05	2026-08-20 12:47:50.31+05
c00ea6e3-baf5-4b9e-a1db-a6f0b1590a7d	c564df88-693e-408b-aef3-229c710ed759	recipe	8002a81b-65cc-4cd8-845f-159dcd02cbb3	2026-08-20 12:47:50.31+05	2026-08-20 12:47:50.31+05
65e4ef2d-494f-4686-9697-19b7dedf79c7	9f37959a-8760-483f-a6a9-3b88231a8da7	recipe	eff99398-d40d-40a1-91f1-915000a3a365	2026-08-20 12:47:50.31+05	2026-08-20 12:47:50.31+05
85e0e309-64aa-4ad9-be10-a29130d40b5c	c564df88-693e-408b-aef3-229c710ed759	recipe	9d8661e9-ff8a-4f5e-8ff0-1782ab4c4493	2026-08-24 13:24:17.985+05	2026-08-24 13:24:17.985+05
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (key, value, "createdAt", "updatedAt") FROM stdin;
require_recipe_approval	true	2026-08-20 12:47:50.326+05	2026-08-20 12:47:50.326+05
auto_hide_reported_posts	true	2026-08-20 12:47:50.326+05	2026-08-20 12:47:50.326+05
allow_guest_browsing	true	2026-08-20 12:47:50.326+05	2026-08-20 12:47:50.326+05
beginner_badge_on_easy	true	2026-08-20 12:47:50.326+05	2026-08-20 12:47:50.326+05
community_guidelines	"Be kind. Credit recipes you adapt. No spam, no hateful language, no unsafe food advice."	2026-08-20 12:47:50.326+05	2026-08-20 12:47:50.326+05
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, username, email, password, bio, emoji, avatar, role, status, "createdAt", "updatedAt") FROM stdin;
c564df88-693e-408b-aef3-229c710ed759	Sarah Khan	sarahkitchen	sarah@chulha.app	$2b$10$BpEaDwJN6IplErGvyQBHDO1HS8X7HNFi4pOKjCybIrqAn9WxDtHyW	Home cook in Lahore 🍳 Teaching beginners one dish at a time.	👩‍🍳	\N	Admin	Active	2026-08-20 12:47:49.656+05	2026-08-20 12:47:49.656+05
9f37959a-8760-483f-a6a9-3b88231a8da7	Ahmed Raza	ahmedcooks	ahmed@chulha.app	$2b$10$7EseYMBS4684/1XPVyJdyOUzimltFXYbnit2i6MNGnNdR.YNn9Jg6	Desi flavours, simple steps. Biryani is a personality trait.	👨‍🍳	\N	Moderator	Active	2026-08-20 12:47:49.797+05	2026-08-20 12:47:49.797+05
9890bb55-77b8-456d-aeb6-d94bb2a7d68f	Mina Aoki	minabowls	mina@chulha.app	$2b$10$oxdLQcZCwluylx308CX7ceCZZ97Jdzq4Dlu4x/DnWroh7u420MxI.	Japanese comfort food + tidy kitchens.	🍱	\N	Member	Active	2026-08-20 12:47:49.905+05	2026-08-20 12:47:49.905+05
8da1991b-4942-4a5c-a9ef-301b74bf5bb8	Luca Bianchi	lucapasta	luca@chulha.app	$2b$10$RuF8898FW6Wkgee6dBB.uuMl2nCtsAo0uHQyKWBlR2dIaau3mxHGy	Nonna-approved pasta only.	🍝	\N	Member	Suspended	2026-08-20 12:47:50.012+05	2026-08-20 12:47:50.012+05
58aac3f0-78aa-4012-aebf-21bb1769fe7a	Zara Ali	zarabakes	zara@chulha.app	$2b$10$n6In4iryjh/fMPIyDSCwcO7lSNDk2Cm0v4pSNML3ZEf8yVDoyu9k2	Cakes, cookies and chaos.	🎂	\N	Member	Pending	2026-08-20 12:47:50.126+05	2026-08-20 12:47:50.126+05
05d44694-0359-440a-a705-adfb8dfe8209	Ayma	aymaaaa	aymamansoor581@gmail.com	$2b$10$SRnuMmdQ3Wz3rySEoKlBku2kQ2Uim.qYhY.w9hoXKvkPdASHaH20O		👩‍🍳	\N	Member	Active	2026-08-20 20:27:36.95+05	2026-08-20 20:27:36.95+05
537dd2c4-1546-4fab-bcce-d1eb1e47d560	Maryam Tahir	maryam342	maryam@gmail.com	$2b$10$CRENbldKy4puEfXa5F4s.u0VAK1lD/SvXHhiybv5YuRRZQMH/iwEO		👩‍🍳	\N	Member	Active	2026-08-24 09:42:45.118+05	2026-08-24 09:42:45.118+05
\.


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: cuisines cuisines_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuisines
    ADD CONSTRAINT cuisines_name_key UNIQUE (name);


--
-- Name: cuisines cuisines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuisines
    ADD CONSTRAINT cuisines_pkey PRIMARY KEY (id);


--
-- Name: cuisines cuisines_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuisines
    ADD CONSTRAINT cuisines_slug_key UNIQUE (slug);


--
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY ("followerId", "followingId");


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_slug_key UNIQUE (slug);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: saved_items saved_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_items
    ADD CONSTRAINT saved_items_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (key);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: likes_user_id_target_type_target_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX likes_user_id_target_type_target_id ON public.likes USING btree ("userId", "targetType", "targetId");


--
-- Name: saved_items_user_id_target_type_target_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX saved_items_user_id_target_type_target_id ON public.saved_items USING btree ("userId", "targetType", "targetId");


--
-- Name: comments comments_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_recipeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES public.recipes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: follows follows_followerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: follows follows_followingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: likes likes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_recipientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: posts posts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: recipes recipes_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT "recipes_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: recipes recipes_cuisineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT "recipes_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES public.cuisines(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reports reports_reporterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: saved_items saved_items_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_items
    ADD CONSTRAINT "saved_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Wy0PEeE4www1tJ8hg7o8GUGHLYVyQlI7GyxBRuSeBxj7RSPzOpnYBLLYh5WtZ9E

