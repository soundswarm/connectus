var User = require('../../../users/user.model.js');
var Outlet = require('../../../outlets/outlet.model.js');
var Promise = require('bluebird');
var Reservation = require('../../../outlets/outlet.model.js');


module.exports = getBuyerReservations = function(user, res){
  
  User.forge({
    username: user.id
  })
  .fetch()
  .then(function(user){
	  return user.reservations()
    .fetch()
	  .then(function(reservations){
	    return reservations.mapThen(function(reservation){
        return reservation.outlet().fetch()
        .then(function(outlet){
          return reservation.set('outlet_info', outlet);
        })
        .then(function(){
          return reservation.seller().fetch()
          .then(function(seller){
            return reservation.set('seller_info', seller);
          });
        })
        .then(function(){
          return reservation.transaction().fetch()
          .then(function(transaction){
            return reservation.set('transaction_info', transaction);
          });
        });
      })
      .then(function(modifiedRes){
        res.send(JSON.stringify(modifiedRes));
      });
		});
  })
  .catch(function(error){
    console.log(error);
  });
};