import { AbstractType, FormTypeOptions } from './form-type';

/**
 * SelectType
 */
export class SelectType extends AbstractType {
  public type: string = 'select';

  public constructor(name: string, options: FormTypeOptions | Object) {
    super(name, options);

    if (!this.options['choices']) {
      this.options['choices'] = [];
    }
  }

  public setOptions(value: FormTypeOptions | Object) {
    this.options = value;
  }

  public reverseTransform(values: any): any {
    if (this.options['multiple']) {
      return this.options['choices'].filter(item => (<any[]> values).indexOf(item[this.options['mappedId']]) >= 0);
    } else {
      return this.options['choices'].filter(item => item[this.options['mappedId']] === values)[0];
    }
  }

  public transform(values): any {
    return this.options['multiple'] ? values.map(item => item ? item[this.options['mappedId']] : null) : values ? values[this.options['mappedId']] : null;
  }
}

