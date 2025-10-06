
import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Define paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '..');
const QUESTIONS_PATH = resolve(ROOT_DIR, 'src', 'data', 'questions.json');
const OUTPUT_PATH = resolve(ROOT_DIR, 'src', 'data', 'custom-ranges.json');

// Define types
interface QuestionData {
    version: string;
    questions: Question[];
}

interface Question {
    id: number;
    question: string;
    answers: {
        a: string;
        b: string;
        c: string;
    };
    correctAnswer: 'a' | 'b' | 'c';
    source: string;
    media?: {
        type: 'image' | 'video';
        src: string;
    };
    explanation?: string;
}

interface CustomRange {
    name: string;
    tip: string;
    range: string;
}

// Chapter definitions for "Ustawa o broni i amunicji"
const UOBIA_CHAPTERS = [
    { name: 'Rozdział 1', tip: 'Przepisy ogólne (art. 1-8a)', start: 1, end: 8 },
    { name: 'Rozdział 2', tip: 'Zasady i warunki wydawania, cofania pozwoleń na broń, rejestracji broni oraz dysponowania bronią i amunicją (art. 9-33)', start: 9, end: 33 },
    { name: 'Rozdział 3', tip: 'Przewóz przez terytorium Rzeczypospolitej Polskiej, przywóz z zagranicy i wywóz za granicę broni i amunicji oraz zasady posiadania broni i amunicji przez cudzoziemców (art. 34-44a)', start: 34, end: 44 },
    { name: 'Rozdział 4', tip: 'Zasady działania strzelnic (art. 45-49)', start: 45, end: 49 },
    { name: 'Rozdział 5', tip: 'Przepisy karne (art. 50-51)', start: 50, end: 51 },
    { name: 'Rozdział 6', tip: 'Zmiany w przepisach obowiązujących (art. 52-56)', start: 52, end: 56 },
    { name: 'Rozdział 7', tip: 'Przepisy przejściowe i końcowe (art. 57-62)', start: 57, end: 62 }
];

// Helper to compress an array of numbers into a range string
function compressRange(numbers: number[]): string {
    if (numbers.length === 0) {
        return '';
    }
    const sorted = [...new Set(numbers)].sort((a, b) => a - b);
    const ranges: (string | number)[] = [];
    let start = sorted[0];

    for (let i = 0; i < sorted.length; i++) {
        const current = sorted[i];
        const next = sorted[i + 1];

        if (next !== current + 1) {
            if (start === current) {
                ranges.push(current);
            } else {
                ranges.push(`${start}-${current}`);
            }
            if (next) {
                start = next;
            }
        }
    }
    return ranges.join(',');
}

// Main script logic
try {
    // Read questions
    const questionData: QuestionData = JSON.parse(readFileSync(QUESTIONS_PATH, 'utf-8'));
    const questions = questionData.questions;

    const ranges: Record<string, number[]> = {};

    // Process questions
    questions.forEach((q, index) => {
        const questionNumber = index + 1;
        const source = q.source;

        if (!source) {
            return; // Skip questions without a source
        }

        if (source.includes('UoBiA') || source.includes('uobia')) {
            const articleMatch = source.match(/art\.\s(\d+)/);
            if (articleMatch) {
                const article = parseInt(articleMatch[1], 10);
                const chapter = UOBIA_CHAPTERS.find(c => article >= c.start && article <= c.end);
                if (chapter) {
                    const rangeName = `UoBiA - ${chapter.name}`;
                    if (!ranges[rangeName]) {
                        ranges[rangeName] = [];
                    }
                    ranges[rangeName].push(questionNumber);
                }
            }
        } else if (source.includes('Kodeks karny')) {
            const rangeName = 'Kodeks karny';
            if (!ranges[rangeName]) {
                ranges[rangeName] = [];
            }
            ranges[rangeName].push(questionNumber);
        } else if (source.includes('Rozporządzenie') || source.includes('rozporządzenia')) {
            const rangeName = 'Rozporządzenia';
            if (!ranges[rangeName]) {
                ranges[rangeName] = [];
            }
            ranges[rangeName].push(questionNumber);
        }

    });

    // Create custom ranges array
    const customRanges: CustomRange[] = Object.keys(ranges).map(name => {
        const chapterInfo = UOBIA_CHAPTERS.find(c => name.includes(c.name));
        return {
            name,
            tip: chapterInfo ? chapterInfo.tip : name,
            range: compressRange(ranges[name])
        };
    });

    customRanges.sort((a, b) => a.name.localeCompare(b.name));

    // Write output file
    writeFileSync(OUTPUT_PATH, JSON.stringify(customRanges, null, 2));

    console.log(`Successfully generated custom ranges at: ${OUTPUT_PATH}`);

} catch (error) {
    console.error('Error generating custom ranges:', error);
    process.exit(1);
}
