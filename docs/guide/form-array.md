# Array schema type

Schema package have a Array schema type, to validate array data structures.

Arrays have items and items can be of any type, including `ObjectType` and `ArrayType`.

## ArrayType

The code below creates a validation schema for an array of items of numbers.

```typescript
const schema = ArrayType<string>()
  .minLength(2, 'Custom message min length')
  .of(StringType().isEmail());

const validation = await schema.check([
  'mick.branches@websublime.com',
  'hulake@websublime.com'
]);

expect(validation.hasError).toBeFalsy();

const [validationItem1, validationItem2] = validation.items || [];

expect(validationItem1.hasError).toBeFalsy();
expect(validationItem2.hasError).toBeFalsy();
```

Example of an invalid model.

```typescript
// ...
const schema = ArrayType<string>()
  .minLength(2, 'Custom message min length')
  .of(StringType().isEmail());

const validation = await schema.check(['hulake-websublime.com']);

expect(validation.hasError).toBeTruthy();

expect(validation.errors[0].i18n).toBe('Custom message min length');
expect(validation.errors[0].key).toBe(0);

const [validationItem1] = validation.items || [];

expect(validationItem1.hasError).toBeTruthy();
expect(validationItem1.errors[0].key).toBe(0); // context position for the array

console.log(validationItem1.errors[0].i18n); // ERRORS.STRING.IS_EMAIL
```

## Array with objects.

Example of array with object items.

```typescript
const schema = ArrayType<{ age: number; name: string }>()
  .minLength(2)
  .of(
    ObjectType<{ age: number; name: string }>({
      age: NumberType()
        .isInteger()
        .min(10),
      name: StringType().isRequired()
    })
  );

const validation = await schema.check([
  { age: 2, name: 'Mick Branches' },
  { age: 11, name: null }
]);

expect(validation.hasError).toBeFalsy();
expect(validation.isValid).toBeFalsy();

console.log(JSON.stringify(validation, null, 2));
```

JSON ouput of the validation object:

```JSON
{
  "errors": [],
  "hasError": false,
  "isValid": false,
  "items": [
    {
      "errors": [],
      "hasError": false,
      "isValid": false,
      "properties": {
        "age": {
          "errors": [
            {
              "key": "age",
              "constraints": {
                "min": 10
              },
              "value": 2,
              "i18n": "ERRORS.NUMBER.MIN"
            }
          ],
          "hasError": true,
          "isValid": false
        },
        "name": {
          "errors": [],
          "hasError": false,
          "isValid": true
        }
      }
    },
    {
      "errors": [],
      "hasError": false,
      "isValid": false,
      "properties": {
        "age": {
          "errors": [],
          "hasError": false,
          "isValid": true
        },
        "name": {
          "errors": [
            {
              "key": "name",
              "constraints": null,
              "value": null,
              "i18n": "ERRORS.IS_REQUIRED"
            }
          ],
          "hasError": true,
          "isValid": false
        }
      }
    }
  ]
}
```
