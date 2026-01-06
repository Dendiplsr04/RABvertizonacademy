// Mini Game: Tebak Harga Properti
import { quizData, quizConfig, resultMessages } from '../data/quiz-data.js';

class PropertyQuizGame {
  constructor() {
    this.currentQuestion = 0;
    this.score = 0;
    this.timeLeft = quizConfig.timePerQuestion;
    this.timer = null;
    this.questions = [];
    this.isPlaying = false;
    this.answered = false;
  }

  // Shuffle and pick random questions
  initQuestions() {
    const shuffled = [...quizData].sort(() => Math.random() - 0.5);
    this.questions = shuffled.slice(0, quizConfig.questionsPerGame);
  }

  // Format price to Rupiah
  formatPrice(num) {
    if (num >= 1000000000) {
      return `Rp ${(num / 1000000000).toFixed(1)}M`;
    }
    return `Rp ${(num / 1000000).toFixed(0)}jt`;
  }

  // Start the game
  start() {
    this.currentQuestion = 0;
    this.score = 0;
    this.isPlaying = true;
    this.initQuestions();
    this.showQuestion();
  }

  // Show current question
  showQuestion() {
    if (this.currentQuestion >= this.questions.length) {
      this.showResult();
      return;
    }

    this.answered = false;
    this.timeLeft = quizConfig.timePerQuestion;
    const q = this.questions[this.currentQuestion];
    
    // Shuffle options
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);

    const content = document.getElementById('quiz-content');
    content.innerHTML = `
      <div class="quiz-progress">
        <div class="quiz-progress-bar" style="width: ${((this.currentQuestion) / this.questions.length) * 100}%"></div>
      </div>
      <div class="quiz-header">
        <span class="quiz-question-num">Soal ${this.currentQuestion + 1}/${this.questions.length}</span>
        <span class="quiz-score">Skor: ${this.score}</span>
      </div>
      <div class="quiz-timer">
        <div class="timer-circle">
          <svg viewBox="0 0 36 36">
            <path class="timer-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path class="timer-progress" id="timer-progress" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
          </svg>
          <span class="timer-text" id="timer-text">${this.timeLeft}</span>
        </div>
      </div>
      <div class="quiz-property">
        <div class="property-image">${q.image}</div>
        <div class="property-info">
          <h3 class="property-type">${q.type}</h3>
          <p class="property-location">📍 ${q.location}</p>
          <p class="property-specs">${q.specs}</p>
          <p class="property-features">${q.features}</p>
          <p class="property-hint">💡 ${q.hint}</p>
        </div>
      </div>
      <p class="quiz-question">Berapa harga properti ini?</p>
      <div class="quiz-options">
        ${shuffledOptions.map((opt, i) => `
          <button class="quiz-option" data-price="${opt}">
            ${this.formatPrice(opt)}
          </button>
        `).join('')}
      </div>
    `;

    // Add click handlers
    content.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleAnswer(e));
    });

    // Start timer
    this.startTimer();
  }

  // Start countdown timer
  startTimer() {
    const timerProgress = document.getElementById('timer-progress');
    const timerText = document.getElementById('timer-text');
    const circumference = 100;

    this.timer = setInterval(() => {
      this.timeLeft--;
      timerText.textContent = this.timeLeft;
      
      const progress = (this.timeLeft / quizConfig.timePerQuestion) * circumference;
      timerProgress.style.strokeDashoffset = circumference - progress;

      if (this.timeLeft <= 5) {
        timerText.classList.add('timer-warning');
      }

      if (this.timeLeft <= 0) {
        this.handleTimeout();
      }
    }, 1000);
  }

  // Handle answer selection
  handleAnswer(e) {
    if (this.answered) return;
    this.answered = true;
    clearInterval(this.timer);

    const selectedPrice = parseInt(e.target.dataset.price);
    const correctPrice = this.questions[this.currentQuestion].actualPrice;
    const isCorrect = selectedPrice === correctPrice;

    // Calculate score
    if (isCorrect) {
      const timeBonus = Math.min(this.timeLeft * quizConfig.bonusPerSecond, quizConfig.maxBonus);
      this.score += quizConfig.pointsCorrect + timeBonus;
    }

    // Show feedback
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => {
      const price = parseInt(opt.dataset.price);
      if (price === correctPrice) {
        opt.classList.add('correct');
      } else if (price === selectedPrice && !isCorrect) {
        opt.classList.add('wrong');
      }
      opt.disabled = true;
    });

    // Show feedback message
    const feedback = document.createElement('div');
    feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedback.innerHTML = isCorrect 
      ? `✅ Benar! +${quizConfig.pointsCorrect + Math.min(this.timeLeft * quizConfig.bonusPerSecond, quizConfig.maxBonus)} poin`
      : `❌ Salah! Harga sebenarnya: ${this.formatPrice(correctPrice)}`;
    document.querySelector('.quiz-options').after(feedback);

    // Next question after delay
    setTimeout(() => {
      this.currentQuestion++;
      this.showQuestion();
    }, 2000);
  }

  // Handle timeout
  handleTimeout() {
    if (this.answered) return;
    this.answered = true;
    clearInterval(this.timer);

    const correctPrice = this.questions[this.currentQuestion].actualPrice;

    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => {
      const price = parseInt(opt.dataset.price);
      if (price === correctPrice) {
        opt.classList.add('correct');
      }
      opt.disabled = true;
    });

    const feedback = document.createElement('div');
    feedback.className = 'quiz-feedback timeout';
    feedback.innerHTML = `⏰ Waktu habis! Harga sebenarnya: ${this.formatPrice(correctPrice)}`;
    document.querySelector('.quiz-options').after(feedback);

    setTimeout(() => {
      this.currentQuestion++;
      this.showQuestion();
    }, 2000);
  }

  // Show final result
  showResult() {
    this.isPlaying = false;
    const maxScore = this.questions.length * (quizConfig.pointsCorrect + quizConfig.maxBonus);
    
    let result;
    if (this.score >= resultMessages.perfect.minScore) {
      result = resultMessages.perfect;
    } else if (this.score >= resultMessages.great.minScore) {
      result = resultMessages.great;
    } else if (this.score >= resultMessages.good.minScore) {
      result = resultMessages.good;
    } else {
      result = resultMessages.learning;
    }

    const content = document.getElementById('quiz-content');
    content.innerHTML = `
      <div class="quiz-result">
        <div class="result-icon">${result.title.split(' ')[0]}</div>
        <h2 class="result-title">${result.title}</h2>
        <div class="result-score">
          <span class="score-number" id="animated-score">0</span>
          <span class="score-max">/ ${maxScore}</span>
        </div>
        <p class="result-message">${result.message}</p>
        <div class="result-actions">
          <button class="btn-play-again" id="btn-play-again">
            🔄 Main Lagi
          </button>
          <button class="btn-share" id="btn-share">
            📤 Share ke WhatsApp
          </button>
        </div>
        <p class="result-cta">
          Mau jago tebak harga properti?<br>
          <strong>Ikuti Super Boot Camp Vertizon Academy!</strong>
        </p>
      </div>
    `;

    // Animate score
    this.animateScore(this.score);

    // Add button handlers
    document.getElementById('btn-play-again').addEventListener('click', () => this.start());
    document.getElementById('btn-share').addEventListener('click', () => this.shareResult());

    // Trigger confetti if good score
    if (this.score >= resultMessages.good.minScore) {
      this.triggerConfetti();
    }
  }

  // Animate score counting
  animateScore(target) {
    const el = document.getElementById('animated-score');
    let current = 0;
    const increment = Math.ceil(target / 30);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 30);
  }

  // Share to WhatsApp
  shareResult() {
    const text = `🎮 Skor Tebak Harga Properti: ${this.score} poin!%0A%0AMau coba juga? Main di:%0Ahttps://rab-vertizonacademy.vercel.app%0A%0A📚 Vertizon Academy Super Boot Camp%0A15-16 Januari 2026`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  // Trigger confetti effect
  triggerConfetti() {
    const colors = ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#8b5cf6'];
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
      }, i * 50);
    }
  }
}

// Initialize game
let game = null;

export function initMiniGame() {
  game = new PropertyQuizGame();
  
  // Create game button
  const gameBtn = document.createElement('button');
  gameBtn.className = 'mini-game-btn';
  gameBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <circle cx="8" cy="12" r="2"/>
      <path d="M15 9v6M12 12h6"/>
    </svg>
    Main Game
  `;
  document.body.appendChild(gameBtn);

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'quiz-modal';
  modal.innerHTML = `
    <div class="quiz-modal-content">
      <button class="quiz-close" id="quiz-close">×</button>
      <div class="quiz-intro" id="quiz-intro">
        <div class="quiz-intro-icon">🏠</div>
        <h2>Tebak Harga Properti</h2>
        <p>Uji ketajaman market sense kamu!</p>
        <ul class="quiz-rules">
          <li>⏱️ ${quizConfig.timePerQuestion} detik per soal</li>
          <li>❓ ${quizConfig.questionsPerGame} pertanyaan</li>
          <li>💰 +${quizConfig.pointsCorrect} poin per jawaban benar</li>
          <li>⚡ Bonus waktu hingga +${quizConfig.maxBonus} poin</li>
        </ul>
        <button class="btn-start-quiz" id="btn-start-quiz">
          🚀 Mulai Main!
        </button>
      </div>
      <div class="quiz-game" id="quiz-content" style="display:none;"></div>
    </div>
  `;
  document.body.appendChild(modal);

  // Event listeners
  gameBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.getElementById('quiz-intro').style.display = 'block';
    document.getElementById('quiz-content').style.display = 'none';
  });

  document.getElementById('quiz-close').addEventListener('click', () => {
    modal.classList.remove('active');
    if (game.timer) clearInterval(game.timer);
  });

  document.getElementById('btn-start-quiz').addEventListener('click', () => {
    document.getElementById('quiz-intro').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    game.start();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      if (game.timer) clearInterval(game.timer);
    }
  });
}
