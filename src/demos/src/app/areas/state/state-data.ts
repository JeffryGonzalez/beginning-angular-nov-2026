import { Service, signal } from '@angular/core';

type ByVals = 1 | 3 | 5;

@Service() // @Injectable({providedIn: 'root'})s
export class StateData {
  private readonly _by = signal<ByVals>(1);
  private readonly _current = signal(0);

  public readonly current = this._current.asReadonly();

  public readonly by = this._by.asReadonly();

  public setBy(val: ByVals) {
    this._by.set(val);
  }

  increment() {
    this._current.update(inc);
  }

  decrement() {
    this._current.update(dec);
  }
}

function inc(n: number) {
  return n + 1;
}

function dec(n: number) {
  return n - 1;
}
