// Dronacharya Hierarchical Course & Curriculum System
// Hierarchy: COURSES -> CHAPTERS -> LESSONS -> EXERCISES -> MISSIONS -> CHALLENGES -> PROJECTS
// Full 4 Active Curricula: HTML 101, CSS 101, JavaScript 101, Python 101
// Plus locked Coming Soon tracks: React, Node.js, SQL, C++, Machine Learning, Git & GitHub.

export interface ExerciseTestCase {
  inputDescription: string;
  expectedOutput: string;
  codeSnippet: string; // e.g. "stdout:Hello, World!" or "tag:h1" or "css:color"
}

export interface Exercise {
  id: string;
  type: 'code' | 'predict';
  title: string;
  instructions: string;
  prompt: string;
  initialCode: string;
  solutionCode: string;
  testCases: ExerciseTestCase[];
  predictOptions?: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  hints: string[];
  xpReward: number;
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  sequenceOrder: number;
  title: string;
  subtitle: string;
  storyIntro: string;
  storyIntroHinglish?: string;
  conceptExplanation: string;
  conceptExplanationHinglish?: string;
  codeExample: string;
  codeExampleExplanation: string;
  interactiveTryStarter: string;
  tryExplanation: string;
  exercise: Exercise;
  connectedGameMissionId?: string;
  xpReward: number;
  starterHtml?: string;
  starterCss?: string;
  starterJs?: string;
  solutionHtml?: string;
  solutionCss?: string;
  solutionJs?: string;
}

export interface BossChallenge {
  id: string;
  title: string;
  description: string;
  objective: string;
  starterCode: string;
  solutionCode: string;
  testCases: ExerciseTestCase[];
  hints: string[];
  xpReward: number;
}

export interface Chapter {
  id: string;
  courseId: string;
  chapterNumber: number;
  title: string;
  conceptName: string;
  description: string;
  realmName: string; // Connected to World Map
  iconName: string;
  color: string;
  lessons: Lesson[];
  bossChallenge: BossChallenge;
  connectedGameMissionId?: string;
  connectedProjectId?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tagline: string;
  description: string;
  totalChapters: number;
  totalLessons: number;
  xpReward: number;
  iconName: string;
  badgeText: string;
  badgeColor: string;
  themeColor?: string;
  isAvailable: boolean;
  isComingSoon?: boolean;
  chapters: Chapter[];
}

export const COURSES_CATALOG: Course[] = [
  // =========================================================================
  // 1. HTML 101: The Blueprint of the Web (ACTIVE)
  // =========================================================================
  {
    id: 'html',
    slug: 'html',
    title: 'HTML: The Blueprint',
    language: 'HTML',
    level: 'Beginner',
    tagline: 'Structure of the Web: Elements, Semantic Tags & Mini-Portfolio.',
    description: 'Master the foundational markup language that powers every website on the internet. Write tags, embed media, and architect responsive pages.',
    totalChapters: 3,
    totalLessons: 7,
    xpReward: 350,
    iconName: 'FileCode',
    badgeText: 'Coming Soon ⏳',
    badgeColor: 'bg-amber-100 text-amber-800 border border-amber-300',
    isAvailable: false,
    isComingSoon: true,
    chapters: [
      {
        id: 'html-ch-1',
        courseId: 'html',
        chapterNumber: 1,
        title: 'Chapter 1: The Blueprint of the Web',
        conceptName: 'Tags, Document Structure & Headings',
        description: 'Discover how web pages are built from raw tags. Learn opening and closing tags, headings, and paragraphs.',
        realmName: 'Markup Meadow',
        iconName: 'FileCode',
        color: '#E44D26',
        lessons: [
          {
            id: 'html-less-1-1',
            chapterId: 'html-ch-1',
            sequenceOrder: 1,
            title: 'Lesson 1.1: The Genesis Tag',
            subtitle: 'Craft your first <h1> and <p> elements',
            storyIntro: 'Welcome to the world of web craft! In HTML (HyperText Markup Language), tags are the architectural bricks that define every headline, button, and story on the internet.',
            storyIntroHinglish: 'Web development ki duniya me aapka swagat hai! HTML tags wo buniyadi blocks hain jisse internet ki har website banti hai.',
            conceptExplanation: 'Tags in HTML usually come in pairs: an opening tag `<tag>` and a closing tag `</tag>`. The `<h1>` tag defines the main primary heading of a page, while `<p>` defines a paragraph.',
            conceptExplanationHinglish: 'HTML tags jodi me aate hain: opening tag `<tag>` aur closing tag `</tag>`. `<h1>` se main headline banti hai aur `<p>` se paragraph.',
            codeExample: `<h1>The Digital Gurukul</h1>
<p>Begin your interactive coding quest today.</p>`,
            codeExampleExplanation: 'The <h1> creates a large bold headline, and the <p> renders regular body text below it.',
            interactiveTryStarter: `<h1>Adventurer Arya</h1>
<p>Level 1 Coder ready for quests.</p>`,
            tryExplanation: 'Edit the text inside the tags and see the live web preview update instantaneously in your sandbox.',
            xpReward: 30,
            starterHtml: `<!-- Write your first HTML heading and paragraph below: -->
`,
            starterCss: `body {
  font-family: sans-serif;
  padding: 20px;
}`,
            starterJs: `console.log("HTML Sandbox ready!");`,
            exercise: {
              id: 'ex-html-1-1',
              type: 'code',
              title: 'Exercise: Proclaim Your Arrival',
              instructions: 'Create an `<h1>` tag with the text `Welcome to Dronacharya` and a `<p>` tag with `My coding adventure begins now.`',
              prompt: 'Write opening and closing <h1> and <p> tags in the HTML editor.',
              initialCode: `<!-- Write your <h1> and <p> tags below: -->
`,
              solutionCode: `<h1>Welcome to Dronacharya</h1>
<p>My coding adventure begins now.</p>`,
              testCases: [
                {
                  inputDescription: 'Contains an <h1> tag',
                  expectedOutput: '<h1>Welcome to Dronacharya</h1>',
                  codeSnippet: 'tag:h1',
                },
                {
                  inputDescription: 'Contains a <p> tag',
                  expectedOutput: '<p>My coding adventure begins now.</p>',
                  codeSnippet: 'tag:p',
                },
                {
                  inputDescription: 'Heading text includes "Dronacharya"',
                  expectedOutput: 'Dronacharya',
                  codeSnippet: 'text:dronacharya',
                },
              ],
              explanation: 'HTML headings and paragraphs structure page content with semantic readability.',
              hints: [
                'Use <h1> at the top for the title.',
                'Remember closing tags have a forward slash: </h1> and </p>.',
                'Ensure the exact text "Welcome to Dronacharya" is inside the <h1>.',
                'Write: <h1>Welcome to Dronacharya</h1>\\n<p>My coding adventure begins now.</p>',
              ],
              xpReward: 40,
            },
          },
          {
            id: 'html-less-1-2',
            chapterId: 'html-ch-1',
            sequenceOrder: 2,
            title: 'Lesson 1.2: The Heading Hierarchy',
            subtitle: 'Structure subsections using <h2> and <h3>',
            storyIntro: 'Great books have titles, chapters, and sections. HTML provides six levels of headings from <h1> down to <h6> to establish clear information hierarchy.',
            storyIntroHinglish: 'Jaise books me chapters aur sections hote hain, waise hi HTML me <h1> se <h6> tak ke heading levels hote hain.',
            conceptExplanation: '`<h1>` should only be used once per page for the main topic. `<h2>` represents primary sections, and `<h3>` represents subsections.',
            conceptExplanationHinglish: '`<h1>` page ka main title hota hai. `<h2>` bade sections ke liye aur `<h3>` unke andar ke sub-points ke liye use hota hai.',
            codeExample: `<h1>Dronacharya Realm</h1>
<h2>Starter Quests</h2>
<h3>Mission 1: Awakening</h3>
<h3>Mission 2: Navigation</h3>`,
            codeExampleExplanation: 'Notice how each descending heading tag is styled with smaller typography to indicate subordinate rank.',
            interactiveTryStarter: `<h1>My Coding Path</h1>
<h2>Chapter 1</h2>
<h3>Lesson 1</h3>`,
            tryExplanation: 'Observe the visual hierarchy that the browser assigns to each heading rank.',
            xpReward: 30,
            starterHtml: `<h1>Web Architecture</h1>
<!-- Add <h2> and <h3> tags below: -->
`,
            exercise: {
              id: 'ex-html-1-2',
              type: 'code',
              title: 'Exercise: Organize the Quest Ranks',
              instructions: 'Add an `<h2>` tag with `Quest Log` and an `<h3>` tag with `Active Mission: Rover Rescue`.',
              prompt: 'Add an <h2> and an <h3> tag to establish section hierarchy.',
              initialCode: `<h1>Web Architecture</h1>
<!-- Add <h2> and <h3> tags below: -->
`,
              solutionCode: `<h1>Web Architecture</h1>
<h2>Quest Log</h2>
<h3>Active Mission: Rover Rescue</h3>`,
              testCases: [
                {
                  inputDescription: 'Contains an <h2> tag',
                  expectedOutput: '<h2>Quest Log</h2>',
                  codeSnippet: 'tag:h2',
                },
                {
                  inputDescription: 'Contains an <h3> tag',
                  expectedOutput: '<h3>Active Mission: Rover Rescue</h3>',
                  codeSnippet: 'tag:h3',
                },
              ],
              explanation: 'Heading hierarchy helps search engines and screen readers parse content hierarchy.',
              hints: [
                'Write <h2>Quest Log</h2> under the <h1>.',
                'Write <h3>Active Mission: Rover Rescue</h3> under the <h2>.',
                'Always remember to close your tags with </h2> and </h3>.',
                'Code: <h2>Quest Log</h2>\\n<h3>Active Mission: Rover Rescue</h3>',
              ],
              xpReward: 40,
            },
          },
          {
            id: 'html-less-1-3',
            chapterId: 'html-ch-1',
            sequenceOrder: 3,
            title: 'Lesson 1.3: Text Emphasis & Lists',
            subtitle: 'Highlight keywords with <strong>, <em>, and <ul> lists',
            storyIntro: 'Certain words demand urgency, while others provide nuance. HTML gives you semantic tags to emphasize text and group items into organized lists.',
            storyIntroHinglish: 'Kuch words ko highlight karne ke liye HTML me <strong>, <em> aur lists <ul>, <li> use hote hain.',
            conceptExplanation: '`<strong>` makes text bold and marks it as important. `<em>` italicizes text for emphasis. Unordered lists `<ul>` wrap list items `<li>`.',
            conceptExplanationHinglish: '`<strong>` se text bold hota hai aur `<em>` se italic. Bulleted list banane ke liye `<ul>` ke andar `<li>` likhte hain.',
            codeExample: `<p>Warning: <strong>Low Battery</strong> detected.</p>
<ul>
  <li>Recharge Rover Arya</li>
  <li>Collect Solar Core</li>
</ul>`,
            codeExampleExplanation: 'The <strong> tag gives bold urgency, while <ul> and <li> render a bulleted checklist.',
            interactiveTryStarter: `<p>Status: <strong>Online</strong> and <em>Ready</em>.</p>`,
            tryExplanation: 'Try nesting <li> tags inside a <ul> list.',
            xpReward: 30,
            starterHtml: `<h2>Inventory</h2>
<!-- Add strong text and an unordered list with 2 items: -->
`,
            exercise: {
              id: 'ex-html-1-3',
              type: 'code',
              title: 'Exercise: Equip the Explorer Inventory',
              instructions: 'Add a `<p>` containing `<strong>Energy Cell</strong>` and a `<ul>` list with at least two `<li>` items: `Shield` and `Compass`.',
              prompt: 'Use <strong> and <ul> with <li> children.',
              initialCode: `<h2>Inventory</h2>
<!-- Add strong text and an unordered list with 2 items: -->
`,
              solutionCode: `<h2>Inventory</h2>
<p>Equipped: <strong>Energy Cell</strong></p>
<ul>
  <li>Shield</li>
  <li>Compass</li>
</ul>`,
              testCases: [
                {
                  inputDescription: 'Contains <strong> tag',
                  expectedOutput: '<strong>Energy Cell</strong>',
                  codeSnippet: 'tag:strong',
                },
                {
                  inputDescription: 'Contains <ul> list',
                  expectedOutput: '<ul>',
                  codeSnippet: 'tag:ul',
                },
                {
                  inputDescription: 'Contains <li> list items',
                  expectedOutput: '<li>',
                  codeSnippet: 'tag:li',
                },
              ],
              explanation: 'Unordered lists and bold emphasis give clear readability to interactive applications.',
              hints: [
                'Put <strong>Energy Cell</strong> inside a <p> tag.',
                'Open with <ul>, add two <li> items, and close with </ul>.',
                'Make sure each <li> item has a matching </li> closing tag.',
                'Solution: <p><strong>Energy Cell</strong></p>\\n<ul><li>Shield</li><li>Compass</li></ul>',
              ],
              xpReward: 40,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-html-ch-1',
          title: 'Boss Challenge: The Adventurer Bio Page',
          description: 'Construct a complete semantic profile document incorporating headings, paragraphs, strong text, and a gear list.',
          objective: 'Write an <h1>, <h2>, <p> with <strong>, and a <ul> list with 3 <li> items.',
          starterCode: `<!-- Craft your full adventurer bio page: -->
`,
          solutionCode: `<h1>Scholar Arya</h1>
<h2>Explorer Profile</h2>
<p>Currently mastering <strong>HTML</strong> at Dronacharya.</p>
<ul>
  <li>Laser Radar</li>
  <li>Logic Core</li>
  <li>Emergency Beacon</li>
</ul>`,
          testCases: [
            {
              inputDescription: 'Contains <h1> tag',
              expectedOutput: '<h1>',
              codeSnippet: 'tag:h1',
            },
            {
              inputDescription: 'Contains <h2> tag',
              expectedOutput: '<h2>',
              codeSnippet: 'tag:h2',
            },
            {
              inputDescription: 'Contains <strong> tag',
              expectedOutput: '<strong>',
              codeSnippet: 'tag:strong',
            },
            {
              inputDescription: 'Contains <ul> and <li> tags',
              expectedOutput: '<ul><li>',
              codeSnippet: 'tag:li',
            },
          ],
          hints: ['Combine <h1>, <h2>, <p><strong>...</strong></p>, and <ul> with <li> tags.'],
          xpReward: 100,
        },
      },
      {
        id: 'html-ch-2',
        courseId: 'html',
        chapterNumber: 2,
        title: 'Chapter 2: Rich Media & Links',
        conceptName: 'Hyperlinks, Attributes & Imagery',
        description: 'Connect your web page to the wider internet with hyperlinks and visual image assets.',
        realmName: 'Hyperlink Harbor',
        iconName: 'Globe',
        color: '#E44D26',
        lessons: [
          {
            id: 'html-less-2-1',
            chapterId: 'html-ch-2',
            sequenceOrder: 1,
            title: 'Lesson 2.1: The Hyperlink Web',
            subtitle: 'Connect pages using <a href="...">',
            storyIntro: 'The web gets its name from links. The anchor tag `<a>` transforms words into clickable teleportation gates that lead to other realms across the world wide web.',
            storyIntroHinglish: 'Internet ka naam web isliye hai kyunki pages aapas me links se jude hote hain. `<a>` tag se clickable links bante hain.',
            conceptExplanation: 'The anchor tag uses an **attribute** named `href` (Hypertext REFerence) to specify the destination URL. Example: `<a href="https://codedex.io">Codédex</a>`.',
            conceptExplanationHinglish: 'Anchor tag `<a href="...">` me `href` attribute destination URL batata hai. Tag ke beech ka text clickable hota hai.',
            codeExample: `<a href="https://codedex.io">Visit Codédex</a>
<a href="/courses">Explore Dronacharya Courses</a>`,
            codeExampleExplanation: 'When clicked, the browser navigates the student directly to the URL declared in the href attribute.',
            interactiveTryStarter: `<a href="https://google.com">Search the Realm</a>`,
            tryExplanation: 'Try creating a link that points to your favorite website.',
            xpReward: 30,
            starterHtml: `<h2>Portal Directory</h2>
<!-- Add your anchor link below: -->
`,
            exercise: {
              id: 'ex-html-2-1',
              type: 'code',
              title: 'Exercise: Forge a Hyperlink Gateway',
              instructions: 'Create an anchor tag `<a>` with `href="https://codedex.io"` and link text `Journey to Codédex`.',
              prompt: 'Use <a href="...">Journey to Codédex</a>.',
              initialCode: `<h2>Portal Directory</h2>
<!-- Add your anchor link below: -->
`,
              solutionCode: `<h2>Portal Directory</h2>
<a href="https://codedex.io">Journey to Codédex</a>`,
              testCases: [
                {
                  inputDescription: 'Contains an <a> tag',
                  expectedOutput: '<a>',
                  codeSnippet: 'tag:a',
                },
                {
                  inputDescription: 'Anchor tag has href attribute',
                  expectedOutput: 'href',
                  codeSnippet: 'attr:a[href]',
                },
                {
                  inputDescription: 'Contains destination URL',
                  expectedOutput: 'codedex.io',
                  codeSnippet: 'text:codedex.io',
                },
              ],
              explanation: 'Anchor tags with href attributes power the navigational backbone of the internet.',
              hints: [
                'Write <a href="https://codedex.io">Journey to Codédex</a>.',
                'Remember to close the anchor tag with </a>.',
                'Check that the text inside the anchor matches "Journey to Codédex".',
                'Solution: <a href="https://codedex.io">Journey to Codédex</a>',
              ],
              xpReward: 40,
            },
          },
          {
            id: 'html-less-2-2',
            chapterId: 'html-ch-2',
            sequenceOrder: 2,
            title: 'Lesson 2.2: Visual Artifacts & Imagery',
            subtitle: 'Embed graphics with <img src="..." alt="...">',
            storyIntro: 'A picture paints a thousand words. In HTML, the `<img>` tag lets you embed visual images into your pages without needing a closing tag!',
            storyIntroHinglish: 'HTML me `<img>` tag se images add hoti hain. Dhyan rahe ki `<img>` self-closing tag hota hai jisme `</img>` nahi lagta.',
            conceptExplanation: 'The `<img>` tag requires two essential attributes: `src` (source URL of the image) and `alt` (alternative description for accessibility and screen readers).',
            conceptExplanationHinglish: '`<img>` tag me `src` image ka path/URL hota hai aur `alt` visually impaired logo ya slow internet ke liye text description hota hai.',
            codeExample: `<img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400" alt="Cyberpunk Circuit Board" />`,
            codeExampleExplanation: 'Notice that <img> is a self-closing element with no separate closing tag.',
            interactiveTryStarter: `<img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300" alt="Abstract Art" />`,
            tryExplanation: 'Observe how the image loads directly in your live preview sandbox.',
            xpReward: 30,
            starterHtml: `<h2>Artifact Exhibition</h2>
<!-- Embed your image element below: -->
`,
            exercise: {
              id: 'ex-html-2-2',
              type: 'code',
              title: 'Exercise: Project Rover Arya Imagery',
              instructions: 'Add an `<img>` tag with `src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400"` and `alt="Rover Arya Prototype"`.',
              prompt: 'Add an <img> tag with src and alt attributes.',
              initialCode: `<h2>Artifact Exhibition</h2>
<!-- Embed your image element below: -->
`,
              solutionCode: `<h2>Artifact Exhibition</h2>
<img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400" alt="Rover Arya Prototype" />`,
              testCases: [
                {
                  inputDescription: 'Contains an <img> tag',
                  expectedOutput: '<img>',
                  codeSnippet: 'tag:img',
                },
                {
                  inputDescription: 'Image has src attribute',
                  expectedOutput: 'src',
                  codeSnippet: 'attr:img[src]',
                },
                {
                  inputDescription: 'Image has alt attribute',
                  expectedOutput: 'alt',
                  codeSnippet: 'attr:img[alt]',
                },
              ],
              explanation: 'Always provide alt attributes to ensure your websites are accessible to all humans and search crawlers.',
              hints: [
                'Write <img src="..." alt="..." />.',
                'The src attribute should be the Unsplash URL.',
                'The alt attribute should describe the image: "Rover Arya Prototype".',
                'Solution: <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400" alt="Rover Arya Prototype" />',
              ],
              xpReward: 40,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-html-ch-2',
          title: 'Boss Challenge: The Media Showcase',
          description: 'Construct a linked media card with a heading, an image with alt text, a paragraph description, and an anchor link.',
          objective: 'Combine <h2>, <img>, <p>, and <a> with correct attributes.',
          starterCode: `<!-- Build a complete media card: -->
`,
          solutionCode: `<h2>Space Rover Mission</h2>
<img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400" alt="Autonomous Exploration Rover" />
<p>Rover Arya traverses unexplored planetary craters using Python loops.</p>
<a href="https://codedex.io">Learn More at Codédex</a>`,
          testCases: [
            {
              inputDescription: 'Contains <img> with src and alt',
              expectedOutput: 'img[src][alt]',
              codeSnippet: 'attr:img[src]',
            },
            {
              inputDescription: 'Contains <a> with href',
              expectedOutput: 'a[href]',
              codeSnippet: 'attr:a[href]',
            },
          ],
          hints: ['Include both <img> with src & alt, and <a> with href.'],
          xpReward: 100,
        },
      },
      {
        id: 'html-ch-3',
        courseId: 'html',
        chapterNumber: 3,
        title: 'Chapter 3: Semantic Architecture & Capstone',
        conceptName: 'HTML5 Semantic Layout & Portfolio Capstone',
        description: 'Organize pages using semantic landmarks (<header>, <main>, <footer>) and build your first personal portfolio website.',
        realmName: 'Semantic Citadel',
        iconName: 'Layers',
        color: '#E44D26',
        lessons: [
          {
            id: 'html-less-3-1',
            chapterId: 'html-ch-3',
            sequenceOrder: 1,
            title: 'Lesson 3.1: Semantic Realms',
            subtitle: 'Structure pages with <header>, <main>, and <footer>',
            storyIntro: 'Modern websites do not just look good; they have semantic meaning. HTML5 introduces landmark elements that tell browsers, screen readers, and search engines the purpose of every zone.',
            storyIntroHinglish: 'Modern websites me content ko organize karne ke liye semantic tags jaise <header>, <main>, <footer> use hote hain.',
            conceptExplanation: '`<header>` wraps site titles and navigation. `<main>` wraps the primary unique content of the page. `<footer>` contains copyrights, links, and closing author info.',
            conceptExplanationHinglish: '`<header>` me top navigation aur title hota hai, `<main>` me page ka main content, aur `<footer>` me bottom credits aur links.',
            codeExample: `<header>
  <h1>Dronacharya Gurukul</h1>
</header>
<main>
  <p>Main quest contents live here.</p>
</main>
<footer>
  <p>© 2026 Dronacharya Platform</p>
</footer>`,
            codeExampleExplanation: 'Semantic structure improves web accessibility (a11y) and SEO optimization.',
            interactiveTryStarter: `<header><h1>My Site</h1></header>
<main><p>Content</p></main>
<footer><p>End</p></footer>`,
            tryExplanation: 'Preview the semantic layout in your sandbox.',
            xpReward: 30,
            starterHtml: `<!-- Structure your page using <header>, <main>, and <footer>: -->
`,
            exercise: {
              id: 'ex-html-3-1',
              type: 'code',
              title: 'Exercise: Erect the Semantic Pillars',
              instructions: 'Write a page with a `<header>` containing an `<h1>`, a `<main>` containing a `<p>`, and a `<footer>` containing a `<p>`.',
              prompt: 'Use <header>, <main>, and <footer> elements.',
              initialCode: `<!-- Structure your page using <header>, <main>, and <footer>: -->
`,
              solutionCode: `<header>
  <h1>Adventurer Portal</h1>
</header>
<main>
  <p>Exploring HTML architecture.</p>
</main>
<footer>
  <p>© 2026 Dronacharya</p>
</footer>`,
              testCases: [
                {
                  inputDescription: 'Contains <header> tag',
                  expectedOutput: '<header>',
                  codeSnippet: 'tag:header',
                },
                {
                  inputDescription: 'Contains <main> tag',
                  expectedOutput: '<main>',
                  codeSnippet: 'tag:main',
                },
                {
                  inputDescription: 'Contains <footer> tag',
                  expectedOutput: '<footer>',
                  codeSnippet: 'tag:footer',
                },
              ],
              explanation: 'Semantic tags provide meaning to page structure beyond visual appearance.',
              hints: [
                'Wrap the <h1> in a <header> tag.',
                'Wrap the middle <p> in a <main> tag.',
                'Wrap the closing <p> in a <footer> tag.',
                'Solution: <header><h1>...</h1></header>\\n<main><p>...</p></main>\\n<footer><p>...</p></footer>',
              ],
              xpReward: 40,
            },
          },
          {
            id: 'html-less-3-2',
            chapterId: 'html-ch-3',
            sequenceOrder: 2,
            title: 'Lesson 3.2: Capstone: The Adventurer Portfolio',
            subtitle: 'Assemble your complete HTML portfolio website',
            storyIntro: 'You have mastered headings, paragraphs, lists, links, images, and semantic layout! Now, synthesize all your knowledge to assemble your own working developer portfolio website.',
            storyIntroHinglish: 'Aapne headings, paragraphs, lists, links, images aur semantic structure sikh liya! Ab in sabko mila kar apna personal developer portfolio banaiye.',
            conceptExplanation: 'A real web portfolio combines: 1. Header with your name, 2. Bio with your skills, 3. Image artifact, and 4. External link to your GitHub or social profile.',
            conceptExplanationHinglish: 'Ek real portfolio me aapka naam, bio, profile image aur external links hote hain.',
            codeExample: `<header>
  <h1>Aryabhata Sharma</h1>
  <p>Junior Web Developer</p>
</header>
<main>
  <h2>About Me</h2>
  <p>Learning <strong>HTML</strong>, <strong>CSS</strong>, and <strong>JavaScript</strong>.</p>
  <img src="https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=300" alt="Developer Workspace" />
  <h2>Skills</h2>
  <ul>
    <li>HTML5 Semantic Architecture</li>
    <li>Interactive Web Design</li>
  </ul>
</main>
<footer>
  <a href="https://codedex.io">Codédex Profile</a>
</footer>`,
            codeExampleExplanation: 'This is a complete, well-formed HTML document that can be published to the web.',
            interactiveTryStarter: `<h1>My Portfolio</h1>
<p>Developer in training.</p>`,
            tryExplanation: 'Customize the bio, skills list, and links to reflect your own personality.',
            xpReward: 50,
            starterHtml: `<!-- Assemble your Capstone HTML Portfolio: -->
`,
            exercise: {
              id: 'ex-html-3-2',
              type: 'code',
              title: 'Exercise: Mint Your Developer Portfolio',
              instructions: 'Build a complete portfolio with `<header>`, `<main>`, `<h1>`, `<h2>`, `<p>`, `<img>` (with src & alt), and `<a>` (with href).',
              prompt: 'Create a rich semantic portfolio incorporating all core HTML tags.',
              initialCode: `<!-- Assemble your Capstone HTML Portfolio: -->
`,
              solutionCode: `<header>
  <h1>My Coding Portfolio</h1>
</header>
<main>
  <h2>About Me</h2>
  <p>I build <strong>interactive</strong> websites.</p>
  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400" alt="Coding Workspace" />
  <h2>My Quests</h2>
  <ul>
    <li>HTML Mastery</li>
    <li>CSS Layout Design</li>
  </ul>
</main>
<footer>
  <a href="https://codedex.io">Connect on Codédex</a>
</footer>`,
              testCases: [
                {
                  inputDescription: 'Contains <header> and <footer>',
                  expectedOutput: '<header> and <footer>',
                  codeSnippet: 'tag:header',
                },
                {
                  inputDescription: 'Contains <img> with src and alt',
                  expectedOutput: 'img[src][alt]',
                  codeSnippet: 'attr:img[src]',
                },
                {
                  inputDescription: 'Contains <a> with href',
                  expectedOutput: 'a[href]',
                  codeSnippet: 'attr:a[href]',
                },
                {
                  inputDescription: 'Contains <ul> list',
                  expectedOutput: '<ul>',
                  codeSnippet: 'tag:ul',
                },
              ],
              explanation: 'Congratulations! You have completed HTML and forged your first web portfolio.',
              hints: [
                'Include <header>, <main>, and <footer>.',
                'Add an <img> tag with both src and alt attributes.',
                'Add an <a> tag with href pointing to a URL.',
                'Include a <ul> list with <li> skill items.',
              ],
              xpReward: 50,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-html-ch-3',
          title: 'Boss Challenge: The Grand Capstone Portal',
          description: 'Deploy a multi-section web portfolio ready for public showcase.',
          objective: 'Complete the HTML Capstone portfolio.',
          starterCode: `<!-- Deploy your full portfolio: -->`,
          solutionCode: `<h1>Dronacharya Certified Web Developer</h1>`,
          testCases: [
            {
              inputDescription: 'Portfolio completed',
              expectedOutput: 'Certified',
              codeSnippet: 'text:certified',
            },
          ],
          hints: ['Complete all chapters of HTML to claim the HTML Mastery Seal.'],
          xpReward: 150,
        },
      },
    ],
  },

  // =========================================================================
  // 2. CSS 101: Colors & Layouts (ACTIVE)
  // =========================================================================
  {
    id: 'css',
    slug: 'css',
    title: 'CSS: Colors & Layouts',
    language: 'CSS',
    level: 'Beginner',
    tagline: 'Styling & Design: Selectors, Box Model, Flexbox & Grid Systems.',
    description: 'Bring websites to life with colors, typography, modern Box Model mechanics, Flexbox layouts, and CSS Grid responsive galleries.',
    totalChapters: 3,
    totalLessons: 7,
    xpReward: 350,
    iconName: 'Palette',
    badgeText: 'Coming Soon ⏳',
    badgeColor: 'bg-amber-100 text-amber-800 border border-amber-300',
    isAvailable: false,
    isComingSoon: true,
    chapters: [
      {
        id: 'css-ch-1',
        courseId: 'css',
        chapterNumber: 1,
        title: 'Chapter 1: Palette & Typography',
        conceptName: 'Selectors, Colors & Text Styling',
        description: 'Style your HTML elements with vibrant colors, custom fonts, and precise CSS class selectors.',
        realmName: 'Chromatic Valley',
        iconName: 'Palette',
        color: '#264DE4',
        lessons: [
          {
            id: 'css-less-1-1',
            chapterId: 'css-ch-1',
            sequenceOrder: 1,
            title: 'Lesson 1.1: The Style Rune',
            subtitle: 'Apply color and background-color',
            storyIntro: 'Without CSS (Cascading Style Sheets), the web would be black text on stark white paper. CSS lets you paint words with radiant colors and set immersive background ambiances.',
            storyIntroHinglish: 'CSS ke bina web sirf black and white dikhta. CSS se hum colors, backgrounds aur styles apply karte hain.',
            conceptExplanation: 'A CSS rule consists of a **selector** targeting elements and a **declaration block** with `property: value;` pairs. The `color` property sets text color, while `background-color` sets the backing canvas.',
            conceptExplanationHinglish: 'CSS rule me selector hota hai (jaise `h1`) aur brackets ke andar `color: red;` ya `background-color: blue;` likhte hain.',
            codeExample: `h1 {
  color: #6c5ce7;
  background-color: #f3f0ff;
}`,
            codeExampleExplanation: 'This rule makes all <h1> headings purple with a soft lavender backing.',
            interactiveTryStarter: `p {
  color: #d97706;
}`,
            tryExplanation: 'Change the hex color code or try color names like "indigo", "crimson", or "teal".',
            xpReward: 30,
            starterHtml: `<h1>The Digital Gurukul</h1>
<p>Styling the realm with CSS.</p>`,
            starterCss: `/* Write your CSS rules below: */
`,
            exercise: {
              id: 'ex-css-1-1',
              type: 'code',
              title: 'Exercise: Paint the Royal Banner',
              instructions: 'In the CSS tab, style `h1` with `color: purple;` (or `#6c5ce7`) and `background-color: #f3f0ff;` (or lavender).',
              prompt: 'Add color and background-color properties to the h1 selector.',
              initialCode: `/* Style the h1 element below: */
`,
              solutionCode: `h1 {
  color: #6c5ce7;
  background-color: #f3f0ff;
}`,
              testCases: [
                {
                  inputDescription: 'CSS defines color property',
                  expectedOutput: 'color',
                  codeSnippet: 'css:color',
                },
                {
                  inputDescription: 'CSS defines background-color property',
                  expectedOutput: 'background-color',
                  codeSnippet: 'css:background-color',
                },
              ],
              explanation: 'Setting text and background colors creates brand identity and visual comfort.',
              hints: [
                'Target h1 with: h1 { ... }',
                'Inside the brackets, write: color: purple;',
                'Add: background-color: #f3f0ff;',
                'Solution: h1 { color: #6c5ce7; background-color: #f3f0ff; }',
              ],
              xpReward: 40,
            },
          },
          {
            id: 'css-less-1-2',
            chapterId: 'css-ch-1',
            sequenceOrder: 2,
            title: 'Lesson 1.2: Typography & Alignment',
            subtitle: 'Fine-tune font-size, font-family, and text-align',
            storyIntro: 'Words carry meaning, but typography gives them a voice. Adjusting font sizes and alignments makes content readable across any screen size.',
            storyIntroHinglish: 'Typography se text ka look aur readability badhti hai. `font-size` se size aur `text-align: center;` se alignment set hota hai.',
            conceptExplanation: '`font-size` controls text magnitude (e.g. `24px` or `2rem`). `text-align` aligns text (`left`, `center`, `right`). `font-family` chooses the typeface.',
            conceptExplanationHinglish: '`font-size: 20px;` se text bada hota hai aur `text-align: center;` se center me align hota hai.',
            codeExample: `h1 {
  font-size: 32px;
  text-align: center;
  font-family: sans-serif;
}`,
            codeExampleExplanation: 'Centers the heading and sets crisp typography.',
            interactiveTryStarter: `p {
  font-size: 18px;
  text-align: center;
}`,
            tryExplanation: 'Try setting text-align to center.',
            xpReward: 30,
            starterHtml: `<h1>Ancient Codédex</h1>
<p>Readings from the digital archive.</p>`,
            starterCss: `/* Style typography below: */
`,
            exercise: {
              id: 'ex-css-1-2',
              type: 'code',
              title: 'Exercise: Center the Title Archive',
              instructions: 'Style the `h1` element with `text-align: center;` and `font-size: 36px;`.',
              prompt: 'Add text-align: center and font-size: 36px to h1.',
              initialCode: `/* Style typography below: */
h1 {

}
`,
              solutionCode: `h1 {
  text-align: center;
  font-size: 36px;
}`,
              testCases: [
                {
                  inputDescription: 'CSS defines text-align: center',
                  expectedOutput: 'text-align: center',
                  codeSnippet: 'css:text-align',
                },
                {
                  inputDescription: 'CSS defines font-size',
                  expectedOutput: 'font-size',
                  codeSnippet: 'css:font-size',
                },
              ],
              explanation: 'Central alignments and calculated font sizes guide user gaze to primary headlines.',
              hints: [
                'Add text-align: center; inside h1 { }',
                'Add font-size: 36px; inside h1 { }',
                'Remember the semicolon at the end of each CSS declaration.',
                'Solution: h1 { text-align: center; font-size: 36px; }',
              ],
              xpReward: 40,
            },
          },
          {
            id: 'css-less-1-3',
            chapterId: 'css-ch-1',
            sequenceOrder: 3,
            title: 'Lesson 1.3: Class & ID Selectors',
            subtitle: 'Target specific items with .class and #id',
            storyIntro: 'Tag selectors style every single element of that type. To style only specific elements, web craftsmen use **class selectors** prefixed with a dot `.` and unique IDs prefixed with `#`.',
            storyIntroHinglish: 'Agar aapko kisi specific element ko style karna ho, toh HTML me `class="hero"` dete hain aur CSS me `.hero { ... }` likhte hain.',
            conceptExplanation: 'In HTML: `<p class="highlight">Text</p>`. In CSS: `.highlight { color: gold; }`. Classes can be reused on many elements.',
            conceptExplanationHinglish: 'Class selector dot `.` se shuru hota hai jaise `.card`. Isko multiple elements par use kiya ja sakta hai.',
            codeExample: `.card {
  background-color: #ffffff;
  color: #1e1e24;
}
.accent-btn {
  background-color: #6c5ce7;
  color: #ffffff;
}`,
            codeExampleExplanation: 'The dot . specifies that we are styling an HTML element with class="card".',
            interactiveTryStarter: `.badge {
  background-color: #10b981;
  color: white;
}`,
            tryExplanation: 'Create custom classes to style buttons and cards.',
            xpReward: 30,
            starterHtml: `<div class="quest-card">
  <h2>Daily Quest</h2>
  <p>Defeat the Syntax Bug.</p>
</div>`,
            starterCss: `/* Target the .quest-card class below: */
`,
            exercise: {
              id: 'ex-css-1-3',
              type: 'code',
              title: 'Exercise: Craft the Quest Card Class',
              instructions: 'In CSS, target `.quest-card` and give it `background-color: #f8fafc;` and `color: #334155;`.',
              prompt: 'Write a .quest-card class selector in CSS.',
              initialCode: `/* Style the .quest-card class: */
`,
              solutionCode: `.quest-card {
  background-color: #f8fafc;
  color: #334155;
}`,
              testCases: [
                {
                  inputDescription: 'CSS defines .quest-card class',
                  expectedOutput: '.quest-card',
                  codeSnippet: 'css:.quest-card',
                },
                {
                  inputDescription: 'Defines background-color',
                  expectedOutput: 'background-color',
                  codeSnippet: 'css:background-color',
                },
              ],
              explanation: 'Class selectors are the foundation of modular UI components.',
              hints: [
                'Start with a dot: .quest-card {',
                'Add background-color: #f8fafc;',
                'Add color: #334155;',
                'Solution: .quest-card { background-color: #f8fafc; color: #334155; }',
              ],
              xpReward: 40,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-css-ch-1',
          title: 'Boss Challenge: Styled Hero Banner',
          description: 'Style a hero banner with centered typography, custom font-size, and distinct class coloring.',
          objective: 'Define h1 with font-size and text-align, plus a .hero class.',
          starterCode: `/* Craft your hero banner CSS: */
`,
          solutionCode: `h1 {
  font-size: 36px;
  text-align: center;
}
.hero {
  background-color: #6c5ce7;
  color: #ffffff;
}`,
          testCases: [
            {
              inputDescription: 'Includes text-align',
              expectedOutput: 'text-align',
              codeSnippet: 'css:text-align',
            },
            {
              inputDescription: 'Includes .hero selector',
              expectedOutput: '.hero',
              codeSnippet: 'css:.hero',
            },
          ],
          hints: ['Combine h1 { font-size; text-align; } with .hero { background-color; }'],
          xpReward: 100,
        },
      },
      {
        id: 'css-ch-2',
        courseId: 'css',
        chapterNumber: 2,
        title: 'Chapter 2: The Box Model Dimensions',
        conceptName: 'Padding, Borders, Margins & Sizing',
        description: 'Master the universal rule of web spacing: padding on the inside, borders around the perimeter, and margins on the outside.',
        realmName: 'Dimension Dungeon',
        iconName: 'Box',
        color: '#264DE4',
        lessons: [
          {
            id: 'css-less-2-1',
            chapterId: 'css-ch-2',
            sequenceOrder: 1,
            title: 'Lesson 2.1: Padding & Border Shields',
            subtitle: 'Interior breathing room and outline borders',
            storyIntro: 'Every HTML element is a rectangle. The CSS Box Model dictates how content breathes. Padding pushes content away from the inside edge, while borders form the protective perimeter.',
            storyIntroHinglish: 'HTML ka har element ek box/rectangle hota hai. `padding` se andar space banta hai aur `border` se boundary line.',
            conceptExplanation: '`padding: 16px;` creates 16 pixels of space between content and its border. `border: 2px solid #6c5ce7;` sets a 2px colored boundary. `border-radius: 8px;` rounds the corners.',
            conceptExplanationHinglish: '`padding: 20px;` se box ke andar jagah banti hai. `border: 2px solid black;` se border banta hai aur `border-radius` se corners round hote hain.',
            codeExample: `.card {
  padding: 24px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
}`,
            codeExampleExplanation: 'Transforms cramped text into an inviting, polished container card.',
            interactiveTryStarter: `.card {
  padding: 20px;
  border: 3px solid #6c5ce7;
  border-radius: 16px;
}`,
            tryExplanation: 'Play with the border-radius value to see square corners turn smooth and rounded.',
            xpReward: 30,
            starterHtml: `<div class="card">
  <h2>Shield Generator</h2>
  <p>Padding creates protective energy inside the perimeter.</p>
</div>`,
            starterCss: `/* Add padding and border to .card: */
`,
            exercise: {
              id: 'ex-css-2-1',
              type: 'code',
              title: 'Exercise: Shield the Component Card',
              instructions: 'Add `padding: 20px;` and `border: 2px solid #6c5ce7;` to `.card`. Also add `border-radius: 8px;`.',
              prompt: 'Set padding, border, and border-radius on .card.',
              initialCode: `.card {
  /* Add padding, border, and border-radius below: */

}
`,
              solutionCode: `.card {
  padding: 20px;
  border: 2px solid #6c5ce7;
  border-radius: 8px;
}`,
              testCases: [
                {
                  inputDescription: 'CSS defines padding',
                  expectedOutput: 'padding',
                  codeSnippet: 'css:padding',
                },
                {
                  inputDescription: 'CSS defines border',
                  expectedOutput: 'border',
                  codeSnippet: 'css:border',
                },
                {
                  inputDescription: 'CSS defines border-radius',
                  expectedOutput: 'border-radius',
                  codeSnippet: 'css:border-radius',
                },
              ],
              explanation: 'Padding prevents text from colliding against edges, and rounded borders create modern aesthetics.',
              hints: [
                'Write padding: 20px; inside .card { }',
                'Add border: 2px solid #6c5ce7;',
                'Add border-radius: 8px;',
                'Solution: .card { padding: 20px; border: 2px solid #6c5ce7; border-radius: 8px; }',
              ],
              xpReward: 40,
            },
          },
          {
            id: 'css-less-2-2',
            chapterId: 'css-ch-2',
            sequenceOrder: 2,
            title: 'Lesson 2.2: Margins & Spacing',
            subtitle: 'External separation and margin: auto centering',
            storyIntro: 'While padding breathes inside, **margin** controls the outside territory. Margin pushes neighboring boxes away and can automatically center containers on the screen.',
            storyIntroHinglish: '`margin` box ke bahar space banata hai taaki do elements aapas me chipke na. `margin: 0 auto;` se box center ho jata hai.',
            conceptExplanation: '`margin-bottom: 16px;` pushes elements below. `margin: 0 auto;` combined with a `max-width` centers a card horizontally in its parent container.',
            conceptExplanationHinglish: '`margin-bottom: 20px;` se neeche space banta hai. Aur `max-width: 500px; margin: auto;` se card screen ke beech me center ho jata hai.',
            codeExample: `.container {
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 24px;
}`,
            codeExampleExplanation: 'This pattern is the universal standard for centering website pages and blog posts.',
            interactiveTryStarter: `.container {
  max-width: 400px;
  margin: auto;
}`,
            tryExplanation: 'Observe how margin: auto calculates equal empty space on both sides.',
            xpReward: 30,
            starterHtml: `<div class="container">
  <h1>Centering Magic</h1>
  <p>Centered cleanly using margin auto.</p>
</div>`,
            starterCss: `/* Add margin and max-width below: */
`,
            exercise: {
              id: 'ex-css-2-2',
              type: 'code',
              title: 'Exercise: Center the Royal Scroll',
              instructions: 'Add `max-width: 500px;` and `margin: 0 auto;` (or `margin: auto;`) to `.container`.',
              prompt: 'Center the .container using margin auto and max-width.',
              initialCode: `.container {
  /* Center this container: */

}
`,
              solutionCode: `.container {
  max-width: 500px;
  margin: 0 auto;
}`,
              testCases: [
                {
                  inputDescription: 'CSS defines margin',
                  expectedOutput: 'margin',
                  codeSnippet: 'css:margin',
                },
                {
                  inputDescription: 'CSS defines max-width',
                  expectedOutput: 'max-width',
                  codeSnippet: 'css:max-width',
                },
              ],
              explanation: 'Margin auto dynamically balances available horizontal space.',
              hints: [
                'Add max-width: 500px; inside .container { }',
                'Add margin: 0 auto; to center horizontally.',
                'Solution: .container { max-width: 500px; margin: 0 auto; }',
              ],
              xpReward: 40,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-css-ch-2',
          title: 'Boss Challenge: Pixel-Perfect Card',
          description: 'Construct a complete component card with max-width, auto margin centering, interior padding, and border radius.',
          objective: 'Define padding, border, border-radius, and margin: auto.',
          starterCode: `/* Box Model Boss Challenge: */
`,
          solutionCode: `.box-card {
  max-width: 450px;
  margin: 20px auto;
  padding: 24px;
  border: 2px solid #1e1e24;
  border-radius: 12px;
}`,
          testCases: [
            {
              inputDescription: 'Includes padding',
              expectedOutput: 'padding',
              codeSnippet: 'css:padding',
            },
            {
              inputDescription: 'Includes margin',
              expectedOutput: 'margin',
              codeSnippet: 'css:margin',
            },
            {
              inputDescription: 'Includes border',
              expectedOutput: 'border',
              codeSnippet: 'css:border',
            },
          ],
          hints: ['Combine padding, border, border-radius, and margin in .box-card.'],
          xpReward: 100,
        },
      },
      {
        id: 'css-ch-3',
        courseId: 'css',
        chapterNumber: 3,
        title: 'Chapter 3: Modern Layout Architectures',
        conceptName: 'Flexbox Navigation & CSS Grid Systems',
        description: 'Arrange modern multi-column web layouts with ease using CSS Flexbox and responsive 2D Grid systems.',
        realmName: 'Flexbox Fortress',
        iconName: 'Layout',
        color: '#264DE4',
        lessons: [
          {
            id: 'css-less-3-1',
            chapterId: 'css-ch-3',
            sequenceOrder: 1,
            title: 'Lesson 3.1: Flexbox Navigation Bar',
            subtitle: 'display: flex, justify-content, and align-items',
            storyIntro: 'In the past, aligning items side by side in CSS was agonizing. CSS Flexbox (Flexible Box Layout) changed the world forever by making 1-dimensional layouts effortless.',
            storyIntroHinglish: 'CSS Flexbox se items ko ek line me horizontally ya vertically arrange karna bohot aasan ho gaya hai.',
            conceptExplanation: 'Setting `display: flex;` turns any element into a flex container. `justify-content: space-between;` spaces items across the row, and `align-items: center;` vertically centers them.',
            conceptExplanationHinglish: '`display: flex;` se items side-by-side aate hain. `justify-content: space-between;` se items ke beech space failta hai aur `align-items: center;` se vertically center hote hain.',
            codeExample: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}`,
            codeExampleExplanation: 'The industry-standard recipe for headers, top navigation bars, and button groups.',
            interactiveTryStarter: `.nav {
  display: flex;
  gap: 16px;
}`,
            tryExplanation: 'Try adding gap: 16px; to cleanly space flex items apart.',
            xpReward: 30,
            starterHtml: `<nav class="navbar">
  <div class="logo"><strong>Dronacharya</strong></div>
  <div class="links"><span>Quests</span> <span>Profile</span></div>
</nav>`,
            starterCss: `/* Make .navbar a flex container: */
`,
            exercise: {
              id: 'ex-css-3-1',
              type: 'code',
              title: 'Exercise: Align the Top Navigation Bar',
              instructions: 'Give `.navbar` `display: flex;`, `justify-content: space-between;`, and `align-items: center;`.',
              prompt: 'Use display: flex and justify-content: space-between on .navbar.',
              initialCode: `.navbar {
  /* Add Flexbox properties below: */

}
`,
              solutionCode: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`,
              testCases: [
                {
                  inputDescription: 'CSS defines display: flex',
                  expectedOutput: 'display: flex',
                  codeSnippet: 'css:display: flex',
                },
                {
                  inputDescription: 'CSS defines justify-content',
                  expectedOutput: 'justify-content',
                  codeSnippet: 'css:justify-content',
                },
              ],
              explanation: 'Flexbox solves horizontal spacing and vertical centering in modern web interfaces.',
              hints: [
                'Add display: flex; inside .navbar { }',
                'Add justify-content: space-between;',
                'Add align-items: center;',
                'Solution: .navbar { display: flex; justify-content: space-between; align-items: center; }',
              ],
              xpReward: 40,
            },
          },
          {
            id: 'css-less-3-2',
            chapterId: 'css-ch-3',
            sequenceOrder: 2,
            title: 'Lesson 3.2: CSS Grid Quest Gallery',
            subtitle: 'display: grid and grid-template-columns',
            storyIntro: 'While Flexbox rules 1-dimensional rows, **CSS Grid** is the master of 2-dimensional grids with both rows and columns simultaneously. Perfect for project cards, image galleries, and dashboards.',
            storyIntroHinglish: 'Flexbox 1D ke liye hota hai, jabki **CSS Grid** 2D layouts (rows aur columns dono) ke liye best hai jaise image galleries aur dashboard cards.',
            conceptExplanation: '`display: grid;` activates Grid. `grid-template-columns: repeat(3, 1fr);` creates 3 equal-width columns. `gap: 20px;` spaces every cell evenly.',
            conceptExplanationHinglish: '`display: grid;` lagane ke baad `grid-template-columns: repeat(2, 1fr);` se do barabar columns bante hain.',
            codeExample: `.grid-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}`,
            codeExampleExplanation: 'Creates a clean two-column card gallery with automatic column wrapping.',
            interactiveTryStarter: `.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}`,
            tryExplanation: 'Preview how the cards organize into side-by-side columns.',
            xpReward: 50,
            starterHtml: `<div class="quest-grid">
  <div class="item">Quest 1: Loops</div>
  <div class="item">Quest 2: Variables</div>
  <div class="item">Quest 3: Functions</div>
  <div class="item">Quest 4: DOM Magic</div>
</div>`,
            starterCss: `/* Build a 2-column grid layout below: */
`,
            exercise: {
              id: 'ex-css-3-2',
              type: 'code',
              title: 'Exercise: Form the Quest Matrix Grid',
              instructions: 'Give `.quest-grid` `display: grid;`, `grid-template-columns: repeat(2, 1fr);` (or `1fr 1fr;`), and `gap: 16px;`.',
              prompt: 'Configure display: grid, grid-template-columns, and gap.',
              initialCode: `.quest-grid {
  /* Set up the 2-column grid: */

}
`,
              solutionCode: `.quest-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}`,
              testCases: [
                {
                  inputDescription: 'CSS defines display: grid',
                  expectedOutput: 'display: grid',
                  codeSnippet: 'css:display: grid',
                },
                {
                  inputDescription: 'CSS defines grid-template-columns',
                  expectedOutput: 'grid-template-columns',
                  codeSnippet: 'css:grid-template-columns',
                },
                {
                  inputDescription: 'CSS defines gap',
                  expectedOutput: 'gap',
                  codeSnippet: 'css:gap',
                },
              ],
              explanation: 'CSS Grid creates fluid multi-column responsive galleries with clean geometry.',
              hints: [
                'Add display: grid; inside .quest-grid { }',
                'Add grid-template-columns: repeat(2, 1fr);',
                'Add gap: 16px;',
                'Solution: .quest-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }',
              ],
              xpReward: 50,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-css-ch-3',
          title: 'Boss Challenge: The Responsive Realm Hub',
          description: 'Deploy a full responsive interface combining Flexbox header navigation and a CSS Grid project gallery.',
          objective: 'Define display: flex and display: grid in the same style sheet.',
          starterCode: `/* Combine Flexbox and Grid: */
`,
          solutionCode: `.nav { display: flex; justify-content: space-between; }
.gallery { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }`,
          testCases: [
            {
              inputDescription: 'Defines display: flex',
              expectedOutput: 'display: flex',
              codeSnippet: 'css:display: flex',
            },
            {
              inputDescription: 'Defines display: grid',
              expectedOutput: 'display: grid',
              codeSnippet: 'css:display: grid',
            },
          ],
          hints: ['Use display: flex for the navigation and display: grid for the gallery.'],
          xpReward: 150,
        },
      },
    ],
  },

  // =========================================================================
  // 3. JAVASCRIPT 101: Interactive Web (ACTIVE)
  // =========================================================================
  {
    id: 'javascript',
    slug: 'javascript',
    title: 'JavaScript: Interactive Web',
    language: 'JavaScript',
    level: 'Beginner',
    tagline: 'Interactivity & Logic: Variables, Conditionals, DOM & Events.',
    description: 'Master the programming language of the browser. Create dynamic user interactions, manipulate the DOM, and control game logic.',
    totalChapters: 3,
    totalLessons: 7,
    xpReward: 350,
    iconName: 'Code2',
    badgeText: 'Coming Soon ⏳',
    badgeColor: 'bg-amber-100 text-amber-800 border border-amber-300',
    isAvailable: false,
    isComingSoon: true,
    chapters: [
      {
        id: 'js-ch-1',
        courseId: 'javascript',
        chapterNumber: 1,
        title: 'Chapter 1: Variables & Data Runes',
        conceptName: 'Console Output, Variables & Arithmetic',
        description: 'Wake up the browser engine. Inscribe messages with console.log, store numbers and text in variables, and run calculations.',
        realmName: 'Variable Vaults',
        iconName: 'Code2',
        color: '#F7DF1E',
        lessons: [
          {
            id: 'js-less-1-1',
            chapterId: 'js-ch-1',
            sequenceOrder: 1,
            title: 'Lesson 1.1: Console Inscription',
            subtitle: 'Broadcast output with console.log()',
            storyIntro: 'Every developer begins their journey by speaking to the machine. In JavaScript, `console.log()` is your voice to output messages, test logic, and inspect program state.',
            storyIntroHinglish: 'JavaScript me computer ya browser console me message dikhane ke liye hum `console.log()` use karte hain.',
            conceptExplanation: '`console.log("Hello, World!");` writes text to the developer console. Text inside quotes is a String. Statements end with a semicolon `;`.',
            conceptExplanationHinglish: '`console.log("Hello!");` console par message print karta hai. Quotes me likhi hui cheez String hoti hai.',
            codeExample: `console.log("Welcome to Dronacharya!");
console.log(2026);`,
            codeExampleExplanation: 'Line 1 outputs a text greeting; line 2 outputs the numeric year 2026.',
            interactiveTryStarter: `console.log("Player Arya online.");`,
            tryExplanation: 'Run code and watch the console output tab below capture your transmission.',
            xpReward: 30,
            starterHtml: `<h1>JavaScript Console Lab</h1>`,
            starterCss: `body { font-family: sans-serif; }`,
            starterJs: `// Transmit your console message below:
`,
            exercise: {
              id: 'ex-js-1-1',
              type: 'code',
              title: 'Exercise: Broadcast the Activation Beacon',
              instructions: 'Write a statement that outputs `Beacon Online` using `console.log()`.',
              prompt: 'Call console.log("Beacon Online"); in the JS editor.',
              initialCode: `// Write your console.log statement below:
`,
              solutionCode: `console.log("Beacon Online");`,
              testCases: [
                {
                  inputDescription: 'Console outputs "Beacon Online"',
                  expectedOutput: 'Beacon Online',
                  codeSnippet: 'stdout:Beacon Online',
                },
              ],
              explanation: 'console.log transmits strings and values directly to the stdout debug stream.',
              hints: [
                'Type console.log("...");',
                'Put the exact text "Beacon Online" inside quotes.',
                'Remember closing parenthesis and semicolon: );',
                'Solution: console.log("Beacon Online");',
              ],
              xpReward: 40,
            },
          },
          {
            id: 'js-less-1-2',
            chapterId: 'js-ch-1',
            sequenceOrder: 2,
            title: 'Lesson 1.2: Variable Vaults',
            subtitle: 'Store information using let and const',
            storyIntro: 'Programs need to remember data: player scores, health points, and usernames. In JavaScript, we declare variable vaults using `let` (changeable) and `const` (constant).',
            storyIntroHinglish: 'Data store karne ke liye variables use hote hain. `let` ki value badal sakti hai, jabki `const` fixed rehta hai.',
            conceptExplanation: 'Use `const` for values that never change (like gravity or max hearts), and `let` for values that change (like current score or battery).',
            conceptExplanationHinglish: '`const playerName = "Arya";` fixed rehta hai. `let score = 0;` badalta rehta hai.',
            codeExample: `const roverName = "Arya";
let batteryLevel = 100;
batteryLevel = batteryLevel - 10;
console.log(roverName, batteryLevel);`,
            codeExampleExplanation: 'Declares a constant name and a mutable battery variable that decrements by 10.',
            interactiveTryStarter: `let xp = 50;
xp = xp + 25;
console.log("Current XP:", xp);`,
            tryExplanation: 'Run this to see the variable recalculate its value.',
            xpReward: 30,
            starterHtml: `<h2>Variable Storage</h2>`,
            starterJs: `// Declare variables below:
`,
            exercise: {
              id: 'ex-js-1-2',
              type: 'code',
              title: 'Exercise: Store Player Status',
              instructions: 'Declare a `const playerName = "Arya";` and `let hearts = 5;`. Then output both using `console.log(playerName, hearts);`.',
              prompt: 'Use const and let to declare variables, then console.log them.',
              initialCode: `// Declare playerName and hearts below:
`,
              solutionCode: `const playerName = "Arya";
let hearts = 5;
console.log(playerName, hearts);`,
              testCases: [
                {
                  inputDescription: 'Outputs playerName and hearts',
                  expectedOutput: 'Arya 5',
                  codeSnippet: 'stdout:Arya 5',
                },
                {
                  inputDescription: 'Contains const keyword',
                  expectedOutput: 'const',
                  codeSnippet: 'code:const',
                },
                {
                  inputDescription: 'Contains let keyword',
                  expectedOutput: 'let',
                  codeSnippet: 'code:let',
                },
              ],
              explanation: 'const protects immutable values while let allows state evolution over time.',
              hints: [
                'Write const playerName = "Arya";',
                'Write let hearts = 5;',
                'Print with console.log(playerName, hearts);',
                'Solution: const playerName = "Arya";\\nlet hearts = 5;\\nconsole.log(playerName, hearts);',
              ],
              xpReward: 40,
            },
          },
          {
            id: 'js-less-1-3',
            chapterId: 'js-ch-1',
            sequenceOrder: 3,
            title: 'Lesson 1.3: String Interpolation & Math',
            subtitle: 'Template literals with backticks \`\${variable}\`',
            storyIntro: 'Old JavaScript required awkward plus `+` signs to glue text and numbers together. Modern ES6 JavaScript gives you template literals with backticks \` to seamlessly inject values.',
            storyIntroHinglish: 'Template literals me backticks \` ke andar \`\${variable}\` likh kar text aur variables ko aasan tarike se jodte hain.',
            conceptExplanation: 'Wrap text in backticks \`...\` and embed expressions inside `\${expression}`. Example: `\`Score: \${score + 10} points\``. Arithmetic operators include `+`, `-`, `*`, and `/`.',
            conceptExplanationHinglish: 'Backticks \` ke andar \`\${score}\` likhne se string interpolation banta hai.',
            codeExample: `const player = "Arya";
const level = 2;
console.log(\`Adventurer \${player} has unlocked Level \${level}!\`);`,
            codeExampleExplanation: 'The \${player} and \${level} expressions evaluate automatically inside the backtick string.',
            interactiveTryStarter: `const a = 10;
const b = 5;
console.log(\`Total: \${a + b}\`);`,
            tryExplanation: 'Try arithmetic expressions like \${a * b} inside template literals.',
            xpReward: 30,
            starterHtml: `<h2>Template String Foundry</h2>`,
            starterJs: `// Practice template literals below:
`,
            exercise: {
              id: 'ex-js-1-3',
              type: 'code',
              title: 'Exercise: Announce Mission Stats',
              instructions: 'Given `const mission = "Loop Lab";` and `const xp = 150;`, log the exact string: `Mission Loop Lab rewards 150 XP` using a template literal.',
              prompt: 'Use backtick template literals `Mission ${mission} rewards ${xp} XP`.',
              initialCode: `const mission = "Loop Lab";
const xp = 150;
// Log the string below:
`,
              solutionCode: `const mission = "Loop Lab";
const xp = 150;
console.log(\`Mission \${mission} rewards \${xp} XP\`);`,
              testCases: [
                {
                  inputDescription: 'Outputs "Mission Loop Lab rewards 150 XP"',
                  expectedOutput: 'Mission Loop Lab rewards 150 XP',
                  codeSnippet: 'stdout:Mission Loop Lab rewards 150 XP',
                },
              ],
              explanation: 'Template literals make dynamic strings readable and clean.',
              hints: [
                'Use backticks \` instead of single quotes \'.',
                'Embed variables with \${mission} and \${xp}.',
                'Solution: console.log(\`Mission \${mission} rewards \${xp} XP\`);',
              ],
              xpReward: 40,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-js-ch-1',
          title: 'Boss Challenge: Stat Tracker Calculator',
          description: 'Calculate remaining battery life after a high-speed rover boost and print the formatted telemetry log.',
          objective: 'Declare initial battery, subtract consumption, and output using template literals.',
          starterCode: `// Calculate remaining battery:
let battery = 100;
const boostCost = 35;
`,
          solutionCode: `let battery = 100;
const boostCost = 35;
battery = battery - boostCost;
console.log(\`Remaining Battery: \${battery}%\`);`,
          testCases: [
            {
              inputDescription: 'Calculates 65% remaining battery',
              expectedOutput: 'Remaining Battery: 65%',
              codeSnippet: 'stdout:Remaining Battery: 65%',
            },
          ],
          hints: ['Subtract boostCost from battery and log `Remaining Battery: ${battery}%`.'],
          xpReward: 100,
        },
      },
      {
        id: 'js-ch-2',
        courseId: 'javascript',
        chapterNumber: 2,
        title: 'Chapter 2: Decision Trees & Functions',
        conceptName: 'Branching Conditions & Reusable Functions',
        description: 'Give programs the power to make choices using if/else conditions, and bundle reusable logic into functions.',
        realmName: 'Logic Labyrinth',
        iconName: 'Cpu',
        color: '#F7DF1E',
        lessons: [
          {
            id: 'js-less-2-1',
            chapterId: 'js-ch-2',
            sequenceOrder: 1,
            title: 'Lesson 2.1: Conditional Branching',
            subtitle: 'Make choices with if, else if, and else',
            storyIntro: 'An autonomous rover must decide: Is battery above 20%? If yes, continue exploring. If no, trigger the emergency solar recharge mode. That is conditional logic.',
            storyIntroHinglish: 'Jab program ko decision lena hota hai ki kya battery 20 se zyada hai, toh hum `if` aur `else` use karte hain.',
            conceptExplanation: '`if (condition) { ... } else { ... }`. Comparison operators include `>` (greater than), `<` (less than), `===` (strictly equal), and `>=` (greater than or equal).',
            conceptExplanationHinglish: '`if (battery > 20) { ... } else { ... }` se conditions check hoti hain.',
            codeExample: `let battery = 15;
if (battery > 20) {
  console.log("Systems Nominal");
} else {
  console.log("Emergency Recharge Mode");
}`,
            codeExampleExplanation: 'Since 15 is not greater than 20, the code inside the else block executes.',
            interactiveTryStarter: `let score = 85;
if (score >= 80) {
  console.log("Mastery Unlocked!");
}`,
            tryExplanation: 'Change score to 50 and observe that the condition does not fire.',
            xpReward: 30,
            starterHtml: `<h2>Decision Matrix</h2>`,
            starterJs: `// Write your if/else statement below:
`,
            exercise: {
              id: 'ex-js-2-1',
              type: 'code',
              title: 'Exercise: Verify Battery Threshold',
              instructions: 'Given `let power = 45;`, write an `if (power >= 50)` check that logs `Propulsion Active`, else logs `Low Power Alert`.',
              prompt: 'Implement an if/else conditional branch checking power >= 50.',
              initialCode: `let power = 45;
// Write your if / else check below:
`,
              solutionCode: `let power = 45;
if (power >= 50) {
  console.log("Propulsion Active");
} else {
  console.log("Low Power Alert");
}`,
              testCases: [
                {
                  inputDescription: 'Outputs "Low Power Alert" for power = 45',
                  expectedOutput: 'Low Power Alert',
                  codeSnippet: 'stdout:Low Power Alert',
                },
                {
                  inputDescription: 'Contains if keyword',
                  expectedOutput: 'if',
                  codeSnippet: 'code:if',
                },
                {
                  inputDescription: 'Contains else keyword',
                  expectedOutput: 'else',
                  codeSnippet: 'code:else',
                },
              ],
              explanation: 'Conditionals allow programs to react dynamically to variable environmental conditions.',
              hints: [
                'Write if (power >= 50) { console.log("Propulsion Active"); }',
                'Follow with else { console.log("Low Power Alert"); }',
                'Solution: if (power >= 50) { console.log("Propulsion Active"); } else { console.log("Low Power Alert"); }',
              ],
              xpReward: 40,
            },
          },
          {
            id: 'js-less-2-2',
            chapterId: 'js-ch-2',
            sequenceOrder: 2,
            title: 'Lesson 2.2: Reusable Spell Functions',
            subtitle: 'Package logic with parameters and return values',
            storyIntro: 'Writing the same calculations over and over is exhausting. In programming, **Functions** are reusable spellbooks: you define the algorithm once, then call it whenever needed with different inputs!',
            storyIntroHinglish: 'Functions code ko reuse karne ke liye banaye jaate hain. Ek baar function banao aur usse baar-baar alag values ke sath call karo.',
            conceptExplanation: '`function calculateXP(missions, bonus) { return (missions * 50) + bonus; }`. You call it with arguments: `const total = calculateXP(3, 20);`. The `return` keyword passes the result back.',
            conceptExplanationHinglish: '`function add(a, b) { return a + b; }` me `return` result wapas bhejta hai.',
            codeExample: `function calculateTotalXP(lessonsCount, questBonus) {
  return (lessonsCount * 30) + questBonus;
}

const finalScore = calculateTotalXP(4, 50);
console.log("Total Earned XP:", finalScore);`,
            codeExampleExplanation: 'Calculates (4 * 30) + 50 = 170 and logs the total.',
            interactiveTryStarter: `function greet(name) {
  return \`Namaste, \${name}!\`;
}
console.log(greet("Arya"));`,
            tryExplanation: 'Try passing your own name into the greet function.',
            xpReward: 30,
            starterHtml: `<h2>Function Workshop</h2>`,
            starterJs: `// Define your reusable function below:
`,
            exercise: {
              id: 'ex-js-2-2',
              type: 'code',
              title: 'Exercise: Forge the Health Shield Function',
              instructions: 'Write a function named `repairShield(current, boost)` that returns `current + boost`. Call it with `(60, 25)` and log the returned result.',
              prompt: 'Define function repairShield(current, boost) and return the sum.',
              initialCode: `// Define repairShield function:

// Call repairShield(60, 25) and log it:
`,
              solutionCode: `function repairShield(current, boost) {
  return current + boost;
}
console.log(repairShield(60, 25));`,
              testCases: [
                {
                  inputDescription: 'Calculates 85 from repairShield(60, 25)',
                  expectedOutput: '85',
                  codeSnippet: 'stdout:85',
                },
                {
                  inputDescription: 'Contains function declaration',
                  expectedOutput: 'function repairShield',
                  codeSnippet: 'code:function repairShield',
                },
              ],
              explanation: 'Functions accept parameter inputs and return calculated outputs.',
              hints: [
                'Define: function repairShield(current, boost) { return current + boost; }',
                'Call it inside console.log: console.log(repairShield(60, 25));',
                'Solution: function repairShield(current, boost) { return current + boost; }\\nconsole.log(repairShield(60, 25));',
              ],
              xpReward: 40,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-js-ch-2',
          title: 'Boss Challenge: Combat Power Decider',
          description: 'Build a function canDefeatBoss(playerPower, bossShield) that returns true if playerPower > bossShield, else false.',
          objective: 'Define function with conditional return boolean.',
          starterCode: `// Combat Decider function:
function canDefeatBoss(playerPower, bossShield) {

}
console.log(canDefeatBoss(120, 100));
`,
          solutionCode: `function canDefeatBoss(playerPower, bossShield) {
  return playerPower > bossShield;
}
console.log(canDefeatBoss(120, 100));`,
          testCases: [
            {
              inputDescription: 'Returns true for 120 vs 100',
              expectedOutput: 'true',
              codeSnippet: 'stdout:true',
            },
          ],
          hints: ['Return playerPower > bossShield; inside the function.'],
          xpReward: 100,
        },
      },
      {
        id: 'js-ch-3',
        courseId: 'javascript',
        chapterNumber: 3,
        title: 'Chapter 3: Dynamic DOM Magic',
        conceptName: 'DOM Selection & Interactive Click Events',
        description: 'Connect JavaScript directly to HTML and CSS. Select elements, alter text dynamically, and react to live user button clicks.',
        realmName: 'Interactive Citadel',
        iconName: 'Zap',
        color: '#F7DF1E',
        lessons: [
          {
            id: 'js-less-3-1',
            chapterId: 'js-ch-3',
            sequenceOrder: 1,
            title: 'Lesson 3.1: Selecting Elements with querySelector',
            subtitle: 'Find HTML elements and change their text',
            storyIntro: 'The DOM (Document Object Model) is the bridge between JavaScript and HTML. Using `document.querySelector`, JavaScript can reach into the page, grab any element, and change its text on the fly!',
            storyIntroHinglish: 'DOM wo bridge hai jisse JavaScript HTML elements ko select karke unka text aur color badal sakti hai.',
            conceptExplanation: '`document.querySelector("#title")` finds the element with id="title". Then `element.textContent = "New Text";` updates what users see on screen.',
            conceptExplanationHinglish: '`const el = document.querySelector("#title");` se element milta hai aur `el.textContent = "Naya Text";` se text change hota hai.',
            codeExample: `const titleEl = document.querySelector("#status");
titleEl.textContent = "Rover Arya Online";
console.log("Updated status text successfully.");`,
            codeExampleExplanation: 'Directly mutates the rendered DOM tree in real time.',
            interactiveTryStarter: `const btn = document.querySelector("button");
console.log("Found button in DOM:", btn !== null);`,
            tryExplanation: 'Inspect elements using querySelector in your sandbox.',
            xpReward: 30,
            starterHtml: `<h1 id="headline">Original Headline</h1>
<p id="counter">0</p>`,
            starterCss: `body { font-family: sans-serif; padding: 20px; }`,
            starterJs: `// Select #headline and change textContent:
`,
            exercise: {
              id: 'ex-js-3-1',
              type: 'code',
              title: 'Exercise: Transform the Headline Inscription',
              instructions: 'Use `document.querySelector("#headline")` to select the element and set its `textContent = "Codédex Realm Activated";`.',
              prompt: 'Select #headline and set its textContent.',
              initialCode: `// Select #headline and update textContent:
`,
              solutionCode: `const heading = document.querySelector("#headline");
heading.textContent = "Codédex Realm Activated";`,
              testCases: [
                {
                  inputDescription: 'Headline text updated to "Codédex Realm Activated"',
                  expectedOutput: 'Codédex Realm Activated',
                  codeSnippet: 'text:codédex realm activated',
                },
                {
                  inputDescription: 'Uses querySelector',
                  expectedOutput: 'querySelector',
                  codeSnippet: 'code:querySelector',
                },
              ],
              explanation: 'querySelector gives JavaScript complete programmatic control over rendered HTML.',
              hints: [
                'Write: const heading = document.querySelector("#headline");',
                'Set heading.textContent = "Codédex Realm Activated";',
                'Solution: document.querySelector("#headline").textContent = "Codédex Realm Activated";',
              ],
              xpReward: 40,
            },
          },
          {
            id: 'js-less-3-2',
            chapterId: 'js-ch-3',
            sequenceOrder: 2,
            title: 'Lesson 3.2: Event Listeners & Interactive Magic',
            subtitle: 'Listen for click events with addEventListener',
            storyIntro: 'Websites become apps when they respond to user intent. By attaching an **event listener**, your code waits silently until the user clicks a button, then triggers your magic function!',
            storyIntroHinglish: '`addEventListener("click", ...)` se button click hone par specific function chalta hai.',
            conceptExplanation: '`button.addEventListener("click", function() { ... });`. Every time the user clicks, the callback executes, enabling games, calculators, and modals.',
            conceptExplanationHinglish: 'Button par event listener lagane se har click par code execute hota hai.',
            codeExample: `const button = document.querySelector("#click-btn");
const output = document.querySelector("#result");

button.addEventListener("click", () => {
  output.textContent = "Mission Launched!";
  console.log("Button clicked!");
});`,
            codeExampleExplanation: 'Listens for click events and updates the result text on every user click.',
            interactiveTryStarter: `const btn = document.querySelector("#btn");
btn.addEventListener("click", () => {
  console.log("Clicked!");
});`,
            tryExplanation: 'Click the button in the live preview to trigger the event listener.',
            xpReward: 50,
            starterHtml: `<button id="boost-btn">Engage Boost</button>
<p id="boost-status">Idle</p>`,
            starterCss: `button { padding: 10px 16px; background: #6c5ce7; color: white; border: none; border-radius: 8px; cursor: pointer; }`,
            starterJs: `// Attach click event listener below:
`,
            exercise: {
              id: 'ex-js-3-2',
              type: 'code',
              title: 'Exercise: Ignite the Booster Click Event',
              instructions: 'Select `#boost-btn` and attach an `addEventListener("click", ...)` that updates `#boost-status.textContent = "Booster Online";` and logs `Booster Active`.',
              prompt: 'Attach click event listener to #boost-btn.',
              initialCode: `// Select #boost-btn and attach click listener:
const btn = document.querySelector("#boost-btn");
const statusEl = document.querySelector("#boost-status");

btn.addEventListener("click", () => {
  // Update statusEl.textContent and log message:

});
`,
              solutionCode: `const btn = document.querySelector("#boost-btn");
const statusEl = document.querySelector("#boost-status");

btn.addEventListener("click", () => {
  statusEl.textContent = "Booster Online";
  console.log("Booster Active");
});`,
              testCases: [
                {
                  inputDescription: 'Contains addEventListener("click")',
                  expectedOutput: 'addEventListener',
                  codeSnippet: 'code:addEventListener',
                },
                {
                  inputDescription: 'Updates status to "Booster Online"',
                  expectedOutput: 'Booster Online',
                  codeSnippet: 'code:Booster Online',
                },
              ],
              explanation: 'Event listeners are the core mechanism of web app interactivity.',
              hints: [
                'Inside the click callback, set statusEl.textContent = "Booster Online";',
                'Add console.log("Booster Active");',
                'Solution: btn.addEventListener("click", () => { statusEl.textContent = "Booster Online"; console.log("Booster Active"); });',
              ],
              xpReward: 50,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-js-ch-3',
          title: 'Boss Challenge: The Interactive Spell Caster',
          description: 'Deploy a complete interactive counter widget with state incrementation on button click.',
          objective: 'Build an interactive click counter.',
          starterCode: `let count = 0;
const btn = document.querySelector("button");
const display = document.querySelector("p");
`,
          solutionCode: `let count = 0;
const btn = document.querySelector("button");
const display = document.querySelector("p");
btn.addEventListener("click", () => {
  count++;
  display.textContent = count;
});`,
          testCases: [
            {
              inputDescription: 'Attaches click event to increment counter',
              expectedOutput: 'addEventListener',
              codeSnippet: 'code:addEventListener',
            },
          ],
          hints: ['Increment count and assign to display.textContent inside addEventListener.'],
          xpReward: 150,
        },
      },
    ],
  },

  // =========================================================================
  // 4. PYTHON 101: The Python Realm (ACTIVE)
  // =========================================================================
  {
    id: 'python',
    slug: 'python',
    title: 'Python: The Python Realm',
    language: 'Python',
    level: 'Beginner',
    tagline: 'Learn real Python programming through code-driven adventure missions.',
    description: 'Master core programming fundamentals from your first print statement to variables, branching conditions, loops, lists, and reusable functions. Control autonomous rover Arya in interactive 2D simulations.',
    totalChapters: 8,
    totalLessons: 18,
    xpReward: 1200,
    iconName: 'Terminal',
    badgeText: 'Fully Playable',
    badgeColor: 'bg-[#10B981] text-white',
    isAvailable: true,
    isComingSoon: false,
    chapters: [
      {
        id: 'py-ch-1',
        courseId: 'python',
        chapterNumber: 1,
        title: 'Chapter 1: Hello World & Syntax',
        conceptName: 'Text Output & Syntax Fundamentals',
        description: 'Wake the stranded field rover Arya with your very first code incantation. Learn print(), strings, and case-sensitive syntax.',
        realmName: 'Starter Village',
        iconName: 'Sparkles',
        color: '#6C5CE7',
        lessons: [
          {
            id: 'py-less-1-1',
            chapterId: 'py-ch-1',
            sequenceOrder: 1,
            title: 'Lesson 1.1: The First Incantation',
            subtitle: 'Awaken the Rover with print()',
            storyIntro: 'Deep inside the ancient Digital Gurukul, an autonomous exploration rover named Arya sits powered down. A flashing green terminal awaits your transmission. In Python, programmers use the `print()` command to speak to computers and output text to the console screen.',
            storyIntroHinglish: 'Digital Gurukul ke andar Arya naam ka autonomous exploration rover band pada hai. Python me computer se baat karne ke liye aur console pe message bhejne ke liye hum `print()` command use karte hain.',
            conceptExplanation: 'The `print()` function displays text on the screen. Any words enclosed in quotes (like `"Hello"`) are called **Strings**. The parentheses `()` instruct Python to execute the function.',
            conceptExplanationHinglish: '`print()` function screen par text dikhata hai. Quotes ke andar likhi cheezein `"Hello"` Strings kahlati hain. Parentheses `()` Python ko command execute karne ke liye bolti hain.',
            codeExample: `print("Hello, World!")
print("Rover Arya online.")`,
            codeExampleExplanation: 'Line 1 sends "Hello, World!" to the screen. Line 2 prints a status message on a new line.',
            interactiveTryStarter: `print("Hello, Gurukul!")
print("System diagnostic initialized.")`,
            tryExplanation: 'Click "Run Example" to see how Python executes each line from top to bottom.',
            xpReward: 30,
            exercise: {
              id: 'ex-1-1',
              type: 'code',
              title: 'Exercise: Transmit the Beacon Signal',
              instructions: 'Write a Python program that prints the message: `Beacon Activated`',
              prompt: 'Use the `print()` function with double quotes around the message.',
              initialCode: `# Write your print statement below:
`,
              solutionCode: `print("Beacon Activated")`,
              testCases: [
                {
                  inputDescription: 'Console outputs "Beacon Activated"',
                  expectedOutput: 'Beacon Activated',
                  codeSnippet: 'stdout:Beacon Activated',
                },
              ],
              explanation: 'The `print("Beacon Activated")` statement transmits the string directly to the stdout console.',
              hints: [
                'In Python, displaying text requires the print() command.',
                'Enclose the text in double quotes inside the parentheses: print("...")',
                'Make sure the spelling and capitalization match: "Beacon Activated"',
                'Write: print("Beacon Activated")',
              ],
              xpReward: 40,
            },
          },
          {
            id: 'py-less-1-2',
            chapterId: 'py-ch-1',
            sequenceOrder: 2,
            title: 'Lesson 1.2: Numbers vs. Text Strings',
            subtitle: 'Quotes make strings; raw numbers calculate',
            storyIntro: 'Rover Arya needs to report both its name and its current radar coordinates. Notice that when you print a number without quotes, Python treats it as a numerical value ready for math!',
            storyIntroHinglish: 'Rover Arya ko apna naam aur radar coordinates batane hain. Jab aap bina quotes ke number likhte hain, toh Python usko mathematical number manta hai!',
            conceptExplanation: 'Text inside quotes like `"100"` is a string (characters). A number without quotes like `100` is an integer. You can print multiple items by separating them with commas: `print("Battery:", 100)`.',
            conceptExplanationHinglish: 'Quotes ke andar `"100"` ek text string hai, jabki bina quotes ke `100` ek integer number hai. Comma laga ke aap ek sath print kar sakte hain.',
            codeExample: `print("Battery Level:", 100)
print("Sensors Active:", 4)`,
            codeExampleExplanation: 'Commas inside print() automatically insert a single space between the arguments.',
            interactiveTryStarter: `print("Coordinates:", 12, 45)
print("Status:", "Nominal")`,
            tryExplanation: 'Run this to see how commas join strings and numbers seamlessly.',
            xpReward: 30,
            exercise: {
              id: 'ex-1-2',
              type: 'code',
              title: 'Exercise: Report Rover Telemetry',
              instructions: 'Print the exact text: `Power: 95` using `print("Power:", 95)` or a combined string.',
              prompt: 'Transmit the power level to the base station.',
              initialCode: `# Print the power reading:
`,
              solutionCode: `print("Power:", 95)`,
              testCases: [
                {
                  inputDescription: 'Console outputs "Power: 95"',
                  expectedOutput: 'Power: 95',
                  codeSnippet: 'stdout:Power: 95',
                },
              ],
              explanation: 'Separating the string "Power:" and the integer 95 with a comma outputs "Power: 95".',
              hints: [
                'You can pass multiple items to print() separated by commas.',
                'The first argument should be "Power:" and the second 95.',
                'Write: print("Power:", 95)',
                'Code: print("Power:", 95)',
              ],
              xpReward: 40,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-ch-1',
          title: 'Boss Challenge: Rover Initialization Sequence',
          description: 'Deploy the complete 3-line diagnostic awakening sequence for rover Arya.',
          objective: 'Print system check, battery, and ready beacon.',
          starterCode: `# Transmit the 3 diagnostic lines:
print("SYSTEM: ONLINE")
`,
          solutionCode: `print("SYSTEM: ONLINE")
print("BATTERY: 100")
print("MISSION: RESCUE")`,
          testCases: [
            {
              inputDescription: 'Outputs SYSTEM: ONLINE',
              expectedOutput: 'SYSTEM: ONLINE',
              codeSnippet: 'stdout:SYSTEM: ONLINE',
            },
            {
              inputDescription: 'Outputs BATTERY: 100',
              expectedOutput: 'BATTERY: 100',
              codeSnippet: 'stdout:BATTERY: 100',
            },
          ],
          hints: ['Print all 3 status messages matching capitalization.'],
          xpReward: 100,
        },
      },
      {
        id: 'py-ch-2',
        courseId: 'python',
        chapterNumber: 2,
        title: 'Chapter 2: Variables & State',
        conceptName: 'State Memory & Dynamic Values',
        description: 'Equip rover Arya with persistent variable registers: battery levels, coordinates, and energy storage.',
        realmName: 'Variable Valley',
        iconName: 'Cpu',
        color: '#6C5CE7',
        lessons: [
          {
            id: 'py-less-2-1',
            chapterId: 'py-ch-2',
            sequenceOrder: 1,
            title: 'Lesson 2.1: Declaring Variable Registers',
            subtitle: 'Assigning values with =',
            storyIntro: 'An autonomous rover cannot just shout messages; it must remember its battery, coordinates, and health.',
            storyIntroHinglish: 'Rover ko data yaad rakhne ke liye variables ki zaroorat hoti hai.',
            conceptExplanation: 'Variables hold values in memory. Create one using `variable_name = value`. Example: `energy = 100`.',
            conceptExplanationHinglish: 'Variable me value store karne ke liye `name = value` likhte hain.',
            codeExample: `energy = 100
rover_name = "Arya"
print(rover_name, "Energy:", energy)`,
            codeExampleExplanation: 'Stores 100 in energy and Arya in rover_name.',
            interactiveTryStarter: `gold = 50
print("Current Gold:", gold)`,
            tryExplanation: 'Run to see variable substitution.',
            xpReward: 30,
            exercise: {
              id: 'ex-2-1',
              type: 'code',
              title: 'Exercise: Store Rover Battery',
              instructions: 'Create a variable `battery = 85` and print it using `print("Battery:", battery)`.',
              prompt: 'Assign 85 to battery and print.',
              initialCode: `# Declare battery and print:
`,
              solutionCode: `battery = 85
print("Battery:", battery)`,
              testCases: [
                {
                  inputDescription: 'Outputs Battery: 85',
                  expectedOutput: 'Battery: 85',
                  codeSnippet: 'stdout:Battery: 85',
                },
              ],
              explanation: 'Variable memory stores integers seamlessly.',
              hints: ['Write battery = 85', 'Then print("Battery:", battery)'],
              xpReward: 40,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-ch-2',
          title: 'Boss Challenge: State Register Protocol',
          description: 'Store multi-state telemetry and output formatted status report.',
          objective: 'Declare coordinates x and y and output total.',
          starterCode: `x = 10\ny = 20\n`,
          solutionCode: `x = 10\ny = 20\nprint("Target:", x + y)`,
          testCases: [
            {
              inputDescription: 'Outputs Target: 30',
              expectedOutput: 'Target: 30',
              codeSnippet: 'stdout:Target: 30',
            },
          ],
          hints: ['Add x and y inside print.'],
          xpReward: 100,
        },
      },
      {
        id: 'py-ch-3',
        courseId: 'python',
        chapterNumber: 3,
        title: 'Chapter 3: Conditionals & Decisions',
        conceptName: 'Branching if, elif, else Logic',
        description: 'Give Arya autonomous decision-making power: detect barriers, check energy thresholds, and avoid hazards.',
        realmName: 'Conditional Castle',
        iconName: 'Shield',
        color: '#6C5CE7',
        lessons: [
          {
            id: 'py-less-3-1',
            chapterId: 'py-ch-3',
            sequenceOrder: 1,
            title: 'Lesson 3.1: The If Statement',
            subtitle: 'Branching on True or False',
            storyIntro: 'When rover Arya approaches a deep crater, it must decide: Is it safe to move forward?',
            storyIntroHinglish: 'Rover ko decision lena hota hai ki rasta safe hai ya nahi.',
            conceptExplanation: '`if condition:` executes indented code when the condition is True.',
            conceptExplanationHinglish: '`if condition:` ke andar ka indented code tab chalta hai jab condition True ho.',
            codeExample: `battery = 45
if battery > 20:
    print("Sufficient energy for quest.")`,
            codeExampleExplanation: 'Since 45 > 20 is True, the indented statement executes.',
            interactiveTryStarter: `power = 80
if power >= 50:
    print("Full thrusters enabled.")`,
            tryExplanation: 'Test if conditions in Python.',
            xpReward: 30,
            exercise: {
              id: 'ex-3-1',
              type: 'code',
              title: 'Exercise: Verify Safety Sensor',
              instructions: 'Given `distance = 15`, write an `if distance > 10:` check that prints `Clear Path`.',
              prompt: 'Write an if check with 4-space indentation.',
              initialCode: `distance = 15
# Write if statement:
`,
              solutionCode: `distance = 15
if distance > 10:
    print("Clear Path")`,
              testCases: [
                {
                  inputDescription: 'Outputs Clear Path',
                  expectedOutput: 'Clear Path',
                  codeSnippet: 'stdout:Clear Path',
                },
              ],
              explanation: 'Indented code blocks are fundamental to Python syntax.',
              hints: ['Use if distance > 10:', 'Indent print("Clear Path") with 4 spaces.'],
              xpReward: 40,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-ch-3',
          title: 'Boss Challenge: Autonomous Obstacle Evasion',
          description: 'Branch between Safe, Caution, and Danger states.',
          objective: 'Write complete if/elif/else block.',
          starterCode: `obstacle_distance = 8\n`,
          solutionCode: `obstacle_distance = 8
if obstacle_distance > 10:
    print("Full Speed")
else:
    print("Brakes Engaged")`,
          testCases: [
            {
              inputDescription: 'Outputs Brakes Engaged',
              expectedOutput: 'Brakes Engaged',
              codeSnippet: 'stdout:Brakes Engaged',
            },
          ],
          hints: ['Use if and else blocks.'],
          xpReward: 100,
        },
      },
      {
        id: 'py-ch-4',
        courseId: 'python',
        chapterNumber: 4,
        title: 'Chapter 4: Loops & Repetition',
        conceptName: 'For Loops & Range Iteration',
        description: 'Automate rover wheel revolutions using Python for loops and range(). Navigate long hallways without repeating code.',
        realmName: 'Loop Lab',
        iconName: 'RotateCcw',
        color: '#6C5CE7',
        lessons: [
          {
            id: 'py-less-4-1',
            chapterId: 'py-ch-4',
            sequenceOrder: 1,
            title: 'Lesson 4.1: Counting with for and range()',
            subtitle: 'Looping through iterations',
            storyIntro: 'Why write 5 move commands when you can tell Arya to repeat the action 5 times with a single loop?',
            storyIntroHinglish: '5 baar alag alag command likhne ki jagah for loop se repeat karein.',
            conceptExplanation: '`for i in range(5):` executes the indented block 5 times, where `i` takes values 0, 1, 2, 3, 4.',
            conceptExplanationHinglish: '`for i in range(5):` 5 baar loop chalata hai.',
            codeExample: `for step in range(3):
    print("Rover moving step:", step)`,
            codeExampleExplanation: 'Loops 3 times, printing 0, 1, 2.',
            interactiveTryStarter: `for count in range(4):
    print("Pulse:", count)`,
            tryExplanation: 'Run to see loop iteration.',
            xpReward: 30,
            exercise: {
              id: 'ex-4-1',
              type: 'code',
              title: 'Exercise: Execute 4 Propulsion Bursts',
              instructions: 'Write a loop `for step in range(4):` that prints `Burst Active`.',
              prompt: 'Use for step in range(4): with print.',
              initialCode: `# Write for loop below:
`,
              solutionCode: `for step in range(4):
    print("Burst Active")`,
              testCases: [
                {
                  inputDescription: 'Outputs Burst Active 4 times',
                  expectedOutput: 'Burst Active',
                  codeSnippet: 'stdout:Burst Active',
                },
              ],
              explanation: 'Loops automate repetitive logic seamlessly.',
              hints: ['Write for step in range(4):', 'Indent print("Burst Active") with 4 spaces.'],
              xpReward: 40,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-ch-4',
          title: 'Boss Challenge: Rescue the Stranded Rover in Simulator',
          description: 'Deploy the complete rescue loop in the 2D grid simulator.',
          objective: 'Test loop in simulator.',
          starterCode: `print("Rescue loop active")\n`,
          solutionCode: `for i in range(5):
    print("Navigating sector")`,
          testCases: [
            {
              inputDescription: 'Loop output verified',
              expectedOutput: 'Navigating sector',
              codeSnippet: 'stdout:Navigating sector',
            },
          ],
          hints: ['Use for i in range(5):'],
          xpReward: 150,
        },
      },
    ],
  },

  // =========================================================================
  // 5. LOCKED COMING SOON TRACKS
  // =========================================================================
  {
    id: 'react',
    slug: 'react',
    title: 'React: Components & Hooks',
    language: 'React',
    level: 'Intermediate',
    tagline: 'Component Architecture, State, Hooks & Modern Single-Page Apps.',
    description: 'Build reactive user interfaces with reusable components, state hooks, and modern frontend design systems.',
    totalChapters: 6,
    totalLessons: 18,
    xpReward: 800,
    iconName: 'Atom',
    badgeText: 'Coming Soon ⏳',
    badgeColor: 'bg-[#61DAFB] text-[#1E1E24]',
    isAvailable: false,
    isComingSoon: true,
    chapters: [],
  },
  {
    id: 'nodejs',
    slug: 'nodejs',
    title: 'Node.js: Server-Side JS',
    language: 'Node.js',
    level: 'Intermediate',
    tagline: 'Server-Side JavaScript, REST APIs, JSON & Express Engine.',
    description: 'Build scalable backend services, HTTP servers, RESTful endpoints, and backend application logic.',
    totalChapters: 6,
    totalLessons: 16,
    xpReward: 850,
    iconName: 'Server',
    badgeText: 'Coming Soon ⏳',
    badgeColor: 'bg-[#339933] text-white',
    isAvailable: false,
    isComingSoon: true,
    chapters: [],
  },
  {
    id: 'sql',
    slug: 'sql',
    title: 'SQL: Databases & Queries',
    language: 'SQL',
    level: 'Beginner',
    tagline: 'Relational Databases, Queries, Joins, Aggregations & Schemas.',
    description: 'Query relational databases, structure table relationships, extract insights with SELECT, and perform complex JOIN operations.',
    totalChapters: 5,
    totalLessons: 14,
    xpReward: 700,
    iconName: 'Database',
    badgeText: 'Coming Soon ⏳',
    badgeColor: 'bg-[#00758F] text-white',
    isAvailable: false,
    isComingSoon: true,
    chapters: [],
  },
  {
    id: 'cpp',
    slug: 'cpp',
    title: 'C++: High Performance',
    language: 'C++',
    level: 'Intermediate',
    tagline: 'Pointers, Memory Allocation, Structures & Game Engine Math.',
    description: 'Master hardware-level control, pointers, reference semantics, and high-performance algorithms.',
    totalChapters: 6,
    totalLessons: 16,
    xpReward: 950,
    iconName: 'Cpu',
    badgeText: 'Coming Soon ⏳',
    badgeColor: 'bg-[#00599C] text-white',
    isAvailable: false,
    isComingSoon: true,
    chapters: [],
  },
  {
    id: 'ml',
    slug: 'ml',
    title: 'Machine Learning: AI Foundations',
    language: 'Python',
    level: 'Advanced',
    tagline: 'Neural Networks, Data Cleaning, Regression & Predictive Models.',
    description: 'Explore statistical learning, machine learning pipelines, classification, regression, and practical model training.',
    totalChapters: 6,
    totalLessons: 15,
    xpReward: 1100,
    iconName: 'Brain',
    badgeText: 'Coming Soon ⏳',
    badgeColor: 'bg-[#FF6F00] text-white',
    isAvailable: false,
    isComingSoon: true,
    chapters: [],
  },
  {
    id: 'git',
    slug: 'git',
    title: 'Git & GitHub: Version Control',
    language: 'Git',
    level: 'Beginner',
    tagline: 'Version Control, Branching, Pull Requests & Open-Source Collaboration.',
    description: 'Collaborate with developers worldwide. Master git init, commits, branching workflows, pull requests, and merge conflict resolution.',
    totalChapters: 4,
    totalLessons: 10,
    xpReward: 500,
    iconName: 'GitBranch',
    badgeText: 'Coming Soon ⏳',
    badgeColor: 'bg-[#F05032] text-white',
    isAvailable: false,
    isComingSoon: true,
    chapters: [],
  },
];

/**
 * Helper to find a specific lesson by ID across all courses and chapters.
 * Supports HTML (html-less-X-X), CSS (css-less-X-X), JS (js-less-X-X), Python (py-less-X-X),
 * as well as legacy IDs like py-topic-1.
 */
export function findLessonById(lessonId: string): {
  lesson: Lesson;
  chapter: Chapter;
  course: Course;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
} | null {
  if (!lessonId) return null;

  // Handle legacy py-topic-X mappings
  let normalizedId = lessonId;
  if (lessonId.startsWith('py-topic-')) {
    const num = parseInt(lessonId.replace('py-topic-', ''), 10);
    if (!isNaN(num)) {
      if (num === 1) normalizedId = 'py-less-1-1';
      else if (num === 2) normalizedId = 'py-less-1-2';
      else if (num === 3) normalizedId = 'py-less-2-1';
      else if (num === 4) normalizedId = 'py-less-3-1';
      else normalizedId = 'py-less-4-1';
    }
  }

  for (const course of COURSES_CATALOG) {
    for (const chapter of course.chapters) {
      const idx = chapter.lessons.findIndex((l) => l.id === normalizedId || l.id === lessonId);
      if (idx !== -1) {
        const lesson = chapter.lessons[idx];
        const prevLesson = idx > 0 ? chapter.lessons[idx - 1] : null;
        const nextLesson = idx < chapter.lessons.length - 1 ? chapter.lessons[idx + 1] : null;
        return { lesson, chapter, course, prevLesson, nextLesson };
      }
    }
  }

  // Fallback to first lesson of HTML 101 if not found
  const pythonCourse = COURSES_CATALOG.find((c) => c.id === 'python') || COURSES_CATALOG[0];
  if (pythonCourse && pythonCourse.chapters[0] && pythonCourse.chapters[0].lessons[0]) {
    const lesson = pythonCourse.chapters[0].lessons[0];
    const chapter = pythonCourse.chapters[0];
    return {
      lesson,
      chapter,
      course: pythonCourse,
      prevLesson: null,
      nextLesson: chapter.lessons[1] || null,
    };
  }

  return null;
}

/**
 * Helper to find a course by slug or ID with alias normalization.
 */
export function findCourseBySlugOrId(idOrSlug: string): Course | null {
  const pythonCourse = COURSES_CATALOG.find((c) => c.id === 'python') || COURSES_CATALOG[0];
  if (!idOrSlug) return pythonCourse;
  const clean = idOrSlug.toLowerCase().trim();

  // Normalize aliases
  let target = clean;
  if (clean === 'py' || clean === 'python-basics' || clean === 'python-101' || clean === 'python-realm') target = 'python';
  if (clean === 'js' || clean === 'javascript-101' || clean === 'web-development') target = 'javascript';
  if (clean === 'html-101' || clean === 'html-basics') target = 'html';
  if (clean === 'css-101' || clean === 'css-basics') target = 'css';
  if (clean === 'c-programming' || clean === 'cpp-programming' || clean === 'c++') target = 'cpp';

  const match = COURSES_CATALOG.find((c) => c.id === target || c.slug === target);
  return match || pythonCourse;
}
