# Object schema type

Schema package have a Object schema type, to validate object structures.

Object have properties, and properties can be of any type, including `ObjectType`.

## ObjectType

The code below creates a validation schema for a `User` class object.

```typescript
class User {
  name: string;
  age: number;
  email: string;

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }
}

const schema = ObjectType<User>({
  name: StringType().isRequired(),
  age: NumberType().min(18),
  email: StringType().isEmail()
});

let validation = await schema.check(
  new User({
    name: 'Sublime',
    age: 19,
    email: 'schema@websublime.com'
  })
);

expect(validation.isValid).toBeTruthy();
expect(validation.hasError).toBeFalsy();

expect(validation.properties.age.hasError).toBeFalsy();
expect(validation.properties.age.isValid).toBeTruthy();

expect(validation.properties.email.hasError).toBeFalsy();
expect(validation.properties.email.isValid).toBeTruthy();
```

Example of an invalid model.

```typescript
class User {
  name: string;
  age: number;
  email: string;

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }
}

const schema = ObjectType<User>({
  name: StringType().isRequired(),
  age: NumberType().min(18),
  email: StringType().isEmail()
});

let validation = await schema.check(
  new User({
    name: 'Kid',
    age: 9,
    email: 'I do not have email yet'
  })
);

expect(validation.isValid).toBeFalsy();
expect(validation.hasError).toBeFalsy(); // the errors are at property level

expect(validation.properties.age.hasError).toBeTruthy();

const [ageError] = validation.properties.age.errors;

console.log(ageError.i18n); // ERRORS.NUMBER.MIN
console.log(ageError.key); // age

expect(validation.properties.email.hasError).toBeTruthy();

const [emailError] = validation.properties.email.errors;

console.log(emailError.i18n); // ERRORS.STRING.IS_EMAIL
console.log(emailError.key); // email
```

## Nested object.

Example of a nested object validation.

```typescript
class Profile {
  age: number;
  weight?: number;
  height: number;

  constructor(data?: Partial<Profile>) {
    Object.assign(this, data);
  }
}
class User {
  name: string;
  email: string;

  profile: Profile;

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
    const { profile = null } = data || {};
    this.profile = new Profile(profile);
  }
}

const schema = ObjectType<User>({
  name: StringType().isRequired(),
  email: StringType().isEmail(),
  profile: ObjectType<Profile>({
    age: NumberType()
      .min(18)
      .isRequired(),
    height: NumberType(),
    weight: NumberType()
      .isRequired()
      .max(120)
  }).isRequired()
});

let validation = await schema.check(
  new User({
    name: 'Sublime',
    email: 'schema@websublime.com',
    profile: {
      age: 22,
      height: 175,
      weight: 75
    }
  })
);

expect(validation.isValid).toBeTruthy();
expect(validation.hasError).toBeFalsy(); // the errors are at property level
```

Let's see the validation object in case of an error.

```typescript
// ...
validation = await schema.check(
  new User({
    email: 'schema@websublime.com',
    profile: {
      age: 22,
      height: 175,
      weight: 125
    }
  })
);

console.log(JSON.stringify(validation, null, 4));
```

JSON ouput of the validation object:

```JSON
{
  "errors": [],
  "hasError": false,
  "isValid": false,
  "properties": {
    "name": {
      "errors": [
        {
          "key": "name",  // key in the context of the object
          "constraints": null,
          "value": null,
          "i18n": "ERRORS.IS_REQUIRED"
        }
      ],
      "hasError": true,
      "isValid": false
    },
    "email": {
      "errors": [],
      "hasError": false,
      "isValid": true
    },
    "profile": {
      "errors": [],
      "hasError": false, // Object Profile don't hold errors.
      "isValid": false, // Object Profile not valid.
      "properties": {
        "age": {
          "errors": [],
          "hasError": false,
          "isValid": true
        },
        "height": {
          "errors": [],
          "hasError": false,
          "isValid": true
        },
        "weight": {
          "errors": [
            {
              "key": "weight",
              "constraints": {
                "max": 120  // Error model have a constraint
              },            // object showing the validation contraint.
              "value": 125,
              "i18n": "ERRORS.NUMBER.MAX"
            }
          ],
          "hasError": true,
          "isValid": false
        }
      }
    }
  }
}
```
