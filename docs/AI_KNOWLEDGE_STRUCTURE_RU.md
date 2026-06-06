# Структура Базы Знаний AI (Knowledge Structure)

Данный документ является "мастер-файлом" для управления контентом базы знаний платформы INFINITI. Он описывает иерархию статей, вопросы FAQ и их привязку к конкретным модулям и ролям. В соответствии с утвержденной языковой стратегией, сами статьи и вопросы в базе данных хранятся на английском языке.

---

## 1. Founder FAQ (Основатель)

| Article Title (Название статьи) | FAQ Question (Вопрос FAQ) | KB Category | Related Module | Target Role |
|---------------------------------|---------------------------|-------------|----------------|-------------|
| Getting Started with Growth & Exit | How do I start the Growth & Exit program? | Onboarding | Project Setup | Founder |
| Understanding the Deal Room | How do I create and manage a Deal Room? | Due Diligence | Deal Room | Founder |
| Valuation Metrics Explained | How is my company's valuation calculated? | Financials | Valuation | Founder |
| Working with the Growth Plan | What is a Growth Plan and how do I use it? | Strategy | Growth Plan | Founder |
| Approving Growth Initiatives | I approved a Growth Item. What happens next? | Operations | Approval Flow | Founder |

---

## 2. Investor FAQ (Инвестор)

| Article Title (Название статьи) | FAQ Question (Вопрос FAQ) | KB Category | Related Module | Target Role |
|---------------------------------|---------------------------|-------------|----------------|-------------|
| Accessing the Deal Room | How do I access company documents in the Deal Room? | Due Diligence | Deal Room | Investor |
| Reviewing Company Valuation | Why can't I see the detailed valuation calculations? | Financials | Valuation | Investor |
| Evaluating the Growth Plan | How do I read the company's Growth Plan? | Strategy | Growth Plan | Investor |

---

## 3. Buyer FAQ (Покупатель)

| Article Title (Название статьи) | FAQ Question (Вопрос FAQ) | KB Category | Related Module | Target Role |
|---------------------------------|---------------------------|-------------|----------------|-------------|
| Navigating the Deal Room for M&A | Where can I find legal and financial documents? | Due Diligence | Deal Room | Buyer |
| Understanding the Summary Valuation | What does the Current Value represent? | Financials | Valuation | Buyer |
| Requesting Additional Access | Why is the Growth Plan hidden from my view? | Access | Permissions | Buyer |

---

## 4. Deal Manager FAQ (Администратор / M&A Advisor)

| Article Title (Название статьи) | FAQ Question (Вопрос FAQ) | KB Category | Related Module | Target Role |
|---------------------------------|---------------------------|-------------|----------------|-------------|
| Creating an Exit Deal Project | How do I initialize a new Exit Deal project? | Project Setup | Admin Panel | Deal Manager |
| Inviting External Participants | How do I invite an Investor or Buyer to the project? | Access | Participants | Deal Manager |
| Setting Up Current Valuation | How do I configure the baseline valuation metrics? | Financials | Valuation | Deal Manager |
| Proposing Growth Items | How do I add initiatives to the Growth Plan? | Strategy | Growth Plan | Deal Manager |
| Managing Offers and Invoices | How do I track approved Growth Items? | Operations | Billing | Deal Manager |

---

## Правила поддержки базы знаний

1. При добавлении нового функционала в платформу, необходимо сначала зафиксировать его в этом документе, выбрав целевую аудиторию (Target Role).
2. Название статьи (Article Title) используется для создания полноценной инструкции в таблице `ib_kb`.
3. Вопрос (FAQ Question) используется для заполнения таблицы `kb_popular_questions`.
4. Текст статьи должен быть написан на английском языке, чтобы AI Assistant мог переводить его на любой язык по запросу пользователя.
