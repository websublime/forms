/* eslint-disable @typescript-eslint/no-var-requires */

import { FormArray } from '../src/index';

import {
  ArrayType,
  NumberType,
  ObjectType,
  StringType
} from '@websublime/schema';
import { errorMessages } from '@websublime/schema';

describe('> FormArray', () => {
  it('Should have default state', () => {
    const schema = ArrayType(
      ObjectType({
        age: NumberType()
          .isRequired()
          .min(18),
        email: StringType()
          .isRequired()
          .isEmail(),
        name: StringType().isRequired()
      })
    );

    const control = new FormArray(schema);

    expect(control.isFocus).toBeFalsy();
    expect(control.isDirty).toBeFalsy();
    expect(control.isTouch).toBeFalsy();
    expect(control.isPrestine).toBeTruthy();
    expect(control.isValid).toBeTruthy();
    expect(control.hasErrors).toBeFalsy();
  });

  it('Should propagate focus', () => {
    const schema = ArrayType(
      ObjectType({
        age: NumberType()
          .isRequired()
          .min(18),
        email: StringType()
          .isRequired()
          .isEmail(),
        name: StringType().isRequired()
      })
    );
    const control = new FormArray(schema);

    control.setData([
      { age: 10, email: 'Upps', name: 'Olá' },
      { age: 10, email: 'Upps', name: 'Olá' }
    ]);

    control.items[0].properties?.age.setFocus(true);

    expect(control.isFocus).toBeTruthy();
    expect(control.isDirty).toBeFalsy();
    expect(control.isTouch).toBeTruthy();
    expect(control.isPrestine).toBeFalsy();
  });

  it('Should propagate touch', () => {
    const schema = ArrayType(
      ObjectType({
        age: NumberType()
          .isRequired()
          .min(18),
        email: StringType()
          .isRequired()
          .isEmail(),
        name: StringType().isRequired()
      })
    );
    const control = new FormArray(schema);

    control.setData([
      { age: 10, email: 'Upps', name: 'Olá' },
      { age: 10, email: 'Upps', name: 'Olá' }
    ]);

    control.items[0].properties?.age.setTouch();

    expect(control.isFocus).toBeFalsy();
    expect(control.isDirty).toBeFalsy();
    expect(control.isTouch).toBeTruthy();
    expect(control.items[0].properties?.age.isTouch).toBeTruthy();
    expect(control.isPrestine).toBeFalsy();
  });

  it('Should propagate dirty', () => {
    const schema = ArrayType(
      ObjectType({
        age: NumberType()
          .isRequired()
          .min(18),
        email: StringType()
          .isRequired()
          .isEmail(),
        name: StringType().isRequired()
      })
    );
    const control = new FormArray(schema);

    control.setData([
      { age: 10, email: 'Upps', name: 'Olá' },
      { age: 10, email: 'Upps', name: 'Olá' }
    ]);

    const emailControl = control.items[0].properties?.email;
    emailControl?.setDirty();

    expect(control.isFocus).toBeFalsy();
    expect(control.isDirty).toBeTruthy();
    expect(emailControl?.isDirty).toBeTruthy();
    expect(emailControl?.isTouch).toBeTruthy();
    expect(control.isTouch).toBeTruthy();
    expect(control.isPrestine).toBeFalsy();
  });

  it('Should set data', () => {
    const schema = ArrayType(
      ObjectType({
        age: NumberType()
          .isRequired()
          .min(18),
        email: StringType()
          .isRequired()
          .isEmail(),
        name: StringType().isRequired()
      })
    );
    const control = new FormArray(schema);

    const arrayData = [
      { age: 10, email: 'Upps', name: 'Olá' },
      { age: 18, email: 'test@test.com', name: 'Test' }
    ];

    control.setData(arrayData);

    expect(JSON.stringify(control.data)).toEqual(JSON.stringify(arrayData));

    const firstElement = control.items[0];

    expect(firstElement.properties?.age.data).toEqual(10);
    expect(firstElement.properties?.email.data).toEqual('Upps');
    expect(firstElement.properties?.name.data).toEqual('Olá');

    expect(control.isValid).toBeTruthy();
    expect(control.isDirty).toBeFalsy();

    const secondElement = control.items[1];

    expect(secondElement.properties?.age.isValid).toBeTruthy();
    expect(secondElement.properties?.age.isDirty).toBeFalsy();
  });

  it('Should validate array', async () => {
    const schema = ArrayType(
      ObjectType({
        age: NumberType()
          .isRequired()
          .min(18),
        email: StringType()
          .isRequired()
          .isEmail(),
        name: StringType().isRequired()
      })
    );
    const control = new FormArray(schema);

    const arrayData = [
      { age: 10, email: 'Upps', name: 'Olá' },
      { age: 18, email: 'test@test.com', name: 'Test' }
    ];

    control.setData(arrayData);

    await control.validate();

    expect(control.isFocus).toBeFalsy();
    expect(control.isDirty).toBeFalsy();
    expect(control.isTouch).toBeFalsy();
    expect(control.isPrestine).toBeTruthy();
    expect(control.isValid).toBeTruthy();
    expect(control.hasErrors).toBeFalsy();

    await control.items[0].properties?.age.validate();

    expect(control.isValid).toBeFalsy();
    expect(control.hasErrors).toBeFalsy();
    expect(control.items[0].properties?.age.errors[0].i18n).toBe(
      errorMessages.number.min
    );
  });

  it('Should validate nested array', async () => {
    const schema = ArrayType(ArrayType(StringType().isRequired()));

    const control = new FormArray(schema);

    const arrayData = [
      ['A', 'B', 'C'],
      ['a', 'b', 'c']
    ];

    control.setData(arrayData);

    await control.validateAll();

    expect(control.isValid).toBeTruthy();
    expect(control.hasErrors).toBeFalsy();

    const item0_1 = control.items[0].items[1];
    item0_1.setDirty();
    item0_1.setData(null);
    await item0_1.validate();

    expect(control.isValid).toBeFalsy();
    expect(item0_1.hasErrors).toBeTruthy();
    expect(item0_1.errors[0].i18n).toBe(errorMessages.base.isRequired);
  });
});
