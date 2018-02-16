let id = 0;
module.exports = ({ t: types }) => ({
  visitor: {
    Function: (path, state) => {
      const label = state.opts.name || "gu";
      Object.keys(path.scope.bindings).forEach(ref =>
        path.scope.rename(ref, `${label}${id++}`)
      );
    }
  }
});
