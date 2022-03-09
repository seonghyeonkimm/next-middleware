# `pipe` and `mergePipe`

## Usage

### use pipe to split middleware logics

```ts
/* _middleware.ts */
import type { NextMiddleware } from 'next/server';
import { NextResponse } from 'next/server';

import { pipe } from '@seonghyeonkimm/next-middleware';

const firstPipeMiddleware = (req, _, res = NextResponse.next()) => {
  if (condition) {
    // stop here and return this response
    return {
      next: false,
      res,
    }
  }

  return {
    next: true,
    res,
  }
}

const secondPipeMiddleware = (req, _, res = NextResponse.next()) => {
  return {
    next: true,
    res,
  }
}


export const middleware: NextMiddleware = pipe(
  firstPipeMiddleware,
  secondPipeMiddleware,
)();
```

### use mergePipe to apply several pipe middlewares

```ts
/* _middleware.ts */
import type { NextMiddleware } from 'next/server';

import { pipe, mergePipe } from '@seonghyeonkimm/next-middleware';

// possible to use two pipe utils and merge it
export const middleware: NextMiddleware = mergePipe(
  pipe(
    firstPipeMiddleware,
    secondPipeMiddleware,
  ),
  pipe(
    thirdPipeMiddleware,
    fourthPipeMiddleware,
  ),
)();

```