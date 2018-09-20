import { AbstractType } from './form-type';

/**
 * BoolType
 */
export class BoolType extends AbstractType {
  public type: string = 'bool';

  public transform(value: any): any {
    return (typeof value !== 'boolean' && value != null) ?  true : !!value;
  }

  public reverseTransform(value: any): any {
    return typeof value === 'string' ?  value === 'true' : !!value;
  }
}

