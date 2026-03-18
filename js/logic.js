// logic.js
// Pure functions for testable calculations

const GradeCalculation = {
    /**
     * Calculate score percentage.
     * @param {number} score - The number of correct answers.
     * @param {number} totalQuestions - The total number of questions.
     * @returns {number} Percentage between 0 and 100.
     */
    calculatePercentage: function(score, totalQuestions) {
        if (totalQuestions === 0) return 0;
        return Math.round((score / totalQuestions) * 100);
    },

    /**
     * Determines the grade based on the percentage using if-else logic.
     * @param {number} percentage - The percentage score.
     * @returns {string} The letter grade (A, B, C, D, or F).
     */
    calculateGrade: function(percentage) {
        if (percentage >= 90) {
            return 'A';
        } else if (percentage >= 80) {
            return 'B';
        } else if (percentage >= 70) {
            return 'C';
        } else if (percentage >= 60) {
            return 'D';
        } else {
            return 'F';
        }
    },

    /**
     * Uses switch statement for performance feedback messages.
     * @param {string} grade - The letter grade.
     * @returns {string} Feedback message.
     */
    getFeedbackMessage: function(grade) {
        switch (grade) {
            case 'A':
                return "Excellent work! You have mastered this material.";
            case 'B':
                return "Good job! You have a solid understanding.";
            case 'C':
                return "Fair. Consider reviewing some of the concepts.";
            case 'D':
                return "Needs improvement. Please review the course lessons.";
            case 'F':
            default:
                return "Failed. Don't give up! Review the material and try again.";
        }
    },

    /**
     * Pass/fail determination logic.
     * A score of 70% or higher is considered passing.
     * @param {number} percentage - The percentage score.
     * @returns {boolean} True if passed, false otherwise.
     */
    isPassing: function(percentage) {
        return percentage >= 70;
    }
};

// Export for Node.js (Jest testing) or attach to window for browser
if (typeof window !== 'undefined') {
    window.GradeCalculation = GradeCalculation;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GradeCalculation;
}
