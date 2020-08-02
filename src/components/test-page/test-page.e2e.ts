import { newE2EPage } from '@stencil/core/testing';

describe('test-page', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<test-page></test-page>');

    const element = await page.find('test-page');
    expect(element).toHaveClass('hydrated');
  });
});
