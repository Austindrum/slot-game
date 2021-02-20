'use strict';

// 預設庫存金額
localStorage.setItem('slot-machine-for-fun-account', 100);
localStorage.setItem('slot-machine-for-fun-coin', 0);

$(function() {
    let yourCoin = localStorage.getItem('slot-machine-for-fun-account');
    $('#account').html(yourCoin);
    var completed; // 圖片定位完成
    const imgHeight = 1374;
    // 往下方向圖示
    const posArr = [
        0, //orange
        80, //cherry
        165, //banana
        237, //guava
        310, //bar
        378, //number 7
        454, //orange
        539, //cherry
        624, //banana
        696, //guava
        769, //bar
        837, //number 7
        913, //orange
        1000, //cherry
        1085, //banana
        1157, //guava
        1230, //bar
        1298 //number 7
    ];
    var slot1Position = 0;
    // 定義 win 數值
    let win = [];
    win[0] = win[454] = win[913] = 1;
    win[80] = win[539] = win[1000] = 2;
    win[165] = win[624] = win[1085] = 3;
    win[237] = win[696] = win[1157] = 4;
    win[310] = win[769] = win[1230] = 5;
    win[378] = win[837] = win[1298] = 6;

    // Slot 函式物件
    function Slot(el, max, step) {
        this.speed = 0; // 當前速度
        this.step = step; // 累加單位
        this.si = null; // setInterval 變數
        this.el = el; // Dom 物件
        this.maxSpeed = max; // 最高速度
        this.pos = null; // 結果圖示

        // spritely.js func
        $(el).pan({
            fps: 30, // 預設速度
            dir:'down'
        });

        // 預設暫停
        $(el).spStop();
    };

    // Slot 結果圖示
    Slot.prototype.finalPos = function() {
        const joinCoin = parseInt(localStorage.getItem('slot-machine-for-fun-coin'));
        let posMin = 2000000000,
            el = this.el,
            best,
            bgPos,
            pos,
            i,
            j,
            k;
        pos = $(el).css('background-position').split(' ')[1];
        pos = parseInt(pos, 10);
        // 單列提高至 1/3 機率
        const promotePercent = [2, 4, 6];
        // 遍歷 posArr，依投幣金額判斷中獎之機率
        for (i = 0; i < posArr.length; i++) {
            // 投幣金額小於 10， 機率 1/6 * 1/6
            if (joinCoin <= 10) {
                for (j = 0;;j++) {
                    // i 圖示加圖 height 之 position 位置
                    k = posArr[i] + (imgHeight * j);
                    // 若目標圖示位置大於目前 position
                    if (k > pos) {
                        // 依最小 position 誤差之 posMin 判斷是否為目標圖
                        if ((k - pos) < posMin) {
                            // 設定最小誤差
                            posMin = k - pos;
                            best = k;
                            // 儲存目標圖示 array number
                            this.pos = posArr[i];
                        }
                        break;
                    }
                };
            // 投幣金額大於等於 10 小於等於 20，機率 1/3 * 1/6
            } else if (joinCoin > 10 && joinCoin <= 20) {
                // 第一列得到結果後儲存至 slot1Position
                if (this.el === '#slot1') {
                    for (j = 0;;j++) {
                        k = posArr[i] + (imgHeight * j);
                        if (k > pos) {
                            if ((k - pos) < posMin) {
                                posMin = k - pos;
                                best = k;
                                this.pos = posArr[i];
                                slot1Position = i;
                            }
                            break;
                        }
                    };
                // 由 slot1Position 取得 slot1 結果後 slot2 相同之機率為 1/3
                } else if (this.el === '#slot2') {
                    let tempPostArr = slot1Position + promotePercent[Math.floor(Math.random() * Math.floor(3))];
                    switch (tempPostArr) {
                        case 18:
                            tempPostArr = 0;
                            break;
                        case 19:
                            tempPostArr = 1;
                            break;
                        case 20:
                            tempPostArr = 2;
                            break;
                        case 21:
                            tempPostArr = 3;
                            break;
                        case 22:
                            tempPostArr = 4;
                            break;
                        case 23:
                            tempPostArr = 5;
                            break;
                    }
                    best = posArr[tempPostArr];
                    this.pos = posArr[tempPostArr];
                // slot3 機率維持 1/6
                } else {
                    for (j = 0;;j++) {
                        k = posArr[i] + (imgHeight * j);
                        if (k > pos) {
                            if ((k - pos) < posMin) {
                                posMin = k - pos;
                                best = k;
                                this.pos = posArr[i];
                            }
                            break;
                        }
                    };
                }
            // 投幣金額大於 20 小於等於 40，機率 1/3 * 1/3
            } else if (joinCoin > 20 && joinCoin < 40) {
                if (this.el === '#slot1') {
                    for (j = 0;;j++) {
                        k = posArr[i] + (imgHeight * j);
                        if (k > pos) {
                            if ((k - pos) < posMin) {
                                posMin = k - pos;
                                best = k;
                                this.pos = posArr[i];
                                slot1Position = i;
                            }
                            break;
                        }
                    };
                // 由 slot1Position 取得 slot1 結果後 slot2 相同之機率為 1/3
                } else if (this.el === '#slot2' || this.el === '#slot3') {
                    let tempPostArr = slot1Position + promotePercent[Math.floor(Math.random() * Math.floor(3))];
                    switch (tempPostArr) {
                        case 18:
                            tempPostArr = 0;
                            break;
                        case 19:
                            tempPostArr = 1;
                            break;
                        case 20:
                            tempPostArr = 2;
                            break;
                        case 21:
                            tempPostArr = 3;
                            break;
                        case 22:
                            tempPostArr = 4;
                            break;
                        case 23:
                            tempPostArr = 5;
                            break;
                    }
                    best = posArr[tempPostArr];
                    this.pos = posArr[tempPostArr];
                } 
            // 投幣金額大於 40，整體機率為 1/3
            } else {
                // 第一列得到結果後儲存至 slot1Position
                if (this.el === '#slot1') {
                    for (j = 0;;j++) {
                        k = posArr[i] + (imgHeight * j);
                        if (k > pos) {
                            if ((k - pos) < posMin) {
                                posMin = k - pos;
                                best = k;
                                this.pos = posArr[i];
                                slot1Position = i;
                            }
                            break;
                        }
                    };
                // 取得 slot1Position 後 slot2 100% 相同
                } else if (this.el === '#slot2') {
                    best = posArr[slot1Position];
                    this.pos = posArr[slot1Position];
                // slot3 相同機率為 1/3
                } else {
                    let tempPostArr = slot1Position + promotePercent[Math.floor(Math.random() * Math.floor(3))];
                    switch (tempPostArr) {
                        case 18:
                            tempPostArr = 0;
                            break;
                        case 19:
                            tempPostArr = 1;
                            break;
                        case 20:
                            tempPostArr = 2;
                            break;
                        case 21:
                            tempPostArr = 3;
                            break;
                        case 22:
                            tempPostArr = 4;
                            break;
                        case 23:
                            tempPostArr = 5;
                            break;
                    }
                    best = posArr[tempPostArr];
                    this.pos = posArr[tempPostArr];
                }
            }
        };
        // best += imgHeight + 4;
        bgPos = `0px ${best + 4}px`;
        $(el).animate({
            backgroundPosition: `(${bgPos})`,
        }, {
            duration: 100,
            complete: function() {
                completed ++;
            }
        })
    };
    // Slot 啟動 func
    Slot.prototype.start = function() {
        const _this = this;
        $(_this.el).addClass('motion');
        // 啟動 Slot(預設速度 30fps)
        $(_this.el).spStart();
        _this.si = window.setInterval(()=>{
            //  速度不超過 maxSpeed 則累加 step 數值
            if (_this.speed < _this.maxSpeed) {
                _this.speed += _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
        }, 100)
    };
    // Slot 停止 func
    Slot.prototype.stop = function() {
        const _this = this;
        const limit = 30;
        clearInterval(_this.si);
        _this.si = window.setInterval(()=>{
            if (_this.speed > limit) {
                _this.speed -= _this.step;
                $(_this.el).spSpeed(_this.speed);   
            } else {
                $(_this.el).removeClass('motion');
                _this.finalPos();
                $(_this.el).spSpeed(0);
                $(_this.el).spStop();
                clearInterval(_this.si);
                _this.speed = 0;
            }
        }, 100);
    };
    // Slot 重製 func
    Slot.prototype.reset = function() {
        const el_id = $(this.el).attr('id');
        $._spritely.instances[el_id].t = 0;
        $(this.el).css('background-position', '0 4px');
        this.speed = 0;
        completed = 0;
        slot1Position = 0;
        localStorage.setItem('slot-machine-for-fun-coin', 0)
        $('#amount').html('0');
        $('#result').html('');
        $('#paid').attr('disabled', false);
    };
    // 顯示按鍵 
    function enableControl() {
        $('#control').attr('disabled', false);
    };
    // disable 按鍵
    function disableControl() {
        $('#control').attr('disabled', true);
        $('#paid').attr('disabled', true);
    };
    // 印出結果
    function printResult() {
        let res,
            amount = parseInt(localStorage.getItem('slot-machine-for-fun-coin')),
            account = parseInt(localStorage.getItem('slot-machine-for-fun-account'));
        if (win[a.pos] === win[b.pos] && win[a.pos] === win[c.pos]) {
            if (win[a.pos] === 6) {
                res = '恭喜您，獲得 5 倍彩金';
                account += (amount * 5);
            } else {
                res = '恭喜您，獲得 2 倍彩金';
                account += (amount * 2);
            }
        } else {
            res = '很可惜，再試一次嗎?';
            account -= amount;
        }
        localStorage.setItem('slot-machine-for-fun-account', account);
        $('#account').html(localStorage.getItem('slot-machine-for-fun-account'));
        $('#result').html(res);
    };
    // 建立 Slot 物件
    const a = new Slot('#slot1', 30, 1),
          b = new Slot('#slot2', 45, 2),
          c = new Slot('#slot3', 70, 3);
    
    // 開始 Event
    $('#control').click(function(){
        const coin = JSON.parse(localStorage.getItem('slot-machine-for-fun-coin'));
        if (coin > 0) {
            var x = null;
            if (this.innerHTML === '開始') {
                a.start();
                b.start();
                c.start();
                this.innerHTML = '停止';
                disableControl();
                x = window.setInterval(()=>{
                    if (a.speed >= a.maxSpeed && b.speed >= b.maxSpeed && c.speed >= c.maxSpeed) {
                        enableControl();
                        window.clearInterval(x);
                    }
                }, 100);
            } else if (this.innerHTML === '停止') {
                a.stop();
                b.stop();
                c.stop();
                this.innerHTML = '重新開始';
                disableControl();
                x = window.setInterval(function() {
                    if(a.speed === 0 && b.speed === 0 && c.speed === 0) {
                        enableControl();
                        window.clearInterval(x);
                        printResult();
                    }
                }, 100);
            } else {
                a.reset();
                b.reset();
                c.reset();
                this.innerHTML = '開始';
            }
        } else {
            alert("請先投幣!");
        }
    });

    // 投幣 Event
    $('#paid').click(function() {
        const amount = parseInt($('input[type="number"]')[0].value, 10);
        const yourCoin = localStorage.getItem('slot-machine-for-fun-account');
        if (!amount || amount < 0) {
            alert('請投入正確金額');
        } else if (amount > yourCoin) {
            alert('金額不足');
        } else if (parseInt(localStorage.getItem('slot-machine-for-fun-coin')) > 0) {
            const newAmount = parseInt(localStorage.getItem('slot-machine-for-fun-coin')) + amount;
            localStorage.setItem('slot-machine-for-fun-coin', newAmount);
            $('#amount').html(localStorage.getItem('slot-machine-for-fun-coin'));
            $('input[type="number"]')[0].value = 0;
        } else {
            $('input[type="number"]')[0].value = 0;
            localStorage.setItem('slot-machine-for-fun-coin', amount);
            $('#amount').html(amount);
        }
    })
});