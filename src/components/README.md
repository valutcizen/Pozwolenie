# Components

This directory contains all the Vue components for the "Pozwolenie" application. Components are automatically imported by `unplugin-vue-components`, so they can be used in templates without manual import statements.

## Component Descriptions

### `MainMenu.vue`
This is the application's main navigation hub. It presents the user with the choice to start a "Learn" session or an "Exam" session. It provides several configuration options for the learning mode, such as:
- **Infinite Mode**: Loop through questions endlessly.
- **Randomized**: Shuffle the order of questions.
- **Show Question Number/Source**: Control when to display question metadata (always, after answering, or never).
It also allows the user to continue a previous learning session if one is saved in the browser.

### `LearnView.vue`
This component manages the "Learn" mode. It displays questions one by one using the `QuestionCard` and shows live statistics using the `StatsCard`. It respects the learning options selected in the `MainMenu`.

### `ExamView.vue`
This component handles the exam simulation. It presents the user with 20 questions under a 30-minute time limit.
- During the exam, it displays the current question using `QuestionCard` and shows a countdown timer.
- After the exam is completed or the time runs out, it shows a summary dialog with the result (pass/fail), score, and total time.
- It then displays a detailed review of all questions using `StatsCard`, allowing the user to click on any question to see their answer and the correct one.

### `QuestionCard.vue`
A presentational component responsible for displaying a single question, its multiple-choice answers, and a "Next" button. Its appearance and behavior change based on the context:
- In "Learn" mode, it immediately highlights correct (green) and incorrect (red) answers after the user makes a selection.
- In "Exam" mode, it only highlights the user's selected answer (in blue) and waits for the next question.
- It can conditionally show the question's legal source based on props.

### `StatsCard.vue`
This component displays statistics for a learning or exam session. It shows:
- A summary of correct answers, incorrect answers, percentage correct, and total time spent.
- An expandable section with a detailed table showing performance for each question answered.
- In the post-exam review, the rows in the details table are clickable, allowing the user to navigate back to that specific question in the `ExamView`.