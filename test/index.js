'use strict'; // eslint-disable-line
const chai = require('chai');
const jsdom = require('jsdom');
const htmlContext = require('../src');

chai.should();
const expect = chai.expect;

describe('html-context', () => {
  let window;
  let document;
  let fixture;

  beforeEach((done) => {
    jsdom.env(`
      <html>
        <div id="fixture">
        </div>
      </html>
      `,
      (err, w) => {
        if (err) {
          done(err);
          return;
        }
        window = w;
        document = w.document;
        fixture = document.getElementById('fixture');
        done();
      }
    );
  });

  afterEach(() => {
    window.close();
  });

  it('should yell at you if the element passed is not valid', () => {
    expect(htmlContext).to.throw(/element/);
  });

  it('should provide context for a given element', () => {
    const html = '<div></div>';
    fixture.innerHTML = html;
    htmlContext(fixture.firstChild).should.equal(html);
  });

  it('should understand document', () => {
    document.documentElement.innerHTML = '';
    htmlContext(document).should.equal('<html></html>');
  });

  it('should be able to beautify output', () => {
    const html = '<div>\n' +
                 '    <h1>Hello world</h1>\n' +
                 '</div>';
    fixture.innerHTML = html;
    htmlContext(fixture.firstChild, {
      beautify: true,
    }).should.equal(html);
  });

  describe('maximum length', () => {
    it('should be able to shorten the output', () => {
      const html = '<some-really-long-tag><h1>Hello World</h1></some-really-long-tag>';
      fixture.innerHTML = html;
      const result = htmlContext(fixture.firstChild, {
        maxLength: 20,
      });
      result.length.should.equal(20);
      result.should.equal('<some-real…long-tag>');
    });

    it('should keep the outermost tag intact if possible', () => {
      const html = '<div class="x"><h1>Hello World</h1></div>';
      fixture.innerHTML = html;
      htmlContext(fixture.firstChild, {
        maxLength: 22,
      }).should.equal('<div class="x">…</div>');
    });

    it('should not shorten if there is enough space', () => {
      const html = '<div><h1>Hello World</h1></div>';
      fixture.innerHTML = html;
      htmlContext(fixture.firstChild, {
        maxLength: html.length,
      }).should.equal(html);
    });

    it('should be able to shorten beautified output', () => {
      const html = '<div>\n' +
                   '    <h1>Hello world</h1>\n' +
                   '</div>';
      fixture.innerHTML = html;
      const result = htmlContext(fixture.firstChild, {
        beautify: true,
        maxLength: 30,
      });
      result.length.should.equal(30);
      result.should.equal('<div>\n    <h1>He…d</h1>\n</div>');
    });
  });

  describe('placeholder', () => {
    it('should be possible to define my own placeholder', () => {
      const html = '<div class="x"><h1>Hello World</h1></div>';
      fixture.innerHTML = html;
      const result = htmlContext(fixture.firstChild, {
        placeholder: '@@@@@',
        maxLength: 10,
      });
      result.length.should.equal(10);
      result.should.equal('<di@@@@@v>');
    });
  });
});
