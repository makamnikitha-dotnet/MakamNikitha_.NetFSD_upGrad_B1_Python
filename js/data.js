/**
 * data.js
 * Contains the course data and quiz questions for the E-Learning Platform.
 */

const coursesData = [
    {
        id: "c1",
        numericId: "1",
        title: "Introduction to Web Development",
        category: "Programming",
        difficulty: "Beginner",
        description: "Learn the basics of HTML, CSS, and JS to build your first website.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400",
        lessons: [
            "HTML Basics (15m)",
            "CSS Styling (20m)",
            "JS Variables (30m)",
            "Responsive Design (25m)"
        ],
        sneakPeek: [
            "HTML Tags & Structure",
            "CSS Selectors & Colors",
            "JavaScript Alert Logic"
        ]
    },
    { 
        id: "c2", 
        numericId: "2",
        title: "CSS Layouts & Flexbox", 
        category: "Design", 
        difficulty: "Intermediate",
        description: "Master modern layout techniques using Flexbox and CSS Grid.",
        image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=400",
        lessons: ["Box Model", "Flexbox Basics", "CSS Grid", "Positioning", "Responsive Design"],
        sneakPeek: [
            "Flex Containers",
            "Grid Item Placement",
            "Sticky vs Fixed"
        ]
    },
    { 
        id: "c3", 
        numericId: "3",
        title: "JavaScript Fundamentals", 
        category: "Programming", 
        difficulty: "Advanced",
        description: "Learn core JavaScript concepts: logic, functions, and the DOM.",
        image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=400",
        lessons: ["Variables & Types", "Control Flow", "Functions", "Arrays & Objects", "DOM Manipulation"],
        sneakPeek: [
            "Arrow Functions",
            "Array Methods",
            "Event Listeners"
        ]
    }
];

const quizQuestions = {
    "c1": [
        { text: "Which tag is used for the largest heading?", options: ["h6", "header", "h1", "head"], correctIndex: 2 },
        { text: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Main Logic", "Home Tool Markup Language"], correctIndex: 0 },
        { text: "Which element is used to create a hyperlink?", options: ["link", "a", "href", "url"], correctIndex: 1 },
        { text: "Which attribute provides alt text for an image?", options: ["title", "src", "alt", "longdesc"], correctIndex: 2 },
        { text: "How do you create an ordered list?", options: ["ul", "list", "ol", "dl"], correctIndex: 2 }
    ],
    "c2": [
        { text: "Which property is used to change the background color?", options: ["color", "bg-color", "background-color", "style"], correctIndex: 2 },
        { text: "How do you make the text bold in CSS?", options: ["font-weight: bold", "text-decoration: bold", "font-style: bold", "weight: bold"], correctIndex: 0 },
        { text: "In Flexbox, which property defines the main axis?", options: ["justify-content", "align-items", "flex-direction", "flex-wrap"], correctIndex: 2 },
        { text: "What is the default value of the position property?", options: ["relative", "fixed", "absolute", "static"], correctIndex: 3 },
        { text: "Which CSS property controls the text size?", options: ["text-style", "font-size", "text-size", "font-style"], correctIndex: 1 }
    ],
    "c3": [
        { text: "Which keyword is used to declare a constant variable?", options: ["var", "let", "const", "constant"], correctIndex: 2 },
        { text: "How do you write 'Hello World' in an alert box?", options: ["msg('Hello World')", "alert('Hello World')", "print('Hello World')", "console.log('Hello World')"], correctIndex: 1 },
        { text: "Which operator is used for strict equality?", options: ["=", "==", "===", "!="], correctIndex: 2 },
        { text: "How do you start a FOR loop?", options: ["for (i <= 5; i++)", "for i = 1 to 5", "for (let i = 0; i < 5; i++)", "for (let i = 0; i < 5)"], correctIndex: 2 },
        { text: "What is the correct way to write a JS array?", options: ["let c = 'r','g','b'", "let c = (1:'r')", "let c = ['r','g','b']", "let c = 1=('r')"], correctIndex: 2 }
    ]
};

if (typeof window !== 'undefined') {
    window.coursesData = coursesData;
    window.quizQuestions = quizQuestions;
}
