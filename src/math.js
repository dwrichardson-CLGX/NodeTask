const calcTip = (price, tip = 25) => ((tip/100) * price)  + price;

const fahrenheitToCelsius = (temp) => ((temp - 32 ) / 8);
const celsiusToFahrenheit = (temp) => ((temp * 1.8) + 32);

const add = (a,b) => {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            if(a < 0 || b < 0){
                return reject('Numbers must be greater than 0');
            }
            resolve (a + b);
        }, 2000)
    })
}
module.exports = {
    calcTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
}
