import { newSpecPage } from '@stencil/core/testing';
import { TestPage } from './test-page';

describe('test-page', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TestPage],
      html: `<test-page></test-page>`,
    });
    expect(page.root).toEqualHtml(`
      <test-page>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </test-page>
    `);
  });
});
