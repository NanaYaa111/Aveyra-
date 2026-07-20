import type { Mutation, SyncTransport } from './types';

/**
 * The default transport for Milestone 1: a local stub that accepts nothing and
 * returns nothing. It exists so the rest of the app can be written against the
 * SyncTransport boundary today, with a real E2EE relay dropped in at Milestone 2
 * — no code above this line changes when that happens.
 *
 * Deliberately a no-op: there is no second device yet, and showing sync state
 * for sync that does not exist would be a false statement (Constitution Part 2
 * §5). So this neither reports progress nor claims success.
 */
export class LocalStubTransport implements SyncTransport {
  readonly name = 'local-stub';

  async push(_mutations: Mutation[]): Promise<string[]> {
    // Intentionally accepts nothing: mutations stay pending in the outbox until
    // a real transport exists.
    return [];
  }

  async pull(_sinceTimestamp: number): Promise<Mutation[]> {
    return [];
  }
}
