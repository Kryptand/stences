import { newSpecPage } from '@stencil/core/testing';
import { TranslatableEntity } from './translatable-entity';

describe('translatable-entity', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TranslatableEntity],
      html: `<translatable-entity></translatable-entity>`,
    });
    expect(page.root).toEqualHtml(`
      <translatable-entity>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </translatable-entity>
    `);
  });
});
