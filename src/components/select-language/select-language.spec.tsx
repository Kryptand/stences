import { newSpecPage } from '@stencil/core/testing';
import { SelectLanguage } from './select-language';

describe('select-language', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SelectLanguage],
      html: `<select-language></select-language>`,
    });
    expect(page.root).toEqualHtml(`
      <select-language>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </select-language>
    `);
  });
});
