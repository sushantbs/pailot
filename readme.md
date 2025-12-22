 Here is a structured list of prompts to build the **Pilot Recall Assistant (PRA)** as a web-based React application. These prompts prioritize **offline capability**, **iOS Safari compatibility**, and **business logic testing** to ensure the "Trust Architecture" is maintained.

### **Phase 1: Architecture & Setup (Offline & Mobile-First)**

**Prompt 1: Project Scaffolding & iOS Config**
"Act as a Senior React Architect. Scaffold a new React application using **Vite** and **TypeScript**.

* 
**Target:** The app is an iOS-only web app running in Safari on iPads.


* **Manifest:** Generate a `manifest.json` configured for `standalone` display mode to hide the browser URL bar and give a native 'EFB app' feel.
* **Meta Tags:** Add specific meta tags (`viewport-fit=cover`, `apple-mobile-web-app-capable`) to handle the iPad notch and prevent iOS auto-zoom on input focus.
* **Styling:** Install Tailwind CSS and configure it with `safe-area-inset` utilities to ensure content isn't hidden behind the home bar or status bar."

**Prompt 2: Offline Data Layer (The "Brain")**
"Design a client-side database layer using **Dexie.js** (IndexedDB wrapper) to meet the 'Embedded Database' requirement.

* **Schema:** Define TypeScript interfaces for two core stores:
1. 
`RecallItems` (id, title, phases, description, reference, mediaBlob, threats) .


2. 
`FlightLists` (id, date, activeItemIds).




* **Persistence:** Implement a 'StorageManager' class that abstracts database operations.
* **iOS Nuance:** Add logic to check `navigator.storage.persist()` on startup to request persistent storage, preventing Safari from wiping data after 7 days of inactivity (a known WebKit heuristic)."

**Prompt 3: State Management & Testing Setup**
"Set up **Zustand** for global state management to handle the 'Current Flight Phase' and 'Active Flight List'.

* **Testing:** Configure **Vitest** and **React Testing Library**.
* **Constraint:** Configure the test environment to support `fake-indexeddb` so we can run fast, headless unit tests on the database logic without a browser."

---

### **Phase 2: Core Business Logic (The "Trust Architecture")**

**Prompt 4: The Recall Manager Hook (CRUD Logic)**
"Create a custom hook `useRecallManager` handling the creation of recall items.

* 
**Validation:** It must enforce that 'Title' and 'Relevant Phases' are mandatory.


* **Sanitization:** Ensure no 'smart' auto-complete logic injects data. The input must be strictly what the user typed.


* **Test Case:** Write a Vitest test that adds a 'Deicing Procedure' item and verifies it is retrievable from the mocked Dexie DB."

**Prompt 5: The Deterministic Filtering Engine**
"Develop the core logic hook `usePhaseFilter(currentPhase, allItems)`.

* 
**Logic:** It should return a list of items where `item.phases` includes `currentPhase`.


* **Tier-1 Rule:** Add a `isCriticalPhase` boolean. If `true`, filter the list to show *only* items marked as 'Tier-1' (add this boolean to the schema if missing).


* **Test Case:** Simulate a phase change from 'Taxi' to 'Takeoff'. Assert that the 'Deicing' item (Taxi only) disappears and 'MEL FMC-C' (Takeoff) appears. **Zero latency is the goal.**"



---

### **Phase 3: UI Implementation (iOS Safari Optimized)**

**Prompt 6: Recall Item Creation Form**
"Build a 'Create Recall Item' form component.

* 
**Inputs:** Text fields for Title, Description, Reference Pointer (e.g., 'OM-C 4.3.2').


* **Phase Selector:** A multi-select toggle group (e.g., Taxi, Takeoff, Cruise) that is touch-friendly for iPad fingers.
* 
**Media:** A file input that accepts images/PDFs, converts them to Blobs, and stores them in IndexedDB.


* **iOS Note:** Ensure input fields use `font-size: 16px` to prevent Safari from zooming in when the pilot taps a text box."

**Prompt 7: Phase-Aware Recall View (The Pilot's View)**
"Create the main 'Flight Mode' view.

* **Header:** A sticky 'Phase Indicator' bar at the top (e.g., 'CURRENT: TAXI').
* **List:** A scrollable list of 'Recall Cards'.
* 
**Visual Distinction:** Style the 'Pilot Notes' section differently from the 'Official Reference' section (e.g., yellow background for notes, grey for ref link) to satisfy the 'Clear Visual Separation' requirement.


* **Animation:** Use simple CSS transitions for items entering/leaving the list to avoid visual jarring, but keep duration under 200ms for 'instant' feel."

---

### **Phase 4: Integration & Business Logic Verification**

**Prompt 8: Full Flow Integration Test**
"Write an integration test suite for the 'Flight Lifecycle':

1. **Setup:** Seed the DB with a 'Weather: Cold' item (Taxi) and 'Terrain: High' item (Approach).
2. **Action:** User sets Phase to 'Taxi'.
3. **Assert:** Only 'Weather: Cold' is visible in the DOM.
4. **Action:** User changes Phase to 'Approach'.
5. **Assert:** 'Weather: Cold' is removed, 'Terrain: High' is added.
6. 
**Constraint:** Ensure no network requests were attempted during this flow (Offline-First check)."



**Prompt 9: Data Persistence Check**
"Create a test utility to verify data survives a 'reload'.

* **Scenario:** Save a Recall Item, simulate a page reload (unmount/remount app), and assert the item is still present in the list.
* 
**Why:** This confirms IndexedDB is correctly connected and the user won't lose data if the iPad refreshes the page."



---

### **Phase 5: Deployment & Maintenance**

**Prompt 10: Safari PWA "Install" Guide**
"Create a simple 'Onboarding' modal for first-time users.

* **Content:** Detect if the app is running in the browser (not standalone).
* 
**Instruction:** Show an arrow pointing to the iOS 'Share' button with the text: 'Add to Home Screen to enable offline database persistence'.


* **Logic:** Hide this modal if `window.navigator.standalone` is true."