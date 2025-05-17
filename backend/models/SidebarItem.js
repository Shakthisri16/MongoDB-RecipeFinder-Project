const mongoose = require('mongoose');
const sidebarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('SidebarItem', sidebarSchema);
