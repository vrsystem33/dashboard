import { Injectable } from '@angular/core';
import { MessageService, ToastMessageOptions } from 'primeng/api';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private messageService: MessageService) {}

  private show(
    severity: ToastMessageOptions['severity'],
    summary: string,
    detail: string,
    position: ToastPosition = 'top-right'
  ) {
    this.messageService.add({
      severity,
      summary,
      detail,
      life: 4000,
      key: position, // 🔑 chave do p-toast define posição
    });
  }

  success(summary: string, detail: string, position?: ToastPosition) {
    this.show('success', summary, detail, position);
  }

  info(summary: string, detail: string, position?: ToastPosition) {
    this.show('info', summary, detail, position);
  }

  warn(summary: string, detail: string, position?: ToastPosition) {
    this.show('warn', summary, detail, position);
  }

  error(summary: string, detail: string, position?: ToastPosition) {
    this.show('error', summary, detail, position);
  }
}
