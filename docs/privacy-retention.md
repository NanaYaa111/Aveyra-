# Privacy, retention, and deletion (summary)

This document summarizes how Aveyra handles user data, retention, exports, and deletion. It is a developer-facing companion to any legal privacy policy and should be kept in sync with UI copy.

## What we store
- Relationships metadata (partner name, ids).
- Encrypted content: answers, memories, journal entries (encrypted at rest in local DB). Images are not yet included in exports (v1 limitation).

## Encryption
- Content fields are encrypted at rest on the device before being written to IndexedDB (`lib/database/service.ts`).
- Device-specific keypair + content key are managed by `KeyManager` ([lib/encryption/keyManager.ts]).
- If passphrase mode is used, the content key is wrapped and requires manual unlock.

## Exports
- Users can export a full, decrypted snapshot (`DatabaseService.exportSnapshot()`), which includes soft-deleted items and settings for completeness.
- Exports are plaintext files controlled by the user — advise users to store them securely.

## Deletion & Retention
- Soft delete: records are marked with `deleted_at` and remain in the DB until explicitly purged.
- Recovery: soft-deleted items can be restored from Recently Deleted.
- Purge: the only hard-delete happens via an explicit user action in Recently Deleted.

## Recommendations
- Document retention defaults for user-facing privacy policy (e.g., "We keep soft-deleted items for X days before permanent purge unless you request immediate deletion").
- Clarify the difference between local-at-rest encryption and server-side encryption when Supabase sync is enabled.

## Missing items (legal/ops)
- Formal retention timeframes and whether backups are retained in any hosting provider.
- Data processing agreement (DPA) if storing EU personal data in a third-party provider.
