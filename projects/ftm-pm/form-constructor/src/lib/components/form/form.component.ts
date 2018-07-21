import { Overlay } from '@angular/cdk/overlay';
import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { ErrorStateMatcher } from '../../matchers/error-state.matcher';
import { FieldNode, FormNode } from '../../models/form-node';
import { FormTypeInterface, FormTypeOptions } from '../../types/form-type';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'fc-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  public matcher: ErrorStateMatcher = new ErrorStateMatcher();
  @Input() public formNode: FormNode;
  private subscription: Subscription;

  public constructor(public dialog: MatDialog,
                     public overlay: Overlay) {
    this.subscription = new Subscription();
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public getComponents(filter: number = -1): any[] {
    const values: any[] = [];
    const fields: string[] = this.formNode.config.fields ? this.formNode.config.fields :
      Object.keys(this.formNode.controls).filter(item => this.formNode.config.excludedFields.indexOf(item) < 0);
    for (const key of fields) {
      const control = this.formNode.controls[key];
      // skip system controls (_select_)
      if (key.charAt(0) === '_') {
        continue;
      }
      switch (filter) {
        case 0:
          if (!control.options['multiLanguage']) {
            values.push(control);
          }
          break;
        case 1:
          if (control.options['multiLanguage']) {
            values.push(control);
          }
          break;
      }
    }

    return values;
  }

  public getTemplate(control: FormTypeInterface, tpl: TemplateRef<any>): TemplateRef<any> {
    return control.options['templateRef'] ? control.options['templateRef'] : tpl;
  }

  public getContext(fieldName: string, language ?: string, parent ?: FieldNode): any {
    const name: string = language ? `${fieldName}_${language}` : fieldName;
    return {
      $implicit: name,
      formNode: this.formNode,
      formConfig: this.formNode.config,
      fieldNode: this.formNode.getFieldNode(name),
      language: language,
      parent: parent
    };
  }

  public getFieldValue(type: string, value: string, fieldNode: FieldNode, defaultValue: any = null) {
    let fieldValue: any = defaultValue;

    if (fieldNode.options && fieldNode.options[type] && fieldNode.options[type][value]) {
      fieldValue = fieldNode.options[type][value];
    } else {
      fieldValue = fieldNode.name;
    }
    if (fieldNode.options.translate) {
      fieldValue = this.formNode.config.localePrefix + fieldValue;
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
      placeholder = this.formNode.config.localePrefix + placeholder;
    }

    return placeholder;
  }

  public getErrorMessage(type: string, fieldNode: FieldNode): string {
    let errorMessage: string = '';

    if ( (fieldNode.options['error'] && fieldNode.options['error'][type]) || fieldNode.options['errorTranslate']) {
      errorMessage = fieldNode.options['error'][type];
    } else if (this.formNode.config.autoErrors) {
      errorMessage = `${this.formNode.config.localePrefix}errors.${type}`;
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

  public onOpenDialog(event, fieldNode: FieldNode, options: FormTypeOptions, parent ?: FieldNode): void {
    const data: any = this.formNode.form.get(fieldNode.name).value || {};
    const config = this.formNode.config;
    let dialogConfig = {};
    if (fieldNode.options['model'] && fieldNode.options['model']['_config']) {
      dialogConfig = fieldNode.options['model']['_config'];
    }
    if (config.childrenConfig && config.childrenConfig[fieldNode.name]) {
      dialogConfig = {...dialogConfig, ...config.childrenConfig[fieldNode.name]};
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      width: options['dialog'] && options['dialog'].widows ? options['dialog'].widows : '480px',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: {
        fieldNode: fieldNode,
        options: options,
        data: data,
        config: dialogConfig
      }
    });
    this.subscription.add(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.formNode.form.get(fieldNode.name).setValue(result);
      } else {
        // this.form.get('client').setValue(null);
      }
      if (parent && result) {
        parent.options.choices.push(result);
        // this.formNode.updateOptions(parent.name, parent.options);
        parent.control.setValue(result[parent.options['mappedId']]);
      }
    }));
  }
}
