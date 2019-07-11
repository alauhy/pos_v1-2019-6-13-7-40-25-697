'use strict';
const itemList = loadAllItems();
const promotion = loadPromotions();
let isValid = (barCode) => {
    return itemList.indexOf(barCode) !== -1;
}
let isPromotion = (barCode) => {
    return promotion[0].barcodes.indexOf(barCode) !== -1;

}
let getName = (barCode) => {
    for (var i in itemList) {
        if (itemList[i].barcode === barCode) {
            return itemList[i].name;
        }
    }

}
let getPrice = (barCode) => {

    for (var i in itemList) {
        if (itemList[i].barcode === barCode) {
            return itemList[i].price;
        }
    }

}
let getUnit = (barCode) => {
    for (var i in itemList) {
        if (itemList[i].barcode === barCode) {
            return itemList[i].unit;
        }
    }

}

let countGoodsAmount = (barCodes) => {
    let barCodes_arr = barCodes.reduce((res, cur) => {
        let arr = cur.split('-');
        if (arr.length == 1) {
            res[cur] = res[cur] ? ++res[cur] : 1;
        } else res[arr[0]] = res[arr[0]] ? res[arr[0]] + parseFloat(arr[1]) : parseFloat(arr[1]);
        return res;

    }, {})

    return barCodes_arr;
}

let getTotalPrice = (barCodes) => {
    let goodsAmount = countGoodsAmount(barCodes);

    let cnt = 0.0;
    let saved = 0.0;
    let totalPrice = [];
    for(let i in goodsAmount){
        let price = parseFloat(getPrice(i));
        if(isPromotion(i) && goodsAmount[i] >=3 ){
        cnt += price * (goodsAmount[i] - Math.floor(goodsAmount[i]/ 3));
            saved += Math.floor(goodsAmount[i]/ 3) * price;
        } else cnt += price * parseFloat(goodsAmount[i]);
    }
    totalPrice.push(cnt);
    totalPrice.push(saved);
    return totalPrice;
}
let printReceipt = (barCodes) => {
    let goodsAmount = countGoodsAmount(barCodes);
    let str = '***<没钱赚商店>收据***\n';
    let totalPrice = getTotalPrice(barCodes);
    for (let i in goodsAmount) {
        // let i = toi(goodsAmount[i].barCode);
        let price = getPrice(i);
        if (isPromotion(i) && goodsAmount[i] >= 3) {
            str += '名称：' + getName(i) + '，数量：' + goodsAmount[i] + getUnit(i) + '，单价：' + price.toFixed(2) + '(元)，小计：' +
                (price * (goodsAmount[i] - Math.floor(goodsAmount[i] / 3))).toFixed(2) + "(元)\n";
        } else {
            str += '名称：' + getName(i) + '，数量：' + goodsAmount[i] + getUnit(i) + '，单价：' + price.toFixed(2) + '(元)，小计：' +
                (price * goodsAmount[i]).toFixed(2) + "(元)\n";
        }

    }
    str += '----------------------\n';
    str += '总计：' + parseFloat(totalPrice[0]).toFixed(2) + '(元)\n';
    str += '节省：' + parseFloat(totalPrice[1]).toFixed(2) + '(元)\n';
    str += '**********************';
    console.log(str);
}