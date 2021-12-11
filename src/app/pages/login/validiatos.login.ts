import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validarFecha: ValidatorFn = (control: FormGroup): ValidationErrors | null => {


  const fecha  = new Date(control.value);
  const fechaAux  = new Date();
  const fechaMin = fechaAux;
  fechaMin.setFullYear(fechaMin.getFullYear()-17);

  console.log('fecha minia',fechaMin,'fecha ingresada ', fecha);

  return fechaMin < fecha ? null : { 'error': 'Edad no admitida' };
};
