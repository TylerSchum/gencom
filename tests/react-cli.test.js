const {main, createTest} = require('../react-cli');

let args = {};

beforeEach(() => {
  args = {
    'functional': false,
    'stateful': false,
    'hooks': false,
    'material': false,
    'scss': false,
    'css': false,
    'modules': false,
    'test': false,
    'type':false,
    'enzyme': false,
    'help': false,
    'version': false,
    'dev': true,
    _: ['Test']
  }
});

test('make a functional component', () => {
  args.functional = true;
  expect(main(args)).toEqual(`import React from 'react';

const Test = (props) => {

  return (
    <>

    </>
  );
}

export default Test;`);
});

test('makes a stateful component', () => {
  args.stateful = true;
  expect(main(args)).toEqual(`import React, { Component } from 'react';

class Test extends Component {

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
  
export default Test;`)
});

test('makes a hooks component', () => {
  args.hooks = true;
  expect(main(args)).toEqual(`import React, { useState, useEffect } from 'react';

const Test = (props) => {

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

export default Test;`)
})

test('makes hooks with material', () => {
  args.hooks = true;
  args.material = true;
  expect(main(args)).toEqual(`import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  
});

const Test = (props) => {

  const { classes } = props;

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

export default withStyles(styles)(Test);`)
});

test('makes hooks with css', () => {
  args.hooks = true;
  args.css = true;
  expect(main(args)).toEqual(`import React, { useState, useEffect } from 'react';
import './Test.css'

const Test = (props) => {

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

export default Test;`)
});

test('makes hooks with scss', () => {
  args.hooks = true;
  args.scss = true;
  expect(main(args)).toEqual(`import React, { useState, useEffect } from 'react';
import './Test.scss'

const Test = (props) => {

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

export default Test;`)
});

test('makes hooks with css-modules', () => {
  args.hooks = true;
  args.css = true;
  args.modules = true;
  expect(main(args)).toEqual(`import React, { useState, useEffect } from 'react';
import classes from './Test.module.css';

const Test = (props) => {

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

export default Test;`)
});

test('makes hooks with css-modules with scss instead', () => {
  args.hooks = true;
  args.scss = true;
  args.modules = true;
  expect(main(args)).toEqual(`import React, { useState, useEffect } from 'react';
import classes from './Test.module.scss';

const Test = (props) => {

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

export default Test;`)
});

test('make hooks with material', () => {
  args.hooks = true;
  args.material = true;
  expect(main(args)).toEqual(`import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  
});

const Test = (props) => {

  const { classes } = props;

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

export default withStyles(styles)(Test);`)
});

test('make stateful with css', () => {
  args.stateful = true;
  args.css = true;
  expect(main(args)).toEqual(`import React, { Component } from 'react';
import './Test.css'

class Test extends Component {

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
  
export default Test;`)
});

test('make stateful with scss', () => {
  args.stateful = true;
  args.scss = true;
  expect(main(args)).toEqual(`import React, { Component } from 'react';
import './Test.scss'

class Test extends Component {

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
  
export default Test;`)
});

test('make stateful with css-modules', () => {
  args.stateful = true;
  args.css = true;
  args.modules = true;
  expect(main(args)).toEqual(`import React, { Component } from 'react';
import classes from './Test.module.css';

class Test extends Component {

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
  
export default Test;`)
});

test('make stateful with css-modules with scss', () => {
  args.stateful = true;
  args.scss = true;
  args.modules = true;
  expect(main(args)).toEqual(`import React, { Component } from 'react';
import classes from './Test.module.scss';

class Test extends Component {

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
  
export default Test;`)
});

test('make stateful with material', () => {
  args.stateful = true;
  args.material = true;
  expect(main(args)).toEqual(`import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  
});

class Test extends Component {

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
  
export default withStyles(styles)(Test);`)
});

test('makes functional with css', () => {
  args.functional = true;
  args.css = true;
  expect(main(args)).toEqual(`import React from 'react';
import './Test.css'

const Test = (props) => {

  return (
    <>

    </>
  );
}

export default Test;`)
});

test('makes functional with scss', () => {
  args.functional = true;
  args.scss = true;
  expect(main(args)).toEqual(`import React from 'react';
import './Test.scss'

const Test = (props) => {

  return (
    <>

    </>
  );
}

export default Test;`)
});

test('makes functional with css-modules', () => {
  args.functional = true;
  args.css = true;
  args.modules = true;
  expect(main(args)).toEqual(`import React from 'react';
import classes from './Test.module.css';

const Test = (props) => {

  return (
    <>

    </>
  );
}

export default Test;`)
});

test('makes functional with css-modules with scss', () => {
  args.functional = true;
  args.scss = true;
  args.modules = true;
  expect(main(args)).toEqual(`import React from 'react';
import classes from './Test.module.scss';

const Test = (props) => {

  return (
    <>

    </>
  );
}

export default Test;`)
});

test('makes functional with material', () => {
  args.functional = true;
  args.material = true;
  expect(main(args)).toEqual(`import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  
});

const Test = (props) => {

  const { classes } = props;

  return (
    <>

    </>
  );
}

export default withStyles(styles)(Test);`)
});

test('makes a functional typescript component', () => {
  args.type = true;
  args.functional = true;
  expect(main(args)).toEqual(`import React, { FunctionComponent } from 'react';

interface Props {}

const Test: FunctionComponent<Props> = (props) => {

  return (
    <>

    </>
  );
}

export default Test;`)
});

test('makes a stateful typescript component', () => {
  args.type = true;
  args.stateful = true;
  expect(main(args)).toEqual(`import React, { Component } from 'react';

interface Props {}

interface State {}

class Test extends Component<Props, State> {

  constructor(props) {
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
  
export default Test;`)
});

test('makes a hooks typescript component', () => {
  args.type = true;
  args.hooks = true;
  expect(main(args)).toEqual(`import React, { FunctionComponent, useState, useEffect } from 'react';

interface Props {}

const Test: FunctionComponent<Props> = (props) => {

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
  
export default Test;`)
});

test('makes a functional typescript component with css', () => {
  args.type = true;
  args.functional = true;
  args.css = true;
  expect(main(args)).toEqual(`import React, { FunctionComponent } from 'react';
import './Test.css'

interface Props {}

const Test: FunctionComponent<Props> = (props) => {

  return (
    <>

    </>
  );
}

export default Test;`)
});

test('makes a functional typescript component with scss', () => {
  args.type = true;
  args.functional = true;
  args.scss = true;
  expect(main(args)).toEqual(`import React, { FunctionComponent } from 'react';
import './Test.scss'

interface Props {}

const Test: FunctionComponent<Props> = (props) => {

  return (
    <>

    </>
  );
}

export default Test;`)
});

test('makes a functional typescript component css-modules', () => {
  args.type = true;
  args.css = true;
  args.modules = true;
  args.functional = true;
  expect(main(args)).toEqual(`import React, { FunctionComponent } from 'react';
import classes from './Test.module.css';

interface Props {}

const Test: FunctionComponent<Props> = (props) => {

  return (
    <>

    </>
  );
}

export default Test;`)
});

test('makes a functional typescript component with css-modules with scss', () => {
  args.type = true;
  args.scss = true;
  args.modules = true;
  args.functional = true;
  expect(main(args)).toEqual(`import React, { FunctionComponent } from 'react';
import classes from './Test.module.scss';

interface Props {}

const Test: FunctionComponent<Props> = (props) => {

  return (
    <>

    </>
  );
}

export default Test;`)
});

test('makes a functional typescript component with material', () => {
  args.type = true;
  args.functional = true;
  args.material = true;
  expect(main(args)).toEqual(`import React, { FunctionComponent } from 'react';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  
});

interface Props extends WithStyles<typeof styles> {}

const Test: FunctionComponent<Props> = (props) => {

  const { classes } = props;

  return (
    <>

    </>
  );
}

export default withStyles(styles)(Test);`)
});

test('makes a stateful typescript component with css', () => {
  args.type = true;
  args.stateful = true;
  args.css = true;
  expect(main(args)).toEqual(`import React, { Component } from 'react';
import './Test.css'

interface Props {}

interface State {}

class Test extends Component<Props, State> {

  constructor(props) {
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
  
export default Test;`)
});

test('makes a stateful typescript component with scss', () => {
  args.type = true;
  args.stateful = true;
  args.scss = true;
  expect(main(args)).toEqual(`import React, { Component } from 'react';
import './Test.scss'

interface Props {}

interface State {}

class Test extends Component<Props, State> {

  constructor(props) {
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
  
export default Test;`)
});

test('makes a stateful typescript component with css-modules', () => {
  args.type = true;
  args.css = true;
  args.modules = true;
  args.stateful = true;
  expect(main(args)).toEqual(`import React, { Component } from 'react';
import classes from './Test.module.css';

interface Props {}

interface State {}

class Test extends Component<Props, State> {

  constructor(props) {
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
  
export default Test;`)
});

test('makes a stateful typescript component with css-modules with scss', () => {
  args.type = true;
  args.modules = true;
  args.scss = true;
  args.stateful = true;
  expect(main(args)).toEqual(`import React, { Component } from 'react';
import classes from './Test.module.scss';

interface Props {}

interface State {}

class Test extends Component<Props, State> {

  constructor(props) {
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
  
export default Test;`)
});

test('makes a stateful typescript component with material', () => {
  args.type = true;
  args.stateful = true;
  args.material = true;
  expect(main(args)).toEqual(`import React, { Component } from 'react';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  
});

interface Props extends WithStyles<typeof styles> {}

interface State {}

class Test extends Component<Props, State> {

  constructor(props) {
    super(props);
    this.state: State = {
      
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
  
export default withStyles(styles)(Test);`)
});

test('makes a hooks typescript component with css', () => {
  args.type = true;
  args.hooks = true;
  args.css = true;
  expect(main(args)).toEqual(`import React, { FunctionComponent, useState, useEffect } from 'react';
import './Test.css'

interface Props {}

const Test: FunctionComponent<Props> = (props) => {

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
  
export default Test;`)
});

test('makes a hooks typescript component with scss', () => {
  args.type = true;
  args.scss = true;
  args.hooks = true;
  expect(main(args)).toEqual(`import React, { FunctionComponent, useState, useEffect } from 'react';
import './Test.scss'

interface Props {}

const Test: FunctionComponent<Props> = (props) => {

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
  
export default Test;`)
});

test('makes a hooks typescript component with css-modules', () => {
  args.type = true;
  args.css = true;
  args.modules = true;
  args.hooks = true;
  expect(main(args)).toEqual(`import React, { FunctionComponent, useState, useEffect } from 'react';
import classes from './Test.module.css';

interface Props {}

const Test: FunctionComponent<Props> = (props) => {

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
  
export default Test;`)
});

test('makes a hooks typescript component with css-modules with scss', () => {
  args.type = true;
  args.scss = true;
  args.hooks = true;
  args.modules = true;
  expect(main(args)).toEqual(`import React, { FunctionComponent, useState, useEffect } from 'react';
import classes from './Test.module.scss';

interface Props {}

const Test: FunctionComponent<Props> = (props) => {

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
  
export default Test;`)
});

test('makes a hooks typescript component with material', () => {
  args.type = true;
  args.material = true;
  args.hooks = true;
  expect(main(args)).toEqual(`import React, { FunctionComponent, useState, useEffect } from 'react';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  
});

interface Props extends WithStyles<typeof styles> {}

const Test: FunctionComponent<Props> = (props) => {

  const { classes } = props;


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
  
export default withStyles(styles)(Test);`)
});

test('makes a functional component with no argument', () => {
  args.type = true;
  args.functional = false;
  let defaultFunctional = main(args);
  args.functional = true;
  expect(main(args)).toEqual(defaultFunctional);
});

test('makes jest test', () => {
  args.test = true;
  expect(createTest(args, 'Test')).toEqual(`import React from 'react';
import ReactDOM from 'react-dom';
import Test from './Test';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Test />, div);
});`)
});

test('makes enzyme test', () => {
  args.enzyme = true;
  expect(createTest(args, 'Test')).toEqual(`import React from 'react';
import { shallow } from 'enzyme';
import Test from './Test';

describe("Test", () => {
  let props;
  let shallowTest;
  const test = () => {
    if (!shallowTest) {
      shallowTest = shallow(
        <Test {...props} />
      )
    }
    return shallowTest;
  }

  beforeEach(() => {
    props = {

    }
    shallowTest = undefined;
  })

  // Tests go here...

  // example
  it('always renders a wrapper div', () => {
    expect(test().find('div').first().children()).toEqual(test().children());
  });

});`)
});

test('makes enzyme test with typescript', () => {
  args.enzyme = true;
  args.type = true;
  expect(createTest(args, 'Test')).toEqual(`import React from 'react';
import { shallow } from 'enzyme';
import Test from './Test';

describe("Test", () => {
  let props: any;
  let shallowTest: any;
  const test = () => {
    if (!shallowTest) {
      shallowTest = shallow(
        <Test {...props} />
      )
    }
    return shallowTest;
  }

  beforeEach(() => {
    props = {

    }
    shallowTest = undefined;
  })

  // Tests go here...

  // example
  it('always renders a wrapper div', () => {
    expect(test().find('div').first().children()).toEqual(test().children());
  });

});`)
});