import { newE2EPage } from '@stencil/core/testing';

describe('translatable-entity', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<translatable-entity></translatable-entity>');

    const element = await page.find('translatable-entity');
    expect(element).toHaveClass('hydrated');
  });
});
