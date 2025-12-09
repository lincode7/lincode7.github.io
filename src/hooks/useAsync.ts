export const createSuspenseResource = <Args extends any[], Return>(
  asyncFn: (...args: Args) => Promise<Return>
) => {
  const pending = new Map();
  let result = new Map();

  return {
    read(...args: Args): Return {
      const key = JSON.stringify(args);

      if (result.has(key)) {
        const cached = result.get(key);
        if (cached.status === "success") {
          return cached.data;
        }
        throw cached.error; // 如果有错误，抛出错误
      }

      if (!pending.has(key)) {
        const suspender = asyncFn(...args)
          .then((res) => {
            result.set(key, {
              status: "success",
              data: res,
            });
            pending.delete(key);
          })
          .catch((error) => {
            result.set(key, {
              status: "error",
              error,
            });
            pending.delete(key);
          });
        pending.set(key, suspender);
      }

      throw pending.get(key);
    },
  };
};
