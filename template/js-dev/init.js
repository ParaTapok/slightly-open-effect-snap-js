'use strict';

var EFF = {};

$(function() {

    EFF.slightly = (function() {
        var common = {},
            person = {},
            body = $('body'),
            w = $(window),
            parent = $('.b-video-over'),
            img = parent.find('.b-video-over__media-picture'),
            CONST = {
                WIDTH_ANIM: 50,
                TIME_ANIM: 300
            },
            states = {
                toRight: [false, false],
                toLeft: [false, false]
            },
            paper1,
            paper2,
            ell1,
            ell2,
            imageMask;

        person.getAnimState = function(type) {
            var first, second, result;

            first = states.toRight[0] || states.toLeft[0];
            second = states.toRight[1] || states.toLeft[1];

            if (type) {
                if (type === 'first') {
                    result = first;
                }
                if (type === 'second') {
                    result = second;
                }
            } else {
                result = states.toRight[0] || states.toRight[1] || states.toLeft[0] || states.toLeft[1];
            }

            return result;
        };

        person.toRightStep1 = function() {
            states.toRight[0] = true;

            ell1.animate({
                    rx: 0
                },
                CONST.TIME_ANIM,
                mina.easing,
                person.toRightStep2
            );
        };

        person.toRightStep2 = function() {
            states.toRight[0] = false;
            states.toRight[1] = true;

            ell2.animate({
                    rx: CONST.WIDTH_ANIM
                },
                CONST.TIME_ANIM,
                mina.easing,
                function() {
                    states.toRight[1] = false;
                }
            );
        };

        person.toLeftStep1 = function() {
            states.toLeft[0] = true;

            ell2.animate({
                    rx: 0
                },
                CONST.TIME_ANIM,
                mina.easing, 
                person.toLeftStep2
            );
        };

        person.toLeftStep2 = function() {
            states.toLeft[1] = false;
            states.toLeft[0] = true;

            ell1.animate({
                    rx: CONST.WIDTH_ANIM
                }, 
                CONST.TIME_ANIM, 
                mina.easing, 
                function() {
                    states.toLeft[0] = false;
                }
            );
        };

        common.init = function() {

            console.log('11');

            if (window['Snap'] === undefined) return;

            parent.find('.paper-1').html('');
            parent.find('.paper-2').html('');

            // papers
            paper1 = Snap('.paper-1');
            paper2 = Snap('.paper-2');

            // objects
            ell1 = paper1.ellipse(600, 210, CONST.WIDTH_ANIM, 300);
            ell2 = paper2.ellipse(600, 210, 0, 300);
            imageMask = paper2.image(img.attr('src'), 0, 0, 651, 427);

            console.log(ell1, ell2);

            ell1.attr("fill", "#fff");

            // apply mask
            ell2.attr('fill', '#fff');
            imageMask.attr({
                mask: ell2
            });

            $(document)
                .on('mouseover', '.b-video-over__media-top', function() {
                    var inAnim1 = person.getAnimState('first'),
                        inAnim2 = person.getAnimState('second');

                    if (inAnim2 === true) {
                        if (inAnim1 === false) {
                            // анимация на первом объекте завершена, 
                            // анимируется только второй объект
                            // остановка анимации на втором объекте
                            ell2.stop();
                            states.toLeft[1] = false;
                            // запуск прямой анимации с первого шага
                            person.toRightStep2();
                        }
                    } else {
                        if (inAnim1 === false) {
                            // анимация на обоих объектах завершена
                            // запуск прямой анимации с первого шага
                            person.toRightStep1();
                        } else {
                            // анимируется только первый объект
                            // остановка анимации первого объекта
                            ell1.stop();
                            states.toLeft[0] = false;
                            states.toRight[0] = false;
                            // запуск прямой анимации с первого шага
                            person.toRightStep1();
                        }
                    }

                })
                .on('mouseout', '.b-video-over__media-top', function() {
                    var inAnim1 = person.getAnimState('first'),
                        inAnim2 = person.getAnimState('second');

                    if (inAnim2 === true) {
                        if (inAnim1 === false) {
                            // анимация на первом объекте завершена, 
                            // анимируется только второй объект
                            // остановка анимации на втором объекте
                            ell2.stop();
                            states.toRight[1] = false;
                            // запуск прямой анимации с первого шага
                            person.toLeftStep1();
                        }
                    } else {
                        if (inAnim1 === false) {
                            // анимация на обоих объектах завершена
                            // запуск прямой анимации с первого шага
                            person.toLeftStep1();
                        } else {
                            // анимируется только первый объект
                            // остановка анимации первого объекта
                            ell1.stop();
                            states.toRight[0] = false;
                            states.toLeft[0] = false;
                            // запуск прямой анимации с первого шага
                            person.toLeftStep2();
                        }
                    }
                });

        };

        return common;
    })();

    EFF.slightly.init();

});