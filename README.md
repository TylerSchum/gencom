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
    rgen -htm myComponent
###Ouput:
####./src/MyComponent/MyComponent.js
    import React, { useState, useEffect } from 'react';
    import { withStyles } from '@material-ui/core/styles';

    const styles = {

    }

    const ${name} = props => {
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

    export default withStyles(styles)(${name});

####./src/MyComponent/MyComponent.test.js
    import React from 'react';
    import ReactDOM from 'react-dom';
    import ${name} from './${name}';

    it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(<${name} />, div);
    });

----
## Author
Tyler Schum