# Product Requirements Document: Three Things to Do

## 1. Project Overview
"Three Things to Do" is a visually beautiful, aesthetically calming calendar and task management app. Its primary mission is to help users break down large, daunting tasks into the smallest possible actionable steps, with a focus on a manageable daily workload (ideally 3 tasks per day).

## 2. Target Platforms
- **Web**: Fully responsive website.
- **Mobile**: Mobile-first design with PWA (Progressive Web App) support for installation on home screens.
- **Hosting**: GitHub Pages (preferred).

## 3. Core Features

### 3.1 Home Page
- **Current Date & Day**: Displayed prominently in a calming design.
- **Daily Tasks**: Shows the 3 (or more/less) tasks assigned to the current day.
- **Events/Reminders Section**: Shows upcoming events/reminders for the day.
- **Settings Access**: Top-right corner button.
- **Navigation**: Bottom bar (Mobile) with a larger Home icon. Sidebar or top menu (Web).

### 3.2 Calendar Page
- **Monthly View**: Navigate between months, see task distribution.
- **Daily View**: Accessible via a "Daily" button. Navigate between days using left/right arrows.
- **Task/Event Toggle**: Filters to show both tasks and events, only tasks, or only events.
- **Caution Indicators**: A caution sign that, when clicked, highlights days with fewer than 3 tasks or more than 3 tasks.
- **Direct Entry**: Add tasks or events directly to a specific day from the Daily view.

### 3.3 List Page (Task Management)
- **Nested Task Structure**: Infinite nesting (Task -> Subtask -> Mini-subtask, etc.).
- **Categories**: Groups of top-level tasks. Used for organization and color-coding.
- **Task Creation**: Standalone tasks or categorized tasks.
- **Visual Feedback**:
    - Checkboxes for completion.
    - Tasks with all subtasks completed are crossed out and checked.
    - Prompt to delete a task when it and all its subtasks are completed.
    - Collapsible subtasks (minimize using arrow icons).
- **Caution Indicator**: Shows tasks that have not yet been assigned to a specific day.
- **Layout Options (Web)**:
    - Kanban board.
    - Side-by-side columns.
    - Stacked (vertical).
    - Free-form (drag-and-drop on a dot-grid board).
- **Drag and Drop**: Reorder tasks, move subtasks between tasks, or change nesting levels.
- **Undo/Redo**: Global functionality for task/list changes.

### 3.4 Events & Reminders Page
- **CRUD**: Create, Read, Update, Delete events.
- **Details**: Date, specific time (optional), and notification toggle.
- **Integration**: Events appear on the Home page and Calendar.

### 3.5 Import/Export & Data
- **Import Formats**:
    - **Bullet Points**: `- Task`
    - **Spaced**: Leading spaces determine depth (0 spaces = Task, 1 = Subtask, etc.).
    - **Comma-Separated**: `Task, Sub1, Sub2,, MiniSub2.1,, MiniSub2.2, Sub3` (Number of commas determines depth).
- **AI Integration**: Provide a "Copy AI Prompt" feature to help users format their raw lists into the app's supported formats.
- **Backup/Restore**: Export data as a JSON file and import it back to prevent data loss.
- **Local Storage**: All data is stored locally on the user's device.

## 4. UI/UX & Aesthetics
- **Theme**: "Aesthetically calming" with a "Red Earth Soft Pastel" default theme.
- **Theme Options**: Light, Dark, Soft Pastel Red, Soft Pastel Blue, and more.
- **Animations**: Fluid, smooth transitions (inspired by shining.302chanwoo.com and buttermax.net).
- **Micro-interactions**: Satisfying button clicks, subtle hover effects, and smooth layout transitions.
- **Confirmations**: Double confirmation for deleting any item that contains subtasks.

## 5. Technical Stack
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand (with Persistence middleware)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Hosting**: GitHub Pages
