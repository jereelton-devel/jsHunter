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

//TODO: VERIFICAR PROBLEMAS RELATADOS PELA IDE

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
                this.sel = document.querySelectorAll(_selector);
                if(!this.sel) {
                    throw err = "Invalid selector ("+_selector+"), use id, class or label";
                }
            } else {
                this.sel = this.selector = _selector = undefined;
                //console.log("const jsHunter-1", _selector, this.sel, this.selector);
            }
        } catch(err) {
            console.error(err);
        } finally {
            try {
                if(_selector && !this.sel) {
                    throw err = "jsHunter is not done, check your selector calling !";
                } else {
                    this.selector = _selector;
                    this.args     = _args;
                    //console.log("const jsHunter-2", _selector, this.sel, this.selector, this.args);
                }
            } catch(e) {
                console.error(e);
                return;
            }
        }
    }

    let
        userAgent = navigator.userAgent.toLowerCase(),
        nodes     = [],
        node      = "",
        fadeCtrl  = null, //FadeIn FadeOut Effects Controls
        modalCtrl = null, //Modal Controls
        loopCtrl  = 0,
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

    function _changeElementSize(element, orient, size, measure) {

        switch (orient) {
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
                    _sel.forEach(function (a, index, el) {
                        _sel[index].attributes.src.value = value;
                    })
                    break;
                case "disabled":
                    _sel.forEach(function (a, index, el) {
                        _sel[index].disabled = value;
                    })
                    break;
                case "href":
                    _sel.forEach(function (a, index, el) {
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

    /***
     * Private Modal Functions
     * */

    function _modalInit(params) {

        switch (params.effect) {

            case 'accordion':
                _modalAccordion(params);
                break;

            case 'normal':
                _modalNormal(params);
                break;

            case 'fade':
                _modalFade(params);
                break;

            case 'elastic':
                _modalElastic(params);
                break;

            default:
                console.log('Error on _modalInit(), invalid parameters !');
        }
    }

    function _modalAccordion(params) {

        switch (params.action) {

            case "open":

                jsHunter(params.selector).margin('left', params.margin_left, 'px');
                jsHunter(params.selector).height(params.css_height);

                setTimeout(function(){

                    jsHunter(params.selector).margin('left', params.css_margin_left, 'px');

                    setTimeout(function(){
                        jsHunter(params.selector).height(params.effect_height);
                    }, 800);

                    //Button Event for modal close
                    jsHunter("[data-close-modalX]").on('click', function(){
                        params.action = 'close';
                        _modalAccordion(params);
                    });

                    //Event target when lock screen is clicked
                    jsHunter(params.lock_screen, {rsp: "eventTarget"}).on('click', function(rsp){
                        if(rsp === params.lock_screen.replace("#", '').replace(".", "")) {
                            params.action = 'close';
                            _modalAccordion(params);
                        }
                    });

                    //Automatic close when configured
                    if(params.timeout > 0) {
                        params.action = 'close';

                        setTimeout(function(){
                            _modalAccordion(params);
                        }, params.timeout);
                    }

                }, 200);

                break;

            case "close":

                jsHunter(params.selector).height(params.css_height);

                setTimeout(function() {

                    jsHunter(params.selector).margin('left', params.margin_left, 'px');

                    //Time to close lock screen
                    setTimeout(function(){
                        _modalUnLockScreen(params);
                    }, 500);

                }, 800);

                break;
        }
    }

    function _modalNormal(params) {

        let _more_width_ = (params.styles.width / params.speed);
        let _end_width_ = params.styles.width;
        let _opacity_ = ((params.opacity + params.opacdiv) / 100);

        modalCtrl = setInterval(function() {

            params.more_width += _more_width_;

            if(params.more_width >= _end_width_) {

                clearInterval(modalCtrl);
                params.more_width = _end_width_;
                _modalFinish(params);

            } else {

                params.opacity += _opacity_;

                _changeElementSize(params.element,'width', params.more_width,'px');

                if(jsHunter.fn.intNumber(params.element.style.height) <= params.styles.height) {
                    _changeElementSize(params.element, 'height', params.more_width, 'px');
                }

                _opacityElement(params.element, params.opacity)

                _middlePositionConfigure(params.element, params.more_width, params.more_width);
            }

        }, 1);
    }

    function _modalFade(params) {

        let _opacity_ = 0.1;

        _changeElementSize(params.element, 'width', params.styles.width, 'px');
        _changeElementSize(params.element, 'height', params.styles.height, 'px');

        if(params.wide === true) {
            _changeElementSize(params.element, 'width', params.wide_width, 'px');
            _changeElementSize(params.element, 'height', params.max_height, 'px');
        }

        _middlePositionConfigure(params.element, params.element.style.width, params.element.style.height);

        modalCtrl = setInterval(function() {

            if(parseInt(params.opacity) >= 1) {

                clearInterval(modalCtrl);
                _opacityElement(params.element, '1');

                //Event target when lock screen is clicked
                jsHunter(params.lock_screen, {rsp: "eventTarget"}).on('click', function(rsp){
                    if(rsp === params.lock_screen.replace("#", '').replace(".", "")) {
                        _modalClose(params);
                    }
                });

                //Button Event for modal close
                jsHunter("[data-close-modalX]").on('click', function(){
                    _modalClose(params);
                });

                //Automatic Modal Close
                if(parseInt(params.timeout) > 0) {
                    _modalAutoClose(params);
                }

            } else {
                params.opacity += _opacity_;

                _opacityElement(params.element, params.opacity);
            }

        }, 30);
    }

    function _modalElastic(params) {

        loopCtrl = 0; //Reset control

        let _more_width_ = 50;
        let _end_width_ = params.styles.width + 100;
        let _opacity_ = (params.opacity + params.opacdiv) / 100;

        modalCtrl = setInterval(function() {

            params.more_width += _more_width_;

            if(params.more_width >= _end_width_) {

                clearInterval(modalCtrl);
                //_changeElementSize(params.element, 'width', _end_width_, 'px');
                _modalDecrease(params);

            } else {

                params.opacity += _opacity_;

                _opacityElement(params.element, params.opacity);
                _changeElementSize(params.element, 'width', params.more_width, 'px');

                if(jsHunter.fn.intNumber(params.element.style.height) <= params.styles.height) {
                    _changeElementSize(params.element, 'height', params.more_width, 'px');
                }

                _middlePositionConfigure(params.element, params.more_width, params.styles.height);

            }

        }, params.speed);
    }

    function _modalDecrease(params) {

        let _end_width_ = params.styles.width - 100;

        modalCtrl = setInterval(function(){

            if(params.more_width <= _end_width_) {

                clearInterval(modalCtrl);
                //_changeElementSize(params.element, 'width', params.styles.width, 'px');
                _modalIncrease(params);

            } else {

                params.more_width -= 10;

                _changeElementSize(params.element, 'width', params.more_width, 'px');

                if(jsHunter.fn.intNumber(params.element.style.height) <= params.styles.height) {
                    _changeElementSize(params.element, 'height', params.styles.height, 'px');
                }

                _middlePositionConfigure(params.element, params.more_width, params.styles.height);

            }

        }, params.speed);

    }

    function _modalIncrease(params) {

        let _end_width_ = params.styles.width + 100;

        modalCtrl = setInterval(function(){

            if(params.more_width >= _end_width_) {

                clearInterval(modalCtrl);
                _changeElementSize(params.element, 'width', _end_width_, 'px');
                _modalFinish(params);

            } else {

                params.more_width += 10;
                _changeElementSize(params.element, 'width', params.more_width, 'px');

                if(jsHunter.fn.intNumber(params.element.style.height) <= params.styles.height) {
                    _changeElementSize(params.element, 'height', params.styles.height, 'px');
                }

                _middlePositionConfigure(params.element, params.more_width, params.styles.height);

            }

        }, params.speed);
    }

    function _modalFinish(params) {

        if(params.effect === 'elastic') {

            loopCtrl++;

            if(loopCtrl < params.loop) {
                _modalDecrease(params);
            } else {

                //Event target when lock screen is clicked
                jsHunter(params.lock_screen, {rsp: "eventTarget"}).on('click', function(rsp){
                    if(rsp === params.lock_screen.replace("#", '').replace(".", "")) {
                        _modalClose(params);
                    }
                });

                //Button Event for modal close
                jsHunter("[data-close-modalX]").on('click', function(){
                    _modalClose(params);
                });

                //Automatic Modal Close
                if(params.timeout > 0) {
                    _modalAutoClose(params);
                }
            }

        } else {

            modalCtrl = setInterval(function(){

                if(params.more_width <= params.styles.width) {

                    clearInterval(modalCtrl);

                    //When wide is configured
                    if(params.wide && params.styles.width) {
                        _modalDoWide(params);
                    }

                    //Button Event for modal close
                    jsHunter("[data-close-modalX]").on('click', function(){
                        _modalClose(params);
                    });

                    //Event target when lock screen is clicked
                    jsHunter(params.lock_screen, {rsp: "eventTarget"}).on('click', function(rsp){
                        if(rsp === params.lock_screen.replace("#", '').replace(".", "")) {
                            _modalClose(params);
                        }
                    });

                    //Automatic Modal Close
                    if(parseInt(params.timeout) > 0) {
                        _modalAutoClose(params);
                    }

                } else {
                    params.more_width -= 5;

                    _changeElementSize(params.element, 'width', params.more_width, 'px');
                    _middlePositionConfigure(params.element, params.more_width, params.more_width);
                }

            }, 1);
        }
    }

    function _modalAutoClose(params) {
        setTimeout(function(){
            _modalClose(params);
        }, parseInt(params.timeout));
    }

    function _modalDoWide(params) {

        let _wf_ = parseInt(params.more_width);

        modalCtrl = setInterval(function(){

            if(_wf_ >= parseInt(params.wide_width)) {
                clearInterval(modalCtrl);
            } else {
                _wf_ += 15;

                _changeElementSize(params.element, 'width', _wf_, 'px');
                _middlePositionConfigure(params.element, _wf_, params.more_width);
            }

        }, 1);
    }

    function _modalClose(params) {

        clearInterval(modalCtrl);

        let _width_down_ = 0;
        let _opacity_ = 100;
        let _opacdiv_ = 15;
        let _element_ = params.element;
        let _styles_ = _getStyles(_element_);

        params.width = _styles_.width;
        params.height = _styles_.height;
        params.element = _element_;
        params.width_down = _width_down_;
        params.save_width = _styles_.save_width;
        params.opacity = _opacity_;
        params.opacdiv = _opacdiv_;

        if(params.effect === 'fade') {
            _modalCloseFade(params);
        } else if(params.effect === 'normal') {
            _modalCloseWide(params);
        } else {
            _modalCloseDefault(params);
        }
    }

    function _modalCloseWide(params) {

        modalCtrl = setInterval(function() {

            params.width -= 15;

            if(params.width <= params.height) {
                clearInterval(modalCtrl);
                _modalCloseDefault(params);
            } else {
                _changeElementSize(params.element, 'width', params.width, 'px');
                _middlePositionConfigure(params.element, params.width, params.height);
            }

        }, 1);
    }

    function _modalCloseDefault(params) {

        modalCtrl = setInterval(function() {

            params.width -= 15;

            if(params.width <= params.width_down) {

                clearInterval(modalCtrl);
                // CSS Reset to Element Original Size
                _changeElementSize(params.element, 'width', params.save_width, 'px');
                _changeElementSize(params.element, 'height', params.save_width, 'px');
                jsHunter(params.selector).display('none');
                _modalUnLockScreen(params);

            } else {

                params.opacity -= 2;
                _changeElementSize(params.element, 'width', params.width, 'px');
                _changeElementSize(params.element, 'height', params.width, 'px');
                _opacityElement(params.element, (params.opacity / 100).toString());
                _middlePositionConfigure(params.element, params.width, params.width);

            }

        }, 1);
    }

    function _modalCloseFade(params) {

        let _opacity_ = 1;

        modalCtrl = setInterval(function() {

            if(_opacity_ <= 0) {

                clearInterval(modalCtrl);
                _modalUnLockScreen(params);

            } else {
                _opacity_ -= 0.1;
                _opacityElement(params.element, _opacity_)
            }

        }, 30);
    }

    function _modalLockScreen(_name_, _back_color_, _opacity_) {

        _createHtmlElement({
            element: "div",
            attr_type: "id",
            attr_name: _name_,
            append: "body",
            styles: {
                back_color: _back_color_,
                width: "100%",
                height: "100%",
                position: "fixed",
                z_index: "1000",
                top: "0px",
                left: "0px",
                opacity: _opacity_,
                display: "block"
            }
        });
    }

    function _modalUnLockScreen(params) {
        jsHunter.fn.hidden(params.selector);
        jsHunter.fn.remove(params.lock_screen, params.selector);
        jsHunter.fn.remove("body", params.lock_screen);
    }

    function _modalBody(target, _title_, _body_) {
        let body = "PGgxIHN0eWxlPSJib3JkZXItYm90dG9tOiBzb2xpZCAjODg4ODg4IDFweDtwYWRkaW5nOiAxMHB4ICFpbXBvcnRhbnQ7Y29sb3I6ICMyNWMzZTg7YmFja2dyb3VuZDogIzJiMzc3ODsiPg0KCTxzcGFuIGlkPSJtb2RhbF90aXRsZSI+TW9kYWwgVGl0bGU8L3NwYW4+DQoJPHNwYW4gc3R5bGU9ImRpc3BsYXk6IGJsb2NrO2Zsb2F0OiByaWdodDttYXJnaW46IDNweDtmb250LXNpemU6IDE1cHg7Y29sb3I6ICM1NTU1NTU7Ij4NCiAgCQk8YSBkYXRhLWNsb3NlLW1vZGFseD0iIiBzdHlsZT0iY29sb3I6ICM4ODg4ODg7dGV4dC1kZWNvcmF0aW9uOiBub25lO2ZvbnQtc2l6ZTogMjVweDtwb3NpdGlvbjogcmVsYXRpdmU7d2lkdGg6IDMwcHg7aGVpZ2h0OiAzMHB4O3RleHQtYWxpZ246IGNlbnRlcjtib3JkZXItcmFkaXVzOiA1cHg7Y3Vyc29yOiBkZWZhdWx0O3BhZGRpbmc6IDZweDsiPlg8L2E+DQoJPC9zcGFuPg0KPC9oMT4NCjxkaXYgaWQ9Im1vZGFsX2NvbnRlbnQiIHN0eWxlPSJ3aWR0aDogOTglO2hlaWdodDogYXV0bzttYXJnaW46IDElO3Bvc2l0aW9uOiByZWxhdGl2ZTtib3JkZXI6IGRhc2hlZCAjQkRCREJEIDFweDtiYWNrZ3JvdW5kOiAjRThFNkU2OyI+DQoJPHAgc3R5bGU9ImNvbG9yOiAjYWVhNmE2O3BhZGRpbmc6IDEwcHg7Ij5Nb2RhbCBDb250ZW50PC9wPg0KPC9kaXY+";

        jsHunter(target).html(atob(body));

        if(_title_ !== '') {
            jsHunter("#modal_title").html(_title_);
        }

        if(_body_ !== '') {
            jsHunter("#modal_content").html(_body_);
        }

    }

    /***
     * Code Format and Filters
     * */

    function _codeFormat(c, l) {
        if(l === 'html') {
            return _codeFormat_HTML(c);
        } else if(l === 'css') {
            return _codeFormat_CSS(c);
        } else if(l === 'javascript') {
            return _codeFormat_JAVASCRIPT(c);
        } else if(l === 'php') {
            return _codeFormat_PHP(c);
        } else if(l === 'sql') {
            return _codeFormat_SQL(c);
        }
    }

    function _codeFormat_HTML(c) {

        let code = (c)
            //Links
            .replace(/(http[s]?:\/\/[0-9a-zA-Z/ _.-]+)/, '<span class="links">$1</span>')
            .replace(/(http[s]?):/, '$1+')
            //Comments
            .replace(/([^:]+\/\/[0-9a-zA-Z ,-_:+]+)/, '<span class="comment">$1</span>')
            .replace(/(\/\*[0-9a-zA-Z ,-_:+]+\*\/)/, '<span class="comment-blue">$1</span>')
            //Functions
            .replace(/\.([a-zA-Z]+)\(/gi, '.<span class="function-name">$1</span>(')
            .replace(/([a-zA-Z0-9_]+)\(/gi, '<span class="function-name">$1</span>(')
            //Arguments and parameters
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\)/gi, '(<span class="params">$1</span>)')
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\,/gi, '(<span class="params">$1</span>,')
            .replace(/\(('[0-9a-zA-Z ,-_.#\[\]%+:]+')\,/gi, '(<span class="params">$1</span>,')
            .replace(/\(([0-9a-zA-Z ,-_.#\[\]%+:]+)\)/gi, '(<span class="params">$1</span>)')
            //Properties
            .replace(/([a-zA-Z_\-]+):/, '<span class="property">$1</span>:')
            //Value to object properties
            .replace(/:\s+([0-9]+),?/, ': <span class="value">$1</span>,')
            .replace(/:\s+([a-zA-Z_\-]+),/, ': <span class="value">$1</span>,')
            .replace(/:\s+'([0-9a-zA-Z_\- .#%$]+)'/, ': <span class="value">\'$1\'</span>')
            .replace(/:\s+"([0-9a-zA-Z_\- .#%$]+)"/, ': <span class="value">"$1"</span>')
            //Adjusts
            .replace(/(http[s]?)\+/, '$1:') + "\n";

        return code;
    }

    function _codeFormat_CSS(c) {

        let code = (c)
            //Links
            .replace(/(http[s]?:\/\/[0-9a-zA-Z/ _.-]+)/, '<span class="links">$1</span>')
            .replace(/(http[s]?):/, '$1+')
            //Comments
            .replace(/([^:]+\/\/[0-9a-zA-Z ,-_:+]+)/, '<span class="comment">$1</span>')
            .replace(/(\/\*[0-9a-zA-Z ,-_:+]+\*\/)/, '<span class="comment-blue">$1</span>')
            //Aliases
            .replace(/\$/gi, '<span class="alias">$</span>')
            .replace(/\$J/gi, '<span class="alias">$J</span>')
            .replace(/jX/, '<span class="alias">jX</span>')
            .replace(/jQuery/gi, '<span class="alias">jQuery</span>')
            //Functions
            .replace(/\.([a-zA-Z]+)\(/gi, '.<span class="function-name">$1</span>(')
            .replace(/([a-zA-Z0-9_]+)\(/gi, '<span class="function-name">$1</span>(')
            //Arguments and parameters
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\)/gi, '(<span class="params">$1</span>)')
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\,/gi, '(<span class="params">$1</span>,')
            .replace(/\(('[0-9a-zA-Z ,-_.#\[\]%+:]+')\,/gi, '(<span class="params">$1</span>,')
            .replace(/\(([0-9a-zA-Z ,-_.#\[\]%+:]+)\)/gi, '(<span class="params">$1</span>)')
            //Properties
            .replace(/([a-zA-Z_\-]+):/, '<span class="property">$1</span>:')
            //Value to object properties
            .replace(/:\s+([0-9]+),?/, ': <span class="value">$1</span>,')
            .replace(/:\s+([a-zA-Z_\-]+),/, ': <span class="value">$1</span>,')
            .replace(/:\s+'([0-9a-zA-Z_\- .#%$]+)'/, ': <span class="value">\'$1\'</span>')
            .replace(/:\s+"([0-9a-zA-Z_\- .#%$]+)"/, ': <span class="value">"$1"</span>')
            //Adjusts
            .replace(/(http[s]?)\+/, '$1:') + "\n";

        return code;
    }

    function _codeFormat_JAVASCRIPT(c) {

        /*let code = (c)
            //Links
            .replace(/(http[s]?:)(\/\/)([0-9a-zA-Z/ _.?#=-]+)/gi, '<span class="links">$1/+-+/$3</span>')
            .replace(/(http[s]?):/gi, '$1++')
            .replace(/\.([0-9a-zA-Z/ _.?#=-]+)/gi, '+++$1')
            //Function declare
            .replace(/"([0-9a-zA-Z]+)?(\s)?(function)(\s)?([0-9a-zA-Z_+\-:;.,()@#$%!&"]+)?/gi, '"$1$2F_U_N_C_T_I_O_N$4$5')
            .replace(/(function)/gi, '<span class="function">$1</span>')
            .replace(/"(.*)([0-9a-zA-Z_]+)(\(\))(.*)"/gi, '"$1$2>::-::<$4"')
            //Class declare
            .replace(/(class )([0-9a-zA-Z_]+)\s?{/gi, '<span class="class">$1</span>$2 {')
            //Constructor declare
            .replace(/(constructor|console)/gi, '<span class="constructor">$1</span>')
            //Variable declare
            .replace(/(var|let|const |this)/gi, '<span class="function">$1</span>')
            //Return
            .replace(/(return)/gi, '<span class="return">$1</span>')
            //DOM elements
            .replace(/(document|ready|getElementById|querySelector|querySelectorAll|getElementsByName|getElementsByClass)/gi, '<span class="object">$1</span>')
            //Boolean
            .replace(/,\s?(true|false)\s?\)/gi, ',<span class="boolean"> $1</span>)')
            .replace(/:\s?(true|false)\s?\}/gi, ': <span class="boolean"> $1</span>}')
            //Comments
            .replace(/(\/\/[0-9a-zA-Z ,-_:+]+)/, '<span class="comment">$1</span>')
            .replace(/(\/\*[0-9a-zA-Z ,-_:+]+\*\/)/, '<span class="comment-blue">$1</span>')
            //Aliases
            .replace(/(\$|\$J|jX|jQuery)/gi, '<span class="alias">$1</span>')
            //Functions Name
            .replace(/\.([a-zA-Z]+)\(/gi, '.<span class="function-name">[__fn__]$1[__fn__]</span>(')
            .replace(/([a-zA-Z0-9_]+)\(/gi, '<span class="function-name">[__fn__]$1[__fn__]</span>(')*/
            //Object Attributes
            //.replace(/(\)\.|\.)([a-zA-Z]+)(\s?)(=?)(\s?)([";]?)/gi, '$1<span class="object-attribute">$2</span>$3$4$5$6')
            //.replace(/(\.)([a-zA-Z]+)([.;]+)/gi, '$1<span class="object-attribute">$2</span>$3')
            //.replace(/(\.)([a-zA-Z_]+)/gmi, '$1<span class="object-attribute">$2</span>')

            /*//Arguments and parameters
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")([),])?/gi, '(<span class="params">$1</span>$2')
            .replace(/\(('[0-9a-zA-Z ,-_.#\[\]%+:]+')([),])?/gi, '(<span class="params">$1</span>$2')
            .replace(/\(([0-9a-zA-Z ,-_.#\[\]%+:]+)\)/gi, '(<span class="params">$1</span>)')
            //Properties
            .replace(/([^"0-9a-zA-Z_:]+ )+([0-9a-zA-Z_]+)\s?:\s?/gi, '<span class="property">$1$2</span>: ')
            .replace(/{([0-9a-zA-Z_]+):\s?/gi, '{<span class="property">$1</span>: ')
            //Values
            .replace(/:\s+([0-9]+),?/gi, ': <span class="value">$1</span>,')
            .replace(/:\s+([a-zA-Z_\-]+),/gi, ': <span class="value">$1</span>,')
            .replace(/:\s+'([0-9a-zA-Z_\- .#%$]+)'/gi, ': <span class="value">\'$1\'</span>')
            .replace(/:\s+"([0-9a-zA-Z_\- .#%$]+)"/gi, ': <span class="value">"$1"</span>')*/

            //Final Adjusts
            /*.replace(/(http[s]?)[+]{2}/gi, '$1:')
            .replace(/(\/\+-\+\/)/gi, '//')
            .replace(/([+]{3})/gi, '.')
            .replace(/(>::-::<)/gi, '()')
            .replace(/(F_U_N_C_T_I_O_N)/gi, 'function') + "\n";*/

        let cl = {/*Code Label*/

            A1: {i:'[__A1__]', f:'[__/A1__]'}, //aliases

            B1: {i:'[__B1__]', f:'[__/B1__]'}, //boolean

            C1: {i:'[__C1__]', f: '[__/C1__]'}, //class
            C2: {i:'[__C2__]', f: '[__/C2__]'}, //constructor
            C3: {i:'[__C3__]', f: '[__/C3__]'}, //class-name

            C4: {i:'[__C4__]', f: '[__/C4__]'}, //comments-in-block
            C5: {i:'[__C5__]', f: '[__/C5__]'}, //comments-inline

            D1: {i:'[__D1__]', f: '[__/D1__]'}, //dom-elements

            F1: {i:'[__F1__]', f: '[__/F1__]'}, //function
            F2: {i:'[__F2__]', f: '[__/F2__]'}, //function-name
            F3: {i:'[__F3__]', f: '[__/F3__]'}, //function in text
            F4: {i:'[__F4__]', f: '[__/F4__]'}, //function-name in text

            L1: {i:'[__L1__]', f: '[__/L1__]'}, //links

            O1: {i:'[__O1__]', f: '[__/O1__]'}, //object-attributes

            P1: {i:'[__P1__]', f: '[__/P1__]'}, //params and args

            R1: {i:'[__R1__]', f: '[__/R1__]'}, //return

            S1: {i:'[__S1__]', f: '[__/S1__]'}, //strings

            V1: {i:'[__V1__]', f: '[__/V1__]'}, //variables and this

        };

        return (c)
            //Strings
            .replace(/\((["]|['])([0-9a-zA-Z \]\[!@#$%*()_+:.,-]+)(["]|['])([)]|[,])/gi, '($1'+cl.S1.i+'$2'+cl.S1.f+'$3$4')
            //Links
            .replace(/(http[s]?:)(\/\/)([0-9a-zA-Z/ _.?#=-]+)/gi, cl.L1.i+'$1[__/:/__]$3'+cl.L1.f)
            //Function in text
            .replace(/"([0-9a-zA-Z]+)?(\s)?(function)(\s)?([0-9a-zA-Z_+\-:;.,()@#$%!&"]+)?/gi, '"$1$2'+cl.F3.i+cl.F3.f+'$4$5')
            //Function declare
            .replace(/(function)/gi, cl.F1.i+'$1'+cl.F1.f)
            //Function name in text
            .replace(/"(.*)([0-9a-zA-Z_]+)(\(\))(.*)"/gi, '"$1$2'+cl.F4.i+cl.F4.f+'$4"')
            //Class declare
            .replace(/(class)\s([0-9a-zA-Z_]+)\s?{/gi, cl.C1.i+'$1'+cl.C1.f+' '+cl.C3.i+'$2'+cl.C3.f+' {')
            //Constructor declare
            .replace(/(constructor)/gi, cl.C2.i+'$1'+cl.C2.f)
            //Variable declare
            .replace(/(var|let|const |this)/gi, cl.V1.i+'$1'+cl.V1.f)
            //Return
            .replace(/(return)/gi, cl.R1.i+'$1'+cl.R1.f)
            //DOM elements
            .replace(/(console|document|ready|getElementById|querySelector|querySelectorAll|getElementsByName|getElementsByClass)/gi, cl.D1.i+'$1'+cl.D1.f)
            //Boolean
            .replace(/,\s?(true|false)\s?\)/gi, ', '+cl.B1.i+'$1'+cl.B1.f+')')
            .replace(/:\s?(true|false)\s?}/gi, ': '+cl.B1.i+'$1'+cl.B1.f+'}')
            //Arguments and parameters
            .replace(/\(("[0-9a-zA-Z ,\-_.#\[\]%+:]+")([),])?/gi, '('+cl.P1.i+'$1'+cl.P1.f+'$2')
            .replace(/\(('[0-9a-zA-Z ,\-_.#\[\]%+:]+')([),])?/gi, '('+cl.P1.i+'$1'+cl.P1.f+'$2')
            .replace(/\s?([(]|[,])\s?([0-9a-zA-Z_]+)\s?(|[,]|[)])/gi, '$1'+cl.P1.i+'$2'+cl.P1.f+'$3')
            //Comments
            .replace(/\/\/([0-9a-zA-Z ,\-_:+]+)/, cl.C5.i+'$1'+cl.C5.f)
            .replace(/\/\*([0-9a-zA-Z ,\-_:+]+)\*\//, cl.C4.i+'$1'+cl.C4.f)
            //Aliases
            .replace(/(\${2}|\$|\$J|jX|jQuery)([.]|[(])/gi, cl.A1.i+'$1'+cl.A1.f+'$2')
            //Functions Name
            .replace(/(\.)?([0-9a-zA-Z_]+)(\()/gi, '$1'+cl.F2.i+'$2'+cl.F2.f+'$3')
            //Object Attributes
            .replace(/\.([0-9a-zA-Z_]+)(?!.*([(]|["]))/gi, '.'+cl.O1.i+'$1'+cl.O1.f)
            /*.replace(/(\)\.|\.)([a-zA-Z]+)(\s?)(=?)(\s?)([";]?)/gi, '$1'+cl.O1.i+'$2'+cl.O1.f+'$3$4$5$6')
            .replace(/(\.)([a-zA-Z]+)([.;]+)/gi, '$1'+cl.O1.i+'$2'+cl.O1.i+'$3')
            .replace(/(\.)([a-zA-Z_]+)/gi, '$1'+cl.O1.i+'$2'+cl.O1.i)*/

            /*

            \.([0-9a-zA-Z_]+)(?!.*([(]|["]|[']))

            f().init;
            f().init = "123";
            f("tests").init = "123";
            f.init;
            f.init.test.new;
            f.test = "";
            f.test = '';
            f.test="";
            f.test='';
            f.test=10;
            f.test = 10;
            init.test;
            jX("#iframe_test").attr("src", "https://www.google.com");
            jX("#iframe_test").test.attr("src", "https://www.google.com").test;
            */


            /*//Properties
            .replace(/([^"0-9a-zA-Z_:]+ )+([0-9a-zA-Z_]+)\s?:\s?/gi, '<span class="property">$1$2</span>: ')
            .replace(/{([0-9a-zA-Z_]+):\s?/gi, '{<span class="property">$1</span>: ')
            //Values
            .replace(/:\s+([0-9]+),?/gi, ': <span class="value">$1</span>,')
            .replace(/:\s+([a-zA-Z_\-]+),/gi, ': <span class="value">$1</span>,')
            .replace(/:\s+'([0-9a-zA-Z_\- .#%$]+)'/gi, ': <span class="value">\'$1\'</span>')
            .replace(/:\s+"([0-9a-zA-Z_\- .#%$]+)"/gi, ': <span class="value">"$1"</span>')

            //Final Adjusts
            .replace(/(http[s]?)[+]{2}/gi, '$1:')
            .replace(/(\/\+-\+\/)/gi, '//')
            .replace(/([+]{3})/gi, '.')
            .replace(/(>::-::<)/gi, '()')
            .replace(/(F_U_N_C_T_I_O_N)/gi, 'function')*/ + "\n";
    }

    function _codeFormat_PHP(c) {

        let code = (c)
            //Links
            .replace(/(http[s]?:\/\/[0-9a-zA-Z/ _.-]+)/, '<span class="links">$1</span>')
            .replace(/(http[s]?):/, '$1+')
            //Function declare
            .replace(/function/gi, '<span class="function">function</span>')
            //Boolean
            .replace(/,\s?(true|false)\s?\)/gi, ',<span class="boolean"> $1</span>)')
            //Comments
            .replace(/([^:]+\/\/[0-9a-zA-Z ,-_:+]+)/, '<span class="comment">$1</span>')
            .replace(/(\/\*[0-9a-zA-Z ,-_:+]+\*\/)/, '<span class="comment-blue">$1</span>')
            //Aliases
            /*.replace(/\$/gi, '<span class="alias">$</span>')
            .replace(/\$J/gi, '<span class="alias">$J</span>')
            .replace(/jX/, '<span class="alias">jX</span>')
            .replace(/jQuery/gi, '<span class="alias">jQuery</span>')*/
            //Functions
            .replace(/\.([a-zA-Z]+)\(/gi, '.<span class="function-name">$1</span>(')
            .replace(/([a-zA-Z0-9_]+)\(/gi, '<span class="function-name">$1</span>(')
            //Arguments and parameters
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\)/gi, '(<span class="params">$1</span>)')
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\,/gi, '(<span class="params">$1</span>,')
            .replace(/\(('[0-9a-zA-Z ,-_.#\[\]%+:]+')\,/gi, '(<span class="params">$1</span>,')
            .replace(/\(([0-9a-zA-Z ,-_.#\[\]%+:]+)\)/gi, '(<span class="params">$1</span>)')
            //Properties
            .replace(/([a-zA-Z_\-]+):/, '<span class="property">$1</span>:')
            //Value to object properties
            .replace(/:\s+([0-9]+),?/, ': <span class="value">$1</span>,')
            .replace(/:\s+([a-zA-Z_\-]+),/, ': <span class="value">$1</span>,')
            .replace(/:\s+'([0-9a-zA-Z_\- .#%$]+)'/, ': <span class="value">\'$1\'</span>')
            .replace(/:\s+"([0-9a-zA-Z_\- .#%$]+)"/, ': <span class="value">"$1"</span>')
            //Adjusts
            .replace(/(http[s]?)\+/, '$1:') + "\n";

        return code;
    }

    function _codeFormat_SQL(c) {

        let code = (c)
            //Clause Main
            .replace(/(FUNCTION|SELECT|FROM|INSERT|DELETE|WHERE|ON|GROUP BY)/gi, '<span class="function">$1</span>')
            //NULL Values
            .replace(/(NULL)/gi, '<span class="property">$1</span>')
            //Boolean
            .replace(/,\s?(TRUE|FALSE)\s?\)/gi, ',<span class="boolean"> $1</span>)')
            //Comments
            .replace(/([^:]+\/\/[0-9a-zA-Z ,-_:+]+)/, '<span class="comment">$1</span>')
            .replace(/(\/\*[0-9a-zA-Z ,-_:+]+\*\/)/, '<span class="comment">$1</span>')
            .replace(/(#\s+[0-9a-zA-Z ,-_:+]+)/, '<span class="comment">$1</span>')
            .replace(/(--\s+[0-9a-zA-Z ,-_:+]+)/, '<span class="comment">$1</span>')
            //Fields
            .replace(/([0-9a-z-A-Z]+)\.([0-9a-zA-Z]+)(,?)/gi, '<span class="value">$1.$2</span>$3')
            //Aliases
            /*.replace(/(FROM.*)?([0-9a-z-A-Z]+)\s([0-9a-zA-Z]+)\s(ON|INNER|\n|\n\t)?/gi, ' $1 <span class="alias"> $2 $3 </span>')*/
            //Functions
            .replace(/(INNER|INNER JOIN|LEFT|LEFT JOIN|JOIN)/gi, '<span class="function-name">$1</span>')
            //Arguments and parameters
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\)/gi, '(<span class="params">$1</span>)')
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\,/gi, '(<span class="params">$1</span>,')
            .replace(/\(('[0-9a-zA-Z ,-_.#\[\]%+:]+')\,/gi, '(<span class="params">$1</span>,')
            .replace(/\(([0-9a-zA-Z ,-_.#\[\]%+:]+)\)/gi, '(<span class="params">$1</span>)')
            //Properties
            .replace(/([a-zA-Z_\-]+):/, '<span class="property">$1</span>:')
            //Value to object properties
            .replace(/:\s+([0-9]+),?/, ': <span class="value">$1</span>,')
            .replace(/:\s+([a-zA-Z_\-]+),/, ': <span class="value">$1</span>,')
            .replace(/:\s+'([0-9a-zA-Z_\- .#%$]+)'/, ': <span class="value">\'$1\'</span>')
            .replace(/:\s+"([0-9a-zA-Z_\- .#%$]+)"/, ': <span class="value">"$1"</span>')
            //Adjusts
            .replace(/(http[s]?)\+/, '$1:') + "\n";

        return code;
    }

    function _codeFormat_PYTHON(c) {

        let code = (c)
            //Links
            .replace(/(http[s]?:\/\/[0-9a-zA-Z/ _.-]+)/, '<span class="links">$1</span>')
            .replace(/(http[s]?):/, '$1+')
            //Function declare
            .replace(/def/gi, '<span class="function">def</span>')
            //Boolean
            .replace(/,\s?(true|false)\s?\)/gi, ',<span class="boolean"> $1</span>)')
            //Comments
            .replace(/([^:]+\/\/[0-9a-zA-Z ,-_:+]+)/, '<span class="comment">$1</span>')
            .replace(/(\/\*[0-9a-zA-Z ,-_:+]+\*\/)/, '<span class="comment-blue">$1</span>')
            //Functions
            .replace(/\.([a-zA-Z]+)\(/gi, '.<span class="function-name">$1</span>(')
            .replace(/([a-zA-Z0-9_]+)\(/gi, '<span class="function-name">$1</span>(')
            //Arguments and parameters
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\)/gi, '(<span class="params">$1</span>)')
            .replace(/\(("[0-9a-zA-Z ,-_.#\[\]%+:]+")\,/gi, '(<span class="params">$1</span>,')
            .replace(/\(('[0-9a-zA-Z ,-_.#\[\]%+:]+')\,/gi, '(<span class="params">$1</span>,')
            .replace(/\(([0-9a-zA-Z ,-_.#\[\]%+:]+)\)/gi, '(<span class="params">$1</span>)')
            //Properties
            .replace(/([a-zA-Z_\-]+):/, '<span class="property">$1</span>:')
            //Value to object properties
            .replace(/:\s+([0-9]+),?/, ': <span class="value">$1</span>,')
            .replace(/:\s+([a-zA-Z_\-]+),/, ': <span class="value">$1</span>,')
            .replace(/:\s+'([0-9a-zA-Z_\- .#%$]+)'/, ': <span class="value">\'$1\'</span>')
            .replace(/:\s+"([0-9a-zA-Z_\- .#%$]+)"/, ': <span class="value">"$1"</span>')
            //Adjusts
            .replace(/(http[s]?)\+/, '$1:') + "\n";

        return code;
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
            throw err = msg;
            return err;
        }, //DONE INTERNAL

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

                jX(params.target).width(w);
                jX(params.target).height(h);

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
                    _sel[index].removeEventListener("click", (function(){void(0);})());
                    _sel[index].addEventListener("click", function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        if(typeof callback === "function") {
                            callback(param);
                        } console.log("click-1");
                    });
                }) : (_sel) ? (function (){
                    _sel.removeEventListener("click", (function(){void(0);})());
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
                        _sel[index].removeEventListener(ev, (function(){void(0);})());
                        _sel[index].addEventListener(ev, function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            callback((args === undefined) ? "" : (args.rsp === 'eventTarget') ? jsHunter.fn.getData(args.rsp, e) : jsHunter.fn.getData(args.rsp, _sel[index]));
                        });
                    }) : (_sel) ?
                    (function(){
                        _sel.removeEventListener(ev, (function(){void(0);})());
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
            _createHtmlElement(params);
            (params.hasOwnProperty('timeout') && params.timeout > 0) ?
                (function(){
                    setTimeout(function(){
                        jsHunter.fn.remove(params.append, params.attr_name);
                    }, params.timeout);
                })() : (function(){void (0)})();
            return this;
        }, //DONE & DOCUMENTATION

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
                    break;
                case "text":
                    return e.text || e.textContent || e.innerText;
                    break;
                case "textContent":
                    return e.textContent || e.text || e.innerText;
                    break;
                case "value":
                    return e.value;
                    break;
                case "html":
                    return e.innerHTML;
                    break;
                case "outer":
                    return e.outerHTML;
                    break;
                case "src":
                    return e.src;
                    break;
                case "attr":
                    return e.attributes;
                    break;
                case "href":
                    return e.href;
                    break;
                case "eventTarget":
                    return e.target.id;
                    break;
                default:
                    throw err = "Invalid argument [" + a + "] on getData !";
            }
        }, //DONE & DOCUMENTATION

        screen: function() {
            return {width: window.innerWidth, height: window.innerHeight};
        }, //DONE & DOCUMENTATION

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

        code: function(params) {
            try {
                let _sel = this.sel;
                let _arr = [];
                let _sav = [];
                let _lan = (params.hasOwnProperty('lang')) ? params.lang : false;
                let _thm = (params.hasOwnProperty('theme')) ? params.theme : 'back-dark-code';

                if(!_lan) {
                    console.error('[Error] Missing Language for code() !');
                    return;
                }

                (_sel && typeof _sel === "object" || Array.isArray(_sel)) ?

                    //Current Element
                    _sel.forEach(function(a, index, el) {

                        //Theme apply
                        jX("." + _sel[index].className).addClass(_thm);

                        //Data save
                        _sav.push(jX.fn.getData("text", _sel[index]));

                        //Lines from codes
                        _arr = (jX.fn.getData("text", _sel[index])).split("\n");

                        //Element reset
                        _sel[index].innerHTML = "";

                        //Line to line from codes
                        _arr.forEach(function (node, idx, e) {

                            //Data Append in element + Filters
                            /*_sel[index].innerHTML += (idx + 1) + ": " + _codeFormat(_arr[idx], _lan);*/

                            /*_sel[index].innerHTML += "<span class='line-number'>" + (idx + 1) + ":</span>";
                            _sel[index].innerHTML += _codeFormat(_arr[idx], _lan);*/

                            _sel[index].innerHTML += "<span class='line-number'>" + (idx + 1) + "</span>";
                            _sel[index].innerHTML += "<span class='line-code'>" + _codeFormat(_arr[idx], _lan) + "</span>";

                        });

                    }) : (_sel) ?

                    (function(){
                        console.log("Single: code()", _sel);
                    })() : jsHunter.fn.exception("code() error " + _sel);

            } catch(err) {
                console.error(err);
            }
            return this;
        }, //WORK: PROGRAMAR FUNÇÃO PARA MOSTRAR CODIGO FORMATADO NO ELEMENTO

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
            let _selector = this.selector;
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

        margin: function(orientation, value, measure) {
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

        /***
         * Modals Components
         * */

        modal: function(params) {
            try {
                if(typeof  params === undefined) {
                    throw err = "Modal params missing !";
                } else {
                    let ef = params.effect;
                    let _selector = this.selector;//copy current target tag (noConflict)

                    if(params.action === "open") {
                        switch (ef) {
                            case "fade":
                                jsHunter(_selector).fadeIn(params);
                                break;
                            case "show":
                                jsHunter(_selector).display("block");
                                break;
                            default:
                                throw err = "Modal effect params wrong !";
                        }

                        //Event Listener for close whe clicked in locks screen element
                        jsHunter(_selector, {rsp: "eventTarget"}).on('click', function(rsp) {
                            if(rsp === _selector.replace("#", '').replace(".", "")) {
                                jsHunter(_selector).fadeOut(params);
                            }
                        });
                    }

                    if(params.action === "close") {
                        switch (ef) {
                            case "fade":
                                jsHunter(_selector).fadeOut(params);
                                break;
                            case "hide":
                                jsHunter(_selector).display("none");
                                break;
                            default:
                                throw err = "Modal effect params wrong !";
                        }
                    }
                }

            } catch(err) {
                console.error(err);
            }

            return this;
        }, //DONE & DOCUMENTATION

        modalX: function(params) {

            (modalCtrl !== null) ? clearInterval(modalCtrl) : void(0);

            let _more_width_ = 0;
            let _opacity_ = 0;
            let _opacdiv_ = 15;

            let _config_ = (params.hasOwnProperty('config')) ? params.config : '';
            let _c_timeout_ = (_config_.hasOwnProperty("timeout")) ? _config_.timeout : 0;
            let _c_speed_ = (_config_.hasOwnProperty("speed")) ? _config_.speed : 40;
            let _c_wide_ = (_config_.hasOwnProperty("wide")) ? _config_.wide : false;
            let _c_effect_ = (_config_.hasOwnProperty("effect")) ? _config_.effect : 'normal';
            let _c_loop_ = (_config_.hasOwnProperty("loop")) ? _config_.loop : 3;
            let _c_force_ = (_config_.hasOwnProperty("force")) ? _config_.force : false;

            _c_speed_ = (_c_speed_ < 40) ? _c_speed_ : 40;

            let _element_ = (params.hasOwnProperty("element")) ? params.element : '';
            let _e_name_  = (_element_.hasOwnProperty("name")) ? _element_.name : "#div_modal";
            let _e_width_ = (_element_.hasOwnProperty("width")) ? _element_.width : "800px";
            let _e_height_ = (_element_.hasOwnProperty("height")) ? _element_.height : "400px";
            let _e_margin_ = (_element_.hasOwnProperty("margin")) ? _element_.margin : "5% auto";
            let _e_padding_ = (_element_.hasOwnProperty("padding")) ? _element_.padding : "15px";
            let _e_back_color_ = (_element_.hasOwnProperty("back_color")) ? _element_.back_color : "#FFFFFF";
            let _e_text_color_ = (_element_.hasOwnProperty("text_color")) ? _element_.text_color : "#000000";
            let _e_border_color_ = (_element_.hasOwnProperty("border_color")) ? _element_.border_color : "#EEEEEE";
            let _e_opacity_ = (_element_.hasOwnProperty("opacity") && _element_.opacity !== false) ? _element_.opacity : "1";

            let _lock_screen_ = (params.hasOwnProperty("lock_screen")) ? params.lock_screen : '';
            let _ls_state_ = (_lock_screen_.hasOwnProperty("state")) ? _lock_screen_.state : true;
            let _ls_name_ = (_lock_screen_.hasOwnProperty("name")) ? _lock_screen_.name : "#div_lock_screen";
            let _ls_back_color_ = (_lock_screen_.hasOwnProperty("back_color")) ? _lock_screen_.back_color : "#000000";
            let _ls_opacity_ = (_lock_screen_.hasOwnProperty("opacity") && _lock_screen_.opacity !== false) ? _lock_screen_.opacity : "1";

            let _contentX_ = (params.hasOwnProperty("content")) ? params.content : '';
            let _stateX_ = (_contentX_.hasOwnProperty("state")) ? _contentX_.state : false;
            let _titleX_ = (_contentX_.hasOwnProperty("title")) ? _contentX_.title : '';
            let _bodyX_ = (_contentX_.hasOwnProperty("body")) ? _contentX_.body : '';

            //Max Height for html element according window size
            let _max_width_ = window.innerWidth - 200;
            let _max_height_ = window.innerHeight - 200;

            if(_ls_state_ === true) {
                _modalLockScreen(_ls_name_, _ls_back_color_, _ls_opacity_);
            }

            //CREATE A HTML ELEMENT (Modal Box)
            _element_ = _createHtmlElement({
                element:  "div",
                attr_type: "id",
                attr_name: _e_name_,
                append: (_ls_state_) ? _ls_name_ : "body",
                styles: {
                    back_color: _e_back_color_,
                    text_color: _e_text_color_,
                    width: _e_width_,
                    height: _e_height_,
                    margin: _e_margin_,
                    padding: _e_padding_,
                    opacity: _e_opacity_,
                    display: "block"
                }
            });

            //Init body modal with a html data fake
            if(_stateX_ === false) {
                _modalBody(_e_name_, '', '');
            } else {
                _modalBody(_e_name_, _titleX_, _bodyX_);
            }

            let _styles_ = _getStyles(_element_);

            //Fix size for widget width/height
            _styles_.width = (_styles_.width > _max_width_ || !_c_force_ && _c_wide_) ? _max_width_ : _styles_.width ;
            _styles_.height = (_styles_.height > _max_height_ || !_c_force_ && _c_wide_) ? _max_height_ : _styles_.height ;

            //CSS Reset Element
            _element_.style.width = "0px";
            _element_.style.height = "0px";
            _element_.style.display = "block";
            _element_.style.color = _e_text_color_ || "#FEFEFE";
            _element_.style.background = "rgba(" + this.hexToRgb(_e_back_color_).rgb + ", " + _e_opacity_ + ")";
            _element_.style.borderRadius = "2px";
            _element_.style.boxShadow = "3px 4px 10px #222222";
            _element_.style.opacity = "0";
            _element_.style.border = "solid " + _e_border_color_ + " 1px";
            _element_.style.transition = "all 1ms ease-out";

            //Without Lock Screen
            if (!_ls_state_) {
                _element_.style.position = "fixed";
                _element_.style.zIndex = "5000";
                _element_.style.top = "0px";
                _element_.style.left = "0px";
                _element_.style.margin = "0px";
                _styles_.width = _max_width_ = window.innerWidth;
                _styles_.height = _max_height_ = window.innerHeight;
            }

            //Init Modal Presentation and controls
            _modalInit({
                more_width: _more_width_, //0
                opacity: _opacity_, //0
                opacdiv: _opacdiv_, //15
                element: _element_, //id.selector
                styles: _styles_, //all, width, height, width_save
                timeout: _c_timeout_, //time
                speed: _c_speed_, //40
                wide: _c_wide_, //true|false
                effect: _c_effect_, //type and number of exec
                loop: _c_loop_,
                selector: _e_name_, //ref
                lock_screen: _ls_name_,
                wide_width: _max_width_, //max-wide-width
                max_height: _max_height_ //max height for modal
            });

            return this;

        }, //DONE & DOCUMENTATION (modal sem dependencias)

        modalFX: function(params) {

            let _configFX_ = (params.hasOwnProperty('config')) ? params.config : '';
            let _c_action_ = (_configFX_.hasOwnProperty("action")) ? _configFX_.action : false;
            let _c_timeout_ = (_configFX_.hasOwnProperty("timeout")) ? _configFX_.timeout : 0;
            let _c_speed_ = (_configFX_.hasOwnProperty("speed")) ? _configFX_.speed : 40;
            let _c_effect_ = (_configFX_.hasOwnProperty("effect")) ? _configFX_.effect : 'accordion';

            let _elementFX_ = (params.hasOwnProperty("element")) ? params.element : '';
            let _e_name_ = (_elementFX_.hasOwnProperty("name")) ? _elementFX_.name : "#box";
            let _e_width_ = (_elementFX_.hasOwnProperty("width")) ? _elementFX_.width : "900px";
            let _e_height_ = (_elementFX_.hasOwnProperty("height")) ? _elementFX_.height : "405px";
            let _e_back_color_ = (_elementFX_.hasOwnProperty("back_color")) ? _elementFX_.back_color : "#FFFFFF";
            let _e_text_color_ = (_elementFX_.hasOwnProperty("text_color")) ? _elementFX_.text_color : "#000000";
            let _e_ini_margin_left_ = (_elementFX_.hasOwnProperty("ini_margin_left")) ? _elementFX_.ini_margin_left : "-4000px";
            let _e_css_margin_left_ = (_elementFX_.hasOwnProperty("css_margin_left")) ? _elementFX_.css_margin_left : "-450px";
            let _e_css_height_ = (_elementFX_.hasOwnProperty("css_height")) ? _elementFX_.css_height : "#100px";
            let _e_effect_transition_ = (_elementFX_.hasOwnProperty("effect_transition")) ? _elementFX_.effect_transition : "all .5s ease-in";
            let _e_effect_height_ = (_elementFX_.hasOwnProperty("effect_height")) ? _elementFX_.effect_height : "600px";

            let _lock_screenFX_ = (params.hasOwnProperty("lock_screen")) ? params.lock_screen : '';
            let _ls_state_ = (_lock_screenFX_.hasOwnProperty("state")) ? _lock_screenFX_.state : true;
            let _ls_name_ = (_lock_screenFX_.hasOwnProperty("name")) ? _lock_screenFX_.name : "#bg";
            let _ls_back_color_ = (_lock_screenFX_.hasOwnProperty("back_color")) ? _lock_screenFX_.back_color : "#000000";
            let _ls_opacity_ = (_lock_screenFX_.hasOwnProperty("opacity") && _lock_screenFX_.opacity !== false) ? _lock_screenFX_.opacity : "1";

            let _contentFX_ = (params.hasOwnProperty("content")) ? params.content : '';
            let _stateFX_ = (_contentFX_.hasOwnProperty("state")) ? _contentFX_.state : false;
            let _titleFX_ = (_contentFX_.hasOwnProperty("title")) ? _contentFX_.title : '';
            let _bodyFX_ = (_contentFX_.hasOwnProperty("body")) ? _contentFX_.body : '';

            //Max Size for this element
            let _max_width_ = 900;
            let _max_height_ = 405;

            //Fix size for widget width/height
            _e_width_ = (this.intNumber(_e_width_) > _max_width_) ? _max_width_+"px" : _e_width_ ;
            _e_height_ = (this.intNumber(_e_height_) > _max_height_) ? _max_height_+"px" : _e_height_ ;

            if(_ls_state_ === true) {
                _modalLockScreen(_ls_name_, _ls_back_color_, _ls_opacity_);
            }

            //CREATE A HTML ELEMENT (ModalFX Box)
            _elementFX_ = _createHtmlElement({
                element:  "div",
                attr_type: "id",
                attr_name: _e_name_,
                append: (_ls_state_) ? _ls_name_ : "body",
                styles: {
                    back_color: _e_back_color_,
                    text_color: _e_text_color_,
                    width: _e_width_,
                    height: _e_height_,
                    margin: '0px',
                    margin_left: _e_ini_margin_left_,
                    margin_bottom: '100px',
                    left: '50%',
                    top: '50px',
                    border_radius: '10px',
                    box_shadow: '2px 3px 16px #000000',
                    overflow: 'hidden',
                    position: 'absolute',
                    transition: _e_effect_transition_,
                }
            });

            //Init body modal with a html data fake
            if(_stateFX_ === false) {
                _modalBody(_e_name_, '', '');
            } else {
                _modalBody(_e_name_, _titleFX_, _bodyFX_);
            }

            //Init Modal Presentation and controls
            _modalInit({
                action: _c_action_,
                element: _elementFX_, //id.selector
                timeout: _c_timeout_, //time
                speed: _c_speed_, //40
                effect: _c_effect_, //accordion
                selector: _e_name_, //ref
                lock_screen: _ls_name_,
                wide_width: _max_width_, //max-wide-width
                max_height: _max_height_, //max height for modal,
                margin_left: _e_ini_margin_left_,
                css_margin_left: _e_css_margin_left_,
                css_height: _e_css_height_,
                effect_height: _e_effect_height_,
            });

            return this;

        }, //DONE & DOCUMENTATION (modal voador sem dependencias)

        modalTheme: function(params) {

            let _timeout_ = (params.hasOwnProperty('timeout')) ? params.timeout : 0;
            let _theme_ = (params.hasOwnProperty('theme')) ? params.theme : '';
            let _lock_back_color_ = (params.hasOwnProperty('lock_back_color')) ? params.lock_back_color : 'none';
            let _content_ = (params.hasOwnProperty('content')) ? params.content : '';
            let _back_color_ = (_content_.hasOwnProperty('back_color')) ? _content_.back_color : 'none';
            let _title_ = (_content_.hasOwnProperty('title')) ? _content_.title : 'Sample Title';
            let _body_ = (_content_.hasOwnProperty('body')) ? _content_.body : 'Sample Body';
            let _footer_ = (_content_.hasOwnProperty('footer')) ? (_content_.footer === false) ? false : _content_.footer : false;

            //Check if element already exists in DOM
            if(document.querySelector("#modal-container__styling")) {
                return;
            }

            //CREATE STRUCTURE HTML OF ELEMENTS (modalTheme)

            let _elementContainer_ = _createHtmlElement({
                element:  "div",
                attr_type: "id",
                attr_name: "#modal-container__styling",
                append: "body"
            });

            let _elementModal_ = _createHtmlElement({
                element:  "div",
                attr_type: "id",
                attr_name: "#modal-box",
                append: "#modal-container__styling"
            });

            let _elementClose_ = _createHtmlElement({
                element:  "div",
                attr_type: "id",
                attr_name: "#modal-close",
                append: "#modal-box"
            });

            let _elementTitle_ = _createHtmlElement({
                element:  "div",
                attr_type: "id",
                attr_name: "#modal-title",
                append: "#modal-box"
            });

            let _elementContent_ = _createHtmlElement({
                element:  "div",
                attr_type: "id",
                attr_name: "#modal-content",
                append: "#modal-box"
            });

            if(_footer_ !== false) {
                let _elementFooter_ = _createHtmlElement({
                    element: "div",
                    attr_type: "id",
                    attr_name: "#modal-footer",
                    append: "#modal-box"
                });
                jsHunter('#modal-footer').html(_footer_);
            } else {
                jsHunter('#modal-content').height('83%');
            }

            //Writer in box
            jsHunter('#modal-close').html('X');
            jsHunter('#modal-title').html(_title_);
            jsHunter('#modal-content').html(_body_);
            jsHunter('#modal-container__styling').resetStyle().addClass(_theme_);

            if(_lock_back_color_ !== 'none') {
                jsHunter('#modal-container__styling').addClass(_lock_back_color_);
            }

            if(_back_color_ !== 'none') {
                jsHunter('#modal-content').addClass(_back_color_);
            }

            //Show box
            jsHunter('#modal-box').fadeIn({timer_fade: 10});

            //Event Listener for close by button X modal-close
            jsHunter('#modal-close').on('click', function(){
                jsHunter('#modal-container__styling')
                    .fadeOut({
                        timer_fade: 10,
                        remove: true,
                        parent: 'body',
                        children: '#modal-container__styling'
                    });
            });

            //Event Listener for close whe clicked in locks screen element
            jsHunter('#modal-container__styling', {rsp: "eventTarget"}).on('click', function(rsp) {
                if(rsp === 'modal-container__styling') {
                    jsHunter('#modal-container__styling')
                        .fadeOut({
                            timer_fade: 10,
                            remove: true,
                            parent: 'body',
                            children: '#modal-container__styling'
                        });
                }
            });

            //Automatic Modal Close
            if(parseInt(_timeout_) > 0) {
                setTimeout(function(){
                    jsHunter('#modal-container__styling')
                        .fadeOut({
                            timer_fade: 10,
                            remove: true,
                            parent: 'body',
                            children: '#modal-container__styling'
                        });
                }, parseInt(_timeout_));
            }

            return this;

        }, //DONE E DOCUMENTATION

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
                                nodes.push(huntq[index]);
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

        nodeParent: function(parentItem) {
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
            ) ? true : false;
        }, //DONE

        matchClass: function(element, classname) {
            return (
                element.className.search(classname) >= 0 ||
                element.className.search(" " + classname) >= 0 ||
                element.className.search(classname + " ") >= 0
            ) ? true : false;
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

    window.jX = window.jsHunter = jsHunter;
    window.$$ = jsHunter();

})();

//No Conflict Resolved
const _jsHunter = window.jsHunter, _jX = window.jX;

jsHunter.noConflict = function( digger ) {
    if(window.jX === jsHunter) {
        window.jX = _jX;
    }
    if(digger && window.jsHunter === jsHunter) {
        window.jsHunter = _jsHunter;
    }
    return jsHunter;
};

jsHunter.noConflict();

if ( typeof noGlobal === typeof undefined ) {
    window.jsHunter = window.jX = jsHunter;
}

window.$J = jsHunter.fn;
