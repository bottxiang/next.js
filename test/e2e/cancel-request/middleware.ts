import { Streamable } from './streamable'

export const config = {
  matcher: '/middleware',
}

let streamable
let requestAborted = false

export default function handler(req: Request): Response {
  throw new Error(new Error('why oh why').stack)
  // The 2nd request should render the stats. We don't use a query param
  // because edge rendering will create a different bundle for that.
  if (streamable) {
    return new Response(
      JSON.stringify({
        requestAborted,
        i: streamable.i,
        streamCleanedUp: streamable.streamCleanedUp,
      })
    )
  }

  streamable = Streamable()
  req.signal.onabort = () => {
    requestAborted = true
  }
  return new Response(streamable.stream)
}
