# Tailinwd Styling Object

As its name denotes, Tailwind Styling Object is a styling object leverages the power of TailwindCSS providing the ability to use its utilities as key-value JS object.

## Intuition

UI kit and frameworks are making the life a lot easier for frontend developers. However, one of the main concerns when implementing them is the ability and the readiness of style customization so that they match the developers needs.

In another side, TailwindCSS usage is growing day by day because of its big advantages. So if UI kit was chosen to be implemented using TailwindCSS, the main challenge will be make it easily Customizable with avoiding the conflicts between TailwindCSS utilities, wherefore the Tailwind Styling Object was created.

## First Glance

As mentioned previously, Tailwind Styling Object enables the user to apply TailwindCSS classes as key-value pairs
inside JS object. Where the object properties are [TailwindCSS configured plugin names](https://github.com/tailwindlabs/tailwindcss/tree/master/src/plugins) and the values are the classes that each plugin generates.

For example, the `backgroundColor` plugin generates the `bg-{color}` classes and accordingly the value of it will be one of `bg-white`, `bg-gray-100`….etc

```ts
const twStyle: TailwindStylingObject = {
  backgroundColor: 'bg-white',
  borderColor: 'border-gray-400',
  focus: {
    borderColor: 'focus:border-blue-500',
  },
  responsive: {
    sm: { width: 'sm:w-1' },
  },
};
```

Some properties like padding takes an array as a value because a Dom element can take several padding classes

```ts
const twStyle: TailwindStylingObject = {
  padding: ['px-2', 'py-1'],
};
```

## Why

### Extracting Components and avoiding conflicts

To better explain this. let’s go with an example.Imagine having a pre-styled `Button` component, with aclassNamea property to allow for style customization

```tsx
const Button = ({ className, children }) => (
  <button className={`bg-red-500 ${className}`}>{children}</button>
);
```

When user wants to change the button background color, she will pass the new background class through the `className` property

```tsx
<Button className="bg-red-600">Click Me</Button>
```

With the combination above the result DOM element will be

```tsx
<button class="bg-red-500 bg-red-600">Click Me<button>
```

Can you see the problem?. At the end, we had a DOM element that has two classes related to the same css property and we might have a conflict here.

Using TailwindStylingObject will eliminate such a problem.

#### The component

```tsx
import twStyleToClassName from '@missionx-co/twstyle';

const defaultTwStyle = {
  backgroundColor: 'bg-red-500',
};

const Button = ({ twStyle, children }) => (
  <button className={twStyleToClassName(defaultTwStyle, twStyle)}>
    {children}
  </button>
);
```

#### The usage

```tsx
const style={
    backgroundColor: 'bg-red-600'
}

<Button twStyle={style}>
    Click Me
</Button>
```

#### The result DOM element

The twStyleToClassName function will detect the duplicate styling and will prioritize the user defined styling (The second parameter of the function).Then it will convert the resulted object into the proper class name so it can be passed to the DOM element.

```tsx
<button class="bg-red-600">Click Me</button>
```

### Readability:

Although that readability is not a problem for me personally but I’ve seen a lot of people [complaining about classes readability](https://mobile.twitter.com/shadeed9/status/1368805544799174656).

Tailwind styling object will solve the issue of readability since that all the classes will be converted into a key/value javascript object.

```javascript
const twStyle = {
    padding: ['px-3', 'py-2'],
    border: ['border'],
    borderRadius: ['rounded-md'],
    fontSize: 'text-sm',
    color: 'text-white',
    backgroundColor: 'bg-red-500',
    borderColor: 'border-red-500',
    boxShadow: 'shadow-md',
    hover: {
        backgroundColor: 'hover:bg-red-600',
        borderColor: 'hover:border-red-600'
    },
    focus: {
        backgroundColor: 'focus:bg-red-600',
        borderColor: 'focus:border-red-600',
        ringColor: 'focus:ring-red-300',
        ....
    }
}
```

## Installation

Use `npm` or `yarn` to install this package as follows:

```
npm install --save @missionx-co/twstyle
```

or

```
yarn add @missionx-co/twstyle
```

Surely TailwindCSS must be installed and configured, You can follow this link to go through its installation [Tailwindcss installation](https://tailwindcss.com/docs/installation).

In addition, Typescript should be installed to utilize the types that Tailwind Styling Object provides.

## Usage

### Type Generation

After installation and initializing Tailwind config file,TailwindStylingObject typescript types files should be generated.

The generation could be done using the following command:

```
node node_modules/missionx/twstyle/dist/generate --outdir = "/src"
```

This command accepts `outdir` parameter which is used to set the output directory for the generated file. Typically, this folder would be the `src` folder in your project.

The above command should be executed from the directory at where `tailwind.config.js` is located (or its directory).

The output directory will a set of named typing files each of them represents a single Tailwindcss plugin.

In additon, it has a main index file which contains the TailwindStylingObject interface defintion:

```ts
import Space from './Space';
import DivideWidth from './DivideWidth';
.
.
.
import TransitionDelay from './TransitionDelay';
import Animation from './Animation';

export default interface TailwindStylingObject {
    ...
    backgroundAttachment ?: BackgroundAttachment;
    ...
    hover ?: {
        backgroundAttachment ?: `hover:${BackgroundAttachment}`;
        ...
    },
    ...
    responsive ?: {
        sm ?: {
            backgroundAttachment ?: `sm:${BackgroundAttachment}`;
            hover ?: {
                backgroundAttachment ?: `sm:${`hover:${BackgroundAttachment}`}`;
                ...
            }
        ...
        },
        ...
    },
    ...
}
```

As hinted above, TailwindCSS utilities with their variants (as configured in config file) are represented in TS interface according to the following algorithm.

## Usage notes

- Due to the new TailwindCSS JIT compiler it’s impossible to detect all the nested variants, accordingly, the generation command will generate a TS file with only one level of variants nesting for all the [known variants](https://tailwindcss.com/docs/configuring-variants) excepts for dark and the responsive variants.

- Normal utilities represented as optional properties has the type of union between the available classes

```ts
// `BackgroundAttachment.ts` file

type BackgroundAttachment = "bg-fixed" | "bg-local" | "bg-scroll";

// `index.ts` file

import BackgroundAttachment from './BackgroundAttachment';

export default interface TailwindStylingObject {
    ...
    backgroundAttachment ?: BackgroundAttachment;
    ...
}
```

- Variants (except `responsive` and `dark`) are represented as object properties containing all the available utilities as properties.

- `responsive` variant are represented as object property containing each of its defined breakpoints as first layer properties.

  Each property contains as properties all the utilities (and their variants) that supports responsive variant. These properties are defined in the same way as normal utilities and variants except that their values are prefixed with the breakpoint prefix.

  ```tsx
    responsive ?: {
      ...
       sm ?: {
            backgroundAttachment ?: `sm:${BackgroundAttachment}`;
            hover ?: {
                backgroundAttachment ?: `sm:${`hover:${BackgroundAttachment}`}`;
                ...
            }
           }
       md ?: {...},
       lg ?: {...},
       ...
   }
  ```

## Contributors:

- Mahmoud Kassah
- Mohammed Manssour
