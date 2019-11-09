'use strict';
let sib = new SiBHelper();
initSiB();

const backgroundColorRep = nodecg.Replicant('backgroundColor', 'players-bundle')
const textColorRep = nodecg.Replicant('textColor', 'players-bundle')
const playersDataRep = nodecg.Replicant('playersData', 'players-bundle')

let players

playersDataRep.on('change', (newValue) => {

});
function readPlayers() {
    fetch('./assets/playersData.json', {
        credentials: 'same-origin'
    })
        .then(response => {
            return response.json()
        })
        .then(json => {
            players = json
        });
}
readPlayers()

function addPlayer(newPlayer) {
    // console.log(newPlayer);
    players.push(newPlayer)

}

nodecg.listenFor('addPlayer', newPlayer => {

    //should refresh players list

    // readPlayers()
    // addPlayer(newPlayer)
    // playersDataRep.value = players
    // showTemplate(players)
})

backgroundColorRep.on('change', (newValue) => {
    setBackgroundColor('newPlayers', newValue)
});

textColorRep.on('change', (newValue) => {
    setTextColor(newValue)
});

nodecg.listenFor('showNextPlayer', () => {
    player.next();
})
nodecg.listenFor('showPrevPlayer', () => {
    player.prev();
})
// const playerImagesRep = nodecg.Replicant('assets:playerImages');


function initSiB() {
    initSettingsAndData();

    //add event listeners
    sib.events.on('updatedSettings', onUpdatedSettings);
    sib.events.on('updatedData', onUpdatedData);
    sib.events.on('updatedEventData', onUpdatedEventData);

    sib.events.on('updatedResultData', onUpdatedResultData);
    //sib.openResultData();

    console.log("InitSiB Done!");
}

function initSettingsAndData() {

    //set template info
    sib.templateinfo.name = 'Name presentation football';
    sib.templateinfo.desc = 'Used for a name presenetation in fullscreen for football';
    sib.templateinfo.resolution = '1280x720';
    sib.templateinfo.testedWithSiBVersion = '1.0.0';
    sib.templateinfo.templateVersion = '1.0.0';
    sib.templateinfo.templateUpdated = '2019-09-11';
    sib.templateinfo.contactName = 'Peter Berglund';
    sib.templateinfo.contactEmail = 'info@iccmediasport.com';

    //add background settings
    let background = sib.settings.addCategory('background', 'defines background settings');

    let bgcolor = background.addRow('background color');
    bgcolor.value = '#191A1D';
    bgcolor.defaultValue = '#191A1D';
    bgcolor.desc = 'Color used as background';
    bgcolor.datatype = SiBHelper.DATATYPES.COLOR;

    let bgImg = background.addRow('use background image');
    bgImg.value = 'false';
    bgImg.defaultValue = 'false';
    bgImg.desc = 'Check to enable the bakground image';
    bgImg.datatype = SiBHelper.DATATYPES.BOOL;

    let bgUrl = background.addRow('background image');
    bgUrl.value = '';
    bgUrl.defaultValue = '';
    bgUrl.desc = 'Image to use as background image';
    bgUrl.datatype = SiBHelper.DATATYPES.FILE;

    //add extra settings
    let styling = sib.settings.addCategory('styling', 'Extra template settings');

    let textColor = styling.addRow('text_color');
    textColor.defaultValue = '#FFFFFF';
    textColor.desc = 'Color used for the texts';
    textColor.datatype = SiBHelper.DATATYPES.COLOR;

    let aniSpeed = styling.addRow('animation_speed');
    aniSpeed.defaultValue = 1;
    aniSpeed.desc = 'Controls the speed of the animations';
    aniSpeed.datatype = SiBHelper.DATATYPES.INTEGER;


    // Set data

    let playerpres = sib.data.addCategory('player_data', 'Player data for the name presentation');

    let firstname = playerpres.addRow('firstname');
    firstname.datatype = SiBHelper.DATATYPES.STRING;

    let lastname = playerpres.addRow('lastname');
    lastname.datatype = SiBHelper.DATATYPES.STRING;

    let position = playerpres.addRow('position');
    position.datatype = SiBHelper.DATATYPES.STRING;

    let number = playerpres.addRow('number');
    number.datatype = SiBHelper.DATATYPES.STRING;

    let playerpicture = playerpres.addRow('player picture');
    playerpicture.datatype = SiBHelper.DATATYPES.FILE;

    let age = playerpres.addRow('age');
    age.datatype = SiBHelper.DATATYPES.STRING;

    let weight = playerpres.addRow('weight');
    weight.datatype = SiBHelper.DATATYPES.STRING;

    let height = playerpres.addRow('height');
    height.datatype = SiBHelper.DATATYPES.STRING;


    let team_data = sib.data.addCategory('team_data', 'data about the players team');

    let teamlogo = team_data.addRow('team logo');
    teamlogo.datatype = SiBHelper.DATATYPES.FILE;

    let teamcolor = team_data.addRow('team color');
    teamcolor.datatype = SiBHelper.DATATYPES.COLOR;
}

function onUpdatedSettings() {
    console.log("onUpdatedSettings");

    if (sib.getSettings('background', 'use background image') == true)
        setBackgroundImage(sib.getSettings('background', 'background_url'));
    else
        setBackgroundImage('');
    setBackgroundColor(sib.getSettings('background', 'background color'));

    setTextColor(sib.getSettings('styling', 'text_color'));
    setAnimationSpeed(sib.getSettings('styling', 'animation_speed'));
}
function onUpdatedEventData(data) {
    console.log("onUpdatedEventData");

    if (data.Msg == 'NamePres') {
        console.log("namepres found");
        let Player = data.Player;

        console.log("player object:", Player);

        let fullName = Player.Name ? Player.Name : '';
        var splitName = fullName.split(' ');

        var playerObjEvent = {
            logo: Player.Team.Logo ? Player.Team.Logo : '',
            imgPlayer: Player.Picture ? Player.Picture : '',
            firstName: splitName[0] ? splitName[0] : '',
            lastName: splitName[1] ? splitName[1] : '',
            flag: 'assets/images/team-logo-player.png',
            number: Player.Number ? Player.Number : '',
            status: Player.Position ? Player.Position : '',
            age: Player.Age ? Player.Age : '',
            height: Player.Height ? Player.Height : '',
            weight: Player.Weight ? Player.Weight : ''
        };

        showTemplate([playerObjEvent]);
    }
}

function onUpdatedData() {
    console.log("onUpdatedData");
    var playerData =
    {
        flag: sib.getData('team_data', 'team logo'),
        logo: sib.getData('team_data', 'team logo'),
        imgPlayer: sib.getData('player_data', 'player picture'),
        firstName: sib.getData('player_data', 'firstname'),
        lastName: sib.getData('player_data', 'lastname'),
        playerC: 'C',
        number: sib.getData('player_data', 'number'),
        status: sib.getData('player_data', 'position'),
        age: sib.getData('player_data', 'age'),
        height: sib.getData('player_data', 'height'),
        weight: sib.getData('player_data', 'weight')
    };

    showTemplate([playerData]);
}

function onUpdatedResultData(data) {
    console.log("onUpdatedResultData:", data);
}

function setFromSiB(json) {
    sib.parseJSONString(json);
}

function sendToSiB() {
    return sib.getJSONString();
}



// -----------------------   CUSTOM TEMPLATE CODE -----------------------------------------------------




class Player {

    constructor() {
        this.init = true;
        this.anim = null;
        this.PAUSE_Duration = 3;

        this.currentTL = null;
        return this;
    }

    setData(data) {
        this.data = data;
        this.currentIdx = 0;
        this.maxIdx = this.data.length - 1;
    }
    next() {

        this.currentIdx = (this.currentIdx + 1) % this.data.length;
        //console.error('interval', this.currentIdx);
        this.playNext(this.currentIdx);

        this.currentTL.push(
            TweenLite.to({}, this.PAUSE_Duration, {
                onComplete: () => {


                }
            })
        )

    }
    prev() {
        this.currentIdx = (this.currentIdx - 1) % this.data.length
        this.playNext(this.currentIdx)
    }

    stop() {
        if (this.currentTL)
            this.currentTL.forEach((e) => e.kill());
        this.currentTL = null;
        //console.log('stop');
    }


    playNext(idx) {

        this.currentTL = [];
        //out player anim - in anim
        this.currentIdx = this._safeIdx(idx);

        //console.log('curr',this.currentIdx);

        const backgroundTL = this.anim.backgroundAnim();
        const playerTL = this.anim.playerAnim();
        var tl;

        if (this.init) {
            this.init = false;
            this.updateData(this.data[this.currentIdx]);

            tl = new TimelineLite();
            tl.to(backgroundTL,
                backgroundTL.totalDuration() - backgroundTL.time(),
                { time: backgroundTL.totalDuration() })

                .to(playerTL,
                    playerTL.totalDuration() - playerTL.time(),
                    { time: playerTL.totalDuration() })
                .add(() => {
                    //this.next();
                });




        } else {
            playerTL.pause();

            tl = new TimelineLite();
            tl.to(playerTL,
                playerTL.time(),
                { time: 0 })
                .add(() => {
                    //change data
                    this.updateData(this.data[this.currentIdx]);

                    this.currentTL.push(
                        new TimelineLite().to(playerTL,
                            playerTL.totalDuration() - playerTL.time(),
                            { time: playerTL.totalDuration() }).timeScale(anim.timeScale).add(() => {
                                //this.next();
                            })
                    );

                })



        }
        this.currentTL.push(tl);

        tl.timeScale(anim.timeScale);

    }

    getNext(offset) {
        var n = this.currentIdx + offset;
        return this._safeIdx(n);
    }

    _safeIdx(n) {
        if (n < 0)
            n = 0;
        if (n > this.maxIdx)
            n = this.maxIdx;
        return n;
    }

    updateData(data) {

    }




}

class Anim {

    constructor() {
        this.backgroundAnimTL = null;
        this.playerAnimTL = null;
    }
    init() {
        var tl = new TimelineLite();

        tl
            .set(".player-presentation-svg, .player-content", { autoAlpha: 0 })
            .set(".left-box", { x: -1200, transformOrigin: "50% 50%" })
            .set(".right-box", { x: 2800, transformOrigin: "50% 50%" })
            .set(".bg-img, .team-logo-bg", { opacity: "0" })
            .set(".bg-img", { y: -5 })
            .set(".team-logo-bg", { x: 1000, transformOrigin: "50% 50%" })
            .set(".player-img", { x: 50, opacity: "0", transformOrigin: "50% 50%" })
            .set(".team-logo", { scale: .3, opacity: 0, transformOrigin: "50% 50%" })
            .set(".name-txt-1, .name-txt-2", { transformOrigin: "50% 50%" })
            .set(".name-txt-1", { transform: "translate3d(0,145px,0)" })
            .set(".name-txt-2", { transform: "translate3d(0,-145px,0)" })
            .set(".no-txt", { transform: "translate3d(0,-130px,0)" })
            .set(".description-txt", { transform: "translate3d(0,-130px,0)" })
            .set(".details-circle-svg circle", { drawSVG: "0%", opacity: 0, rotation: 0, transformOrigin: "50% 50%" })
            .set(".details-txt", { /*scale: .7, */ transform: "translate3d(0,96px,0)", opacity: 0, transformOrigin: "50% 50%" })
            .set(".details-desc-txt", { transform: "translate3d(0,-38px,0)", opacity: 0, transformOrigin: "50% 50%" })
    }
    backgroundAnim() {
        if (this.backgroundAnimTL)
            return this.backgroundAnimTL;


        var tl = new TimelineLite({ paused: true });

        tl.to(".wrapper, .player-presentation-svg, .player-content", 0.1, {
            autoAlpha: 1
        })
            .to(".left-box", .8, {
                x: 0,
                ease: Power4.easeIn
            })
            .to(".right-box", .8, {
                x: 0,
                ease: Power4.easeIn
            }, "-=.8")
            .to(".bg-gradient", .5, {
                autoAlpha: 1
            }, "-=.01")

            .to(".bg-img", .6, {
                opacity: 1,
                y: 0,
                ease: Power1.easeOut
            }, "-=.5")
        //.timeScale(this.timeScale);
        console.log('timeScale', this.timeScale);

        this.backgroundAnimTL = tl;
        return this.backgroundAnimTL;
    }

    playerAnim() {
        if (this.playerAnimTL)
            return this.playerAnimTL;

        var tl = new TimelineLite({ paused: true });
        tl.to(".team-logo-bg", 1, {
            autoAlpha: .02,
            ease: Power1.easeOut
        }, "-=.6")

            .to(".player-img-mask", .6, {
                x: 0,
                opacity: "1",
                ease: Power1.easeOut
            }, "-=1")
            .to(".player-img", 1, {
                x: -30,
                opacity: "1",
                ease: Power1.easeOut
            }, "-=.6")
            .to(".team-logo", .4, {
                scale: .4,
                opacity: 1,
                ease: Power1.easeOut
            }, "-=1")

            .staggerTo(".name-txt-1, .name-txt-2", .5, {
                transform: "translate3d(0,0,0)",
                ease: Power2.easeOut
            }, .1, "-=.5")
            .to(".no-txt, .description-txt", .5, {
                transform: "translate3d(0,0,0)",
                ease: Power2.easeOut
            }, "-=.5")

            .staggerTo(".details-circle-svg circle", 1, {
                drawSVG: "100%",
                rotation: 270,
                opacity: .5,
                ease: Power1.easeOut
            }, .1, "-=.3")
            .staggerTo(".details-txt", .4, {
                transform: "translate3d(0,0,0)",
                opacity: 1,
                ease: Power2.easeOut
            }, .1, "-=.8")
            .staggerTo(".details-desc-txt", .4, {
                transform: "translate3d(0,0,0)",
                opacity: 1,
                ease: Power2.easeOut
            }, .1, "-=.8")







        this.playerAnimTL = tl;
        return this.playerAnimTL;

    }
}

class Keyboard {
    constructor() {
        document.addEventListener('keydown', this.onKeyDown);

        this.textColorToggle = false;
        this.animationSpeedToggle = false;
        this.backgroundColorToggle = false;
        this.backgroundToggle = false;
    }

    onKeyDown(event) {
        // 49 num _1 & 1
        if ([49, 1].indexOf(event.keyCode) > -1) {
            showTemplate(players)
        }

        if ([50, 2].indexOf(event.keyCode) > -1) {
            outAnimation();
        }

        if ([51, 3].indexOf(event.keyCode) > -1) {
            if (!this.backgroundColorToggle)
                setBackgroundColor('#3fb9b9');
            else
                setBackgroundColor();

            this.backgroundColorToggle = !this.backgroundColorToggle;
        }

        if ([52, 4].indexOf(event.keyCode) > -1) {
            if (this.textColorToggle)
                setTextColor();
            else
                setTextColor('#00FF00');

            this.textColorToggle = !this.textColorToggle;
        }

        if ([53, 5].indexOf(event.keyCode) > -1) {
            if (this.animationSpeedToggle)
                setAnimationSpeed(0.5);
            else
                setAnimationSpeed(2);

            this.animationSpeedToggle = !this.animationSpeedToggle;
        }

        if ([54, 6].indexOf(event.keyCode) > -1) {
            if (!this.backgroundToggle)
                setBackgroundImage('assets/images/bg-img.jpg');
            else
                setBackgroundImage('assets/images/football-field-image.png');

            this.backgroundToggle = !this.backgroundToggle;
        }

        if ([56, 8].indexOf(event.keyCode) > -1) {
            this.scaleToggle = !this.scaleToggle;
            setScaleMode(this.scaleToggle);
        }

        //N key
        if ([78].indexOf(event.keyCode) > -1) {
            player.next();
        }
    }
}

// var players = [
//     {
//         flag: 'assets/images/team-logo-player.png',
//         logo: 'assets/images/team-logo-player.png',
//         imgPlayer: 'assets/images/player.png',
//         firstName: 'Mohamed',
//         lastName: 'Salah Lorem ipsum',
//         playerC: 'C',
//         number: '11',
//         status: 'Forward, Right Winger',
//         age: '20',
//         height: '17',
//         weight: '700'
//     },
//     {
//         flag: 'assets/images/team-logo-player.png',
//         logo: 'assets/images/Liverpool.png',
//         imgPlayer: 'assets/images/MohamedSalah.png',
//         firstName: 'Tobias',
//         lastName: 'Ericsson',
//         playerC: 'C',
//         number: '12',
//         status: 'Forward, Right Winger',
//         age: '266',
//         height: '187',
//         weight: '10'
//     },
//     {
//         flag: '',
//         logo: 'assets/images/Liverpool.png',
//         imgPlayer: '',
//         firstName: 'Mohamed Lorem ipsum',
//         lastName: 'Salah',
//         playerC: 'C',
//         number: '13',
//         status: 'Goaltender',
//         age: '26',
//         height: '175',
//         weight: '70'
//     }

// ];

const anim = new Anim();
const player = new Player();
new Keyboard();

$(window).on('load', function () {
    let query = document.location.href.toString().split('?')[1],
        timeScale = 1;

    let param = getParamValue(query, "timeScale");
    if (param)
        timeScale = parseFloat(param);

    param = getParamValue(query, "pause");




    anim.timeScale = timeScale;
    anim.init();


    if (param)
        player.PAUSE_Duration = param;
    console.log('pause', player.PAUSE_Duration)
    player.setData(players);
    player.anim = anim;
    player.updateData = (data) => {
        //console.log('update',data);


        $('.wrapper').removeClass('no-image-player');

        $('.player-img').attr('href', '');
        if (data.imgPlayer && data.imgPlayer !== '')
            $('.player-img').attr('href', data.imgPlayer);
        else
            $('.wrapper').addClass('no-image-player');



        $('.name-txt-1').text(data.firstName);
        //fitText($('.name-txt-1'),'name-txt-format');
        fitTextInWidth($('.name-txt-1'), 'name-txt-format', $('.name-text-clip-rect').width());

        $('.name-txt-2').text(data.lastName);
        //fitText($('.name-txt-2'),'name-txt-format');
        fitTextInWidth($('.name-txt-2'), 'name-txt-format', $('.name-text-clip-rect').width());

        $('.number-txt').text(data.number);
        $('.status-txt').text(data.status);
        //fitText($('.status-txt'),'status-txt-format');
        $('.status-txt').attr('x', $('.number-txt')[0].getBBox().width + 20);

        fitTextInWidth($('.status-txt'), 'status-txt-format', $('.name-text-clip-rect').width() - $('.status-txt').attr('x'));

        $($('.details-txt')[0]).text(data.age);
        $($('.details-txt')[1]).text(data.height);
        $($('.details-txt')[2]).text(data.weight);




        $('.team-logo').attr('href', '');
        if (data.logo && data.logo !== '')
            $('.team-logo').attr('href', data.logo);

        $('.team-logo-bg').attr('href', '');
        if (data.logo && data.logo !== '')
            $('.team-logo-bg').attr('href', data.logo);

        window.requestAnimationFrame(() => { });

    }


    console.log(players);

    showTemplate(players);
    setScaleMode(false);


});



//API functions
function showTemplate(data) {

    player.setData(data.concat());
    player.stop();
    player.currentIdx = -1;
    //console.log(player.init);
    player.playNext(player.currentIdx);


}

function outAnimation() {
    player.init = true;
    player.stop();
    //console.log('outAnimation');

    anim.playerAnim().pause();

    const tl = new TimelineLite();
    tl.to(anim.playerAnim(), anim.playerAnim().time(), { time: 0 }).add(() => {
        anim.backgroundAnim().pause();
    })
        .to(anim.backgroundAnim(), anim.backgroundAnim().time(), { time: 0 });
    tl.timeScale(anim.timeScale);


}

function setBackgroundColor(color, secondColor = '') {
    if (color === '' || !color)
        color = '#191A1D';



    if (secondColor === '') {
        const diff = getColorDiff();
        const max = parseInt('FFFFFF', 16);
        secondColor = parseInt(color.replace('#', ''), 16);
        secondColor = secondColor + diff;
        if (secondColor > max)
            secondColor = max;

        secondColor = '#' + secondColor.toString(16);
    }

    console.log('second color', secondColor);


    [$('#left-box-gradient stop')[0], $('#right-box-gradient stop')[0]].map((el) => {
        $(el).css('stop-color', color);
    });

    [$('#left-box-gradient stop')[1], $('#right-box-gradient stop')[1]].map((el) => {
        $(el).css('stop-color', secondColor);
    });


}

function setTextColor(color) {
    color = color || '';

    $('.player-presentation-svg text').css('fill', color);
    $('.details .details-desc-txt').css('fill', convertHex(color, 0.5));
    $('.details-circle-svg circle').css('stroke', convertHex(color, 0.5));

}

function setAnimationSpeed(speed) {
    anim.timeScale = speed;
    console.log('setAnimationSpeed', anim.timeScale);

    if (player.currentTL)
        player.currentTL.forEach((e) => e.timeScale(anim.timeScale));
}

function setBackgroundImage(link) {
    $('.bg-img').attr('href', link);
}

function setScaleMode(scaleContent) {

    if (scaleContent) {

        $('.content-svg,.player-content-svg').attr('preserveAspectRatio', 'none');
        $('.content-svg,.player-content-svg').addClass('background-svg');
        $('.content-svg, .player-content-svg').css('height', '');


    }
    else {
        //TweenLite.set(".player-content, .cards",  {scaleY:1});

        $('.content-svg,.player-content-svg').attr('preserveAspectRatio', 'xMidYMid meet');
        $('.content-svg,.player-content-svg').removeClass('background-svg');
        if ($('.content-svg').height() > window.innerHeight) {
            $('.content-svg, .player-content-svg').css('height', '100%');
        }

    }

}


//Utils

function getParamValue(query, param) {
    var patt = new RegExp("[\/?&]*" + param + "=([^&#]*)", "i");
    var result = patt.exec(query);
    var value = (result == null) ? null : result[1];
    return value;
}

function fitText($targetField, className) {

    setTimeout(() => {

        fitTextInWidth($targetField, className, $targetField.width());

    }, 2);
}

function fitTextInWidth($targetField, className, width) {
    setTimeout(() => {
        $targetField.css('font-size', '');
        //$targetField.css('line-height','');

        var $elem = $('<span></span>');
        $elem.text($targetField.text())
        $elem.addClass(className);
        $elem.attr("style", "position: absolute;top: -999px;left: -999px;");
        $('body').append($elem);
        var strW = $elem.width();
        strW = strW * 1.1;
        $elem.remove();

        const boxW = parseInt(width);

        if (strW > boxW) {
            var s = parseFloat((boxW / strW).toFixed(4));

            var newFontSize = (s * parseInt($targetField.css('font-size'))).toString() + "px";
            $targetField.css('font-size', newFontSize);
            //$targetField.css('line-height', newFontSize);

        }
    }, 2);
}

function getColorDiff() {
    const diff = 0x252B3B - 0x191A1D;
    return diff;
}

function convertHex(hex, opacity) {
    if (hex === '')
        return hex;
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    let result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    return result;
}





document.addEventListener("click", function (e) {

    //toggleFullScreen();

}, false);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}


