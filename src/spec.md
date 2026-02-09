# Specification

## Summary
**Goal:** Fix the frontend build/deployment failure and restore the Live page camera capture/recording experience.

**Planned changes:**
- Resolve the missing `@/camera/useCamera` import by adding the `useCamera` hook/module (or updating the import to an existing module) so the Live page renders the Camera Recording tab.
- Implement `useCamera` start/stop behavior: request camera permissions via `navigator.mediaDevices.getUserMedia`, attach the stream to the provided `videoRef`, stop tracks on disable, and surface user-friendly errors for common failures.
- Fix TypeScript DOM typing issues in `useMediaRecorder` (e.g., avoid `NodeJS.Timeout` for browser timers) to ensure strict type-checking and successful builds while preserving recording functionality.

**User-visible outcome:** The app builds and deploys successfully; users can open the Live page, switch to the Camera Recording tab, enable a working camera preview, stop the camera cleanly, and start/stop recording to produce a playable local recording URL with clear English error messages when camera access fails.
