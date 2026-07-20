import { getOutbox, Outbox } from './outbox';
import { LocalStubTransport } from './transport';
import type { Mutation, SyncTransport } from './types';

/**
 * The sync engine sits at the local-truth / remote-state boundary. In
 * Milestone 1 it is wired to the LocalStubTransport, so calling sync() is a
 * safe no-op — the outbox simply retains everything. Milestone 2 swaps in a
 * real E2EE transport without touching callers.
 *
 * Conflict strategy (applied when a real transport lands): last-writer-wins by
 * (version, then timestamp), with losing changes retained as conflict records
 * rather than discarded.
 */
export class SyncEngine {
  constructor(
    private transport: SyncTransport = new LocalStubTransport(),
    private outbox: Outbox = getOutbox(),
  ) {}

  /** Swap the transport (e.g. install the real relay in Milestone 2). */
  setTransport(transport: SyncTransport): void {
    this.transport = transport;
  }

  /**
   * Attempt to flush the outbox through the transport. Returns how many
   * mutations were accepted (0 with the stub). Never throws into the UI and
   * never surfaces sync status to the user in this phase.
   */
  async flush(): Promise<number> {
    const pending = await this.outbox.pending();
    if (pending.length === 0) return 0;
    const accepted = await this.transport.push(pending);
    if (accepted.length > 0) await this.outbox.markSynced(accepted);
    return accepted.length;
  }

  /** Resolve two versions of a record. Exposed for Milestone 2 + tests. */
  static resolveConflict(local: Mutation, remote: Mutation): Mutation {
    if (remote.version !== local.version) {
      return remote.version > local.version ? remote : local;
    }
    return remote.timestamp >= local.timestamp ? remote : local;
  }
}

let engine: SyncEngine | null = null;
export function getSyncEngine(): SyncEngine {
  if (!engine) engine = new SyncEngine();
  return engine;
}
