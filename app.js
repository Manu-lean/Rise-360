class LearningApp {
    constructor() {
        this.activities = ['flashcards', 'sorting', 'quiz'];
        this.currentActivityIndex = 0;
        this.scores = {
            flashcards: 0,
            sorting: 0,
            quiz: 0
        };
        this.progress = {
            flashcards: false,
            sorting: false,
            quiz: false
        };

        this.init();
    }

    init() {
        this.loadState();
        this.setupEventListeners();
        this.updateUI();
    }

    loadState() {
        const savedState = localStorage.getItem('learningState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.scores = state.scores || this.scores;
            this.progress = state.progress || this.progress;
            this.currentActivityIndex = state.currentActivityIndex || 0;
        }
    }

    saveState() {
        const state = {
            scores: this.scores,
            progress: this.progress,
            currentActivityIndex: this.currentActivityIndex
        };
        localStorage.setItem('learningState', JSON.stringify(state));
    }

    setupEventListeners() {
        document.getElementById('nextActivity').addEventListener('click', () => this.nextActivity());
        document.getElementById('prevActivity').addEventListener('click', () => this.prevActivity());

        // Écouter les messages des iframes
        window.addEventListener('message', (event) => {
            if (event.data.type === 'score') {
                this.updateScore(event.data.activity, event.data.score);
            }
        });
    }

    updateScore(activity, score) {
        this.scores[activity] = score;
        this.progress[activity] = true;
        this.saveState();
        this.updateUI();
    }

    updateUI() {
        // Mettre à jour la barre de progression
        const totalProgress = Object.values(this.progress).filter(Boolean).length;
        const progressPercentage = (totalProgress / this.activities.length) * 100;
        document.getElementById('globalProgress').style.width = `${progressPercentage}%`;

        // Mettre à jour le score global
        const totalScore = Object.values(this.scores).reduce((a, b) => a + b, 0);
        document.getElementById('globalScore').textContent = totalScore;

        // Mettre à jour les boutons de navigation
        document.getElementById('prevActivity').disabled = this.currentActivityIndex === 0;
        document.getElementById('nextActivity').disabled = this.currentActivityIndex === this.activities.length - 1;

        // Afficher/masquer les activités
        this.activities.forEach((activity, index) => {
            const element = document.getElementById(activity);
            element.style.display = index === this.currentActivityIndex ? 'block' : 'none';
        });
    }

    nextActivity() {
        if (this.currentActivityIndex < this.activities.length - 1) {
            this.currentActivityIndex++;
            this.updateUI();
        }
    }

    prevActivity() {
        if (this.currentActivityIndex > 0) {
            this.currentActivityIndex--;
            this.updateUI();
        }
    }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    new LearningApp();
}); 