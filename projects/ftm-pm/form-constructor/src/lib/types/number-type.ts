import { AbstractType } from './form-type';

export class NumberType extends AbstractType {
  public type: string = 'number';

  public transform(value: any): number|null {
    return (typeof value === 'number') ?  value : null;
  }

  public reverseTransform(value: any): any {
    return (typeof value === 'number') ?  value : +value;
  }
}

