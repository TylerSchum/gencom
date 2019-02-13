#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

// ================== Utility Functions ==================
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
// =======================================================

function checkHelp(args) {
  return args.help === true;
}

function printHelp() {
  return `
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
}

function checkVersion(args) {
  return args.version === true;
}

function printVersion() {
  const version = require('./package.json').version;
  const mostRecent = require('child_process').execSync("npm view gencom version").toString();
  return `    Installed: ${version}
    Latest: ${mostRecent}`;
}

function checkTypeConflicts(args) {
  if ((args.functional && args.stateful) || (args.functional && args.hooks) || (args.stateful && args.hooks)) {
    return true;
  }
  return false;
}

function typeConflicts() {
  return `Please use --functional, --stateful, and --hooks separately, exiting...
Use -h or --help to see a list of options.`
}

function checkStyleConflicts(args) {
  if ((args.css && args.scss) || (args.css && args.material) || (args.scss && args.material)) {
    return true;
  }
  return false;
}

function styleConflicts() {
  return `Please use --css, --scss, and --modules separately, exiting...
Use -h or --help to see a list of options.`;
}

function checkMissingName(name) {
  return typeof(name) === 'undefined';
}

function missingName() {
  return `A component name must be supplied, exiting...
Use -h or --help for help.`;
}

function checkTest(args) {
  if (args.test || args.enzyme) {
    return true;
  }
  return false;
}

function createTest(args, name) {
  let testText = '';
  const lowerName = name[0].toLowerCase() + name.slice(1);
  if (args.enzyme) {
    if (args.type) {
      testText += `import React from 'react';
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
      testText += `import React from 'react';
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
    testText += `import React from 'react';
import ReactDOM from 'react-dom';
import ${name} from './${name}';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<${name} />, div);
});`
  }
  return testText;
}

function createImports(args, name) {
  let content = '';
  if (args.type && args.hooks) {
    content += `import React, { FunctionComponent, useState, useEffect } from 'react';
`;
  } else if (args.hooks) {
    content += `import React, { useState, useEffect } from 'react';
`;
  } else if (args.stateful) {
    content += `import React, { Component } from 'react';
`;
  } else if (args.type) {
    content += `import React, { FunctionComponent } from 'react';
`;
  } else {
    content += `import React from 'react';
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
  return content;
}

function createMaterialStyles(args) {
  let content = '';
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
  return content;
}

function createInterfaces(args) {
  let content = '';
  if (args.type) {
    if (args.material) {
      content += `interface Props extends WithStyles<typeof styles> {}

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
  return content;
}

function createBody(args, name) {
  let content = '';
  if (args.type) {
    if (args.stateful) {
      content += `class ${name} extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state: State = {
      
    }
  }

  render() {${ args.material ? `

  const { classes } = this.props;` : ''}

    return (
      <>

      </>
    );
  }
}
  
`;
    } else if (args.hooks) {
      content += `const ${name}: FunctionComponent<Props> = (props: Props) => {${ args.material ? `

  const { classes } = props;
` : ''}

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
      content += `const ${name}: FunctionComponent<Props> = (props: Props) => {${ args.material ? `

  const { classes } = props;` : ''}

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

  render() {${ args.material ? `

    const { classes } = this.props;` : ''}

    return (
      <>

      </>
    );
  }
}
  
`;
    } else if (args.hooks) {
      content += `const ${name} = (props) => {${ args.material ? `

  const { classes } = props;` : ''}

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
      content += `const ${name} = (props) => {${ args.material ? `

  const { classes } = props;` : ''}

  return (
    <>

    </>
  );
}

`;
    }
  }
  return content;
}

function createExport(args, name) {
  let content = '';
  if (args.material) {
    content += `export default withStyles(styles)(${name});`
  } else {
    content += `export default ${name};`
  }
  return content;
}

function checkSourceFolder() {
  if (!fs.existsSync('./src/')) {
    return true;
  }
  return false;
}

function printNoSourceFolder() {
  return `Found no 'src' folder, exiting...`;
}

function checkParentPath(parentPath) {
  const parentExists = fs.existsSync(parentPath);
  if (!parentExists) {
    return;
  }
}

function printBadParentPath(parentPath) {
  return `Could not resolve provided path: ${parentPath}`;
}

function makeFolder(parentPath, name) {
  try {
    fs.mkdirSync(`${parentPath}/${name}`);
  } catch (e) {
    return `A component with that name already exists, exiting...`;
  }
}

function makeFiles(args, name, parentPath, content, testText) {
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
}

function checkProblems(args, name, parentPath) {
  if (!args) {
    return true;
  }
  if (checkHelp(args)) {
    return printHelp();
  }
  if (checkVersion(args)) {
    return printVersion();
  }
  if (!args.dev) {
    if (checkSourceFolder()) {
      return printNoSourceFolder();
    }
  }
  if (checkMissingName(name)) {
    return missingName();
  }
  if (checkStyleConflicts(args)) {
    return styleConflicts();
  }
  if (checkTypeConflicts(args)) {
    return typeConflicts();
  }
  if (checkParentPath(parentPath)) {
    return printBadParentPath();
  }
  return false;
}

function getArgs() {
  let args;
  try {
    args = minimist(process.argv.slice(2), {
      boolean: ['functional', 'stateful', 'hooks', 'material', 'scss', 'css', 'modules', 'test', 'type', 'enzyme', 'help', 'version', 'dev'],
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
    return { error: e }
  }
  return args;
}

function main(testArgs) {
  let args = testArgs ? testArgs : getArgs();
  if (args.error) {
    console.log(args.error);
    return;
  }
  const [name, parentPath = './src/'] = args._;
  let problem = checkProblems(args, name, parentPath);
  if (problem) {
    console.log(problem);
    return;
  }
  const fixedName = upperCamelCase(name);
  let content = '';
  let testText = '';
  if (checkTest(args)) {
    testText = createTest(args, fixedName);
  }
  content += createImports(args, fixedName);
  content += createMaterialStyles(args);
  content += createInterfaces(args);
  content += createBody(args, fixedName);
  content += createExport(args, fixedName);
  if (!args.dev) {
    const folderProblem = makeFolder(parentPath, fixedName);
    if (folderProblem) {
      console.log(folderProblem);
      return;
    }
    makeFiles(args, fixedName, parentPath, content, testText);
  }
  console.log(`${name} component has been created! Happy Coding!`);
  return content;
}

main();

module.exports = {main, createTest};