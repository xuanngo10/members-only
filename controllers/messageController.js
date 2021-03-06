const Message = require("../models/Message");
const User = require("../models/User");

// Display all messages
exports.messages_display_get = async (req, res) => {
  const messages = await Message.find().populate("user");
  let id = undefined;

  if (req.user) {
    id = req.user.id;
    res.render("index", { messages: messages, id: id });
  } else {
    res.render("index", { messages: messages, id: id });
  }
};

// Display new message form
exports.message_create_get = (req, res) => {
  res.render("message_form");
};

// Handle creating new message on POST
exports.message_create_post = async (req, res) => {
  const { title, message } = req.body;
  const { id } = req.user;
  const user = await User.findById(id);

  if (!title || !message) {
    res.send("missing required fields");
  } else {
    const newMessage = new Message({
      title,
      message,
    });
    user.messages.push(newMessage);
    newMessage.user = user;
    await user.save();
    await newMessage.save().then((result) => {
      res.redirect("/");
    });
  }
};

// Handle deleting message on POST
exports.message_delete_post = (req, res) => {
  const { id } = req.params;
  Message.findByIdAndDelete(id, (err, data) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.redirect("/");
    }
  });
};
