import { FormTypeOptions } from '../types/form-type';

/**
 * FormField
 */
export interface FormField {
  type: any;
  options ?: FormTypeOptions|Object;
}

/**
 * FormModel
 */
export interface FormModel {
  [key: string]: FormField;
}
