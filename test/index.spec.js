const { resolve } = require('path');
const pkg = require('../package.json');
const { expect } = require('chai');
const DOM = require('./dom');

describe('<visible-scroll/>', function () {

  let dom, visscroll;

  before(function () {
    dom = new DOM();
    require(resolve(pkg.browser));
  });

  after(function () {
    dom.destroy();
  });

  beforeEach(function () {
    visscroll = document.body.appendChild(document.createElement('visible-scroll'));
  });

  afterEach(function () {
    document.body.removeChild(visscroll);
  });

  it('should mount a component', function () {
    expect(visscroll.shadowRoot).to.exist;
  });
});
