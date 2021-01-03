try {
  module.exports = require("./build/Release/tree_sitter_hcl_binding");
} catch (error) {
  try {
    module.exports = require("./build/Debug/tree_sitter_hcl_binding");
  } catch (_) {
    throw error
  }
}

try {
  module.exports.nodeTypeInfo = require("./src/node-types.json");
} catch (_) {}
