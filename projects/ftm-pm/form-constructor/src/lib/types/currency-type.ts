import { AbstractType } from './form-type';

export class CurrencyType extends AbstractType {
  public type: string = 'currency';

  public transform(value: any): any {
    return typeof value === 'number' ?  value : null;
  }

  public reverseTransform(value: any): any {
    return value != null ? value :  null;
  }
}

