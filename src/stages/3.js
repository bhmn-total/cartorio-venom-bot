export const stageThree = {
    async exec({from, message = ''}) {
      const serventia = storage[from].serventia;
      const lastOption = storage[from].lastOption;
      console.log(serventia);
      console.log(message);
      console.log(lastOption);
    }
  }