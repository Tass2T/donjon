export default class InputManager {
  pressedInput: Array<String> = [];
  constructor() {
    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;

      if (!this.pressedInput.includes(e.code)) this.pressedInput.push(e.code);
    });

    window.addEventListener("keyup", (e) => {
      this.pressedInput = this.pressedInput.filter((item) => item !== e.code);
    });
  }

  getInputs() {
    return this.pressedInput;
  }
}
