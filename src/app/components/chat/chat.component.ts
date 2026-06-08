import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ChatService } from '../../services/chat.service';

interface ChatMessage {
  text: string;
  isUser: boolean;
}

const slideUp = trigger('slideUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
    animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
  ]),
  transition(':leave', [
    animate('0.2s ease-in', style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }))
  ])
]);

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Chat Bubble Button -->
    <button class="chat-bubble" (click)="toggleChat()" [class.open]="isOpen" *ngIf="!isOpen">
      <i class="bi bi-chat-dots-fill"></i>
    </button>

    <!-- Chat Window -->
    <div class="chat-window" *ngIf="isOpen" @slideUp>
      <div class="chat-header">
        <div class="d-flex align-items-center gap-2">
          <div class="chat-avatar">
            <i class="bi bi-robot"></i>
          </div>
          <div>
            <div class="chat-title">AuraBot</div>
            <div class="chat-status">
              <span class="status-dot"></span>
              {{ groqReady ? 'Online' : 'Configure AI Key' }}
            </div>
          </div>
        </div>
        <button class="chat-close" (click)="toggleChat()">&times;</button>
      </div>

      <div class="chat-messages" #scrollContainer>
        <div *ngFor="let msg of messages" class="chat-msg" [class.user]="msg.isUser" [class.bot]="!msg.isUser">
          <div class="msg-bubble">{{ msg.text }}</div>
        </div>
        <div *ngIf="loading" class="chat-msg bot">
          <div class="msg-bubble typing">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <input
          class="chat-input-field"
          [(ngModel)]="inputText"
          (keyup.enter)="sendMessage()"
          placeholder="Ask me anything..."
          [disabled]="loading">
        <button class="chat-send-btn" (click)="sendMessage()" [disabled]="loading || !inputText.trim()">
          <i class="bi" [ngClass]="loading ? 'bi-arrow-repeat spin' : 'bi-send-fill'"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .chat-bubble {
      position: fixed;
      bottom: 5rem;
      right: 1.5rem;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6C63FF, #5A52D5);
      color: white;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(108,99,255,0.4);
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chat-bubble:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 30px rgba(108,99,255,0.5);
    }
    .chat-window {
      position: fixed;
      bottom: 5rem;
      right: 1.5rem;
      width: 360px;
      height: 520px;
      background: var(--bg-card);
      border-radius: 16px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.15);
      border: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
    }
    .chat-header {
      padding: 1rem;
      background: linear-gradient(135deg, #6C63FF, #5A52D5);
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .chat-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }
    .chat-title {
      font-weight: 700;
      font-size: 0.95rem;
    }
    .chat-status {
      font-size: 0.75rem;
      opacity: 0.8;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10B981;
      display: inline-block;
    }
    .chat-close {
      background: none;
      border: none;
      color: white;
      font-size: 1.4rem;
      cursor: pointer;
      opacity: 0.8;
      transition: opacity 0.2s;
      padding: 0;
      line-height: 1;
    }
    .chat-close:hover { opacity: 1; }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .chat-msg {
      display: flex;
      max-width: 85%;
    }
    .chat-msg.bot { align-self: flex-start; }
    .chat-msg.user { align-self: flex-end; }
    .msg-bubble {
      padding: 0.7rem 1rem;
      border-radius: 14px;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    .bot .msg-bubble {
      background: var(--bg-main);
      color: var(--text-primary);
      border-bottom-left-radius: 4px;
    }
    .user .msg-bubble {
      background: linear-gradient(135deg, #6C63FF, #5A52D5);
      color: white;
      border-bottom-right-radius: 4px;
    }
    .typing {
      display: flex;
      gap: 4px;
      padding: 0.7rem 1.2rem;
    }
    .typing-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--text-light);
      animation: typingBounce 1.4s ease-in-out infinite;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }
    .chat-input {
      display: flex;
      padding: 0.75rem;
      gap: 8px;
      border-top: 1px solid var(--border);
    }
    .chat-input-field {
      flex: 1;
      padding: 0.65rem 1rem;
      border: 2px solid var(--border);
      border-radius: 10px;
      font-size: 0.9rem;
      font-family: var(--font);
      background: var(--bg-main);
      color: var(--text-primary);
      outline: none;
      transition: border-color 0.2s;
    }
    .chat-input-field:focus {
      border-color: #6C63FF;
    }
    .chat-input-field:disabled {
      opacity: 0.6;
    }
    .chat-send-btn {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #6C63FF, #5A52D5);
      color: white;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chat-send-btn:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(108,99,255,0.3);
    }
    .chat-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    @media (max-width: 480px) {
      .chat-window {
        width: calc(100vw - 2rem);
        height: 60vh;
        right: 1rem;
        bottom: 5rem;
      }
    }
  `],
  animations: [slideUp]
})
export class ChatComponent {
  isOpen = false;
  inputText = '';
  loading = false;
  groqReady = false;

  messages: ChatMessage[] = [
    { text: '👋 Hi! I\'m AuraBot, your shopping assistant. Ask me about products, recommendations, or anything about AuraStore!', isUser: false }
  ];

  constructor(private chatService: ChatService) {
    this.checkGroqStatus();
  }

  private checkGroqStatus() {
    this.chatService.sendMessage('ping').subscribe({
      next: (res) => {
        this.groqReady = true;
        if (res.reply !== '🔧 AI assistant is being configured. Please check back soon!') {
          this.messages[0] = { text: '👋 Hi! I\'m AuraBot. Ask me anything about our products!', isUser: false };
        }
      },
      error: () => {}
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    const text = this.inputText.trim();
    if (!text || this.loading) return;

    this.messages.push({ text, isUser: true });
    this.inputText = '';
    this.loading = true;

    this.chatService.sendMessage(text).subscribe({
      next: (res) => {
        this.messages.push({ text: res.reply, isUser: false });
        this.loading = false;
        this.groqReady = true;
      },
      error: () => {
        this.messages.push({ text: 'Sorry, I couldn\'t process that. Please try again.', isUser: false });
        this.loading = false;
      }
    });
  }
}
