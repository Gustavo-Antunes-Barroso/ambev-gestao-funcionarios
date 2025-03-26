import { Directive, DoCheck, ElementRef, HostListener, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[phoneMask]',
  standalone: true
})

export class PhoneMaskDirective implements OnInit, DoCheck {
  private previousValue: string = ''; // Para evitar loops desnecessários

  constructor(private el: ElementRef, private ngControl: NgControl) {}

  // Aplica a máscara ao valor inicial do campo (valores pré-carregados)
  ngOnInit(): void {
    this.applyMaskToInitialValue();
  }

  // Detecta alterações dinâmicas no valor do controle (vindos do servidor, por exemplo)
  ngDoCheck(): void {
    const value = this.ngControl.control?.value || '';
    if (value !== this.previousValue) {
      this.previousValue = value;
      this.el.nativeElement.value = this.applyPhoneMask(value.replace(/\D/g, ''));
    }
  }

  // Escuta eventos de entrada do usuário
  @HostListener('input', ['$event'])
  onInputChange(event: any): void {
    const rawValue = event.target.value.replace(/\D/g, ''); // Remove tudo que não seja número
    const formattedValue = this.applyPhoneMask(rawValue);

    // Atualiza o valor formatado no campo visualmente
    this.el.nativeElement.value = formattedValue;

    // Atualiza o controle de formulário com o valor "cru" (sem máscara)
    this.ngControl.control?.setValue(rawValue, { emitEvent: false });
  }

  private applyPhoneMask(value: string): string {
    if (value.length <= 10) {
      // Telefone fixo: (XX) XXXX-XXXX
      return value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else {
      // Celular: (XX) XXXXX-XXXX
      return value.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
    }
  }

  private applyMaskToInitialValue(): void {
    const value = this.ngControl.control?.value;
    if (value) {
      const maskedValue = this.applyPhoneMask(value.replace(/\D/g, ''));
      this.el.nativeElement.value = maskedValue;
      this.ngControl.control?.setValue(value.replace(/\D/g, ''), { emitEvent: false });
    }
  }
}