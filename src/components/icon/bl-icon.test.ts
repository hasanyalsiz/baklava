import { assert, expect, fixture, html, oneEvent, waitUntil } from '@open-wc/testing';

import BlIcon from './bl-icon';

const infoIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0ZM11.9971 6C12.5587 6 13 6.45481 13 7.00292C13 7.54519 12.5587 8 11.9971 8C11.4413 8 11 7.54519 11 7.00292C11 6.45481 11.4413 6 11.9971 6ZM13 10C13 9.44771 12.5523 9 12 9C11.4477 9 11 9.44771 11 10V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V10Z" fill="currentColor"></path>
</svg>`;

describe('bl-icon', () => {
  const oldFetch = window.fetch;

  before(() => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    window.fetch = async (url: RequestInfo) => {
      if (/info\.svg$/.test(url.toString())) {
        return new Response(infoIcon);
      }
      if (/fail\.svg$/.test(url.toString())) {
        throw new Error('Network error');
      }
      return new Response('', { status: 404 });
    };
  });

  after(() => {
    window.fetch = oldFetch;
  });

  it('is defined', () => {
    const el = document.createElement('bl-icon');
    assert.instanceOf(el, BlIcon);
  });

  it('renders with an icon', async () => {
    const el = await fixture(html`<bl-icon name="info"></bl-icon>`);

    await waitUntil(() => el.shadowRoot?.querySelector('svg'), 'Element did not render SVG');

    expect(el.shadowRoot?.querySelector('svg')?.outerHTML).equal(`${infoIcon}`);
  });

  it('sends error event if svg can not be loaded', async () => {
    const el = await fixture(html`<bl-icon name="info"></bl-icon>`);

    el.setAttribute('name', 'nfo');

    const { detail } = await oneEvent(el, 'bl-error');

    expect(detail).to.equal('nfo icon failed to load');
  });

  it('sends error event if svg request fails', async () => {
    const el = await fixture(html`<bl-icon name="info"></bl-icon>`);

    el.setAttribute('name', 'fail');

    const { detail } = await oneEvent(el, 'bl-error');

    expect(detail).to.equal('fail icon failed to load [Error: Network error]');
  });
});
