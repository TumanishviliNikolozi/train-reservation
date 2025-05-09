import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cardExpiryDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const regex = /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/;
    const match = value.match(regex);

    if (!match) {
      return { invalidFormat: true };
    }

    const month = parseInt(match[1], 10);
    let year = parseInt(match[2], 10);

    if (year < 100) {
      year += 2000;
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { expired: true };
    }

    if (year > currentYear + 10) {
      return { tooFar: true };
    }

    return null;
  };
}
