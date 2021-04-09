/*
*
* Project: jsHunter-ui
* Author: Jereelton Teixeira
* Release: 1.0.0
* Date: 2019-11-01
*
* This library should be used together with jsHunter and jsHunter-styling.css !
*
*/

;(function(){

    try {
        if(!window.jH || !window.jsHunter || !jsHunter || !window.$$ || !window.$J) {
            throw er = "[Exception]: Error on load jsHunter (Lib NOT FOUND) !";
        }
    } catch (er) {
        console.exception( "Fatal Error: " + er);
        return;
    }

    /***
     * Variables UI
     * */

    let
        //Modal controls
        modalCtrl = null,
        loopCtrl  = 0;

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

        //_createHtmlElement({
        $$.create({
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

    jsHunter.prototype.modal = function(params) {
        try {
            if(typeof  params === "undefined") {
                throw err = "Modal params missing !";
            } else {
                let ef = params.effect;
                let _selector = jsHunter.selector;//copy current target tag (noConflict)

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
    } //DONE & DOCUMENTATION

    jsHunter.prototype.modalFX = function(params) {

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
        //_elementFX_ = _createHtmlElement({
        _elementFX_ = $$.create({
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

    } //DONE & DOCUMENTATION (modal flyer without dependence)

    jsHunter.prototype.modalX = function(params) {

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

    } //DONE & DOCUMENTATION (modal without dependence)

    jsHunter.prototype.modalTheme = function(params) {

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

    } //DONE E DOCUMENTATION

})((typeof jsHunter !== "undefined" ? jsHunter: ''));
