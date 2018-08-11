import { TemplateRef } from '@angular/core';

import { DataTransformerInterface } from '../transformers/data-transformer-interface';

/**
 * FormTypeInterface
 */
export interface FormTypeInterface extends DataTransformerInterface {
  name: string;
  type: string;
  options: FormTypeOptions | Object;

  configureOptions(): void;
  setOptions(options: FormTypeOptions | Object): void;
}

/**
 * FormModel
 */
export interface FormTypes {
  [key: string]: FormTypeInterface;
}

/**
 * FormTypeOptions
 */
export interface FormTypeOptions {
  multiLanguage ?: boolean;
  setDefaultLanguage ?: boolean;
  multiple ?: boolean;
  translate ?: boolean;
  validators ?: any[];
  hint ?: any;
  defaultValue ?: any;
  readOnly ?: boolean;
  disabled ?: boolean;
  subProperty ?: boolean;
  property ?: string;
  choices ?: any[];
  suffixIcon ?: string;
  suffix ?: string;
  prefixIcon ?: string;
  prefix ?: string;
  title ?: any;
  templateRef ?: TemplateRef<any>;
}

export const FORM_TYPE_OPTIONS_DEFAULT = {
  multiLanguage: false,
  setDefaultLanguage: false,
  multiple: false,
  translate: true,
  readOnly: false,
  disabled: false,
  validators: []
};

/**
 * FormType
 */
export interface FormType extends FormTypeInterface {
  new(name: string, options: FormTypeOptions | Object): FormTypeInterface;
}

/**
 * FormTypeFactory
 */
export class FormTypeFactory {
  public static create(ctor: FormType, name: string, options: FormTypeOptions | Object = {}): FormTypeInterface {
    return new ctor(name, options);
  }
}

/**
 * AbstractType
 */
export abstract class AbstractType implements FormTypeInterface {
  public name: string;
  public type: string = 'abstract';
  public options: FormTypeOptions | Object;

  public constructor(name: string, options: FormTypeOptions | Object) {
    this.name = name;
    this.options = options;
    this.configureOptions();
  }

  public configureOptions(): void {
    for (const key in FORM_TYPE_OPTIONS_DEFAULT) {
      if (!this.options.hasOwnProperty(key)) {
        this.options[key] = FORM_TYPE_OPTIONS_DEFAULT[key];
      }
    }
  }

  public reverseTransform(value: any): any {
    return value;
  }

  public transform(value: any): any {
    return value;
  }

  public getName(): string {
    return this.name;
  }

  public setName(value: string) {
    this.name = value;
  }

  public getOptions(): FormTypeOptions | Object {
    return this.options;
  }

  public setOptions(value: FormTypeOptions | Object) {
    this.options = value;
  }
}
