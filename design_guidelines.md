# GRIEV-AI Platform Design Guidelines

## Design Approach
**Hybrid System**: Material Design foundation with Linear-inspired dashboard aesthetics for a modern, trustworthy civic tech platform that balances government credibility with contemporary user experience.

## Typography

**Font Families** (Google Fonts):
- Primary: Inter (headings, UI elements, buttons)
- Secondary: Open Sans (body text, descriptions)

**Scale**:
- Hero Headlines: text-5xl md:text-6xl, font-bold
- Section Headers: text-3xl md:text-4xl, font-semibold
- Card Titles: text-xl font-semibold
- Body: text-base, font-normal
- Captions/Labels: text-sm, font-medium
- Micro-text: text-xs

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6, p-8
- Section spacing: py-16, py-20, py-24
- Card gaps: gap-6, gap-8
- Form fields: space-y-6

**Container Strategy**:
- Max width: max-w-7xl for dashboards, max-w-4xl for forms
- Grid layouts: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

## Component Library

### Navigation
**Main Navbar**: Fixed top bar with logo left, role-based navigation center, profile/notifications right. Height h-16, backdrop blur effect when scrolling. Use Heroicons for all icons.

**Sidebar** (Admin Panel): Left-aligned, w-64, collapsible on mobile. Vertical nav items with icon + label, active state with subtle indicator.

### Authentication Pages
**Layout**: Split-screen design - left 40% for form, right 60% for compelling civic impact imagery/illustration
- Form container: max-w-md, centered, p-8
- Input fields: Full width with floating labels (Material Design style)
- CTA buttons: w-full, py-3, rounded-lg with elevation shadow

### Citizen Dashboard
**Hero Section**: 
- Full-width banner with background image (citizens engaging with community/city)
- Overlay with blurred background (backdrop-blur-md) containing welcome message and quick action button
- Height: h-64 md:h-80
- Quick stats bar below hero: 4-column grid showing total complaints, pending, resolved, response time

**Complaint Cards Grid**:
- 3-column grid (lg:grid-cols-3 md:grid-cols-2)
- Each card: rounded-xl, p-6, shadow-md with hover elevation
- Status badge: top-right, rounded-full, px-3, py-1
- Category icon + label, title (font-semibold), truncated description, timestamp
- Action button: bottom-right, outlined style

### Grievance Submission Form
**Layout**: Single column, max-w-3xl, centered
- Progress indicator at top (Step 1/3 style)
- Form sections with clear visual separation (space-y-8)
- Input groups: Label (font-medium, mb-2), input field, helper text (text-sm, text-muted)
- Category selector: Horizontal radio cards with icons (grid-cols-2 md:grid-cols-4)
- Location input: Integrated map preview (h-48)
- Image upload: Dropzone with dashed border, h-32
- Submit section: Sticky bottom bar with cancel + submit buttons

### Admin Panel
**Dashboard Layout**: 
- Top stats row: 4 metric cards (grid-cols-4) with icon, number (text-4xl), label, trend indicator
- Main area: 2-column layout (lg:grid-cols-3, left column spans 2)
  - Left: Complaints table with advanced filters
  - Right: Analytics widget stack (space-y-6)

**Complaints Table**:
- Sticky header row with sortable columns
- Row height: h-16, alternating subtle background
- Columns: Status dot, Title, Category, Location, Date, Actions
- Inline filters: Dropdown selectors in header
- Pagination: Bottom center, showing X-Y of Z results

**Analytics Widgets**:
- Card container: p-6, rounded-xl
- Chart.js visualizations:
  - Pie chart: Complaint categories (h-64)
  - Bar chart: Area-wise density (h-80)
  - Line chart: Resolution trends (h-64)
- Each with title (text-lg, font-semibold, mb-4)

### Profile Management
**Layout**: 2-column (md:grid-cols-3)
- Left column (1/3): Profile card with avatar upload (circular, w-32 h-32), name, role badge
- Right column (2/3): Tabbed interface for Edit Profile | Activity History | Settings
- Activity timeline: Vertical list with connecting line, icons on timeline, card-style entries

### Modals & Overlays
**Status Update Modal**: 
- Centered, max-w-lg, rounded-2xl, p-8
- Header with icon and title
- Status selector: Large radio buttons with visual status indicators
- Notes textarea: h-32
- Action buttons: Right-aligned, gap-4

**Notification Toast**: Top-right, max-w-sm, slide-in animation, auto-dismiss. Success/error states with appropriate icons.

### Buttons
**Primary**: py-3, px-6, rounded-lg, font-medium, shadow-md with hover lift
**Secondary**: py-3, px-6, rounded-lg, border-2, font-medium
**Icon buttons**: w-10, h-10, rounded-lg, flex items-center justify-center
**Buttons on images**: backdrop-blur-lg, semi-transparent background

### Form Elements
**Text inputs**: h-12, px-4, rounded-lg, border-2, focus:ring-4 (Material ripple effect)
**Dropdowns**: Same as text inputs with chevron icon right
**Checkboxes/Radio**: w-5 h-5, rounded (radio: rounded-full), with custom focus rings
**File upload**: Dashed border-2, rounded-xl, p-8, hover state with subtle background

## Images

**Hero Sections**:
1. **Landing Page Hero**: Wide cityscape or citizens using mobile devices to report issues (1920x800px)
2. **Auth Pages**: Split-screen images showing community engagement, government response teams, or civic infrastructure (1200x1600px)
3. **Dashboard Background**: Subtle abstract pattern or muted city imagery (low opacity overlay)

**Content Images**:
- Category icons: Use Heroicons for Water (droplet), Power (bolt), Roads (map), Sanitation (trash)
- Empty states: Illustrations for "No complaints yet", "All resolved"
- Admin analytics: Data visualization backgrounds

**Image Treatment**: All images with 4px border radius, subtle shadows. Hero images with gradient overlays (top to bottom fade).

## Animations
**Minimal & Purposeful**:
- Page transitions: Fade-in only (duration-200)
- Card hover: Slight elevation lift (hover:shadow-lg, transition-shadow)
- Button hover: Scale 102% (hover:scale-102, transition-transform)
- Status changes: Subtle color fade (transition-colors duration-300)
- Form validation: Shake animation for errors

**No**: Complex scroll animations, parallax effects, or loading spinners beyond basic circular indicators

## Accessibility
- Focus states: 4px ring with offset on all interactive elements
- Keyboard navigation: Tab order follows visual hierarchy
- ARIA labels on all icon-only buttons
- Form errors: Visible text + icon, linked to input via aria-describedby
- Contrast: Ensure all text meets WCAG AA standards (will be validated with final colors)