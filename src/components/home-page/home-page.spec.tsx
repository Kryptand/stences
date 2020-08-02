import { newSpecPage } from '@stencil/core/testing';
import { HomePage } from './home-page';

describe('home-page', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [HomePage],
      html: `<home-page></home-page>`,
    });
    expect(page.root).toEqualHtml(`
      <home-page>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </home-page>
    `);
  });
});
