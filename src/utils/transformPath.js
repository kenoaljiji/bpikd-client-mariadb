function transformPath(path) {
  return path.toLowerCase().replace(/\s+/g, "-");
}

export default transformPath;
