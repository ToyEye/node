export const ctrlWrapper = (ctrl) => {
  const func = async (req, resp, next) => {
    try {
      ctrl(req, resp, next);
    } catch (error) {
      next(error);
    }
  };
  return func;
};
