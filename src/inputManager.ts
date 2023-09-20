export default class InputManager {
  _pressedInput: Array<String> = [];
  constructor() {
    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;

      if (!this._pressedInput.includes(e.code)) this._pressedInput.push(e.code);
    });

    window.addEventListener("keyup", (e) => {
      this._pressedInput = this._pressedInput.filter((item) => item !== e.code);
    });
  }

  getInputs() {
    return this._pressedInput;
  }
}
