import { jwtClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /**
     * The auth API lives on the same origin as the app, so no baseURL is
     * needed. Better Auth falls back to window.location.origin in the browser.
     * (A non-NEXT_PUBLIC env var would be undefined in client code anyway.)
     */
    plugins: [
        jwtClient()
    ]
})