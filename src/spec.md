# Specification

## Summary
**Goal:** Make the Admin Panel accessible via role-based admin gating (including a safe first-admin bootstrap), align role lookup APIs, and complete the Admin Panel’s “Update Results” and “Track Accuracy” workflows end-to-end.

**Planned changes:**
- Add backend + frontend support to grant admin role to the currently authenticated user, including a one-time bootstrap flow when no admins exist and an admin-only promotion path when admins already exist.
- Ensure the backend exposes (or the frontend uses) a role endpoint matching `useCurrentUser()` expectations (e.g., `getCallerUserRole()`) so `isAdmin` is computed reliably for signed-in users.
- Implement Results storage and admin-only mutations in the backend to create/update ticket results (e.g., win/loss and completion time) keyed by ticket id.
- Update the Admin Panel UI to support “Update Results” submission and a “Track Accuracy” view showing basic metrics (total decided, wins, losses, win rate), with English success/error toasts.
- Keep `/admin` routing behavior correct (Admin link visibility + AccessDenied for non-admins) and refresh cached role state after admin is granted so the Admin link appears without a hard reload.
- Ensure the Results page remains consistent with backend-stored Results data if it reads/depends on results.

**User-visible outcome:** An authenticated user can be safely made an admin (via first-admin bootstrap or admin promotion), the Admin link and `/admin` access reflect their role, and admins can update ticket results and view accuracy metrics directly in the Admin Panel with clear English feedback.
