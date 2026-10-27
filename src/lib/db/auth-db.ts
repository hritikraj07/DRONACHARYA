// Dronacharya Database & Authentication Engine
// Connected directly to Supabase Database (profiles & game_progress) with synchronous local cache
import { supabase } from '@/lib/supabase';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  studentClass: string;
  targetSubject: string;
  preferredLanguage: 'en' | 'hi' | 'hinglish';
  totalXp: number;
  currentStreak: number;
  rank: 'Sadhaka' | 'Abhyasi' | 'Vidvan' | 'Acharya';
  hearts: number;
  level: number;
  completedMissions: string[];
  unlockedSeals: string[];
  createdAt: string;
}

const USERS_DB_KEY = 'dronacharya_database_users_v2';
const CURRENT_SESSION_KEY = 'dronacharya_active_session_v2';

export const AVAILABLE_CLASSES = [
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12 / 12th Pass',
];

export interface SubjectMetadata {
  id: string;
  name: string;
  title: string;
  slug: string;
  category: string;
  icon: string;
  badge: string;
  tagline: string;
  description: string;
  isAvailable: boolean;
  isComingSoon: boolean;
  totalChapters?: number;
  totalLessons?: number;
  color?: string;
}

export const AVAILABLE_SUBJECTS: SubjectMetadata[] = [
  // ONLY ACTIVE PLAYABLE TRACK: PYTHON
  {
    id: 'python',
    name: 'Python',
    title: 'Python: The Python Course',
    slug: 'python',
    category: 'Programming',
    icon: 'Terminal',
    badge: 'Active Quest',
    tagline: 'Game-Based Python: Loops, Logic & Autonomous Rover Arya',
    description: 'Master core programming fundamentals from your first print statement to variables, branching conditions, loops, lists, and reusable functions.',
    isAvailable: true,
    isComingSoon: false,
    totalChapters: 8,
    totalLessons: 24,
    color: '#6C5CE7',
  },

  // COMING SOON TRACKS
  {
    id: 'html',
    name: 'HTML',
    title: 'HTML: The Blueprint',
    slug: 'html',
    category: 'Web Development',
    icon: 'FileCode',
    badge: 'Coming Soon ⏳',
    tagline: 'Structure of the Web: Elements, Semantic Tags & Mini-Portfolio',
    description: 'Learn the foundational markup language that powers every website on the internet. Write tags, embed media, and architect responsive pages.',
    isAvailable: false,
    isComingSoon: true,
    totalChapters: 3,
    totalLessons: 7,
    color: '#E44D26',
  },
  {
    id: 'css',
    name: 'CSS',
    title: 'CSS: Colors & Layouts',
    slug: 'css',
    category: 'Web Development',
    icon: 'Palette',
    badge: 'Coming Soon ⏳',
    tagline: 'Styling & Design: Selectors, Box Model, Flexbox & Grid Systems',
    description: 'Bring websites to life with colors, typography, modern Box Model mechanics, Flexbox layouts, and CSS Grid responsive galleries.',
    isAvailable: false,
    isComingSoon: true,
    totalChapters: 3,
    totalLessons: 7,
    color: '#264DE4',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    title: 'JavaScript: Interactive Web',
    slug: 'javascript',
    category: 'Programming',
    icon: 'Code2',
    badge: 'Coming Soon ⏳',
    tagline: 'Interactivity & Logic: Variables, Conditionals, DOM & Events',
    description: 'Master the programming language of the browser. Create dynamic user interactions, manipulate the DOM, and control game logic.',
    isAvailable: false,
    isComingSoon: true,
    totalChapters: 3,
    totalLessons: 7,
    color: '#F7DF1E',
  },

  // 6 LOCKED COMING SOON TRACKS
  {
    id: 'react',
    name: 'React',
    title: 'React: Components & Hooks',
    slug: 'react',
    category: 'Frontend Framework',
    icon: 'Atom',
    badge: 'Coming Soon ⏳',
    tagline: 'Component Architecture, State, Hooks & Modern Single-Page Apps',
    description: 'Build reactive user interfaces with reusable components, state hooks, and modern frontend design systems.',
    isAvailable: false,
    isComingSoon: true,
    color: '#61DAFB',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    title: 'Node.js: Server-Side JS',
    slug: 'nodejs',
    category: 'Backend Engine',
    icon: 'Server',
    badge: 'Coming Soon ⏳',
    tagline: 'Server-Side JavaScript, REST APIs, JSON & Express Engine',
    description: 'Build scalable backend services, HTTP servers, RESTful endpoints, and backend application logic.',
    isAvailable: false,
    isComingSoon: true,
    color: '#339933',
  },
  {
    id: 'sql',
    name: 'SQL',
    title: 'SQL: Databases & Queries',
    slug: 'sql',
    category: 'Databases',
    icon: 'Database',
    badge: 'Coming Soon ⏳',
    tagline: 'Relational Databases, Queries, Joins, Aggregations & Schemas',
    description: 'Query relational databases, structure table relationships, extract insights with SELECT, and perform complex JOIN operations.',
    isAvailable: false,
    isComingSoon: true,
    color: '#00758F',
  },
  {
    id: 'cpp',
    name: 'C++',
    title: 'C++: High Performance',
    slug: 'cpp',
    category: 'Systems Programming',
    icon: 'Cpu',
    badge: 'Coming Soon ⏳',
    tagline: 'Pointers, Memory Allocation, Structures & Game Engine Math',
    description: 'Master hardware-level control, pointers, reference semantics, and high-performance algorithms.',
    isAvailable: false,
    isComingSoon: true,
    color: '#00599C',
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    title: 'Machine Learning: AI Foundations',
    slug: 'ml',
    category: 'AI & Data Science',
    icon: 'Brain',
    badge: 'Coming Soon ⏳',
    tagline: 'Neural Networks, Data Cleaning, Regression & Predictive Models',
    description: 'Explore statistical learning, machine learning pipelines, classification, regression, and practical model training.',
    isAvailable: false,
    isComingSoon: true,
    color: '#FF6F00',
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    title: 'Git & GitHub: Version Control',
    slug: 'git',
    category: 'Developer Tools',
    icon: 'GitBranch',
    badge: 'Coming Soon ⏳',
    tagline: 'Version Control, Branching, Pull Requests & Open-Source Collaboration',
    description: 'Collaborate with developers worldwide. Master git init, commits, branching workflows, pull requests, and merge conflict resolution.',
    isAvailable: false,
    isComingSoon: true,
    color: '#F05032',
  },
];

/**
 * Normalize subject identifiers and aliases to primary active IDs
 */
export function normalizeSubjectId(id?: string): string {
  if (!id) return 'html';
  const clean = id.toLowerCase().trim();
  if (clean === 'py' || clean === 'python-basics' || clean === 'python-101' || clean === 'python-realm') return 'python';
  if (clean === 'js' || clean === 'javascript-101' || clean === 'web-development') return 'javascript';
  if (clean === 'html-101' || clean === 'html-basics') return 'html';
  if (clean === 'css-101' || clean === 'css-basics') return 'css';
  if (clean === 'c-programming' || clean === 'cpp-programming' || clean === 'c++') return 'cpp';
  if (clean === 'machine-learning' || clean === 'ai') return 'ml';
  if (clean === 'github') return 'git';
  return clean;
}

export function calculateRank(xp: number): 'Sadhaka' | 'Abhyasi' | 'Vidvan' | 'Acharya' {
  if (xp >= 9000) return 'Acharya';
  if (xp >= 3500) return 'Vidvan';
  if (xp >= 1000) return 'Abhyasi';
  return 'Sadhaka';
}

// Read all registered users from local cache
export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Error reading database cache:', e);
    return [];
  }
}

// Save users to local cache
function saveRegisteredUsers(users: RegisteredUser[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Error writing database cache:', e);
  }
}

const GUEST_SESSION_KEY = 'dronacharya_guest_session_v1';

// Default guest explorer profile
const DEFAULT_GUEST: RegisteredUser = {
  id: 'guest',
  name: 'Guest Explorer',
  email: 'guest@dronacharya.local',
  studentClass: 'Class 10',
  targetSubject: 'python',
  preferredLanguage: 'hinglish',
  totalXp: 0,
  currentStreak: 1,
  rank: 'Sadhaka',
  hearts: 5,
  level: 1,
  completedMissions: [],
  unlockedSeals: [],
  createdAt: '2026-10-27',
};

export function getGuestSession(): RegisteredUser {
  if (typeof window === 'undefined') return DEFAULT_GUEST;
  try {
    const raw = localStorage.getItem(GUEST_SESSION_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(DEFAULT_GUEST));
    return DEFAULT_GUEST;
  } catch (e) {
    return DEFAULT_GUEST;
  }
}

export function saveGuestSession(guest: RegisteredUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(guest));
    window.dispatchEvent(new Event('dronacharya_session_change'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {}
}

export function getEffectiveUser(): RegisteredUser {
  return getActiveSession() || getGuestSession();
}

// Get active logged-in user from session cache or cookie
export function getActiveSession(): RegisteredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    if (raw) return JSON.parse(raw);

    // Cookie fallback
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|; )dronacharya_session=([^;]*)/);
      if (match) {
        return JSON.parse(decodeURIComponent(match[1]));
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Set active session & broadcast immediately to TopNav and all components
export function setActiveSession(user: RegisteredUser | null, session?: any) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
      const maxAge = 60 * 60 * 24 * 7; // 7 days
      if (typeof document !== 'undefined') {
        document.cookie = `dronacharya_session=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
      }

      if (session?.access_token) {
        localStorage.setItem('sb_access_token', session.access_token);
        if (typeof document !== 'undefined') {
          document.cookie = `sb_access_token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }
      }
      if (session?.refresh_token) {
        localStorage.setItem('sb_refresh_token', session.refresh_token);
        if (typeof document !== 'undefined') {
          document.cookie = `sb_refresh_token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }
      }
    } else {
      localStorage.removeItem(CURRENT_SESSION_KEY);
      localStorage.removeItem('sb_access_token');
      localStorage.removeItem('sb_refresh_token');
      if (typeof document !== 'undefined') {
        document.cookie = 'dronacharya_session=; path=/; max-age=0; SameSite=Lax';
        document.cookie = 'sb_access_token=; path=/; max-age=0; SameSite=Lax';
        document.cookie = 'sb_refresh_token=; path=/; max-age=0; SameSite=Lax';
      }
      supabase.auth.signOut().catch(() => {});
    }
    // Broadcast event so TopNav and components update instantly
    window.dispatchEvent(new Event('dronacharya_session_change'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('Error setting session cache:', e);
  }
}

/**
 * Register a new student into Supabase Auth & public.profiles
 */
export async function registerUser(params: {
  name: string;
  email: string;
  password: string;
  studentClass: string;
  targetSubject: string;
  preferredLanguage?: 'en' | 'hi' | 'hinglish';
}): Promise<{ success: boolean; user?: RegisteredUser; session?: any; error?: string }> {
  const email = (params.email || '').trim();
  const normalizedEmail = email.toLowerCase();

  if (params.password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters long.',
    };
  }

  try {
    // 1. Sign up user with Supabase Auth (passing full_name in metadata for auth trigger)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: params.password,
      options: {
        data: {
          full_name: params.name.trim(),
          selected_class: params.studentClass || AVAILABLE_CLASSES[1],
          selected_subjects: [params.targetSubject || AVAILABLE_SUBJECTS[0].id],
        },
      },
    });

    if (authError) {
      return {
        success: false,
        error: authError.message,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Unable to create user account. Please check credentials.',
      };
    }

    const userId = authData.user.id;
    const targetSub = params.targetSubject || AVAILABLE_SUBJECTS[0].id;
    const studentCls = params.studentClass || AVAILABLE_CLASSES[1];

    // Read any existing guest explorer progress so we can seamlessly sync to Supabase
    const guest = getGuestSession();
    const guestXp = guest.totalXp || 0;
    const guestMissions = guest.completedMissions || [];
    const guestSeals = guest.unlockedSeals || [];

    // 2. Save selected_class, selected_subjects, and synced guest XP to public.profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        selected_class: studentCls,
        selected_subjects: [targetSub],
        ...(guestXp > 0 ? { xp: guestXp } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (profileError) {
      console.warn('Supabase profile initial update notice:', profileError.message);
    }

    // Sync guest completed missions to public.game_progress in Supabase
    if (guestMissions.length > 0) {
      for (const mId of guestMissions) {
        supabase
          .from('game_progress')
          .upsert({
            user_id: userId,
            subject: targetSub,
            level_id: String(mId),
            score: 100,
            completed: true,
            updated_at: new Date().toISOString(),
          })
          .then(({ error }) => {
            if (error) console.warn('Supabase guest game_progress sync notice:', error.message);
          });
      }
    }

    // 3. Construct clean RegisteredUser with synced progress
    const newUser: RegisteredUser = {
      id: userId,
      name: params.name.trim(),
      email: normalizedEmail,
      password: params.password,
      studentClass: studentCls,
      targetSubject: targetSub,
      preferredLanguage: params.preferredLanguage || 'hinglish',
      totalXp: guestXp,
      currentStreak: 1,
      rank: calculateRank(guestXp),
      level: Math.floor(guestXp / 200) + 1,
      hearts: 5,
      completedMissions: guestMissions,
      unlockedSeals: guestSeals,
      createdAt: authData.user.created_at || new Date().toISOString(),
    };

    // Reset guest session in localStorage now that it is synced to Supabase
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(GUEST_SESSION_KEY);
      } catch (e) {}
    }

    // 4. Update local session & backup cache with session tokens and cookies
    const users = getRegisteredUsers();
    users.push(newUser);
    saveRegisteredUsers(users);
    setActiveSession(newUser, authData.session);

    return { success: true, user: newUser, session: authData.session };
  } catch (err: any) {
    console.error('Supabase registration error:', err);
    return {
      success: false,
      error: err.message || 'An unexpected registration error occurred.',
    };
  }
}

/**
 * Authenticate user with Supabase Auth & fetch from public.profiles + public.game_progress
 */
export async function authenticateUser(params: {
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: RegisteredUser; session?: any; error?: string }> {
  // Ensure .trim() is used on the email address so trailing spaces don't cause an invalid credentials error
  const email = (params.email || '').trim();
  const password = params.password;

  try {
    // 1. Direct call to Supabase Auth signInWithPassword
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // 2. Log exact Supabase response in browser console
    console.log("Auth attempt:", email, error);

    if (error) {
      return {
        success: false,
        error: error.message || 'Invalid email or password entered.',
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'User not found in database.',
      };
    }

    const userId = authData.user.id;

    // 2. Fetch user's row from public.profiles
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileErr) {
      console.warn('Supabase profile fetch error:', profileErr.message);
    }

    // 3. Fetch user's progress from public.game_progress
    const { data: progressRows, error: progressErr } = await supabase
      .from('game_progress')
      .select('*')
      .eq('user_id', userId);

    if (progressErr) {
      console.warn('Supabase game_progress fetch error:', progressErr.message);
    }

    const userXp = profile?.xp ?? 0;
    const completedMissions = progressRows
      ? progressRows.filter((r) => r.completed).map((r) => String(r.level_id || r.id))
      : [];

    const authenticatedUser: RegisteredUser = {
      id: userId,
      name: profile?.full_name || authData.user.user_metadata?.full_name || 'Scholar',
      email: authData.user.email || email,
      password: params.password,
      studentClass: profile?.selected_class || AVAILABLE_CLASSES[1],
      targetSubject:
        profile?.selected_subjects && profile.selected_subjects.length > 0
          ? profile.selected_subjects[0]
          : AVAILABLE_SUBJECTS[0].id,
      preferredLanguage: 'hinglish',
      totalXp: userXp,
      currentStreak: profile?.streak || 1,
      rank: calculateRank(userXp),
      level: Math.floor(userXp / 200) + 1,
      hearts: profile?.hearts ?? 3,
      completedMissions,
      unlockedSeals: [],
      createdAt: profile?.created_at || authData.user.created_at || new Date().toISOString(),
    };

    // 4. Update local session & backup cache
    const users = getRegisteredUsers();
    const existingIdx = users.findIndex(
      (u) => u.id === userId || u.email.toLowerCase() === email.toLowerCase()
    );
    if (existingIdx !== -1) {
      users[existingIdx] = authenticatedUser;
    } else {
      users.push(authenticatedUser);
    }
    saveRegisteredUsers(users);

    // Save user state and session tokens to app state & cookies
    setActiveSession(authenticatedUser, authData.session);

    return { success: true, user: authenticatedUser, session: authData.session };
  } catch (err: any) {
    console.error('Supabase authentication error:', err);
    return {
      success: false,
      error: err.message || 'Authentication failed. Please verify credentials.',
    };
  }
}

/**
 * Update student's selected class or subject anytime:
 * Syncs directly to Supabase public.profiles while updating local session cache synchronously
 */
export function updateUserLearningSelection(params: {
  studentClass?: string;
  targetSubject?: string;
  preferredLanguage?: 'en' | 'hi' | 'hinglish';
}): RegisteredUser | null {
  const normSubject = params.targetSubject ? normalizeSubjectId(params.targetSubject) : undefined;
  let resolvedSubject = normSubject;
  if (normSubject) {
    const found = AVAILABLE_SUBJECTS.find((s) => s.id === normSubject);
    if (found?.isComingSoon) {
      console.warn(`Subject ${normSubject} is Coming Soon and cannot be selected as an active quest.`);
      resolvedSubject = undefined;
    }
  }

  const currentUser = getActiveSession();
  if (!currentUser) {
    const guest = getGuestSession();
    const updatedGuest: RegisteredUser = {
      ...guest,
      ...(params.studentClass ? { studentClass: params.studentClass } : {}),
      ...(resolvedSubject ? { targetSubject: resolvedSubject } : {}),
      ...(params.preferredLanguage ? { preferredLanguage: params.preferredLanguage } : {}),
    };
    saveGuestSession(updatedGuest);
    return updatedGuest;
  }

  const updatedUser: RegisteredUser = {
    ...currentUser,
    ...(params.studentClass ? { studentClass: params.studentClass } : {}),
    ...(resolvedSubject ? { targetSubject: resolvedSubject } : {}),
    ...(params.preferredLanguage ? { preferredLanguage: params.preferredLanguage } : {}),
  };

  // Immediate synchronous session update for smooth UI
  setActiveSession(updatedUser);

  // Sync to local backup array
  const users = getRegisteredUsers();
  const idx = users.findIndex((u) => u.id === currentUser.id);
  if (idx !== -1) {
    users[idx] = updatedUser;
    saveRegisteredUsers(users);
  }

  // Direct asynchronous sync to Supabase public.profiles
  supabase
    .from('profiles')
    .update({
      ...(params.studentClass ? { selected_class: params.studentClass } : {}),
      ...(params.targetSubject ? { selected_subjects: [params.targetSubject] } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentUser.id)
    .then(({ error }) => {
      if (error) console.warn('Supabase profile sync notice:', error.message);
    });

  return updatedUser;
}

/**
 * Record Game Progress & award XP:
 * If authenticated: Syncs directly to public.profiles (xp) and public.game_progress
 * If guest explorer: Syncs seamlessly to localStorage guest session
 */
export function recordGameProgress(params: {
  missionId: string;
  earnedXp: number;
  levelId?: string;
  subject?: string;
  sealId?: string;
}): RegisteredUser | null {
  const currentUser = getActiveSession();
  if (!currentUser) {
    const guest = getGuestSession();
    const newMissions = Array.from(new Set([...guest.completedMissions, params.missionId]));
    const newSeals = params.sealId
      ? Array.from(new Set([...guest.unlockedSeals, params.sealId]))
      : guest.unlockedSeals;

    const newTotalXp = guest.totalXp + params.earnedXp;
    const newLevel = Math.floor(newTotalXp / 200) + 1;
    const newRank = calculateRank(newTotalXp);

    const updatedGuest: RegisteredUser = {
      ...guest,
      totalXp: newTotalXp,
      level: newLevel,
      rank: newRank,
      completedMissions: newMissions,
      unlockedSeals: newSeals,
    };
    saveGuestSession(updatedGuest);
    return updatedGuest;
  }

  const newMissions = Array.from(new Set([...currentUser.completedMissions, params.missionId]));
  const newSeals = params.sealId
    ? Array.from(new Set([...currentUser.unlockedSeals, params.sealId]))
    : currentUser.unlockedSeals;

  const newTotalXp = currentUser.totalXp + params.earnedXp;
  const newLevel = Math.floor(newTotalXp / 200) + 1;
  const newRank = calculateRank(newTotalXp);

  const updatedUser: RegisteredUser = {
    ...currentUser,
    totalXp: newTotalXp,
    level: newLevel,
    rank: newRank,
    completedMissions: newMissions,
    unlockedSeals: newSeals,
  };

  // Immediate synchronous session update
  setActiveSession(updatedUser);

  // Sync to local backup array
  const users = getRegisteredUsers();
  const idx = users.findIndex((u) => u.id === currentUser.id);
  if (idx !== -1) {
    users[idx] = updatedUser;
    saveRegisteredUsers(users);
  }

  // Direct asynchronous sync to Supabase public.profiles
  supabase
    .from('profiles')
    .update({
      xp: newTotalXp,
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentUser.id)
    .then(({ error }) => {
      if (error) console.warn('Supabase xp sync notice:', error.message);
    });

  // Direct asynchronous sync to Supabase public.game_progress
  supabase
    .from('game_progress')
    .upsert({
      user_id: currentUser.id,
      subject: params.subject || currentUser.targetSubject || 'python-basics',
      level_id: String(params.levelId || params.missionId || '1'),
      score: newTotalXp,
      completed: true,
      updated_at: new Date().toISOString(),
    })
    .then(({ error }) => {
      if (error) console.warn('Supabase game_progress upsert notice:', error.message);
    });

  return updatedUser;
}

// Backward-compatible alias for existing call sites
export const awardGameProgress = recordGameProgress;

/**
 * Deduct a heart upon game collision/failure:
 * Syncs to Supabase profiles if logged in, or localStorage if guest explorer
 */
export function deductHeart(): number {
  const currentUser = getActiveSession();
  if (!currentUser) {
    const guest = getGuestSession();
    const remaining = Math.max(0, guest.hearts - 1);
    const updated = { ...guest, hearts: remaining };
    saveGuestSession(updated);
    return remaining;
  }

  const remaining = Math.max(0, currentUser.hearts - 1);
  const updated = { ...currentUser, hearts: remaining };
  setActiveSession(updated);

  // Sync to Supabase public.profiles
  supabase
    .from('profiles')
    .update({
      hearts: remaining,
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentUser.id)
    .then(({ error }) => {
      if (error) console.warn('Supabase deductHeart notice:', error.message);
    });

  return remaining;
}

/**
 * Restore hearts:
 * Syncs to Supabase profiles if logged in, or localStorage if guest explorer
 */
export function restoreHearts(): number {
  const currentUser = getActiveSession();
  if (!currentUser) {
    const guest = getGuestSession();
    const updated = { ...guest, hearts: 5 };
    saveGuestSession(updated);
    return 5;
  }

  const updated = { ...currentUser, hearts: 5 };
  setActiveSession(updated);

  // Sync to Supabase public.profiles
  supabase
    .from('profiles')
    .update({
      hearts: 5,
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentUser.id)
    .then(({ error }) => {
      if (error) console.warn('Supabase restoreHearts notice:', error.message);
    });

  return 5;
}

/**
 * Helper to dispatch event that prompts guests to save progress to Supabase
 */
export function triggerSaveProgressModal(reason: string = 'save_progress') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dronacharya_open_save_progress', { detail: { reason } }));
  }
}

/**
 * Create an immediate guest demo session without requiring credentials.
 * Directly routes to learning the respective selected course.
 */
export function createGuestSession(targetSubject: string = 'python', studentClass: string = 'Class 10'): RegisteredUser {
  const norm = normalizeSubjectId(targetSubject);
  const subjectObj = AVAILABLE_SUBJECTS.find((s) => s.id === norm && !s.isComingSoon);
  const activeSubject = subjectObj ? subjectObj.id : 'python';

  const guestUser: RegisteredUser = {
    id: `guest_${Date.now()}`,
    name: 'Guest Explorer',
    email: 'guest@dronacharya.local',
    studentClass: studentClass,
    targetSubject: activeSubject,
    preferredLanguage: 'en',
    totalXp: 150,
    currentStreak: 1,
    rank: 'Sadhaka',
    hearts: 5,
    level: 1,
    completedMissions: [],
    unlockedSeals: [],
    createdAt: new Date().toISOString(),
  };

  setActiveSession(guestUser, null);
  return guestUser;
}
