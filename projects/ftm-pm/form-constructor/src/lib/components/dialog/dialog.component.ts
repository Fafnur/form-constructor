import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { FieldNode, FormNode, FormNodeConfig } from '../../models/form-node';
import { FormConstructorService } from '../../services/form-constructor.service';
import { FormTypeOptions } from '../../types/form-type';

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
  public formNode: FormNode;

  public constructor(private dialogRef: MatDialogRef<DialogComponent>,
                     @Inject(MAT_DIALOG_DATA) public dialogData: FCDialogOptions,
                     private fc: FormConstructorService) {

    const options = this.dialogData.fieldNode.options;
    this.formNode = this.fc.create(options['model'], this.dialogData.config);
    if (options['configOptions']) {
      for (const key of Object.keys(options['configOptions'])) {
        this.formNode.updateOptions(key, options['configOptions'][key]);
      }
    }
    if (this.dialogData.data) {
      this.formNode.setData(this.dialogData.data);
    }
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public onSave(event): void {
    this.dialogRef.close(this.formNode.getData());
  }

  public onCancel(event): void {
    this.dialogRef.close();
  }
}
