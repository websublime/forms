import { ObjectSchemaType } from '@websublime/schema';
import { BaseControl } from './base-control';
/**
 * Form Group
 */
export declare class FormGroup<T = any> extends BaseControl<T> {
    properties: Record<keyof T, BaseControl<T>>;
    constructor(schema: ObjectSchemaType<T>, parent?: BaseControl<any> | null, context?: any);
    validate(data?: any, drill?: boolean): Promise<void>;
    setData(data: T): void;
    onChange(child: BaseControl<any>): Promise<void>;
}
