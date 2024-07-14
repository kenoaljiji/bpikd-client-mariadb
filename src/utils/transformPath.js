function transformPath(path) {
  if (typeof path !== "string") {
    console.error("Invalid input to transformPath:", path);
    return ""; // Return a default value or handle as appropriate
  }
  return path.toLowerCase().replace(/\s+/g, "-");
}

export default transformPath;
