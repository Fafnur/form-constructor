import { Validators } from '@angular/forms';
import { DialogType, FormModel, NodeCell, RadioType, SelectType, TextType, transformList } from 'ftm-pm/form-constructor';

import { TimestampableRestEntity } from './rest-entity';
import { CurrencyChoices } from './currency';
import { CountryChoices } from './country';
import { Client, ClientModel } from './client';
import { Component } from '@angular/core';

/**
 * User
 */
export class User extends TimestampableRestEntity {
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

  get avatar(): string {
    return this.image ? this.image : '/assets/images/theme/default-avatar.png';
  }

  get fullName(): string {
    return `${this.lastname} ${this.firstname} ${this.middlename}`;
  }
}

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
      dialog: {
        type: DialogType,
        options: {
          validators: [],
          button: {
            label: 'actions.create',
            color: 'primary'
          },
          model: ClientModel
        }
      },
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
 * UserList
 */
export const UserList: NodeCell[] = transformList([
  { columnDef: 'number', type: 'index', header: 'number', usePrefix: true },
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
    header: 'actions',
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
//
// @FcEntity({
//   config: {
//     formName: 'user',
//     localePrefix: 'user.',
//   },
//   types: {
//     form: {
//       submit: () => {},
//     },
//     list: {
//       actions: []
//     }
//   }
// })
// export class Suser {
//   @FcField({
//     form: {
//       type: TextType,
//       options: {
//         validators: [Validators.required]
//       }
//     },
//     view: {
//       type: 'text',
//       options: {
//         validators: [Validators.required]
//       }
//     },
//   })
//   public firstname: string;
// }
