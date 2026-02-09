# Specification

## Summary
**Goal:** Allow users to open the Live page directly in the “Camera Recording” view via a deep link, and provide an in-app control to switch to that view without manual tab switching.

**Planned changes:**
- Support a query parameter on the Live route (e.g., `/live?mode=camera`) that selects the “Camera Recording” tab on first render.
- Keep `/live` (no query parameter) defaulting to the existing “Simulated Live Feed” tab.
- Add a clearly labeled in-page control on the Live page that switches the UI to the “Camera Recording” tab without starting the camera.
- Ensure existing tab switching behavior remains intact, including the simulated polling pause/refetch behavior, and keep navigation routing to `/live` unchanged.

**User-visible outcome:** Users can navigate directly to the Live page in Camera Recording mode using a URL like `/live?mode=camera`, or click an in-page control to switch to “Camera Recording” without automatically enabling the camera.
