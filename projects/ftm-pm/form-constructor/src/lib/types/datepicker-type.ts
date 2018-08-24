import * as moment_ from 'moment/moment';

const moment = moment_;

import { AbstractType } from './form-type';

/**
 * DatepickerType
 */
export class DatepickerType extends AbstractType {
  public type: string = 'datepicker';

  public transform(value: any): any {
    return value ? moment(new Date(value)) : null;
  }

  public reverseTransform(value: any): any {
    const date = value ? moment(new Date(value)) : null;
    return date ? date.format() : null;
  }
}
