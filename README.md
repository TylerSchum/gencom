# gencom

----
## Installation
    npm install -g gencom

----
## WorkFlow
    cd path/to/project/parent
    npx create-react-app my-project
    cd my-project
    mkdir ./src/components
    rgen -htm MyComponent ./src/components/

----
## Reference
###Usage:
    rgen [myComponent || my-component || MyComponent] ./path/to/parent/

###Options:
    --help: show help
    -v or --version: show installed version vs current latest.
    -f or --functional: makes a functional, stateless component. This is default.
    -s or --stateful: makes a class, or stateful component.
    -h or --hooks: makes functional component with useState.
    -m or --material: adds withStyles import from @material-ui.
    -t or --test: makes a test file.
    -e or --enzyme: makes enzyme test file.
    --type: makes .tsx files instead of .js
    --css: makes and imports a css file.
    --scss: makes and imports a scss file.
    --modules: makes and imports a css file using css-modules.

##Examples
###Hooks with Material Import and Test File
    rgen -hme myComponent
###Ouput:
####./src/MyComponent/MyComponent.js
    import React, { useState, useEffect } from 'react';
    import { withStyles } from '@material-ui/core/styles';

    const styles = {

    }

    const MyComponent = props => {
      const { classes } = props;
      const [data, setData] = useState('defaultData');

      useEffect(() => {
      // do something when component mounts or updates

        return () => {
        // do something when component dismounts or will rerender (run cleanup)

        }
      });

      return (

      );
    }

    export default withStyles(styles)(MyComponent);

####./src/MyComponent/MyComponent.test.js
    import React from 'react';
    import { mount } from 'enzyme';
    import MyComponent from './MyComponent';

    describe("MyComponent", () => {
      let props: any;
      let mountedMyComponent: any;
      const myComponent = () => {
        if (!mountedMyComponent) {
          mountedMyComponent = mount(
            <MyComponent {...props} />
          )
        }
        return mountedMyComponent;
      }

      beforeEach(() => {
        props = {

        }
        mountedMyComponent = undefined;
      });

      // Tests go here...

      // example
      it('always renders a wrapper div', () => {
        expect(myComponent().find('div').first().children()).toEqual(myComponent().children());
      });

    });

----
## Author
Tyler Schum