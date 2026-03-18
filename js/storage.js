/**
 * storage.js
 * Centralized storage management for the E-Learning Platform.
 */

const Storage = {
    KEYS: {
        COMPLETED_COURSES: 'completedCourses',
        USER_PROFILE: 'userProfile',
        STREAK: 'userStreak',
        LAST_ACTIVITY: 'lastActivity',
        LESSONS: 'lessonProgress'
    },

    /**
     * Get learning progress from localStorage.
     */
    getProgress: function() {
        const stored = localStorage.getItem(this.KEYS.COMPLETED_COURSES);
        return stored ? JSON.parse(stored) : [];
    },

    /**
     * Save progress to localStorage.
     */
    saveProgress: function(completedCourses) {
        localStorage.setItem(this.KEYS.COMPLETED_COURSES, JSON.stringify(completedCourses));
    },

    /**
     * Save a specific quiz result.
     */
    saveQuizResult: function(courseId, scorePct) {
        let progress = this.getProgress();
        const existing = progress.find(c => c.id === courseId);
        
        if (existing) {
            if (scorePct > existing.score) {
                existing.score = scorePct;
            }
        } else {
            progress.push({
                id: courseId,
                score: scorePct,
                timestamp: new Date().toISOString()
            });
        }
        
        this.saveProgress(progress);
        this.updateStreak();
    },

    /**
     * Reset all progress.
     */
    resetProgress: function() {
        localStorage.removeItem(this.KEYS.COMPLETED_COURSES);
        localStorage.removeItem(this.KEYS.STREAK);
        localStorage.removeItem(this.KEYS.LAST_ACTIVITY);
    },

    /**
     * Update user streak logic.
     */
    updateStreak: function() {
        const today = new Date().toDateString();
        const lastActivity = localStorage.getItem(this.KEYS.LAST_ACTIVITY);
        let streak = parseInt(localStorage.getItem(this.KEYS.STREAK) || '0', 10);

        if (lastActivity === today) return; // Already updated today

        const lastDate = lastActivity ? new Date(lastActivity) : null;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDate && lastDate.toDateString() === yesterday.toDateString()) {
            streak++;
        } else {
            streak = 1;
        }

        localStorage.setItem(this.KEYS.STREAK, streak.toString());
        localStorage.setItem(this.KEYS.LAST_ACTIVITY, today);
    },

    getStreak: function() {
        return parseInt(localStorage.getItem(this.KEYS.STREAK) || '0', 10);
    },

    /**
     * Profile Management
     */
    saveProfile: function(profileData) {
        localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(profileData));
    },

    getProfile: function() {
        const stored = localStorage.getItem(this.KEYS.USER_PROFILE);
        return stored ? JSON.parse(stored) : { name: 'John Doe', email: 'john@example.com' };
    },

    /**
     * Lesson Progress
     */
    saveLessonStatus: function(courseId, lessonIndex, isCompleted) {
        let lessons = JSON.parse(localStorage.getItem(this.KEYS.LESSONS) || '{}');
        if (!lessons[courseId]) lessons[courseId] = {};
        lessons[courseId][lessonIndex] = isCompleted;
        localStorage.setItem(this.KEYS.LESSONS, JSON.stringify(lessons));
    },

    getLessonStatus: function(courseId) {
        let lessons = JSON.parse(localStorage.getItem(this.KEYS.LESSONS) || '{}');
        return lessons[courseId] || {};
    }
};

if (typeof window !== 'undefined') {
    window.Storage = Storage;
}
