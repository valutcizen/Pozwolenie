import type Question from './question';

export type IndexedQuestion = Question & { index: number, is_last: boolean };