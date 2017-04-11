const xenon = require("xenon");

var gambleServer = xenon();

gambleServer.setBasePath(__dirname);
gambleServer.run();
