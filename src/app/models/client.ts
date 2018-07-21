import { Validators } from '@angular/forms';
import { FormModel, NodeCell, RadioType, TextType, transformList } from 'ftm-pm/form-constructor';

import { TimestampableRestEntity } from './rest-entity';

/**
 * Client
 */
export class Client extends TimestampableRestEntity {
  public firstname: string;
  public middlename: string;
  public lastname: string;
  public email: string;
  public image: string;

  get avatar(): string {
    return this.image ? this.image : '/assets/images/theme/default-avatar.png';
  }

  get fullName(): string {
    return `${this.lastname} ${this.firstname} ${this.middlename}`;
  }
}

/**
 * ClientModel
 */
export const ClientModel: FormModel = {
  _config: {
    localePrefix: 'client.form.'
  },
  id: {
    type: TextType,
    options: {
      readOnly: true,
      disabled: true
    }
  },
  lastname: {
    type: TextType,
    options: {
      validators: [Validators.required]
    }
  },
  firstname: {
    type: TextType,
    options: {
      validators: [Validators.required]
    }
  },
  middlename: {
    type: TextType,
    options: {
      validators: [Validators.required]
    }
  },
};

/**
 * ClientList
 */
export const ClientList: NodeCell[] = transformList([
  { columnDef: 'number', type: 'index', header: 'number', usePrefix: true },
  'lastname',
  'firstname',
  'middlename',
]);
