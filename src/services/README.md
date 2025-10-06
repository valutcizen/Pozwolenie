# Services

This directory contains the business logic for the application. These services handle tasks like managing the question flow, tracking statistics, and persisting user progress.

## File Descriptions

### `questionList.ts`
This is a TypeScript `interface` that defines a contract for any class that serves questions. It ensures that different question providers (e.g., ordered or randomized) have a consistent API. It requires methods for getting the next question (`getNextQuestion`), handling an answer (`answered`), resetting the list (`reset`), and retrieving statistics (`getStats`).

### `orderedQuestionList.ts`
This class implements the `QuestionList` interface. It provides questions in a sequential, deterministic order based on the initial question range. It keeps track of the user's position in the list and provides the next question in order.

### `randomizedQuestionList.ts`
This class also implements the `QuestionList` interface but serves questions in a shuffled, random order. Upon instantiation, it shuffles the list of question indexes to create a random sequence. It provides a `reset` method that can re-shuffle the questions for a new session.

### `statsService.ts`
This service is responsible for managing and tracking user statistics. It can be initialized with existing data or create a new, empty stats object. Its primary responsibilities include:
- Recording whether an answer was correct or incorrect for a specific question.
- Tracking the total number of questions answered.
- Calculating total session time.
- Re-shuffling stats arrays to match a new question order.

### `persistLearnState.ts`
This service handles saving and loading the state of a "Learn" mode session to the browser's `localStorage`. This allows users to close the application and resume their progress later.
- **Saving**: It stores the current learning options, the order of questions, and the user's statistics.
- **Loading**: It retrieves the saved state and verifies it against the current question database version to prevent data incompatibility. It exposes a `canLoad` reactive property to the UI to indicate if a valid saved state is available.