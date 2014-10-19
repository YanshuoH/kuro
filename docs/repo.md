/kuro
  /config
    /middlewares
      authorization.js    -- authorization middleware which handle the access of detail data by session.passport
    config.js    -- global configs
    express.js    -- express configs
    passport.js    -- passport configs, including local strategy of registration. TODO: oauth of google/facebook etc.
    routes.js    -- route list, all rest api and auth logic
  /db
    /_asset    -- where stores data
    loadFixture.js    -- useful script helps to insert test data into mongodb, it is very brutal and stupid. Use it with caution and intelligent
    mongo_config.js    -- mongo config class which control the connexion between node server and mongodb
  /docs
  /lib    -- useful scripts/libraries used in server side
    utils.js    -- I put almost all customizing stuff here
  /models    -- mongoose schema registration in mongodb
    BaseModel.js    -- a base model script which load all other files in the dir
    ProjectModel.js
    UserModel.js
    TaskModel.js
  /node_modules    -- node submodules here. TODO: managing them using git submodule
    ...
  /public    -- public static things. TODO: compression in prod environement
    /css
    /js
      /lib
      app.js    -- main angular app
      config.js    -- angular config, all frontend router logic here
      controllers.js    -- all frontend controllers here. TODO: reorganize into pieces
      directives.js    -- well, I won't explain more either you familiar of angular or not
      filters.js
      services.js
  /routes    -- we call them mostly controllers
    index.js    -- the website index routes served fo angular
    project.js
    task.js
    user.js
  /views    -- jade views here
    /layouts    -- mostly for foot/head of frontend page.
    /partials    -- angular ng-view
    index.jade    -- also called base view
  package.json    -- npm modules list
  server.js    -- start node server, workflow controlled by async