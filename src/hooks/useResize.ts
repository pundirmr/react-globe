import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

import { Size } from '../types';

const { useEffect, useRef, useState } = React;

export default function useResize<T>(
  initialSize?: Size,
): [React.RefObject<HTMLDivElement>, Size] {
  const mountRef = useRef<HTMLDivElement>();
  const [size, setSize] = useState<Size>([0, 0]);

  useEffect((): React.EffectCallback => {
    const mount = mountRef.current;
    // update initial size
    let width = 0;
    let height = 0;
    if (initialSize) {
      // Use initialSize if it is provided
      [width, height] = initialSize;
    } else {
      // Use parentElement size if resized has not updated
      width = mount.offsetWidth;
      height = mount.offsetHeight;
    }
    setSize([width, height]);

    // update resize using a resize observer
    const resizeObserver = new ResizeObserver(
      (entries): void => {
        if (!entries || !entries.length) {
          return;
        }
        if (initialSize === undefined) {
          let { width, height } = entries[0].contentRect;
          setSize([width, height]);
        }
      },
    );
    resizeObserver.observe(mount);

    return (): void => {
      resizeObserver.unobserve(mount);
    };
  }, [initialSize]);

  return [mountRef, size];
}
