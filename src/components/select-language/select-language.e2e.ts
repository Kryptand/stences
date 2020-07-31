import { newE2EPage } from '@stencil/core/testing';

describe('select-language', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<select-language></select-language>');

    const element = await page.find('select-language');
    expect(element).toHaveClass('hydrated');
  });
});
