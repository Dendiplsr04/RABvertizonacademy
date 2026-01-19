export class UIManager {
  constructor() {
    this.handIndicator = null;
    this.propertyPanel = null;
    this.messageTimeout = null;
  }

  init() {
    this.handIndicator = document.getElementById('hand-indicator');
    this.propertyPanel = document.querySelector('.property-panel');
  }

  updateHandStatus(isDetected) {
    if (!this.handIndicator) return;

    if (isDetected) {
      this.handIndicator.classList.add('active');
      this.handIndicator.querySelector('.status-text').textContent = 'Hand detected';
    } else {
      this.handIndicator.classList.remove('active');
      this.handIndicator.querySelector('.status-text').textContent = 'Waiting for hand...';
    }
  }

  showMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'message-toast';
    messageEl.textContent = message;
    messageEl.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(139, 92, 246, 0.9);
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      z-index: 300;
      animation: fadeInOut 2s ease-in-out;
    `;

    document.body.appendChild(messageEl);

    setTimeout(() => {
      messageEl.remove();
    }, 2000);
  }

  showError(error) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-toast';
    errorEl.textContent = error;
    errorEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(239, 68, 68, 0.9);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      z-index: 300;
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(errorEl);

    setTimeout(() => {
      errorEl.remove();
    }, 5000);
  }

  togglePropertyPanel() {
    if (!this.propertyPanel) return;

    if (this.propertyPanel.style.display === 'none') {
      this.propertyPanel.style.display = 'block';
    } else {
      this.propertyPanel.style.display = 'none';
    }
  }

  showInquiryForm() {
    const formHTML = `
      <div class="modal-overlay" id="inquiry-modal">
        <div class="modal-content">
          <button class="modal-close" onclick="document.getElementById('inquiry-modal').remove()">×</button>
          <h2>Inquiry Form</h2>
          <form id="inquiry-form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" required>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" required>
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea rows="4" required></textarea>
            </div>
            <button type="submit" class="btn-submit">Send Inquiry</button>
          </form>
        </div>
      </div>
    `;

    const modal = document.createElement('div');
    modal.innerHTML = formHTML;
    document.body.appendChild(modal);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal-content {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 12px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        color: #e2e8f0;
      }

      .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        color: #e2e8f0;
        font-size: 2rem;
        cursor: pointer;
      }

      .modal-content h2 {
        margin-bottom: 1.5rem;
        color: #8b5cf6;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }

      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        background: rgba(139, 92, 246, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 6px;
        color: #e2e8f0;
        font-family: inherit;
      }

      .form-group input:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: #8b5cf6;
        background: rgba(139, 92, 246, 0.2);
      }

      .btn-submit {
        width: 100%;
        padding: 0.75rem;
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
      }
    `;
    document.head.appendChild(style);

    // Handle form submission
    document.getElementById('inquiry-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.showMessage('Thank you! We will contact you soon.');
      document.getElementById('inquiry-modal').remove();
    });
  }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
