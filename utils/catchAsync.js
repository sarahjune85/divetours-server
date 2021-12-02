// async error handler refactor - try/catches transferred to this function:
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
