import { Component, Input, OnInit, TemplateRef } from '@angular/core';

import { ErrorStateMatcher } from '../../matchers/error-state.matcher';
import { FieldNode, FormNode } from '../../models/form-node';
import { FormTypeInterface } from '../../types/form-type';

@Component({
  selector: 'fc-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  public matcher: ErrorStateMatcher = new ErrorStateMatcher();
  @Input() public formNode: FormNode;

  public constructor() {
  }

  public ngOnInit(): void  {
  }

  public getComponents(filter: number = -1): any[] {
    let values = Object.values(this.formNode.controls);
    switch (filter) {
      case 0:
        values = values.filter(item => !item.options['multiLanguage']);
        break;
      case 1:
        values = values.filter(item => item.options['multiLanguage']);
        break;
    }

    return values;
  }

  public getTemplate(control: FormTypeInterface, tpl: TemplateRef<any>): TemplateRef<any> {
    return control.options['templateRef'] ? control.options['templateRef'] : tpl;
  }

  public getContext(fieldName: string, language ?: string): any {
    const name: string = language ? `${fieldName}_${language}` : fieldName;
    return {
      $implicit: name,
      formNode: this.formNode,
      formConfig: this.formNode.config,
      fieldNode: this.formNode.getFieldNode(name)
    };
  }

  public getFieldValue(type: string, value: string, fieldNode: FieldNode, defaultValue: any = null) {
    let fieldValue: any = defaultValue;
    if (fieldNode.options && fieldNode.options[type] && fieldNode.options[type][value]) {
      fieldValue = fieldNode.options[type][value];
    }

    return fieldValue;
  }

  public getPlaceholder(fieldNode: FieldNode): string {
    let placeholder: string = '';
    if (fieldNode.options && fieldNode.options['input'] && fieldNode.options['input']['placeholder']) {
      placeholder = fieldNode.options['input']['placeholder'];
    } else {
      placeholder = fieldNode.name;
    }

    if (fieldNode.options.translate) {
      placeholder = this.formNode.config.formName + placeholder;
    }

    return placeholder;
  }

  public getErrorMessage(type: string, fieldNode: FieldNode): string {
    let errorMessage: string = '';

    if (fieldNode.options && fieldNode.options['error'] && fieldNode.options['error'][type]) {
      errorMessage = fieldNode.options['error'][type];
    } else {
      if (fieldNode.options.translate) {
        errorMessage = `error.form.${type}`;
      } else {
        switch (type) {
          case 'required':
            errorMessage = 'Field is required';
            break;
          case 'pattern':
            errorMessage = 'Incorrect format';
            break;
          default:
            errorMessage = 'Wrong value';
        }
      }
    }

    return errorMessage;
  }

  public getChoices(fieldNode: FieldNode): any[] {
    return fieldNode.options['choices'] ? Object.assign([], fieldNode.options['choices']) : [];
  }

  public onSelectCheckbox(fieldNode: FieldNode, choice: any, event): void {
    let values: any[] = fieldNode.control.value;
    if (!values || !values.length) {
      values = fieldNode.options['choices'];
    }
    values.filter(item => item.value === choice.value).forEach(item => item.selected = event.checked);
    if (values.filter(item => item.selected).length) {
      fieldNode.control.setValue(values);
    } else {
      fieldNode.control.setValue([]);
    }
  }
}
