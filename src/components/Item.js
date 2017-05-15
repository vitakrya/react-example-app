export default class Item {
  constructor(x, y, sign) {
    this.x = x;
    this.y = y;
    this.sign = sign;
    this.touched = this.x > 0 && this.y > 0;
  }

  isSet() {
    return this.x > -1 && this.y > -1 && this.sign !== '-';
  }

  setSign(sign) {
    this.sign = sign;
  }
}
