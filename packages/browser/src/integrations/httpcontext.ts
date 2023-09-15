import type { Event, Integration } from '@sentry/types';

import { WINDOW } from '../helpers';

/** HttpContext integration collects information about HTTP request headers */
export class HttpContext implements Integration {
  /**
   * @inheritDoc
   */
  public static id: string = 'HttpContext';

  /**
   * @inheritDoc
   */
  public name: string;

  public constructor() {
    this.name = HttpContext.id;
  }

  /**
   * @inheritDoc
   */
  public setupOnce(): void {
    // noop
  }

  /** @inheritDoc */
  public preprocessEvent(event: Event): void {
    // if none of the information we want exists, don't bother
    if (!WINDOW.navigator && !WINDOW.location && !WINDOW.document) {
      return;
    }

    // grab as much info as exists and add it to the event
    const url = (event.request && event.request.url) || (WINDOW.location && WINDOW.location.href);
    const { referrer } = WINDOW.document || {};
    const { userAgent } = WINDOW.navigator || {};

    const headers = {
      ...(event.request && event.request.headers),
      ...(referrer && { Referer: referrer }),
      ...(userAgent && { 'User-Agent': userAgent }),
    };
    const request = { ...event.request, ...(url && { url }), headers };

    event.request = request;
  }
}
