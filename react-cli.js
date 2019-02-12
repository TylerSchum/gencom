#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

const cwd = process.cwd();
let args;

try {
  args = minimist(process.argv.slice(2), {
    boolean: ['functional', 'stateful', 'hooks', 'material', 'scss', 'css', 'modules', 'test', 'type', 'enzyme', 'help', 'version'],
    alias: { h: 'hooks', f: 'functional', s: 'stateful', m: 'material', t: 'test', e: 'enzyme', v: 'version' },
    '--': true,
    stopEarly: false,
    unknown: function (param) {
      if (param[0] === '-') {
        throw "Unknown param: '" + param + "' passed to rgen.";
        return false;
      }
      return true;
    }
  });
} catch (e) {
  console.log(e);
  return;
}

const helperText = `
This utility will create a component for you.
Usage:
    rgen [myComponent || my-component || MyComponent] ./path/to/parent/

Options:
    --help: show help
    -v or --version: show gencom version
    -f or --functional: makes a functional, stateless component. This is default.
    -s or --stateful: makes a class, or stateful component.
    -h or --hooks: makes functional component with useState.
    -t or --test: makes a test file.
    -m or --material: adds withStyles import from @material-ui.
    -e or --enzyme: makes test file with enzyme imports.
    --type: makes typescript files
    --css: makes and imports a css file.
    --scss: makes and imports a scss file.
    --modules: makes and imports a css file using css-modules.

  Tips:
    --scss and --modules together will create a .module.scss file instead.
    If no path is supplied, it will default to ./src/
`;

if (args.version) {
  const version = require('./package.json').version;
  const mostRecent = require('child_process').execSync("npm view gencom version").toString();
  console.log(`    Installed: ${version}`);
  console.log(`    Latest: ${mostRecent}`);
  return;
}

function upperCamelCase(string) {
  const camelCased = string.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase()
  });
  return `${camelCased.slice(0, 1).toUpperCase()}${camelCased.slice(1)}`
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory());
}

let [name, parentPath = './src/'] = args._;

if ((args.functional && args.stateful) || (args.functional && args.hooks) || (args.stateful && args.hooks)) {
  console.log(`Please use --functional, --stateful, and --hooks separately, exiting...`);
  console.log(`Use -h or --help to see a list of options.`);
  return;
}

if ((args.css && args.scss) || (args.css && args.material) || (args.scss && args.material)) {
  console.log(`Please use --css, --scss, and --modules separately, exiting...`);
  console.log(`Use -h or --help to see a list of options.`);
  return;
}

if (!name) {
  console.log('A component name must be supplied, exiting...');
  console.log(`Use -h or --help for help.`);
  return;
}

name = upperCamelCase(name);
let content;
let testText;

if (args.enzyme) {
  const lowerName = name[0].toLowerCase() + name.slice(1);
  if (args.type) {
    testText = `import React from 'react';
import { mount } from 'enzyme';
import ${name} from './${name}';

describe("${name}", () => {
  let props: any;
  let mounted${name}: any;
  const ${lowerName} = () => {
    if (!mounted${name}) {
      mounted${name} = mount(
        <${name} {...props} />
      )
    }
    return mounted${name};
  }

  beforeEach(() => {
    props = {

    }
    mounted${name} = undefined;
  })

  // Tests go here...

  // example
  it('always renders a wrapper div', () => {
    expect(${lowerName}().find('div').first().children()).toEqual(${lowerName}().children());
  });

})`
  } else {
    testText = `import React from 'react';
import { mount } from 'enzyme';
import ${name} from './${name}';

describe("${name}", () => {
  let props;
  let mounted${name};
  const ${lowerName} = () => {
    if (!mounted${name}) {
      mounted${name} = mount(
        <${name} {...props} />
      )
    }
    return mounted${name};
  }

  beforeEach(() => {
    props = {

    }
    mounted${name} = undefined;
  })

  // Tests go here...

  // example
  it('always renders a wrapper div', () => {
    expect(${lowerName}().find('div').first().children()).toEqual(${lowerName}().children());
  });

})`
  }
} else {
  testText = `import React from 'react';
  import ReactDOM from 'react-dom';
  import ${name} from './${name}';
  
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<${name} />, div);
  });`
}

if (args.stateful) {
  if (args.modules && args.scss) {
    if (args.type) {
      content = `import React, { Component } from 'react';
import classes from './${name}.module.scss';

interface Props {}

interface State {}

class ${name} extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state: State = {

    }
  }

  render() {
    return (
      <>

      </>
    );
  }
}

export default ${name};`
    } else {
      content = `import React, { Component } from 'react';
import classes from './${name}.module.scss';

class ${name} extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <>

      </>
    );
  }
}

export default ${name};`
    }
  } else if (args.css) {
    if (args.type) {
      content = `import React, { Component } from 'react';
import './${name}.css';

interface Props {}

interface State {}
  
class ${name} extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state: State = {

    }
  }

  render() {
    return (
      <>

      </>
    );
  }
}

export default ${name};`
    } else {
      content = `import React, { Component } from 'react';
import './${name}.css';
  
class ${name} extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <>

      </>
    );
  }
}

export default ${name};`
    }
  } else if (args.scss) {
    if (args.type) {
      content = `import React, { Component } from 'react';
import './${name}.scss';

interface Props {}

interface State {}
  
class ${name} extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state: State = {

    }
  }

  render() {
    return (
      <>

      </>
    );
  }
}

export default ${name};`
    } else {
      content = `import React, { Component } from 'react';
import './${name}.scss';
  
class ${name} extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <>

      </>
    );
  }
}

export default ${name};`
    }
  } else if (args.modules) {
    if (args.type) {
      content = `import React, { Component } from 'react';
import classes from './${name}.module.css';

interface Props {}

interface State {}

class ${name} extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state: State = {

    }
  }

  render() {
    return (
      <>

      </>
    );
  }
}

export default ${name};`
    } else {
      content = `import React, { Component } from 'react';
import classes from './${name}.module.css';
  
class ${name} extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <>

      </>
    );
  }
}

export default ${name};`
    }
  } else if (args.material) {
    if (args.type) {
      content = `import React, { Component } from 'react';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({

});

interface Props extends WithStyles<typeof styles> {}
  
class ${name} extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    const { classes } = this.props;
    return (
      <>

      </>
    );
  }
}

export default withStyles(styles)(${name});`
    } else {
      content = `import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
  
const styles = theme => ({

});

class ${name} extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    const { classes } = this.props;
    return (
      <>

      </>
    );
  }
}

export default withStyles(styles)(${name});`
    }
  } else {
    if (args.type) {
      content = `import React, { Component } from 'react';

interface Props {}

interface State {}

class ${name} extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state: State = {

    }
  }

  render() {
    return (
      <>

      </>
    );
  }
}

export default ${name};`
    } else {
      content = `import React, { Component } from 'react';
     
class ${name} extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <>

      </>
    );
  }
}

export default ${name};`
    }
  }
} else if (args.hooks) {
  if (args.scss && args.modules) {
    if (args.type) {
      content = `import React, { useState, useEffect, FunctionComponent } from 'react';
import classes from './${name}.module.scss';

interface Props {}

const ${name}: FunctionComponent<Props> = (props: Props) => {
  const [data, setData] = useState('defaultData');

  useEffect(() => {
    // do something when component mounts or updates

    return () => {
      // do something when component dismounts or will rerender (run cleanup)

    }
  });

  return (
    <>

    </>
  );
}

export default ${name};`
    } else {
      content = `import React, { useState, useEffect } from 'react';
import classes from './${name}.module.scss';

const ${name} = props => {
  const [data, setData] = useState('defaultData');

  useEffect(() => {
    // do something when component mounts or updates

    return () => {
      // do something when component dismounts or will rerender (run cleanup)

    }
  });

  return (
    <>

    </>
  );
}

export default ${name};`
    }
  } else if (args.css) {
    if (args.type) {
      content = `import React, { useState, useEffect, FunctionComponent } from 'react';
import './${name}.css';

interface Props {}

const ${name}: FunctionComponent<Props> = (props: Props) => {
  const [data, setData] = useState('defaultData');

  useEffect(() => {
    // do something when component mounts or updates

    return () => {
      // do something when component dismounts or will rerender (run cleanup)

    }
  });

  return (
    <>

    </>
  );
}

export default ${name};`
    } else {
      content = `import React, { useState, useEffect } from 'react';
import './${name}.css';

const ${name} = props => {
  const [data, setData] = useState('defaultData');

  useEffect(() => {
    // do something when component mounts or updates

    return () => {
      // do something when component dismounts or will rerender (run cleanup)

    }
  });

  return (
    <>

    </>
  );
}

export default ${name};`
    }

  } else if (args.scss) {
    if (args.type) {
      content = `import React, { useState, useEffect, FunctionComponent } from 'react';
import './${name}.scss';

interface Props {}

const ${name}: FunctionComponent<Props> = (props: Props) => {
  const [data, setData] = useState('defaultData');

  useEffect(() => {
    // do something when component mounts or updates

    return () => {
      // do something when component dismounts or will rerender (run cleanup)

    }
  });

  return (
    <>

    </>
  );
}

export default ${name};`
    } else {
      content = `import React, { useState, useEffect } from 'react';
import './${name}.scss';

const ${name} = props => {
  const [data, setData] = useState('defaultData');

  useEffect(() => {
    // do something when component mounts or updates

    return () => {
      // do something when component dismounts or will rerender (run cleanup)

    }
  });

  return (
    <>

    </>
  );
}

export default ${name};`
    }

  } else if (args.modules) {
    if (args.type) {
      content = `import React, { useState, useEffect, FunctionComponent } from 'react';
import classes from './${name}.module.css';

interface Props {}

const ${name}: FunctionComponent<Props> = (props: Props) => {
  const [data, setData] = useState('defaultData');

  useEffect(() => {
    // do something when component mounts or updates

    return () => {
      // do something when component dismounts or will rerender (run cleanup)

    }
  });

  return (
    <>

    </>
  );
}

export default ${name};`
    } else {
      content = `import React, { useState, useEffect } from 'react';
import classes from './${name}.module.css';

const ${name} = props => {
  const [data, setData] = useState('defaultData');

  useEffect(() => {
    // do something when component mounts or updates

    return () => {
      // do something when component dismounts or will rerender (run cleanup)

    }
  });

  return (
    <>

    </>
  );
}

export default ${name};`
    }
  } else if (args.material) {
    if (args.type) {
      content = `import React, { useState, useEffect, FunctionComponent } from 'react';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({

});

interface Props extends WithStyles<typeof styles> {}

const ${name}: FunctionComponent<Props> = (props: Props) => {
  const { classes } = props;
  const [data, setData] = useState('defaultData');

  useEffect(() => {
    // do something when component mounts or updates

    return () => {
      // do something when component dismounts or will rerender (run cleanup)

    }
  });

  return (
    <>

    </>
  );
}

export default withStyles(styles)(${name});`
    } else {
      content = `import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core';

const styles = theme => ({

});

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
    <>

    </>
  );
}

export default withStyles(styles)(${name});`
    }
  } else {
    if (args.type) {
      content = `import React, { useState, useEffect, FunctionComponent } from 'react';

interface Props {}

const ${name}: FunctionComponent<Props> = (props: Props) => {
  const [data, setData] = useState('defaultData');

  useEffect(() => {
    // do something when component mounts or updates

    return () => {
      // do something when component dismounts or will rerender (run cleanup)

    }
  });

  return (
    <>

    </>
  );
}

export default ${name};`
    } else {
      content = `import React, { useState, useEffect } from 'react'
  
const ${name} = props => {
  const [data, setData] = useState('defaultData');

  useEffect(() => {
    // do something when component mounts or updates

    return () => {
      // do something when component dismounts or will rerender (run cleanup)

    }
  });

  return (
    <>

    </>
  );
}

export default ${name};`
    }
  }
} else {
  if (args.modules && args.scss) {
    if (args.type) {
      content = `import React, { FunctionComponent } from 'react';
import classes from './${name}.module.scss';
    
interface Props {}

const ${name}: FunctionComponent<Props> = (props: Props) => {
return (
  <>

  </>
);
}

export default ${name};`
    } else {
      content = `import React from 'react';
import classes from './${name}.module.scss';
    
const ${name} = props => {
return (
  <>

  </>
);
}

export default ${name};`
    }
  } else if (args.modules) {
    if (args.type) {
      content = `import React, { FunctionComponent } from 'react';
import classes from './${name}.module.css';
    
interface Props {}

const ${name}: FunctionComponent<Props> = (props: Props) => {
return (
  <>

  </>
);
}

export default ${name};`
    } else {
      content = `import React from 'react';
import classes from './${name}.module.css';
    
const ${name} = props => {
return (
  <>

  </>
);
}

export default ${name};`
    }
  } else if (args.scss) {
    if (args.type) {
      content = `import React, { FunctionComponent } from 'react';
import './${name}.scss';
    
const ${name}: FunctionComponent<Props> = (props: Props) => {
return (
  <>

  </>
);
}

export default ${name};`
    } else {
      content = `import React from 'react';
import './${name}.scss';
    
const ${name} = props => {
return (
  <>

  </>
);
}

export default ${name};`
    }
  } else if (args.css) {
    if (args.type) {
      content = `import React, { FunctionComponent } from 'react';
import './${name}.css';
    
interface Props {}

const ${name}: FunctionComponent<Props> = (props: Props) => {
return (
  <>

  </>
);
}

export default ${name};`
    } else {
      content = `import React from 'react';
import './${name}.css';
    
const ${name} = props => {
return (
  <>

  </>
);
}

export default ${name};`
    }
  } else if (args.material) {
    if (args.type) {
      content = `import React, { FunctionComponent } from 'react';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({

});

interface Props extends WithStyles<typeof styles> {}

const ${name}: FunctionComponent<Props> = (props: Props) => {
return (
  <>

  </>
);
}

export default withStyles(styles)(${name});`
    } else {
      content = `import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

});

const ${name} = props => {
return (
  <>

  </>
);
}

export default withStyles(styles)(${name});`
    }
  } else {
    if (args.type) {
      content = `import React, { FunctionComponent } from 'react';
    
interface Props {}

const ${name}: FunctionComponent<Props> = (props: Props) => {
return (

);
}

export default ${name};`
    } else {
      content = `import React from 'react';
    
const ${name} = props => {
return (

);
}

export default ${name};`
    }
  }
}

if (!fs.existsSync('./src/')) {
  console.log(`Found no 'src' folder...`);
  return;
}

const parentExists = fs.existsSync(parentPath);
if (!parentExists) {
  console.log(`Could not resolve provided path: ${parentPath}`);
  return;
}

try {
  fs.mkdirSync(`${parentPath}/${name}`);
} catch (e) {
  console.log(`A component with that name already exists, exiting...`);
  return;
}

if (args.type) {
  fs.writeFileSync(`${parentPath}/${name}/${name}.tsx`, content);
} else {
  fs.writeFileSync(`${parentPath}/${name}/${name}.js`, content);
}
if (args.test || args.enzyme) {
  if (args.type) {
    fs.writeFileSync(`${parentPath}/${name}/${name}.test.tsx`, testText);
  } else {
    fs.writeFileSync(`${parentPath}/${name}/${name}.test.js`, testText);
  }
}
if (args.modules && args.scss) {
  fs.writeFileSync(`${parentPath}/${name}/${name}.module.scss`, '');
} else if (args.modules) {
  fs.writeFileSync(`${parentPath}/${name}/${name}.module.css`, '');
} else if (args.scss) {
  fs.writeFileSync(`${parentPath}/${name}/${name}.scss`, '');
} else if (args.css) {
  fs.writeFileSync(`${parentPath}/${name}/${name}.css`, '');
}
console.log(`${name} component has been created! Happy Coding!`)