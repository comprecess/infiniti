# Knowledge Base Import Plan

This document outlines exactly where each piece of knowledge will be stored during the synchronization process. It maps the conceptual knowledge to the specific technical implementation in the INFINITI platform.

---

## 1. What goes to `knowledge_base.txt` (System Prompt)

The `knowledge_base.txt` file is the core context for the AI Assistant. It needs to contain high-level concepts, definitions, and the overall logic of the platform so the AI can reason about user questions.

**Content to be injected:**
*   **INFINITI Platform Overview:** What is the Venture OS and the Growth & Exit Program.
*   **Core Modules Definitions:** Brief explanations of Onboarding, Deal Room, Valuation (Current/Projected/Best Case), and Growth Plan.
*   **Approval Flow Logic:** The business logic of what happens when a Founder clicks "Approve" (Task → Offer → Invoice).
*   **Role-Based Access Rules:** Clear definitions of what a Founder, Investor, Buyer, and Deal Manager can and cannot see.
*   **Language Rule:** Reiteration of the rule to answer in the user's language based on the English source text.

*Note: Detailed step-by-step instructions do not go here; they belong in the KB articles.*

---

## 2. What goes to `kb_popular_questions` (FAQ)

This table powers the "Frequently Asked Questions" UI section. We will insert the questions defined in the `AI_KNOWLEDGE_STRUCTURE_RU.md` document.

**SQL Inserts will include:**
*   "How do I start the Growth & Exit program?"
*   "How do I create and manage a Deal Room?"
*   "How is my company's valuation calculated?"
*   "What is a Growth Plan and how do I use it?"
*   "I approved a Growth Item. What happens next?"
*   "How do I access company documents in the Deal Room?"
*   "Why can't I see the detailed valuation calculations?"
*   "How do I invite an Investor or Buyer to the project?"

*Note: These will be inserted with `is_default = 1` so they appear automatically for users.*

---

## 3. What becomes KB Articles (`ib_kb`)

This table stores full-length help articles. We will create articles corresponding to the FAQ questions, providing detailed, step-by-step instructions.

**SQL Inserts will include new records with HTML content:**
1.  **Title:** "Getting Started with Growth & Exit"
    *   **Content:** Explanation of the onboarding process, required metrics (MRR, Revenue), and initial setup.
2.  **Title:** "Understanding the Deal Room"
    *   **Content:** Details on the 8 standard folders, how to upload documents, and who can view them.
3.  **Title:** "Valuation Metrics Explained"
    *   **Content:** Deep dive into Base Metric, Multiplier, Current Value, Projected Value, and Best Case Value calculations.
4.  **Title:** "Working with the Growth Plan"
    *   **Content:** How to read the Kanban board, understand Growth Item costs, and their impact on the multiplier.
5.  **Title:** "Approving Growth Initiatives"
    *   **Content:** Step-by-step guide on the Approve button, where to find the generated Offer and Invoice, and how the INFINITI team starts the task.
6.  **Title:** "Role Access Guide: Investors and Buyers"
    *   **Content:** A matrix explaining what external participants can see (Deal Room access, Summary vs. Detailed Valuation, Growth Plan visibility).

*Note: All articles will be assigned to a new KB Group (e.g., "Growth & Exit Guide") to keep them organized and organized.*
