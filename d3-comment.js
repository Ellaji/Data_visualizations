// d3.comments D3 version 4
// Based on the d3-tip.js, Copyright (c) 2013 Justin Palmer
// Based on the d3-tip.js, ES6 / D3 v4 Adaption Copyright (c) 2016 Constantin Gavrilete
// Based on the d3-tip.js, Removal of ES6 for D3 v4 Adaption Copyright (c) 2016 David Gotz

// Copyright (c) 2017 Mirella Kersten
//
// Comment fields on data points for d3.js

d3.functor = function functor(v) {
  return typeof v === "function" ? v : function() {
    return v;
  };
};

d3.comment = function() {

  var direction = d3_comment_direction,
      offset    = d3_comment_offset,
      html      = d3_comment_html,
      node      = initNode(),
      svg       = null,
      point     = null,
      target    = null

  function comment(vis) {
    svg = getSVGNode(vis)
    point = svg.createSVGPoint()
    document.body.appendChild(node)
  }

  // Public - show the toolcomment on the screen
  //
  // Returns a comment
  comment.show = function() {
    var args = Array.prototype.slice.call(arguments)
    if(args[args.length - 1] instanceof SVGElement) target = args.pop()

    var content = html.apply(this, args),
        poffset = offset.apply(this, args),
        dir     = direction.apply(this, args),
        nodel   = getNodeEl(),
        i       = directions.length,
        coords,
        scrollTop  = document.documentElement.scrollTop || document.body.scrollTop,
        scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft

    nodel.html(content)
      .style('position', 'absolute')
      .style('opacity', 1)
      .style('pointer-events', 'all')

    while(i--) nodel.classed(directions[i], false)
    coords = direction_callbacks[dir].apply(this)
    nodel.classed(dir, true)
      .style('top', (coords.top +  poffset[0]) + scrollTop + 'px')
      .style('left', (coords.left + poffset[1]) + scrollLeft + 'px')

    return comment
  }

  // Public - hide the toolcomment
  //
  // Returns a comment
  comment.hide = function() {
    var nodel = getNodeEl()
    nodel
      .style('opacity', 0)
      .style('pointer-events', 'none')
    return comment
  }

  // Public: Proxy attr calls to the d3 comment container.  Sets or gets attribute value.
  //
  // n - name of the attribute
  // v - value of the attribute
  //
  // Returns comment or attribute value
  comment.attr = function(n, v) {
    if (arguments.length < 2 && typeof n === 'string') {
      return getNodeEl().attr(n)
    } else {
      var args =  Array.prototype.slice.call(arguments)
      d3.selection.prototype.attr.apply(getNodeEl(), args)
    }

    return comment
  }

  // Public: Proxy style calls to the d3 comment container.  Sets or gets a style value.
  //
  // n - name of the property
  // v - value of the property
  //
  // Returns comment or style property value
  comment.style = function(n, v) {
    // debugger;
    if (arguments.length < 2 && typeof n === 'string') {
      return getNodeEl().style(n)
    } else {
      var args = Array.prototype.slice.call(arguments);
      if (args.length === 1) {
        var styles = args[0];
        Object.keys(styles).forEach(function(key) {
          return d3.selection.prototype.style.apply(getNodeEl(), [key, styles[key]]);
        });
      }
    }

    return comment
  }

  // Public: Set or get the direction of the toolcomment
  //
  // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
  //     sw(southwest), ne(northeast) or se(southeast)
  //
  // Returns comment or direction
  comment.direction = function(v) {
    if (!arguments.length) return direction
    direction = v == null ? v : d3.functor(v)

    return comment
  }

  // Public: Sets or gets the offset of the comment
  //
  // v - Array of [x, y] offset
  //
  // Returns offset or
  comment.offset = function(v) {
    if (!arguments.length) return offset
    offset = v == null ? v : d3.functor(v)

    return comment
  }

  // Public: sets or gets the html value of the toolcomment
  //
  // v - String value of the comment
  //
  // Returns html value or comment
  comment.html = function(v) {
    if (!arguments.length) return html
    html = v == null ? v : d3.functor(v)

    return comment
  }

  // Public: destroys the toolcomment and removes it from the DOM
  //
  // Returns a comment
  comment.destroy = function() {
    if(node) {
      getNodeEl().remove();
      node = null;
    }
    return comment;
  }

  function d3_comment_direction() { return 'ne' }
  function d3_comment_offset() { return [0, 0] }
  function d3_comment_html() { return ' ' }

  var direction_callbacks = {
    nw: direction_nw,
    ne: direction_ne,
    sw: direction_sw,
    se: direction_se
  };

  var directions = Object.keys(direction_callbacks);

  function direction_nw() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.nw.y - node.offsetHeight,
      left: bbox.nw.x - node.offsetWidth
    }
  }

  function direction_ne() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.ne.y - node.offsetHeight,
      left: bbox.ne.x
    }
  }

  function direction_sw() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.sw.y,
      left: bbox.sw.x - node.offsetWidth
    }
  }

  function direction_se() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.se.y,
      left: bbox.se.x
    }
  }

  function initNode() {
    var node = d3.select(document.createElement('div'))
    node
        .style('position', 'absolute')
        .style('top', 0)
        .style('opacity', 1)//reset this to 0 after finishing arrow
        .style('pointer-events', 'none')
        .style('box-sizing', 'border-box')
      //now we are making the arrow
      .append("svg")
        .attr('class', "d3-comment__arrow ne")
        .style('width', 50)
        .style('height', 25)
        .attr('viewBox', "0 0 1500 750")
      .append("path")
        .attr('d', "M 0 25 L 500 25 L 1000 500")
        .attr('fill', "none")
        .attr('stroke', "black")
        .attr('stroke-width', "50")
      .append("g")
        .attr('transform', "translate(1000,500)")
      .append("g")
        .attr('transform', "rotate(45)")
      .append("g")
        .attr('transform', "scale(100)")
      .append("g")
        .attr('transform', "translate(0,-1.5)")
        .attr('id', "d3-append-anchor");

     var nodeAnchorForNonNestedTags = d3.select('#d3-append-anchor').enter();

     nodeAnchorForNonNestedTags.append("clipPath")
        .attr('id', "cp1")
      .append("rect")
        .attr('x', -0.5)
        .attr('y', 0)
        .style('width', 4)
        .style('height', 3);

    nodeAnchorForNonNestedTags.append("g")
        .attr('clip-path', "url(#cp1)")
      .append("g")
        .attr('transform', "scale(.3)")
      .append("g")
        .style('fill', "black")
        .style('stroke', "none")
      .append("path")
        .attr('d', "M 0 0 L 10 5 L 0 10 z");

    return node.node();
  }

  function getSVGNode(el) {
    el = el.node()
    if(el.tagName.toLowerCase() === 'svg')
      return el

    return el.ownerSVGElement
  }

  function getNodeEl() {
    if(node === null) {
      node = initNode();
      // re-add node to DOM
      document.body.appendChild(node);
    };
    return d3.select(node);
  }

  // Private - gets the screen coordinates of a shape
  //
  // Given a shape on the screen, will return an SVGPoint for the directions
  // n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
  // sw(southwest).
  //
  //    +-+-+
  //    |   |
  //    +   +
  //    |   |
  //    +-+-+
  //
  // Returns an Object {n, s, e, w, nw, sw, ne, se}
  function getScreenBBox() {
    var targetel   = target || d3.event.target;

    while ('undefined' === typeof targetel.getScreenCTM && 'undefined' === targetel.parentNode) {
        targetel = targetel.parentNode;
    }

    var bbox       = {},
        matrix     = targetel.getScreenCTM(),
        tbbox      = targetel.getBBox(),
        width      = tbbox.width,
        height     = tbbox.height,
        x          = tbbox.x,
        y          = tbbox.y

    point.x = x
    point.y = y
    bbox.nw = point.matrixTransform(matrix)
    point.x += width
    bbox.ne = point.matrixTransform(matrix)
    point.y += height
    bbox.se = point.matrixTransform(matrix)
    point.x -= width
    bbox.sw = point.matrixTransform(matrix)
    point.y -= height / 2
    bbox.w  = point.matrixTransform(matrix)
    point.x += width
    bbox.e = point.matrixTransform(matrix)
    point.x -= width / 2
    point.y -= height / 2
    bbox.n = point.matrixTransform(matrix)
    point.y += height
    bbox.s = point.matrixTransform(matrix)

    return bbox
  }

  return comment
};