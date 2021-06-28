const {add, calcTip, fahrenheitToCelsius, celsiusToFahrenheit } = require('../src/math')

test('Should calculate total with tip',() => {
  const total = calcTip(10, 30);
  expect(total).toBe(13);
});

test('Should calculate total with default tip', () => {
    const total = calcTip(10);
    expect(total).toBe(12.5);
});

test('Should convert 32F to 0 C', () => {
    const temperature = fahrenheitToCelsius(32);
    expect(temperature).toBe(0);
})

test('Should convert 0 C to 32 F', () => {
    const temperature = celsiusToFahrenheit(0);
    expect(temperature).toBe(32);
})

test('Async test demo', (done) => {
    setTimeout(()=>{
        expect(1).toBe(1);
        done();
    }, 2000);
})

test('Should add 2 numbers', (done)=>{
    const total = add(2,4).then(
        (sum)=>{
        expect(sum).toBe(6);
        done();
    });
})

test('Should add two numbers async/await', async() => {
  const sum =  await add(2,6);
  expect(sum).toBe(8);

})
