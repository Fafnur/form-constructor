import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { ErrorStateMatcher } from '../../matchers/error-state.matcher';
import { FormModel } from '../../models/form-model';
import { FieldNode, FormNode, FormNodeConfig } from '../../models/form-node';
import { FormConstructorService } from '../../services/form-constructor.service';
import { FormTypeInterface, FormTypeOptions } from '../../types/form-type';

@Component({
  selector: 'fc-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  public matcher: ErrorStateMatcher = new ErrorStateMatcher();
  @Input() public filterModel: FormModel;
  @Input() public formNodeConfig: FormNodeConfig;
  public formNode: FormNode;
  @HostBinding('attr.class') public class = 'fc-filters';
  private subscription: Subscription;
  @Output() private created: EventEmitter<FormNode>;
  @Output() private changed: EventEmitter<any>;

  public constructor(public fc: FormConstructorService) {
    this.subscription = new Subscription();
    this.created = new EventEmitter<any>();
    this.changed = new EventEmitter<any>();
  }

  public ngOnInit(): void {
    if (!this.filterModel) {
      throw new Error('Filter model is not found');
    }
    if (!this.formNodeConfig) {
      this.formNodeConfig = <any>{classes: 'fc-filters-form_inline'};
    } else if (!this.formNodeConfig['classes']) {
      this.formNodeConfig['classes'] = 'fc-filters-form_inline';
    }
    this.formNode = this.fc.create(this.filterModel, this.formNodeConfig);
    this.created.emit(this.formNode);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public getFilters(): FormTypeInterface[] {
    const values: FormTypeInterface[] = [];
    const fields: string[] = this.formNode.config.fields ? this.formNode.config.fields :
      Object.keys(this.formNode.controls).filter(item => this.formNode.config.excludedFields.indexOf(item) < 0);
    for (const key of fields) {
      const control = this.formNode.controls[key];
      if (key.charAt(0) === '_') {
        continue;
      }
      values.push(control);
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
      params: {}
    };
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

    if ((fieldNode.options['error'] && fieldNode.options['error'][type]) || fieldNode.options['errorTranslate']) {
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

  public onFiltersChanged($event): void {
    this.changed.emit(this.formNode.getData());
  }
}
