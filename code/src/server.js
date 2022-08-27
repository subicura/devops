const server = require('./app')({
  logger: {
    level: 'info',
  }
});

// Run the server!
server.listen(3000, '0.0.0.0', function (err) {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
});
