/**
 * DataTransformerInterface
 */
export interface DataTransformerInterface {
  /**
   * Transforms a value from the original representation to a transformed representation.
   */
  transform(value: any): any;

  /**
   * Transforms a value from the transformed representation to its original representation.
   */
  reverseTransform(value: any): any;
}
