/**
 * app.js
 * Main application logic for the E-Learning Platform.
 */

document.addEventListener('DOMContentLoaded', () => {
    appLogic.init();
});

const appLogic = {
    state: {
        completedCourses: [],
        currentQuizCourseId: null
    },

    showToast: function(title, message, isError = false) {
        const toastContainer = document.getElementById('toastPlacement');
        if (!toastContainer) return;

        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-white bg-${isError ? 'danger' : 'success'} border-0`;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <strong>${title}</strong><br>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        toastContainer.appendChild(toastEl);
        const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
        toast.show();
        
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    },

    init: function() {
        this.loadState();
        this.initGlobalSearch();
        
        const path = window.location.pathname.toLowerCase();
        if (path.includes('dashboard.html') || path === '/' || path.endsWith('/')) {
            this.initDashboard();
            this.initStudyTimer();
        } else if (path.includes('courses.html')) {
            this.initCourses();
        } else if (path.includes('quiz.html')) {
            this.initQuiz();
        } else if (path.includes('profile.html')) {
            this.initProfile();
        }
    },

    initGlobalSearch: function() {
        const searchInput = document.getElementById('nav-search-input');
        const searchForm = document.getElementById('nav-search-form');

        if (!searchInput || !searchForm) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const path = window.location.pathname.toLowerCase();
            
            if (path.includes('courses.html')) {
                this.renderCourses(query);
            }
        });

        searchForm.onsubmit = (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query && !window.location.pathname.toLowerCase().includes('courses.html')) {
                window.location.href = `Courses.html?search=${encodeURIComponent(query)}`;
            }
        };

        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam && window.location.pathname.toLowerCase().includes('courses.html')) {
            searchInput.value = searchParam;
        }
    },

    loadState: function() {
        this.state.completedCourses = window.Storage.getProgress();
    },

    saveState: function() {
        window.Storage.saveProgress(this.state.completedCourses);
    },

    markCourseComplete: function(courseId, scorePct) {
        window.Storage.saveQuizResult(courseId, scorePct);
        this.loadState();
    },

    initDashboard: function() {
        const totalCourses = window.coursesData.length;
        const completedCount = this.state.completedCourses.length;
        const progressPct = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

        const progressText = document.getElementById('overall-progress-text');
        const progressBar = document.getElementById('overall-progress-bar');
        
        if (progressText) progressText.innerText = `${progressPct}% Complete`;
        if (progressBar) {
            progressBar.style.width = `${progressPct}%`;
            progressBar.setAttribute('aria-valuenow', progressPct);
        }

        // Calculate In Progress Courses & Next Lesson
        const lessonProgress = JSON.parse(localStorage.getItem('lessonProgress') || '{}');
        let inProgressCount = 0;
        let nextLessonTitle = "Browse Courses";
        let nextCourseId = null;

        window.coursesData.forEach(course => {
            const isCompleted = this.state.completedCourses.some(c => c.id === course.id);
            if (!isCompleted) {
                const status = lessonProgress[course.id] || {};
                const lessonsStarted = Object.values(status).some(val => val === true);
                if (lessonsStarted) {
                    inProgressCount++;
                    if (!nextCourseId) {
                        nextCourseId = course.id;
                        const nextLessonIdx = course.lessons.findIndex((_, i) => !status[i]);
                        nextLessonTitle = nextLessonIdx !== -1 ? course.lessons[nextLessonIdx] : "Quiz Ready";
                    }
                }
            }
        });

        const inProgressBadgeText = document.getElementById('in-progress-badge-text');
        if (inProgressBadgeText) {
            inProgressBadgeText.innerText = inProgressCount > 0 ? `${inProgressCount} Courses In Progress` : 'In Progress';
        }

        const nextLessonEl = document.getElementById('next-lesson-title');
        if (nextLessonEl) nextLessonEl.innerText = nextLessonTitle;

        const resumeBtn = document.getElementById('resume-learning-btn');
        if (resumeBtn && nextCourseId) {
            resumeBtn.href = `Courses.html?id=${nextCourseId}`;
        }

        // Render Weekly Chart
        this.renderWeeklyChart();

        const achievementsCourses = document.getElementById('achievements-courses');
        const achievementsQuizzes = document.getElementById('achievements-quizzes');
        const achievementsScore = document.getElementById('achievements-score');
        const achievementsStreak = document.getElementById('current-streak-val');
        const lastQuizEl = document.getElementById('activity-last-quiz');
        
        if (achievementsCourses) achievementsCourses.innerText = completedCount;
        if (achievementsQuizzes) achievementsQuizzes.innerText = completedCount;
        
        let totalScore = 0;
        this.state.completedCourses.forEach(c => totalScore += c.score || 0);
        if (achievementsScore) achievementsScore.innerText = totalScore;
        
        const streak = window.Storage.getStreak ? window.Storage.getStreak() : 0;
        if (achievementsStreak) {
            achievementsStreak.innerText = `${streak} ${streak === 1 ? 'day' : 'days'}`;
        }

        if (lastQuizEl && completedCount > 0) {
            const lastComp = this.state.completedCourses[this.state.completedCourses.length - 1];
            if (lastComp.timestamp) {
                const date = new Date(lastComp.timestamp);
                lastQuizEl.innerText = `Last Quiz: ${date.toLocaleDateString('en-GB')}`;
            }
        }

        // Update Nav User Initial
        const navUserAvatar = document.getElementById('nav-user-avatar');
        if (navUserAvatar) {
            const profile = window.Storage.getProfile();
            if (profile && profile.name) {
                navUserAvatar.innerText = profile.name.charAt(0).toUpperCase();
            }
        }

        this.renderRecommendedCourses();
    },

    renderWeeklyChart: function() {
        const container = document.getElementById('weekly-study-bars');
        if (!container) return;
        container.innerHTML = '';
        
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const mockData = [15, 22, 10, 35, 12, 18]; // Minutes for last 6 days
        
        // Today's data
        const todayMinutes = Math.floor(this.state.studyTime / 60);
        const data = [...mockData, todayMinutes];
        
        const maxMins = 60; // Max height represents 60 mins
        
        data.forEach((mins, i) => {
            const barItem = document.createElement('div');
            barItem.className = 'bar-item';
            
            const heightPct = Math.min((mins / maxMins) * 100, 100);
            
            barItem.innerHTML = `
                <div class="bar-fill" style="height: ${heightPct}%;" data-value="${mins}m"></div>
                <div class="bar-label">${days[i]}</div>
            `;
            
            container.appendChild(barItem);
        });

        const avg = Math.round(data.reduce((a, b) => a + b, 0) / 7);
        const avgText = document.getElementById('weekly-avg-text');
        if (avgText) avgText.innerText = `Avg: ${avg}m`;
    },

    renderRecommendedCourses: function() {
        const grid = document.getElementById('dashboard-courses-grid');
        if (!grid) return;
        grid.innerHTML = '';

        // Use first 3 courses as recommended
        window.coursesData.slice(0, 3).forEach((course, index) => {
            const courseImages = ['assets/course-web.png', 'assets/course-css.png', 'assets/course-js.png'];
            const colors = ['blue', 'purple', 'green'];
            const levels = ['Beginner', 'Intermediate', 'Advanced'];
            
            const image = courseImages[index % courseImages.length];
            const color = colors[index % colors.length];
            const level = levels[index % levels.length];

            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6';
            
            col.innerHTML = `
                <div class="course-card course-card-${color}">
                    <div class="course-icon-box bg-white overflow-hidden p-0" style="background: white !important;">
                        <img src="${image}" alt="${course.title}" class="w-100 h-100" style="object-fit: contain; padding: 5px;">
                    </div>
                    <h1 class="h5 fw-bold mb-2">${course.title}</h1>
                    <div>
                        <span class="course-category">${course.category}</span>
                    </div>
                    <p class="course-description">${course.description}</p>
                    <div class="course-footer">
                        <div class="course-level">
                            <i class="fa-solid fa-signal text-success me-1" style="font-size: 0.8rem;"></i>
                            ${level}
                        </div>
                        <a href="Courses.html?id=${course.id}" class="btn-start btn-start-${color} text-decoration-none">
                            Start Now <i class="fa-solid fa-arrow-right ms-1" style="font-size: 0.8rem;"></i>
                        </a>
                    </div>
                </div>
            `;
            grid.appendChild(col);
        });
    },

    initStudyTimer: function() {
        const timerEl = document.getElementById('study-time-val');
        if (!timerEl) return;
        let seconds = 0;
        setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerEl.innerText = `${mins}m ${secs.toString().padStart(2, '0')}s`;
        }, 1000);
    },

    initCourses: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search') || '';
        this.renderCourses(searchParam);
    },

    renderCourses: function(filter = '') {
        const tbody = document.getElementById('courses-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        const filtered = window.coursesData.filter(c => 
            c.title.toLowerCase().includes(filter.toLowerCase()) || 
            c.category.toLowerCase().includes(filter.toLowerCase()) ||
            c.description.toLowerCase().includes(filter.toLowerCase())
        );

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="text-center py-5 text-secondary">No courses found matching "${filter}"</td></tr>`;
            return;
        }

        filtered.forEach(course => {
            const tr = document.createElement('tr');
            const lessonStatus = window.Storage.getLessonStatus(course.id);
            
            let lessonsStr = course.lessons.map((lesson, idx) => {
                const isChecked = lessonStatus[idx] ? 'checked' : '';
                return `
                <li class="text-secondary fs-sm mb-2 d-flex align-items-center">
                    <div class="form-check">
                        <input class="form-check-input lesson-check" type="checkbox" data-course-id="${course.id}" data-lesson-idx="${idx}" id="check-${course.id}-${idx}" ${isChecked}>
                        <label class="form-check-label ms-1" for="check-${course.id}-${idx}">${idx+1}. ${lesson}</label>
                    </div>
                </li>`;
            }).join('');
            
            tr.innerHTML = `
                <td class="py-4 px-4 text-center"><span class="fw-medium text-dark">#${course.numericId}</span></td>
                <td class="py-4 px-4"><span class="badge bg-secondary px-2 py-1">${course.category}</span></td>
                <td class="py-4 px-4">
                    <h5 class="fw-bold text-dark mb-1">${course.title}</h5>
                    <p class="text-secondary fs-sm mb-3">${course.description}</p>
                    <h6 class="fw-bold fs-sm text-dark mb-2">Lessons:</h6>
                    <ul class="list-unstyled mb-0">${lessonsStr}</ul>
                    <div class="mt-4">
                        <a href="Quiz.html?courseId=${course.id}" class="btn btn-outline-primary px-4 fw-medium">Take Quiz</a>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.lesson-check').forEach(check => {
            check.addEventListener('change', (e) => {
                const cid = e.target.getAttribute('data-course-id');
                const lidx = e.target.getAttribute('data-lesson-idx');
                window.Storage.saveLessonStatus(cid, lidx, e.target.checked);
                if (e.target.checked) this.showToast('Great Progress!', 'Lesson marked as completed.', false);
            });
        });
    },

    initQuiz: function() {
        const urlParams = new URLSearchParams(window.location.search);
        this.state.currentQuizCourseId = urlParams.get('courseId');

        if (!this.state.currentQuizCourseId && window.coursesData.length > 0) {
            this.state.currentQuizCourseId = window.coursesData[0].id;
            window.history.replaceState(null, '', `Quiz.html?courseId=${this.state.currentQuizCourseId}`);
        }

        const course = window.coursesData.find(c => c.id === this.state.currentQuizCourseId);
        const questions = window.quizQuestions[this.state.currentQuizCourseId];

        if (!course || !questions) {
            window.location.href = "Courses.html";
            return;
        }

        const titleEl = document.getElementById('quiz-course-name');
        const breadEl = document.getElementById('quiz-breadcrumb-name');
        if (titleEl) titleEl.innerText = course.title;
        if (breadEl) breadEl.innerText = course.title;

        new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
            const loader = document.getElementById('quiz-loading-container');
            const content = document.getElementById('quiz-content-container');
            if (loader) loader.classList.add('d-none');
            if (content) content.style.display = 'block';

            this.renderQuizQuestions(questions);
            const form = document.getElementById('quiz-form');
            if(form) form.onsubmit = (e) => { e.preventDefault(); this.handleQuizSubmit(form, questions, course); };
        });
    },

    renderQuizQuestions: function(questions) {
        const container = document.getElementById('questions-container');
        if (!container) return;
        container.innerHTML = '';

        questions.forEach((q, index) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'card border-0 shadow-sm mb-4 custom-hover-card';
            let optionsHtml = q.options.map((opt, optIndex) => `
                <div class="form-check custom-radio-box position-relative d-flex align-items-center p-3 mb-2 rounded border transition-base">
                    <input class="form-check-input m-0 me-3 flex-shrink-0" type="radio" name="question${index}" id="q${index}_opt${optIndex}" value="${optIndex}" required>
                    <label class="form-check-label w-100 stretched-link text-dark mb-0" for="q${index}_opt${optIndex}" style="cursor: pointer;">${opt}</label>
                </div>`).join('');

            qDiv.innerHTML = `
                <div class="card-body p-4">
                    <h5 class="card-title fw-bold text-dark mb-4 d-flex align-items-center justify-content-between">
                        <span><span class="text-primary me-2">Q${index+1}:</span> ${q.text}</span>
                        <div id="feedback-q${index}" class="fs-6 fw-bold"></div>
                    </h5>
                    <div>${optionsHtml}</div>
                </div>`;
            container.appendChild(qDiv);

            qDiv.querySelectorAll('input[type="radio"]').forEach(btn => {
                btn.onchange = () => {
                    const sel = parseInt(btn.value);
                    const feed = document.getElementById(`feedback-q${index}`);
                    const box = btn.closest('.custom-radio-box');
                    qDiv.querySelectorAll('.custom-radio-box').forEach(b => { 
                        b.classList.remove('option-correct', 'option-incorrect'); 
                        const icon = b.querySelector('.feedback-icon'); if (icon) icon.remove(); 
                    });
                    if (sel === q.correctIndex) {
                        feed.innerHTML = '<span class="text-success">Correct</span>';
                        box.classList.add('option-correct');
                        
                        // Create and append icon instead of using innerHTML +=
                        const icon = document.createElement('i');
                        icon.className = 'fa-solid fa-check feedback-icon text-success';
                        box.appendChild(icon);
                    } else {
                        feed.innerHTML = '<span class="text-danger">Incorrect</span>';
                        box.classList.add('option-incorrect');
                        
                        // Create and append icon instead of using innerHTML +=
                        const icon = document.createElement('i');
                        icon.className = 'fa-solid fa-xmark feedback-icon text-danger';
                        box.appendChild(icon);
                    }
                };
            });
        });
    },

    handleQuizSubmit: function(form, questions, course) {
        const formData = new FormData(form);
        let score = 0;
        questions.forEach((q, i) => { if (parseInt(formData.get(`question${i}`)) === q.correctIndex) score++; });

        const pct = window.GradeCalculation.calculatePercentage(score, questions.length);
        const grade = window.GradeCalculation.calculateGrade(pct);
        const isPass = window.GradeCalculation.isPassing(pct);

        if (isPass) {
            this.markCourseComplete(course.id, pct);
            this.showToast('Congratulations!', `You passed the ${course.title} quiz!`, false);
        }

        const content = document.getElementById('quiz-content-container');
        const results = document.getElementById('quiz-results-container');
        if (content) content.classList.add('d-none');
        if (results) {
            results.style.display = 'block';
            if (!document.getElementById('retry-quiz-btn')) {
                const btn = document.createElement('button');
                btn.id = 'retry-quiz-btn';
                btn.className = 'btn btn-outline-primary fw-medium mt-4 px-5 py-2';
                btn.innerText = 'Retry Quiz';
                btn.onclick = () => window.location.reload();
                results.appendChild(btn);
            }
        }

        const scoreEl = document.getElementById('result-score-percentage');
        const gradeEl = document.getElementById('result-grade');
        if (scoreEl) { scoreEl.innerText = `${pct}%`; scoreEl.className = `display-3 fw-bold mb-2 ${isPass ? 'text-success' : 'text-danger'}`; }
        if (gradeEl) gradeEl.innerText = `Grade: ${grade}`;
        if (document.getElementById('result-feedback-message')) document.getElementById('result-feedback-message').innerText = window.GradeCalculation.getFeedbackMessage(grade);
    },

    initProfile: function() {
        const profile = window.Storage.getProfile();
        const completedCourses = this.state.completedCourses;
        const totalCourses = window.coursesData.length;

        // Populate User Info
        const nameEl = document.getElementById('profile-name');
        const emailEl = document.getElementById('profile-email');
        const initialsEl = document.getElementById('profile-initials');
        const settingsName = document.getElementById('settings-name');
        const settingsEmail = document.getElementById('settings-email');

        if (nameEl) nameEl.innerText = profile.name;
        if (emailEl) emailEl.innerText = profile.email;
        if (initialsEl) initialsEl.innerText = profile.name.split(' ').map(n=>n[0]).join('').toUpperCase().substring(0,2);
        if (settingsName) settingsName.value = profile.name;
        if (settingsEmail) settingsEmail.value = profile.email;

        // Populate Statistics
        const statsEnrolled = document.getElementById('stats-enrolled');
        const statsCompleted = document.getElementById('stats-completed');
        const statsQuizzes = document.getElementById('stats-quizzes');
        const statsScore = document.getElementById('stats-score');

        if (statsEnrolled) statsEnrolled.innerText = totalCourses; // Assuming enrolled in all for now
        if (statsCompleted) statsCompleted.innerText = completedCourses.length;
        if (statsQuizzes) statsQuizzes.innerText = completedCourses.length;
        
        let avgScore = 0;
        if (completedCourses.length > 0) {
            const sum = completedCourses.reduce((acc, curr) => acc + curr.score, 0);
            avgScore = Math.round(sum / completedCourses.length);
        }
        if (statsScore) statsScore.innerText = `${avgScore}%`;

        // Render Completed Courses
        const completedList = document.getElementById('completed-courses-list');
        if (completedList && completedCourses.length > 0) {
            completedList.innerHTML = '';
            completedCourses.forEach(comp => {
                const course = window.coursesData.find(c => c.id === comp.id);
                if (course) {
                    const row = document.createElement('div');
                    row.className = 'd-flex justify-content-between align-items-center mb-3 pb-3 border-bottom';
                    row.innerHTML = `
                        <div>
                            <h6 class="fw-bold mb-0">${course.title}</h6>
                            <small class="text-secondary">${course.category}</small>
                        </div>
                        <span class="btn btn-sm btn-success px-3 fw-bold disabled" style="opacity: 1; font-size: 0.75rem;">Completed</span>
                    `;
                    completedList.appendChild(row);
                }
            });
        }

        // Render Quiz History
        const quizHistoryList = document.getElementById('quiz-history-list');
        if (quizHistoryList && completedCourses.length > 0) {
            // Keep the header bar, remove empty state
            const header = quizHistoryList.querySelector('.quiz-header-bar');
            quizHistoryList.innerHTML = '';
            quizHistoryList.appendChild(header);

            completedCourses.forEach(comp => {
                const date = new Date(comp.timestamp).toLocaleDateString('en-GB');
                const row = document.createElement('div');
                row.className = 'quiz-row-item';
                row.innerHTML = `
                    <div class="quiz-col-date quiz-data-text">${date}</div>
                    <div class="quiz-col-score quiz-data-text">${comp.score}%</div>
                    <div class="quiz-col-grade quiz-data-text">${window.GradeCalculation.calculateGrade(comp.score)}</div>
                    <div class="quiz-col-status text-success fw-bold">Passed</div>
                `;
                quizHistoryList.appendChild(row);
            });
        }

        // Handle Account Settings Form
        const settingsForm = document.getElementById('account-settings-form');
        if (settingsForm) {
            settingsForm.onsubmit = (e) => {
                e.preventDefault();
                const newName = settingsName.value.trim();
                const newEmail = settingsEmail.value.trim();

                if (newName && newEmail) {
                    window.Storage.saveProfile({ name: newName, email: newEmail });
                    this.showToast('Success', 'Settings Updated! Your profile has been updated.', false);
                    if (nameEl) nameEl.innerText = newName;
                    if (emailEl) emailEl.innerText = newEmail;
                    if (initialsEl) initialsEl.innerText = newName.split(' ').map(n=>n[0]).join('').toUpperCase().substring(0,2);
                }
            };
        }

        // Reset Progress
        const resetBtn = document.getElementById('reset-progress-btn');
        if (resetBtn) {
            resetBtn.onclick = (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                    window.Storage.resetProgress();
                    this.showToast('Success', 'Progress cleared', false);
                    setTimeout(() => location.reload(), 1000);
                }
            };
        }
    }
};
