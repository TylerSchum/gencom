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

if (args.help) {
  console.log(helperText);
  return;
}

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

if (args.type && args.hooks) {
  content = `import React, { FunctionComponent, useState, useEffect } from 'react';
`;
} else if (args.hooks) {
  content = `import React, { useState, useEffect } from 'react';
`;
} else if (args.stateful) {
  content = `import React, { Component } from 'react';
`;
} else {
  content = `import React, { FunctionComponent } from 'react';
`;
}

if (args.modules && args.scss) {
  content += `import classes from './${name}.module.scss';
`;
} else if (args.modules) {
  content += `import classes from './${name}.module.css';
`;
} else if (args.css) {
  content += `import './${name}.css'
`;
} else if (args.scss) {
  content += `import './${name}.scss'
`;
} else if (args.material) {
  if (args.type) {
    content += `import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';
`;
  } else {
    content += `import { withStyles } from '@material-ui/core/styles';
`;
  }
}

content += `
`;

if (args.material) {
  if (args.type) {
    content += `const styles = (theme: Theme) => createStyles({

});

`;
  } else {
    content += `const styles = theme => ({

});

`;
  }
}

if (args.type) {
  if (args.material) {
    content += `interface Props extends WithStyles<typeof styles> {}

`;
  } else if (args.stateful) {
    content += `interface Props {}

`;
  } else {
    content += `interface Props {}

`;
  }
}

if (args.type && args.stateful) {
  content += `interface State {}
  
`;
}

if (args.type) {
  if (args.stateful) {
    content += `class ${name} extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state: State = {

    }
  }

  render() {
    ${ args.material ? `const { classes } = this.props;` : ''}
    return (
      <>

      </>
    );
  }
}

`;
  } else if (args.hooks) {
    content += `const ${name}: FunctionComponent<Props> = (props: Props) => {
  ${ args.material ? `const { classes } = this.props;` : ''}

  const [data, setData] = useState('');

  useEffect(() => {
    // do something when component mounts or renders

    return () => {
      // do something when component dismount or is going to rerender

    }
  })

  return (
    <>

    </>
  );
}

`;
  } else {
    content += `const ${name}: FunctionComponent<Props> = (props: Props) => {
  ${ args.material ? `const { classes } = this.props;` : ''}

  return (
    <>

    </>
  );
}

`;
  }
} else {
  if (args.stateful) {
    content += `class ${name} extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    ${ args.material ? `const { classes } = this.props;` : ''}
    return (
      <>

      </>
    );
  }
}

`;
  } else if (args.hooks) {
    content += `const ${name} = (props) => {
  ${ args.material ? `const { classes } = this.props;` : ''}

  const [data, setData] = useState('');

  useEffect(() => {
    // do something when component mounts or renders

    return () => {
      // do something when component dismount or is going to rerender

    }
  })

  return (
    <>

    </>
  );
}

`;
  } else {
    content += `const ${name} = (props) => {
  ${ args.material ? `const { classes } = this.props;` : ''}

  return (
    <>

    </>
  );
}

`;
  }
}

if (args.material) {
  content += `export default withStyles(styles)(${name});`
} else {
  content += `export default ${name};`
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