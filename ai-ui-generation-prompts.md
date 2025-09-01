# AI Frontend Generation Prompts
## Yahoo Fantasy NBA Draft Assistant

Based on the comprehensive UI/UX specification, here are optimized prompts for AI frontend generation tools (v0.dev, Lovable.ai, etc.):

---

## Master Context Prompt

Use this as the foundational context for all component generation:

```
You are building a Yahoo Fantasy NBA Draft Assistant - a sophisticated tool that helps fantasy basketball players make optimal draft decisions through multi-source data analysis and strategic team optimization.

TECH STACK:
- React 18 with TypeScript
- Tailwind CSS for styling  
- Lucide React for icons
- Next.js for framework
- Mobile-first responsive design

PROJECT PURPOSE:
This is a secondary screen draft companion that syncs with Yahoo Fantasy drafts. Users are experienced fantasy players who need quick, intelligent recommendations during live drafts while having access to deep analysis when needed.

DESIGN PRINCIPLES:
- Data density with clarity (show comprehensive info without overwhelm)
- Speed over aesthetics (fast decisions during draft pressure)
- Progressive disclosure (simple recommendations, expandable details)
- Trust through transparency (show reasoning behind recommendations)

COLOR SYSTEM:
- Primary: #2563eb (main actions, brand)
- Secondary: #7c3aed (strategy indicators)
- Success: #10b981 (positive indicators, on-strategy)
- Warning: #f59e0b (attention needed, opportunities)
- Error: #ef4444 (problems, off-strategy)
- Neutral: #6b7280, #f3f4f6, #1f2937 (text, backgrounds)

NEVER use localStorage or sessionStorage - this app will use React state and server sync.
```

---

## Prompt 1: Live Draft Assistant Interface

**Goal:** Generate the core draft companion interface that shows real-time recommendations

**Complete Prompt:**

```
Create a React component called LiveDraftAssistant that serves as the main interface during live fantasy basketball drafts.

CONTEXT: [Use Master Context Prompt above]

SPECIFIC REQUIREMENTS:

1. LAYOUT STRUCTURE:
- Fixed header showing draft status (Current Pick: 3 of 12, Timer: 1:23, Your Turn indicator)
- Main content area with 3 sections side-by-side:
  * Left: Top 3 player recommendations 
  * Center: Team composition visualization
  * Right: Draft board with recent picks

2. RECOMMENDATION CARDS:
- Player name, team, position (e.g., "LeBron James • LAL • SF/PF")
- Key stats: PPG, RPG, APG from last season
- Confidence indicator (High/Med/Low with color coding)
- Brief rationale (e.g., "Fits punt-FT% strategy, high upside")
- Hover state shows expanded analysis

3. TEAM COMPOSITION PANEL:
- Visual chart showing category balance (PTS, REB, AST, STL, BLK, 3PM, FG%, FT%, TO)
- Color-coded bars: Green (strong), Yellow (adequate), Red (needs help)
- Strategy alignment indicator ("On Track: Punt FT% Build")
- Next need priority (e.g., "Priority: Rebounding")

4. DRAFT BOARD SIDEBAR:
- Scrollable list of recent picks
- Visual indicators for position scarcity
- Your picks highlighted differently

5. INTERACTIONS:
- Hover effects reveal additional player details
- Click player cards for deep analysis modal
- Responsive: Stack vertically on mobile
- Loading states for real-time updates

6. DATA STRUCTURE:
Use mock data with realistic fantasy basketball players and stats. Include at least 10 players in recommendations rotation.

7. COMPONENT ARCHITECTURE:
- Break into smaller components (PlayerRecommendationCard, TeamCompositionChart, DraftPicksList)
- Use TypeScript interfaces for all data structures
- Implement proper loading and error states

Make this feel like a professional fantasy tool that handles live draft pressure with confidence-inspiring design.
```

---

## Prompt 2: Player Analysis Deep Dive Modal

**Goal:** Generate comprehensive player analysis component

**Complete Prompt:**

```
Create a React component called PlayerAnalysisModal that shows comprehensive multi-source analysis for fantasy basketball players.

CONTEXT: [Use Master Context Prompt above]

SPECIFIC REQUIREMENTS:

1. MODAL STRUCTURE:
- Full-screen overlay with close button
- Player header: Photo placeholder, name, team, position, key stats
- Tabbed interface with 4 main sections:
  * Traditional Stats
  * Podcast Insights  
  * Social Sentiment
  * Opportunity Analysis

2. TRADITIONAL STATS TAB:
- Season stats table (PPG, RPG, APG, FG%, 3PM, etc.)
- Trend chart showing last 10 games performance
- Comparison vs position average
- Injury history timeline

3. PODCAST INSIGHTS TAB:
- List of recent podcast mentions with sentiment indicators
- Key quotes from analysts (mock realistic fantasy advice)
- Confidence scoring based on source credibility
- Trending topics about this player

4. SOCIAL SENTIMENT TAB:
- Sentiment meter (Positive/Neutral/Negative)
- Recent social media momentum indicators
- Community discussion highlights
- Buzz score trending chart

5. OPPORTUNITY ANALYSIS TAB:
- Role change indicators (usage rate trends, minutes, touches)
- Team situation analysis (injuries affecting opportunity)
- Schedule favorability (upcoming opponent rankings)
- Breakout probability score with reasoning

6. STRATEGY FIT SECTION:
- Shows how player fits different team-building strategies
- Strategy alignment scores (Punt FT%: 8/10, Balanced: 6/10, etc.)
- Category impact visualization

7. DATA & INTERACTIONS:
- Use mock data that feels realistic for NBA players
- Smooth tab transitions
- Interactive charts using simple CSS animations
- Mobile-responsive with scroll optimization
- Export summary feature

8. TECHNICAL NOTES:
- Make tabs keyboard accessible
- Use proper semantic HTML
- Include loading skeletons for data sections
- Handle empty states gracefully

This should feel like a comprehensive research tool that fantasy experts would trust for deep player analysis.
```

---

## Prompt 3: Strategy Configuration Dashboard

**Goal:** Generate the team-building strategy setup interface

**Complete Prompt:**

```
Create a React component called StrategySetupDashboard for configuring fantasy basketball team-building strategies.

CONTEXT: [Use Master Context Prompt above]

SPECIFIC REQUIREMENTS:

1. MAIN LAYOUT:
- Welcome header explaining strategy importance
- Grid of strategy cards (3x2 layout on desktop, stacked on mobile)
- Selected strategy detail panel
- Configuration options sidebar
- Preview section showing how strategy affects rankings

2. STRATEGY CARDS:
Each strategy card should include:
- Strategy name and brief description
- Visual representation (mini chart or icon)
- Pros/cons list
- Difficulty level indicator (Beginner/Intermediate/Advanced)
- Success rate statistics (mock data)

Strategy Options:
- "Balanced Build": Target all categories evenly
- "Punt FT%": Ignore free throw percentage, focus on big man stats
- "Punt TO": Minimize turnovers, maximize assists
- "Stars & Scrubs": Get superstars early, fill with specialists
- "Youth Movement": Target breakout candidates and sophomores  
- "Safe Floor": Prioritize proven veterans over upside

3. CONFIGURATION PANEL:
When strategy selected, show:
- Category priority sliders (user can adjust importance 1-10)
- Risk tolerance setting (Conservative/Moderate/Aggressive)
- League context inputs (scoring system, roster size)
- Position requirements customization

4. PREVIEW SECTION:
- Sample player rankings showing top 20 with strategy applied
- Comparison vs consensus rankings (show differences)
- Category target visualization
- Draft strategy summary

5. EDUCATIONAL ELEMENTS:
- Tooltip explanations for each strategy
- "Why This Works" explanations
- Historical success examples
- Beginner guidance without cluttering advanced workflows

6. INTERACTIONS:
- Smooth card selection animations
- Real-time preview updates as settings change
- Save/load strategy profiles
- Share strategy configuration feature

7. DATA STRUCTURE:
- Mock realistic NBA player data
- Strategy configuration objects
- Category weighting systems
- Performance projections

8. MOBILE OPTIMIZATION:
- Cards stack vertically on mobile
- Configuration panel becomes modal
- Touch-friendly sliders and controls
- Simplified preview for small screens

Make this feel like a sophisticated strategy planning tool that helps users make informed decisions about their draft approach while remaining accessible to newer fantasy players.
```

---

## Prompt 4: Responsive Navigation & Layout Shell

**Goal:** Generate the main application shell with navigation

**Complete Prompt:**

```
Create a React component called AppShell that provides the main navigation and layout structure for the Yahoo Fantasy NBA Draft Assistant.

CONTEXT: [Use Master Context Prompt above]

SPECIFIC REQUIREMENTS:

1. NAVIGATION STRUCTURE:
- Top navigation bar with logo and main sections
- Primary nav items: Dashboard, Live Draft, Player Analysis, Settings
- User account menu with Yahoo connection status
- Mobile hamburger menu for small screens

2. LAYOUT SYSTEM:
- Responsive main content area
- Sidebar for contextual navigation (collapsible)
- Footer with minimal links and status information
- Breadcrumbs only in deep analysis flows

3. TOP NAVIGATION BAR:
- Logo/brand area (left)
- Main navigation links (center)  
- User menu and notifications (right)
- Draft status indicator when active
- Search bar for quick player lookup

4. SIDEBAR NAVIGATION:
- Context-sensitive based on current section
- In Draft mode: Team composition, recent picks
- In Analysis mode: Filters, watchlist, comparisons
- In Settings: Account, preferences, data sources
- Collapsible with hamburger trigger

5. MOBILE RESPONSIVENESS:
- Full navigation collapses to hamburger menu
- Sidebar becomes slide-out drawer
- Bottom tab navigation for core actions
- Touch-friendly spacing and interactions

6. STATUS INDICATORS:
- Yahoo API connection status
- Draft sync status (connected/disconnected)
- Data freshness indicators
- Notification badges for alerts

7. THEMING & BRANDING:
- Clean, data-focused aesthetic
- Consistent color system throughout
- Professional but approachable feel
- Dark mode toggle option

8. INTERACTIVE FEATURES:
- Smooth transitions between sections
- Loading states during navigation
- Error boundaries for section failures
- Keyboard shortcuts for power users (Ctrl+D for draft, Ctrl+P for player search)

9. TECHNICAL IMPLEMENTATION:
- Use React Router for navigation
- Implement proper route guards
- Handle deep linking correctly  
- Optimize for fast page transitions
- Include proper meta tags and titles

10. MOCK DATA INTEGRATION:
- Show realistic user account info
- Display sample league connections
- Include notification examples
- Show various connection states

This should feel like a professional SaaS application shell that fantasy users would trust for serious draft preparation and analysis.
```

---

## Usage Instructions

### For v0.dev:
1. Start with Prompt 1 (Live Draft Assistant) as your core interface
2. Use the Master Context in each subsequent prompt
3. Iterate on the generated components using the "Edit" feature
4. Combine components into a cohesive application

### For Lovable.ai:
1. Use the Master Context as your project foundation
2. Generate each component as a separate "feature"
3. Request integration between components in follow-up prompts
4. Focus on the responsive behavior and state management

### For Other AI Tools:
- Adapt the technical requirements to your chosen framework
- Emphasize the fantasy basketball domain context
- Request TypeScript interfaces and proper error handling
- Focus on the real-time draft assistance use case

### Post-Generation Next Steps:
1. Test the generated components for functionality
2. Customize the styling to match your brand preferences
3. Integrate with actual Yahoo Fantasy Sports API
4. Add real data and state management
5. Implement proper routing and navigation

---

## Important Notes

- All prompts assume no localStorage/sessionStorage usage (as specified in constraints)
- Focus on React state management and server synchronization
- Emphasize mobile-responsive design patterns
- Include proper TypeScript typing throughout
- Consider accessibility requirements in all components
- Design for real-time updates and live draft scenarios

These prompts will generate a solid foundation for your Yahoo Fantasy NBA Draft Assistant that you can then customize and integrate with your backend architecture.
