// Requiring necessary npm packages
const express = require("express"),
      session = require("express-session"),
  // Requiring passport as we've configured it
      passport = require("./config/passport"),
  // Set Handlebars.
      Handlebars = require("handlebars");
      exphbs = require("express-handlebars"),
      {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access")

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;

const db = require("./models");


// Creating express app and configuring middleware needed for authentication
const app = express();
// handlebars stuff
app.engine("handlebars", exphbs({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);

app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
require("./routes/userdata-routes.js")(app);


// Syncing our database and logging a message to the user upon success
db.sequelize.sync({force: true}).then(() => {
  app.listen(PORT, () => {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
