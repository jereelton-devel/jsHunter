/*
*
* Project: jsHunter Javascript Library - 2020 (by JOTICODE)
* Author: Jereelton Teixeira
* Release: 1.0.0
* Date: 2019-11-01
*
* JOTICODE is a property of the JEREELTON DE OLIVEIRA TEIXEIRA - ME
* Use as open source code, but no sell it to anyone, however make a fork
*
*/

;(function(){

    /***
     * Constructor of lib
     * */

    const jsHunter = function(_selector, _args) {

        if(!(this instanceof jsHunter)) {
            return new jsHunter(_selector, _args);
        }

        try {
            if(_selector) {
                this.sel = jsHunter.sel = document.querySelectorAll(_selector);
                if(!this.sel) {
                    throw "Invalid selector ("+_selector+"), use id, class or label";
                }
            } else {
                this.sel = this.selector = _selector = undefined;
            }
        } catch(err) {
            console.error(err);
        } finally {
            if(_selector && !this.sel) {
                console.error("[Exception] jsHunter is not done, check your selector calling !");
            } else {
                this.selector = jsHunter.selector = _selector;
                this.args     = jsHunter.args = _args;
            }
        }
    }

    let
        userAgent = navigator.userAgent.toLowerCase(),
        nodes     = [],
        node      = "",
        fadeCtrl  = null, //FadeIn FadeOut Effects Controls
        sizeCtrl  = null;

    /***
     * Private Generic Funcions
     * */

    function _getStyles(_element) {

        let s = window.getComputedStyle(_element); // Element Styles
        let w = parseInt(s.width);  // Element Width Pixels
        let h = parseInt(s.height); // Element Height Pixels

        return {
            all: s,
            width: w,
            height: h,
            save_width: w
        };
    }

    function _setAttributesStyles(e, p) {

        let s = "";
        if(p.hasOwnProperty("text_color")) { s += "color: "+p.text_color+";"; }
        if(p.hasOwnProperty("text_align")) { s += "text-align: "+p.text_align+";"; }
        if(p.hasOwnProperty("font_size"))  { s += "font-size: "+p.font_size+";"; }
        if(p.hasOwnProperty("width"))     { s += "width: "+p.width+";"; }
        if(p.hasOwnProperty("height"))    { s += "height: "+p.height+";"; }
        if(p.hasOwnProperty("position"))  { s += "position: "+p.position+";"; }
        if(p.hasOwnProperty("z_index"))   { s += "z-index: "+p.z_index+";"; }
        if(p.hasOwnProperty("top"))       { s += "top: "+p.top+";"; }
        if(p.hasOwnProperty("right"))      { s += "right: "+p.right+";"; }
        if(p.hasOwnProperty("bottom"))      { s += "bottom: "+p.bottom+";"; }
        if(p.hasOwnProperty("left"))      { s += "left: "+p.left+";"; }
        if(p.hasOwnProperty("margin"))    { s += "margin: "+p.margin+";"; }
        if(p.hasOwnProperty("margin_left"))    { s += "margin-left: "+p.margin_left+";"; }
        if(p.hasOwnProperty("margin_right"))    { s += "margin-right: "+p.margin_right+";"; }
        if(p.hasOwnProperty("margin_bottom"))    { s += "margin-bottom: "+p.margin_bottom+";"; }
        if(p.hasOwnProperty("margin_top"))    { s += "margin-top: "+p.margin_top+";"; }
        if(p.hasOwnProperty("padding"))   { s += "padding: "+p.padding+";"; }
        if(p.hasOwnProperty("padding_top")){ s += "padding-top: "+p.padding_top+";"; }
        if(p.hasOwnProperty("transition")){ s += "transition: "+p.transition+";"; }
        if(p.hasOwnProperty("display"))   { s += "display: "+p.display+";"; }
        if(p.hasOwnProperty("overflow"))  { s += "overflow: "+p.overflow+";"; }
        if(p.hasOwnProperty("border_radius"))  { s += "border-radius: "+p.border_radius+";"; }
        if(p.hasOwnProperty("box_shadow"))  { s += "box-shadow: "+p.box_shadow+";"; }

        //RGBA
        if(p.hasOwnProperty("back_color") && p.hasOwnProperty("opacity") && p.opacity !== "1") {
            s += "background: rgba("+jsHunter.fn.hexToRgb(p.back_color).rgb+","+p.opacity+");";
            //HEXADECIMAL
        } else {
            s += "background-color: "+p.back_color+";";
        }

        e.setAttribute("style", s);
    }

    function _createHtmlElement(params) {

        let htmlElement = document.createElement(params.element);
        htmlElement.setAttribute(params.attr_type, params.attr_name.replace("#", ""));

        if(params.hasOwnProperty('styles')) {
            _setAttributesStyles(htmlElement, params.styles);
        }

        let _el_ = document.querySelectorAll(params.append);
        let keys = Object.keys(_el_);

        keys.forEach(function(index) {
            _el_[index].appendChild(htmlElement);
        });

        return htmlElement;
    }

    function _middlePositionConfigure(element_id, element_width, element_height) {
        _MarginAutoConfigure(element_id, element_width);
        _marginTopConfigure(element_id, element_height);
    }

    function _MarginAutoConfigure(element_id, element_width) {
        let screen_width = window.innerWidth;
        let initial_calc = screen_width - parseInt(element_width);
        let margin_calc = initial_calc / 2;

        margin_calc = (margin_calc < 0) ? 0: margin_calc;

        element_id.style.left = (margin_calc - element_id.style.padding) + "px";

    }

    function _marginTopConfigure(element_id, element_height) {
        let screen_height = window.innerHeight;
        let initial_calc = screen_height - parseInt(element_height);
        let margin_calc = ( initial_calc - 30 ) / 2;

        margin_calc = (margin_calc < 0) ? 0: margin_calc;

        element_id.style.top = margin_calc + "px";
    }

    function _changeElementSize(element, orientation, size, measure) {

        switch (orientation) {
            case 'width':
                element.style.width = size + measure;
                break;
            case 'height':
                element.style.height = size + measure;
                break;
            default:
                console.error("[Error]: Increase Element Function: element is invalid !");
        }
    }

    function _opacityElement(element, op) {
        element.style.opacity = op;
    }

    function _doAttr(_sel, type, value, tnode) {

        if(tnode === "nodeList") {

            switch (type) {
                case "src":
                    _sel.forEach(function (a, index) {
                        _sel[index].attributes.src.value = value;
                    })
                    break;
                case "disabled":
                    _sel.forEach(function (a, index) {
                        _sel[index].disabled = value;
                    })
                    break;
                case "href":
                    _sel.forEach(function (a, index) {
                        _sel[index].href = value;
                    })
                    break;
                default:
                    jsHunter.fn.exception("attr() error " + type);
            }

        } else if(tnode === "node") {

            switch (type) {
                case "src":
                    _sel.attributes.src.value = value;
                    break;
                case "disabled":
                    _sel.disabled = value;
                    break;
                case "href":
                    _sel.href = value;
                    break;
                default:
                    jsHunter.fn.exception("attr() error " + type);
            }
        }
    }

    jsHunter.fn = jsHunter.prototype = {

        /***
         * Testing Installation
         * */

        // for test your application, see:
        // http://joticode.com/works/jshunter/#_test_-installation
        _test_: function(param) {
            console.log("Test is running...", param);
            let _sel = this.sel || nodes;
            let keys = Object.keys(_sel);
            (keys.length > 0) ?
                keys.forEach(function(index) {
                    console.log("test_1", typeof _sel, _sel.length, _sel[index]);
                })
            :
            (_sel) ?
                console.log("test_2", typeof _sel, _sel.length, _sel)
                :
                console.error("test", typeof _sel, _sel.length, _sel);
            console.log("Your test was performed successfully");
            return this;
        }, //DONE & DOCUMENTATION

        /***
         * Internal Functions
         * */

        exception: function(msg){
            throw msg;
        }, //DONE INTERNAL

        noth: function() {
            (function(){void(0);})();
        }, //TODO

        /***
         * Using
         * */

        loaded: function(callback) {
            window.onload = function() {

                if (typeof callback === "function") {
                    callback();
                } else {
                    console.info("[Warning] callback is:", typeof callback);
                }
            }
        }, //DONE & DOCUMENTATION

        /***
         * Requesters and Responses
         * */

        ajax: function(){
        }, //TODO

        response: function(){
        }, //TODO

        requester: function(){
        }, //TODO

        /***
         * Properties Handler
         * */

        props: function(type, value) {
            return this.attr(type, value);
        },//DONE & DOCUMENTATION

        attr: function(type, value) {
            try {
                let _sel = this.sel;
                (_sel && typeof  _sel === "object" || Array.isArray(_sel)) ?
                    (function() {
                        _doAttr(_sel, type, value, "nodeList");
                    })() : (_sel) ?
                    (function(){
                        _doAttr(_sel, type, value, "node");
                    })() : jsHunter.fn.exception("attr() error " + type);
            } catch(err) {
                console.error(err);
            }
            return this;
        },//DONE & DOCUMENTATION

        screenSizer: function(params) {
            sizeCtrl = setInterval(function() {
                let s = $$.screen();
                let w = 0;
                let h = 0;
                /*Width*/
                if(params.hasOwnProperty('width') && params.width.hasOwnProperty('calc')) {
                    w = Math.ceil(100 - (($$.intNumber(params.width.calc) / s.width) * 100)) + (params.width.adjust || 0);
                    w = w + "%";
                } else if(params.hasOwnProperty('width') && params.width.hasOwnProperty('fixed')) {
                    w = params.width.fixed;
                } else {
                    console.exception("Invalid value to parameter width in function screenSizer()");
                }
                /*Height*/
                if(params.hasOwnProperty('height') && params.height.hasOwnProperty('calc')) {
                    h = Math.ceil(100 - (($$.intNumber(params.height.calc) / s.height) * 100)) + (params.height.adjust || 0);
                    h = h + "%";
                } else if(params.hasAttribute('height') && params.height.hasOwnProperty('fixed')) {
                    h = params.height.fixed;
                } else {
                    console.exception("Invalid value to parameter height in function screenSizer()");
                }

                jH(params.target).width(w);
                jH(params.target).height(h);

                console.log("screenSizer", w, h);
            }, 500);

            if(params.state === false) {
                clearInterval(sizeCtrl);
            }

            if(params.timeout > 0) {
                setTimeout(function() {
                    clearInterval(sizeCtrl);
                }, params.timeout);
            }
            return null;
        },//DONE & DOCUMENTATION

        screenSizerStop: function() {
            clearInterval(sizeCtrl);
            return null;
        },//DONE & DOCUMENTATION

        /***
         * Events Listener
         * */

        click: function(param = "", callback) {
            let _sel = this.sel;
            let keys = Object.keys(_sel);
            (keys.length > 0) ?
                keys.forEach(function(index) {
                    _sel[index].removeEventListener("click", jsHunter.fn.noth);
                    _sel[index].addEventListener("click", function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        if(typeof callback === "function") {
                            callback(param);
                        } console.log("click-1");
                    });
                }) : (_sel) ? (function (){
                    _sel.removeEventListener("click", jsHunter.fn.noth);
                    _sel.addEventListener("click", function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        if(typeof callback === "function") {
                            callback(param);
                        } console.log("click-2");
                    })
                })()
                 : jsHunter.fn.exception("click() error " + _sel);
            return this;
        }, //DONE & DOCUMENTATION

        isOn: function(params, index) {
            let _sel    = this.sel;
            let keys    = Object.keys(_sel);
            let state   = "";
            let element = (keys.length > 0) ? _sel[index] : _sel;
            try {
                (!params || typeof params === undefined) ?
                    jsHunter.fn.exception("isOn() error: missing params !") :
                    (params.type === "classname") ?
                        (element.className.search(params.value) >= 0) ?
                            state=true : state=false :
                        (params.type === "id") ?
                            (element.id === params.value) ?
                                state=true : state=false :
                            (params.type === "disabled") ?
                                (element.disabled === params.value) ?
                                    state=true : state=false :
                                jsHunter.fn.exception("isOn() error: invalid params -> " + params.type);
            } catch(err) {
                console.error(err);
            }
            return state;
        }, //DONE & DOCUMENTATION

        on: function(ev, callback) {
            let _sel = this.sel;
            let args = this.args;
            let keys = (_sel) ? Object.keys(_sel) : "";
            try {
                (keys.length > 0) ?
                    keys.forEach(function(index) {
                        _sel[index].removeEventListener(ev, jsHunter.fn.noth);
                        _sel[index].addEventListener(ev, function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            callback((args === undefined) ? "" : (args.rsp === 'eventTarget') ? jsHunter.fn.getData(args.rsp, e) : jsHunter.fn.getData(args.rsp, _sel[index]));
                        });
                    }) : (_sel) ?
                    (function(){
                        _sel.removeEventListener(ev, jsHunter.fn.noth);
                        _sel.addEventListener(ev, function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            callback((args === undefined) ? "" : (args.rsp === 'eventTarget') ? jsHunter.fn.getData(args.rsp, e) : jsHunter.fn.getData(args.rsp, _sel));
                        })
                    })() : jsHunter.fn.exception("on() error: check you calling: "+ev);

            } catch(err) {
                console.error(err);
            }
            return this;
        }, //DONE & DOCUMENTATION

        /***
         * Writers And Modifiers
         * */

        html: function(text) {
            try {
                let _sel = this.sel;
                (_sel && typeof _sel === "object" || Array.isArray(_sel)) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].innerHTML = text;
                    }) : (_sel) ?
                    _sel.innerHTML = text : jsHunter.fn.exception("html() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        },//DONE & DOCUMENTATION

        append: function(text) {
            try {
                let _sel = this.sel;
                (_sel && typeof _sel === "object" || Array.isArray(_sel)) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].innerHTML += text;
                    }) : (_sel) ?
                    _sel.innerHTML += text : jsHunter.fn.exception("append() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        }, //DONE & DOCUMENTATION

        addClass: function(classname, index) {console.log("CLASSNAME::: ",classname);
            let _sel    = this.sel;
            let keys    = (_sel) ? Object.keys(_sel) : "";
            let element = (keys.length > 0) ?
                (index) || (index >= 0) ? _sel[index] : _sel : _sel;
            try {
                if((index || index >=0) && nodes.length > 0) { console.log("IF1");
                    if(!jsHunter.fn.matchClass(nodes[index], classname)) {
                        nodes[index].className += " " + classname;
                    }
                } else if(nodes.length > 0 && !index) { console.log("IF2");
                    nodes.forEach(function(inode) {
                        if(!jsHunter.fn.matchClass(inode, classname)) {
                            inode.className += " " + classname;
                        }
                    });
                } else if(node) { console.log("IF3");
                    if(!jsHunter.fn.matchClass(node, classname)) {
                        node.className += " " + classname;
                    }
                } else if(element.length > 0) { console.log("IF4");
                    keys.forEach(function(inode) {
                        if(!jsHunter.fn.matchClass(element[inode], classname)) {
                            element[inode].className += " " + classname;
                        }
                    });
                } else if(element && element.length > 0) { console.log("IF5");
                    if(!jsHunter.fn.matchClass(element, classname)) {
                        element.className += " " + classname;
                    }
                } else { console.log("ELSE");
                    jsHunter.fn.exception("addClass() error, nodes and selector is undefined !");
                }
            } catch(err) {
                console.error(err);
            }
            return this;
        }, //DONE & DOCUMENTATION

        removeClass: function(classname, index) {
            let _sel    = this.sel;
            let keys    = (_sel) ? Object.keys(_sel) : "";
            let element = (keys.length > 0) ?
                (index) || (index >= 0) ? _sel[index] : _sel : _sel;
            try {
                (index || index >= 0) && (nodes.length > 0) ?
                    nodes[index].classList.remove(classname) :
                    (nodes.length > 0) && (!index) ?
                        nodes.forEach(function(inode) {
                            inode.classList.remove(classname);
                        }) : (node) ?
                        node.classList.remove(classname) :
                        (element.length > 0) ?
                            keys.forEach(function(inode) {
                                element[inode].classList.remove(classname);
                            }) :
                            (element) ?
                                element.classList.remove(classname) :
                                jsHunter.fn.exception("removeClass() error, nodes is undefined !");
            } catch(err) {
                console.error(err);
            }
            return this;
        }, //DONE & DOCUMENTATION

        setClass: function(classname, index) {
            let _sel    = this.sel;
            let keys    = (_sel) ? Object.keys(_sel) : "";
            let element = (keys.length > 0) ?
                (index) || (index >= 0) ? _sel[index] : _sel : _sel;
            try {
                if((index || index >=0) && nodes.length > 0) { console.log("IF1");
                    nodes[index].className = classname;
                } else if(nodes.length > 0 && !index) { console.log("IF2");
                    nodes.forEach(function(inode) {
                        inode.className = classname;
                    });
                } else if(node) { console.log("IF3");
                    node.className = classname;
                } else if(element.length > 0) { console.log("IF4");
                    keys.forEach(function(inode) {
                        element[inode].className = classname;
                    });
                } else if(element) { console.log("IF5");
                    element.className = classname;
                } else { console.log("ELSE");
                    jsHunter.fn.exception("setClass() error, nodes and selector is undefined !");
                }
            } catch(err) {
                console.error(err);
            }
            return this;
        }, //DONE & DOCUMENTATION

        resetStyle: function(index) {
            let _sel    = this.sel;
            let keys    = (_sel) ? Object.keys(_sel) : "";
            let element = (keys.length > 0) ?
                (index) || (index >= 0) ? _sel[index] : _sel : _sel;
            try {
                if((index || index >= 0) && nodes.length >0) {
                    nodes[index].className = "";
                } else if(nodes.length > 0 && !index) {
                    nodes.forEach(function(inode) {
                        inode.className = "";
                    });
                } else if(node) {
                    node.className = "";
                } else if(element.length > 0) {
                    keys.forEach(function(inode) {
                        element[inode].className = "";
                    });
                } else if(element) {
                    element.className = "";
                } else {
                    jsHunter.fn.exception("resetStyle() error, nodes is undefined !")
                }
            } catch(err) {
                console.error(err);
            }
            return this;
        }, //DONE & DOCUMENTATION

        create: function(params) {
            let el = _createHtmlElement(params);
            (params.hasOwnProperty('timeout') && params.timeout > 0) ?
                (function(){
                    setTimeout(function(){
                        jsHunter.fn.remove(params.append, params.attr_name);
                    }, params.timeout);
                })() : jsHunter.fn.noth();
            return el;
        }, //TODO: DONE & DOCUMENTATION

        remove: function(parent, children) {

            let _el_ = document.querySelectorAll(parent);
            let keys = Object.keys(_el_);

            keys.forEach(function(index) {
                _el_[index].removeChild(document.querySelector(children));
            });

            return this;

        }, //DONE & DOCUMENTATION

        /***
         * Information Data
         * */

        text: function(i) {
            return (i >= 0) ? this.sel[i].textContent || this.sel[i].text :
                (this.sel[0].textContent || this.sel[0].text) ? this.sel[0].textContent || this.sel[0].text :
                    jsHunter.fn.exception("text() error " + this.sel);

        }, //DONE & DOCUMENTATION

        getData: function(a, e) {
            switch(a) {
                case "undefined":
                    return e;
                case "text":
                    return e.text || e.textContent || e.innerText;
                case "textContent":
                    return e.textContent || e.text || e.innerText;
                case "value":
                    return e.value;
                case "html":
                    return e.innerHTML;
                case "outer":
                    return e.outerHTML;
                case "src":
                    return e.src;
                case "attr":
                    return e.attributes;
                case "href":
                    return e.href;
                case "eventTarget":
                    return e.target.id;
                default:
                    throw "Invalid argument [" + a + "] on getData !";
            }
        }, //DONE & DOCUMENTATION

        screen: function() {
            return {width: window.innerWidth, height: window.innerHeight};
        }, //DONE & DOCUMENTATION

        computedCss: function(element) {
          try {
            return _getStyles(element);
          } catch (err) {
              console.error("[Exception]: styles() => " + err);
          }
        }, //TODO

        /***
         * Visual Handlers
         * */

        anime: function(transition) {
            try {
                let _sel = this.sel;
                (_sel && typeof _sel === "object" || Array.isArray(_sel)) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].style.transition = transition;
                    }) : (_sel) ?
                    (function(){
                        _sel.style.transition = transition;
                    })() : jsHunter.fn.exception("anime() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        }, //DONE & DOCUMENTATION

        display: function(value) {
            try {
                let _sel = this.sel;
                (_sel && typeof _sel === "object" || Array.isArray(_sel)) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].style.display = value;
                    }) : (_sel) ?
                    _sel.style.display = value : jsHunter.fn.exception("display() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        }, //DONE

        fadeIn: function(p) {
            clearInterval(fadeCtrl); //Bug Fix
            let _opacity  = 0; //0....100
            let _element  = this.sel; //Copy current target tag (Conflict Fix)
            let _keys     = Object.keys(_element);
            let _selector = this.selector; //Save current selector (fadeOut())
            let _timer_fade = (p.hasOwnProperty("timer_fade")) ? p.timer_fade : 1;
            let _timeout = (p.hasOwnProperty("timeout")) ? p.timeout : 0;

            _keys.forEach(function(index){

                //CSS Reset Element
                _element[index].style.display = "block";

                //Cross Browser CSS > IE
                if( userAgent.indexOf( 'msie' ) !== -1 ) {
                    _element[index].style.filter  = "alpha(opacity=0)";
                } else { _element[index].style.opacity = "0"; }

            });

            fadeCtrl = setInterval(function(){

                _keys.forEach(function(index){

                    if((_opacity >= 100)) {
                        clearInterval(fadeCtrl);

                        // Automatic Close
                        if(parseInt(_timeout) > 0) {

                            setTimeout(function(){
                                jsHunter(_selector).fadeOut(p);
                            }, parseInt(_timeout));

                        }

                    } else {
                        _opacity += 2;

                        //Cross Browser CSS > IE
                        if( userAgent.indexOf( 'msie' ) !== -1 ) {
                            _element[index].style.filter  = "alpha(opacity=" + _opacity + ")";
                        } else { _element[index].style.opacity = (_opacity / 100).toString(); }
                    }
                });

            }, _timer_fade);

            return this;
        }, //DONE

        fadeOut: function(p) {
            clearInterval(fadeCtrl); //Bug Fix
            let _opacity  = 100; //100....0
            let _element  = this.sel; //copy current target tag (noConflict)
            let _keys     = Object.keys(_element);
            /*let _selector = this.selector;*/
            let _timer_fade = (p.hasOwnProperty("timer_fade")) ? p.timer_fade : 1;

            fadeCtrl = setInterval(function(){

                _keys.forEach(function(index){

                    if((_opacity <= 0)) {
                        clearInterval(fadeCtrl);
                        _element[index].style.display = "none";

                        if(p.remove) {
                            $$.remove(p.parent, p.children);
                        }

                    } else {
                        _opacity -= 2;

                        //Cross Browser CSS > IE
                        if( userAgent.indexOf( 'msie' ) !== -1 ) {
                            _element[index].style.filter = "alpha(opacity=" + _opacity + ")";
                        } else { _element[index].style.opacity = (_opacity / 100).toString(); }
                    }
                });

            }, _timer_fade);

            return this;
        }, //DONE

        height: function(value) {
            try {
                let _sel = this.sel;
                (_sel && typeof _sel === "object" || Array.isArray(_sel)) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].style.height = value;
                    }) : (_sel) ?
                    _sel.style.height = value : jsHunter.fn.exception("height() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        }, //TODO PROGRAMAR FUNÇÃO PARA RETORNAR ALTURA DO ELEMENTO

        hidden: function(element) {

            let _el_ = document.querySelectorAll(element);
            let keys = Object.keys(_el_);

            keys.forEach(function(index) {
                _el_[index].style.display = 'none';
            });

        }, //DONE

        margin: function(orientation, value) {
            try {
                let _sel = this.sel;
                (_sel && typeof _sel === "object" || Array.isArray(_sel)) ?
                    _sel.forEach(function(a, index, el) {
                        switch (orientation){
                            case 'left':
                                _sel[index].style.marginLeft = value;
                                break;
                            case 'right':
                                _sel[index].style.marginRight = value;
                                break;
                            case 'top':
                                _sel[index].style.marginTop = value;
                                break;
                            case 'bottom':
                                _sel[index].style.marginBottom = value;
                                break;
                        }
                    }) : (_sel) ?
                    (function() {
                        switch (orientation){
                            case 'left':
                                _sel.style.marginLeft = value;
                                break;
                            case 'right':
                                _sel.style.marginRight = value;
                                break;
                            case 'top':
                                _sel.style.marginTop = value;
                                break;
                            case 'bottom':
                                _sel.style.marginBottom = value;
                                break;
                        }
                    })() : jsHunter.fn.exception("margin() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        }, //TODO

        width: function(value) {
            try {
                let _sel = this.sel;
                (_sel && typeof _sel === "object" || Array.isArray(_sel)) ?
                    _sel.forEach(function(a, index, el) {
                        _sel[index].style.width = value;
                    }) : (_sel) ?
                    _sel.style.width = value : jsHunter.fn.exception("width() error " + _sel);
            } catch(err) {
                console.error(err);
            }
            return this;
        }, //TODO PROGRAMAR FUNÇÃO PARA RETORNAR LARGURA DO ELEMENTO

        sizer: function(element, orientation, value, type) {
            try {
                _changeElementSize(element, orientation, value, type);
            } catch(err) {
                console.error("[Exception] sizer() => " + err);
            }
            return this;
        }, //TODO

        opacity: function(element, opacity) {
            try {
                _opacityElement(element, opacity);
            } catch(err) {
                console.error("[Exception] opacity() => " + err);
            }
            return this;
        }, //TODO

        centralize: function(element_id, element_width, element_height) {
            try {
                _middlePositionConfigure(element_id, element_width, element_height);
            } catch(err) {
                console.error("[Exception] centralize() => " + err);
            }
            return this;
        }, //TODO

        /***
         * Advanced Components
         * */

        tooltip: function() {
        }, //TODO

        progressBar: function() {
        }, //TODO

        slider: function() {
        }, //TODO

        dialog: function() {
        }, //TODO

        /***
         * Utils And Others
         * */

        select: function() {
            try {
                let _sel = this.sel;

                if (_sel && _sel.length === 1 && (typeof _sel === "object" || Array.isArray(_sel))) {
                    return this.sel[0];
                } else if(_sel.length > 1) {
                    return this.sel;
                } else {
                    console.error("[Exception] select() error, wrong or missing element [sel]");
                }
            } catch (err) {
                console.error("[Exception] select() error, wrong or missing element [sel]");
            }
            return this;
        }, //TODO

        hunter: function(wanted, nodeType) {
            try {
                let hunt = document.querySelectorAll(wanted);
                let keys = Object.keys(hunt);
                nodes    = [];
                node     = "";
                (keys.length > 0) ?
                    (function () {
                        keys.forEach(function(index) {
                            if(nodeType && nodeType === "parent") {
                                nodes.push(hunt[index].parentElement)
                            } else if(nodeType && nodeType === "children") {
                                nodes.push(hunt[index]);
                            } else if(nodeType && nodeType === "self") {
                                nodes.push(hunt[index]);
                            }
                        })
                        jsHunter.fn.nodes = nodes;
                    })() :
                    (hunt) ?
                        (function (){
                            if(nodeType && nodeType === "parent") {
                                node = hunt.parentElement;
                            } else if(nodeType && nodeType === "children"){
                                node = hunt
                            } else if(nodeType && nodeType === "self"){
                                node = hunt
                            }
                            jsHunter.fn.node = node;
                        })() :
                        jsHunter.fn.exception("hunter() error, not found: " + wanted);
            } catch(err) {
                console.error(err);
            }
            return this;
        }, //DONE

        nodeParent: function(parentItem) { console.log("NODEPARENT", parentItem + " " + this.selector);
            try {
                jsHunter.fn.hunter(parentItem + " " + this.selector, "parent");
                (nodes.length <= 0) ? 
                    jsHunter.fn.exception("nodeParent() error, not found [" + parentItem + " " + this.selector + "] !") : null;
            } catch(err) {
                console.error(err);
            }
            return this;
        }, //DONE

        nodeChild: function(childItem) {
            try {
                jsHunter.fn.hunter(this.selector + " " + childItem);
                (nodes.length <= 0) ? 
                jsHunter.fn.exception("nodeChild() error, not found [" + this.selector + " " + childItem + "] !") : null;
            } catch(err) {
                console.error(err);
            }
            return this;
        }, //DONE

        matchId: function(element, id_value) {
            return (
                element.id.search(id_value) >= 0 ||
                element.id.search(" " + id_value) >= 0 ||
                element.id.search(id_value + " ") >= 0
            );
        }, //DONE

        matchClass: function(element, classname) {
            return (
                element.className.search(classname) >= 0 ||
                element.className.search(" " + classname) >= 0 ||
                element.className.search(classname + " ") >= 0
            );
        }, //DONE

        findId: function(element, id) {
        }, //TODO

        findClass: function(element, classname) {
        }, //TODO

        joinSplit: function(args) {
        }, //TODO

        intNumber: function(data) {
            if(isNaN(data)) {
                return parseInt((data).replace(/[^0-9]/gi, ""));
            }
            return parseInt(data);
        }, //DONE

        trim: function(data) {
            return data.replace(/^( +)([0-9a-zA-Z ,'"\\\/_\[\-\].!@#$%&*()]+)( +)$/gi, '$2').replace(/ +$/, '');
        }, //TODO

        hexToRgb: function(color_hex) {

            let i = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color_hex);

            if(!i) {
                console.log("Your hexadecimal color expression is wrong !");
                return null;
            }

            return {
                r: parseInt(i[1], 16),
                g: parseInt(i[2], 16),
                b: parseInt(i[3], 16),
                rgb: parseInt(i[1], 16) +','+ parseInt(i[2], 16) +','+ parseInt(i[3], 16)
            }
        }, //DONE
    };

    window.jH = window.jsHunter = jsHunter;
    window.$$ = jsHunter();

})();

//No Conflict Resolved
const _jsHunter = window.jsHunter, _jH = window.jH;

jsHunter.noConflict = function( digger ) {
    if(window.jH === jsHunter) {
        window.jH = _jH;
    }
    if(digger && window.jsHunter === jsHunter) {
        window.jsHunter = _jsHunter;
    }
    return jsHunter;
};

jsHunter.noConflict();

if ( typeof noGlobal === typeof undefined ) {
    window.jsHunter = window.jH = jsHunter;
}

window.$J = jsHunter.fn;
