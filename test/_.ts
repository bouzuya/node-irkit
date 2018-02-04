
const promiseTry = <T>(h: () => T | Promise<T>): Promise<T> => {
  return new Promise((resolve) => resolve(h()));
};

const promiseFinally = <T, U>(promise: Promise<T>, f: () => U): Promise<T> => {
  return promise.then(
    (v) => {
      const g = () => Promise.resolve(v);
      return promiseTry(f).then(g, g);
    },
    (e) => {
      const g = () => Promise.reject(e);
      return promiseTry(f).then(g, g);
    }
  );
};

const fixture = <T>(
  { after, before }: {
    after: (context: T) => void;
    before: () => Promise<T>;
  },
  f: (context: T) => void
): () => Promise<void> => {
  return (): Promise<void> => {
    return promiseTry(before).then((context) => {
      return promiseFinally(
        promiseTry(() => f(context)),
        () => after(context)
      );
    });
  };
};

export { fixture };
