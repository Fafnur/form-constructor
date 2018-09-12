import { Overlay } from '@angular/cdk/overlay';
import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { ErrorStateMatcher } from '../../matchers/error-state.matcher';
import { FormModel } from '../../models/form-model';
import { FieldNode, FormNode, FormNodeConfig } from '../../models/form-node';
import { FormConstructorService } from '../../services/form-constructor.service';
import { FormTypeInterface, FormTypeOptions } from '../../types/form-type';
import { Guid } from '../../utils/guid';
import { DialogComponent } from '../dialog/dialog.component';
// import { CurrencyPipe } from '../../pipes/currency.pipe';

@Component({
  selector: 'fc-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  public matcher: ErrorStateMatcher = new ErrorStateMatcher();
  @Input() public formModel: FormModel;
  @Input() public formNodeConfig: FormNodeConfig;
  @Input() public parentFormNode: FormNode;
  public formNode: FormNode;
  @HostBinding('attr.class') public class = 'fc-form';
  private subscription: Subscription;
  private forms: Object = {};
  private toggles: Object = {};
  @Output() private created: EventEmitter<FormNode>;
  @Output() private childChanged: EventEmitter<any>;
  @Output() private changed: EventEmitter<any>;

  public constructor(public dialog: MatDialog,
                     public overlay: Overlay,
                     public fc: FormConstructorService) {
    this.subscription = new Subscription();
    this.created = new EventEmitter<FormNode>();
    this.childChanged = new EventEmitter<any>();
    this.changed = new EventEmitter<any>();
  }

  public ngOnInit(): void {
    if (!this.formModel) {
      throw new Error('Model is not found');
    }
    this.formNode = this.fc.create(this.formModel, this.formNodeConfig || {});
    this.created.emit(this.formNode);
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
      parent: parent,
      params: {},
    };
  }

  public getFieldValue(type: string, value: string, fieldNode: FieldNode, defaultValue: any = null, isTranslate: boolean = true) {
    let fieldValue: any;

    if (fieldNode.options && fieldNode.options[type] && fieldNode.options[type][value]) {
      fieldValue = fieldNode.options[type][value];
    }

    if (!fieldValue && defaultValue) {
      fieldValue = defaultValue;
    } else {
      fieldValue = fieldNode.name;
    }

    if (fieldNode.options.translate && isTranslate) {
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

  public getErrors(errors: {[key: string]: any}): string[] {
    return errors ? Object.keys(errors).filter(error => error !== 'required') : [];
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

  public getMask(fieldNode: FieldNode): Object {
    return fieldNode.options['mask'] ? fieldNode.options['mask'] : null;
  }
  public getMaskPrefix(fieldNode: FieldNode): Object {
    return fieldNode.options['maskPrefix'] ? fieldNode.options['maskPrefix'] : null;
  }

  public getChoices(fieldNode: FieldNode): any[] {
    return fieldNode.options['choices'] ? Object.assign([], fieldNode.options['choices']) : [];
  }

  public getInputType(fieldNode: FieldNode): string {
    return fieldNode.options['inputType'] ? fieldNode.options['inputType'] : 'text';
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
    this.onChanged(event, fieldNode);
  }

  public onOpenDialog(event, fieldNode: FieldNode, options: FormTypeOptions, parent ?: FieldNode): void {
    const data: any = this.formNode.form.get(fieldNode.name).value || {};
    const config = this.formNode.config;
    let dialogConfig = {};
    if (fieldNode.options['model'] && fieldNode.options['model']['_config']) {
      dialogConfig = fieldNode.options['model']['_config'];
    }
    if (config.childrenConfig && config.childrenConfig[fieldNode.nodeName]) {
      dialogConfig = {...dialogConfig, ...config.childrenConfig[fieldNode.nodeName]};
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
        const resultData = typeof fieldNode.options['reverseTransform'] === 'function' ? fieldNode.options['reverseTransform'](result) : result;
        this.formNode.form.get(fieldNode.name).setValue(resultData);
        if (parent) {
          parent.options.choices.push(resultData);
          // this.formNode.updateOptions(parent.name, parent.options);
          parent.control.setValue(resultData[parent.options['mappedId']]);
          this.childChanged.emit({event: event, data: resultData});
        }

        this.changed.emit({event: event, data: fieldNode});
      }
    }));
  }

  public onToggleExpansionPanel(event, fieldNode: FieldNode, parent?: FieldNode): void {
    const key: string = `${parent.name}_${fieldNode.name}`;
    if (this.toggles.hasOwnProperty(key)) {
      this.toggles[key] = !this.toggles[key];
    } else {
      this.toggles[key] = !fieldNode.options['openPanel'];
    }
    if (parent) {
      const value = parent.control.value;
      const data = parent.options.choices.filter(item => item[parent.options['mappedId']] === value)[0];
      const formNode = this.forms[`${parent.name}_${fieldNode.name}`];
      formNode.setData(data);
    }
  }

  public isExpansionPanel(fieldNode: FieldNode, parent?: FieldNode): boolean {
    return this.toggles[`${parent.name}_${fieldNode.name}`] != null ? this.toggles[`${parent.name}_${fieldNode.name}`] : fieldNode.options['openPanel'];
  }

  public onExpansionPanelFormCreated(formNode: FormNode, fieldNode: FieldNode, parent?: FieldNode): void {
    const data: any = this.formNode.form.get(fieldNode.name).value || {};
    this.forms[`${parent.name}_${fieldNode.name}`] = formNode;
    formNode.setData(data);
  }

  public onSaveExpansionPanel(event, fieldNode: FieldNode, parent?: FieldNode): void {
    const formNode = this.forms[`${parent.name}_${fieldNode.name}`];
    const data: any = {...this.formNode.form.get(fieldNode.name).value || {}, ...formNode.getData()};
    if (!data['id']) {
      data['id'] = `_${Guid.v4()}`;
    }
    const resultData = typeof fieldNode.options['reverseTransform'] === 'function' ? fieldNode.options['reverseTransform'](data) : data;

    this.formNode.form.get(fieldNode.name).setValue(resultData);
    if (parent) {
      parent.options.choices.push(resultData);
      // this.formNode.updateOptions(parent.name, parent.options);
      parent.control.setValue(resultData[parent.options['mappedId']]);
      if (fieldNode.options['autoClosed']) {
        this.onToggleExpansionPanel(null, fieldNode, parent);
      }
      this.childChanged.emit({event: event, data: resultData});
    }
    this.onChanged(event, fieldNode);
  }

  public onChanged(event: Event, component: FieldNode): void {
    this.changed.emit({event: event, data: component});
  }
}
