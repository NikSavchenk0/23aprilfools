var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

(function(Lego){
if (!Lego) Lego = window.Lego = {};

!Lego.params && (Lego.params = {});


/**
 * Хелпер удаляющий протокол из переданного хоста, для приведения
 * к каноническому виду.
 *
 * @param h {String}
 * @returns {String}
 */
function preparseHost(h) {
    return h.replace(/^(?:https?:)?\/\//, '');
}

/**
 * Счётчик клика на ссылку или просто показа.
 *
 * В случае клика подменяет href на redir'овский, потом по таймауту возвращает его обратно.
 *
 * В случае учёта показа динамически создаёт скрипт с URL системы учёта.
 *
 * Пример использования:
 *
 * <a href="http://web.archive.org/web/20130424113517/http://meteoinfo.ru" onmousedown="Lego.c('stred/pid=7/cid=433',this)">Гидрометцентр</a>
 *
 * или
 *
 * < script type="text/javascript">Lego.c('stred/pid=7/cid=433')< /script>
 *
 * @param w     параметры счётчика
 * @param a     (optional) ссылка, клик на которую надо учитывать
 * @param opts  (optional) opts.noRedirect = true обрабатывает клик по обычной ссылке, как по b-link_pseudo_yes
 */ /**/
Lego.c = function(w, a, opts) {
/*
    new Image().src = location.protocol + '//web.archive.org/web/20130424113517/http://clck.yandex.ru/click/dtype=' + w +
        '/rnd=' + ((new Date()).getTime() + Math.round(Math.random()*100)) +
        '/*' + (a ? (a.href || location.href) : '');
*/

    var host = preparseHost((opts && opts.host) || Lego.params['click-host'] || 'clck.yandex.ru'),
        url = function(w, h, t, a) {

            h = h.replace("'", "%27"); //см. LEGO-6428

            return h.indexOf('/dtype=') > -1?
                h :
                location.protocol + '//' + host + '/' + t + '/dtype=' + w +
                    '/rnd=' + ((new Date()).getTime() + Math.round(Math.random()*100)) +
                    (a?
                        '/*' + (h.match(/^http/) ? h : location.protocol + '//' + location.host + (h.match('^/') ? h : '/' + h)) :
                        '/*data=' + encodeURIComponent('url='+ encodeURIComponent((h.match(/^http/) ? h : location.protocol + '//' + location.host + (h.match('^/') ? h : '/' + h)))));
        },
        click = function() {
            var head = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0];
            var script = document.createElement('script');
            script.setAttribute('src', url(w, location.href, 'jclck'));
            head.insertBefore(script, head.firstChild);
        };

    if (a) {
        // для псевдоссылки и ссылки mailto просто считаем click, создавая iframe и в него грузим счётчик
        if (a.className.match(/b-link_pseudo_yes/) || (a.href && a.href.match(/^mailto:/)) || (opts && opts.noRedirect === true)) {
            click();
        } else if (a.href) { // клик на ссылку, подменяем href на redir'овский, потом по таймауту обратно
            var h = a.href;
            a.href = url(w, h, "redir");
            setTimeout(function() { a.href = h }, 500);
        } else if (a.form) { // клик на элемент формы
            if (a.type.match(/submit|button|image/)) { // клик на кнопку, подменяем action на redir'овский, потом по таймауту обратно
                var h = a.form.action;
                a.form.action = url(w, h, "redir", true);
                setTimeout(function() { a.form.action = h }, 500);
            } else { // просто считаем click, создавая iframe и в него грузим счётчик
                click();
            }
        } else if (a.action) { //случай сабмита формы - подменяем его action на redir'овский, назад нам его менять не нужно
            a.action = url(w, a.action, "redir", true);
        } else {
            throw "counter.js: not link and not form!";
        }
    } else { // ссылки нет, просто учёт показа, создаём iframe и в него грузим счётчик
        click();
    }
}

})(window.Lego);

(function(Lego){
if (!Lego) Lego = window.Lego = {};

/**
 * Параметризованный счётчик клика на ссылку или просто показа.
 * Перевызывает Lego.c(w, a) из counter.js
 *
 * В случае клика подменяет href на redir'овский, потом по таймауту возвращает его обратно.
 *
 * В случае учёта показа динамически создаёт iframe с URL системы учёта.
 *
 * Пример использования:
 *
 * <a href="http://web.archive.org/web/20130424113517/http://meteoinfo.ru" onclick="Lego.cp(0,1917,'weather.tabs.fotki',this)">Гидрометцентр</a>
 *
 * или
 *
 * < script type="text/javascript">Lego.cp(0,1917,'weather.tabs.fotki')< /script>
 *
 * @param pi    номер проекта (pid)
 * @param ci    номер счётчика (cid)
 * @param p     (optional) parameter
 * @param a     (optional) ссылка, клик на которую надо учитывать
 * @param opts  (optional) opts.noRedirect = true обрабатывает клик по обычной ссылке, как по b-link_pseudo_yes
 */
Lego.cp = function(pi, ci, p, a, opts) {
    Lego.c('stred/pid=' + pi + '/cid=' + ci + (p ? '/path=' + p : ''), a, opts);
}

})(window.Lego);

(function(Lego){
if (!Lego) Lego = window.Lego = {};

!Lego.params && (Lego.params = {});

/**
 * Параметризованный счётчик клика на ссылку в шапке. Перевызывает cp(w, a) из counter-cp.js
 * Используется для уменьшения веса страницы.
 *
 * Пример использования:
 *
 * <a href="http://web.archive.org/web/20130424113517/http://meteoinfo.ru" onclick="ch('weather.tabs.fotki',this)">Гидрометцентр</a>
 *
 * или
 *
 * < script type="text/javascript">ch('weather')< /script>
 *
 * @param p     parameter
 * @param a     (optional) ссылка, клик на которую надо учитывать
 */
Lego.ch = function(p, a) {
    if (Lego.params['show-counters']) Lego.cp(0, 2219, p, a);
}

})(window.Lego);

(function(Lego){
if (!Lego) Lego = window.Lego = {};

Lego.getCookie = function(n) {
    var c = document.cookie;
    if (c.length < 1) return false;

    var b = c.indexOf(n + '=');
    if (b == -1) return false;

    b += (n.length + 1);
    var e = c.indexOf(';', b);

    return decodeURIComponent((e == -1) ? c.substring(b) : c.substring(b, e));
}

})(window.Lego);

(function(Lego){
if (!Lego) Lego = window.Lego = {};
/**
 * Проверяет жива ли сессия пользователя (наличие куки yandex_login).
 *
 * @return  true, если сессия пользователя живая.
 */
Lego.isSessionValid = function() {
    return !!Lego.getCookie('yandex_login');
}
})(window.Lego);

(function($, Lego){
if (!Lego) Lego = window.Lego = {};
// Использует cookie.js и check-session.js. Без них не работает.

/**
 * Инициализирует Лего некоторыми параметрами (для вариативности в пределах разных страниц).
 *
 * @param params объект Лего-параметров, необходимые параметры инициализируются умолчательными значениями
 *        params.login логин текущего пользователя ('' для неавторизованного)
 *        params.locale двухбуквенный код локали в нижнем регистре
 *        params.id идентификатор сервиса
 *        params['show-counters-percent'] процент срабатывания счётчиков Lego.ch() (по умолчанию 100)
 *
 * @return возвращает установленные параметры с учетом умолчательных значений
 */
Lego.init || (Lego.init = function(params) {
    (params = Lego.params = $.extend(
        {
            id : '',
            login : Lego.isSessionValid() ? Lego.getCookie('yandex_login') || '' : '',
            yandexuid : Lego.getCookie('yandexuid'),
            locale : 'ru',
            retpath : window.location.toString(),
            'passport-host' : '//web.archive.org/web/20130424113517/http://passport.yandex.ru',
            'pass-host' : '//web.archive.org/web/20130424113517/http://pass.yandex.ru',
            'passport-msg' : params.id,
            'social-host' : '//web.archive.org/web/20130424113517/http://social.yandex.ru',
            'lego-path' : '/lego',
            'show-counters-percent' : 100
        },
        params,
        Lego.params))
        ['show-counters'] = Math.round(Math.random() * 100) <= params['show-counters-percent'];

    BEM.blocks['i-global']._params || $.extend(BEM.blocks['i-global']._params = {}, params);

    $(function(){
        params.oframebust && Lego.oframebust(params.oframebust);
    });

    return params;
});

Lego.block || (Lego.block = {});

Lego.blockInit || (Lego.blockInit = function(context, blockSelector) {
    context = context || document;
    blockSelector = blockSelector || '.g-js';
    $(context).find(blockSelector).each(function(){
        var block = $(this),
            params = this.onclick ? this.onclick() : {},
            name = params.name || '',
            init = Lego.block[name];
        if (init && !block.data(name)) {
            init.call(block, params);
            block
                .data(name, true)
                .addClass(name + '_js_inited');
        }
    });
});

Lego.blockInitBinded || (Lego.blockInitBinded = !!$(document).ready(function(){ Lego.blockInit() }));

})(jQuery, window.Lego);

/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
/**
 * Inheritance plugin
 *
 * Copyright (c) 2010 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.3.3
 */

(function($) {

var hasIntrospection = (function(){_}).toString().indexOf('_') > -1,
    needCheckProps = $.browser.msie, // fucking ie hasn't toString, valueOf in for
    specProps = needCheckProps? ['toString', 'valueOf'] : null,
    emptyBase = function() {};

function override(base, result, add) {

    var hasSpecProps = false;
    if(needCheckProps) {
        var addList = [];
        $.each(specProps, function() {
            add.hasOwnProperty(this) && (hasSpecProps = true) && addList.push({
                name : this,
                val  : add[this]
            });
        });
        if(hasSpecProps) {
            $.each(add, function(name) {
                addList.push({
                    name : name,
                    val  : this
                });
            });
            add = addList;
        }
    }

    $.each(add, function(name, prop) {
        if(hasSpecProps) {
            name = prop.name;
            prop = prop.val;
        }
        if($.isFunction(prop) &&
           (!hasIntrospection || prop.toString().indexOf('.__base') > -1)) {

            var baseMethod = base[name] || function() {};
            result[name] = function() {
                var baseSaved = this.__base;
                this.__base = baseMethod;
                var result = prop.apply(this, arguments);
                this.__base = baseSaved;
                return result;
            };

        }
        else {
            result[name] = prop;
        }

    });

}

$.inherit = function() {

    var args = arguments,
        hasBase = $.isFunction(args[0]),
        base = hasBase? args[0] : emptyBase,
        props = args[hasBase? 1 : 0] || {},
        staticProps = args[hasBase? 2 : 1],
        result = props.__constructor || (hasBase && base.prototype.__constructor)?
            function() {
                return this.__constructor.apply(this, arguments);
            } : function() {};

    if(!hasBase) {
        result.prototype = props;
        result.prototype.__self = result.prototype.constructor = result;
        return $.extend(result, staticProps);
    }

    $.extend(result, base);

    var inheritance = function() {},
        basePtp = inheritance.prototype = base.prototype,
        resultPtp = result.prototype = new inheritance();

    resultPtp.__self = resultPtp.constructor = result;

    override(basePtp, resultPtp, props);
    staticProps && override(base, result, staticProps);

    return result;

};

$.inheritSelf = function(base, props, staticProps) {

    var basePtp = base.prototype;

    override(basePtp, basePtp, props);
    staticProps && override(base, base, staticProps);

    return base;

};

})(jQuery);
/**
 * Identify plugin
 *
 * @version 1.0.0
 */

(function($) {

var counter = 0,
    expando = '__' + (+new Date),
    get = function() {
        return 'uniq' + ++counter;
    };

/**
 * Уникализатор
 * @param {Object} [obj] объект, который нужно идентифицировать
 * @param {Boolean} [onlyGet=false] возвращать уникальное значение, только если оно уже до этого было присвоено
 * @returns {String} идентификатор
 */
$.identify = function(obj, onlyGet) {

    if(!obj) return get();

    var key = 'uniqueID' in obj? 'uniqueID' : expando; // используем, по возможности. нативный uniqueID для элементов в IE

    return onlyGet || key in obj?
        obj[key] :
        obj[key] = get();

};

})(jQuery);
(function($) {

$.isEmptyObject || ($.isEmptyObject = function(obj) {
        for(var i in obj) return false;
        return true;
    });

})(jQuery);

/**
 * Debounce and throttle function's decorator plugin 1.0.6
 *
 * Copyright (c) 2009 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) {

$.extend({

    debounce : function(fn, timeout, invokeAsap, ctx) {

        if(arguments.length == 3 && typeof invokeAsap != 'boolean') {
            ctx = invokeAsap;
            invokeAsap = false;
        }

        var timer;

        return function() {

            var args = arguments;
            ctx = ctx || this;

            invokeAsap && !timer && fn.apply(ctx, args);

            clearTimeout(timer);

            timer = setTimeout(function() {
                invokeAsap || fn.apply(ctx, args);
                timer = null;
            }, timeout);

        };

    },

    throttle : function(fn, timeout, ctx) {

        var timer, args, needInvoke;

        return function() {

            args = arguments;
            needInvoke = true;
            ctx = ctx || this;

            timer || (function() {
                if(needInvoke) {
                    fn.apply(ctx, args);
                    needInvoke = false;
                    timer = setTimeout(arguments.callee, timeout);
                }
                else {
                    timer = null;
                }
            })();

        };

    }

});

})(jQuery);
/**
 * Observable plugin
 *
 * Copyright (c) 2010 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.0.0
 * @requires $.identify
 * @requires $.inherit
 */

(function($) {

var storageExpando = '__' + +new Date + 'storage',
    getFnId = function(fn, ctx) {
        return $.identify(fn) + (ctx? $.identify(ctx) : '');
    },
    Observable = /** @lends $.observable.prototype */{

        /**
         * Строит полное имя события
         * @protected
         * @param {String} e тип события
         * @returns {String}
         */
        buildEventName : function(e) {

            return e;

        },

        /**
         * Добавление обработчика события
         * @param {String} e тип события
         * @param {Object} [data] дополнительные данные, приходящие в обработчик как e.data
         * @param {Function} fn обработчик
         * @param {Object} [ctx] контекст обработчика
         * @returns {$.observable}
         */
        on : function(e, data, fn, ctx, _special) {

            if(typeof e == 'string') {
                if($.isFunction(data)) {
                    ctx = fn;
                    fn = data;
                    data = undefined;
                }

                var id = getFnId(fn, ctx),
                    storage = this[storageExpando] || (this[storageExpando] = {}),
                    eList = e.split(' '),
                    i = 0,
                    eStorage;

                while(e = eList[i++]) {
                    e = this.buildEventName(e);
                    eStorage = storage[e] || (storage[e] = { ids : {}, list : {} });

                    if(!(id in eStorage.ids)) {
                        var list = eStorage.list,
                            item = { fn : fn, data : data, ctx : ctx, special : _special };
                        if(list.last) {
                            list.last.next = item;
                            item.prev = list.last;
                        } else {
                            list.first = item;
                        }

                        eStorage.ids[id] = list.last = item;
                    }
                }
            } else {
                var _this = this;
                $.each(e, function(e, fn) {
                    _this.on(e, fn, data, _special);
                });
            }

            return this;

        },

        onFirst : function(e, data, fn, ctx) {

            return this.on(e, data, fn, ctx, { one : true });

        },

        /**
         * Удаление обработчика/обработчиков события
         * @param {String} [e] тип события
         * @param {Function} [fn] обработчик
         * @param {Object} [ctx] контекст обработчика
         * @returns {$.observable}
         */
        un : function(e, fn, ctx) {

            if(typeof e == 'string' || typeof e == 'undefined') {
                var storage = this[storageExpando];
                if(storage) {
                    if(e) { // если передан тип события
                        var eList = e.split(' '),
                            i = 0,
                            eStorage;
                        while(e = eList[i++]) {
                            e = this.buildEventName(e);
                            if(eStorage = storage[e]) {
                                if(fn) {  // если передан конкретный обработчик
                                    var id = getFnId(fn, ctx),
                                        ids = eStorage.ids;
                                    if(id in ids) {
                                        var list = eStorage.list,
                                            item = ids[id],
                                            prev = item.prev,
                                            next = item.next;

                                        if(prev) {
                                            prev.next = next;
                                        }
                                        else if(item === list.first) {
                                            list.first = next;
                                        }

                                        if(next) {
                                            next.prev = prev;
                                        }
                                        else if(item === list.last) {
                                            list.last = prev;
                                        }

                                        delete ids[id];
                                    }
                                } else {
                                    delete this[storageExpando][e];
                                }
                            }
                        }
                    } else {
                        delete this[storageExpando];
                    }
                }
            } else {
                var _this = this;
                $.each(e, function(e, fn) {
                    _this.un(e, fn, ctx);
                });
            }

            return this;

        },

        /**
         * Запускает обработчики события
         * @param {String|$.Event} e событие
         * @param {Object} [data] дополнительные данные
         * @returns {$.observable}
         */
        trigger : function(e, data) {

            var _this = this,
                storage = _this[storageExpando],
                rawType;

            typeof e === 'string'?
                e = $.Event(_this.buildEventName(rawType = e)) :
                e.type = _this.buildEventName(rawType = e.type);

            e.target || (e.target = _this);

            if(storage && (storage = storage[e.type])) {
                var item = storage.list.first,
                    ret;
                while(item) {
                    e.data = item.data;
                    ret = item.fn.call(item.ctx || _this, e, data);
                    if(typeof ret !== 'undefined') {
                        e.result = ret;
                        if(ret === false) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }

                    item.special && item.special.one &&
                        _this.un(rawType, item.fn, item.ctx);
                    item = item.next;
                }
            }

            return this;

        }

    };

$.observable = $.inherit(Observable, Observable);

})(jQuery);
/** @requires jquery.inherit */
/** @requires jquery.isEmptyObject */
/** @requires jquery.identify */
/** @requires jquery.observable */

(function($, undefined) {

/**
 * Хранилище для отложенных функций
 * @private
 * @type Array
 */
var afterCurrentEventFns = [],

/**
 * Хранилище деклараций блоков (хэш по имени блока)
 * @private
 * @type Object
 */
    blocks = {},

/**
 * Каналы сообщений
 * @static
 * @private
 * @type Object
 */
    channels = {};

/**
 * Строит имя метода-обработчика установки модификатора
 * @static
 * @private
 * @param {String} elemName имя элемента
 * @param {String} modName имя модификатора
 * @param {String} modVal значение модификатора
 * @returns {String}
 */
function buildModFnName(elemName, modName, modVal) {

    return (elemName? '__elem_' + elemName : '') +
           '__mod' +
           (modName? '_' + modName : '') +
           (modVal? '_' + modVal : '');

}

/**
 * Преобразует хэш обработчиков модификаторов в методы
 * @static
 * @private
 * @param {Object} modFns
 * @param {Object} props
 * @param {String} [elemName]
 */
function modFnsToProps(modFns, props, elemName) {

    $.isFunction(modFns)?
        (props[buildModFnName(elemName, '*', '*')] = modFns) :
        $.each(modFns, function(modName, modFn) {
            $.isFunction(modFn)?
                (props[buildModFnName(elemName, modName, '*')] = modFn) :
                $.each(modFn, function(modVal, modFn) {
                    props[buildModFnName(elemName, modName, modVal)] = modFn;
                });
        });

}

function buildCheckMod(modName, modVal) {

    return modVal?
        Array.isArray(modVal)?
            function(block) {
                var i = 0, len = modVal.length;
                while(i < len)
                    if(block.hasMod(modName, modVal[i++]))
                        return true;
                return false;
            } :
            function(block) {
                return block.hasMod(modName, modVal);
            } :
        function(block) {
            return block.hasMod(modName);
        };

}

/** @namespace */
this.BEM = $.inherit($.observable, /** @lends BEM.prototype */ {

    /**
     * @class Базовый блок для создания bem-блоков
     * @constructs
     * @private
     * @param {Object} mods модификаторы блока
     * @param {Object} params параметры блока
     * @param {Boolean} [initImmediately=true]
     */
    __constructor : function(mods, params, initImmediately) {

        var _this = this;

        /**
         * кэш модификаторов блока
         * @private
         * @type Object
         */
        _this._modCache = mods || {};

        /**
         * текущие модификаторы в стэке установки
         * @private
         * @type Object
         */
        _this._processingMods = {};

        /**
         * параметры блока с учетом дефолтных
         * @protected
         * @type Object
         */
        _this._params = params; // это нужно для правильной сборки параметров у блока из нескольких нод
        _this.params = null;

        initImmediately !== false?
            _this._init() :
            _this.afterCurrentEvent(function() {
                _this._init();
            });

    },

    /**
     * Инициализирует блок
     * @private
     */
    _init : function() {

        if(!this._initing && !this.hasMod('js', 'inited')) {
            this._initing = true;

            this.params = $.extend(this.getDefaultParams(), this._params);
            delete this._params;

            this.setMod('js', 'inited');
            delete this._initing;
            this.trigger('init');
        }

        return this;

    },

    /**
     * Изменяет контекст передаваемой функции
     * @protected
     * @param {Function} fn
     * @param {Object} [ctx=this] контекст
     * @returns {Function} функция с измененным контекстом
     */
    changeThis : function(fn, ctx) {

        return fn.bind(ctx || this);

    },

    /**
     * Выполняет функцию в контексте блока после "текущего события"
     * @protected
     * @param {Function} fn
     * @param {Object} [ctx] контекст
     */
    afterCurrentEvent : function(fn, ctx) {

        this.__self.afterCurrentEvent(this.changeThis(fn, ctx));

    },

    /**
     * Запускает обработчики события у блока и обработчики live-событий
     * @protected
     * @param {String} e имя события
     * @param {Object} [data] дополнительные данные
     * @returns {BEM}
     */
    trigger : function(e, data) {

        this
            .__base(e = this.buildEvent(e), data)
            .__self.trigger(e, data);

        return this;

    },

    buildEvent : function(e) {

        typeof e == 'string' && (e = $.Event(e));
        e.block = this;

        return e;

    },

    /**
     * Проверят наличие модификатора у блока/вложенного элемента
     * @protected
     * @param {Object} [elem] вложенный элемент
     * @param {String} modName имя модификатора
     * @param {String} [modVal] значение модификатора
     * @returns {Boolean}
     */
    hasMod : function(elem, modName, modVal) {

        var len = arguments.length,
            invert = false;

        if(len == 1) {
            modVal = '';
            modName = elem;
            elem = undefined;
            invert = true;
        }
        else if(len == 2) {
            if(typeof elem == 'string') {
                modVal = modName;
                modName = elem;
                elem = undefined;
            }
            else {
                modVal = '';
                invert = true;
            }
        }

        var res = this.getMod(elem, modName) === modVal;
        return invert? !res : res;

    },

    /**
     * Возвращает значение модификатора блока/вложенного элемента
     * @protected
     * @param {Object} [elem] вложенный элемент
     * @param {String} modName имя модификатора
     * @returns {String} значение модификатора
     */
    getMod : function(elem, modName) {

        var type = typeof elem;
        if(type === 'string' || type === 'undefined') { // elem либо отсутствует, либо undefined
            modName = elem || modName;
            var modCache = this._modCache;
            return modName in modCache?
                modCache[modName] :
                modCache[modName] = this._extractModVal(modName);
        }

        return this._getElemMod(modName, elem);

    },

    /**
     * Возвращает значение модификатора вложенного элемента
     * @private
     * @param {String} modName имя модификатора
     * @param {Object} elem вложенный элемент
     * @param {Object} [elem] имя вложенного элемента
     * @returns {String} значение модификатора
     */
    _getElemMod : function(modName, elem, elemName) {

        return this._extractModVal(modName, elem, elemName);

    },

    /**
     * Возвращает значения модификаторов блока/вложенного элемента
     * @protected
     * @param {Object} [elem] вложенный элемент
     * @param {String} [modName1, ..., modNameN] имена модификаторов
     * @returns {Object} значения модификаторов в виде хэша
     */
    getMods : function(elem) {

        var hasElem = elem && typeof elem != 'string',
            _this = this,
            modNames = [].slice.call(arguments, hasElem? 1 : 0),
            res = _this._extractMods(modNames, hasElem? elem : undefined);

        if(!hasElem) { // кэшируем
            modNames.length?
                modNames.forEach(function(name) {
                    _this._modCache[name] = res[name];
                }):
                _this._modCache = res;
        }

        return res;

    },

    /**
     * Устанавливает модификатор у блока/вложенного элемента
     * @protected
     * @param {Object} [elem] вложенный элемент
     * @param {String} modName имя модификатора
     * @param {String} modVal значение модификатора
     * @returns {BEM}
     */
    setMod : function(elem, modName, modVal) {

        if(typeof modVal == 'undefined') {
            modVal = modName;
            modName = elem;
            elem = undefined;
        }

        var _this = this;

        if(!elem || elem[0]) {

            var modId = (elem && elem[0]? $.identify(elem[0]) : '') + '_' + modName;

            if(this._processingMods[modId]) return _this;

            var elemName,
                curModVal = elem?
                    _this._getElemMod(modName, elem, elemName = _this.__self._extractElemNameFrom(elem)) :
                    _this.getMod(modName);

            if(curModVal === modVal) return _this;

            this._processingMods[modId] = true;

            var needSetMod = true,
                modFnParams = [modName, modVal, curModVal];

            elem && modFnParams.unshift(elem);

            [['*', '*'], [modName, '*'], [modName, modVal]].forEach(function(mod) {
                needSetMod = _this._callModFn(elemName, mod[0], mod[1], modFnParams) !== false && needSetMod;
            });

            !elem && needSetMod && (_this._modCache[modName] = modVal);

            needSetMod && _this._afterSetMod(modName, modVal, curModVal, elem, elemName);

            delete this._processingMods[modId];
        }

        return _this;

    },

    /**
     * Функция после успешного изменения модификатора у блока/вложенного элемента
     * @protected
     * @param {String} modName имя модификатора
     * @param {String} modVal значение модификатора
     * @param {String} oldModVal старое значение модификатора
     * @param {Object} [elem] вложенный элемент
     * @param {String} [elemName] имя элемента
     */
    _afterSetMod : function(modName, modVal, oldModVal, elem, elemName) {},

    /**
     * Устанавливает модификатор у блока/вложенного элемента в зависимости от условия.
     * Если передан параметр condition, то при true устанавливается modVal1, при false - modVal2,
     * если же condition не передан, то устанавливается modVal1, если установлен modVal2, и наоборот
     * @protected
     * @param {Object} [elem] вложенный элемент
     * @param {String} modName имя модификатора
     * @param {String} modVal1 первое значение модификатора
     * @param {String} [modVal2] второе значение модификатора
     * @param {Boolean} [condition] условие
     * @returns {BEM}
     */
    toggleMod : function(elem, modName, modVal1, modVal2, condition) {

        if(typeof elem == 'string') { // если это блок
            condition = modVal2;
            modVal2 = modVal1;
            modVal1 = modName;
            modName = elem;
            elem = undefined;
        }
        if(typeof modVal2 == 'undefined') {
            modVal2 = '';
        } else if(typeof modVal2 == 'boolean') {
            condition = modVal2;
            modVal2 = '';
        }

        var modVal = this.getMod(elem, modName);
        (modVal == modVal1 || modVal == modVal2) &&
            this.setMod(
                elem,
                modName,
                typeof condition === 'boolean'?
                    (condition? modVal1 : modVal2) :
                    this.hasMod(elem, modName, modVal1)? modVal2 : modVal1);

        return this;

    },

    /**
     * Удаляет модификатор у блока/вложенного элемента
     * @protected
     * @param {Object} [elem] вложенный элемент
     * @param {String} modName имя модификатора
     * @returns {BEM}
     */
    delMod : function(elem, modName) {

        if(!modName) {
            modName = elem;
            elem = undefined;
        }

        return this.setMod(elem, modName, '');

    },

    /**
     * Выполняет обработчики установки модификаторов
     * @private
     * @param {String} elemName имя элемента
     * @param {String} modName имя модификатора
     * @param {String} modVal значение модификатора
     * @param {Array} modFnParams параметры обработчика
     */
    _callModFn : function(elemName, modName, modVal, modFnParams) {

        var modFnName = buildModFnName(elemName, modName, modVal);
        return this[modFnName]?
           this[modFnName].apply(this, modFnParams) :
           undefined;

    },

    /**
     * Извлекает значение модификатора
     * @private
     * @param {String} modName имя модификатора
     * @param {Object} [elem] элемент
     * @returns {String} значение модификатора
     */
    _extractModVal : function(modName, elem) {

        return '';

    },

    /**
     * Извлекает имя/значение списка модификаторов
     * @private
     * @param {Array} modNames имена модификаторов
     * @param {Object} [elem] элемент
     * @returns {Object} хэш значений модификаторов по имени
     */
    _extractMods : function(modNames, elem) {

        return {};

    },

    /**
     * Возвращает именованный канал сообщений
     * @param {String} [id='default'] идентификатор канала
     * @param {Boolean} [drop=false] уничтожить канал
     * @returns {$.observable|undefined} канал сообщений
     */
    channel : function(id, drop) {

        return this.__self.channel(id, drop);

    },

    /**
     * Возвращает дефолтные параметры блока
     * @returns {Object}
     */
    getDefaultParams : function() {

        return {};

    },

    /**
     * Хелпер для очистки свойств блока
     * @param {Object} [obj=this]
     */
    del : function(obj) {

        var args = [].slice.call(arguments);
        typeof obj == 'string' && args.unshift(this);
        this.__self.del.apply(this.__self, args);
        return this;

	},

    /**
     * Удаляет блок
     */
    destruct : function() {}

}, /** @lends BEM */{

    _name : 'i-bem',

    /**
     * Хранилище деклараций блоков (хэш по имени блока)
     * @static
     * @protected
     * @type Object
     */
    blocks : blocks,

    /**
     * Декларатор блоков, создает класс блока
     * @static
     * @protected
     * @param {String|Object} decl имя блока (простой синтаксис) или описание
     * @param {String} decl.block|decl.name имя блока
     * @param {String} [decl.baseBlock] имя родительского блока
     * @param {String} [decl.modName] имя модификатора
     * @param {String} [decl.modVal] значение модификатора
     * @param {Object} [props] методы
     * @param {Object} [staticProps] статические методы
     */
    decl : function(decl, props, staticProps) {

        if(typeof decl == 'string')
            decl = { block : decl };
        else if(decl.name) {
            decl.block = decl.name;
        }

        if(decl.baseBlock && !blocks[decl.baseBlock])
            throw('baseBlock "' + decl.baseBlock + '" for "' + decl.block + '" is undefined');

        props || (props = {});

        if(props.onSetMod) {
            modFnsToProps(props.onSetMod, props);
            delete props.onSetMod;
        }

        if(props.onElemSetMod) {
            $.each(props.onElemSetMod, function(elemName, modFns) {
                modFnsToProps(modFns, props, elemName);
            });
            delete props.onElemSetMod;
        }

        var baseBlock = blocks[decl.baseBlock || decl.block] || this;

        if(decl.modName) {
            var checkMod = buildCheckMod(decl.modName, decl.modVal);
            $.each(props, function(name, prop) {
                $.isFunction(prop) &&
                    (props[name] = function() {
                        var method;
                        if(checkMod(this)) {
                            method = prop;
                        } else {
                            var baseMethod = baseBlock.prototype[name];
                            baseMethod && baseMethod !== props[name] &&
                                (method = this.__base);
                        }
                        return method?
                            method.apply(this, arguments) :
                            undefined;
                    });
            });
        }

        var block;
        decl.block == baseBlock._name?
            // делаем новый live в том случае, если уже запускался старый
            (block = $.inheritSelf(baseBlock, props, staticProps))._processLive(true) :
            (block = blocks[decl.block] = $.inherit(baseBlock, props, staticProps))._name = decl.block;

        return block;

    },

    /**
     * Осуществляет обработку live-свойств блока
     * @private
     * @param {Boolean} [heedLive=false] нужно ли учитывать то, что блок обрабатывал уже свои live-свойства
     * @returns {Boolean} является ли блок live-блоком
     */
    _processLive : function(heedLive) {

        return false;

    },

    /**
     * Фабричный метод для создания экземпляра блока по имени
     * @static
     * @param {String|Object} block имя блока или описание
     * @param {Object} [params] параметры блока
     * @returns {BEM}
     */
    create : function(block, params) {

        typeof block == 'string' && (block = { block : block });

        return new blocks[block.block](block.mods, params);

    },

    /**
     * Возвращает имя текущего блока
     * @static
     * @protected
     * @returns {String}
     */
    getName : function() {

        return this._name;

    },

    /**
     * Извлекает имя вложенного в блок элемента
     * @static
     * @private
     * @param {Object} elem вложенный элемент
     * @returns {String|undefined}
     */
    _extractElemNameFrom : function(elem) {},

    /**
     * Добавляет функцию в очередь для запуска после "текущего события"
     * @static
     * @protected
     * @param {Function} fn
     * @param {Object} ctx
     */
    afterCurrentEvent : function(fn, ctx) {

        afterCurrentEventFns.push({ fn : fn, ctx : ctx }) == 1 &&
            setTimeout(this._runAfterCurrentEventFns, 0);

    },

    /**
     * Запускает очерель
     * @private
     */
    _runAfterCurrentEventFns : function() {

        var fnsLen = afterCurrentEventFns.length;
        if(fnsLen) {
            var fnObj,
                fnsCopy = afterCurrentEventFns.splice(0, fnsLen);

            while(fnObj = fnsCopy.shift()) fnObj.fn.call(fnObj.ctx || this);
        }

    },

    /**
     * Изменяет контекст передаваемой функции
     * @protected
     * @param {Function} fn
     * @param {Object} ctx контекст
     * @returns {Function} функция с измененным контекстом
     */
    changeThis : function(fn, ctx) {

        return fn.bind(ctx || this);

    },

    /**
     * Хелпер для очистки свойств
     * @param {Object} [obj=this]
     */
    del : function(obj) {

        var delInThis = typeof obj == 'string',
            i = delInThis? 0 : 1,
            len = arguments.length;
        delInThis && (obj = this);

        while(i < len) delete obj[arguments[i++]];

        return this;

	},

    /**
     * Возвращает/уничтожает именованный канал сообщений
     * @param {String} [id='default'] идентификатор канала
     * @param {Boolean} [drop=false] уничтожить канал
     * @returns {$.observable|undefined} канал сообщений
     */
    channel : function(id, drop) {

        if(typeof id == 'boolean') {
            drop = id;
            id = undefined;
        }

        id || (id = 'default');

        if(drop) {
            if(channels[id]) {
                channels[id].un();
                delete channels[id];
            }
            return;
        }

        return channels[id] || (channels[id] = new $.observable());

    }

});

})(jQuery);

(function() {

/**
 * Возвращает массив свойств объекта
 * @param {Object} obj объект
 * @returns {Array}
 */
Object.keys || (Object.keys = function(obj) {
    var res = [];

    for(var i in obj) obj.hasOwnProperty(i) &&
        res.push(i);

    return res;
});

})();
(function() {

var ptp = Array.prototype,
    toStr = Object.prototype.toString,
    methods = {

        /**
         * Находит индекс элемента в массиве
         * @param {Object} item
         * @param {Number} [fromIdx] начиная с индекса (length - 1 - fromIdx, если fromIdx < 0)
         * @returns {Number} индекс элемента или -1, если не найдено
         */
        indexOf : function(item, fromIdx) {

            fromIdx = +(fromIdx || 0);

            var t = this, len = t.length;

            if(len > 0 && fromIdx < len) {
                fromIdx = fromIdx < 0? Math.ceil(fromIdx) : Math.floor(fromIdx);
                fromIdx < -len && (fromIdx = 0);
                fromIdx < 0 && (fromIdx = fromIdx + len);

                while(fromIdx < len) {
                    if(fromIdx in t && t[fromIdx] === item)
                        return fromIdx;
                    ++fromIdx;
                }
            }

            return -1;

        },

        /**
         * Вызывает callback для каждого элемента
         * @param {Function} callback вызывается для каждого элемента
         * @param {Object} [ctx=null] контекст для callback
         */
        forEach : function(callback, ctx) {

            var i = -1, t = this, len = t.length;
            while(++i < len) i in t &&
                (ctx? callback.call(ctx, t[i], i, t) : callback(t[i], i, t));

        },

        /**
         * Создает массив B из массива A, такой что B[i] = callback(A[i])
         * @param {Function} callback вызывается для каждого элемента
         * @param {Object} [ctx=null] контекст для callback
         * @returns {Array}
         */
        map : function(callback, ctx) {

            var i = -1, t = this, len = t.length,
                res = new Array(len);

            while(++i < len) i in t &&
                (res[i] = ctx? callback.call(ctx, t[i], i, t) : callback(t[i], i, t));

            return res;

        },

        /**
         * Создает массив, содержащий только те элементы из исходного массива, для которых callback возвращает true.
         * @param {Function} callback вызывается для каждого элемента
         * @param {Object} [ctx] контекст для callback
         * @returns {Array}
         */
        filter : function(callback, ctx) {

            var i = -1, t = this, len = t.length,
                res = [];

            while(++i < len) i in t &&
                (ctx? callback.call(ctx, t[i], i, t) : callback(t[i], i, t)) && res.push(t[i]);

            return res;

        },

        /**
         * Свертывает массив, используя аккумулятор
         * @param {Function} callback вызывается для каждого элемента
         * @param {Object} [initialVal] начальное значение аккумулятора
         * @returns {Object} аккумулятор
         */
        reduce : function(callback, initialVal) {

            var i = -1, t = this, len = t.length,
                res;

            if(arguments.length < 2) {
                while(++i < len) {
                    if(i in t) {
                        res = t[i];
                        break;
                    }
                }
            }
            else {
                res = initialVal;
            }

            while(++i < len) i in t &&
                (res = callback(res, t[i], i, t));

            return res;

        },

        /**
         * Проверяет, удовлетворяет ли хотя бы один элемент массива условию в callback
         * @param {Function} callback
         * @param {Object} [ctx=this] контекст callback
         * @returns {Boolean}
         */
        some : function(callback, ctx) {

            var i = -1, t = this, len = t.length;

            while(++i < len)
                if(i in t && (ctx ? callback.call(ctx, t[i], i, t) : callback(t[i], i, t)))
                    return true;

            return false;

        },

        /**
         * Проверяет, удовлетворяет ли каждый элемент массива условию в callback
         * @param {Function} callback
         * @param {Object} [ctx=this] контекст вызова callback
         * @returns {Boolean}
         */
        every : function(callback, ctx) {

            var i = -1, t = this, len = t.length;

            while(++i < len)
                if(i in t && !(ctx ? callback.call(ctx, t[i], i, t) : callback(t[i], i, t)))
                    return false;

            return true;

        }

    };

for(var name in methods)
    ptp[name] || (ptp[name] = methods[name]);

Array.isArray || (Array.isArray = function(obj) {
    return toStr.call(obj) === '[object Array]';
});

})();

(function() {

var slice = Array.prototype.slice;

Function.prototype.bind || (Function.prototype.bind = function(ctx) {

    var fn = this,
        args = slice.call(arguments, 1);

    return function () {
        return fn.apply(ctx, args.concat(slice.call(arguments)));
    }

});

})();
/** @fileOverview модуль для внутренних BEM-хелперов */
/** @requires BEM */

(function(BEM, $, undefined) {

/**
 * Разделитель для модификаторов и их значений
 * @const
 * @type String
 */
var MOD_DELIM = '_',

/**
 * Разделитель между именами блока и вложенного элемента
 * @const
 * @type String
 */
    ELEM_DELIM = '__',

/**
 * Паттерн для допустимых имен элементов и модификаторов
 * @const
 * @type String
 */
    NAME_PATTERN = '[a-zA-Z0-9-]+';

function buildModPostfix(modName, modVal, buffer) {

    buffer.push(MOD_DELIM, modName, MOD_DELIM, modVal);

}

function buildBlockClass(name, modName, modVal, buffer) {

    buffer.push(name);
    modVal && buildModPostfix(modName, modVal, buffer);

}

function buildElemClass(block, name, modName, modVal, buffer) {

    buildBlockClass(block, undefined, undefined, buffer);
    buffer.push(ELEM_DELIM, name);
    modVal && buildModPostfix(modName, modVal, buffer);

}

BEM.INTERNAL = {

    NAME_PATTERN : NAME_PATTERN,

    MOD_DELIM : MOD_DELIM,
    ELEM_DELIM : ELEM_DELIM,

    buildModPostfix : function(modName, modVal, buffer) {

        var res = buffer || [];
        buildModPostfix(modName, modVal, res);
        return buffer? res : res.join('');

    },

    /**
     * Строит класс блока или элемента с учетом модификатора
     * @private
     * @param {String} block имя блока
     * @param {String} [elem] имя элемента
     * @param {String} [modName] имя модификатора
     * @param {String} [modVal] значение модификатора
     * @param {Array} [buffer] буфер
     * @returns {String|Array} строка класса или буфер (в зависимости от наличия параметра buffer)
     */
    buildClass : function(block, elem, modName, modVal, buffer) {

        var typeOf = typeof modName;
        if(typeOf == 'string') {
            if(typeof modVal != 'string') {
                buffer = modVal;
                modVal = modName;
                modName = elem;
                elem = undefined;
            }
        } else if(typeOf != 'undefined') {
            buffer = modName;
            modName = undefined;
        } else if(elem && typeof elem != 'string') {
            buffer = elem;
            elem = undefined;
        }

        if(!(elem || modName || buffer)) { // оптимизация для самого простого случая
            return block;
        }

        var res = buffer || [];

        elem?
            buildElemClass(block, elem, modName, modVal, res) :
            buildBlockClass(block, modName, modVal, res);

        return buffer? res : res.join('');

    },

    /**
     * Строит полные классы блока или элемента с учетом модификаторов
     * @private
     * @param {String} block имя блока
     * @param {String} [elem] имя элемента
     * @param {Object} [mods] модификаторы
     * @param {Array} [buffer] буфер
     * @returns {String|Array} строка класса или буфер (в зависимости от наличия параметра buffer)
     */
    buildClasses : function(block, elem, mods, buffer) {

        if(elem && typeof elem != 'string') {
            buffer = mods;
            mods = elem;
            elem = undefined;
        }

        var res = buffer || [];

        elem?
            buildElemClass(block, elem, undefined, undefined, res) :
            buildBlockClass(block, undefined, undefined, res);

        mods && $.each(mods, function(modName, modVal) {
            if(modVal) {
                res.push(' ');
                elem?
                    buildElemClass(block, elem, modName, modVal, res) :
                    buildBlockClass(block, modName, modVal, res);
            }
        });

        return buffer? res : res.join('');

        /*var typeOf = typeof elem;
        if(typeOf != 'string' && typeOf != 'undefined') {
            buffer = mods;
            mods = elem;
            elem = undefined;
        }
        if($.isArray(mods)) {
            buffer = mods;
            mods = undefined;
        }

        var res = buffer || [];
        buildClasses(block, elem, mods, res);
        return buffer? res : res.join('');*/

    }

}

})(BEM, jQuery);
/** @requires BEM */
/** @requires BEM.INTERNAL */
/** @requires jquery.stringify */

(function(BEM, $, undefined) {

var INTERNAL = BEM.INTERNAL,
    ELEM_DELIM = INTERNAL.ELEM_DELIM,
    SHORT_TAGS = { // хэш для быстрого определения, является ли тэг коротким
        area : 1, base : 1, br : 1, col : 1, command : 1, embed : 1, hr : 1, img : 1,
        input : 1, keygen : 1, link : 1, meta : 1, param : 1, source : 1, wbr : 1 },
    buildClass = INTERNAL.buildClass,
    buildClasses = INTERNAL.buildClasses,
    decls = {};

function addPropToDecl(decl, name, fn) {

    (decl[name] || (decl[name] = [])).unshift(fn);

}

function buildDeclFn(fn, desc) {

    return desc.modName?
        function(ctx) {
            (ctx._curBlock.mods || {})[desc.modName] === desc.modVal && fn(ctx);
        } :
        fn;

}

function join(a, b) {

    var isArrayB = $.isArray(b),
        res;

    $.isArray(a)?
        isArrayB? res = a.concat(b) : (res = a).push(b) :
        isArrayB? (res = b).unshift(a) : res = [a, b];

    return res;

}

var attrEscapes = { '\'' : '\\\'', '"': '\'', '&': '&amp;', '<': '&lt;', '>': '&gt;' },
    attrEscapesRE = /['"&<>]/g;
function escapeAttr(attrVal) {
    return attrVal.replace(attrEscapesRE, function(needToEscape) {
        return attrEscapes[needToEscape];
    });
}

/**
 * @namespace
 * @name BEM.HTML
 */
BEM.HTML = {

    /**
     * Декларация
     * @protected
     * @param {String|Object} decl имя блока (простой синтаксис) или описание
     * @param {String} decl.block имя блока
     * @param {String} [decl.modName] имя модификатора
     * @param {String} [decl.modVal] значение модификатора
     * @param {Object} props свойства
     */
    decl : function(desc, props) {

        typeof desc == 'string' && (desc = { block : desc });
        desc.name && (desc.block = desc.name);

        var decl = decls[desc.block] || (decls[desc.block] = {});

        props.onBlock && addPropToDecl(decl, '_block', buildDeclFn(props.onBlock, desc));

        if(props.onElem) {
            $.isFunction(props.onElem)?
                addPropToDecl(decl, '_elem', buildDeclFn(props.onElem, desc)) :
                $.each(props.onElem, function(elem, fn) {
                    addPropToDecl(decl, '_elem' + (elem === '*'? '' : ELEM_DELIM + elem), buildDeclFn(fn, desc));
                });
        }

    },

    /**
     * Строит HTML-представление
     * @param {Object|Array} params JSON-описание
     */
    build : function(params) {

        var builder = new this.Ctx(params);
        builder._buildAll();
        return builder._flush();

    },

    Ctx : $.inherit(/** @lends BEM.HTML.Ctx.prototype */{
        /**
         * @class Внутренний класс контекста билдера HTML-представления
         * @constructs
         * @param {Object|Array|String} params параметры
         */
        __constructor : function(params) {

            /**
             * буфер
             * @private
             * @type Array
             */
            this._buffer = [];

            /**
             * текущие параметры
             * @private
             * @type Object
             */
            this._params = params;

            /**
             * туннелированные параметры
             * @private
             * @type Object
             */
            this._tParams = null;

            this._tParamsChanges = null;

            /**
             * имя текущего блока
             * @private
             * @type String
             */
            this._curBlock = undefined;

        },

        /**
         * Возвращает позицию контекста
         * @returns {Number}
         */
        pos : function() {

            return this._params._pos;

        },

        /**
         * Проверяет, является ли текущий контекст первым
         * @returns {Boolean}
         */
        isFirst : function() {

            return this._params._pos === 1;

        },

        /**
         * Проверяет, является ли текущий контекст последним
         * @returns {Boolean}
         */
        isLast : function() {

            var params = this._params;
            return params._pos === params._siblingsCount;

        },

        /**
         * Возвращает/устанавливает параметры контекста
         * @param {Object} [params] параметры
         */
        params : function(params) {

            var _this = this;
            if(typeof params == 'undefined') return _this._params;

            _this._params = params;
            return _this;

        },

        /**
         * Возвращает/устанавливает один параметр контекста
         * @param {String} name имя параметра
         * @param {String} [val] значение параметра
         * @param {Boolean} [force=false] установить параметр независимо от его наличия в контексте
         * @param {Boolean} [needExtend=false] расширять параметр
         */
        param : function(name, val, force, needExtend) {

            var _this = this,
                params = _this._params;

            if(typeof val == 'undefined') return params[name];

            if(force || !(name in params)) {
                params[name] = val;
            } else if(needExtend) {
                params[name] = $.extend(val, params[name]);
            }

            return _this;

        },

        /**
         * Возвращает/устанавливает html-атрибуты контекста (шорткат к params('attrs', val))
         * @param {Object} [val] хэш атрибутов
         * @param {Boolean} [force=false]
         */
        attrs : function(val, force) {

            return this.param('attrs', val, force, true);

        },

        /**
         * Возвращает/устанавливает один html-атрибут контекста
         * @param {String} name имя атрибута
         * @param {String} [val] значение атрибута
         * @param {Boolean} [force=false]
         */
        attr : function(name, val, force) {

            var _this = this;
            if(typeof val == 'undefined') return (_this._params.attrs || {})[name];

            var attrs = _this._params.attrs;
            attrs?
                (force || !(name in attrs)) && (attrs[name] = val) :
                (_this._params.attrs = {})[name] = val;

            return _this;

        },

        /**
         * Возвращает/устанавливает имя html-тэга контекста (шорткат к params('tag', val))
         * @param {String} [val] тэг
         * @param {Boolean} [force=false]
         */
        tag : function(val, force) {

            return this.param('tag', val, force);

        },

        /**
         * Возвращает/устанавливает дополнительные CSS-классы контекста (шорткат к params('cls', val))
         * @param {String} [val] CSS-класс
         * @param {Boolean} [force=false]
         */
        cls : function(val, force) {

            return this.param('cls', val, force);

        },

        /**
         * Возвращает/устанавливает модификаторы контекста (шорткат к params('mods', val))
         * @param {Object} [val] хэш модификаторов
         * @param {Boolean} [force=false]
         */
        mods : function(val, force) {

            return this.param('mods', val, force, true);

        },

        /**
         * Возвращает/устанавливает один модификатор контекста
         * @param {String} name имя модификатора
         * @param {String} [val] значение модификатора
         * @param {Boolean} [force=false]
         */
        mod : function(name, val, force) {

            var _this = this;
            if(typeof val == 'undefined') return (_this._params.mods || {})[name];

            var mods = _this._params.mods;
            mods?
                (force || !(name in mods)) && (mods[name] = val) :
                (_this._params.mods = {})[name] = val;

            return _this;

        },

        /**
         * Возвращает/добавляет/устанавливает миксы
         * @param {Array} [val] миксы
         * @param {Boolean} [force=false]
         */
        mix : function(val, force) {

            var _this = this,
                params = _this._params;

            if(typeof val == 'undefined') return params.mix;

            if(force || !('mix' in params)) {
                params.mix = val;
            } else {
                params.mix = params.mix.concat(val);
            }

            return _this;

        },

        /**
         * Возвращает/устанавливает js-параметры контекста (шорткат к params('js', val))
         * @param {Boolean|Object} [val] параметры
         */
        js : function(val) {

            return this.param('js', val);

        },

        /**
         * Возвращает/устанавливает контент контекста (шорткат к params('content', val))
         * @param {String|Object|Array} [val] контент
         * @param {Boolean} [force=false] установить контент независимо от его наличия
         */
        content : function(val, force) {

            return this.param('content', val, force);

        },

        /**
         * Оборачивает контент контекста (например, другим элементом)
         * @param {Object} obj
         */
        wrapContent : function(obj) {

            var _this = this,
                params = _this._params;

            obj.content = params.content;
            params.content = obj;

            return _this;

        },

        /**
         * Добавляет контент перед контентом контекста (например, еще один элемент)
         * @param {Object|Array} obj
         */
        beforeContent : function(obj) {

            var _this = this,
                params = _this._params;

            params.content = join(obj, params.content);

            return _this;

        },

        /**
         * Добавляет контент после контента контекста (например, еще один элемент)
         * @param {Object|Array} obj
         */
        afterContent : function(obj) {

            var _this = this,
                params = _this._params;

            params.content = join(params.content, obj);

            return _this;

        },

        /**
         * Оборачивает контекста (например, другим элементом или блоком)
         * @param {Object} obj
         */
        wrap : function(obj) {

            var _this = this,
                params = _this._params;

            obj.block || (obj._curBlock = _this._curBlock);
            obj.content = params._wrapper? params._wrapper : params;
            params._wrapper = obj;

            return _this;

        },

        /**
         * Возвращает/устанавливает один туннелированный параметр контекста
         * @param {String} name имя параметра
         * @param {String} [val] значение параметра
         */
        tParam : function(name, val) {

            var _this = this,
                tParams = _this._tParams || (_this._tParams = {});

            if(typeof val == 'undefined') return tParams[name];

            var tParamsChanges = _this._tParamsChanges || (_this._tParamsChanges = {});

            name in tParamsChanges || (tParamsChanges[name] = tParams[name]);

            tParams[name] = val;

            return _this;

        },

        /**
         * Генерирует уникальный идентификатор
         * returns {String}
         */
        generateId : function() {

            return $.identify();

        },

        /**
         * Останавливает применение более базовых шаблонов
         */
        stop : function() {

            this._params._isStopped = true;

        },

        /**
         * Выполняет одну итерацию билда в зависимости от типа контекста
         * @private
         */
        _buildAll : function() {

            var _this = this,
                buffer = _this._buffer,
                params = _this._params,
                paramsType = typeof params;

            if(paramsType == 'string' || paramsType == 'number') {
                buffer.push(params);
            } else if($.isArray(params)) {
                var i = 0, len = params.length, currParams, currParamsType;
                while(i < len) {
                     _this._params = currParams = params[i++];
                    currParamsType = typeof currParams;
                    if(currParamsType == 'string' || currParamsType == 'number') {
                        buffer.push(currParams);
                    } else if(currParams) {
                        currParams._pos = i;
                        currParams._siblingsCount = len;
                        _this._buildByDecl();
                    }
                }
            } else if(params) {
                _this._params._pos = _this._params._siblingsCount = 1;
                _this._buildByDecl();
            }

        },

        /**
         * Дефолтный билд
         * @private
         */
        _build : function() {

            var _this = this,
                buffer = _this._buffer,
                params = _this._params,
                tag = params.tag || 'div',
                jsParams,
                isBEM = params.block || params.elem,
                curBlock = isBEM && (params.block || _this._curBlock.block),
                addInitingCls = false;

            if(params.js) {
                (jsParams = {})[buildClass(curBlock, params.elem)] = params.js === true? {} : params.js;
                addInitingCls = !params.elem;
            }

            buffer.push('<', tag);

            if(isBEM || params.cls) {
                buffer.push(' class="');
                if(isBEM) {
                    buildClasses(curBlock, params.elem, params.mods, buffer);
                    params.mix && $.each(params.mix, function(i, mix) {
                        if(mix) {
                            buffer.push(' ');
                            buildClasses(mix.block, mix.elem, mix.mods, buffer);
                            if(mix.js) {
                                (jsParams || (jsParams = {}))[buildClass(mix.block, mix.elem)] = mix.js === true? {} : mix.js;
                                addInitingCls || (addInitingCls = !mix.elem);
                            }
                        }
                    });
                }

                params.cls && buffer.push(isBEM? ' ' : '', params.cls);

                addInitingCls && buffer.push(' i-bem');
                buffer.push('"');
            }

            jsParams && buffer.push(
                ' onclick="return ',
                escapeAttr(JSON.stringify(jsParams)),
                '"');

            params.attrs && $.each(params.attrs, function(name, val) {
                typeof val != 'undefined' && val !== null && val !== false && buffer.push(
                    ' ',
                    name,
                    '="',
                    val.toString().replace(/"/g, "&quot;"),
                    '"');
            });

            if(SHORT_TAGS[tag]) {
                buffer.push('/>');
            } else {
                buffer.push('>');

                if(typeof params.content != 'undefined') {
                    _this._params = params.content;
                    _this._buildAll();
                }

                buffer.push('</', tag, '>');
            }

        },

        /**
         * Очищает буфер и возвращает его содержимое
         * @private
         * @returns {String} содержимое буфера
         */
        _flush : function() {

            var res = this._buffer.join('');
            delete this._buffer;
            return res;

        },

        _buildByDecl : function() {

            var _this = this,
                currBlock = _this._curBlock,
                params = _this._params;

            params._curBlock && (_this._curBlock = params._curBlock);
            params.block && (_this._curBlock = params);

            if(!params._wrapper) {
                if(params.block || params.elem) {
                    var decl = decls[_this._curBlock.block];
                    if(decl) {
                        var fns;
                        if(params.elem) {
                            fns = decl['_elem' + ELEM_DELIM + params.elem];
                            decl._elem && (fns = (fns? fns.concat(decl._elem) : decl._elem));
                        } else {
                            fns = decl._block;
                        }

                        if(fns) {
                            var i = 0, fn;
                            while(fn = fns[i++]) {
                                fn(_this);
                                if(params._isStopped) break;
                            }
                        }
                    }
                }

                if(params._wrapper) {
                    params._curBlock = _this._curBlock;
                    _this._params = params._wrapper;
                    return _this._buildAll();
                }
            }

            var tParamsChanges = _this._tParamsChanges;
                _this._tParamsChanges = null;

            _this._build();

            _this._curBlock = currBlock;

            if(tParamsChanges) {
                var tParams = _this._tParams;
                $.each(tParamsChanges, function(name, val) {
                    typeof val == 'undefined'?
                        delete tParams[name] :
                        tParams[name] = val;
                });
            }

        }

    })

};

})(BEM, jQuery);

(function(undefined) {

if(window.JSON) return;

var _toString = Object.prototype.toString,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    meta = {
        '\b' : '\\b',
        '\t' : '\\t',
        '\n' : '\\n',
        '\f' : '\\f',
        '\r' : '\\r',
        '"'  : '\\"',
        '\\' : '\\\\'
    },
    stringify;

window.JSON = {
    stringify : stringify = function(val) {
        if(val === null) {
            return 'null';
        }
        if(typeof val === 'undefined') {
            return undefined;
        }
        switch(_toString.call(val)) {
            case '[object String]':
                return '"' +
                    (escapable.test(val)?
                        val.replace(escapable, function(a) {
                            var c = meta[a];
                            return typeof c === 'string'? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                        }) :
                        val) +
                    '"';
            case '[object Number]':
            case '[object Boolean]':
                return '' + val;
            case '[object Array]':
                var res = '[', i = 0, len = val.length, strVal;
                while(i < len) {
                    strVal = stringify(val[i]);
                    res += (i++? ',' : '') + (typeof strVal === 'undefined'? 'null' : strVal);
                }
                return res + ']';
            case '[object Object]':
                var res = '{', i = 0, strVal;
                for(var key in val) {
                    if(val.hasOwnProperty(key)) {
                        strVal = stringify(val[key]);
                        typeof strVal !== 'undefined' && (res += (i++? ',' : '') + '"' + key + '":' + strVal);
                    }
                }
                return res + '}';
            default:
                return undefined;
        }
    }
};
})();

/** @requires BEM */
/** @requires BEM.INTERNAL */

(function(BEM, $, undefined) {

var win = $(window),
    doc = $(document),

/**
 * Хранилище для DOM-элементов по уникальному ключу
 * @private
 * @type Object
 */
    uniqIdToDomElems = {},

/**
 * Хранилище для блоков по уникальному ключу
 * @static
 * @private
 * @type Object
 */
    uniqIdToBlock = {},

/**
 * Хранилище для параметров блоков
 * @private
 * @type Object
 */
    domElemToParams = {},

/**
 * Хранилище для обработчиков liveCtx-событий
 * @private
 * @type Object
 */
    liveEventCtxStorage = {},

/**
 * Хранилище для обработчиков liveClass-событий
 * @private
 * @type Object
 */
    liveClassEventStorage = {},

    blocks = BEM.blocks,

    INTERNAL = BEM.INTERNAL,

    NAME_PATTERN = INTERNAL.NAME_PATTERN,

    MOD_DELIM = INTERNAL.MOD_DELIM,
    ELEM_DELIM = INTERNAL.ELEM_DELIM,

    buildModPostfix = INTERNAL.buildModPostfix,
    buildClass = INTERNAL.buildClass;

/**
 * Инициализирует блоки на DOM-элементе
 * @private
 * @param {jQuery} domElem DOM-элемент
 * @param {String} uniqInitId идентификатор "волны инициализации"
 */
function init(domElem, uniqInitId) {

    var domNode = domElem[0];
    $.each(getParams(domNode), function(blockName, params) {
        processParams(params, domNode, blockName, uniqInitId);
        var block = uniqIdToBlock[params.uniqId];
        if(block) {
            if(block.domElem.index(domNode) < 0) {
                block.domElem = block.domElem.add(domElem);
                $.extend(block._params, params);
            }
        } else {
            initBlock(blockName, domElem, params);
        }
    });

}

/**
 * Инициализирует конкретный блок на DOM-элементе или возвращает существующий блок, если он уже был создан
 * @private
 * @param {String} blockName имя блока
 * @param {jQuery} domElem DOM-элемент
 * @param {Object} [params] параметры инициализации
 * @param {Boolean} [forceLive] форсировать возможность live-инициализации
 * @param {Function} [callback] обработчик, вызываемый после полной инициализации
 */
function initBlock(blockName, domElem, params, forceLive, callback) {

    if(typeof params == 'boolean') {
        callback = forceLive;
        forceLive = params;
        params = undefined;
    }

    var domNode = domElem[0];
    params = processParams(params || getParams(domNode)[blockName], domNode, blockName);

    var uniqId = params.uniqId;
    if(uniqIdToBlock[uniqId]) {
        return uniqIdToBlock[uniqId]._init();
    }

    uniqIdToDomElems[uniqId] = uniqIdToDomElems[uniqId]?
        uniqIdToDomElems[uniqId].add(domElem) :
        domElem;

    var parentDomNode = domNode.parentNode;
    if(!parentDomNode || parentDomNode.nodeType === 11) { // jquery doesn't unique disconnected node
        $.unique(uniqIdToDomElems[uniqId]);
    }

    var blockClass = blocks[blockName] || DOM.decl(blockName, {}, { live : true });
    if(!(blockClass._liveInitable = !!blockClass._processLive()) || forceLive || params.live === false) {
        var block = new blockClass(uniqIdToDomElems[uniqId], params, !!forceLive);
        delete uniqIdToDomElems[uniqId];
        callback && callback.apply(block, Array.prototype.slice.call(arguments, 4));
        return block;
    }

}

/**
 * Обрабатывает и добавляет необходимые параметры блока
 * @private
 * @param {Object} params параметры инициализации
 * @param {HTMLElement} domNode DOM-нода
 * @param {String} blockName имя блока
 * @param {String} [uniqInitId] идентификатор "волны инициализации"
 */
function processParams(params, domNode, blockName, uniqInitId) {

    (params || (params = {})).uniqId ||
        (params.uniqId = (params.id? blockName + '-id-' + params.id : $.identify()) + (uniqInitId || $.identify()));

    var domUniqId = $.identify(domNode),
        domParams = domElemToParams[domUniqId] || (domElemToParams[domUniqId] = {});

    domParams[blockName] || (domParams[blockName] = params);

    return params;

}

/**
 * Хелпер для поиска DOM-элемента по селектору внутри контекста, включая сам контекст
 * @private
 * @param {jQuery} ctx контекст
 * @param {String} selector CSS-селектор
 * @param {Boolean} [excludeSelf=false] исключить контекст из поиска
 * @returns {jQuery}
 */
function findDomElem(ctx, selector, excludeSelf) {

    var res = ctx.find(selector);
    return excludeSelf?
       res :
       res.add(ctx.filter(selector));

}

/**
 * Возвращает параметры DOM-элемента блока
 * @private
 * @param {HTMLElement} domNode DOM-нода
 * @returns {Object}
 */
function getParams(domNode) {

    var uniqId = $.identify(domNode);
    return domElemToParams[uniqId] ||
           (domElemToParams[uniqId] = extractParams(domNode));

}

/**
 * Извлекает параметры блока из DOM-элемента
 * @private
 * @param {HTMLElement} domNode DOM-нода
 * @returns {Object}
 */
function extractParams(domNode) {

    var fn = domNode.onclick || domNode.ondblclick;
    if(!fn && domNode.tagName.toLowerCase() == 'body') { // LEGO-2027 в FF onclick не работает на body
        var elem = $(domNode),
            attr = elem.attr('onclick') || elem.attr('ondblclick');
        attr && (fn = Function(attr));
    }
    return fn? fn() : {};

}

/**
 * Очищает все BEM-хранилища, связанные с DOM-нодой
 * @private
 * @param {HTMLElement} domNode DOM-нода
 */
function cleanupDomNode(domNode) {

    delete domElemToParams[$.identify(domNode)];

}

/**
 * Отцепляет DOM-ноду от блока, если нода последняя -- уничтожает блок
 * @private
 * @param {BEM.DOM} block блок
 * @param {HTMLElement} domNode DOM-нода
 */
function removeDomNodeFromBlock(block, domNode) {

    block.domElem.length === 1?
        block.destruct(true) :
        block.domElem = block.domElem.not(domNode);

}

/**
 * Возвращает DOM-ноду для вычислений размера окна в IE
 * @returns {HTMLElement}
 */
function getClientNode() {

    return doc[0][$.support.boxModel? 'documentElement' : 'body'];

}

/**
 * Возвращает и, при необходимости, инициализирует блок на DOM-элементе
 * @param {String} blockName имя блока
 * @param {Object} params параметры блока
 * @returns {BEM}
 */
$.fn.bem = function(blockName, params) {
    return initBlock(blockName, this, params, true);
};

/**
 * @namespace
 * @name BEM.DOM
 */
var DOM = BEM.DOM = BEM.decl('i-bem__dom',/** @lends BEM.DOM.prototype */{
    /**
     * @class Базовый блок для создания bem-блоков, имеющих DOM-представление
     * @constructs
     * @private
     * @param {jQuery} domElem DOM-элемент, на котором создается блок
     * @param {Object} params параметры блока
     * @param {Boolean} [initImmediately=true]
     */
    __constructor : function(domElem, params, initImmediately) {

        var _this = this;

        /**
         * DOM-элементы блока
         * @protected
         * @type jQuery
         */
        _this.domElem = domElem;

        /**
         * кэш для имен событий на DOM-элементах
         * @private
         * @type Object
         */
        _this._eventNameCache = {};

        /**
         * кэш для элементов
         * @private
         * @type Object
         */
        _this._elemCache = {};

        /**
         * уникальный идентификатор блока
         * @private
         * @type String
         */
        uniqIdToBlock[_this._uniqId = params.uniqId || $.identify(_this)] = _this;

        /**
         * флаг необходимости unbind от document и window при уничтожении блока
         * @private
         * @type Boolean
         */
        _this._needSpecialUnbind = false;

        _this.__base(null, params, initImmediately);

    },

    /**
     * Находит блоки внутри (включая контекст) текущего блока или его элементов
     * @protected
     * @param {String|jQuery} [elem] элемент блока
     * @param {String|Object} block имя или описание (block,modName,modVal) искомого блока
     * @returns {BEM[]}
     */
    findBlocksInside : function(elem, block) {

        return this._findBlocks('find', elem, block);

    },

    /**
     * Находит первый блок внутри (включая контекст) текущего блока или его элементов
     * @protected
     * @param {String|jQuery} [elem] элемент блока
     * @param {String|Object} block имя или описание (block,modName,modVal) искомого блока
     * @returns {BEM}
     */
    findBlockInside : function(elem, block) {

        return this._findBlocks('find', elem, block, true);

    },

    /**
     * Находит блоки снаружи (включая контекст) текущего блока или его элементов
     * @protected
     * @param {String|jQuery} [elem] элемент блока
     * @param {String|Object} block имя или описание (block,modName,modVal) искомого блока
     * @returns {BEM[]}
     */
    findBlocksOutside : function(elem, block) {

        return this._findBlocks('parents', elem, block);

    },

    /**
     * Находит первый блок снаружи (включая контекст) текущего блока или его элементов
     * @protected
     * @param {String|jQuery} [elem] элемент блока
     * @param {String|Object} block имя или описание (block,modName,modVal) искомого блока
     * @returns {BEM}
     */
    findBlockOutside : function(elem, block) {

        return this._findBlocks('closest', elem, block)[0] || null;

    },

    /**
     * Находит блоки на DOM-элементах текущего блока или его элементов
     * @protected
     * @param {String|jQuery} [elem] элемент блока
     * @param {String|Object} block имя или описание (block,modName,modVal) искомого блока
     * @returns {BEM[]}
     */
    findBlocksOn : function(elem, block) {

        return this._findBlocks('', elem, block);

    },

    /**
     * Находит первый блок на DOM-элементах текущего блока или его элементов
     * @protected
     * @param {String|jQuery} [elem] элемент блока
     * @param {String|Object} block имя или описание (block,modName,modVal) искомого блока
     * @returns {BEM}
     */
    findBlockOn : function(elem, block) {

        return this._findBlocks('', elem, block, true);

    },

    _findBlocks : function(select, elem, block, onlyFirst) {

        if(!block) {
            block = elem;
            elem = undefined;
        }

        var ctxElem = elem?
                (typeof elem == 'string'? this.findElem(elem) : elem) :
                this.domElem,
            isSimpleBlock = typeof block == 'string',
            blockName = isSimpleBlock? block : (block.block || block.blockName),
            selector = '.' +
                (isSimpleBlock?
                    buildClass(blockName) :
                    buildClass(blockName, block.modName, block.modVal)) +
                (onlyFirst? ':first' : ''),
            domElems = ctxElem.filter(selector);

        select && (domElems = domElems.add(ctxElem[select](selector)));

        if(onlyFirst) {
            return domElems[0]? initBlock(blockName, domElems.eq(0), true) : null;
        }

        var res = [],
            uniqIds = {};

        $.each(domElems, function(i, domElem) {
            var block = initBlock(blockName, $(domElem), true);
            if(!uniqIds[block._uniqId]) {
                uniqIds[block._uniqId] = true;
                res.push(block);
            }
        });

        return res;

    },

    /**
     * Добавляет обработчик события произвольного DOM-элемента
     * @protected
     * @param {jQuery} domElem DOM-элемент, на котором будет слушаться событие
     * @param {String|Object} event имя события или объект события
     * @param {Function} fn функция-обработчик, будет выполнена в контексте блока
     * @returns {BEM}
     */
    bindToDomElem : function(domElem, event, fn) {

        var _this = this;

        fn?
            domElem.bind(
                _this._buildEventName(event),
                function(e) {
                    (e.data || (e.data = {})).domElem = $(this);
                    return fn.apply(_this, arguments);
                }
            ) :
            $.each(event, function(event, fn) {
                _this.bindToDomElem(domElem, event, fn);
            });

        return _this;

    },

    /**
     * Добавляет обработчик события на document
     * @protected
     * @param {String} event имя события
     * @param {Function} fn функция-обработчик, будет выполнена в контексте блока
     * @returns {BEM}
     */
    bindToDoc : function(event, fn) {

        this._needSpecialUnbind = true;
        return this.bindToDomElem(doc, event, fn);

    },

    /**
     * Добавляет обработчик события на window
     * @protected
     * @param {String} event имя события
     * @param {Function} fn функция-обработчик, будет выполнена в контексте блока
     * @returns {BEM}
     */
    bindToWin : function(event, fn) {

        this._needSpecialUnbind = true;
        return this.bindToDomElem(win, event, fn);

    },

    /**
     * Добавляет обработчик события на основные DOM-элементы блока или его вложенные элементы
     * @protected
     * @param {jQuery|String} [elem] элемент
     * @param {String} event имя события
     * @param {Function} fn функция-обработчик, будет выполнена в контексте блока
     * @returns {BEM}
     */
    bindTo : function(elem, event, fn) {

        if(!event || $.isFunction(event)) { // если нет элемента
            fn = event;
            event = elem;
            elem = this.domElem;
        } else if(typeof elem == 'string') {
            elem = this.elem(elem);
        }

        return this.bindToDomElem(elem, event, fn);

    },

    /**
     * Удаляет обработчики события произвольного DOM-элемента
     * @protected
     * @param {jQuery} domElem DOM-элемент, на котором будет слушаться событие
     * @param {String} event имя события
     * @returns {BEM}
     */
    unbindFromDomElem : function(domElem, event) {

        domElem.unbind(this._buildEventName(event));
        return this;

    },

    /**
     * Удаляет обработчик события у document
     * @protected
     * @param {String} event имя события
     * @returns {BEM}
     */
    unbindFromDoc : function(event) {

        return this.unbindFromDomElem(doc, event);

    },

    /**
     * Удаляет обработчик события у document
     * @protected
     * @param {String} event имя события
     * @returns {BEM}
     */
    unbindFromWin : function(event) {

        return this.unbindFromDomElem(win, event);

    },

    /**
     * Удаляет обработчики события из основных DOM-элементы блока или его вложенных элементов
     * @protected
     * @param {jQuery|String} [elem] вложенный элемент
     * @param {String} event имя события
     * @returns {BEM}
     */
    unbindFrom : function(elem, event) {

        if(!event) {
            event = elem;
            elem = this.domElem;
        } else if(typeof elem == 'string') {
            elem = this.elem(elem);
        }

        return this.unbindFromDomElem(elem, event);

    },

    /**
     * Строит полное имя события
     * @private
     * @param {String} event имя события
     * @returns {String}
     */
    _buildEventName : function(event) {

        var _this = this;
        return event.indexOf(' ') > 1?
            event.split(' ').map(function(e) {
                return _this._buildOneEventName(e);
            }).join(' ') :
            _this._buildOneEventName(event);

    },

    /**
     * Строит полное имя для одного события
     * @private
     * @param {String} event имя события
     * @returns {String}
     */
    _buildOneEventName : function(event) {

        var _this = this,
            eventNameCache = _this._eventNameCache;

        if(event in eventNameCache) return eventNameCache[event];

        var uniq = '.' + _this._uniqId;

        if(event.indexOf('.') < 0) return eventNameCache[event] = event + uniq;

        var lego = '.bem_' + _this.__self._name;

        return eventNameCache[event] = event.split('.').map(function(e, i) {
            return i == 0? e + lego : lego + '_' + e;
        }).join('') + uniq;

    },

    /**
     * Запускает обработчики события у блока и обработчики live-событий
     * @protected
     * @param {String} e имя события
     * @param {Object} [data] дополнительные данные
     * @returns {BEM}
     */
    trigger : function(e, data) {

        this
            .__base(e = this.buildEvent(e), data)
            .domElem && this._ctxTrigger(e, data);

        return this;

    },

    _ctxTrigger : function(e, data) {

        var _this = this,
            storage = liveEventCtxStorage[_this.__self._buildCtxEventName(e.type)],
            ctxIds = {};

        storage && _this.domElem.each(function() {
            var ctx = this,
                counter = storage.counter;
            while(ctx && counter) {
                var ctxId = $.identify(ctx, true);
                if(ctxId) {
                    if(ctxIds[ctxId]) break;
                    var storageCtx = storage.ctxs[ctxId];
                    if(storageCtx) {
                        $.each(storageCtx, function(uniqId, handler) {
                            handler.fn.call(
                                handler.ctx || _this,
                                e,
                                data);
                        });
                        counter--;
                    }
                    ctxIds[ctxId] = true;
                }
                ctx = ctx.parentNode;
            }
        });

    },

    /**
     * Устанавливает модификатор у блока/вложенного элемента
     * @protected
     * @param {jQuery} [elem] вложенный элемент
     * @param {String} modName имя модификатора
     * @param {String} modVal значение модификатора
     * @returns {BEM}
     */
    setMod : function(elem, modName, modVal) {

        if(elem && typeof modVal != 'undefined' && elem.length > 1) {
            var _this = this;
            elem.each(function() {
                var item = $(this);
                item.__bemElemName = elem.__bemElemName;
                _this.setMod(item, modName, modVal);
            });
            return _this;
        }
        return this.__base(elem, modName, modVal);

    },

    /**
     * Извлекает значение модификатора из CSS-класса DOM-ноды
     * @private
     * @param {String} modName имя модификатора
     * @param {jQuery} [elem] вложенный элемент
     * @param {String} [elemName] имя вложенного элемента
     * @returns {String} значение модификатора
     */
    _extractModVal : function(modName, elem, elemName) {

        var domNode = (elem || this.domElem)[0],
            matches;

        domNode &&
            (matches = domNode.className
                .match(this.__self._buildModValRE(modName, elemName || elem)));

        return matches? matches[2] : '';

    },

    /**
     * Извлекает имя/значение списка модификаторов
     * @private
     * @param {Array} [modNames] имена модификаторов
     * @param {Object} [elem] элемент
     * @returns {Object} хэш значений модификаторов по имени
     */
    _extractMods : function(modNames, elem) {

        var res = {},
            extractAll = !modNames.length,
            countMatched = 0;

        ((elem || this.domElem)[0].className
            .match(this.__self._buildModValRE(
                '(' + (extractAll? NAME_PATTERN : modNames.join('|')) + ')',
                elem,
                'g')) || []).forEach(function(className) {
                    var iModVal = (className = className.trim()).lastIndexOf(MOD_DELIM),
                        iModName = className.substr(0, iModVal - 1).lastIndexOf(MOD_DELIM);
                    res[className.substr(iModName + 1, iModVal - iModName - 1)] = className.substr(iModVal + 1);
                    ++countMatched;
                });

        // пустые значения модификаторов не отражены в классах, нужно их заполнить пустыми значения
        countMatched < modNames.length && modNames.forEach(function(modName) {
            modName in res || (res[modName] = '');
        });

        return res;

    },

    /**
     * Уставливает CSS-класс модификатора на DOM-элемент блока или вложенный элемент
     * @private
     * @param {String} modName имя модификатора
     * @param {String} modVal значение модификатора
     * @param {String} oldModVal старое значение модификатора
     * @param {jQuery} [elem] элемент
     * @param {String} [elemName] имя элемента
     */
    _afterSetMod : function(modName, modVal, oldModVal, elem, elemName) {

        var _self = this.__self,
            classPrefix = _self._buildModClassPrefix(modName, elemName),
            classRE = _self._buildModValRE(modName, elemName),
            needDel = modVal === '';

        (elem || this.domElem).each(function() {
            var className = this.className;
            className.indexOf(classPrefix) > -1?
                this.className = className.replace(
                    classRE,
                    (needDel? '' : '$1' + classPrefix + modVal) + '$3') :
                needDel || $(this).addClass(classPrefix + modVal);
        });

        elemName && this
            .dropElemCache(elemName, modName, oldModVal)
            .dropElemCache(elemName, modName, modVal);

    },

    /**
     * Находит вложенные в блок элементы
     * @protected
     * @param {String|jQuery} [ctx=this.domElem] элемент, на котором проходит поиск
     * @param {String} names имя (или через пробел имена) вложенного элемента
     * @param {String} [modName] имя модификатора
     * @param {String} [modVal] значение модификатора
     * @returns {jQuery} DOM-элементы
     */
    findElem : function(ctx, names, modName, modVal) {

        if(arguments.length % 2) { // если кол-во аргументов один или три
            modVal = modName;
            modName = names;
            names = ctx;
            ctx = this.domElem;
        } else if(typeof ctx == 'string') {
            ctx = this.findElem(ctx);
        }

        var _self = this.__self,
            selector = '.' +
                names.split(' ').map(function(name) {
                    return buildClass(_self._name, name, modName, modVal);
                }).join(',.');
        return findDomElem(ctx, selector);

    },

    /**
     * Находит вложенные в блок элементы
     * @protected
     * @param {String} name имя вложенного элемента
     * @param {String} [modName] имя модификатора
     * @param {String} [modVal] значение модификатора
     * @returns {jQuery} DOM-элементы
     */
    _elem : function(name, modName, modVal) {

        var key = name + buildModPostfix(modName, modVal),
            res;

        if(!(res = this._elemCache[key])) {
            res = this._elemCache[key] = this.findElem(name, modName, modVal);
            res.__bemElemName = name;
        }

        return res;

    },

    /**
     * Ленивый поиск вложенных в блок элементы (результат кэшируется)
     * @protected
     * @param {String} names имя (или через пробел имена) вложенных элементов
     * @param {String} [modName] имя модификатора
     * @param {String} [modVal] значение модификатора
     * @returns {jQuery} DOM-элементы
     */
    elem : function(names, modName, modVal) {

        if(modName && typeof modName != 'string') {
            modName.__bemElemName = names;
            return modName;
        }

        if(names.indexOf(' ') < 0) {
            return this._elem(names, modName, modVal);
        }

        var res = $([]),
            _this = this;
        names.split(' ').forEach(function(name) {
            res = res.add(_this._elem(name, modName, modVal));
        });
        return res;

    },

    /**
     * Сброс кэша для элементов
     * @protected
     * @param {String} names имя (или через пробел имена) вложенных элементов
     * @param {String} [modName] имя модификатора
     * @param {String} [modVal] значение модификатора
     * @returns {BEM}
     */
    dropElemCache : function(names, modName, modVal) {

        if(names) {
            var _this = this,
                modPostfix = buildModPostfix(modName, modVal);
            names.indexOf(' ') < 0?
                delete _this._elemCache[names + modPostfix] :
                names.split(' ').forEach(function(name) {
                    delete _this._elemCache[name + modPostfix];
                });
        } else {
            this._elemCache = {};
        }

        return this;

    },

    /**
     * Извлекает параметры элемента блока
     * @param {String|jQuery} elem элемент
     * @returns {Object} параметры
     */
    elemParams : function(elem) {

        var elemName;
        if(typeof elem ==  'string') {
            elemName = elem;
            elem = this.elem(elem);
        } else {
            elemName = this.__self._extractElemNameFrom(elem);
        }

        return extractParams(elem[0])[buildClass(this.__self.getName(), elemName)] || {};

    },

    /**
     * Проверяет, находится ли DOM-элемент в блоке
     * @protected
     * @param {jQuery} domElem DOM-элемент
     * @returns {Boolean}
     */
    containsDomElem : function(domElem) {

        var res = false;

        this.domElem.each(function() {
            return !(res = domElem.parents().andSelf().index(this) > -1);
        });

        return res;

    },

    /**
     * Строит CSS-селектор, соответствующий блоку/элементу и модификатору
     * @param {String} [elem] имя элемент
     * @param {String} [modName] имя модификатора
     * @param {String} [modVal] значение модификатора
     * @returns {String}
     */
    buildSelector : function(elem, modName, modVal) {

        return this.__self.buildSelector(elem, modName, modVal);

    },

    /**
     * Удаляет блок
     * @param {Boolean} [keepDOM=false] нужно ли оставлять DOM-ноды блока в документе
     */
    destruct : function(keepDOM) {

        var _this = this,
            _self = _this.__self;

        _this._isDestructing = true;

        _this._needSpecialUnbind && _self.doc.add(_self.win).unbind('.' + _this._uniqId);

        _this.dropElemCache().domElem.each(function(i, domNode) {
            var params = getParams(domNode);
            $.each(params, function(blockName, blockParams) {
                var block = uniqIdToBlock[blockParams.uniqId];
                if(block) {
                    if(!block._isDestructing) {
                        removeDomNodeFromBlock(block, domNode);
                        delete params[blockName];
                    }
                }
                else {
                    delete uniqIdToDomElems[blockParams.uniqId];
                }
            });
            $.isEmptyObject(params) && cleanupDomNode(domNode);
        });

        keepDOM || _this.domElem.remove();

        delete uniqIdToBlock[_this.un()._uniqId];
        delete _this.domElem;
        delete _this._elemCache;

        _this.__base();

    }

}, /** @lends BEM.DOM */{

    /**
     * Шорткат для документа
     * @protected
     * @type jQuery
     */
    doc : doc,

    /**
     * Шорткат для window
     * @protected
     * @type jQuery
     */
    win : win,

    /**
     * Осуществляет обработку live-свойств блока
     * @private
     * @param {Boolean} [heedLive=false] нужно ли учитывать то, что блок обрабатывал уже свои live-свойства
     * @returns {Boolean} является ли блок live-блоком
     */
    _processLive : function(heedLive) {

        var _this = this,
            res = _this._liveInitable;

        if('live' in _this) {
            var noLive = typeof res == 'undefined';

            if(noLive ^ heedLive) {
                if($.isFunction(_this.live)) {
                    res = _this.live() !== false;
                    _this.live = function() {};
                } else {
                    res = _this.live;
                }
            }
        }

        return res;

    },

    /**
     * Инициализирует блоки на фрагменте DOM-дерева
     * @static
     * @protected
     * @param {jQuery} [ctx=document] корневая DOM-нода
     * @returns {jQuery} ctx контекст инициализации
     */
    init : function(ctx, callback, callbackCtx) {

        if(!ctx || $.isFunction(ctx)) {
            callbackCtx = callback;
            callback = ctx;
            ctx = doc;
        }

        var uniqInitId = $.identify();
        findDomElem(ctx, '.i-bem').each(function() {
            init($(this), uniqInitId);
        });

        callback && this.afterCurrentEvent(
            function() {
                callback.call(callbackCtx || this, ctx);
            });

        // чтобы инициализация была полностью синхронной
        this._runAfterCurrentEventFns();

        return ctx;

    },

    /**
     * Уничтожает блоки на фрагменте DOM-дерева
     * @static
     * @protected
     * @param {Boolean} [keepDOM=false] нужно ли оставлять DOM-ноды в документе
     * @param {jQuery} ctx корневая DOM-нода
     * @param {Boolean} [excludeSelf=false] не учитывать контекст
     */
    destruct : function(keepDOM, ctx, excludeSelf) {

        if(typeof keepDOM != 'boolean') {
            excludeSelf = ctx;
            ctx = keepDOM;
            keepDOM = undefined;
        }

        findDomElem(ctx, '.i-bem', excludeSelf).each(function(i, domNode) {
            var params = getParams(this);
            $.each(params, function(blockName, blockParams) {
                if(blockParams.uniqId) {
                    var block = uniqIdToBlock[blockParams.uniqId];
                    if(block) {
                        removeDomNodeFromBlock(block, domNode);
                        delete params[blockName];
                    }
                    else {
                        delete uniqIdToDomElems[blockParams.uniqId];
                    }
                }
            });
            $.isEmptyObject(params) && cleanupDomNode(this);
        });
        keepDOM || (excludeSelf? ctx.empty() : ctx.remove());

    },

    /**
     * Заменяет фрагмент DOM-дерева внутри контекста, уничтожая старые блоки и инициализируя новые
     * @static
     * @protected
     * @param {jQuery} ctx корневая DOM-нода
     * @param {jQuery|String} content новый контент
     * @param {Function} [callback] обработчик, вызываемый после инициализации
     * @param {Object} [callbackCtx] контекст обработчика
     */
    update : function(ctx, content, callback, callbackCtx) {

        this.destruct(ctx, true);
        this.init(ctx.html(content), callback, callbackCtx);

    },

    /**
     * Добавляет фрагмент DOM-дерева в конец контекста и инициализирует блоки
     * @param {jQuery} ctx корневая DOM-нода
     * @param {jQuery|String} content добавляемый контент
     */
    append : function(ctx, content) {

        this.init($(content).appendTo(ctx));

    },

    /**
     * Добавляет фрагмент DOM-дерева в начало контекста и инициализирует блоки
     * @param {jQuery} ctx корневая DOM-нода
     * @param {jQuery|String} content добавляемый контент
     */
    prepend : function(ctx, content) {

        this.init($(content).prependTo(ctx));

    },

    /**
     * Добавляет фрагмент DOM-дерева перед контекстом и инициализирует блоки
     * @param {jQuery} ctx контекстная DOM-нода
     * @param {jQuery|String} content добавляемый контент
     */
    before : function(ctx, content) {

        this.init($(content).insertBefore(ctx));

    },

    /**
     * Добавляет фрагмент DOM-дерева после контекстом и инициализирует блоки
     * @param {jQuery} ctx контекстная DOM-нода
     * @param {jQuery|String} content добавляемый контент
     */
    after : function(ctx, content) {

        this.init($(content).insertAfter(ctx));

    },

    /**
     * Строит полное имя live-события
     * @static
     * @private
     * @param {String} e имя события
     * @returns {String}
     */
    _buildCtxEventName : function(e) {

        return this._name + ':' + e;

    },

    _liveClassBind : function(className, e, callback, invokeOnInit) {

        var _this = this;
        if(e.indexOf(' ') > -1) {
            e.split(' ').forEach(function(e) {
                _this._liveClassBind(className, e, callback, invokeOnInit);
            });
        }
        else {
            var storage = liveClassEventStorage[e],
                uniqId = $.identify(callback);

            if(!storage) {
                storage = liveClassEventStorage[e] = {};
                doc.bind(e, _this.changeThis(_this._liveClassTrigger, _this));
            }

            storage = storage[className] || (storage[className] = { uniqIds : {}, fns : [] });

            if(!(uniqId in storage.uniqIds)) {
                storage.fns.push({ uniqId : uniqId, fn : _this._buildLiveEventFn(callback, invokeOnInit) });
                storage.uniqIds[uniqId] = storage.fns.length - 1;
            }
        }

        return this;

    },

    _liveClassUnbind : function(className, e, callback) {

        var storage = liveClassEventStorage[e];
        if(storage) {
            if(callback) {
                if(storage = storage[className]) {
                    var uniqId = $.identify(callback);
                    if(uniqId in storage.uniqIds) {
                        var i = storage.uniqIds[uniqId],
                            len = storage.fns.length - 1;
                        storage.fns.splice(i, 1);
                        while(i < len) storage.uniqIds[storage.fns[i++].uniqId] = i - 1;
                        delete storage.uniqIds[uniqId];
                    }
                }
            } else {
                delete storage[className];
            }
        }

        return this;

    },

    _liveClassTrigger : function(e) {

        var storage = liveClassEventStorage[e.type];
        if(storage) {
            var node = e.target, classNames = [];
            for(var className in storage) storage.hasOwnProperty(className) && classNames.push(className);
            do {
                var nodeClassName = ' ' + node.className + ' ', i = 0;
                while(className = classNames[i++]) {
                    if(nodeClassName.indexOf(' ' + className + ' ') > -1) {
                        var j = 0, fns = storage[className].fns, fn;
                        while(fn = fns[j++]) fn.fn.call($(node), e);
                        if(e.isPropagationStopped()) return;
                        classNames.splice(--i, 1);
                    }
                }
            } while(classNames.length && (node = node.parentNode));
        }

    },

    _buildLiveEventFn : function(callback, invokeOnInit) {

        var _this = this;
        return function(e) {
            var args = [
                    _this._name,
                    ((e.data || (e.data = {})).domElem = $(this)).closest(_this.buildSelector()),
                    true ],
                block = initBlock.apply(null, invokeOnInit? args.concat([callback, e]) : args);
            block && (invokeOnInit || (callback && callback.apply(block, arguments)));
        };

    },

    /**
     * Хелпер для live-инициализации по событию на DOM-элементах блока или его элементов
     * @static
     * @protected
     * @param {String} [elemName] имя элемента или элементов (через пробел)
     * @param {String} event имя события
     * @param {Function} [callback] обработчик, вызываемый после успешной инициализации
     */
    liveInitOnEvent : function(elemName, event, callback) {

        return this.liveBindTo(elemName, event, callback, true);

    },

    /**
     * Хелпер для подписки на live-события на DOM-элементах блока или его элементов
     * @static
     * @protected
     * @param {String|Object} [to] описание (объект с modName, modVal, elem) или имя элемента или элементов (через пробел)
     * @param {String} event имя события
     * @param {Function} [callback] обработчик
     */
    liveBindTo : function(to, event, callback, invokeOnInit) {

        if(!event || $.isFunction(event)) {
            callback = event;
            event = to;
            to = undefined;
        }

        if(!to || typeof to == 'string') {
            to = { elem : to };
        }

        to.elemName && (to.elem = to.elemName);

        var _this = this;

        if(to.elem && to.elem.indexOf(' ') > 1) {
            to.elem.split(' ').forEach(function(elem) {
                _this._liveClassBind(
                    buildClass(_this._name, elem, to.modName, to.modVal),
                    event,
                    callback,
                    invokeOnInit);
            });
            return _this;
        }

        return _this._liveClassBind(
            buildClass(_this._name, to.elem, to.modName, to.modVal),
            event,
            callback,
            invokeOnInit);

    },

    /**
     * Хелпер для отписки от live-событий на DOM-элементах блока или его элементов
     * @static
     * @protected
     * @param {String} [elem] имя элемента или элементов (через пробел)
     * @param {String} event имя события
     * @param {Function} [callback] обработчик
     */
    liveUnbindFrom : function(elem, event, callback) {

        var _this = this;

        if(elem.indexOf(' ') > 1) {
            elem.split(' ').forEach(function(elem) {
                _this._liveClassUnbind(
                    buildClass(_this._name, elem),
                    event,
                    callback);
            });
            return _this;
        }

        return _this._liveClassUnbind(
            buildClass(_this._name, elem),
            event,
            callback);

    },

    /**
     * Хелпер для live-инициализации по инициализации другого блока
     * @static
     * @private
     * @param {String} event имя события
     * @param {String} blockName имя блока, на инициализацию которого нужно реагировать
     * @param {Function} callback обработчик, вызываемый после успешной инициализации в контексте нового блока
     * @param {String} findFnName имя метода для поиска
     */
    _liveInitOnBlockEvent : function(event, blockName, callback, findFnName) {

        var name = this._name;
        blocks[blockName].on(event, function(e) {
            var args = arguments,
                blocks = e.block[findFnName](name);

            callback && blocks.forEach(function(block) {
                callback.apply(block, args);
            });
        });
        return this;

    },

    /**
     * Хелпер для live-инициализации по событию другого блока на DOM-элементе текущего
     * @static
     * @protected
     * @param {String} event имя события
     * @param {String} blockName имя блока, на инициализацию которого нужно реагировать
     * @param {Function} callback обработчик, вызываемый после успешной инициализации в контексте нового блока
     */
    liveInitOnBlockEvent : function(event, blockName, callback) {

        return this._liveInitOnBlockEvent(event, blockName, callback, 'findBlocksOn');

    },

    /**
     * Хелпер для live-инициализации по событию другого блока внутри текущего
     * @static
     * @protected
     * @param {String} event имя события
     * @param {String} blockName имя блока, на инициализацию которого нужно реагировать
     * @param {Function} [callback] обработчик, вызываемый после успешной инициализации в контексте нового блока
     */
    liveInitOnBlockInsideEvent : function(event, blockName, callback) {

        return this._liveInitOnBlockEvent(event, blockName, callback, 'findBlocksOutside');

    },

    /**
     * Хелпер для live-инициализации по инициализации другого блока на DOM-элементе текущего
     * @deprecated использовать liveInitOnBlockEvent
     * @static
     * @protected
     * @param {String} blockName имя блока, на инициализацию которого нужно реагировать
     * @param {Function} callback обработчик, вызываемый после успешной инициализации в контексте нового блока
     */
    liveInitOnBlockInit : function(blockName, callback) {

        return this.liveInitOnBlockEvent('init', blockName, callback);

    },

    /**
     * Хелпер для live-инициализации по инициализации другого блока внутри текущего
     * @deprecated использовать liveInitOnBlockInsideEvent
     * @static
     * @protected
     * @param {String} blockName имя блока, на инициализацию которого нужно реагировать
     * @param {Function} [callback] обработчик, вызываемый после успешной инициализации в контексте нового блока
     */
    liveInitOnBlockInsideInit : function(blockName, callback) {

        return this.liveInitOnBlockInsideEvent('init', blockName, callback);

    },

    /**
     * Добавляет обработчик live-события на блок, с учётом заданного элемента,
     * внутри которого будет слушаться событие
     * @static
     * @protected
     * @param {jQuery} [ctx] элемент, внутри которого будет слушаться событие
     * @param {String} e имя события
     * @param {Object} [data] дополнительные данные, приходящие в обработчик как e.data
     * @param {Function} fn обработчик
     * @param {Object} [fnCtx] контекст обработчика
     */
    on : function(ctx, e, data, fn, fnCtx) {

        return ctx.jquery?
            this._liveCtxBind(ctx, e, data, fn, fnCtx) :
            this.__base(ctx, e, data, fn);

    },

    /**
     * Удаляет обработчик live-события у блока, с учётом заданного элемента,
     * внутри которого слушалось событие
     * @static
     * @protected
     * @param {jQuery} [ctx] элемент, внутри которого слушалось событие
     * @param {String} e имя события
     * @param {Function} [fn] обработчик
     * @param {Object} [fnCtx] контекст обработчика
     */
    un : function(ctx, e, fn, fnCtx) {

        return ctx.jquery?
            this._liveCtxUnbind(ctx, e, fn, fnCtx) :
            this.__base(ctx, e, fn);

    },

    /**
     * Добавляет обработчик live-события на блок, с учётом заданного элемента,
     * внутри которого будет слушаться событие
     * @deprecated использовать on
     * @static
     * @protected
     * @param {jQuery} ctx элемент, внутри которого будет слушаться событие
     * @param {String} e имя события
     * @param {Object} [data] дополнительные данные, приходящие в обработчик как e.data
     * @param {Function} fn обработчик
     * @param {Object} [fnCtx] контекст обработчика
     */
    liveCtxBind : function(ctx, e, data, fn, fnCtx) {

        return this._liveCtxBind(ctx, e, data, fn, fnCtx);

    },

    /**
     * Добавляет обработчик live-события на блок, с учётом заданного элемента,
     * внутри которого будет слушаться событие
     * @static
     * @private
     * @param {jQuery} ctx элемент, внутри которого будет слушаться событие
     * @param {String} e имя события
     * @param {Object} [data] дополнительные данные, приходящие в обработчик как e.data
     * @param {Function} fn обработчик
     * @param {Object} [fnCtx] контекст обработчика
     */
    _liveCtxBind : function(ctx, e, data, fn, fnCtx) {

        var _this = this;

        if(typeof e == 'string') {
            if($.isFunction(data)) {
                fnCtx = fn;
                fn = data;
                data = undefined;
            }

            if(e.indexOf(' ') > -1) {
                e.split(' ').forEach(function(e) {
                    _this._liveCtxBind(ctx, e, data, fn, fnCtx);
                });
            } else {
                var ctxE = _this._buildCtxEventName(e),
                    storage = liveEventCtxStorage[ctxE] ||
                        (liveEventCtxStorage[ctxE] = { counter : 0, ctxs : {} });

                ctx.each(function() {
                    var ctxId = $.identify(this),
                        ctxStorage = storage.ctxs[ctxId];
                    if(!ctxStorage) {
                        ctxStorage = storage.ctxs[ctxId] = {};
                        ++storage.counter;
                    }
                    ctxStorage[$.identify(fn) + (fnCtx? $.identify(fnCtx) : '')] = {
                        fn   : fn,
                        data : data,
                        ctx  : fnCtx
                    };
                });
            }
        } else {
            $.each(e, function(e, fn) {
                _this._liveCtxBind(ctx, e, fn, data);
            });
        }

        return _this;

    },

    /**
     * Удаляет обработчик live-события у блока, с учётом заданного элемента,
     * внутри которого слушалось событие
     * @deprecated использовать un
     * @static
     * @protected
     * @param {jQuery} ctx элемент, внутри которого слушалось событие
     * @param {String} e имя события
     * @param {Function} [fn] обработчик
     * @param {Object} [fnCtx] контекст обработчика
     */
    liveCtxUnbind : function(ctx, e, fn, fnCtx) {

        return this._liveCtxUnbind(ctx, e, fn, fnCtx);

    },

    /**
     * Удаляет обработчик live-события у блока, с учётом заданного элемента,
     * внутри которого слушалось событие
     * @static
     * @private
     * @param {jQuery} ctx элемент, внутри которого слушалось событие
     * @param {String} e имя события
     * @param {Function} [fn] обработчик
     * @param {Object} [fnCtx] контекст обработчика
     */
    _liveCtxUnbind : function(ctx, e, fn, fnCtx) {

        var _this = this,
            storage = liveEventCtxStorage[e =_this._buildCtxEventName(e)];

        if(storage) {
            ctx.each(function() {
                var ctxId = $.identify(this, true),
                    ctxStorage;
                if(ctxId && (ctxStorage = storage.ctxs[ctxId])) {
                    fn && delete ctxStorage[$.identify(fn) + (fnCtx? $.identify(fnCtx) : '')];
                    if(!fn || $.isEmptyObject(ctxStorage)) {
                        storage.counter--;
                        delete storage.ctxs[ctxId];
                    }
                }
            });
            storage.counter || delete liveEventCtxStorage[e];
        }

        return _this;

    },

    /**
     * Извлекает имя вложенного в блок элемента
     * @static
     * @private
     * @param {jQuery} elem вложенный элемент
     * @returns {String|undefined}
     */
    _extractElemNameFrom : function(elem) {

        if(elem.__bemElemName) return elem.__bemElemName;

        var matches = elem[0].className.match(this._buildElemNameRE());
        return matches? matches[1] : undefined;

    },

    /**
     * Извлекает параметры блока из DOM-элемента
     * @static
     * @param {HTMLElement} domNode DOM-нода
     * @returns {Object}
     */
    extractParams : extractParams,

    /**
     * Строит префикс для CSS-класса DOM-элемента или вложенного элемента блока по имени модификатора
     * @static
     * @private
     * @param {String} modName имя модификатора
     * @param {jQuery|String} [elem] элемент
     * @returns {String}
     */
    _buildModClassPrefix : function(modName, elem) {

        return buildClass(this._name) +
               (elem?
                   ELEM_DELIM + (typeof elem === 'string'? elem : this._extractElemNameFrom(elem)) :
                   '') +
               MOD_DELIM + modName + MOD_DELIM;

    },

    /**
     * Строит регулярное выражение для извлечения значения модификатора из DOM-элемента или вложенного элемента блока
     * @static
     * @private
     * @param {String} modName имя модификатора
     * @param {jQuery|String} [elem] элемент
     * @param {String} [quantifiers] квантификаторы регулярного выражения
     * @returns {RegExp}
     */
    _buildModValRE : function(modName, elem, quantifiers) {

        return new RegExp('(\\s?)' + this._buildModClassPrefix(modName, elem) + '(' + NAME_PATTERN + ')(\\s|$)', quantifiers);

    },

    /**
     * Строит регулярное выражение для извлечения имени вложенного в блок элемента
     * @static
     * @private
     * @returns {RegExp}
     */
    _buildElemNameRE : function() {

        return new RegExp(this._name + ELEM_DELIM + '(' + NAME_PATTERN + ')(?:\\s|$)');

    },

    /**
     * Строит CSS-селектор, соответствующий блоку/элементу и модификатору
     * @param {String} [elem] имя элемент
     * @param {String} [modName] имя модификатора
     * @param {String} [modVal] значение модификатора
     * @returns {String}
     */
    buildSelector : function(elem, modName, modVal) {

        return '.' + buildClass(this._name, elem, modName, modVal);

    },

    /**
     * Возвращает инстанс блока по уникальному идентификатору
     * @deprecated
     * @param {String} [uniqId]
     * @returns {BEM.DOM}
     */
    getBlockByUniqId : function(uniqId) {

        return uniqIdToBlock[uniqId];

    },

    /**
     * Возвращает размер текущего окна
     * @returns {Object} объект с полями width, height
     */
    getWindowSize : function() {

        return {
            width  : win.width(),
            height : win.height()
        };

    }

});

})(BEM, jQuery);

(function() {

String.prototype.trim || (String.prototype.trim = function () {

    var str = this.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;

    while(ws.test(str.charAt(--i)));

    return str.slice(0, i + 1);

});

})();

BEM.DOM.decl('i-global', {

    onSetMod : {

        'js' : function() {

            // удаляем системные свойства
            this.del(this.__self._params = $.extend({}, this.params), 'uniqId', 'name');

            var params = this.__self._params;

            params['passport-msg'] || (params['passport-msg'] = params.id);

            params['show-counters'] = Math.round(Math.random() * 100) <= params['show-counters-percent'];
            params.locale = params.lang;

            $(function(){
                params.oframebust && Lego.oframebust(params.oframebust);
            });

        }

    },

    getDefaultParams : function() {

        return {
            id : '',
            login : Lego.isSessionValid() ? $.cookie('yandex_login') || '' : '',
            yandexuid : $.cookie('yandexuid'),
            lang : 'ru',
            retpath : window.location.toString(),
            'passport-host' : 'http://web.archive.org/web/20130424113517/https://passport.yandex.ru',
            'pass-host' : '//web.archive.org/web/20130424113517/http://pass.yandex.ru',
            'social-host' : '//web.archive.org/web/20130424113517/http://social.yandex.ru',
            'lego-path' : '/lego',
            'show-counters-percent' : 100
        };

    }

}, {

    param  : function(name) {

        return (this._params || {})[name];

    }

});

(function(Lego){
if (!Lego) Lego = window.Lego = {};

Lego.messages = Lego.messages || {};

Lego.message = function(id, text) {
    return Lego.params.locale == 'ru' ? text : (Lego.messages[id] || text);
};

})(window.Lego);
(function(Lego) {

    Lego = Lego || {};

    Lego.oframebustMatchDomain = function(whitelist, domain) {
        whitelist = Object.prototype.toString.call(whitelist) === "[object Array]" ? whitelist : (function() {
            var arr = [];
            for (var k in whitelist) {
                whitelist.hasOwnProperty(k) && arr.push(k);
            }
            return arr;
        }());

        for (var i = 0, l = whitelist.length; i < l; i++) {
            var d = whitelist[i];
            if (typeof(d) == 'string') {
                //поддержка wildcard
                if (/(\?|\*)/.test(d)) {
                    var re = d.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '\.{1}');
                    if ((new RegExp('^' + re + '$')).test(domain)) return true;
                } else if (domain == d) {
                    return true; //обычная строка
                }
            } else {
                //предполагаем, что d -- regexp
                try {
                    if (d.test(domain)) return true;
                } catch(e) {}
            }
        }
    }

})(window.Lego);

(function(Lego) {

    if (!Lego) Lego = window.Lego = {};

    Lego.oframebust = function(whitelist) {
        if (location == top.location) return;

        var domain = (location.search.match(/[&?]oframebust=([^&;]+)/) || [])[1];
        if (!domain) top.location = location;

        if (Lego.oframebustMatchDomain(whitelist, domain)) {
            var iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.left = '-999px';
            iframe.style.width = '1px';
            iframe.src = '//' + domain + '/oframebust.html?'
                    + encodeURIComponent(location.href);
            (function() {
                if (document.body && document.body.firstChild) {
                    document.body.insertBefore(iframe, document.body.firstChild);
                } else {
                    setTimeout(arguments.callee, 0);
                }
            })();
            return;
        }

        top.location = location;
    };

})(window.Lego);

/* дефолтная инициализация */
$(function() {
    BEM.DOM.init();
});
BEM.DOM.decl('b-autocomplete-item', {

    /**
     * Возвращает значение, которое надо вставить в input.
     * @returns {String}
     */
    val : function() {
        return this.params.val || this.elem('text').text() || this.domElem.text();
    },

    /**
     * Действие на наведение на пункт клавиатурой
     * @returns {Boolean=true} Если возвращается false, значит подставлять значение пункта не надо
     */
    enter : function() {},

    /**
     * Действие на выбор пункта
     * @param {Boolean} [byKeyboard=false] выбор осуществлен клавиатурой
     * @returns {Boolean=true} Если возвращается false, значит пункт сам сделал все необходимые действия
     */
    select : function(byKeyboard) {}

}, {

    live : function() {

        this.liveBindTo('mouseover mouseout mousedown', function(e) {
            this.trigger(e.type);
        });

    }

});

BEM.HTML.decl('b-autocomplete-item', {

    onBlock : function(ctx) {

        ctx
            .tag('li')
            .content(ctx.param('data'))
            .js(true);

    }

});

(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl("b-news-list", {
        onSetMod: {
            js: function() {
                var self = this,
                    year = 0,
                    month = 0,
                    day = 0,
                    apply = this.findBlockInside({blockName: 'b-form-button', modName: 'name', modVal: 'apply'});

//                BEM.blocks['b-form-select'].on(self.domElem, 'change', function(e) {
//                    var block = e.block,
//                        name = block.getMod('name');
//
//                    switch (name) {
//                        case 'year':
//                            year = parseInt(block.val());
//                            break;
//                        case 'month':
//                            month = parseInt(block.val());
//                            break;
//                        case 'day':
//                            day = parseInt(block.val());
//                            break;
//                    }
//
//                    if (year || month || day) {
//                        apply.delMod('disabled');
//                    } else {
//                        apply.setMod('disabled', 'yes');
//                    }
//                });
//
//                BEM.blocks['b-form-button'].on(self.domElem, 'click', function(e) {
//                    var block = e.block,
//                        name = block.getMod('name');
//
//                    switch (name) {
//                        case 'apply':
//                            self.getNewsByDate(year, month, day);
//                            break;
//                    }
//                });

                BEM.blocks['b-link'].on(self.domElem, 'click', function(e) {
                    var block = e.block,
                        type = block.getMod('type');

                    if ('news-more' == type) {
                        // TODO: Сделать через i-request
                        $.get(block.params.url, function(response) {
                            BEM.DOM.append($('.b-list'), $(response).find('.b-list').html());
                            var more = $('<div/>').html(response).find('.b-link_type_news-more');
                            if (more.length) {
                                more.insertAfter('.b-link_type_news-more');
                            }
                            $(block.domElem).remove();
                        }, 'html');
                    }
                });
            }
        },
        getNewsByDate: function(year, month, day) {
            var url = '/news/',
                y = parseInt(year),
                m = parseInt(month),
                d = parseInt(day),
                today = new Date();

            function pad(str, max) {
                return (""+str).length < max ? pad("0" + str, max) : str;
            }

            switch (true) {
                case y == 0 && m == 0 && d == 0:
                    y = today.getFullYear();
                    m = today.getMonth() + 1;
                    d = today.getDate();
                    break;
                case y == 0 && m != 0 && d == 0:
                    y = today.getFullYear();
                    break;
                case y == 0 && m == 0 && d != 0:
                    y = today.getFullYear();
                    m = today.getMonth() + 1;
                    break;
                case y == 0 && m != 0 && d != 0:
                    y = today.getFullYear();
                    break;
                case y != 0 && m ==0 && d != 0:
                    m = today.getMonth() + 1;
                    break;
            }

            var date = pad(y, 4) + "-" + pad(m, 2) + "-" + pad(d, 2),
                url = url + date;
            window.location = url;
        }
    });

}(this, this.jQuery));

BEM.DOM.decl('b-slider', {
    onSetMod: {
        'js': function(){
            var self = this;
            var buttons = this.getButtons();
            var len = this.len();
            var left = this.getLeftArrow();
            var right = this.getRightArrow();
            var wrap = this.getSlideList().stop();

            /* глянуть реализацию each в i-bem*/
            var slides = this.getSlides().each(function(i){
                $(this).attr('data-index', i);
            });
            
            buttons.on('click', function(){
                var index = self.getIndex(buttons, this);
                self.activateByIndex(index);
            });
            left.on('click', function(){
                if(self.isDisabled(left)) return;

                self.getPrevSlide();
            });
            right.on('click', function(){
                if(self.isDisabled(right)) return;

                self.getNextSlide();
            });


            if (self.hasMod('slideOnImageClick', 'yes')){
                self.findElem('clip').on('click', function(){
                    self.getNextSlide();
                });
            }

            this.copySlides();
            this.slideListResetLeft();
            this.setActivArrow();

            if(this.hasMod('auto-scroll') && this.getSlides().length > 1){
                this.auto();
            }

            if(this.findBlocksOutside('b-apps').length){
                var slide_hash = /#slide-(\d)/;
                if(slide_hash.test(document.location.hash)){
                    var slide_index = parseInt(document.location.hash.match(slide_hash)[1]);
                    this.setMod('animation-speed', 'suddenly');
                    self.activateByIndex(slide_index);
                }
            }
        },
        'active-slide': function(modName, modVal){
            //if block in b-apps
            if(this.findBlocksOutside('b-apps').length){
                document.location.hash = 'slide-' + modVal.toString()
            }
        }
    },
    onElemSetMod: {
        item: {
            active: function(item, _, offset){
                if(isNaN(offset = parseInt(offset))) return; //delMod

                var self = this;
                var slide_width = this.getSlideWidth();
                var lastIndex = this.len() - 1;
                var wrap = this.findElem('slide-list').stop();
                var left = '-=' + (slide_width * offset) + 'px';
                var prew_index = parseInt(this.getMod(item, 'prev'));
                var len = self.getSlides().length;
                var animate_speed = 'slow';


                if(offset < 0){
                    left = '+=' + (slide_width * Math.abs(offset)) + 'px';
                }

                //no animate if prev slide is clone
                if(prew_index >= len){
                    this.slideListResetLeft();
                    return true;
                }
                else if(prew_index < 0){
                    this.goToLastSlideInstantly();
                    return true;
                }

                this.animate_in_progress = true;

                if (this.getMod('animation-speed', 'suddenly')){
                    animate_speed = 0;
                    this.delMod('animation-speed');
                }

                wrap.animate({ left: left}, animate_speed, function(){
                    self.animate_in_progress = false;
                    var index = self.getCurrentIndex();
                    var len = self.getSlides().length;
                    if (index >= len){
                        self.activateByIndex(0);
                    }
                    else if(index < 0){
                        self.activateByIndex(len -1);
                    }
                });
            }
        }
    },

    afterAnimate: $.noop,
    copySlides: $.noop,
    setActivArrow: $.noop,
    getStartOffset: function(){return 0},
    getIndex: function(list, elem){
        for(var i = 0, e = null; e = list[i++];)

            if(e === elem)

                return i - 1;
        return -1;
    },
    getSlides: function(){
        if(this.slides){
            return this.slides;
        }
        else{
            this.slides = this.getRealSlidesList();
            return this.slides;
        }
    },
    getRealSlidesList: function(){
        return this.findElem('item');
    },
    getSlideWidth: function(){
        return $(this.getSlides()[0]).outerWidth()
    },
    getButtons: function(){
        return this.findElem('button');
    },
    getLeftArrow: function(){
        return this.findElem('arrow', 'type', 'left');
    },
    getRightArrow: function(){
        return this.findElem('arrow', 'type', 'right');
    },
    getSlideByIndex: function(index){
        return this.getRealSlidesList().filter(function(){ return $(this).data('index') === index;});
    },
    getCurrentSlide: function(){
        return this.getSlideByIndex(this.getCurrentIndex());
    },
    getCurrentIndex: function(){
        return this.getMod('active-slide') || 0;
    },
    getSlideList: function(){
        return this.findElem('slide-list')
    },
    slideListResetLeft: function(){
        this.getSlideList().css('left', "-" + this.getStartOffset() + "px")
    },
    goToLastSlideInstantly:function(){
        var left_offset = this.getStartOffset() + this.getSlideWidth() * (this.getSlides().length-1);
        this.getSlideList().css('left', '-' + left_offset + "px")
    },
    isDisabled: function(o){
        return (this.getMod(o, 'disabled') === 'yes');
    },
    activateByIndex: function(index){
        if(this.animate_in_progress){
            return;
        }
        var buttons = this.getButtons();
        var real_slides = this.getRealSlidesList();
        var len = this.len();
        var left = this.getLeftArrow();
        var right = this.getRightArrow();
        var currentIndex = this.getCurrentIndex();
        var offset = index - currentIndex;

        var slide = this.getSlideByIndex(index);

//        if(index === -1 || currentIndex === index) return false;

        this
            .setMod(left.add(right), 'disabled', 'no')
            .setMod('active-slide', index)
            .delMod(real_slides, 'active')
            .setMod(slide, 'prev', currentIndex)
            .setMod(slide, 'active', offset);
        if(!this.hasMod('infinity-with-slides-on-side') && !this.hasMod('infinity')){
            this.toggleMod(left, 'disabled', 'yes', 'no', index === 0 && !this.hasMod('theme'))
                .toggleMod(right, 'disabled', 'yes', 'no', index === len - 1 && !this.hasMod('theme'))
        }

        this.findBlockOn(buttons.eq(currentIndex % this.len()), 'b-link').delMod('disabled');
        this.findBlockOn(buttons.eq(index % this.len()), 'b-link').setMod('disabled', 'yes');
        return true;
    },
    getNextSlide:function(){
        var currentIndex = this.getCurrentIndex();
        this.activateByIndex((currentIndex + 1));
    },
    getPrevSlide:function(){
        var currentIndex = this.getCurrentIndex();
        this.activateByIndex((currentIndex - 1));
    },
    len: function(){
        return this.getSlides().length;
    },
    auto: $.noop,
    periodic: $.noop
});

BEM.DOM.decl({name: 'b-slider', modName: 'theme', modVal: 'main'}, {
    auto: function(){
        var self = this;

        this.domElem.hover(function(){
            clearInterval(self.silideInterval);
        }, function(){self.start_animate()});

        this.start_animate();
    },
    start_animate: function(){
        var self = this;
        this.silideInterval = setInterval(function(){
            self.activateByIndex((self.getCurrentIndex() + 1));
        }, 4000);
    }
});
BEM.DOM.decl({name: 'b-slider', modName: 'infinity', modVal: 'yes'}, {
    onSetMod: {
        js: function(){
            this.__base.apply(this, arguments);
            var wrap = this.getSlideList().stop();

            //set width of slide list
            wrap.css('width', this.getSlideWidth() * this.getRealSlidesList().length);
            this.findElem('clip').css('width', this.getSlideWidth());
        }
    },
    copySlides:function(){
        var slides = this.getSlides();
        var slides_len = slides.length;
        var slides_wrap = this.findElem('slide-list');

        var first_elem = $(slides[0]);
        var last_element = $(slides[slides_len - 1]);
        slides_wrap.prepend(last_element.clone().data('index', first_elem.data('index')-1));
        slides_wrap.append(first_elem.clone().data('index', last_element.data('index')+1));
    },

    getStartOffset:function(){
        return $(this.getSlides()[0]).outerWidth()
    },
    afterAnimate:function(){
        if(this.getCurrentIndex() >= this.len()){
            this.slideListResetLeft();
        }
    },
    setActivArrow:function(){
        this.delMod(this.getLeftArrow(), 'disabled');
        this.delMod(this.getRightArrow(), 'disabled');
    }
});

BEM.DOM.decl({name: 'b-slider', modName: 'feature-list', modVal: 'yes'}, {
    onSetMod: {
        js: function(){
            this.__base.apply(this, arguments);
            var self = this;

            self.on('change-feature', function(e, index){
                self.activateByIndex(index);
                return false;
            });
        }
    },
    activateByIndex: function(){
        if(this.__base.apply(this, arguments)){
            this.trigger('change-slide', this.getCurrentIndex());
        }

    }

});

BEM.DOM.decl({name: 'b-slider', modName: 'infinity-with-slides-on-side', modVal: 'yes'}, {
    onSetMod: {
        js: function(){
            this.__base.apply(this, arguments);
            var wrap = this.getSlideList().stop();

            //set width of slide list
            wrap.css('width', this.getSlideWidth() * this.getRealSlidesList().length);
            this.findElem('clip').css('width', this.getSlideWidth());
        }
    },
    copySlides:function(){
        var slides = this.getSlides();
        var slides_len = slides.length;
        var slides_wrap = this.findElem('slide-list');

        var first_elem = $(slides[0]);
        var last_element = $(slides[slides_len - 1]);
        var second_elem = $(slides[1]);
        var penultimate_elem = $(slides[slides_len - 2]);

        slides_wrap.prepend(last_element.clone().data('index', first_elem.data('index')-1));
        slides_wrap.append(first_elem.clone().data('index', last_element.data('index')+1));
        slides_wrap.append(second_elem.clone().data('index', last_element.data('index')+2));
        slides_wrap.prepend(penultimate_elem.clone().data('index', first_elem.data('index')-2));
    },

    getStartOffset:function(){
        return $(this.getSlides()[0]).outerWidth() * 2
    },

    afterAnimate:function(){
        if(this.getCurrentIndex() >= this.len()){
            this.slideListResetLeft();
        }
    },
    setActivArrow:function(){
        this.delMod(this.getLeftArrow(), 'disabled');
        this.delMod(this.getRightArrow(), 'disabled');
    }
});

/** @requires BEM */
/** @requires BEM.HTML */

BEM.HTML.decl('b-link', {
    onBlock: function(ctx) {
        ctx
            .tag('a')
            .attr('href', ctx.param('url'));

        var props = ['title', 'target'], p;
        while(p = props.pop()) ctx.param(p) && (ctx.attr(p, ctx.param(p)));
    }
});

/**
 * leftClick event plugin
 *
 * Copyright (c) 2010 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.0.0
 */

(function($) {

var leftClick = $.event.special.leftclick = {

    setup : function() {

        $(this).bind('click', leftClick.handler);

    },

    teardown : function() {

        $(this).unbind('click', leftClick.handler);

    },

    handler : function(e) {

        if(!e.button) {
            e.type = 'leftclick';
            $.event.handle.apply(this, arguments);
            e.type = 'click';
        }

    }

};

})(jQuery);
BEM.DOM.decl({'name': 'b-link', 'modName': 'pseudo', 'modVal': 'yes'}, {

    _onClick : function(e) {

        e.preventDefault();

        this.hasMod('disabled', 'yes') || this.afterCurrentEvent(function() {
            this.trigger('click');
        });

    }

}, {

    live : function() {

        this.__base.apply(this, arguments);

        this.liveBindTo({ modName : 'pseudo', modVal : 'yes' }, 'leftclick', function(e) {
            this._onClick(e);
        });

    }

});

/** @requires BEM */
/** @requires BEM.HTML */

BEM.HTML.decl({name: 'b-link', modName: 'pseudo', modVal: 'yes'}, {
    onBlock: function(ctx) {
        ctx.tag(ctx.param('url') ? 'a': 'span');

        ctx.wrapContent({ elem : 'inner' });
    },

    onElem : {
        'inner': function(ctx) {
            ctx.tag('span');
        }
     }
});


(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl({
        block: "b-link",
        modName: "video",
        modVal: "yes"
    }, {
        onSetMod: {
            js: function() {
                var self = this;
                var popup = $(".b-popupa_type_video").bem("b-popupa");
                var code = this.params.code.split('&lt;').join('<').split('&gt;').join('>');

                this.on("click", function(evt) {
                    /* TODO get rid of this shitcode */
                    popup.findElem('content').html('<div class="b-static-text"><h3>' + this.params.title + '</h3></div>' + '<div>' + code + '</div>');
                    
                    popup.toggle();
                    popup.on('hide', function(){
                        popup.findElem('content').html('')
                    });
                });
            }
        }
    });

}(this, this.jQuery));
(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl({
        block: "b-link",
        modName: "type",
        modVal: "install"
    }, {

        onSetMod: {

            js: function() {
                this.on("click", function(ev) {
                    var scrollTo = $('.l-grid_type_install-ways:visible');
                    if (!scrollTo.length){
                        scrollTo = $('.b-download-nav:visible');
                    }
                    $('html, body').animate({
                        scrollTop: scrollTo.offset().top - 50
                    }, 1000);
                });
            }
        }
    });

}(this, this.jQuery));
(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl({
        block: "b-link",
        modName: "type",
        modVal: "map-download-pc"
    }, {

        onSetMod: {

            js: function() {
                var self = this;
                this.on("click", function(evt) {
                    window.location = self.params.url;
                });
            }
        }
    });

}(this, this.jQuery));
(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl({
        block: "b-link",
        modName: "type",
        modVal: "map-download"
    }, {

        onSetMod: {

            js: function() {
                var city = this.params.city
                BEM.decl('i-maps-cities', {
                    get: function(val, onSuccess) {
                        var blocks = city.split(';'),
                            values = [];
                        if (val) {
                            for (var i = 0, block=''; block = blocks[i++];) {
                                if (block.toLowerCase().indexOf(val.toLowerCase()) != -1) {
                                    values.push(block);
                                }
                            }
                        }
                        onSuccess(values);
                    }
                });

                var popup = $(".b-popupa_type_maps").bem("b-popupa");

                this.on("click", function(evt) {
                    popup.toggle();
                });
            }
        }
    });

}(this, this.jQuery));
(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl({
        block: "b-link",
        modName: "type",
        modVal: "configure-internet"
    }, {

        onSetMod: {

            js: function() {
                var popup = $(".b-popupa_type_configure-internet").bem("b-popupa");

                this.on("click", function(evt) {
                    popup.toggle();
                });
            }
        }
    });

}(this, this.jQuery));
(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl({block: "b-link", modName: "counter"}, {

        onSetMod: {

            js: function() {
                var self = this;

                self.__base.apply(self, arguments);

                BEM.blocks['b-link'].on(self.domElem, 'click', function(e){
                   var block = e.block,
                       target = block.getMod('counter').replace(/-/g, "_"),
                       //получаем счетчик для локали
                       counter_name = 'yaCounter' + ({
                               'ua': '20345062',
                               'ru': '17710429'
                           })[window.location.hostname.split('.').pop()],
                       yaCounter = window[counter_name];

                    if (target && target != 'empty' && yaCounter) {
                        yaCounter.reachGoal(target);
                    }
                    return true;
                });

                if(self.hasMod("type", "appstore-link") || self.hasMod("type", "ipad-appstore-link")){
                    // :'(
                    self.domElem.on("mousedown", function(e) {
                        if(e.which > 2){
                            //если по линке клинули не левой или средней кнопкой, цель не считаем
                            return;
                        }

                        var block = '',
                            counter_name = 'yaCounter' + ({
                                   'ua': '20345062',
                                   'ru': '17710429'
                               })[window.location.hostname.split('.').pop()],
                            yaCounter = window[counter_name];

                        if($(e.target).parents('a')){
                            block = $(e.target).parents('a').bem('b-link');
                        }
                        else{
                            block = $(e.target).bem('b-link');
                        }

                        var target = block.getMod('counter').replace(/-/g, "_");

                        if (target && target != 'empty'  && yaCounter) {
                            yaCounter.reachGoal(target);
                        }
                    });
                }
            }
        }
    });

}(this, this.jQuery));
BEM.DOM.decl('b-feature-list', {
    onSetMod: {
        js: function(){

            var feature_list = this.findBlockInside({blockName: 'b-list', modName: 'type', modVal: 'features-list'});
            var slider = this.findBlockInside('b-slider');
            feature_list.on('change-feature', function(ev, index){
                slider.trigger('change-feature', index);
                return false;
            });
            slider.on('change-slide', function(ev, index){
                feature_list.trigger('change-slide', index);
                return false;
            });
        }
    }
});
BEM.DOM.decl({name: 'b-list', modName: 'type', modVal: 'features-list'}, {
    onSetMod: {
        js: function(){
            this.__base.apply(this, arguments);
            var self = this;

            self.findElem('item').each(function(i, elem){
                $(this).attr('data-index', i);
                $(this).on('click', function(ev){
                    var index =$(ev.target).parents('.b-list__item').data('index')
                    self.trigger('change-feature', index);
                });
            });

            this.on('change-slide', function(e, index){
                self.findElem('item').each(function(i, elem){
                    if ($(elem).bem('b-list__item').hasMod('promoted')) {
                        $(elem).bem('b-list__item').setMod('promoted', 'no');
                    }
                    $(elem).bem('b-list__item').delMod('state');
                });
                if (self.findElem('item').length > index) {
                    var elem = $(self.findElem('item')[index]).bem('b-list__item');
                    if (elem.hasMod('promoted')) {
                        elem.setMod('promoted', 'yes');
                    }
                    elem.setMod('state', 'current');
                }
                return false;
            });
        }
    }
});

BEM.DOM.decl({name: 'b-apps', modName: 'main', modVal: 'no'}, {
    onSetMod: {
        js: function(){
            var self = this;

            BEM.blocks["b-form-radio"].on(self.domElem, 'change',
                    function(evt, data){
                    // TODO: юзать i-request
                    $.ajax({
                        url: self.getUrl(evt.block.val()),
                        type: 'GET'
                    }).then(function(resp){
                        if(self.domElem){
                            BEM.DOM.update(self.domElem, resp);
                        }
                    });
            });
        }
    },
    getUrl: function(val) {
        return this.params.url + '?' + val;
    }
});
BEM.DOM.decl({name: 'b-apps', modName: 'main', modVal: 'yes'}, {
    onSetMod: {
        js: function(){
            var self = this,
                sliderPlace = self.findElem('list');

            BEM.blocks["b-form-radio"].on(self.domElem, 'change',
                function(evt, data) {
                    // TODO: юзать i-request
                    $.ajax({
                        url: self.getUrl(evt.block.val()),
                        type: 'GET'
                    }).then(function(resp){
                        if(self.domElem){
                            BEM.DOM.update(sliderPlace, resp);
                        }
                    });
            });
        }
    },
    getUrl: function(val) {
        return this.params.url + '?' + val;
    }
});
(function($) {

/**
 @namespace JS-API блока b-popupa
 @name block */

BEM.DOM.decl('b-popupa',  /** @lends block.prototype */ {
    
    onSetMod : {

        'js' : function() {

            /**
             * DOM-элемент, для которого открывается попап
             * @private
             * @type jQuery
             */
            this._owner = null;

            /**
             * Состояние видимости
             * @private
             * @type Boolean
             */
            this._isShowed = false;

            /**
             * Приоритетное направление для открытия попапа
             * @private
             * @type String
             */
            this._direction = this.getMod('direction') || 'down';

            /**
             * Последнее удачное направление открытия (когда попап полностью попал в окно)
             * @private
             * @type String
             */
            this._lastDirection = null;

        }

    },

    /**
     * Показывает попап
     * @param {jQuery|Object} owner DOM-элемент или координаты { left : x, top : y }, относительно которых рассчитывается положение
     */
    show : function(owner) {

        if(!this._isShowed || this._owner !== owner) {
            this._owner = owner;
            this._getUnder().show({ left : -10000, top : -10000 });
            this.pos();
            this._getUnder().setMod('animate','yes');
        }

        return this;

    },

    /**
     * Скрывает попап
     */
    hide : function() {

        this._isShowed && this._getUnder().hide();
        return this;

    },

    /**
     * Показывает/скрывает попап в зависимости от текущего состояния
     * @param {jQuery|Object} owner DOM-элемент или координаты { left : x, top : y }, относительно которых рассчитывается положение
     */
    toggle : function(owner) {

        return this.isShowed()?
            this.hide() :
            this.show(owner);

    },

    /**
     * Позиционирует попап
     */
    _pos : function() {

        var params = this._calcParams(this._owner);

        this.elem('tail').css(params.tailOffsets);
        this
            .setMod('direction', params.direction)
            ._getUnder().show(params.offsets);

        return this;

    },

    /**
     * Позиционирует попап, если он виден
     */
    pos : function() {

        if (!this._isShowed)
            return this;

        return this._pos();
    },

    /**
     * Возвращает состояние видимости попапа
     * @returns {Boolean}
     */
    isShowed : function() {

        return this._isShowed;

    },

    /**
     * Устанавливает приоритетное направление открытия попапа
     * @param {String} direction направление (up|right|down|left)
     */
    setDirection : function(direction) {

        if(this._direction != direction) {
            this._direction = direction;
            this.isShowed() && this.pos();
        }

    },

    /**
     * Устанавливает контент попапа
     * @param {String|jQuery} content контент
     * @param {Function} [callback] обработчик, вызываемый после инициализации
     * @param {Object} [callbackCtx] контекст обработчика
     */
    setContent : function(content, callback, callbackCtx) {

        BEM.DOM.update(this.elem('content'), content, callback, callbackCtx);
        return this.isShowed()? this.pos() : this;

    },

    /**
     * Проверяет, является ли владелец попапа DOM-элементом
     * @returns {Boolean}
     */
    _isOwnerNode : function() {

        return !!(this._owner && this._owner.jquery);

    },

    /**
     * Вычисляет необходимые метрики для расчета направления открытия попапа
     * @private
     * @returns {Object}
     */
    _calcDimensions : function() {

        var posElem = this._getUnder().domElem,
            underElem = this._getUnder()._getUnder(),
            win = this.__self.win,
            owner = this._owner,
            isOwnerNode = this._isOwnerNode(),
            ownerOffset = isOwnerNode? owner.offset() : owner,
            ownerWidth = isOwnerNode? owner.outerWidth() : TAIL_OFFSET,
            ownerHeight = isOwnerNode? owner.outerHeight() : TAIL_OFFSET,
            scrollLeft = win.scrollLeft(),
            scrollTop = win.scrollTop(),
            winSize = this.__self.getWindowSize(),
            borderWidth = parseInt(this.elem('content').css('border-top-width'), 10);

        return {
            ownerLeft : ownerOffset.left,
            ownerTop : ownerOffset.top,
            ownerRight : ownerOffset.left + ownerWidth,
            ownerBottom : ownerOffset.top + ownerHeight,
            ownerMiddle : ownerOffset.left + ownerWidth / 2,
            posWidth : posElem.outerWidth(),
            posHeight : posElem.outerHeight(),
            underWidth : underElem.outerWidth(),
            underHeight : underElem.outerHeight(),
            borderWidth : isNaN(borderWidth)? 0 : borderWidth,
            windowLeft : scrollLeft,
            windowRight : scrollLeft + winSize.width,
            windowTop : scrollTop,
            windowBottom : scrollTop + winSize.height
        };

    },

    /**
     * Вычисляет параметры открытия попапа
     * @private
     * @returns {Object} хэш вида { direction, offset.left, offset.top }
     */
    _calcParams : function() {

        var d = this._calcDimensions();

        if(this.hasMod('adjustable', 'no'))
            return calcDirectionParams(this._direction, d);

        var checkedDirections = {},
            allowedDirections = this.params.directions,
            currentDirectionIdx = $.inArray(this._direction, allowedDirections);

        // обработка случая когда текущее направление открытия не является допустимым
        currentDirectionIdx > -1 || (currentDirectionIdx = 0);

        var priorityDirectionIdx = currentDirectionIdx,
            currentDirection, params;

        do {
            currentDirection = allowedDirections[currentDirectionIdx];
            params = checkedDirections[currentDirection] = calcDirectionParams(currentDirection, d);
            if(!params.factor) {// значит полностью попал в окно
                this._lastDirection = currentDirection;
                return params;
            }

            // находим следующее возможное направление открытия, если оно есть
            ++currentDirectionIdx == allowedDirections.length && (currentDirectionIdx = 0);

        } while(currentDirectionIdx !== priorityDirectionIdx);

        return checkedDirections[this._lastDirection || allowedDirections[0]];

    },

    getDefaultParams : function() {

        return {
            directions : ALLOWED_DIRECTIONS
        };

    },

    destruct : function() {

        var under = this._under;
        if(!under) {
            this.__base.apply(this, arguments);
        }
        else if(!this._destructing) {
            this._destructing = true;
            this.hide();
            BEM.DOM.destruct(false, under.domElem);
            this.__base(true);
        }

    },

    /**
     * Возвращает подложку
     * @private
     * @returns {BEM.DOM.blocks['i-popup']}
     */
    _getUnder : function() {

        if(!this._under) {
            var under = $(BEM.HTML.build({
                block : 'i-popup',
                zIndex : this.params.zIndex,
                mods : {
                    autoclosable : this.getMod('autoclosable') || 'yes',
                    fixed : this.hasMod('direction', 'fixed') && 'yes'
                },
                underMods : this.params.underMods,
                underMix : [{ block : 'b-popupa', elem : 'under' }]
            }));

            (this._under = this.findBlockOn(under, 'i-popup'))
                .on(
                    {
                        'show'          : this._onUnderShowed,
                        'hide'          : this._onUnderHidden,
                        'outside-click' : this._onUnderOutsideClicked
                    },
                    this)
                .elem('content').append(this.domElem);

        }

        return this._under;

    },

    _onUnderShowed : function() {

        this._isShowed = true;

        this
            .bindToWin('resize', this.pos)
            ._isOwnerNode() &&
                this.bindToDomElem(
                    this._owner.parents().add(this.__self.win),
                    'scroll',
                    this.pos);

        this.trigger('show');

    },

    _onUnderHidden : function() {

        this._isShowed = false;

        this
            .unbindFromWin('resize')
            ._isOwnerNode() &&
                this.unbindFromDomElem(
                    this._owner.parents().add(this.__self.win),
                    'scroll');

        this.trigger('hide');
    },

    _onUnderOutsideClicked : function() {

        this.trigger.apply(this, arguments);

    }

}, /** @lends block */ {

    live : function() {

        this.liveBindTo('close', 'leftclick', function() {
            this.hide();
        });

    }

});

var TAIL_OFFSET = 19,
    TAIL_WIDTH_HORIZONTAL = 13,
    TAIL_WIDTH_VERTICAL = 19,
    TAIL_HEIGHT_HORIZONTAL = 19,
    TAIL_HEIGHT_VERTICAL = 10,
    SHADOW_SIZE = 7,
    ALLOWED_DIRECTIONS = [
        'down-right', 'down', 'down-left', 'up', 'up-right', 'up-left',
        'right-down', 'right', 'right-up', 'left-down', 'left', 'left-up'];

/**
 * Рассчитывает параметры открытия попапа в заданном направлении
 * @private
 * @param {String} direction направление
 * @param {Object} d метрики
 * @returns {Object}
 */
function calcDirectionParams(direction, d) {

    var factor, offsets, tailOffsets, calcDirection;

    switch(direction) {
        case 'down':
        case 'up':
            factor = calcInWindowFactor(offsets = {
                left : d.ownerMiddle - d.underWidth / 2,
                top : direction == 'down'?
                    d.ownerBottom + TAIL_HEIGHT_VERTICAL :
                    d.ownerTop - d.underHeight + SHADOW_SIZE * 2 - TAIL_HEIGHT_VERTICAL
            }, d);
            offsets.left += SHADOW_SIZE;
            tailOffsets = {
                marginLeft : (d.ownerRight - d.ownerLeft) / 2 +
                    d.ownerLeft - offsets.left - TAIL_WIDTH_VERTICAL / 2,
                marginTop : (direction == 'down'? -TAIL_HEIGHT_VERTICAL + d.borderWidth : -d.borderWidth)
            };
        break;

        case 'down-right':
        case 'down-left':
        case 'up-right':
        case 'up-left':
            calcDirection = direction == 'down-right' || direction == 'down-left'? 'down' : 'up';
            factor = calcInWindowFactor(offsets = {
                left : (direction == 'down-right' || direction == 'up-right'?
                    d.ownerLeft :
                    d.ownerRight - d.underWidth + SHADOW_SIZE),
                top : calcDirection == 'down'?
                    d.ownerBottom + TAIL_HEIGHT_VERTICAL :
                    d.ownerTop - d.underHeight + SHADOW_SIZE * 2 - TAIL_HEIGHT_VERTICAL
            }, d);
            (direction == 'down-left' || direction == 'up-left') && (offsets.left += SHADOW_SIZE);
            tailOffsets = {
                marginLeft : (d.ownerRight - d.ownerLeft) / 2 + d.ownerLeft - offsets.left - TAIL_WIDTH_VERTICAL / 2,
                marginTop : (calcDirection == 'down'? -TAIL_HEIGHT_VERTICAL + d.borderWidth : -d.borderWidth)
            };
        break;

        case 'left-down':
        case 'right-down':
            calcDirection = direction == 'left-down'? 'left' : 'right';
            factor = calcInWindowFactor(offsets = {
                left : (direction == 'left-down'?
                    d.ownerLeft - d.underWidth - TAIL_WIDTH_HORIZONTAL :
                    d.ownerRight + TAIL_WIDTH_HORIZONTAL),
                top : d.ownerTop - TAIL_OFFSET + TAIL_HEIGHT_HORIZONTAL / 2
            }, d);
            direction == 'left-down' && (offsets.left += SHADOW_SIZE + TAIL_WIDTH_HORIZONTAL);
            tailOffsets = {
                marginLeft : direction == 'left-down'? -d.borderWidth : -TAIL_WIDTH_HORIZONTAL + d.borderWidth,
                marginTop : TAIL_OFFSET - TAIL_HEIGHT_HORIZONTAL / 2
            };
        break;

        case 'left':
        case 'right':
            factor = calcInWindowFactor(offsets = {
                left : (direction == 'left'?
                    d.ownerLeft - d.underWidth - TAIL_WIDTH_HORIZONTAL :
                    d.ownerRight + TAIL_WIDTH_HORIZONTAL),
                top : d.ownerTop + (d.ownerBottom - d.ownerTop) / 2 - d.underHeight / 2
            }, d);
            direction == 'left' && (offsets.left += TAIL_WIDTH_HORIZONTAL);
            offsets.top += (d.underHeight - d.posHeight) / 2; // костыль, потому что тень является частью under, а позиционируется i-popup
            tailOffsets = {
                marginLeft : direction == 'left'? -d.borderWidth : -TAIL_WIDTH_HORIZONTAL + d.borderWidth,
                marginTop : d.posHeight / 2 - TAIL_HEIGHT_HORIZONTAL / 2
            };
        break;

        case 'left-up':
        case 'right-up':
            calcDirection = direction == 'left-up'? 'left' : 'right';
            factor = calcInWindowFactor(offsets = {
                left : (direction == 'left-up'?
                    d.ownerLeft - d.underWidth - TAIL_WIDTH_HORIZONTAL :
                    d.ownerRight + TAIL_WIDTH_HORIZONTAL),
                top : d.ownerTop + TAIL_HEIGHT_HORIZONTAL / 2 + TAIL_OFFSET - d.underHeight + SHADOW_SIZE
            }, d);
            direction == 'left-up' && (offsets.left += TAIL_WIDTH_HORIZONTAL);
            tailOffsets = {
                marginLeft : calcDirection == 'left'? -d.borderWidth : -TAIL_WIDTH_HORIZONTAL + d.borderWidth,
                marginTop : d.ownerTop - offsets.top + SHADOW_SIZE - TAIL_HEIGHT_HORIZONTAL / 2
            };
    }

    return {
        direction : calcDirection || direction,
        factor : factor,
        offsets : offsets,
        tailOffsets : tailOffsets
    };

}

/**
 * Вычисляет фактор попадания объекта в окно
 * @param {Object} pos параметры объекта
 * @param {Object} d метрики
 * @returns {Number} фактор попадания (если 0 - то полностью попадает, если нет -- то чем он больше, тем хуже попадает)
 */
function calcInWindowFactor(pos, d) {

    var res = 0;

    d.windowTop > pos.top && (res += d.windowTop - pos.top);
    pos.top + d.underHeight > d.windowBottom && (res += pos.top + d.underHeight - d.windowBottom);
    d.windowLeft > pos.left && (res += d.windowLeft - pos.left);
    pos.left + d.underWidth > d.windowRight && (res += pos.left + d.underWidth - d.windowRight);

    return res;

}

BEM.HTML.decl('b-popupa', {

    onBlock : function(ctx) {

        var hasClose = false;
        $.each(ctx.param('content'), function(i, item) {
            return !(hasClose = item.elem == 'close');
        });
        ctx
            .mods({ theme : 'ffffff', direction : 'down', 'has-close' : hasClose && 'yes' })
            .js(true)
            .afterContent({ elem : 'shadow' });

    },

    onElem : {

        'content' : function(ctx) {

            ctx
                .wrap({ elem : 'wrap-cell', tag : 'td' })
                .wrap({ tag : 'tr' })
                .wrap({ elem : 'wrap', tag : 'table' });

        },

        'close' : function(ctx) {

            ctx.tag('i');

        },

        'shadow' : function(ctx) {

            ctx.tag('i');

        },

        'tail' : function(ctx) {

            ctx
                .tag('i')
                .wrapContent({ elem : 'tail-i', tag : 'i' });

        }

    }

});

})(jQuery);

(function($) {

/**
 * Шаблон для подложки
 * @private
 * @type jQuery
 */
var template,

/**
 * Пул подложек
 * @private
 * @type Array
 */
    underPool = [],

    browser = $.browser;

/**
 * Достает подложку из пула, при необходимости создает новую
 * @private
 * @returns jQuery
 */
function getUnder() {

    return underPool.length?
        underPool.shift() :
        template?
            template.clone() :
            template = createUnder();

}

/**
 * Возвращает подложку в пул
 * @private
 * @param {jQuery} under
 */
function putUnder(under) {

    underPool.push(under);

}

/**
 * Создает подложку
 * @private
 * @returns {jQuery}
 */
function createUnder() {

    // TODO пока только для мобильного сафари отдаем div, нужно сделать более умно для тех браузеров, которым достаточно div
    return $((browser.safari || browser.webkit) && navigator.userAgent.toLowerCase().indexOf('mobile') > -1?
        '<div/>' :
        '<iframe' + (browser.msie && browser.version < 9? ' frameborder="0"' : '') + '/>');

}

BEM.DOM.decl('i-popup', {

    onSetMod : {

        'visibility' : {

            'visible' : function() {

                var under = this._getUnder(),
                    underParent = under.parent();

                this.hasMod(under, 'type', 'paranja')?
                    underParent.is('body') || under.appendTo('body') :
                    (underParent[0] !== this.domElem[0]) && under.prependTo(this.domElem);

                this._inBody || (this._inBody = !!this.domElem.appendTo('body'));

                this.trigger('show');

            },

            '' : function() {

                var under = this._getUnder();

                this.hasMod(under, 'type', 'paranja') && under.remove();
                this._putUnder();
                this.trigger('hide');

            }

        }

    },

    /**
     * Получает элемент подложки
     * @private
     * @returns {jQuery}
     */
    _getUnder : function() {

        return this._under ||
            (this._under = getUnder().attr(
                'class',
                this._underClass || (this._underClass = this.findElem('under').remove().attr('class'))));

    },

    /**
     * Возвращает элемент подложки
     * @private
     */
    _putUnder : function() {

        putUnder(this._under);
        delete this._under;

    },

    /**
     * Открывает попап
     * @param {Object} css объект css-свойств, описывающих положение попапа
     * @returns {BEM.DOM}
     */
    show : function(css) {

        css && this.domElem.css(css);
        return this.setMod('visibility', 'visible');

    },

    /**
     * Закрывает попап
     * @returns {BEM.DOM}
     */
    hide : function() {

        return this.delMod('animate').delMod('visibility');

    }

}, {

    live : true

});

})(jQuery);

BEM.HTML.decl('i-popup', {

    onBlock : function(ctx) {

        ctx
            .mod('autoclosable', 'yes')
            .js(true)
            .wrapContent({ elem : 'content' })
            .afterContent({
                elem : 'under',
                mods : ctx.param('underMods'),
                mix : ctx.param('underMix')})
            .param('zIndex') &&
                ctx.attr('style', 'z-index:' + (32700 + ctx.param('zIndex')));


    }

});
(function($) {

var KEYDOWN_EVENT = $.browser.opera? 'keypress' : 'keydown';

BEM.DOM.decl({ name : 'i-popup', modName : 'autoclosable', modVal : 'yes' }, {

    onSetMod : {

        'visibility' : {

            'visible' : function() {

                this.afterCurrentEvent(function() {
                    // Из-за асинхронности, модификатор уже может быть снят
                    // в этот момент, поэтому нужно его еще раз
                    // проверить, чтобы не оказалось "повисших" подписок.
                    if (this.hasMod('visibility', 'visible')) {

                        var under = this._under;

                        this.bindToDoc('leftclick', function(e) {
                                this.containsDomElem($(e.target)) || this._onOutClick(e);
                            })
                            .bindToDoc(KEYDOWN_EVENT, function(e) {
                                // на Escape закрываем
                                e.keyCode == 27 && this.hide();
                            });

                        if (under && under.is('iframe') && this.hasMod(under, 'type', 'paranja')) {

                            // NOTE Предусматривать отвязку не нужно, т.к. после
                            //      вызова метода hide сам элемент (паранжа) удаляется.
                            // NOTE У пустого iframe:
                            //      IE7-8 ловят клик на contentWindow.document
                            //      Другие браузеры ловят только на contentWindow.
                            this.bindToDomElem(
                                $([under[0].contentWindow, under[0].contentWindow.document]),
                                'leftclick',
                                this.hide
                            );
                        }
                    }
                });
                this.__base.apply(this, arguments);

            },

            '' : function() {

                return this
                    .unbindFromDoc('leftclick ' + KEYDOWN_EVENT)
                    .__base.apply(this, arguments);

            }

        }

    },

    _onOutClick : function(domEvent) {

        var e = $.Event('outside-click');
        this.trigger(e, { domEvent : domEvent });
        e.isDefaultPrevented() || this.hide();

    }

});
})(jQuery);
(function() {

var MIN_OFFSET = 10;

BEM.DOM.decl({ name : 'b-popupa', modName : 'direction', modVal : 'fixed' }, {

    _pos : function() {
        
        var under = this._getUnder(),
            marginLeft = -under.domElem.outerWidth() / 2,
            marginTop = -under.domElem.outerHeight() / 2,
            windowSize = this.__self.getWindowSize();

        under.show({
            left : '50%',
            top : '50%',
            marginLeft : windowSize.width / 2 - MIN_OFFSET + marginLeft < 0?
                -windowSize.width / 2 + MIN_OFFSET :
                marginLeft,
            marginTop : windowSize.height / 2 - MIN_OFFSET + marginTop < 0?
                -windowSize.height / 2 + MIN_OFFSET :
                marginTop
        });

        return this;

    }

});

})();

BEM.DOM.decl('b-tabbed-pane', {

    onSetMod : {

        'js' : function() {

            this._enableTabs();

        }

    },

    onElemSetMod : {

        'panel' : {

            'state': {

                'current' : function(elem) {

                    if (this.getPanel().index(elem) === -1) {
                        return;
                    }

                    this.currentPanel = elem;
                    var prevPanel = this.getPanel('state', 'current');

                    this
                        .delMod(prevPanel, 'state')
                        .trigger('current', {
                            prev    : prevPanel,
                            current : elem
                        });

                }

            }

        },
        'tab' : {
            'state' : {
                'current' : function(elem) {

                    if (this.getTab().index(elem) === -1) {
                        return;
                    }

                    this.currentTab = elem;
                    var prev = this.getTab('state', 'current');
                    this
                        .delMod(prev, 'state');
                }
            }
        }

    },

    /**
     * Возвращает контейнер панелей
     * @returns {jQuery} panels
     */
    getPanels: function (modName, modVal) {
        return this.domElem.filter(this.buildSelector('panels'));
    },

    /**
     * Возвращает панель
     * @param {String} [modName] имя модификатора
     * @param {String} [modVal] значение модификатора
     * @returns {jQuery} panel
     */
    getPanel: function (modName, modVal) {
        return this.getPanels().children(this.buildSelector('panel', modName, modVal));
    },

    /**
     * Возвращает контейнер табов
     * @returns {jQuery} tabs
     */
    getTabs: function () {
        return this.domElem.filter(this.buildSelector('tabs'));
    },

    /**
     * Возвращает таб
     * @param {String} [modName] имя модификатора
     * @param {String} [modVal] значение модификатора
     * @returns {jQuery} tab
     */
    getTab: function (modName, modVal) {
        return this.findElem(this.getTabs(), 'tab', modName, modVal);
    },

    /**
     * @nosideeffects
     * @param {jQuery} tab
     * @returns {jQuery} panel
     */
    getPanelByTab : function(tab) {
        return this.getPanel().eq(this.getTab().index(tab));
    },

    /**
     * @nosideeffects
     * @param {jQuery} panel
     * @returns {jQuery} tab
     */
    getTabByPanel : function(panel) {
        return this.getTab().eq(this.getPanel().index(panel));
    },

    /**
     * Включает/выключает слушание выбора пункта меню
     * @private
     * @param {Boolean} [enable=true]
     */
    _enableTabs : function(enable) {

        BEM.blocks['b-menu'][enable === false? 'liveCtxUnbind' : 'liveCtxBind'](
            this.getTabs(),
            'current',
            this._onSelectTab,
            this);

        return this;

    },

    /**
     * Обработчик выбора пункта меню
     * @param {$.Event} e событие
     * @param {Object} data данные
     */
    _onSelectTab : function(e, data) {


        this.selectByIndex(data.current? this.getTab().index(data.current) : -1);

    },

    /**
     * Показывает панель
     * @param {Number} index индекс панели
     */
    selectByIndex : function(index) {

        if (index >= 0) {
            var tab = this.getTab().eq(index);
            this
                ._enableTabs(false)
                .setMod(tab, 'state', 'current')
                .findBlockOn(this.getTabs(), 'b-menu').setMod(
                    tab,
                    'state',
                    'current');

            // включаем таб
            this
                .setMod(
                    this.getPanel().eq(index),
                    'state',
                    'current')
                ._enableTabs();

        } else {
            this
                .delMod(this.getTab('state', 'current'), 'state')
                .delMod(this.getPanel('state', 'current'), 'state');

            var menu = this.findBlockOn(this.getTabs(), 'b-menu');
            menu.delMod(menu.elem('item'), 'state');
        }

    },

    /**
     * Показывает панель
     * @param {Number} index индекс панели
     */
    toggleByIndex : function(index) {

        // включаем таб
        var tab = this.getTab().eq(index);
        this
            ._enableTabs(false)
            .toggleMod(tab, 'state', 'current', '')
            .findBlockOn(this.getTabs(), 'b-menu').toggleMod(
                tab,
                'state',
                'current',
                '');

        this
            .toggleMod(
                this.getPanel().eq(index),
                'state',
                'current',
                '')
            ._enableTabs();

    },

    destruct : function() {

        this
            ._enableTabs(false)
            .__base.apply(this, arguments);

    }

}, {

    live : function() {

        this.liveInitOnBlockInit('b-menu');

    }

});

BEM.DOM.decl('b-menu', {

    onElemSetMod : {

        'trigger' : {

            'state' : function(elem, modName, modVal) {

                this
                    .toggleMod(
                        this.findElem(elem.closest(this.buildSelector('layout-vert-cell')), 'item-content').eq(0),
                        'visibility',
                        'visible',
                        modVal == 'opened')
                    .trigger('trigger', {
                        domElem : elem,
                        state : modVal
                    });

            }

        },

        'item' : {

            'state' : {

                'current' : function(elem) {

                    var _this = this,
                        blockName = _this.__self.getName(),
                        prev = _this.elem('item', 'state', 'current').filter(function() {
                                return $(this).closest(_this.buildSelector()).bem(blockName) === _this;
                            });

                    // открываем все триггеры более верхнего уровня
                    _this.findElem(
                        elem
                            .parents(_this.buildSelector('item-content'))
                            .prev(_this.buildSelector('item')), 'trigger')
                                .each(function() {
                                    _this.setMod($(this), 'state', 'opened');
                                });

                    _this
                        .delMod(prev, 'state')
                        .trigger('current', {
                            prev    : prev,
                            current : elem
                        });

                }

            }

        }

    },

    onTriggerClick : function(e) {

        e.preventDefault();
        this.toggleMod(e.data.domElem, 'state', 'opened');

    },

    onItemSelectorClick : function(e) {

        var item = this._getItemByEvent(e);
        this.hasMod(item, 'state', 'disabled') || this.setMod(item, 'state', 'current');

    },

    _getItemByEvent : function(e) {
        return e.data.domElem.closest(this.buildSelector('item'));
    }

}, {

    live : function() {

        this
            .liveBindTo('trigger', 'leftclick', function(e) {
                this.onTriggerClick(e);
            })
            .liveBindTo('item-selector', 'leftclick', function(e) {
                this.onItemSelectorClick(e);
            });

    }

});
(function(window, $) {
var BEM = window.BEM;

BEM.DOM.decl({block: "b-tabbed-pane", modName: "type", modVal: "app-read-type"}, {
    onSetMod: {
        js: function() {
            var self = this;

            self.__base.apply(this, arguments);

            var tabs = this.findElem('tab');
            for(var i= 0, tLen = tabs.length; i<tLen; i++){
                self.setMod($(tabs[i]), 'index', i);
            }

            tabs.on('click', function(){
                var tab_name = self.getMod($(this), 'tab-name');

                window.location.hash = tab_name;
                self.onTabChange(tab_name);
            });

            if (window.location.hash) {
                var tab_name = window.location.hash.slice(1);
                var tab_from_hash = this.findElem('tab', 'tab-name', tab_name);
                this.selectByIndex(self.getMod($(tab_from_hash), 'index'));
                self.onTabChange(tab_name);
            }
            else{
                var active_tab = this.findElem('tab', 'state', 'current'),
                    tab_name = this.getMod($(active_tab), 'tab-name');
                self.onTabChange(tab_name);
            }
        }
    },
    onTabChange: function(tab_name){
        this.setAppTitleIcon(tab_name);
        this.setCounterFroInstallButton(tab_name);
        this.setDescription(tab_name);
        this.setInstallButton(tab_name);
    },
    setDescription:function(tab_name){
        var app_descr = $('.b-static-text_app_descr'),
            moob_app_descr = $('.b-static-text_mob-app_descr'),
            b_cut_state = '';
        if(tab_name == 'app'){
            //показать видео
            $('.l-grid_type_app-description').show();

            if(moob_app_descr.length){
                var mdescr = moob_app_descr.bem('b-static-text');
                mdescr.setMod('hidden', 'yes');
                b_cut_state = mdescr.findBlockInside('b-cut').getMod('state');
            }
            if(app_descr.length && moob_app_descr.length){
                var descr = app_descr.bem('b-static-text');
                var bcut = descr.findBlockInside('b-cut');
                descr.delMod('hidden');

                if(bcut.findElem('additional').length){
                    bcut.setMod('state', b_cut_state);
                }
            }
        }
        else if(tab_name == 'mob-app'){
            //спрятать видио
            $('.l-grid_type_app-description').hide();

            if(app_descr.length && moob_app_descr.length){
                var descr = app_descr.bem('b-static-text');
                descr.setMod('hidden', 'yes');
                b_cut_state = descr.findBlockInside('b-cut').getMod('state');
            }
            if(moob_app_descr.length){
                var mdescr = moob_app_descr.bem('b-static-text');
                var mbcut = mdescr.findBlockInside('b-cut');
                mdescr.delMod('hidden');
                if(mbcut && mbcut.findElem('additional').length){
                    mbcut.setMod('state', b_cut_state);
                }
            }
        }
    },
    setAppTitleIcon: function(tab_name){
        var title = $('.b-app_type_medium').bem('b-app');
        if(title && title.params){
            if(tab_name == 'app'){
                title.params.appTitle && title.findElem('name').text(title.params.appTitle);
                title.params.appIcon && this.reloadIcon(title.findElem('icon'), title.params.appIcon);
                title.setMod('is-new', (title.params.appNew) ? "yes" : 'no');
                title.setMod('is-updated', (title.params.appUpdated) ? "yes" : 'no');
                document.title = title.params.mobAppPageTitle;
            }
            else if(tab_name == 'mob-app'){
                title.params.modAppTitle && title.findElem('name').text(title.params.modAppTitle);
                title.params.mobAppIcon && this.reloadIcon(title.findElem('icon'), title.params.mobAppIcon);
                title.setMod('is-new', (title.params.mobAppNew) ? "yes" : 'no');
                title.setMod('is-updated', (title.params.mobAppUpdated) ? "yes" : 'no');
                document.title = title.params.mobAppPageTitle;
            }
        }
    },
    reloadIcon:function(icon_el, new_src){
        var old_img = icon_el.find('.b-icon');
        if(old_img.length == 1){
            var new_img = old_img.clone();
            new_img.attr('src', new_src);
            old_img.after(new_img);
            old_img.remove();
        }
    },
    setCounterFroInstallButton:function(tab_name){
        var installButton = $('.b-link_type_install');
        if (installButton.length == 1){
            installButton = installButton.bem('b-link')
        }
        else{
            return false;
        }

        if(tab_name == 'app'){
            installButton.setMod('counter', installButton.getMod('app-counter'));
            installButton.setMod('js', 'inited')
        }
        else if(tab_name == 'mob-app'){
            installButton.setMod('counter', installButton.getMod('mob-counter'));
            installButton.setMod('js', 'inited')
        }
    },

    setInstallButton: function(tabName) {
        var installButton = $('.b-link_type_install');
        if (installButton.length == 1){
            installButton = installButton.bem('b-link');
            var installButton_i18n = $.parseJSON(installButton.params.i18n);
        } else{
            return false;
        }
        switch (tabName) {
            case 'app':
                installButton.setMod('mod', 'app-install');
                BEM.DOM.update(installButton.domElem.find('.b-link__inner'), installButton_i18n.install);
                break;
            case 'mob-app':
                BEM.DOM.update(installButton.domElem.find('.b-link__inner'), installButton_i18n.get_link)
                installButton.setMod('mod', 'mob-install');
                break;
        }
        installButton.setMod('js', 'inited')
    }
});
}(this, this.jQuery));

(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl('b-cut', {
        onSetMod: {
            js: function() {
                var self = this;

                BEM.blocks['b-link'].on(self.domElem, 'click', function(e) {
                    var block = e.block,
                        type = block.getMod('type');

                    switch (type) {
                        case 'show':
                        case 'hide':
                            self.toggleMod('state', 'open', 'closed');
                            break;
                    }
                });
            }
        }
    });


})(this, this.jQuery);
BEM.DOM.decl('b-platform-choice-simple', {
    onSetMod: {
        js: function () {
            if (this.findBlockInside('b-menu').findElem('item').length > 10) {
                this.findBlockInside('b-menu').setMod('compression', 'yes');
            }
            BEM.blocks['b-link'].on(this.domElem, 'click', function (event) {
                if (this.getMod('type') === 'platform-switcher') {
                    var splitted_path = document.location.pathname.split('/').join(' ').trim().split(' '),
                        apps_url = splitted_path[0],
                        app_name = splitted_path[1],
                        url = '/' + [apps_url, app_name.replace('site-', ''), this.getMod('platform')].join('/') + '/';
                    document.location.href =  url;
                }
            });
        }
    }
});

(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl("b-app-link", {
        onSetMod: {
            js: function() {
                var self = this,
                    popup = self.findBlockInside({blockName: 'b-popupa', modName: 'type', modVal: 'send-sms'}),
                    phoneNumber = self.findBlockInside("b-phone-number");

                self.csrf_setup();

                phoneNumber && phoneNumber.on({
                    "phone-full":  self.captchaShow,
                    "phone-incomplete": self.disableSubmitButton
                }, self);

                self._captchaBlock = self.findBlockInside('b-captcha');
                self._phone = self.findBlockInside('b-phone-number').findBlockInside('b-form-input');
                self._captchaCode = self.findBlockInside({block: "b-form-input", modName: "type", modVal: "captcha-code"});
                self._captchaWrapper = self.findBlockInside({block: "b-static-text", modName: "type", modVal: "captcha-image"});
                self._captchaInput = self.findBlockInside({block: "b-form-input", modName: "type", modVal: "captcha-input"});
                self._linkUpdate = self.findBlockInside({block: "b-link", modName: 'type', modVal: 'captcha-update'});
                self._linkSubmit = self.findBlockInside({block: "b-form-button", modName: "type", modVal: "app-phone-link"});

                /**
                 * Update captcha link
                 */
                BEM.blocks['b-link'].on(self.domElem, 'click', function(e) {
                    var block = e.block, type = block.getMod('type');

                    if (type === "captcha-update") {

                        //хак для ие, добавляем рандомный параметр
                        var url = block.params.url + "?rand=" + Math.random().toString();
                        $.get(url, function(response) {
                            // Update Captcha
                            var newCaptcha = $('<img/>', {
                                "alt" : "captcha-img",
                                "class" : "b-icon",
                                "src" : response.image_url
                            });

                            BEM.DOM.update($(self._captchaWrapper.domElem),
                                    newCaptcha);

                            self._captchaCode.val(response.captcha_code);
                        });
                    }
                });

                /**
                 * Captcha code input
                 */
                BEM.blocks['b-form-input'].on(self.domElem, 'change', function(e) {
                    var block = e.block,
                        type = block.getMod('type');

                    switch (type) {
                        case 'captcha-input':
                            var value = this.val();

                            if (value.length && !self.hasMod('state', 'error')) {
                                self._linkSubmit.delMod('disabled');
                            } else {
                                self._linkSubmit.setMod('disabled', 'yes');
                            }
                            break;
                    }
                });

                /**
                 * Get link to sms
                 */
                BEM.blocks['b-form-button'].on(self.domElem, 'click', function(e){
                    var block = e.block,
                        type = block.getMod('type');

                    switch (type) {
                        case 'app-phone-link':
                            var data = {
                                    "phone_number": self._phone.val().split(' ').join(''),
                                    "key": self._captchaCode.val(),
                                    "rep": self._captchaInput.val(),
                                    "app_name": self.params.app,
                                    "platform_slug": self.params.platform_slug || ''
                                };

                            // TODO: recreate via i-request
                            $.post(self.params.url, data, function(response) {
                                if (response.status == 'error') {
                                    self.captchaUpdate();
                                } else if (response.status == 'ok') {
                                    self.resetForm();
                                }
//                                popup.findElem('content').html('<div class="b-static-text"><h1>' + (response.title || '') + '</h1><p class="error">' + (response.error_message || '') + '</p>' + '<p>' + (response.message || '') + '</p></div>');
                                popup.findElem('content').html(response.content);
                                popup.toggle();
                            }, 'json');
                            break;
                    }
                });
            }
        },

        captchaShow: function() {
            if(this._captchaBlock.hasMod('visibility')){
                this.captchaUpdate();
                this._captchaBlock.delMod('visibility');
            }
        },
        captchaHide: function() {
            this._captchaBlock.setMod('visibility', 'hidden');
            this._captchaCode.val('');
        },
        resetForm:function(){
            this._phone.val('');
            this.captchaHide();
        },
        disableSubmitButton:function(){
            this._linkSubmit.setMod('disabled', 'yes');
        },
        captchaUpdate: function() {
            this._linkUpdate.trigger('click');
            this._captchaInput.val('')
        },

        csrf_setup: function(){
            $(document).ajaxSend(function(event, xhr, settings) {
                function getCookie(name) {
                    var cookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = jQuery.trim(cookies[i]);
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }
                function sameOrigin(url) {
                    // url could be relative or scheme relative or absolute
                    var host = document.location.host; // host + port
                    var protocol = document.location.protocol;
                    var sr_origin = '//' + host;
                    var origin = protocol + sr_origin;
                    // Allow absolute or scheme relative URLs to same origin
                    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
                        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                        // or any other URL that isn't scheme relative or absolute i.e relative.
                        !(/^(\/\/|http:|https:).*/.test(url));
                }
                function safeMethod(method) {
                    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                }

                if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            });
        }
    });

}(this, this.jQuery));

BEM.DOM.decl('b-phone-number', {
    phone_number_mask: '--- --- -- --',
    country_format: {
        '7': '- --- --- -- --',
        '3': '-- --- --- -- --'
    },
    country_codes: {
        'ru':[
                '73', '74', '75', '78', '79', //Россия
                '76', '77', //Казахстан
                '375' //Беларуссия
        ]
    },
    tld: window.location.hostname.split('.').pop(),
    WRONG_COUNTRY_CODE: 404,
    onSetMod: {
        js: function(){
            var self = this,
                keyDownEvent = $.browser.opera? 'keypress' : 'keydown';
            this.app_link = this.findBlockOutside('b-app-link')
            this.errorSpan = this.app_link.findBlockInside('l-grid').findElem('error');

            var bFormInput = this.findBlockInside('b-form-input');
            bFormInput.findElem('input').on(keyDownEvent, function(ev){
                return self.validate_phone_number(ev, bFormInput)
            });
            this.findBlockInside('b-form-input').on('change', function(ev){
                return self.apply_mask(ev);
            });
            if(self.getMod('edit-country-code', 'yes')){
                this.phone_number_mask
            }
            if(this.tld == 'ru' && this.hasMod('edit-country-code', 'yes')){
                var input = this.findBlockInside('b-form-input').findElem('input'),
                    default_text = '7 ';
                input.on('focus', function(ev){
                    var elem = $(ev.target);
                    if(elem.val() == ''){
                        elem.val(default_text);
                        setTimeout(function(){
                            elem[0].selectionStart = elem[0].selectionEnd = elem.val().length;
                        }, 10);

                    }
                    elem.css('background-color', 'white');
                }).on('blur', function(ev){
                    var elem = $(ev.target);
                    if(elem.val() == '' || elem.val() == default_text){
                        elem.css('background-color', 'transparent');
                        var b_input = elem.parents('.b-form-input').bem('b-form-input');
                        b_input.setMod(b_input.findElem('hint-wrap'), 'visibility', 'visible')
                    }
                });
            }

        }
    },

    showError: function(msg){
        this.errorSpan.text(msg);
        this.app_link.setMod('state', 'error');
    },

    hideError: function(msg){
        this.app_link.setMod('state', 'form');
    },

    hasNoError: function(){
        return !this.app_link.hasMod('state', 'error');
    },

    set_format_for_country: function(val){
        var val = val.split(' ').join('');
        if(val.length < 1){
            return null
        }

        //берем шаблон по первому символу
        // 7 Россия/Казахстан
        // 3 Беларуссия
        if(this.tld == 'ru' && this.hasMod('edit-country-code', 'yes')){
            var country_format = this.country_format[val.charAt(0)];
            if(country_format){
                this.phone_number_mask = country_format
            }
            else{
                return this.WRONG_COUNTRY_CODE
            }

            //проверяем на допустимость кода
            var country_code_len = 0
            if(val.charAt(0) == '7'){
                //магическая цифра но так оно и есть(
                country_code_len = 2
            }
            else if(val.charAt(0) == '3'){
                //магическая цифра но так оно и есть(
                country_code_len = 3
            }
            if(val.length >= country_code_len &&
                    $.inArray(val.slice(0, country_code_len), this.country_codes[this.tld]) == -1){
                //если код недопустим
                return this.WRONG_COUNTRY_CODE
            }
        }
    },

    validate_phone_number: function(ev, block) {
        var input = block.findElem('input');
        var value = block.val(),
            kcode =  ev.keyCode;
        var mask = this.phone_number_mask;
        var special_buttons = [8/*backspace*/, 9/*tab*/, 37/*left arrow*/, 39/*right arrow*/,
            46/*del*/, 13/*enter*/, 16/*shift*/, 35/*end*/, 36/*home*/];

        //del visible symbol if user delete space
        if(kcode ==  8){
            if(value.charAt(value.length-1) == ' '){
                input.val(value.slice(0, value.length-2));
                return false;
            }
        }

        //save ctrl
        if(kcode ==  17){
            this.ctrlDown = true;
        }

        //ctrl+v ctrl+c
        if((kcode == 86 || kcode == 67) && this.ctrlDown){
            setTimeout(function(){this.apply_mask(ev)}, 100);
            return true
        }

        //validate input symbol
        if(!(((48 <= kcode) && (kcode <= 57)) || //regular numbers
            ((96 <= kcode) && (kcode <= 105))|| //num-pud numbers
            (special_buttons.indexOf(kcode) != -1))
            ){
            return false;
        }

        //go to captcha by tab
//        if(kcode == 9){
//            var captcha_block = this.findBlockInside('b-antispam');
//            captcha_block.domElem.find('#captcha_answer').focus();
//            return false;
//        }

        //validate length of value
        if((value.length >= mask.length)){
            if(!(special_buttons.indexOf(kcode) != -1)){
                return false;
            }
        }

        //attempt to erase the gap
        var cursor_position = input[0].selectionStart;
        if(kcode == 8 && value[cursor_position-1]==' '){
            input[0].selectionStart = input[0].selectionEnd = cursor_position-1;
            return false;
        }
    },

    apply_mask: function(ev){
        var input = ev.block.findElem('input'),
            mask = this.phone_number_mask;
        var cursor_position = input[0].selectionStart;
        var value = ev.block.val();

        //устанавливаем маску номера по коду страны
        if(this.set_format_for_country(value) == this.WRONG_COUNTRY_CODE){
            this.showError(this.app_link.params.error_incorrect_country_code);
        }
        else{
            this.hideError();
        }

        //save ctrl
        if(ev.keyCode ==  17){this.ctrlDown = false;}

        var new_value = this._cleen_input_by_mask(value, mask);
        input.val(new_value);
        if((cursor_position + 1 != input[0].selectionStart) || (ev.keyCode == 8) || (ev.keyCode == 37) ||(ev.keyCode == 39)){
            input[0].selectionStart = input[0].selectionEnd= cursor_position;
        }
        if(input.val().length >= mask.length && this.hasNoError()){
            this.trigger('phone-full');
        }
        else{
            this.trigger('phone-incomplete');
        }
    },

    _cleen_input_by_mask: function(value, mask){
        //input must be jQuery object
        var value_as_array = value.split(' ').join('').split('');
        var mask_len = mask.length;
        var result_val = '';
        var i=0;
        for(i=0; (i<mask_len) && value_as_array.length ; i++){
            //emulation IE7 "Test String1".charAt(6)
            if(mask.charAt(i) == '-'){
                var char = value_as_array.shift();
                if(!isNaN(parseInt(char))){
                    result_val += char;
                }

            }
            else if(mask.charAt(i) == ' '){
                result_val += ' ';
            }
            else{
                result_val += mask.charAt(i);
            }
        }

        if(mask_len > i && mask.charAt(i) == ' '){
            result_val += mask.charAt(i);
        }
        return result_val
    }
});
(function() {

var instances,
    sysChannel,
    update = function () {
        var instance, i = 0;
        while(instance = instances[i++]) instance.val(instance.elem('input').val());
    },
    getActiveElement = function (doc) {
        // В iframe в IE9: "Error: Unspecified error."
        try { return doc.activeElement } catch (e) {}
    };

BEM.DOM.decl('b-form-input', {

    onSetMod : {

        'js' : function() {

            var _this = this,
                input = _this.elem('input'),
                activeElement = getActiveElement(_this.__self.doc[0]),
                haveToSetAutoFocus =
                    _this.params.autoFocus &&
                    !(activeElement && $(activeElement).is('input, textarea'));

            _this._val = input.val();

            if (activeElement === input[0] || haveToSetAutoFocus) {
                _this.setMod('focused', 'yes')._focused = true;
            }

            // факт подписки
            if(!sysChannel) {
                instances = [];
                sysChannel = _this.channel('sys')
                    .on({
                        'tick' : update,
                        'idle' : function() {
                            sysChannel.un('tick', update);
                        },
                        'wakeup' : function() {
                            sysChannel.on('tick', update);
                        }});
            }

            // сохраняем индекс в массиве инстансов чтобы потом быстро из него удалять
            _this._instanceIndex = instances.push(
                _this.bindTo(input, {
                    focus : _this._onFocus,
                    blur  : _this._onBlur
                })
            ) - 1;

            // шорткат для перехода в инпут - crtl+стрелка вверх
            _this.params.shortcut && _this.bindToDoc('keydown', function(e) {
                if(e.ctrlKey && e.keyCode == 38 && !$(e.target).is('input, textarea')) {
                    _this.setMod('focused', 'yes');
                }
            });
        },

        'disabled' : function(modName, modVal) {

            this.elem('input').attr('disabled', modVal == 'yes');

        },

        'focused' : function(modName, modVal) {

            if(this.hasMod('disabled', 'yes'))
                return false;

            var focused = modVal == 'yes';

            focused?
                this._focused || this._focus() :
                this._focused && this._blur();

            this.afterCurrentEvent(function() {
                this.trigger(focused? 'focus' : 'blur');
            });

        }

    },

    onElemSetMod : {

        'message' : {

            'visibility' : function(elem, modName, modVal) {

                var _this = this,
                    type = _this.getMod(elem, 'type');

                if(type) {
                    var needSetMod = true;
                    modVal || _this.elem('message', 'type', type).each(function() {
                        this != elem[0] && _this.hasMod($(this), 'visibility', 'visible') && (needSetMod = false);
                    });
                    needSetMod && _this.toggleMod('message-' + type, 'yes', '', modVal === 'visible');
                }

            }

        }

    },

    /**
     * Возвращает/устанавливает текущее значение
     * @param {String} [val] значение
     * @param {Object} [data] дополнительные данные
     * @returns {String|BEM} если передан параметр val, то возвращается сам блок, если не передан -- текущее значение
     */
    val : function(val, data) {

        if(typeof val == 'undefined') return this._val;

        if(this._val != val) {
            var input = this.elem('input');
            input.val() != val && input.val(val);
            this._val = val;
            this.trigger('change', data);
        }

        return this;

    },

    name : function(name) {
        return this.elem('input').attr('name');
    },

    _onFocus : function() {

        this._focused = true;
        return this.setMod('focused', 'yes');

    },

    _onBlur : function() {

        this._focused = false;
        return this.delMod('focused');

    },

    /**
     * Нормализует установку фокуса для IE
     * @private
     */
    _focus : function() {

        var input = this.elem('input')[0];
        if(input.createTextRange && !input.selectionStart) {
            var range = input.createTextRange();
            range.move('character', input.value.length);
            range.select();
        } else {
            input.focus();
        }

    },

    _blur : function() {

        this.elem('input').blur();

    },

    destruct : function() {

        this.__base.apply(this, arguments);

        this.params.shortcut && this.unbindFromDoc('keydown');
        instances.splice(this._instanceIndex, 1);

        var i = this._instanceIndex,
            instance;

        while(instance = instances[i++]) --instance._instanceIndex;

    }

});

BEM.HTML.decl('b-form-input', {

    onBlock : function(ctx) {

        var id = ctx.param('id') || ctx.generateId();

        ctx
            .tag('span')
            .tParam('id', id)
            .tParam('has-clear', ctx.mod('has-clear') === 'yes')
            .tParam('type', ctx.mod('type') || 'input')
            .afterContent(
                {
                    elem : 'box',
                    tag : 'span',
                    content : {
                        elem : 'input',
                        attrs : {
                            value : ctx.param('value'),
                            name : ctx.param('name'),
                            id : id
                        }
                    }
                })
            .js(true);

    },

    onElem : {

        'input' : function(ctx) {

            ctx.tag(ctx.tParam('type'));

        },

        'label' : function(ctx) {

            ctx
                .tag('label')
                .attr('for', ctx.tParam('id'));

        },

        'box': function (ctx) {

            if (ctx.tParam('has-clear')) {
                ctx.afterContent({elem: 'clear', tag: 'span'});
            }

        },

        'hint' : function(ctx) {

            ctx
                .tag('label')
                .attr('for', ctx.tParam('id'))

        }

    }

});

})();

(function() {

var timer,
    counter = 0,
    isIdle = false,
    idleInterval = 0,
    channel = BEM.channel('sys'),
    TICK_INTERVAL = 50;

BEM.decl('i-system', {}, {

    start : function() {

        $(document).bind('mousemove keydown', function() {
            idleInterval = 0;
            if(isIdle) {
                isIdle = false;
                channel.trigger('wakeup');
            }
        });

        this._tick();

    },

    _tick : function() {

        var _this = this;

        channel.trigger('tick', { counter : counter++ });

        if(!isIdle && (idleInterval += TICK_INTERVAL) > 3000) {
            isIdle = true;
            channel.trigger('idle');
        }

        timer = setTimeout(function() {
            _this._tick();
        }, TICK_INTERVAL);

    }

}).start();

})();
BEM.DOM.decl('b-form-input', {

    onSetMod : {

        'js' : function() {

            this.__base.apply(this, arguments);
            (this._hasHint = !!this.elem('hint')[0]) &&
                this
                    .on('change', this._updateHint)
                    ._updateHint();

        },

        'focused' : function() {

            this.__base.apply(this, arguments);
            this._hasHint && this._updateHint();

        }

    },

    /**
     * Показывает/скрывает хинт
     * @private
     */
    _updateHint : function() {

        this.toggleMod(this.elem('hint-wrap'), 'visibility', 'visible', !(this._focused || this.val()));

    }

});

(function() {

var cache = {};

BEM.decl('i-request', {

    get : function(request, onSuccess, onError, params) {

        if(!$.isFunction(onError)) {
            params = onError;
            onError = this.params.onError;
        }

        this._get(request, onSuccess, onError, $.extend({}, this.params, params));

    },

    _get : function(request, onSuccess, onError, params) {

        var key = this._buildCacheKey(request, params),
            cacheGroup = cache[params.cacheGroup];

        params.cache && cacheGroup && key in cacheGroup.data?
            onSuccess.call(this.params.callbackCtx, cacheGroup.data[key]) :
            this._do(request, onSuccess, onError, params);
    },

    _do : function(request, onSuccess, onError, params) {},

    _onSuccess : function(requestKey, request, data, params) {

        params.cache && this.putToCache(params, requestKey, data);

    },

    _buildCacheKey : function(obj, params) {

        return typeof obj == 'string' ? obj : $.param(obj);

    },

    putToCache : function(params, request, data) {

        var cacheGroup = cache[params.cacheGroup] || (cache[params.cacheGroup] = { keys : [], data : {}});

        if(cacheGroup.keys.length >= params.cacheSize) {
            delete cacheGroup.data[cacheGroup.keys.shift()];
        }

        var key = this._buildCacheKey(request, params);

        cacheGroup.data[key] = data;
        cacheGroup.keys.push(key);
    },
    
    /**
    Метод проверяет есть ли в кеше данные, соответствующие запросу и возвращает их, если они есть.
    
    @param {Object} params Параметры инстанса блока. 
                           В данном случае в этом объекте интересуют только поля cacheGroup и cache
    @param {String|Object} request Нечто, однозначно идентифицирующее запрос
                                   и ранее использованое при вызове метода putToCache 
    @returns Либо данные (могут быть разных типов) из кеша, либо undefined. */
    getFromCache : function(params, request) {

        var key = this._buildCacheKey(request, params),
            cacheGroup = cache[params.cacheGroup]
        ;
        if ( params.cache && cacheGroup && key in cacheGroup.data ) {
            return cacheGroup.data[key];
        }
    },

    dropCache : function() {

        delete cache[this.params.cacheGroup];

    },

    getDefaultParams : function() {

        return {
            cache : false,
            cacheGroup : 'default',
            cacheSize : 100,
            callbackCtx : this
        };

    }

});

})();
BEM.decl({ block : 'i-request_type_ajax', baseBlock : 'i-request' }, {

    onSetMod : {

        'js' : function() {

            this.__base();
            this._requestNumber = this._number = this._preventNumber = this._retryCount = 0;

        }

    },

    _get : function(request, onSuccess, onError, params) {

        this._number++;
        this._requestNumber++;
        this._retryCount = params.retryCount;

        this.__base.apply(this, arguments);

    },

    _do : function(request, onSuccess, onError, params) {

        var _this = this;
        if(_this._number > _this._preventNumber) { // условие на случай, если кто-то синхронно позовет preventCallbacks
            var args = arguments,
                settings = {
                    data : params.data?
                        $.extend({}, params.data, request) :
                        request,
                    success : _this._wrapCallback(function(respArgs, requestNumber, number) {
                            _this._onSuccess(_this._buildCacheKey(request, params), request, respArgs[0], params);
                            _this._allowCallback(requestNumber, number) &&
                            onSuccess.apply(params.callbackCtx, respArgs);
                        }),
                    error : _this._wrapCallback(function(respArgs, requestNumber, number) {
                            _this._allowCallback(requestNumber, number) &&
                                (_this._retryCount-- > 0?
                                    setTimeout(
                                        function() {
                                            _this._do.apply(_this, args);
                                        },
                                        params.retryInterval) :
                                    onError && onError.apply(params.callbackCtx, respArgs));
                            })
                };

            $.each(['url', 'dataType', 'timeout', 'type', 'jsonp', 'jsonpCallback'].concat(params.paramsToSettings || []), function(i, name) {
                settings[name] = params[name];
            });

            $.ajax(settings);
        }

    },

    _wrapCallback : function(callback) {

        var requestNumber = this._requestNumber,
            number = this._number;

        return function(data) {
            data !== null && callback(arguments, requestNumber, number);
        };

    },

    _allowCallback : function(requestNumber, number) {

        return number > this._preventNumber && this._requestNumber == requestNumber;

    },

    _buildCacheKey : function(obj, params) {

        return typeof obj == 'string'?
            obj :
            this.__base(obj) + params.url;

    },

    abort : function() {

        this._preventNumber = ++this._number;

    },

    /**
     * @deprecated использовать abort
     */
    preventCallbacks : function() {

        this.abort();

    },

    getDefaultParams : function() {

        return $.extend(
            this.__base(),
            {
                cache         : true,
                type          : 'GET',
                dataType      : 'jsonp',
                timeout       : 20000,
                retryCount    : 0,
                retryInterval : 2000
            });

    }

});

BEM.decl({ name : 'b-form-input__dataprovider', baseBlock : 'i-request_type_ajax' }, {

    get : function(request, callback) {

        return this.__base(
            { part : request },
            function(data) {
                callback.call(this, { items: data[1], metainfo: data[2] })
            });

    }

});

BEM.DOM.decl({ name : 'b-form-input', modName : 'has-clear', modVal : 'yes' }, {

    onSetMod : {

        'js' : function() {

            this.__base.apply(this, arguments);
            this
                .on('change', this._updateClear)
                ._updateClear();

        }

    },

    _onClearClick : function() {

        this.trigger('clear');
        this.removeInsets &&
            this.removeInsets();

        this
            .val('')
            .setMod('focused', 'yes');

    },

    _updateClear : function() {

        return this.toggleMod(this.elem('clear'), 'visibility', 'visible', '', !!this._val);

    }

}, {

    live : function() {

        this.__base();
        this.liveBindTo('clear', 'leftclick', function() {
            this._onClearClick();
        });

        return false;

    }

});
(function($) {

var HTML = BEM.HTML,
    DOM = BEM.DOM,

    /** {HTMLElement} */
    activeNode;

// LEGO-3098
$(function() {
    $(window).bind('focus', function() {
        activeNode = document.activeElement;
    });
});

DOM.decl({ name : 'b-form-input', modName : 'autocomplete', modVal : 'yes' }, {

    onSetMod : {

        'js' : function() {

            var _this = this;

            _this.params.foot && (_this.foot = _this.params.foot); // упячка!

            _this._preventRequest = true;
            _this._isPopupShown = false;

            _this.__base.apply(_this, arguments);

            // последнее значение, введенное пользователем с клавиатуры
            _this._userVal = _this.val();

            // выключаем браузерный автокомплит
            var focused = _this._focused;
            focused && _this.delMod('focused');
            _this.elem('input').attr('autocomplete', 'off');
            _this._preventRequest = false;
            focused && _this.setMod('focused', 'yes');

            _this._items = [];
            _this._curItemIndex = -1;

            _this._doRequest = $.debounce(_this._doRequest, _this.params.debounceDelay);

        },

        'focused' : {

            'yes' : function() {

                this.__base();
                // Не открывать автокомплит по фокусу при наличии параметра `showListOnFocus`
                var onChangeFn = this.params.showListOnFocus ?
                    this._onChange() : this._onChange;
                this.on('change', onChangeFn);

            },

            '' : function() {

                this.__base();
                this
                    .un('change', this._onChange)
                    ._preventHide || this._getPopup().hide();

            }

        }

    },

    onElemSetMod : {

        'popup' : {

            'fixed' : {

                'yes' : function() {
                    this._isPopupShown && this.afterCurrentEvent(function() {
                        this._updatePopupPos();
                    });
                },

                '' : function() {
                    this._isPopupShown && this.afterCurrentEvent(function() {
                        this._updatePopupPos();
                    });
                }

            }

        }

    },

    /**
     * Возвращает dataprovider
     */
    getDataprovider: function() {

        return this._dataprovider || (this._dataprovider = BEM.create(
            this.params.dataprovider.name || this.__self.getName() + '__dataprovider',
            $.extend(this.params.dataprovider, { callbackCtx : this })));

    },

    _onChange : function() {

        /**
         * (LEGO-3098) Не отправлять запрос и не показывать попап
         * при переключении между вкладками
         */
        activeNode === this.elem('input')[0] ?
            activeNode = null :
            this._preventRequest || this._doRequest();

        return this._onChange;

    },

    _onKeyDown : function(e) {

        var isArrow = e.keyCode == 38 || e.keyCode == 40;

        if(isArrow && !e.shiftKey) {
            e.preventDefault();
            var len = this._items.length,
                out = false;
            if(len) {
                var direction = e.keyCode - 39, // пользуемся особенностями кодов клавиш "вверх"/"вниз" ;-)
                    index = this._curItemIndex,
                    i = 0;

                do {
                    // если выбор перемещается с крайнего элемента вовне списка,
                    // то ставим фокус на инпут и возвращаем в него пользовательское значение
                    out = ((index == 0 && direction == -1) || (index + direction >= len)) && this._onLeaveItem(this._items[index], true);

                    index += direction;
                    index = index < 0? len - 1 : index >= len? 0 : index;
                } while(!out && this._onEnterItem(this._items[index], true) === false && ++i < len);
            }
        }

    },

    _onKeyPress : function(e) {

        if (e.keyCode == 13 &&
            this._curItemIndex > -1 &&
            this._isCurItemEnteredByKeyboard) {

            e.preventDefault();
            this._onSelectItem(this._items[this._curItemIndex], true);
        }

    },

    /**
     * Ленивое получение попапа
     * @returns {BEM} блок попапа
     */
    _getPopup : function() {

        var _this = this;
        if(!_this._popup) {
            var keyDownEvent = $.browser.opera? 'keypress' : 'keydown',
                block = _this.__self.getName(),
                content = [{ elem : 'items', tag : 'ul', mix : [{ block : block, elem : 'popup-items' }]},
                    { block: 'b-form-input', elem: 'shadow', tag: 'i' }
                ];

            _this._hasPopupFade() && content.push({ block : block, elem : 'fade' });

            _this._popup = $(HTML.build({
                    block : 'i-popup',
                    mix : [
                        {
                            block : block,
                            elem : 'popup',
                            mods : _this.params.popupMods,
                            js : { uniqId: _this._uniqId }
                        }
                    ],
                    content : content
                })).bem('i-popup')
                    .on({
                        'show' : function() {
                            _this
                                .bindTo('keypress', _this._onKeyPress)
                                .bindTo(keyDownEvent, _this._onKeyDown)
                                .bindToWin('resize', _this._updatePopupPos)
                                ._isPopupShown = true;
                        },
                        'outside-click' : function(e, data) {
                            _this.containsDomElem($(data.domEvent.target)) && e.preventDefault();
                        },
                        'hide' : function() {
                            _this
                                .unbindFrom('keypress ' + keyDownEvent)
                                .unbindFromWin('resize')
                                ._curItemIndex = -1;
                            _this._isPopupShown = false;
                        }
                    });

            // при первом создании попапа подписываемся на live-события его элементов
            $.each({
                    mouseover : _this._onEnterItem,
                    mouseout  : _this._onLeaveItem,
                    mousedown : _this._onSelectItem
                }, function(e, fn) {
                    BEM.blocks['b-autocomplete-item'].on(_this._popup.domElem, e, function(e) {
                        fn.call(_this, e.block);
                    });
                });

            DOM.init(_this._popup.domElem);
        }

        return _this._popup;

    },

    _hasPopupFade : function() {

        return (this.params.popupMods || {}).fade == 'yes';

    },

    _updatePopupPos : function() {

        var box = this.elem('box'),
            css = box.offset();

        css.top += box.outerHeight();
        this.hasMod(this.elem('popup'), 'fixed') && (css.top -= DOM.win.scrollTop());
        this._hasPopupFade() && (css.width = box.outerWidth());

        this._getPopup().show(css);

    },

    _onEnterItem : function(item, byKeyboard) {

        if(item.hasMod('enterable', 'no')) return false;

        var items = this._items,
            index = this._curItemIndex;

        index > -1 && items[index].delMod('hovered');
        index = this._getItemIndex(item);
        index > -1 && items[index].setMod('hovered', 'yes');

        this._curItemIndex = index;
        this._isCurItemEnteredByKeyboard = !!byKeyboard;

        if(byKeyboard && this.params.updateOnEnter) {
            this._preventRequest = true;
            this
                .val(
                    item.enter() !== false? item.val() : this._userVal,
                    { source : 'autocomplete', itemIndex: this._curItemIndex })
                .del('_preventRequest');
        }

    },

    _onLeaveItem : function(item, byKeyboard) {

        var index = this._curItemIndex;
        if(index > -1 && index == this._getItemIndex(item)) {
            this._items[index].delMod('hovered');
            this._curItemIndex = -1;
        }

        byKeyboard && this.val(this._userVal);

        return true;

    },

    _onSelectItem : function(item, byKeyboard) {

        var selectResult = item.select(byKeyboard || false),
            needUpdate = (typeof selectResult == 'object')
                             ? selectResult.needUpdate
                             : selectResult !== false,
            needEvent = (typeof selectResult == 'object') && selectResult.needEvent;
        this._preventRequest = true;
        needUpdate && this
            .val(
                this._userVal = item.val(),
                { source : 'autocomplete', itemIndex: this._curItemIndex })
            ._getPopup().hide();

        if(byKeyboard) {
            this.del('_preventRequest');
        } else {
            needUpdate || (this._preventHide = true);
            this.afterCurrentEvent(function() {
                this
                    .setMod('focused', 'yes')
                    .del('_preventRequest', '_preventHide');
            });
        }

        (needUpdate || needEvent) && this.trigger('select', { item: item, byKeyboard: byKeyboard });

    },

    _getItemIndex : function(item) {

        return $.inArray(item, this._items);

    },

    _doRequest : function() {

        var _this = this;
        _this._userVal = _this.val();
        _this
            .trigger('data-requested')
            .getDataprovider().get(
                _this.val(),
                function(data) {
                    _this.trigger('data-received', data);

                    var popup = _this._getPopup(),
                        dataItems = data.items || data;

                    _this.foot && dataItems.length && ($.inArray(_this.foot, dataItems) == -1) && dataItems.push(_this.foot);

                    if(dataItems.length) {
                        _this._curItemIndex = -1;
                        DOM.update(popup.elem('items'), _this._buildItemsHtml(dataItems), function() {
                            _this._updatePopupPos();
                            _this._items = popup.findBlocksInside('b-autocomplete-item');
                            _this.trigger('update-items');
                        });
                    } else {
                        popup.hide();
                    }
                });

    },

    _buildItemsHtml : function(data) {

        return HTML.build($.map(data, function(data, i) {
            return {
                block : 'b-autocomplete-item',
                data  : data,
                mods  : { type : $.isArray(data)? data[0] : 'text' }
            };
        }));

    },

    setFoot : function(data) {

        return this.foot = data;

    },

    getDefaultParams : function() {

        return $.extend(this.__base(), {
            updateOnEnter : true,
            debounceDelay : 50,
            showListOnFocus: true
        });

    }

});

})(jQuery);

(function($) {

var HTML = BEM.HTML,
    DOM = BEM.DOM;

DOM.decl({ name : 'b-form-input', modName : 'autocomplete', modVal : 'yes' }, {
    _doRequest : function() {

        var _this = this;
        _this._userVal = _this.val();
        _this
            .trigger('data-requested')
            .getDataprovider().get(
            _this.val(),
            function(data) {
                _this.trigger('data-received', data);

                var popup = _this._getPopup(),
                    dataItems = data.items || data;

                _this.foot && dataItems.length && ($.inArray(_this.foot, dataItems) == -1) && dataItems.push(_this.foot);

                if(dataItems.length) {
                    _this._curItemIndex = -1;
                    DOM.update(popup.elem('items'), _this._buildItemsHtml(dataItems), function() {
                        _this._updatePopupPos();
                        _this._items = popup.findBlocksInside('b-autocomplete-item');
                        _this.trigger('update-items');
                    });
                } else {
                    if(_this._userVal.length > 0){
                        var not_found = "Попробуйте уточнить запрос",
                            platform_choice = this.findBlockOutside && this.findBlockOutside('b-platform-choice');
                        if (platform_choice){
                            not_found = platform_choice.params.i18n.not_found;
                        }

                        DOM.update(popup.elem('items'), '<li class="title-of-sugest">' + not_found + '</li>', function() {
                            _this._updatePopupPos();
                            _this._items = popup.findBlocksInside('b-autocomplete-item');
                        });
                    }
                }
            });

    },
    _onEnterItem : function(item, byKeyboard) {

        if(item.hasMod('enterable', 'no')) return false;

        var items = this._items,
            index = this._curItemIndex;

        index > -1 && items[index].delMod('hovered');
        index = this._getItemIndex(item);
        index > -1 && items[index].setMod('hovered', 'yes');

        this._curItemIndex = index;
        this._isCurItemEnteredByKeyboard = !!byKeyboard;

        if(byKeyboard && this.params.updateOnEnter) {
            this._preventRequest = true;

            //del platform name
            var item_val = item.val().slice(0, item.val().indexOf(item.domElem.find('.platform-name').text()));

            this
                .val(
                item.enter() !== false? item_val : this._userVal,
                { source : 'autocomplete', itemIndex: this._curItemIndex })
                .del('_preventRequest');
        }

    }
});

})(jQuery);

BEM.HTML.decl({ block : 'b-autocomplete-item', modName : 'type', modVal : 'hl' }, {

    onBlock : function(ctx) {

        ctx.content($.map(ctx.param('data').slice(1), function(chunk) {
            return $.isArray(chunk)?
                { tag : 'span', elem : 'highlight', content : chunk[0] } :
                chunk;
        }));

    }

});


BEM.HTML.decl({ block : 'b-autocomplete-item', modName : 'type', modVal : 'fact' }, {

    onBlock : function(ctx) {

        var data = ctx.param('data').slice(1);

        ctx.content([
            { tag : 'span', elem : 'text', content : data[0] },
            { tag : 'span', elem : 'fact', content : [' — ', data[1]] }
        ]);

    }

});

BEM.DOM.decl({ block : 'b-autocomplete-item', modName : 'type', modVal : 'nav' }, {

   enter : function() {

       return false;

   },

    /**
     * Действие на выбор пункта
     * @param {Boolean} [byKeyboard=false] выбор осуществлен клавиатурой
     * @returns {Boolean=true} Если возвращается false, значит пункт сам сделал все необходимые действия
     * @returns {Object.<needUpdate|needEvent>}
     */
    select : function(byKeyboard) {
        // открываем ссылку только когда выбрали с помощью клавиатуры, если выбрали мышкой, то сработает обычная ссылка
        byKeyboard && $('<form style="display:none" action="' + this.val() + '" target="_blank"/>')
            .appendTo('body')
            .submit()
            .remove();

        return { needEvent: true };

    }

});

BEM.HTML.decl({ block : 'b-autocomplete-item', modName : 'type', modVal : 'nav' }, {

    onBlock : function(ctx) {

        var data = ctx.param('data'),
            urlData = data[3] || data[2],
            url = (urlData.match(/^\w[\w-]*:\/\//g)? '' : 'http://') + urlData;

        ctx
            .js({ val : url })
            .content({
                elem : 'link',
                url  : url,
                data : data });

    },

    onElem : {

        'link' : function(ctx) {

            var data = ctx.param('data');
            ctx
                .tag('a')
                .attrs({ href : ctx.param('url'), target : '_blank' })
                .content([
                    { elem : 'link-url', tag : 'span', content : data[2] },
                    { elem : 'link-info', tag : 'span', content : '&nbsp;&mdash; ' + data[1] }
                    ]);

        }


    }

});

BEM.HTML.decl({ block : 'b-autocomplete-item', modName : 'type', modVal : 'nah' }, {
    onBlock : function(ctx) {

        ctx.content(ctx.param('data')[1])

    }
});

BEM.DOM.decl({ block : 'b-autocomplete-item', modName : 'type', modVal : 'foot' }, {

    select : function() {
        return false;
    }

});

BEM.HTML.decl({ block : 'b-autocomplete-item', modName : 'type', modVal : 'foot' }, {

    onBlock : function(ctx) {

        ctx
            .mod('enterable', 'no')
            .content($.map(ctx.param('data').slice(1), function(chunk) {
                return $.isArray(chunk)?
                    { tag : 'span', elem : 'foot', content : chunk[0] } :
                    chunk;
            }));

    }

});


BEM.DOM.decl({ name : 'b-form-input', modName : 'with-id', modVal : 'yes' }, {
    valId : function() { return this._valIdN(1); },
    valId2 : function() { return this._valIdN(2); },
    valId3 : function() { return this._valIdN(3); },
    _valIdN: function(n) {
        var valId,
            value = $.trim(this.val());
        for (var i = 0; i < (this._allSuggestedValues || []).length; ++i) {
            var elm = this._allSuggestedValues[i];
            if (value.toLowerCase() == (elm[0] + '').toLowerCase()) {
                valId = elm[n];
                break;
            }
        }
        return valId;
    },
    _buildItemsHtml : function(data) {
        arguments[0] = this._prepareData(data);
        return this.__base.apply(this, arguments);
    },
    _prepareData: function(data) {
        var newData = [];
        this._allSuggestedValues || (this._allSuggestedValues = []);
        for (var i = 0; i < data.length; ++i) {
            var value = data[i],
                isExist = false;
            // Проверяем на существование
            for (var j = this._allSuggestedValues.length - 1; j >= 0; --j) {
                var elm = this._allSuggestedValues[j];
                if (value[1] == elm[1]) {
                    isExist = true;
                    break;
                }
            }
            if ( ! isExist) {
                this._allSuggestedValues.push(value);
            }
            newData.push(value[0]);
        }
        return newData;
    }
});
BEM.DOM.decl('b-form-button', {

    onSetMod : {

        'js' : function() {

            var disabled = this.isDisabled();

            (this._href = this.domElem.attr('href')) && disabled &&
                this.domElem.removeAttr('href');

            this.elem('input').attr('disabled', disabled);

        },

        'focused' : {

            'yes' : function() {

                if(this.isDisabled())
                    return false;

                var _this = this;

                _this
                    .bindTo('keydown', this._onKeyDown)
                    .elem('input').focus();

                _this._unloadInited ||
                    (_this._unloadInited = $(window).bind('unload', function() {
                        _this.delMod('focused');
                    }));

            },

            '' : function() {

                this
                    .unbindFrom('keydown')
                    .elem('input').blur();

            }

        },

        'disabled' : function(modName, modVal) {

            var disable = modVal == 'yes';

            this.elem('input').attr('disabled', disable);

            this._href && (disable?
                this.domElem.removeAttr('href') :
                this.domElem.attr('href', this._href));

            disable && this.domElem.keyup();

        },

        'pressed' : function(modName, modVal) {

            this.isDisabled() || this.trigger(modVal == 'yes'? 'press' : 'release');

        },

        'hovered' : {

            '' : function() {

                this.delMod('pressed');

            }

        },

        '*' : function(modName) {

            if(this.isDisabled() && 'hovered pressed'.indexOf(modName) > -1)
                return false;

        }

    },

    /**
     * Шорткат для проверки модификатора disabled_yes
     * @returns {Boolean}
     */
    isDisabled : function() {

        return this.hasMod('disabled', 'yes');

    },

    /**
     * Получение/установка урла (для кнопки-ссылки)
     * @param {String} [val] урл
     */
    url : function(val) {

        if(typeof val == 'undefined') {
            return this._href;
        } else {
            this._href = val;
            this.isDisabled() || this.domElem.attr('href', val);
            return this;
        }

    },

    _onKeyDown : function(e) {

        var keyCode = e.keyCode;
        // имитируем state_pressed по нажатию на enter и space
        if((keyCode == 13 || keyCode == 32) && !this._keyDowned) {
            this._keyDowned = true;
            this
                .setMod('pressed', 'yes')
                .bindTo('keyup', function() {
                    this
                        .delMod('pressed')
                        .unbindFrom('keyup');
                    delete this._keyDowned;
                    // делаем переход по ссылке по space
                    if(keyCode == 32 && this.domElem.attr('href')) {
                        document.location = this.domElem.attr('href');
                    }
                });
        }

    },

    _onClick : function(e) {

        this.isDisabled()?
            e.preventDefault() :
            this.afterCurrentEvent(function() {
                this.trigger('click');
            });
    },
    destruct : function () {
        this.delMod('focused');
        this.__base.apply(this, arguments);
    }

}, {

    live : function() {

        var eventsToMods = {
            'mouseover' : { name : 'hovered', val : 'yes' },
            'mouseout' : { name : 'hovered' },
            'mousedown' : { name : 'pressed', val : 'yes' },
            'mouseup' : { name : 'pressed' },
            'focusin' : { name : 'focused', val : 'yes' },
            'focusout' : { name : 'focused' }
        };

        this
            .liveBindTo('leftclick', function(e) {
                this._onClick(e);
            })
            .liveBindTo('mouseover mouseout mouseup focusin focusout', function(e) {
                var mod = eventsToMods[e.type];
                this.setMod(mod.name, mod.val || '');
            })
            .liveBindTo('mousedown', function(e) {
                var mod = eventsToMods[e.type];
                e.which == 1 && this.setMod(mod.name, mod.val || '');
            });
    }

});

BEM.HTML.decl('b-form-button', {

    onBlock : function(ctx) {

        ctx
            .tag(ctx.param('url')? 'a' : 'span')
            .attrs({ href : ctx.param('url'), target : ctx.param('target') })
            .mods({
                size : ctx.mod('size'),
                theme : ctx.mod('theme')
            })
            .content(
                [
                    { elem : 'left', tag : 'i' },
                    {
                        elem : 'content',
                        tag : 'span',
                        content : {
                            elem : 'text',
                            tag : 'span',
                            content : ctx.content()
                        }
                    }
                ],
                true)
            .afterContent(
                ctx.param('type')?
                    {
                        elem : 'input',
                        attrs : {
                            value : ctx.param('value') || '',
                            type : ctx.param('type'),
                            name : ctx.param('name'),
                            disabled : ctx.mod('disabled') && 'disabled'
                        }
                    } :
                    { elem : 'click' })
            .js(true);

    },

    onElem : {

       'input' : function(ctx) {

           ctx.tag('input');

       },

       'click' : function(ctx) {

           ctx.tag('i');

       }

    }

});

(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl({block: "b-form-button", modName: "counter"}, {

        onSetMod: {

            js: function() {
                this.__base.apply(this, arguments);

                //получаем счетчик для локали
                var counter_name = 'yaCounter' + ({
                        'ua': '20345062',
                        'ru': '17710429'
                    })[window.location.hostname.split('.').pop()],
                    yaCounter = window[counter_name];

                this.on("click", function(e) {
                    var target = this.getMod('counter').replace(/-/g, "_");
                    if (target && target != 'empty' && yaCounter) {
                        yaCounter.reachGoal(target);
                    }
                    return true;
                });
            }
        }
    });

}(this, this.jQuery));
BEM.HTML.decl('b-icon', {

    onBlock : function(ctx) {

        var a = { src: '//web.archive.org/web/20130424113517/http://yandex.st/lego/_/La6qi18Z8LwgnZdsAr1qy1GwCwo.gif', alt: '' },
            params = ctx.params(),
            props = ['alt', 'width', 'height'], p;

        params.url && (a.src = params.url);
        while(p = props.shift()) params[p] && (a[p] = params[p]);

        ctx
           .tag('img')
           .attrs(a);

    }

});

(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl("b-applink-email", {
        onSetMod: {
            js: function() {
                var self = this;
                self.popup = self.findBlockInside({blockName: 'b-popupa', modName: 'type', modVal: 'send-sms'});
                self.emailInput = self.findBlockInside({blockName: 'b-form-input', modName: 'type', modVal: 'email'});
                self.submitButton = self.findBlockInside({blockName: 'b-form-button', modName: 'type', modVal: 'applink-email'});
                self.errorSpan = self.findBlockInside('l-grid').findElem('error');

                self.captchaBlock = self.findBlockInside('b-captcha');
                self.captchaCode = self.findBlockInside({block: "b-form-input", modName: "type", modVal: "captcha-code"});
                self.captchaWrapper = self.findBlockInside({block: "b-static-text", modName: "type", modVal: "captcha-image"});
                self.captchaInput = self.findBlockInside({block: "b-form-input", modName: "type", modVal: "captcha-input"});
                self.captchaUpdateLink = self.findBlockInside({block: "b-link", modName: 'type', modVal: 'captcha-update'});

                self.csrf_setup();

                self.emailInput.on('change', {self: self}, self.email_validation_on_change);

                /**
                 * Update captcha link
                 */
                BEM.blocks['b-link'].on(self.domElem, 'click', function(e) {
                    var block = e.block, type = block.getMod('type');

                    if (type === "captcha-update") {
                        self.getNewCaptcha();
                    }
                });

                /**
                 * Captcha code input
                 */
                BEM.blocks['b-form-input'].on(self.domElem, 'change', function(e) {
                    var type = e.block.getMod('type');

                    if (type == 'captcha-input'){
                        self.toggleSubmitButton();
                    }
                });

                /**
                 * Get link to sms
                 */
                BEM.blocks['b-form-button'].on(self.domElem, 'click', function(e){
                    var block = e.block,
                        type = block.getMod('type');

                    switch (type) {
                        case 'applink-email':
                            var data = {
                                    "email": self.emailInput.val(),
                                    "app_slug": self.params.app,
                                    "platform_slug": self.params.platform || '',
                                    "captcha_code":self.captchaCode.val(),
                                    "captcha_input":self.captchaInput.val()
                                };

                            $.post(self.params.url, data, function(response) {
                                self.popup.findElem('content').html(response.content);
                                self.popup.toggle();
                                if(response.status == 'ok'){
                                    self.resetForm();
                                }
                                else{
                                    self.getNewCaptcha();
                                }

                            }, 'json');
                            break;
                    }
                });
            }
        },

        resetForm: function(){
            this.emailInput.val('');
            this.hideCaptcha();
        },

        checkEmailByMask: function(emil){
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            return reg.test(emil);
        },

        toggleSubmitButton: function(){
            if(this.checkEmailByMask(this.emailInput.val()) && this.captchaInput.val().length){
                this.submitButton.delMod('disabled');
            }
            else{
                this.submitButton.setMod('disabled', 'yes');
            }
        },

        getNewCaptcha: function(){
            var self = this;

            //хак для ие, добавляем рандомный параметр
            var url = self.captchaUpdateLink.params.url + "?rand=" + Math.random().toString();
            $.get(url, function(response) {
                // Update Captcha
                var newCaptcha = $('<img/>', {
                    "alt" : "captcha-img",
                    "class" : "b-icon",
                    "src" : response.image_url
                });

                BEM.DOM.update($(self.captchaWrapper.domElem),
                               newCaptcha);
                self.captchaInput.val('');
                self.captchaCode.val(response.captcha_code);
            });
        },

        showCaptcha: function(){
            //если емэйл валидный и капчи нет грузим новую
            if(!this.captchaCode.val()){
                this.getNewCaptcha()
            }

            //если емэйл валидный показываем блок капчи
            if(this.captchaBlock.hasMod('visibility', 'hidden')){
                this.captchaBlock.delMod('visibility');
            }
        },

        toggleCaptcha: function(){
            if(this.checkEmailByMask(this.emailInput.val())){
                this.showCaptcha();
            }
            else{
                this.hideCaptcha();
            }
        },

        hideCaptcha: function() {
            this.captchaBlock.setMod('visibility', 'hidden');
            this.captchaCode.val('');
        },

        email_validation_on_change: function(ev){
            var valid_characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-.@',
                rus_alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя";

            var wrong_symbols_flag = false,
                rus_symbol_flag = false,
                email = ev.block.val(),
                self = ev.data.self;

            self.toggleSubmitButton();
            self.toggleCaptcha();

            for(var i = email.length-1; i >= 0; i-- ){
                if(rus_alphabet.indexOf(email.charAt(i)) > -1){
                    rus_symbol_flag = true;
                    break;
                }
                if(valid_characters.indexOf(email.charAt(i)) == -1){
                    wrong_symbols_flag = true;
                    break;
                }
            }
            if(rus_symbol_flag){
                self.setError(self.params.error_cyrillic_symbols + '.');
            }
            else if(wrong_symbols_flag){
                self.setError(self.params.error_incorrect_email);
            }
            else{
                self.hideError();
            }
        },

        setError: function(msg){
            this.errorSpan.text(msg);
            this.setMod('state', 'error');
        },

        hideError: function(msg){
            this.setMod('state', 'form');
        },

        csrf_setup: function(){
            $(document).ajaxSend(function(event, xhr, settings) {
                function getCookie(name) {
                    var cookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = jQuery.trim(cookies[i]);
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }
                function sameOrigin(url) {
                    // url could be relative or scheme relative or absolute
                    var host = document.location.host; // host + port
                    var protocol = document.location.protocol;
                    var sr_origin = '//' + host;
                    var origin = protocol + sr_origin;
                    // Allow absolute or scheme relative URLs to same origin
                    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
                        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                        // or any other URL that isn't scheme relative or absolute i.e relative.
                        !(/^(\/\/|http:|https:).*/.test(url));
                }
                function safeMethod(method) {
                    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                }

                if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            });
        }
    });

}(this, this.jQuery));

BEM.DOM.decl("b-map-download", {
    onSetMod: {
        js: function() {


            var self = this;
            self.submit_button = self.findBlockInside({blockName:'b-form-button', modName: 'type', modVal: "submit"});
            var city_suggest = this.findBlockInside({blockName: "b-form-input", modName: "type", modVal: "city-suggest"});
            self.paramsLink = this.findBlockInside({blockName:"b-link", modName:"type", modVal:"maps-additional-params"});
            self.typeOfMapsRadioButton = this.findBlockInside({blockName: "b-form-radio", modName:'type', modVal:"layer"});
            self.typeDownloadsOfMapsRadioButton = this.findBlockInside({blockName: "b-form-radio", modName:'type', modVal:"size"});
            self.additionalBlock = this.findElem('message');
            city_suggest.on("change",function(ev){
                self.delMod('state');
                self.submit_button.setMod('disabled', 'yes');
            }).on("select",function(ev){
                $.ajax({
                    url: '/maps/get-map-info/',
                    dataType: 'json',
                    data: {'city': ev.target.val()},
                    success: function(data){
                        self.update_map_data(data);
                        self.submit_button.delMod('disabled');
                        self.setMod('state', 'add-link');
                    }
                })
            });

            self.paramsLink.on("click", function(){
                self.toggleMod('state', 'add-link', 'add-form');
            });

            self.submit_button.on('click',function(ev){
                if(ev.block.hasMod('disabled')){
                    return false;
                }
                var current_mup = self.getCurrentMap();
                if(current_mup){
                    window.location = current_mup.url;
                }
                return false;
            });

            self.typeOfMapsRadioButton.findElem('button').on('click', function(ev){
                //prevent click on disabled button
                if(self.typeOfMapsRadioButton.getMod($(this), 'disabled') === 'yes'){
                    return false;
                }
            });

            self.typeDownloadsOfMapsRadioButton.findElem('button').on('click', function(ev){
                //prevent click on disabled button
                if(self.typeDownloadsOfMapsRadioButton.getMod($(this), 'disabled') === 'yes'){
                    return false;
                }
            });

            self.typeOfMapsRadioButton.on('change', function(ev){
                //update info about size of map
                self.update_map_data();
            });

            self.typeDownloadsOfMapsRadioButton.on('change', function(ev){
                //update info about size of map
                self.update_map_data();
            });



        }
    },

    update_map_data:function(data){
        if(data){
            //set default map on select city
            this.map_data = data;
            this.typeOfMapsRadioButton.domElem
                .find('.b-form-radio__button_disabled_yes')
                .removeClass('b-form-radio__button_disabled_yes');

            if(data.map && data.pmap){
                this.typeOfMapsRadioButton.val('scheme');
            }
            else if(!data.map && data.pmap){
                this.typeOfMapsRadioButton.domElem
                    .find('input[value="scheme"]').parents('label')
                    .addClass('b-form-radio__button_disabled_yes');
                this.typeOfMapsRadioButton.val('popular');
            }
            else if(data.map && !data.pmap){
                this.typeOfMapsRadioButton.domElem
                    .find('input[value="popular"]').parents('label')
                    .addClass('b-form-radio__button_disabled_yes');
                this.typeOfMapsRadioButton.val('scheme');
            }
            this.typeDownloadsOfMapsRadioButton.val('full');
        }
        if(this.map_data){
            //generate message about map size
            var platformName = this.getPlatformName(),
                current_map = this.getCurrentMap(),
                mb = 1024*1024;

            this.additionalBlock.find('.platform-name').text(platformName);
            this.additionalBlock.find('.download-size').text((current_map.downloadsize/mb).toFixed(2));
            this.additionalBlock.find('.divice-disk-size').text((current_map.size/mb).toFixed(2));
        }
    },

    getPlatformName: function(){
        if($('.b-platform-choice-simple .b-menu__item_state_current').length){
            return $('.b-platform-choice-simple .b-menu__item_state_current').text();
        }
        else if($.cookie('platform') && $.cookie('platform_name')){
            return $.cookie('platform_name');
        }
        return '';
    },


    getCurrentMap: function(){
        var current_map = {},
            layer = 'map',
            type = this.typeDownloadsOfMapsRadioButton.val();
        if(this.typeOfMapsRadioButton.val() == 'popular'){
            layer = 'pmap'
        }

        for(var i=0; i<this.map_data[layer].length; i++){
            if(this.map_data[layer][i].type == type){
                current_map = this.map_data[layer][i]
            }
        }

        return current_map
    }
});


(function(BEM, undefined) {

/**
@namespace JS-API блока b-form-radio
@name block */

BEM.DOM.decl('b-form-radio', /** @lends block.prototype */ {

    onSetMod: {

        'js' : function() {

            var _this = this;

            try {
                // В iframe в IE9 происходит "Error: Unspecified error."
                var activeNode = _this.__self.doc[0].activeElement;
            } catch(e) {}

            _this._val = this.findElem(this.elem('button', 'checked', 'yes'), 'radio').val();

            _this.elem('radio').each(function() {
                var mods = [];

                activeNode === this && (mods.push('focused'));
                this.checked && (mods.push('checked'));

                if(mods[0]) {
                    var button = _this.__self._getButtonByElem($(this));
                    $.each(mods, function(i, modName) {
                        _this.setMod(button, modName, 'yes');
                    });
                }
            });

        }

    },

    onElemSetMod : {

        'button' : {

            'focused' : {

                'yes' : function(elem) {
                    this
                        .delMod(this.elem('button', 'focused', 'yes'), 'focused')
                        .findElem(elem, 'radio').focus();
                }

            },

            'checked' : {

                'yes' : function(elem) {
                    this.setMod(elem.next(), 'next-for-checked', 'yes');

                    this._val = this
                        .findElem(elem, 'radio')
                        .attr('checked', true)
                        .val();

                    var prev = this.elem('button', 'checked', 'yes');
                    this.delMod(prev, 'checked');

                    this.trigger('change', {
                        current: elem,
                        prev: prev
                    });
                },

                '' : function(elem) {
                    this.delMod(elem.next(), 'next-for-checked');
                }

            },

            'next-for-checked' : {

                'yes' : function() {
                    this.delMod(this.elem('button', 'next-for-checked', 'yes'), 'next-for-checked');
                }

            },

            'disabled' : function(elem, modName, modVal) {

                elem.find(this.buildSelector('radio')).attr('disabled', modVal == 'yes');

            }

        }

    },

    /**
    Метод можно вызывать с параметром и без.
    Вызвав без парамерта получаем значение аттрибута value элемента radio, соответствующего активной кнопке.
    Вызвав с парамертом, в котором передаем значение аттрибута value произвольного элемента radio, делаем активной кнопку, соответствующую этому элементу radio.

    @param {String} [val] Значение аттрибута value какого-либо элемента radio данного блока.

    @returns {String|BEM.DOM} Аттрибут value активного элемента radio, либо объект блока */
    val : function(val) {

        if(typeof val == 'undefined') {
            return this._val;
        } else {
            var _this = this;
            this.elem('radio').each(function() {
                if(this.value == val) {
                    _this.setMod(_this.__self._getButtonByElem($(this)), 'checked', 'yes');
                    return false;
                }
            });
            return _this;
        }

    },

    /**
    Метод позволяет перевести все кнопки блока в ненажатое состояние.

    @returns {BEM.DOM} Объект блока */
    uncheckAll : function() {

        var button = this.elem('button', 'checked', 'yes');

        this
            .delMod(button, 'checked')
            .findElem(button, 'radio').attr('checked', false);

        this._val = undefined;

        return this;

    },

    _onChange : function(e) {
        var button = this.__self._getButtonByElem(e.data.domElem);
        e.target.checked?
            this.setMod(button, 'checked', 'yes') :
            this.delMod(button, 'checked');
    }

}, /** @lends block */ {

    live : function() {

        this
            .liveBindTo('radio', 'leftclick', function(e) {
                if(!e.target.disabled) {
                    var button = this.__self._getButtonByElem(e.data.domElem);
                    this
                        .setMod(button, 'focused', 'yes')
                        .setMod(button, 'checked', 'yes');
                }
            })
            .liveBindTo('radio', 'change', function(e) {
                this._onChange(e);
            })
            .liveBindTo('radio', 'focusin focusout', function(e) {
                this.setMod(
                    this.__self._getButtonByElem(e.data.domElem),
                    'focused',
                    e.type == 'focusin'? 'yes' : '');
            });

        return false;
    },

    /**
    Позволяет получить элемент button (b-form-radio__button) по какому-либо потомку этого элемента в DOM-дереве.

    @example
    var block = this,
        descendant_of_some_button = block.elem('radio')[3],
        button = block.__self._getButtonByElem($(radio))
    ;
    @param {jQuery} elem Элемент, являющийся потомком элемента button.

    @returns {jQuery} Ближайший предок elem, являющийся элементом button,
                      либо сам элемент elem, если он является элементом button */
    _getButtonByElem : function(elem) {

        return elem.closest(this.buildSelector('button'));

    }

});


})(BEM);

(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl({block: "b-page", modName: "counter"}, {

        onSetMod: {

            js: function() {
                this.__base.apply(this, arguments);
                var self = this;

                //не всегда к этому моменту уже создаються каунтеры
                setTimeout(function(){
                    var counter_name = 'yaCounter' + ({
                            'ua': '20345062',
                            'ru': '17710429'
                        })[window.location.hostname.split('.').pop()],
                        yaCounter = window[counter_name],
                        target = self.getMod('counter').replace(/-/g, "_");

                    if (target && target != 'empty' && yaCounter) {
                        yaCounter.reachGoal(target);
                    }
                    return true;
                }, 500);
            }
        }
    });

}(this, this.jQuery));
(function() {

BEM.DOM.decl('b-statcounter__metrika', {

    onSetMod: {

        js: function() {

            this.__self.loadMetrika();
            this.addCounter(this.params);

        }
    },

    addCounter: function(params) {

        var haveMetrika = window.Ya && Ya.Metrika,
            metrikaCallbacks = window['yandex_metrika_callbacks'] || (window['yandex_metrika_callbacks'] = []),
            fn = function() {
                window['yaCounter' + params.id] = new Ya.Metrika(params);
            };

        if(!params.id) {
            throw new Error([BEM.I18N('b-statcounter__metrika', 'JSERR_incorrectID'),
                             'block: ' + this.__self.getName(),
                             'method: addCounter'].join('\n'));
        }

        haveMetrika ? fn() : metrikaCallbacks.push(fn);
    },

    getDefaultParams : function() {

        return {
            enableAll: true
        };
    }
}, {

    loadMetrika: function() {

        var haveMetrika = window.Ya && Ya.Metrika,
            protocol = document.location.protocol == 'https:' ? 'https:' : 'http:',
            src = '//web.archive.org/web/20130424113517/http://mc.yandex.ru/metrika/watch.js';

        !haveMetrika && $('script')[0].parentNode.appendChild($('<script>').attr({
            type: 'text/javascript',
            async: true,
            src: protocol + src
        })[0]);

        this.loadMetrika = function() {};
    }
})

})();
BEM.DOM.decl('b-platform-choice', {
    onSetMod: {
        js: function(){
            var self = this;

            var osButton = this.findBlockOn(this.findElem('os-button'), 'b-link');
            var osInput = this.findBlockOn(this.findElem('os-input'), 'b-form-input');
            var deviceButton = this.findBlockOn(this.findElem('device-button'), 'b-link');
            var deviceInput = this.findBlockOn(this.findElem('device-input'), 'b-form-input');
            var cancelButton = this.findElem('cancel');
            var changeButton = this.findBlockOn(this.findElem('change'), 'b-link');
            var resultPlace = this.findBlockInside('b-platform-choice-result');
            var resultPlaceOs = resultPlace.findElem('os-is');
            var resultPlaceDeviceStatic = resultPlace.findElem('device-is-static');
            var resultPlaceDevice = resultPlace.findElem('device-is');

            deviceInput.__buildItemsHtml = deviceInput._buildItemsHtml;
            deviceInput._buildItemsHtml = function(data){
                var html = this.__buildItemsHtml.apply(this, arguments);
                return html;
            }

            function up(ctx, eData){
                BEM.blocks[self.params.name].up(ctx, eData);
            }

            function showOsButton(){
                self.replaceBy(osButton).call(osInput);
                self.setMod('state', 'selecting');
            }
            function showDeviceButton(){
                self.replaceBy(deviceButton).call(deviceInput);
                self.setMod('state', 'selecting');
            }

            var osPrev = '', devicePrev = '';

            osButton
                .on('click', this.replaceBy(osInput))
                .on('click', showDeviceButton);
            deviceButton
                .on('click', this.replaceBy(deviceInput))
                .on('click', showOsButton);

            cancelButton.on('click', function(){
                self.trigger('set-device', [devicePrev, osPrev, $.cookie('platform_name')]);
                up(self, [
                    (function(){
                        var result = osPrev;
                        osPrev = '';
                        return result;
                    })(),
                    (function(){
                        var result = devicePrev;
                        devicePrev = '';
                        return result;
                    })()
                ]);
            });
            changeButton.on('click', function(){
                osPrev = $.cookie('platform');
                devicePrev = $.cookie('device');
                self.trigger('set-device', [null, null, null]);
                up(self, null);
                self.setMod('state', 'change');
            });

            osInput.on('select', function(event, data){
                self.trigger('set-os', [this.valId(), this.val()]);
                up(self);
            });


            deviceInput.on('select', function(ev, data){
                //clearing input fields on behalf of the platform
                var selected_row = ev.target.findElem('popup').find('.b-autocomplete-item_hovered_yes');
                var platform_name = selected_row.find('.device-platform').text();
                var device = selected_row.find('.device-name');
                var device_name = device.text();
                var platform_slug = device.data('platformslug');
//                var inpat_value = ev.target.findElem('input').val();
//                var device_name = inpat_value.slice(0,inpat_value.indexOf(platform_name));

//                var platform_slug = '';
//                for(var i = (this._allSuggestedValues || []).length-1; i >= 0; i--){
//                    if(this._allSuggestedValues[i][0].indexOf(device_name) > -1){
//                        platform_slug = this._allSuggestedValues[i][2];
//                        break;
//                    }
//                }

                ev.target.findElem('input').val(device_name);
                ev.target.findElem('popup').hide();

                self.trigger('set-device', [device_name, platform_slug, platform_name]);
                up(self);
            }).on('update-items', function(){
                var content_ul = deviceInput.findElem('popup').find('ul');
                var content_li = content_ul.find('li');

                //when the input field gets focus it immediately sends an empty request,
                // in response to that comes some random units. if the user does not have
                // stories that show him these random devices with the words "for example".
                //  if the user has a history show him his story with the words "you entered earlier."
                if(deviceInput.findElem('input').val() == ''){
                    if(this._userHasDeviceHistory()){
                        $(content_li[0]).before($('<li class="title-of-sugest">' + this.params.i18n.previously_searched + ':</li>'));
                    }
                    else{
                        $(content_li[0]).before($('<li class="title-of-sugest">' + this.params.i18n.example + ':</li>'));
                    }
                }
            }, this);

            self.on('set-os', function(e, eData){
                BEM.blocks[self.params.name].setOs(eData);
            });
            self.on('set-device', function(e, eData){
                self.trigger('set-os', [eData[1], eData[2]]);

                var device = eData[0];

                $.cookie('device', device,{path:"/"});

                this.addDeviceToHistory(eData[1], eData[2], eData[0]);
            });
            self.on('update', function(e, eData){
                var os = ($.cookie('platform') || eData) && $.cookie('platform_name')|| '';
                var device = $.cookie('device') || eData && eData[1] || '';

                if(!(device || os)) {
                    showOsButton();
                    showDeviceButton();
                    self.setMod('state', 'new');
                } else {
                    resultPlaceOs.text(os);
                    if(device) {
                        self.show(resultPlaceDeviceStatic);
                        self.show(resultPlaceDevice.text(device));
                    } else {
                        self.hide(resultPlaceDeviceStatic);
                        self.hide(resultPlaceDevice);
                    }
                    self.setMod('state', 'selected');

                    if(eData !== null) self.reloadPage();
                }
            })

            this.params.i18n = jQuery.parseJSON(this.params.i18n)

        },
        'state': function(modName, modVal, prevModVal){
            if($.browser.msie && parseInt($.browser.version, 10) <= 8){
                this.domElem.find('td').show();
                switch (modVal) {
                    case 'new':
                        this.domElem.find('.b-platform-choice__col_type_cancel, .b-platform-choice__col_type_result, .b-platform-choice__col_type_change').hide();
                        break;
                    case 'change':
                        this.domElem.find('.b-platform-choice__col_type_result, .b-platform-choice__col_type_change').hide();
                        break;
                    case 'selected':
                        this.domElem.find('.b-platform-choice__col_type_static, .b-platform-choice__col_type_select, .b-platform-choice__col_type_cancel').hide();
                        break;
                    case 'selecting':
                        this.domElem.find('.b-platform-choice__col_type_result, .b-platform-choice__col_type_change').hide();
                        break;
                }
            }
        }
    },

//    getPlatformData:function(data){
//        var platform = '';
//        $.ajax({
//            url: '/get_platform/',
//            data: data,
//            dataType: 'json',
//            async: false,
//            success: function(data){
//                platform = data;
//            }
//        });
//        return data
//    },
    addDeviceToHistory: function(platform_slug, platform_name, device_name){
        if(platform_slug && device_name){
            var device_for_history = [device_name, platform_name].join(':');
            var device_history = this._userDeviceHistory();
            var devices_cookie_string = [];
            for(var i = 0; i < device_history.length; i++){
                devices_cookie_string.push(device_history[i].join(':'));
            }

            var index_in_history = devices_cookie_string.indexOf(device_for_history);
            if(index_in_history > -1){
                //protection of repetitions. upon repeated device picks up stories
                devices_cookie_string.splice(index_in_history,1);
            }

            if(devices_cookie_string.length >=3){// "3" - max saved devices
                devices_cookie_string.pop();
            }

            devices_cookie_string.unshift(device_for_history);
            $.cookie('device_history', devices_cookie_string.join(';'), {expires: 1000, path: '/'})
        }
    },
    _userHasDeviceHistory: function(){
        return !!$.cookie('device_history');
    },
    _userDeviceHistory: function(){
        if(this._userHasDeviceHistory()){
            var history_cookie = $.cookie('device_history').split(';');
            var history_cookie_len = history_cookie.length;
            var history = [];
            if(history_cookie_len){
                for(var i=0; i<history_cookie_len; i++){
                    var device = history_cookie[i].split(':');//device_name:platform_name
                    if(device.length == 2){
                        history.push([device[0], device[1]]);
                    }
                }
                return history;
            }
        }
        return [];
    },
    reloadPage:function(){
        if(!this.findBlockOutside('b-page').hasMod('takes-full-reload', 'no')){
            document.location.reload();
        }
    },
    show: function(o){
        (o.domElem || o).removeClass('i-hidden');
    },
    hide: function(o){
        (o.domElem || o).addClass('i-hidden');
    },
    replaceBy: function(o) {
        var self = this;
        return function(){
            self.show(o);
            self.hide(this);
            try { o.elem('input').trigger('focus'); }catch(e){}
        }
    }
}, {
    up: function(ctx, eData){
        var self = this;

        if (ctx && ctx.hasMod('no-reload', 'yes')){
            ctx.trigger('update', eData);
            return;
        }

        $(self.buildSelector()).each(function(){
            $(this).bem('b-platform-choice').trigger('update', eData);
        });
    },
    setOs: function(eData){
        $.cookie('device', '', {
            path: '/'
        });
        $.cookie('platform', eData[0], {
            path: '/'
        });

        if(eData[1]) {
            $.cookie('platform_name', eData[1]);
        }
        window.location.hash = '';
    }
});
BEM.DOM.decl({block: "b-platform-choice", modName: "no-reload", modVal: "yes"}, {
    reloadPage:function(){}
});
(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl("b-news-pager", {
        onSetMod: {
            js: function() {
                var self = this;

                function navigateThrough(event) {
                    if (window.event) event = window.event;

                    if (event.ctrlKey || event.altKey) {
                        var link = null;
                        switch (event.keyCode ? event.keyCode : event.which ? event.which : null){
                            case 0x25:
                                link = self.findBlockInside({blockName: 'b-link', modName: 'type', modVal: 'prev'})
                                break;
                            case 0x27:
                                link = self.findBlockInside({blockName: 'b-link', modName: 'type', modVal: 'next'});
                                break;
                        }

                        if (link) document.location = $(link.domElem).attr('href');
                    }
                }

                document.onkeydown = navigateThrough;

            }
        }
    });

}(this, this.jQuery));

(function($) {
BEM.DOM.decl('b-dropdowna', {

    onSetMod : {

        'js' : function() {

            this._getSwitcher().on('click', this._toggle, this);

        },

        'disabled' : function(modName, modVal) {

            this._getSwitcher().setMod(modName, modVal);
            modVal == 'yes' && this.getPopup().hide();

        }

    },

    /**
     * Возвращает блок свитчера
     * @private
     */
    _getSwitcher : function() {

        return this._switcher ||
            (this._switcher =
                this.findBlockInside('b-' + (this.getMod(this.elem('switcher'), 'type') || 'link' )));

    },

    _toggle : function() {

        this.getPopup().toggle(this.elem('switcher'));

    },

    getPopup : function() {

        return this._popup || (this._popup = this.findBlockInside('b-popupa'))
            .on('outside-click', function(e, data) {
                this._getSwitcher().containsDomElem($(data.domEvent.target)) && e.preventDefault();
            }, this);

    },

    destruct : function() {

        var popup = this._popup;
        popup && popup.destruct.apply(popup, arguments);

        this.__base.apply(this, arguments);

    }

}, {

    live : function() {

        this.liveInitOnEvent('switcher', 'leftclick', function() {});

    }

});
})(jQuery);
(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl({block: "b-lang-switcher"}, {
        onSetMod: {
            js: function() {
//                this.__base.apply(this, arguments);
                var lang_link = this.findBlockInside('b-popupa').domElem.find('a.b-lang-switcher__lang').bem('lang'),
                    self = this;
                lang_link.bindTo('click', function(e){
                    var url = self.parseURL($(e.target).closest('a').attr('href'));
                    url.params['retpath'] = document.URL;
                    window.location = self.urlObjToStr(url);
                    return false;
                })
            }
        },

        parseURL: function(url) {
            var a =  document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':',''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function(){
                    var ret = {},
                        seg = a.search.replace(/^\?/,'').split('&'),
                        len = seg.length, i = 0, s;
                    for (;i<len;i++) {
                        if (!seg[i]) { continue; }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
                hash: a.hash.replace('#',''),
                path: a.pathname.replace(/^([^\/])/,'/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
                segments: a.pathname.replace(/^\//,'').split('/')
            };
        },

        urlObjToStr: function(url){
            var url_str = '',
                params = [];

            if(url.protocol){
                url_str += url.protocol + ':'
            }
            url_str += '//' + url.host

            if(url.port){
                url_str += ':' + url.port
            }

            if(url.path){
                url_str += url.path
            }

            if(url.params){
                for(key in url.params){
                    params.push(key + '=' + encodeURIComponent(url.params[key]))
                }
                url_str += '?' + params.join('&')
            }

            console.log(url_str);
            return url_str
        }


    });

}(this, this.jQuery));
(function(window, $) {
    var BEM = window.BEM;

    BEM.DOM.decl("b-banner", {
        onSetMod: {
            js: function() {
                this.banners = $.parseJSON(this.params.banners);
                if(this.banners.length > 0){
                    var banner = this.banners[this.getRandomInt(0, this.banners.length-1)];
                    var banner_a = $('<a>').css('background-image', 'url('+banner.img_src+')').attr('href', banner.link);
                    banner_a.appendTo(this.domElem)
                }
            }
        },
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    });

}(this, this.jQuery));

(function(Lego){
if(!Lego) Lego = window.Lego = {};

var ellipsisChar = '…';

/**
 * Обрезать входную строку `str` до `maxLength` символов.
 * Порт функции `lego:clever-substring()` из i-common.xsl.
 *
 * @param {String} str строка на вход
 * @param {Nubmer} maxLength максимальная длина в символах
 * @param {Number} maxLengthRelative погрешность при обрезе сверх макс. длины
 *
 * @return {String}
 */
Lego.cleverSubstring = function(str, maxLength, maxLengthRelative) {
    return (str.length > maxLength + maxLengthRelative) ? str.substring(0, maxLength - 1) + ellipsisChar : str;
}

})(window.Lego);

// XXX: поддержать в `i-bem__i18n` танкерный синтаксис вызова ключей
// i18n['prj']['keyset']['key'](params);
var i18n = i18n || {};

(function(bem_, undefined) {

var cache = {},
    // (LEGO-7486) стек кейсетов, нужен для востановления контекста в связанных ключах/кейсетах
    stack = [],
    /** {String} */
    MOD_DELIM = '_',
    /** {String} */
    ELEM_DELIM = '__',
    /** {String} */
    DEFAULT_LANG = 'ru';

function bemName(decl) {

    typeof decl === 'string' && (decl = { block: decl });

    return decl.block +
        (decl.elem ? (ELEM_DELIM + decl.elem) : '') +
        (decl.modName ? MOD_DELIM + decl.modName + MOD_DELIM + decl.modVal : '');

}

function bemParse(name) {

    var bemitem = {};

    name.split(ELEM_DELIM).forEach(function(item, i) {
        var keys = [ i ? 'elem' : 'block', 'mod', 'val' ];

        item.split(MOD_DELIM).forEach(function(part, j) {
            bemitem[keys[j]] = part;
        });
    });

    return bemitem;

}

function _pushStack(name) {
    if(!name) return false;

    var len = stack.length;
    return !(len && stack[len - 1] === name) && stack.push(name);
}

function _popStack(name) {
    var len = stack.length;
    return len && stack[len - 1] !== name && stack.pop();
}

/**
 * @constructor
 */
function _i18n() {
    this._lang = '';
    this._prj = 'lego';
    this._keyset = '';
    this._key = '';
}

_i18n.prototype = {

    lang : function(name) {
        this._lang = name;
        return this;
    },

    project : function(name) {
        this._prj = name;
        return this;
    },

    keyset : function(name) {
        _pushStack(this._keyset);

        this._keyset = bemName(name);
        return this;
    },

    key : function(name) {
        this._key = name;
        return this;
    },

    /**
     * TODO: вынести поддержку legacy-синтаксиса в отдельный метод
     * @param {Object|Function} v
     */
    decl : function(v) {
        var bemitem = bemParse(this._keyset),
            // tanker legacy syntax
            prj = bemitem.block === 'i-tanker' ? 'tanker' : this._prj,
            keyset = bemitem.elem || this._keyset,
            key = this._key;

        prj = i18n[prj] || (i18n[prj] = {});
        keyset = prj[keyset] || (prj[keyset] = {});
        keyset[key] = typeof v === 'function' ? v : (function(p) { return (v); });

        // `BEM.I18N` syntax
        var l = cache[this._lang] || (cache[this._lang] = {}),
            k = l[this._keyset] || (l[this._keyset] = {});

        k[key] = v;
    },

    val : function(params, thisCtx) {
        var value = cache[this._lang] && cache[this._lang][this._keyset];
        if(!value) {
            console && console.log &&
                console.log("[Error] keyset: " + this._keyset + " key: " + this._key + " (lang: " + this._lang + ")");
            return '';
        }

        value = value[this._key];
        if(!value) return '';

        try{
            return typeof value === 'string' ?
                value : thisCtx ? value.call(thisCtx, params) : value.call(this, params);
        } catch(e) {
            throw "[Error] keyset: " + this._keyset + " key: " + this._key + " (lang: " + this._lang + ")";
        }
    },

    _c : function() { return cache; }

};

/** {namespace} */
bem_.I18N = (function(base) {

    /**
     * Шоткат для получения значения ключа
     * @param {String|Object} keyset
     * @param {String} key
     * @param {Object} [params]
     * @return {String}
     */
    var klass = function(keyset, key, params) {
        return klass.keyset(keyset).key(key, params);
    };

    ['project', 'keyset'].forEach(function(p) {
        klass[p] = function(v) { this._i18n[p](v); return this; };
    });

    /**
     * @param {String} name имя ключа
     * @param {Object} params
     * @return {String}
     */
    klass.key = function(name, params) {
        var proto = this._i18n,
            _keyset, result;

        proto.lang(this._currentLang).key(name);

        result = proto.val.call(proto, params, klass);

        // восстанавливаем значение предыдущего кейсета, если нужно
        _keyset = _popStack(proto._keyset);
        _keyset && proto.keyset(_keyset);

        return result;
    };

    /**
     * Декларация переводов
     * @param {String|Object} bemitem
     * @param {Object} keysets
     * @param {Object} [declProps] параметры декларации
     */
    klass.decl = function(bemitem, keysets, declProps) {
        var proto = this._i18n, k;

        declProps || (declProps = {});
        declProps.lang && proto.lang(declProps.lang);

        proto.keyset(bemitem);

        for(k in keysets)
            proto.key(k).decl(keysets[k]);

        return this;
    };

    /**
     * Устанавливает/возвращает текущий язык
     * @param {String} [lang]
     * @return {String}
     */
    klass.lang = function(lang) {
        typeof lang !== undefined
            && (this._currentLang = lang);

        return this._currentLang;
    };

    klass._i18n = base;

    klass._currentLang = DEFAULT_LANG;

    return klass;

}(new _i18n()));

/** Global */
BEM = this.BEM = bem_;

}(typeof BEM === 'undefined' ? {} : BEM));


/* Это автоматически сгенеренный файл. Не редактируйте его самостоятельно */

BEM.I18N.lang("ru");

BEM.I18N.decl('b-map-download', {

"shema-for" : 'Cхема для',
"size" : 'размер',
"download-size" : 'Мбайт, вам потребуется',
"size-you-need-on-device" : 'Мбайт места на устройстве'

}, {
"lang" : "ru"
});
BEM.I18N.decl('i-services', {

"404" : '404',
"admins" : 'Админы',
"adresa" : 'Адреса',
"advertising" : 'Реклама',
"afisha" : 'Афиша',
"all" : 'Все сервисы',
"api" : 'API',
"auto" : 'Авто',
"aziada" : 'Азиада',
"ba" : 'Баян',
"backapv" : 'Партнер Я.Карт',
"balance" : 'Баланс',
"bar" : 'Бар',
"bar-ie" : 'Бар для ИЕ',
"bar-ie9" : 'Бар для ИЕ9',
"bayan" : 'Баннеры Яндекса',
"blogmon" : 'Блогмонитор',
"blogs" : 'Блоги',
"bond" : 'Брак',
"books" : 'Книги',
"business" : 'Для бизнеса',
"calendar" : 'Календарь',
"captcha" : 'ой...',
"cards" : 'Открытки',
"catalogwdgt" : 'Каталог виджетов',
"center" : 'Интранет',
"chrome" : 'Хром с поиском Яндекса',
"city" : 'Города',
"cityday" : 'День города',
"collection" : 'Коллекция',
"company" : 'Компания',
"contest" : 'Contest',
"desktop" : 'Персональный поиск',
"diary" : 'Этушка',
"direct" : 'Директ',
"direct.market" : 'Маркет',
"disk" : 'Диск',
"doc" : 'Документация',
"expert" : 'Эксперт',
"feedback" : 'Обратная связь',
"ff" : 'ФФ с поиском Яндекса',
"fotki" : 'Фотки',
"games" : 'Игрушки',
"gap" : 'Планировщик отсутствий',
"geocontext" : 'Геоконтекст',
"goroda" : 'Города',
"help" : 'Помощь',
"i" : 'Мои сервисы',
"ie" : 'ИЕ с поиском Яндекса',
"images" : 'Картинки',
"images-com" : 'Картинки',
"interests" : 'Интересы',
"internet" : 'Интернет',
"intranet-passport" : 'Внутренний паспорт',
"jabber" : 'Джаббер',
"jams-arm" : 'АРМ экспертов Яндекс.Пробок',
"jing" : 'Джинг',
"jira" : 'Jira',
"job" : 'Job-jira',
"keyboard" : 'Клавиатура',
"kraski" : 'Краски',
"kuda" : 'Куда все идут',
"large" : 'Яндекс для слабовидящих',
"legal" : 'Правовые документы',
"lego" : 'Лего',
"lenta" : 'Лента',
"libra" : 'Библиотека',
"literacy" : 'Неделя борьбы за грамотность',
"local" : 'Локальная сеть',
"lost" : 'Незабудки',
"love" : 'День взаимного тяготения — 13 августа',
"lunapark" : 'Лунапарк',
"mail" : 'Почта',
"maillists" : 'Рассылки',
"maps" : 'Карты',
"maps-wiki" : 'Народная карта',
"market" : 'Маркет',
"market.advertising" : 'Маркет',
"metrika" : 'Метрика',
"metro" : 'Метро',
"mobile" : 'Мобильный',
"moikrug" : 'Мой Круг',
"money" : 'Деньги',
"museums" : 'Дни исторического и культурного наследия',
"music" : 'Музыка',
"music-partner" : 'Музыка: статистика',
"nahodki" : 'Мои находки',
"nano" : 'Нано',
"narod" : 'Народ',
"news" : 'Новости',
"oauth" : 'Авторизация',
"online" : 'Онлайн',
"openid" : 'OpenID',
"opera" : 'Opera Software',
"opinion" : 'Цитаты',
"otrs" : 'OTRS',
"partners" : 'Рекламная сеть',
"partnersearch" : 'Поиск для партнеров',
"passport" : 'Паспорт',
"pdd" : 'Почта для домена',
"peoplesearch" : 'Поиск людей',
"perevod" : 'Перевод',
"planner" : 'Переговорки',
"probki" : 'Пробки',
"projects" : 'Проекты',
"pulse" : 'блоги: пульс',
"punto" : 'Punto switcher',
"pvo" : 'Ответы',
"rabota" : 'Работа',
"rasp" : 'Расписания',
"realty" : 'Недвижимость',
"referats" : 'Рефераты',
"rk" : 'Есть вопросы?',
"root" : 'Яндекс.Олимпиада для Unix администраторов',
"school" : 'Школа',
"search" : 'Поиск',
"server" : 'Сервер',
"site" : 'Поиск для сайта',
"slovari" : 'Словари',
"so" : 'Самооборона',
"social" : 'Социализм',
"soft" : 'Программы',
"sprav" : 'Справочник',
"staff" : 'Стафф',
"start" : 'Стартовая страница',
"stat" : 'Статистика',
"statface" : 'Статистика',
"subs" : 'Подписки',
"taxi" : 'Такси',
"terms" : 'Разговорник',
"tests" : 'Тесты и опросы',
"time" : 'Яндекс.Время',
"toster" : 'Тосты',
"translate" : 'Перевод',
"tune" : 'Настройки',
"tv" : 'Телепрограмма',
"uslugi" : 'Услуги',
"video" : 'Видео',
"video-com" : 'Видео',
"videoteka" : 'Видеотека',
"wdgt" : 'Виджеты',
"weather" : 'Погода',
"webmaster" : 'Вебмастер',
"widgets" : 'Виджеты',
"wiki" : 'Вики',
"wordstat" : 'Статистика',
"wow" : 'Я.ру',
"www" : 'Поиск',
"xmlsearch" : 'XML',
"yaca" : 'Каталог',
"yamb" : 'Медийные баннеры',
"zakladki" : 'Закладки',
"newhire" : 'Наниматор',
"access" : 'Доступ',
"sport" : 'Спорт'

}, {
"lang" : "ru"
});
BEM.I18N.decl('b-head-logo', {

"yandex" : 'Яндекс'

}, {
"lang" : "ru"
});
BEM.I18N.decl('b-head-line', {

"simple" : 'простой поиск'

}, {
"lang" : "ru"
});
BEM.I18N.decl('b-head-name', {

"beta" : 'бета'

}, {
"lang" : "ru"
});
BEM.I18N.decl('b-statcounter__metrika', {

"JSERR_incorrectID" : 'Incorrect ID has been passed.'

}, {
"lang" : "ru"
});
BEM.I18N.decl('b-foot', {

"about" : 'О компании',
"advert" : 'Реклама',
"agreement" : 'Пользовательское соглашение',
"beta" : 'β-версия',
"design" : 'Дизайн',
"design-artlebedev" : 'Студия Артемия Лебедева',
"mobile" : 'Мобильная версия',
"services-button-value" : 'Перейти',
"stat" : 'Статистика',
"termsofuse" : 'Лицензия на поиск',
"vacancies" : 'Вакансии',
"yandex-is-local" : 'Яндекс локален',
"yandex-is-not-local" : 'Как сделать Яндекс локальным'

}, {
"lang" : "ru"
});
BEM.I18N.decl('b-dropdowna', {

"more" : 'ещё',
"or" : 'или'

}, {
"lang" : "ru"
});
BEM.I18N.decl('b-lang-switcher', {

"all" : 'ещё'

}, {
"lang" : "ru"
});
BEM.I18N.decl('b-copyright', {

"link" : function(params) { return 'ООО «' + params["content"] + '»' },
"yandex" : 'Яндекс'

}, {
"lang" : "ru"
});


}
/*
     FILE ARCHIVED ON 11:35:17 Apr 24, 2013 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:00:11 Apr 01, 2023.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 86.975
  exclusion.robots: 0.237
  exclusion.robots.policy: 0.224
  cdx.remote: 0.076
  esindex: 0.01
  LoadShardBlock: 63.593 (3)
  PetaboxLoader3.datanode: 93.025 (4)
  load_resource: 201.615
  PetaboxLoader3.resolve: 153.672
*/