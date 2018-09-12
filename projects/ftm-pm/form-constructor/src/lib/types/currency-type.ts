import { AbstractType } from './form-type';

export class CurrencyType extends AbstractType {
  public type: string = 'currency';

  public transform(value: any): any {
    return typeof value === 'number' ?  value : null;
  }

  public reverseTransform(value: any): any {
    return value != null ? this.getNumber(value.toString()) :  null;
  }

  private getNumber(value: string): number {
    const val = value.replace(/\D+/g, '');

    return +val;
  }
}

