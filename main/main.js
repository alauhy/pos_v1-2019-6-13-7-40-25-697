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
let getFormatBarCodes = (barCode) => {
    if (barCode.indexOf('-') !== -1) {
        let arr = barCode.split('-');

        return arr[0];

    }
    return barCode;
}
let getGoodsAmount = (barCodes) => {
    let barCodes_arr = barCodes.filter(function (element, index, self) {
        if (self.indexOf(getFormatBarCodes(element)) === index || self.indexOf(getFormatBarCodes(element)) === -1) {
            return self;
        }
    });
    let goodsAmount = [];
    barCodes_arr.forEach(i => {
        let cnt = 0;
        barCodes.forEach(j => {
            if (j.indexOf('-') === -1 && j.indexOf(i) !== -1) {
                cnt++;
            } else if (j.indexOf('-') !== -1 && j.indexOf(i) !== -1) {
                let arr = j.split('-');
                cnt += parseFloat(arr[1]);
            }
        })
        goodsAmount.push({
            barCode: i,
            count: cnt
        })
    });

    return goodsAmount;
}

let getTotalPrice = (barCodes) => {
    let goodsAmount = getGoodsAmount(barCodes);

    let cnt = 0.0;
    let saved = 0.0;
    let totalPrice = [];
    for (let i in goodsAmount) {

        if (isPromotion(getFormatBarCodes(goodsAmount[i].barCode)) && goodsAmount[i].count >= 3) {
            cnt += parseFloat(getPrice(getFormatBarCodes(goodsAmount[i].barCode))) * (goodsAmount[i].count - Math.floor(goodsAmount[i].count / 3));
            saved += Math.floor(goodsAmount[i].count / 3) * parseFloat(getPrice(getFormatBarCodes(goodsAmount[i].barCode)));

        } else cnt += parseFloat(getPrice(getFormatBarCodes(goodsAmount[i].barCode))) * parseFloat(goodsAmount[i].count);
    }
    totalPrice.push(cnt);
    totalPrice.push(saved);
    console.log(totalPrice);
    return totalPrice;
}
let printReceipt = (barCodes) => {
    let goodsAmount = getGoodsAmount(barCodes);
    let str = '***<没钱赚商店>收据***\n';
    let totalPrice = getTotalPrice(barCodes);
    for (let i in goodsAmount) {
        if (isPromotion(getFormatBarCodes(goodsAmount[i].barCode)) && goodsAmount[i].count >= 3) {
            str += '名称：' + getName(getFormatBarCodes(goodsAmount[i].barCode)) + '，数量：' + goodsAmount[i].count + getUnit(getFormatBarCodes(goodsAmount[i].barCode)) + '，单价：' + getPrice(getFormatBarCodes(goodsAmount[i].barCode)).toFixed(2) + '(元)，小计：' +
            (getPrice(getFormatBarCodes(goodsAmount[i].barCode)) * (goodsAmount[i].count - Math.floor(goodsAmount[i].count / 3))).toFixed(2) + "(元)\n";
        } else {
            str += '名称：' + getName(getFormatBarCodes(goodsAmount[i].barCode)) + '，数量：' + goodsAmount[i].count + getUnit(getFormatBarCodes(goodsAmount[i].barCode)) + '，单价：' + getPrice(getFormatBarCodes(goodsAmount[i].barCode)).toFixed(2) + '(元)，小计：' +
                (getPrice(getFormatBarCodes(goodsAmount[i].barCode)) * goodsAmount[i].count).toFixed(2) + "(元)\n";
        }

    }
    str += '----------------------\n';
    str += '总计：' + parseFloat(totalPrice[0]).toFixed(2) + '(元)\n';
    str += '节省：' + parseFloat(totalPrice[1]).toFixed(2) + '(元)\n';
    str += '**********************';
    console.log(str);
}