import { Subject } from "rxjs";
const check = new Subject<"next" | "create">();
const next = new Subject<boolean>();
const create = new Subject<boolean>();
const prev = new Subject<void>();
export function useStepper() {
  return {
    check$: check.asObservable(),
    prev$: prev.asObservable(),
    next$: next.asObservable(),
    create$: create.asObservable(),
    next,
    check,
    create,
  };
}
