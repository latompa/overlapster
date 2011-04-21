function intersectLineLine(a1x,a1y,a2x,a2y,b1x,b1y,b2x,b2y) {

  var intersection=Array(2);
  ua_t = (b2x-b1x)*(a1y-b1y)-(b2y-b1y)*(a1x-b1x);
  ub_t = (a2x-a1x)*(a1y-b1y)-(a2y-a1y)*(a1x-b1x);
  u_b  = (b2y-b1y)*(a2x-a1x)-(b2x-b1x)*(a2y-a1y);

  if ( u_b != 0 ) {
    ua = ua_t / u_b;
    ub = ub_t / u_b;

    // find intersection point
    if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
      var ix=(a1x+ua*(a2x-a1x));
      var iy=(a1y+ua*(a2y-a1y));
      //return true only if this intersection point isn't one of the endpoints
      if( (ix==a1x && iy==a1y)  || 
        (ix==a2x && iy==a2y)  || 
        (ix==b1x && iy==b1y)  ||
        (ix==b2x && iy==b2y) ) {
        return false;
      } else {
        return true;              
      }

    } else {
      return false;
    }
  } else {
    return false;
  }
}