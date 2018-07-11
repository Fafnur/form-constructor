import { AbstractType, FormTypeOptions } from './form-type';

/**
 * CheckboxType
 */
export class CheckboxType extends AbstractType {
  public type: string = 'checkbox';

  public constructor(name: string, options: FormTypeOptions | Object) {
    super(name, options);

    if (!this.options['choices']) {
      this.options['choices'] = [];
    } else {
      this.updateChoices();
    }
  }

  public setOptions(value: FormTypeOptions | Object) {
    this.options = value;
    this.updateChoices();
  }

  public reverseTransform(values: any[]): any {
    return this.options['choices'].filter(item => item.selected).map(item => item.value);
  }

  public transform(values: any[]): any {
    if (!values) {
      values = [];
    }

    if (this.options['choices'].length && values.length) {
      const vals = {};
      const mapped = this.options['mapped'] ? this.options['mapped'] : null;
      if (mapped) {
        values.forEach(value => {
          vals[value[mapped]] = value;
        });
      } else {
        values.forEach(value => {
          vals[value] = true;
        });
      }

      this.options['choices'].forEach(item => {
        if (vals[item.label]) {
          item.selected = true;
        }
      });
    }

    return this.options['choices'];
  }

  private updateChoices(): void {
    this.options['choices'] = this.options['choices'].map(value => {
      return {
        label: this.options['mapped'] ? value[this.options['mapped']] : value,
        value: value,
        selected: false
      };
    });
  }
}
