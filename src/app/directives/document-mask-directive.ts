import { ChangeDetectorRef, Directive, DoCheck, ElementRef, HostListener, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[documentMask]',
  standalone: true
})

export class DocumentMaskDirective implements OnInit, DoCheck {
    private previousValue: string = ''; // Para controle interno e evitar loops
  
    constructor(private el: ElementRef, private ngControl: NgControl) {}
  
    ngOnInit(): void {
      // Aplica a máscara ao valor inicial do campo (caso venha preenchido)
      this.applyMaskToInitialValue();
    }
  
    ngDoCheck(): void {
      // Garante a aplicação da máscara se houver atualizações no valor dinamicamente
      const value = this.ngControl.control?.value || '';
      if (value !== this.previousValue) {
        this.previousValue = value;
        this.el.nativeElement.value = this.applyMask(value.replace(/\D/g, ''));
      }
    }
  
    @HostListener('input', ['$event'])
    onInputChange(event: any): void {
      const rawValue = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
      const formattedValue = this.applyMask(rawValue);
  
      // Atualiza o valor no campo visível (com máscara)
      this.el.nativeElement.value = formattedValue;
  
      // Atualiza o controle do formulário com o valor sem máscara
      this.ngControl.control?.setValue(rawValue, { emitEvent: false });
    }
  
    private applyMask(value: string): string {
      if (value.length <= 9) {
        // Máscara para RG: 99.999.999-9
        return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,1})$/, '$1.$2.$3-$4');
      } else {
        // Máscara para CPF: 999.999.999-99
        return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})$/, '$1.$2.$3-$4');
      }
    }
  
    private applyMaskToInitialValue(): void {
      const value = this.ngControl.control?.value;
      if (value) {
        const maskedValue = this.applyMask(value.replace(/\D/g, ''));
        this.el.nativeElement.value = maskedValue;
        this.ngControl.control?.setValue(value.replace(/\D/g, ''), { emitEvent: false });
      }
    }
}