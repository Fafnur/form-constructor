import { Inject, Injectable, InjectionToken } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FormField, FormModel } from '../models/form-model';
import { FormNode, FormNodeConfig } from '../models/form-node';
import { FormTypeFactory, FormTypeInterface, FormTypeOptions, FormTypes } from '../types/form-type';

export const FC_SERVICE_CONFIG: InjectionToken<FCServiceConfigInterface> = new InjectionToken<FCServiceConfigInterface>('FC_SERVICE_CONFIG');
export const FC_SERVICE_GUID: InjectionToken<any> = new InjectionToken<any>('FC_SERVICE_GUID');

/**
 * FormConstructorConfigInterface
 */
export interface FCServiceConfigInterface {
  languages?: string[];
  language?: string;
  guid?(): string;
}

/**
 * FormConstructorServiceInterface
 */
export interface FormConstructorInterface {
  create(formModel: FormModel, componentConfig ?: FormNodeConfig | Object,
         before?: (formModel: FormModel, types: FormTypes, form: FormGroup) => void,
         after?: (formModel: FormModel, types: FormTypes, form: FormGroup, formComponent: FormNode) => void): FormNode;

  getFieldConfig(name: string, formType: FormTypeInterface): any[];
}

@Injectable({
  providedIn: 'root'
})
export class FormConstructorService implements FormConstructorInterface {
  private readonly language: string;
  private readonly languages: string[];

  public constructor(private formBuilder: FormBuilder,
                     @Inject(FC_SERVICE_CONFIG) private config: FCServiceConfigInterface) {
    this.languages = this.config.languages || [];
    this.language = this.config.language || '';
  }

  public create(formModel: FormModel, componentConfig: FormNodeConfig | Object = {},
                before?: (formModel: FormModel, types: FormTypes, form: FormGroup) => void,
                after?: (formModel: FormModel, types: FormTypes, form: FormGroup, formComponent: FormNode) => void): FormNode {
    const types: FormTypes = {};
    const config: any = {};
    for (const fieldName of Object.keys(formModel)) {
      const field: FormField = formModel[fieldName];
      types[fieldName] = FormTypeFactory.create(field.type, fieldName, field.options);
      const type = types[fieldName];
      const fieldOptions = (<FormTypeOptions>type.options);
      if (fieldOptions.multiLanguage) {
        this.languages.forEach(language => {
          const fieldConfigName = `${fieldName}_${language}`;
          config[fieldConfigName] = this.getFieldConfig(fieldConfigName, type);
        });
      } else {
        config[fieldName] = this.getFieldConfig(fieldName, type);
        if (types[fieldName].type === 'select' && fieldOptions['dialog']) {
          const fieldDialog = fieldOptions['dialog'];
          const fieldDialogName: string = `_${types[fieldName].type}_${fieldName}`;
          types[fieldDialogName] = FormTypeFactory.create(fieldDialog.type, fieldDialogName, fieldDialog.options || {});
          config[fieldDialogName] = this.getFieldConfig(fieldDialogName, types[fieldDialogName]);
        }
      }
    }

    const form: FormGroup = this.formBuilder.group(config);
    this.changeForm(types, form);
    if (before) {
      before(formModel, types, form);
    }
    const formComponent = new FormNode(formModel, types, form, this.languages, this.language, componentConfig);
    if (after) {
      after(formModel, types, form, formComponent);
    }

    return formComponent;
  }

  public getFieldConfig(name: string, formType: FormTypeInterface): any {
    let config: any;
    const options = (<FormTypeOptions>formType.options);
    const defaultValue = formType.transform(options.defaultValue);

    switch (formType.type) {
      case 'date': {
        config = [defaultValue.format(), options.validators];
        break;
      }
      default: {
        config = [defaultValue, options.validators];
      }
    }

    return config;
  }

  private changeForm(types: FormTypes, form: FormGroup) {
    // Set image hooks
    for (const name of Object.keys(types)) {
      const field: FormTypeInterface = types[name];
      const options = (<FormTypeOptions>field.options);
      if (field.name === 'image') {
        if (options.multiLanguage) {
          this.languages.forEach(language => {
            const fieldConfigName = `${name}_${language}`;
            form.get(fieldConfigName)['imageWidgetOptions'] = options['imageWidgetOptions'] ? options['imageWidgetOptions'] : null;
          });
        } else {
          form.get(name)['imageWidgetOptions'] = options['imageWidgetOptions'] ? options['imageWidgetOptions'] : null;
        }
      }
    }
  }
}

