import { AbstractControl, FormGroup } from '@angular/forms';

import { FormTypeInterface, FormTypeOptions, FormTypes } from '../types/form-type';
import { FormField, FormModel } from './form-model';

/**
 * FieldNode
 */
export class FieldNode {
  // [key: string]: any;
  public name: string;
  public model: FormField;
  public multiLanguage: boolean;
  public options: FormTypeOptions;
  public control: AbstractControl;
  public language ?: string;
  public type: FormTypeInterface;
  public data: any;
}

/**
 * FormNodeConfig
 */
export interface FormNodeConfig {
  multiLanguage?: boolean;
  languages?: string[];
  language?: string;
  localePrefix?: string;
  submit?: any;
  formName?: string;
}

/**
 * FormNodeInterface
 */
export interface FormNodeInterface {
  setData(entity: Object | null): void;

  getData(): Object;

  isValid(): boolean;

  addChip(fieldName: string, event): void;

  removeChip(fieldName: string, tag: any): void;

  getFieldNode(fieldName: string): FieldNode;

  updateOptions(name: string, options: any): void;
}

/**
 * FormNode
 */
export class FormNode implements FormNodeInterface {
  /**
   * Controls
   */
  public controls: FormTypes;

  /**
   * Form for formModel
   */
  public form: FormGroup;

  /**
   * Model
   */
  public model: FormModel;

  /**
   * Languages
   */
  public languages: string[] = [];

  /**
   * Language
   */
  public language: string = 'en';

  public translationsField: string = 'translations';

  /**
   * FormNodeConfig
   */
  public config: FormNodeConfig;

  public constructor(model: FormModel, controls: FormTypes, form: FormGroup,
                     languages: string[] = [], language = '', config: FormNodeConfig | Object = {}) {
    this.model = model;
    this.controls = controls;
    this.form = form;
    this.languages = languages;
    this.language = language;
    this.config = config;

    if (this.config.multiLanguage == null) {
      this.config.multiLanguage = false;
      for (const fieldName of Object.keys(this.model)) {
        const fieldOptions: FormTypeOptions = this.controls[fieldName].options;
        if (fieldOptions.multiLanguage) {
          this.config.multiLanguage = true;
          break;
        }
      }
    }
    if (!this.config.languages) {
      this.config.languages = this.languages;
    } else {
      this.languages = this.config.languages;
    }
    if (!this.config.language) {
      this.config.language = this.language;
    } else {
      this.language = this.config.language;
    }
    if (!this.config.localePrefix) {
      this.config.localePrefix = 'smartForm';
    }
    if (!this.config.formName) {
      this.config.formName = 'smart-form';
    }
  }

  public isValid(): boolean {
    return this.form.valid;
  }

  public setData(entity: Object | null): void {
    if (entity) {
      const translations: any = entity[this.translationsField];
      for (const fieldName of Object.keys(this.model)) {
        if (fieldName !== this.translationsField && this.model.hasOwnProperty(fieldName)) {
          const value = entity[fieldName] || this.model[fieldName].options['defaultValue'] || null;
          const fieldOptions: FormTypeOptions = this.controls[fieldName].options;
          const formType: FormTypeInterface = this.controls[fieldName];
          if (fieldOptions.multiLanguage) {
            this.languages.forEach(language => {
              const fieldLangName = `${fieldName}_${language}`;
              let translationValue = value;
              if (translations && translations[language] && translations[language][fieldName]) {
                translationValue = translations[language][fieldName];
              }
              this.setField(formType, fieldLangName, translationValue);
            });
          } else {
            this.setField(formType, fieldName, value);
          }
        }
      }
    }
  }

  public getData(): Object {
    const entity: Object = {};
    if (this.config.multiLanguage) {
      entity[this.translationsField] = {};
      this.languages.forEach(language => {
        entity[this.translationsField][language] = {};
      });
    }
    for (const fieldName of Object.keys(this.model)) {
      if (fieldName !== this.translationsField && this.model.hasOwnProperty(fieldName)) {
        const fieldOptions: FormTypeOptions = this.controls[fieldName].options;
        const formType: FormTypeInterface = this.controls[fieldName];
        if (fieldOptions.multiLanguage) {
          this.languages.forEach(language => {
            entity[this.translationsField][language][fieldName] = this.getField(formType, `${fieldName}_${language}`);
          });
          if (fieldOptions['setDefaultLanguage']) {
            entity[fieldName] = entity[this.translationsField][this.language][fieldName];
          }
        } else {
          entity[fieldName] = this.getField(formType, fieldName);
        }
      }
    }

    return entity;
  }


  public addChip(fieldName: string, event): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const prevValue = this.form.get(fieldName).value;
      if (!prevValue.filter(tag => tag.name === value).length) {
        prevValue.push({name: value.trim()});
        this.form.get(fieldName).setValue(prevValue);
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  public removeChip(fieldName: string, tag: any): void {
    const prevValue = this.form.get(fieldName).value;
    const index = prevValue.indexOf(tag);
    if (index >= 0) {
      prevValue.splice(index, 1);
      this.form.get(fieldName).setValue(prevValue);
    }
  }

  public getFieldNode(fieldName: string): FieldNode {
    const isMulti: boolean = fieldName.indexOf('_') >= 0;
    const name: string = isMulti ? fieldName.substr(0, fieldName.indexOf('_')) : fieldName;
    const language: string = isMulti ? fieldName.substr(fieldName.indexOf('_') + 1) : null;
    const type: FormTypeInterface = this.controls[name];
    const options: FormTypeOptions = Object.assign({}, type.options || {});

    const component: FieldNode = new FieldNode();
    component.multiLanguage = options.multiLanguage;
    component.language = language;
    component.options = options;
    component.type = type;
    component.model = this.model[name];
    component.name = fieldName;
    component.control = this.form.get(fieldName);

    return component;
  }

  public updateOptions(name: string, options: any): void {
    const type: FormTypeInterface = this.controls[name];
    type.setOptions({...type.options, ...options});
  }

  private setField(formType: FormTypeInterface, fieldName: string, value: any): void {
    this.form.get(fieldName).setValue(formType.transform(value));
  }

  private getField(formType: FormTypeInterface, fieldName: string): any {
    return formType.reverseTransform(this.form.get(fieldName).value);
  }
}
