import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export type PipeMiddleware = (
  req: NextRequest,
  event: NextFetchEvent,
  res?: NextResponse
) =>
  | { next: boolean; res: NextResponse }
  | Promise<{ next: boolean; res: NextResponse }>;

export function pipe(...args: PipeMiddleware[]) {
  return (initialResponse?: NextResponse) =>
    async (req: NextRequest, event: NextFetchEvent) => {
      const result = await args.reduce((current, nextPipeMiddleware) => {
        return current.then(({ res, next }) => {
          if (!next) {
            return current;
          }

          return nextPipeMiddleware(req, event, res);
        });
      }, Promise.resolve({ next: true, res: initialResponse || NextResponse.next() }));

      return result.res;
    };
}

export function mergePipe(...args: ReturnType<typeof pipe>[]): NextMiddleware {
  return async (req, event) => {
    return args.reduce((current, nextPipeGroupMiddleware) => {
      return current.then((res) => {
        return nextPipeGroupMiddleware(res)(req, event);
      });
    }, Promise.resolve(NextResponse.next()));
  };
}
