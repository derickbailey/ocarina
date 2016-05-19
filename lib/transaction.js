var ConnectionManager = require("./connectionManager");

// Private Symbols
// ---------------

const CONNECTION_KEY = Symbol("Ocarina.Transaction.Connection");
const ACTION_KEY = Symbol("Ocarina.Transaction.Action");

// Transaction
// -----------

function Transaction(){
}

// API
// ---

Transaction.prototype.getConnection = function(cb){
  var connection = this[CONNECTION_KEY];
  if (connection){ return cb(undefined, connection); }

  ConnectionManager.getConnection((err, conn) => {
    if (err) { return cb(err); }
    this[CONNECTION_KEY] = conn;
    return cb(undefined, conn);
  });
};

Transaction.prototype.commit = function(cb){
  return this[ACTION_KEY]("commit", cb);
};

Transaction.prototype.rollback = function(cb){
  return this[ACTION_KEY]("rollback", cb);
};

// Private API
// -----------

Transaction.prototype[ACTION_KEY] = function(action, cb){
  this.getConnection(function(err, connection){
    if (err) { return cb(err); }
    connection[action](function(err){
      if (err) { return cb(err); }
      connection.release(cb);
    });
  });
};

// Exports
// -------

module.exports = Transaction;