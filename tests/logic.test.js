// logic.test.js
const GradeCalculation = require('../js/logic');

describe('GradeCalculation Core Logic', () => {

    describe('calculatePercentage', () => {
        test('calculates correct percentage normally', () => {
            expect(GradeCalculation.calculatePercentage(8, 10)).toBe(80);
            expect(GradeCalculation.calculatePercentage(3, 3)).toBe(100);
            expect(GradeCalculation.calculatePercentage(0, 5)).toBe(0);
        });

        test('handles decimal values and rounds to nearest integer', () => {
            // 2/3 is 66.666...
            expect(GradeCalculation.calculatePercentage(2, 3)).toBe(67);
            // 1/3 is 33.333...
            expect(GradeCalculation.calculatePercentage(1, 3)).toBe(33);
        });

        test('returns 0 if totalQuestions is 0 to avoid Infinity/NaN', () => {
            expect(GradeCalculation.calculatePercentage(0, 0)).toBe(0);
        });
    });

    describe('calculateGrade', () => {
        test('returns A for 90 and above', () => {
            expect(GradeCalculation.calculateGrade(90)).toBe('A');
            expect(GradeCalculation.calculateGrade(100)).toBe('A');
        });

        test('returns B for 80 to 89', () => {
            expect(GradeCalculation.calculateGrade(80)).toBe('B');
            expect(GradeCalculation.calculateGrade(89)).toBe('B');
        });

        test('returns C for 70 to 79', () => {
            expect(GradeCalculation.calculateGrade(70)).toBe('C');
            expect(GradeCalculation.calculateGrade(79)).toBe('C');
        });

        test('returns D for 60 to 69', () => {
            expect(GradeCalculation.calculateGrade(60)).toBe('D');
            expect(GradeCalculation.calculateGrade(69)).toBe('D');
        });

        test('returns F for below 60', () => {
            expect(GradeCalculation.calculateGrade(59)).toBe('F');
            expect(GradeCalculation.calculateGrade(0)).toBe('F');
        });
    });

    describe('isPassing', () => {
        test('returns true for score >= 70', () => {
            expect(GradeCalculation.isPassing(70)).toBe(true);
            expect(GradeCalculation.isPassing(85)).toBe(true);
            expect(GradeCalculation.isPassing(100)).toBe(true);
        });

        test('returns false for score < 70', () => {
            expect(GradeCalculation.isPassing(69)).toBe(false);
            expect(GradeCalculation.isPassing(50)).toBe(false);
            expect(GradeCalculation.isPassing(0)).toBe(false);
        });
    });

    describe('getFeedbackMessage', () => {
        test('returns correct message based on grade using switch statement', () => {
            expect(GradeCalculation.getFeedbackMessage('A')).toContain("Excellent");
            expect(GradeCalculation.getFeedbackMessage('B')).toContain("Good job");
            expect(GradeCalculation.getFeedbackMessage('C')).toContain("Fair");
            expect(GradeCalculation.getFeedbackMessage('D')).toContain("Needs improvement");
            expect(GradeCalculation.getFeedbackMessage('F')).toContain("Failed");
            // Default edge case
            expect(GradeCalculation.getFeedbackMessage('Z')).toContain("Failed");
        });
    });

});
