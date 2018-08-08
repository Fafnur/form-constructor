import { Component, HostBinding, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { FormModel } from '../../models/form-model';
import { FieldNode, FormNode, FormNodeConfig } from '../../models/form-node';
import { FormTypeOptions } from '../../types/form-type';
import { Guid } from '../../utils/guid';

export interface FCDialogOptions {
  fieldNode: FieldNode;
  options: FormTypeOptions;
  data ?: any;
  config ?: FormNodeConfig;
}

@Component({
  selector: 'fc-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {
  public formModel: FormModel;
  public formNode: FormNode;
  public formNodeConfig: FormNodeConfig;
  @HostBinding('attr.class') public class = 'fc-dialog';

  public constructor(private dialogRef: MatDialogRef<DialogComponent>,
                     @Inject(MAT_DIALOG_DATA) public dialogData: FCDialogOptions) {

    const options = this.dialogData.fieldNode.options;
    this.formModel = options['model'];
    this.formNodeConfig = this.dialogData.config;
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public onSave(event): void {
    const data = this.formNode.getData();
    if (!data['id']) {
      data['id'] = `_${Guid.v4()}`;
    }
    this.dialogRef.close(data);
  }

  public onCancel(event): void {
    this.dialogRef.close();
  }

  public onCreated(formNode: FormNode): void {
    this.formNode = formNode;
    this.setData();
  }

  private setData(): void {
    const options = this.dialogData.fieldNode.options;
    if (options['configOptions']) {
      for (const key of Object.keys(options['configOptions'])) {
        this.formNode.updateOptions(key, options['configOptions'][key]);
      }
    }
    if (this.dialogData.data) {
      this.formNode.setData(this.dialogData.data);
    }
  }
}
