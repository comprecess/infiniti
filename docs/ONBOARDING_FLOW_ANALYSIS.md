# Onboarding Flow Analysis

**Project:** INFINITI Growth & Exit Program
**Date:** 2026-06-06

## 1. Текущее состояние (Current State)

Анализ исходного кода и базы данных выявил следующее:

### Реализован ли Onboarding Wizard?
**Да, частично реализован.**
Компонент `OnboardingPage.tsx` существует и полностью функционален:
- Содержит 5 шагов (Company Information, Financial Overview, Product Metrics, Team & Operations, Exit Preferences).
- Успешно сохраняет данные в базу через `ProjectMetadata` (таблица `clx_shared_preferences`).
- Для демо-проекта `TechStartup Ltd` данные об онбординге уже сохранены (MRR, Industry, Employees и т.д.).

### Доступность и маршрутизация
- **Маршрут существует:** `/projects/:id/onboarding`
- **Проблема навигации:** Страница Onboarding **не добавлена в Sidebar** (`useProjectTemplateSidebar.tsx`).
- **Отсутствие авто-триггера:** При создании нового проекта нет логики автоматического перенаправления на `/onboarding`. Пользователь сразу попадает на страницу `summary` (Dashboard).

## 2. Ожидаемый поток (Expected Flow)

1. **First Visit:** Создание проекта `Exit Deal`.
2. **Auto-Redirect:** Платформа проверяет наличие ключа `onboarding.status = completed` в метаданных.
3. **Onboarding Wizard:** Если статус не `completed`, пользователя принудительно направляют на `/projects/:id/onboarding`.
4. **Data Collection:** Founder заполняет 5 шагов визарда.
5. **Workspace Access:** После завершения открывается доступ к Deal Room, Growth Plan и Valuation.

## 3. Разрыв (Gap Analysis)

| Ожидание | Реальность | Gap |
|----------|------------|-----|
| Onboarding доступен в меню | Отсутствует в Sidebar (`iconMap`, БД) | Пользователь не может открыть Onboarding вручную. |
| Авто-запуск при первом входе | Редирект на `summary` | Пользователь пропускает сбор данных и видит пустые дашборды. |
| Блокировка разделов до заполнения | Все разделы доступны сразу | Valuation и Growth Plan не имеют базовых метрик для старта. |

## 4. Рекомендации по исправлению (Recommendations)

Для полноценного включения Onboarding Wizard в реальный пользовательский путь необходимо выполнить три шага (в рамках Phase 6 или отдельного фикса):

1. **Добавить Onboarding в Sidebar:**
   - Обновить `clx_project_template_sections` в базе данных для шаблона `exit_deal` (добавить секцию `onboarding`).
   - Добавить иконку в `useProjectTemplateSidebar.tsx`.

2. **Внедрить логику авто-перенаправления (Auto-Redirect):**
   - В компоненте `ViewProjectPage.tsx` при загрузке проверять метаданные проекта.
   - Если `onboarding.status !== 'completed'`, принудительно делать `navigate('onboarding')`.

3. **Связь с Valuation (Опционально):**
   - Использовать данные из Onboarding (например, MRR, EBITDA) как стартовые значения для первого Valuation.
