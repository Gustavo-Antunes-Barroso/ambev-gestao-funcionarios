import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html'
})
export class ModalConfirmComponent {
  @Input() title: string = 'Confirmação';
  @Input() message: string = 'Tem certeza que deseja continuar?';
  @Output() confirmed = new EventEmitter<void>();

  closeModal(): void {
    const modalElement = document.getElementById('confirmModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.setAttribute('style', 'display: none;');
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.removeAttribute('aria-modal');
    }
  }

  confirm(): void {
    this.confirmed.emit();
    this.closeModal();
  }

  openModal(): void {
    const modalElement = document.getElementById('confirmModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.setAttribute('style', 'display: block;');
      modalElement.removeAttribute('aria-hidden');
      modalElement.setAttribute('aria-modal', 'true');
    }
  }
}
