import { Validators } from '@angular/forms';
import {
  DialogType,
  ExpansionPanelType,
  FormModel,
  ListCell,
  RadioType,
  SelectType,
  TextType,
  transformList,
  transformView,
  ViewCell
} from 'ftm-pm/form-constructor';

import { RestEntity } from './rest';
import { CurrencyChoices } from './currency';
import { CountryChoices } from './country';
import { Client, ClientModel } from './client';

/**
 * User
 */
export class User extends RestEntity {
  public countryCode: string;
  public currencyCode: string;
  public firstname: string;
  public middlename: string;
  public lastname: string;
  public madein: string;
  public minTerm: number;
  public maxTerm: number;
  public minProlong: number;
  public maxProlong: number;
  public minSum: number;
  public maxSum: number;
  public overdueTerm: number;
  public collectionPeriod: number;
  public numberRequests: number;
  public email: string;
  public image: string;
  public client: Client;
  public info: UserInfo;

  get avatar(): string {
    return this.image ? this.image : '/assets/images/theme/default-avatar.png';
  }

  get fullName(): string {
    return `${this.lastname} ${this.firstname} ${this.middlename}`;
  }
}

export class UserInfo {
  public parent: string;
  public iso: string;
  public link: string;
}

export const UserViewCells: ViewCell[] = transformView([
  {
    type: 'config',
    translatePrefix: 'user.form.'
  },
  'parent',
  'iso',
  'link'
]);

/**
 * UserModel
 */
export const UserModel: FormModel = {
  _config: {
    localePrefix: 'user.form.'
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
  madein: {
    type: TextType,
    options: {
      validators: []
    }
  },
  client: {
    type: SelectType,
    options: {
      required: true,
      validators: [Validators.required],
      mapped: 'fullName',
      mappedId: 'id',
      choices: [],
      expansionPanel: {
        type: ExpansionPanelType,
        options: {
          validators: [],
          button: {
            label: 'actions.create',
            color: 'primary'
          },
          openPanel: true,
          model: ClientModel,
          autoClosed: true,
          formNodeConfig: {
            excludedFields: ['id']
          },
          reverseTransform: (data: any): any => Object.assign(new Client(), data)
        }
      }
    }
  },
  email: {
    type: TextType,
    options: {
      validators: [Validators.required, Validators.email]
    }
  },
  countryCode: {
    type: RadioType,
    options: {
      validators: [Validators.required],
      title: {
        value: 'countryCode'
      },
      choices: CountryChoices
    }
  },
  currencyCode: {
    type: RadioType,
    options: {
      validators: [Validators.required],
      title: {
        value: 'currencyCode'
      },
      choices: CurrencyChoices
    }
  },
  minTerm: {
    type: TextType,
    options: {
      validators: [Validators.required]
    }
  },
  maxTerm: {
    type: TextType,
    options: {
      validators: [Validators.required]
    }
  },
  minProlong: {
    type: TextType,
    options: {
      validators: [Validators.required]
    }
  },
  maxProlong: {
    type: TextType,
    options: {
      validators: [Validators.required]
    }
  },
  minSum: {
    type: TextType,
    options: {
      validators: [Validators.required]
    }
  },
  maxSum: {
    type: TextType,
    options: {
      validators: [Validators.required]
    }
  },
  overdueTerm: {
    type: TextType,
    options: {
      validators: [Validators.required]
    }
  },
  collectionPeriod: {
    type: TextType,
    options: {
      validators: [Validators.required]
    }
  }
};

/**
 * UserFilterModel
 */
export const UserFilterModel: FormModel = {
  _config: {
    localePrefix: 'user.form.'
  },
  countryCode: {
    type: SelectType,
    options: {
      required: true,
      validators: [],
      mapped: 'label',
      mappedId: 'value',
      choices: CountryChoices
    }
  },
  currencyCode: {
    type: SelectType,
    options: {
      required: true,
      validators: [],
      mapped: 'label',
      mappedId: 'value',
      choices: CurrencyChoices
    }
  }
};


/**
 * UserList
 */
export const UserListCells: ListCell[] = transformList([
  {
    type: 'config',
    translatePrefix: 'user.form.'
  },
  {columnDef: 'number', type: 'index', header: 'number', usePrefix: true},
  'id',
  'lastname',
  'firstname',
  'middlename',
  'countryCode',
  'currencyCode',
  'numberRequests',
  {
    columnDef: 'actions',
    type: 'actions',
    header: 'list.actions',
    usePrefix: false,
    actions: [
      {
        label: 'actions.view',
        routes: ['view'],
        color: 'primary',
        type: 'link',
        usePrefix: false
      },
      {
        label: 'actions.edit',
        routes: ['edit'],
        color: '',
        type: 'link',
        usePrefix: false
      }
    ],
    getAction: (action, item): string[] => ['/users', item.id, ...action['routes']]
  }
]);

export const UserModifiedListCells: ListCell[] = transformList([
  {
    type: 'config',
    translatePrefix: 'user.form.'
  },
  {
    columnDef: 'multiAction',
    type: 'checkbox',
    header: 'group',
    actions: [
      {
        label: 'user.actions.approve',
        color: 'primary',
        type: 'button',
        usePrefix: false
      },
      {
        label: 'user.actions.decline',
        color: 'accent',
        type: 'button',
        usePrefix: false
      },
      {
        label: 'user.actions.disable',
        color: '',
        type: 'button',
        usePrefix: false
      }
    ]
  },
  {columnDef: 'number', type: 'index', header: 'number', usePrefix: true},
  'id',
  'lastname',
  'firstname',
  'middlename',
  'countryCode',
  'currencyCode',
  'numberRequests',
  {
    columnDef: 'actions',
    type: 'actions',
    header: 'list.actions',
    usePrefix: false,
    actions: [
      {
        label: 'user.actions.approve',
        color: 'primary',
        type: 'button',
        usePrefix: false
      },
      {
        label: 'user.actions.decline',
        color: 'accent',
        type: 'button',
        usePrefix: false
      },
      {
        label: 'user.actions.disable',
        color: '',
        type: 'button',
        usePrefix: false
      }
    ],
  }
]);

/**
 * UserView
 */
export const UserView: ViewCell[] = transformView([
  {
    type: 'config',
    translatePrefix: 'user.form.'
  },
  'id',
  'lastname',
  'firstname',
  'middlename',
  'countryCode',
  'currencyCode',
  'numberRequests',
  {
    columnDef: 'link',
    type: 'text',
    subProperty: true,
    property: 'info.link'
  },
  {
    columnDef: 'info',
    type: 'child',
    child: UserViewCells,
    config: {
      type: 'config',
      translatePrefix: 'user.form.',
      excludedFields: ['link']
    }
  }
]);

