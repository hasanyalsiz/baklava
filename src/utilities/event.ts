export interface EventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

export interface EventDispatcher<T> {
  (value: T, options?: EventOptions): CustomEvent<T>;
}

function dispatcher<T>(target: HTMLElement, eventName: string): EventDispatcher<T> {
  return function (value: T, options?: EventOptions) {
    const customEvent = new CustomEvent<T>(eventName, {
      detail: value,
      bubbles: true,
      cancelable: false,
      composed: true,
      ...options,
    });

    target.dispatchEvent(
      customEvent
    );

    return customEvent;
  };
}

export function event(customName?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (protoOrDescriptor: any, name: string): any => {
    const descriptor = {
      get(this: HTMLElement) {
        return dispatcher(this, customName || name);
      },
      enumerable: true,
      configurable: true,
    };

    Object.defineProperty(protoOrDescriptor, name, descriptor);
  };
}
