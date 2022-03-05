/* eslint-disable @typescript-eslint/no-var-requires */

import { FormGroup } from '../src/index';

import {
  errorMessages,
  NumberType,
  ObjectType,
  StringType,
  BooleanType,
  DateType,
  ArrayType
} from '@websublime/schema';

class User {
  age: number;
  email: string;
  name: string;
}

describe('> FormGroup', () => {
  it('Should have default state', () => {
    const schema = ObjectType<User>({
      age: NumberType()
        .isRequired()
        .min(18),
      email: StringType()
        .isRequired()
        .isEmail(),
      name: StringType().isRequired()
    });
    const control = new FormGroup(schema);

    expect(control.isFocus).toBeFalsy();
    expect(control.isDirty).toBeFalsy();
    expect(control.isTouch).toBeFalsy();
    expect(control.isPrestine).toBeTruthy();
    expect(control.isValid).toBeTruthy();
    expect(control.hasErrors).toBeFalsy();
  });

  it('Should propagate focus', () => {
    const schema = ObjectType<User>({
      age: NumberType()
        .isRequired()
        .min(18),
      email: StringType()
        .isRequired()
        .isEmail(),
      name: StringType().isRequired()
    });

    const control = new FormGroup<User>(schema);

    control.properties.age.setFocus(true);

    expect(control.isFocus).toBeTruthy();
    expect(control.isDirty).toBeFalsy();
    expect(control.isTouch).toBeTruthy();
    expect(control.isPrestine).toBeFalsy();
  });

  it('Should propagate touch', () => {
    const schema = ObjectType<User>({
      age: NumberType()
        .isRequired()
        .min(18),
      email: StringType()
        .isRequired()
        .isEmail(),
      name: StringType().isRequired()
    });
    const control = new FormGroup(schema);

    control.properties.age.setTouch();

    expect(control.isFocus).toBeFalsy();
    expect(control.isDirty).toBeFalsy();
    expect(control.isTouch).toBeTruthy();
    expect(control.properties.age.isTouch).toBeTruthy();
    expect(control.isPrestine).toBeFalsy();
  });

  it('Should propagate dirty', () => {
    const schema = ObjectType<User>({
      age: NumberType()
        .isRequired()
        .min(18),
      email: StringType()
        .isRequired()
        .isEmail(),
      name: StringType().isRequired()
    });
    const control = new FormGroup(schema);

    control.properties.email.setDirty();

    expect(control.isFocus).toBeFalsy();
    expect(control.isDirty).toBeTruthy();
    expect(control.properties.email.isDirty).toBeTruthy();
    expect(control.properties.email.isTouch).toBeTruthy();
    expect(control.isTouch).toBeTruthy();
    expect(control.isPrestine).toBeFalsy();
  });

  it('Should set data', () => {
    const schema = ObjectType({
      age: NumberType()
        .isRequired()
        .min(18),
      email: StringType()
        .isRequired()
        .isEmail(),
      birthDate: DateType(),
      isAdmin: BooleanType().isRequired(),
      name: StringType().isRequired()
    });

    const control = new FormGroup(schema);

    control.setData({
      age: 10,
      email: 'teste@teste.com',
      birthDate: new Date(1976, 0, 1),
      isAdmin: false,
      name: 'test'
    });

    expect(JSON.stringify(control.data)).toEqual(
      JSON.stringify({
        age: 10,
        email: 'teste@teste.com',
        birthDate: new Date(1976, 0, 1),
        isAdmin: false,
        name: 'test'
      })
    );

    expect(control.properties.age.data).toEqual(10);
    expect(control.properties.email.data).toEqual('teste@teste.com');
    expect(control.properties.name.data).toEqual('test');
    expect(control.properties.isAdmin.data).toEqual(false);
    expect(control.properties.birthDate.data).toEqual(new Date(1976, 0, 1));

    expect(control.isValid).toBeTruthy();
    expect(control.isDirty).toBeFalsy();

    expect(control.properties.age.isValid).toBeTruthy();
    expect(control.properties.age.isDirty).toBeFalsy();
  });

  it('Should validate field', async () => {
    const schema = ObjectType({
      age: NumberType()
        .isRequired()
        .min(18),
      email: StringType()
        .isRequired()
        .isEmail(),
      name: StringType().isRequired()
    });
    const control = new FormGroup(schema);

    control.setData({
      age: 10,
      email: 'teste.com',
      name: 'test'
    });

    await control.validate();

    expect(control.isFocus).toBeFalsy();
    expect(control.isDirty).toBeFalsy();
    expect(control.isTouch).toBeFalsy();
    expect(control.isPrestine).toBeTruthy();
    expect(control.isValid).toBeTruthy();
    expect(control.hasErrors).toBeFalsy();

    control.properties.age.setDirty();

    await control.properties.age.validate();

    // after validation it will propagate validation to the top.
    expect(control.isValid).toBeFalsy();
    expect(control.hasErrors).toBeFalsy();
    expect(control.properties.age.hasErrors).toBeTruthy();
    expect(control.properties.age.errors[0].i18n).toBe(
      errorMessages.number.min
    );

    // siblings control not in the path up of the control validate will be valid.
    expect(control.properties.name.isValid).toBeTruthy();
    expect(control.properties.email.isValid).toBeTruthy();
  });

  it('Should validate nested object', async () => {
    const schema = ObjectType({
      age: NumberType()
        .isRequired()
        .min(18),
      name: StringType().isRequired(),
      contact: ObjectType({
        email: StringType()
          .isRequired()
          .isEmail(),
        phone: StringType().isRequired()
      })
    });
    const control = new FormGroup(schema);

    control.setData({
      age: 10,
      name: 'test',
      contact: {
        email: 'teste',
        phone: '222444222'
      }
    });

    const emailFormControl = control.properties.contact.properties.email;

    await emailFormControl.validate();

    expect(emailFormControl.isValid).toBeFalsy();
    expect(control.isValid).toBeFalsy();
    expect(control.hasErrors).toBeFalsy();
    expect(emailFormControl.hasErrors).toBeTruthy();
    expect(emailFormControl.errors[0].i18n).toBe(errorMessages.string.isEmail);

    control.setData({
      age: 19,
      name: 'test',
      contact: {
        email: 'huzgo1@gmail.com',
        phone: '222444222'
      }
    });

    await control.validateAll();

    expect(control.isValid).toBeTruthy();
    expect(control.hasErrors).toBeFalsy();
  });

  it('Should validate nested array', async () => {
    const schema = ObjectType({
      age: NumberType()
        .isRequired()
        .min(18),
      name: StringType().isRequired(),
      tags: ArrayType(StringType().minLength(5)).minLength(2)
    });
    const control = new FormGroup(schema);

    control.setData({
      age: 19,
      name: 'test',
      tags: ['Validate', 'Forms', 'Schema']
    });

    await control.validateAll();

    expect(control.isValid).toBeTruthy();

    control.setData({
      age: 19,
      name: 'test',
      tags: ['Validate', 'Foo', 'Schema']
    });

    await control.validateAll();

    expect(control.isValid).toBeFalsy();
    expect(control.properties.tags.isValid).toBeFalsy();
    expect(control.properties.tags.hasErrors).toBeFalsy();
    // Second element of array has an error
    expect(control.properties.tags.items[1].hasErrors).toBeTruthy();
    expect(control.properties.tags.items[1].errors[0].i18n).toBe(
      errorMessages.string.minLength
    );

    control.setData({
      age: 19,
      name: 'test',
      tags: ['Validate', 'Schema']
    });

    await control.validateAll();

    expect(control.isValid).toBeTruthy();

    control.setData({
      age: 19,
      name: 'test',
      tags: ['Validate']
    });

    await control.validateAll();

    expect(control.isValid).toBeFalsy();
    expect(control.properties.tags.isValid).toBeFalsy();
    expect(control.properties.tags.hasErrors).toBeTruthy();
    expect(control.properties.tags.errors[0].i18n).toBe(
      errorMessages.array.minLength
    );
    expect(control.properties.tags.items[0].isValid).toBeTruthy();
  });

  it('Should throw an schema error', async () => {
    const schema = NumberType()
      .isRequired()
      .min(18);

    try {
      const control = new FormGroup(schema as any);
    } catch (e) {
      expect(e).toBe('Invalid Schema type');
    }
  });
});
